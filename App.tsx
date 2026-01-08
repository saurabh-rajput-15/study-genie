import React, { useState, useEffect, useCallback } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useNavigate, useLocation } from 'react-router-dom';
import { AppState, StudyMaterials } from './types';
import Header from './components/Header';
import FileUpload from './components/FileUpload';
import Dashboard from './components/Dashboard';
import QuizView from './components/QuizView';
import FlashcardView from './components/FlashcardView';
import SummaryView from './components/SummaryView';
import MindMapView from './components/MindMapView';
import HistoryView from './components/HistoryView';
import ProgressView from './components/ProgressView';
import ProfileView from './components/ProfileView';
import Loader from './components/Loader';
import LandingPage from './components/LandingPage';
import Sidebar, { UploadHistoryItem } from './components/Sidebar';
import { generateStudyMaterials } from './services/geminiService';
import { useGamification } from './hooks/useGamification';
import AchievementToast from './components/AchievementToast';
import DotBackground from './components/DotBackground';

const STORAGE_KEY = 'studygenie_upload_history';

// Helper to load history from localStorage
const loadUploadHistory = (): UploadHistoryItem[] => {
    try {
        const stored = localStorage.getItem(STORAGE_KEY);
        return stored ? JSON.parse(stored) : [];
    } catch {
        return [];
    }
};

// Helper to save history to localStorage
const saveUploadHistory = (history: UploadHistoryItem[]) => {
    try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(history));
    } catch (e) {
        console.error('Failed to save upload history:', e);
    }
};

// Layout component for app pages with header and sidebar
const AppLayout: React.FC<{ 
    children: React.ReactNode; 
    uploadHistory: UploadHistoryItem[];
    currentUploadId: string | null;
    onSelectUpload: (item: UploadHistoryItem) => void;
    onDeleteUpload: (id: string) => void;
    sidebarCollapsed: boolean;
    onToggleSidebar: () => void;
}> = ({ children, uploadHistory, currentUploadId, onSelectUpload, onDeleteUpload, sidebarCollapsed, onToggleSidebar }) => {
    return (
        <div className="min-h-screen font-sans flex flex-col">
            {/* Header - Always on top, never covered */}
            <div className="p-3 sm:p-6 lg:p-8 pb-0">
                <Header />
            </div>
            
            {/* Content area with sidebar */}
            <div className="flex-1 relative">
                {/* Sidebar - Only covers content area */}
                <Sidebar
                    uploadHistory={uploadHistory}
                    currentUploadId={currentUploadId}
                    onSelectUpload={onSelectUpload}
                    onDeleteUpload={onDeleteUpload}
                    isCollapsed={sidebarCollapsed}
                    onToggleCollapse={onToggleSidebar}
                />
                {/* Backdrop when sidebar is open */}
                {!sidebarCollapsed && (
                    <div 
                        className="fixed inset-0 top-20 bg-black/50 z-20 transition-opacity"
                        onClick={onToggleSidebar}
                    />
                )}
                {/* Main Content */}
                <div className="p-3 sm:p-6 lg:p-8 pt-4">
                    {/* Sidebar toggle button in content area */}
                    <button
                        onClick={onToggleSidebar}
                        className="mb-4 flex items-center gap-2 bg-white/10 hover:bg-white/20 border border-white/20 py-2 px-4 rounded-lg transition-colors text-white text-sm font-medium"
                    >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-5 w-5"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                        >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                        </svg>
                        {sidebarCollapsed ? 'Show Menu' : 'Hide Menu'}
                    </button>
                    <main className="max-w-7xl mx-auto">
                        {children}
                    </main>
                </div>
            </div>
        </div>
    );
};

// Main App Content with routing logic
const AppContent: React.FC = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [appState, setAppState] = useState<AppState>(AppState.UPLOAD);
    
    // Initialize state from local storage to persist data on reload
    const [uploadHistory, setUploadHistory] = useState<UploadHistoryItem[]>(loadUploadHistory);
    
    const [currentUploadId, setCurrentUploadId] = useState<string | null>(() => {
        return localStorage.getItem('studygenie_current_upload_id');
    });

    const [studyMaterials, setStudyMaterials] = useState<StudyMaterials | null>(() => {
        if (currentUploadId && uploadHistory.length > 0) {
            const item = uploadHistory.find(i => i.id === currentUploadId);
            return item ? item.materials : null;
        }
        return null;
    });

    const [error, setError] = useState<string | null>(null);
    const [sidebarCollapsed, setSidebarCollapsed] = useState(true);
    
    // Initialize filename securely
    const [currentFileName, setCurrentFileName] = useState<string>(() => {
        if (currentUploadId && uploadHistory.length > 0) {
            const item = uploadHistory.find(i => i.id === currentUploadId);
            return item ? item.title : '';
        }
        return '';
    });
    
    const { userStats, awardXP, unlockedAchievements, dismissAchievement, updateDisplayName, loading: statsLoading } = useGamification();

    // Persist current upload ID selection
    useEffect(() => {
        if (currentUploadId) {
            localStorage.setItem('studygenie_current_upload_id', currentUploadId);
        } else {
            localStorage.removeItem('studygenie_current_upload_id');
        }
    }, [currentUploadId]);
    
    // Restore study session if we have materials but appState is reset
    useEffect(() => {
        if (studyMaterials && location.pathname.includes('/app/dashboard') && appState === AppState.UPLOAD) {
            setAppState(AppState.DASHBOARD);
        }
    }, [studyMaterials, location.pathname, appState]);

    const handleFileProcessed = async (text: string, fileName?: string) => {
        setAppState(AppState.GENERATING);
        setError(null);
        setCurrentFileName(fileName || 'Untitled Document');
        try {
            const materials = await generateStudyMaterials(text);
            setStudyMaterials(materials);
            setAppState(AppState.DASHBOARD);
            
            // Save to history
            const newUpload: UploadHistoryItem = {
                id: Date.now().toString(),
                title: fileName || 'Untitled Document',
                timestamp: Date.now(),
                materials,
                fileType: fileName?.split('.').pop() || 'text',
            };
            
            const updatedHistory = [newUpload, ...uploadHistory].slice(0, 50); // Keep last 50
            setUploadHistory(updatedHistory);
            saveUploadHistory(updatedHistory);
            setCurrentUploadId(newUpload.id);
            
            navigate('/app/dashboard');
        } catch (err) {
            console.error(err);
            setError('Failed to generate study materials. Please try a different file.');
            setAppState(AppState.UPLOAD);
        }
    };

    const handleSelectUpload = useCallback((item: UploadHistoryItem) => {
        setStudyMaterials(item.materials);
        setCurrentUploadId(item.id);
        setCurrentFileName(item.title);
        setAppState(AppState.DASHBOARD);
        navigate('/app/dashboard');
    }, [navigate]);

    const handleDeleteUpload = useCallback((id: string) => {
        const updatedHistory = uploadHistory.filter(item => item.id !== id);
        setUploadHistory(updatedHistory);
        saveUploadHistory(updatedHistory);
        
        // If deleting current, clear materials
        if (id === currentUploadId) {
            setStudyMaterials(null);
            setCurrentUploadId(null);
            setAppState(AppState.UPLOAD);
            navigate('/app/upload');
        }
    }, [uploadHistory, currentUploadId, navigate]);

    const handleQuizComplete = (score: number, userAnswers: (number | null)[]) => {
        if (studyMaterials?.quiz) {
            awardXP('quiz_completed', { score, quiz: studyMaterials.quiz, answers: userAnswers });
        }
        navigate('/app/dashboard');
    };

    const handleSelectView = (view: string) => {
        navigate(`/app/${view}`);
    };

    const toggleSidebar = () => {
        setSidebarCollapsed(!sidebarCollapsed);
    };

    return (
        <>
            <DotBackground />
            <Routes>
                {/* Public Routes */}
                <Route path="/" element={<LandingPage onNavigateToSignIn={() => navigate('/app/upload')} />} />
                
                {/* App Routes */}
                <Route path="/app" element={<Navigate to="/app/upload" replace />} />
                
                <Route path="/app/upload" element={
                    <AppLayout 
                        uploadHistory={uploadHistory}
                        currentUploadId={currentUploadId}
                        onSelectUpload={handleSelectUpload}
                        onDeleteUpload={handleDeleteUpload}
                        sidebarCollapsed={sidebarCollapsed}
                        onToggleSidebar={toggleSidebar}
                    >
                        {error && (
                            <div className="bg-white/10 border border-white/20 text-slate-200 p-4 rounded-lg mb-6 text-center backdrop-blur-sm">
                                {error}
                            </div>
                        )}
                        {appState === AppState.PROCESSING && <Loader text="Processing file..." />}
                        {appState === AppState.GENERATING && <Loader text="Generating insights with Gemini AI..." />}
                        {(appState === AppState.UPLOAD) && (
                            <FileUpload onProcess={handleFileProcessed} setAppState={setAppState} setError={setError} />
                        )}
                    </AppLayout>
                } />
                
                <Route path="/app/dashboard" element={
                    <AppLayout 
                        uploadHistory={uploadHistory}
                        currentUploadId={currentUploadId}
                        onSelectUpload={handleSelectUpload}
                        onDeleteUpload={handleDeleteUpload}
                        sidebarCollapsed={sidebarCollapsed}
                        onToggleSidebar={toggleSidebar}
                    >
                        {statsLoading ? (
                            <Loader text="Loading your profile..." />
                        ) : (
                            <>
                                {currentFileName && studyMaterials && (
                                    <div className="mb-6 flex items-center gap-3">
                                        <span className="text-2xl">📄</span>
                                        <div>
                                            <h2 className="text-xl font-bold text-white">{currentFileName}</h2>
                                            <p className="text-slate-400 text-sm">Currently studying</p>
                                        </div>
                                    </div>
                                )}
                                <Dashboard onSelectView={handleSelectView} stats={userStats} hasMaterials={!!studyMaterials} />
                            </>
                        )}
                    </AppLayout>
                } />
                
                <Route path="/app/quiz" element={
                    <AppLayout 
                        uploadHistory={uploadHistory}
                        currentUploadId={currentUploadId}
                        onSelectUpload={handleSelectUpload}
                        onDeleteUpload={handleDeleteUpload}
                        sidebarCollapsed={sidebarCollapsed}
                        onToggleSidebar={toggleSidebar}
                    >
                        {studyMaterials?.quiz ? (
                            <QuizView 
                                quiz={studyMaterials.quiz} 
                                onComplete={handleQuizComplete} 
                                onBack={() => navigate('/app/dashboard')} 
                            />
                        ) : (
                            <div className="text-center py-12">
                                <p className="text-slate-400 mb-4">No quiz available. Please upload study materials first.</p>
                                <button 
                                    onClick={() => navigate('/app/upload')}
                                    className="bg-white hover:bg-slate-200 text-black font-bold py-3 px-6 rounded-lg transition-colors"
                                >
                                    Upload Materials
                                </button>
                            </div>
                        )}
                    </AppLayout>
                } />
                
                <Route path="/app/flashcards" element={
                    <AppLayout 
                        uploadHistory={uploadHistory}
                        currentUploadId={currentUploadId}
                        onSelectUpload={handleSelectUpload}
                        onDeleteUpload={handleDeleteUpload}
                        sidebarCollapsed={sidebarCollapsed}
                        onToggleSidebar={toggleSidebar}
                    >
                        {studyMaterials?.flashcards ? (
                            <FlashcardView 
                                flashcards={studyMaterials.flashcards} 
                                onBack={() => navigate('/app/dashboard')} 
                            />
                        ) : (
                            <div className="text-center py-12">
                                <p className="text-slate-400 mb-4">No flashcards available. Please upload study materials first.</p>
                                <button 
                                    onClick={() => navigate('/app/upload')}
                                    className="bg-white hover:bg-slate-200 text-black font-bold py-3 px-6 rounded-lg transition-colors"
                                >
                                    Upload Materials
                                </button>
                            </div>
                        )}
                    </AppLayout>
                } />
                
                <Route path="/app/summary" element={
                    <AppLayout 
                        uploadHistory={uploadHistory}
                        currentUploadId={currentUploadId}
                        onSelectUpload={handleSelectUpload}
                        onDeleteUpload={handleDeleteUpload}
                        sidebarCollapsed={sidebarCollapsed}
                        onToggleSidebar={toggleSidebar}
                    >
                        {studyMaterials?.summary ? (
                            <SummaryView 
                                summary={studyMaterials.summary} 
                                onBack={() => navigate('/app/dashboard')} 
                            />
                        ) : (
                            <div className="text-center py-12">
                                <p className="text-slate-400 mb-4">No summary available. Please upload study materials first.</p>
                                <button 
                                    onClick={() => navigate('/app/upload')}
                                    className="bg-white hover:bg-slate-200 text-black font-bold py-3 px-6 rounded-lg transition-colors"
                                >
                                    Upload Materials
                                </button>
                            </div>
                        )}
                    </AppLayout>
                } />
                
                <Route path="/app/mindmap" element={
                    <AppLayout 
                        uploadHistory={uploadHistory}
                        currentUploadId={currentUploadId}
                        onSelectUpload={handleSelectUpload}
                        onDeleteUpload={handleDeleteUpload}
                        sidebarCollapsed={sidebarCollapsed}
                        onToggleSidebar={toggleSidebar}
                    >
                        {studyMaterials?.mindMap ? (
                            <MindMapView 
                                mindMapData={studyMaterials.mindMap} 
                                onBack={() => navigate('/app/dashboard')} 
                            />
                        ) : (
                            <div className="text-center py-12">
                                <p className="text-slate-400 mb-4">No mind map available. Please upload study materials first.</p>
                                <button 
                                    onClick={() => navigate('/app/upload')}
                                    className="bg-white hover:bg-slate-200 text-black font-bold py-3 px-6 rounded-lg transition-colors"
                                >
                                    Upload Materials
                                </button>
                            </div>
                        )}
                    </AppLayout>
                } />
                
                <Route path="/app/history" element={
                    <AppLayout 
                        uploadHistory={uploadHistory}
                        currentUploadId={currentUploadId}
                        onSelectUpload={handleSelectUpload}
                        onDeleteUpload={handleDeleteUpload}
                        sidebarCollapsed={sidebarCollapsed}
                        onToggleSidebar={toggleSidebar}
                    >
                        <HistoryView onBack={() => navigate('/app/dashboard')} />
                    </AppLayout>
                } />
                
                <Route path="/app/progress" element={
                    <AppLayout 
                        uploadHistory={uploadHistory}
                        currentUploadId={currentUploadId}
                        onSelectUpload={handleSelectUpload}
                        onDeleteUpload={handleDeleteUpload}
                        sidebarCollapsed={sidebarCollapsed}
                        onToggleSidebar={toggleSidebar}
                    >
                        <ProgressView onBack={() => navigate('/app/dashboard')} />
                    </AppLayout>
                } />
                
                <Route path="/app/profile" element={
                    <AppLayout 
                        uploadHistory={uploadHistory}
                        currentUploadId={currentUploadId}
                        onSelectUpload={handleSelectUpload}
                        onDeleteUpload={handleDeleteUpload}
                        sidebarCollapsed={sidebarCollapsed}
                        onToggleSidebar={toggleSidebar}
                    >
                        <ProfileView onBack={() => navigate('/app/dashboard')} stats={userStats} onUpdateName={updateDisplayName} />
                    </AppLayout>
                } />
                
                {/* 404 - Redirect to home */}
                <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
            
            {/* Achievement Toasts */}
            <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-4 max-w-[calc(100vw-2rem)]">
                {unlockedAchievements.map((achievement) => (
                    <AchievementToast 
                        key={achievement.id} 
                        achievement={achievement} 
                        onDismiss={() => dismissAchievement(achievement.id)} 
                    />
                ))}
            </div>
        </>
    );
};

// Root App component with Router
const App: React.FC = () => {
    return (
        <BrowserRouter>
            <AppContent />
        </BrowserRouter>
    );
};

export default App;