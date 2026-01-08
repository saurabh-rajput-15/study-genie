import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { StudyMaterials } from '../types';

export interface UploadHistoryItem {
    id: string;
    title: string;
    timestamp: number;
    materials: StudyMaterials;
    fileType: string;
}

interface SidebarProps {
    uploadHistory: UploadHistoryItem[];
    currentUploadId: string | null;
    onSelectUpload: (item: UploadHistoryItem) => void;
    onDeleteUpload: (id: string) => void;
    isCollapsed: boolean;
    onToggleCollapse: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({
    uploadHistory,
    currentUploadId,
    onSelectUpload,
    onDeleteUpload,
    isCollapsed,
    onToggleCollapse,
}) => {
    const [hoveredId, setHoveredId] = useState<string | null>(null);
    const location = useLocation();

    const navItems = [
        { path: '/app/dashboard', label: 'Dashboard', icon: '🏠' },
        { path: '/app/upload', label: 'Upload File', icon: '📤' },
        { path: '/app/profile', label: 'Profile', icon: '👤' },
    ];

    const formatDate = (timestamp: number) => {
        const date = new Date(timestamp);
        const now = new Date();
        const diffMs = now.getTime() - date.getTime();
        const diffMins = Math.floor(diffMs / 60000);
        const diffHours = Math.floor(diffMs / 3600000);
        const diffDays = Math.floor(diffMs / 86400000);

        if (diffMins < 1) return 'Just now';
        if (diffMins < 60) return `${diffMins}m ago`;
        if (diffHours < 24) return `${diffHours}h ago`;
        if (diffDays < 7) return `${diffDays}d ago`;
        return date.toLocaleDateString();
    };

    const getFileIcon = (fileType: string) => {
        if (fileType.includes('pdf')) return '📄';
        if (fileType.includes('image')) return '🖼️';
        if (fileType.includes('text')) return '📝';
        return '📁';
    };

    return (
        <>
            {/* Sidebar */}
            <aside
                className={`fixed top-20 left-0 h-[calc(100%-5rem)] z-30 bg-black/80 backdrop-blur-xl border-r border-white/10 transition-all duration-300 ${
                    isCollapsed ? '-translate-x-full' : 'translate-x-0'
                } w-[85vw] sm:w-72 rounded-tr-2xl`}
            >
                <div className="flex flex-col h-full">
                    {/* Header with toggle */}
                    <div className="p-4 border-b border-white/10 flex items-center justify-between">
                        <div>
                            <h2 className="text-lg font-bold text-white flex items-center gap-2">
                                <span>📚</span>
                                Upload History
                            </h2>
                            <p className="text-slate-400 text-sm mt-1">
                                {uploadHistory.length} {uploadHistory.length === 1 ? 'document' : 'documents'}
                            </p>
                        </div>
                        <button
                            onClick={onToggleCollapse}
                            className="bg-white/10 hover:bg-white/20 p-2 rounded-lg transition-colors"
                            title="Hide Sidebar"
                        >
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-5 w-5 text-white"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                            >
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                            </svg>
                        </button>
                    </div>

                    {/* Navigation Links */}
                    <div className="px-2 py-3 border-b border-white/10">
                        {navItems.map((item) => (
                            <Link
                                key={item.path}
                                to={item.path}
                                onClick={onToggleCollapse}
                                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg mb-1 transition-all ${
                                    location.pathname === item.path
                                        ? 'bg-white/20 text-white'
                                        : 'text-slate-400 hover:bg-white/10 hover:text-white'
                                }`}
                            >
                                <span className="text-lg">{item.icon}</span>
                                <span className="font-medium text-sm">{item.label}</span>
                            </Link>
                        ))}
                    </div>

                    {/* History Header */}
                    <div className="px-4 py-3">
                        <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Recent Files</h3>
                    </div>

                    {/* History List */}
                    <div className="flex-1 overflow-y-auto px-2 space-y-2">
                        {uploadHistory.length === 0 ? (
                            <div className="text-center py-8 px-4">
                                <div className="text-4xl mb-3">📭</div>
                                <p className="text-slate-400 text-sm">No uploads yet</p>
                                <p className="text-slate-500 text-xs mt-1">
                                    Upload a document to get started
                                </p>
                            </div>
                        ) : (
                            uploadHistory.map((item) => (
                                <div
                                    key={item.id}
                                    onMouseEnter={() => setHoveredId(item.id)}
                                    onMouseLeave={() => setHoveredId(null)}
                                    onClick={() => onSelectUpload(item)}
                                    className={`relative p-3 rounded-xl cursor-pointer transition-all duration-200 group ${
                                        currentUploadId === item.id
                                            ? 'bg-white/20 border border-white/30'
                                            : 'bg-white/5 border border-transparent hover:bg-white/10 hover:border-white/20'
                                    }`}
                                >
                                    <div className="flex items-start gap-3">
                                        <span className="text-2xl">{getFileIcon(item.fileType)}</span>
                                        <div className="flex-1 min-w-0">
                                            <h3 className="font-medium text-white text-sm truncate pr-6">
                                                {item.title}
                                            </h3>
                                            <p className="text-slate-400 text-xs mt-1">
                                                {formatDate(item.timestamp)}
                                            </p>
                                            <div className="flex gap-2 mt-2">
                                                <span className="text-xs bg-purple-500/20 text-purple-300 px-2 py-0.5 rounded-full">
                                                    {item.materials.quiz.length} Q
                                                </span>
                                                <span className="text-xs bg-blue-500/20 text-blue-300 px-2 py-0.5 rounded-full">
                                                    {item.materials.flashcards.length} FC
                                                </span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Delete Button */}
                                    {hoveredId === item.id && (
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                onDeleteUpload(item.id);
                                            }}
                                            className="absolute top-2 right-2 p-1.5 rounded-lg bg-red-500/20 hover:bg-red-500/40 text-red-400 transition-colors"
                                            title="Delete"
                                        >
                                            <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                className="h-4 w-4"
                                                fill="none"
                                                viewBox="0 0 24 24"
                                                stroke="currentColor"
                                            >
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    strokeWidth={2}
                                                    d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                                                />
                                            </svg>
                                        </button>
                                    )}

                                    {/* Active Indicator */}
                                    {currentUploadId === item.id && (
                                        <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-white rounded-r-full" />
                                    )}
                                </div>
                            ))
                        )}
                    </div>

                    {/* Footer */}
                    {uploadHistory.length > 0 && (
                        <div className="p-4 border-t border-white/10">
                            <button
                                onClick={() => {
                                    if (confirm('Clear all upload history?')) {
                                        uploadHistory.forEach((item) => onDeleteUpload(item.id));
                                    }
                                }}
                                className="w-full text-sm text-slate-400 hover:text-red-400 transition-colors flex items-center justify-center gap-2"
                            >
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="h-4 w-4"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                                    />
                                </svg>
                                Clear History
                            </button>
                        </div>
                    )}
                </div>
            </aside>
        </>
    );
};

export default Sidebar;
