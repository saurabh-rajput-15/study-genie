import { useState, useEffect, useCallback } from 'react';
import { UserStats, Achievement, QuizQuestion } from '../types';
import { ACHIEVEMENTS } from '../constants';
import { saveQuizAttempt } from '../services/historyService';

const STATS_KEY = 'studygenie_user_stats';

const initialStats: UserStats = {
    display_name: 'StudyGenie User',
    total_xp: 0,
    level: 1,
    total_quizzes_completed: 0,
    achieved_ids: [],
};

// Load stats from localStorage
const loadStats = (): UserStats => {
    try {
        const stored = localStorage.getItem(STATS_KEY);
        if (stored) {
            const parsed = JSON.parse(stored);
            return {
                ...initialStats,
                ...parsed,
                display_name: parsed.display_name || initialStats.display_name,
                level: Math.floor((parsed.total_xp || 0) / 100) + 1,
            };
        }
    } catch {}
    return initialStats;
};

// Save stats to localStorage
const saveStats = (stats: UserStats) => {
    try {
        localStorage.setItem(STATS_KEY, JSON.stringify(stats));
    } catch (e) {
        console.error('Failed to save stats:', e);
    }
};

export const useGamification = (_user?: unknown) => {
    const [userStats, setUserStats] = useState<UserStats>(initialStats);
    const [unlockedAchievements, setUnlockedAchievements] = useState<Achievement[]>([]);
    const [loading, setLoading] = useState(true);

    // Load from localStorage on mount (works without user/DB)
    useEffect(() => {
        const stats = loadStats();
        setUserStats(stats);
        setLoading(false);
    }, []);

    const awardXP = useCallback(async (activity: string, performance: { score?: number; quiz?: QuizQuestion[], answers?: (number | null)[] } = {}) => {
        const updatedStats = { ...userStats };
        let xpGained = 0;
        const newlyUnlocked: Achievement[] = [];
        const achievedIds = new Set(updatedStats.achieved_ids || []);

        if (activity === 'quiz_completed') {
            xpGained += 20; // Base XP
            updatedStats.total_quizzes_completed += 1;

            // Save quiz attempt to localStorage
            if (performance.score !== undefined && performance.quiz && performance.answers) {
                const quizData = performance.quiz.map((q, i) => ({
                    ...q,
                    userAnswerIndex: performance.answers![i],
                }));
                await saveQuizAttempt('local-user', performance.score, quizData);
            }


            if (performance.score && performance.score >= 90 && !achievedIds.has(ACHIEVEMENTS.HIGH_SCORER.id)) {
                xpGained += 15; // High score bonus
                newlyUnlocked.push(ACHIEVEMENTS.HIGH_SCORER);
                achievedIds.add(ACHIEVEMENTS.HIGH_SCORER.id);
            }
            if (updatedStats.total_quizzes_completed >= 1 && !achievedIds.has(ACHIEVEMENTS.FIRST_QUIZ.id)) {
                newlyUnlocked.push(ACHIEVEMENTS.FIRST_QUIZ);
                achievedIds.add(ACHIEVEMENTS.FIRST_QUIZ.id);
            }
            if (updatedStats.total_quizzes_completed >= 5 && !achievedIds.has(ACHIEVEMENTS.QUIZ_MASTER.id)) {
                newlyUnlocked.push(ACHIEVEMENTS.QUIZ_MASTER);
                achievedIds.add(ACHIEVEMENTS.QUIZ_MASTER.id);
            }
        }
        
        if (newlyUnlocked.length > 0) {
            const achievementXP = newlyUnlocked.reduce((sum, ach) => sum + ach.xp, 0);
            xpGained += achievementXP;
            setUnlockedAchievements(prev => [...prev, ...newlyUnlocked]);
        }

        updatedStats.total_xp += xpGained;
        updatedStats.level = Math.floor(updatedStats.total_xp / 100) + 1;
        updatedStats.achieved_ids = Array.from(achievedIds);
        
        setUserStats(updatedStats);
        
        // Persist to localStorage
        saveStats(updatedStats);

    }, [userStats]);

    const updateDisplayName = useCallback((name: string) => {
        const cleanName = name.trim() || initialStats.display_name;
        const updated = { ...userStats, display_name: cleanName };
        setUserStats(updated);
        saveStats(updated);
    }, [userStats]);

    const dismissAchievement = (id: string) => {
        setUnlockedAchievements(prev => prev.filter(a => a.id !== id));
    };

    return { userStats, awardXP, unlockedAchievements, dismissAchievement, updateDisplayName, loading };
};