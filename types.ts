export enum AppState {
    UPLOAD = 'UPLOAD',
    PROCESSING = 'PROCESSING',
    GENERATING = 'GENERATING',
    DASHBOARD = 'DASHBOARD'
}

export interface QuizQuestion {
    question: string;
    options: string[];
    answerIndex: number;
    explanation: string;
}

export interface Flashcard {
    front: string;
    back: string;
}

export interface MindMapNode {
    topic: string;
    children?: MindMapNode[];
}

export interface MindMapData {
    root: MindMapNode;
}

export interface StudyMaterials {
    quiz: QuizQuestion[];
    flashcards: Flashcard[];
    summary: string;
    mindMap: MindMapData;
}

export interface UserStats {
    display_name: string;
    total_xp: number;
    level: number;
    total_quizzes_completed: number;
    achieved_ids: string[];
}

export interface Achievement {
    id: string;
    name: string;
    description: string;
    xp: number;
    icon: string;
}

export interface QuizAttempt extends QuizQuestion {
    userAnswerIndex: number | null;
}

export interface QuizHistory {
    id: string;
    created_at: string;
    score: number;
    quiz_data: QuizAttempt[];
}