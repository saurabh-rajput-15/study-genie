import React from 'react';
import { UserStats } from '../types';

interface DashboardProps {
    onSelectView: (view: string) => void;
    stats: UserStats;
    hasMaterials: boolean;
}

const StatCard: React.FC<{ label: string; value: string | number; icon: React.ReactNode }> = ({ label, value, icon }) => (
    <div className="bg-white/5 backdrop-blur-md border border-white/20 p-4 rounded-lg flex items-center gap-4">
        <div className="text-slate-200">{icon}</div>
        <div>
            <div className="text-2xl font-bold">{value}</div>
            <div className="text-sm text-slate-400">{label}</div>
        </div>
    </div>
);

const ViewCard: React.FC<{ title: string; description: string; icon: string; onClick: () => void, disabled?: boolean }> = ({ title, description, icon, onClick, disabled = false }) => (
    <button
        onClick={onClick}
        disabled={disabled}
        className="bg-white/5 backdrop-blur-md border border-white/20 rounded-xl p-6 text-left hover:bg-white/10 hover:ring-2 hover:ring-white/20 transition-all duration-300 disabled:opacity-50 disabled:hover:ring-0 disabled:cursor-not-allowed"
    >
        <div className="text-4xl mb-4">{icon}</div>
        <h3 className="text-xl font-bold text-slate-100">{title}</h3>
        <p className="text-slate-400 mt-1">{description}</p>
    </button>
);

const Dashboard: React.FC<DashboardProps> = ({ onSelectView, stats, hasMaterials }) => {
    return (
        <div className="space-y-8">
            {/* Quick Actions */}
            <div className="flex flex-wrap gap-4">
                <button
                    onClick={() => onSelectView('upload')}
                    className="flex items-center gap-2 bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-300 hover:scale-105 shadow-lg"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                    Upload New File
                </button>
                <button
                    onClick={() => onSelectView('profile')}
                    className="flex items-center gap-2 bg-white/10 hover:bg-white/20 border border-white/20 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-300"
                >
                    <span>👤</span>
                    View Profile
                </button>
            </div>

            <div>
                <h2 className="text-2xl font-bold mb-4 text-slate-200">Your Progress</h2>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <StatCard label="Experience Points" value={stats.total_xp} icon={<StarIcon />} />
                    <StatCard label="Current Level" value={stats.level} icon={<TrendingUpIcon />} />
                    <StatCard label="Quizzes Completed" value={stats.total_quizzes_completed} icon={<CheckCircleIcon />} />
                </div>
            </div>

            <div>
                <h2 className="text-2xl font-bold mb-4 text-slate-200">Study Tools</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <ViewCard title="Take Quiz" description="Test your knowledge with AI-generated questions." icon="🧠" onClick={() => onSelectView('quiz')} disabled={!hasMaterials} />
                    <ViewCard title="Review Flashcards" description="Memorize key concepts with smart flashcards." icon="🃏" onClick={() => onSelectView('flashcards')} disabled={!hasMaterials} />
                    <ViewCard title="Read Summary" description="Get a concise overview of the material." icon="📜" onClick={() => onSelectView('summary')} disabled={!hasMaterials}/>
                    <ViewCard title="Explore Mind Map" description="Visualize connections between topics." icon="🗺️" onClick={() => onSelectView('mindmap')} disabled={!hasMaterials}/>
                </div>
            </div>

            <div>
                <h2 className="text-2xl font-bold mb-4 text-slate-200">Analytics</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <ViewCard title="Quiz History" description="Review your past quiz attempts and answers." icon="📚" onClick={() => onSelectView('history')} />
                    <ViewCard title="Progress Report" description="Visualize your quiz performance over time." icon="📈" onClick={() => onSelectView('progress')} />
                </div>
            </div>
        </div>
    );
}

const StarIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.196-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.783-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
    </svg>
);

const TrendingUpIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
    </svg>
);

const CheckCircleIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
);

export default Dashboard;