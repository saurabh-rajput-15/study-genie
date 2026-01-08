
import { Achievement } from './types';

export const ACHIEVEMENTS: Record<string, Achievement> = {
  FIRST_QUIZ: { 
    id: 'first_quiz', 
    name: 'Getting Started',
    description: 'Complete your first quiz.',
    xp: 10, 
    icon: '🎯' 
  },
  QUIZ_MASTER: {
    id: 'quiz_master',
    name: 'Quiz Master',
    description: 'Complete 5 quizzes.',
    xp: 50,
    icon: '👑'
  },
  HIGH_SCORER: {
    id: 'high_scorer',
    name: 'High Scorer',
    description: 'Score 90% or higher on a quiz.',
    xp: 25,
    icon: '🏆'
  }
};
