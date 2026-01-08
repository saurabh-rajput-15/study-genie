import { QuizAttempt, QuizHistory } from '../types';

const QUIZ_HISTORY_KEY = 'studygenie_quiz_history';

/**
 * Saves a completed quiz attempt to localStorage.
 * @param userId The ID of the user (not used in localStorage mode but kept for API compatibility).
 * @param score The final score (percentage).
 * @param quizData An array of the questions, options, and user's answers.
 */
export const saveQuizAttempt = async (userId: string, score: number, quizData: QuizAttempt[]) => {
    try {
        const history = getStoredHistory();
        const newEntry: QuizHistory = {
            id: Date.now().toString(),
            created_at: new Date().toISOString(),
            score,
            quiz_data: quizData,
        };
        const updatedHistory = [newEntry, ...history].slice(0, 50); // Keep last 50
        localStorage.setItem(QUIZ_HISTORY_KEY, JSON.stringify(updatedHistory));
    } catch (error) {
        console.error('Error saving quiz history:', error);
    }
};

/**
 * Fetches the quiz history from localStorage.
 * @returns A promise that resolves to an array of quiz history items.
 */
export const getQuizHistory = async (): Promise<QuizHistory[]> => {
    return getStoredHistory();
};

// Helper to get stored history
const getStoredHistory = (): QuizHistory[] => {
    try {
        const stored = localStorage.getItem(QUIZ_HISTORY_KEY);
        return stored ? JSON.parse(stored) : [];
    } catch {
        return [];
    }
};