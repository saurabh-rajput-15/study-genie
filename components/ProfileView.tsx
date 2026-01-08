import React, { useEffect, useState } from 'react';
import { UserStats } from '../types';
import { ACHIEVEMENTS } from '../constants';

interface ProfileViewProps {
    onBack: () => void;
    stats: UserStats;
    onUpdateName: (name: string) => void;
}

const ProfileView: React.FC<ProfileViewProps> = ({ onBack, stats, onUpdateName }) => {
    const xpForNextLevel = (stats.level) * 100;
    const xpProgress = stats.total_xp % 100;
    const progressPercent = (xpProgress / 100) * 100;

    const allAchievements = Object.values(ACHIEVEMENTS);
    const unlockedIds = new Set(stats.achieved_ids || []);

    const [name, setName] = useState(stats.display_name || 'StudyGenie User');
    const [savedMessage, setSavedMessage] = useState('');

    useEffect(() => {
        setName(stats.display_name || 'StudyGenie User');
    }, [stats.display_name]);

    const handleSave = (e: React.FormEvent) => {
        e.preventDefault();
        onUpdateName(name);
        setSavedMessage('Name updated');
        setTimeout(() => setSavedMessage(''), 2000);
    };

    return (
        <div className="max-w-4xl mx-auto">
            <button onClick={onBack} className="text-slate-400 hover:text-white transition-colors mb-4">&larr; Back to Dashboard</button>
            
            <div className="bg-black/30 backdrop-blur-xl border border-white/20 p-6 sm:p-8 rounded-2xl shadow-lg">
                {/* Profile Header */}
                <div className="flex flex-col sm:flex-row items-center gap-6 mb-8 pb-6 border-b border-white/10">
                    <div className="w-24 h-24 rounded-full bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center text-4xl shadow-lg shrink-0">
                        🧞
                    </div>
                    <div className="flex-1 w-full text-center sm:text-left">
                        <form onSubmit={handleSave} className="space-y-3">
                            <div className="flex flex-col sm:flex-row sm:items-center sm:gap-3">
                                <input
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    className="w-full sm:max-w-xs bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                                    placeholder="Your name"
                                />
                                <button
                                    type="submit"
                                    className="mt-3 sm:mt-0 inline-flex items-center gap-2 bg-purple-600 hover:bg-purple-500 text-white font-medium px-4 py-2 rounded-lg transition-colors"
                                >
                                    Save
                                </button>
                            </div>
                            <div className="flex items-center gap-4 text-sm text-slate-400">
                                <span className="text-xl font-semibold text-white">{stats.display_name || 'StudyGenie User'}</span>
                                {savedMessage && <span className="text-green-400">{savedMessage}</span>}
                            </div>
                            <p className="text-slate-400">Learning enthusiast</p>
                        </form>
                        <div className="flex items-center gap-4 mt-3">
                            <span className="px-3 py-1 bg-purple-500/20 text-purple-300 rounded-full text-sm font-medium">
                                Level {stats.level}
                            </span>
                            <span className="px-3 py-1 bg-blue-500/20 text-blue-300 rounded-full text-sm font-medium">
                                {stats.total_xp} XP
                            </span>
                        </div>
                    </div>
                </div>

                {/* Level Progress */}
                <div className="mb-8">
                    <div className="flex justify-between text-sm mb-2">
                        <span className="text-slate-400">Level {stats.level}</span>
                        <span className="text-slate-400">{xpProgress} / 100 XP to Level {stats.level + 1}</span>
                    </div>
                    <div className="h-3 bg-white/10 rounded-full overflow-hidden">
                        <div 
                            className="h-full bg-gradient-to-r from-purple-500 to-blue-500 rounded-full transition-all duration-500"
                            style={{ width: `${progressPercent}%` }}
                        />
                    </div>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
                    <div className="bg-white/5 border border-white/10 rounded-xl p-5 text-center">
                        <div className="text-3xl font-bold text-white">{stats.total_xp}</div>
                        <div className="text-slate-400 text-sm mt-1">Total XP Earned</div>
                    </div>
                    <div className="bg-white/5 border border-white/10 rounded-xl p-5 text-center">
                        <div className="text-3xl font-bold text-white">{stats.total_quizzes_completed}</div>
                        <div className="text-slate-400 text-sm mt-1">Quizzes Completed</div>
                    </div>
                    <div className="bg-white/5 border border-white/10 rounded-xl p-5 text-center">
                        <div className="text-3xl font-bold text-white">{stats.achieved_ids?.length || 0}</div>
                        <div className="text-slate-400 text-sm mt-1">Achievements Unlocked</div>
                    </div>
                </div>

                {/* Achievements Section */}
                <div>
                    <h2 className="text-xl font-bold text-white mb-4">Achievements</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {allAchievements.map((achievement) => {
                            const isUnlocked = unlockedIds.has(achievement.id);
                            return (
                                <div 
                                    key={achievement.id}
                                    className={`flex items-center gap-4 p-4 rounded-xl border transition-all ${
                                        isUnlocked 
                                            ? 'bg-white/10 border-white/20' 
                                            : 'bg-white/5 border-white/10 opacity-50'
                                    }`}
                                >
                                    <div className={`text-3xl ${isUnlocked ? '' : 'grayscale'}`}>
                                        {achievement.icon}
                                    </div>
                                    <div className="flex-1">
                                        <h3 className="font-semibold text-white">{achievement.name}</h3>
                                        <p className="text-slate-400 text-sm">{achievement.description}</p>
                                    </div>
                                    <div className={`px-2 py-1 rounded text-xs font-medium ${
                                        isUnlocked ? 'bg-green-500/20 text-green-400' : 'bg-slate-500/20 text-slate-400'
                                    }`}>
                                        {isUnlocked ? '✓ Unlocked' : `+${achievement.xp} XP`}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProfileView;
