import React, { useState, useEffect } from 'react';
import { getQuizHistory } from '../services/historyService';
import { QuizHistory, QuizAttempt } from '../types';
import Loader from './Loader';

interface HistoryViewProps {
    onBack: () => void;
}

const HistoryView: React.FC<HistoryViewProps> = ({ onBack }) => {
    const [history, setHistory] = useState<QuizHistory[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [expandedItem, setExpandedItem] = useState<string | null>(null);

    useEffect(() => {
        const fetchHistory = async () => {
            try {
                const data = await getQuizHistory();
                setHistory(data);
            } catch (err) {
                setError('Failed to load quiz history.');
                console.error('Error fetching quiz history:', (err as Error).message);
            } finally {
                setLoading(false);
            }
        };
        fetchHistory();
    }, []);
    
    const toggleItem = (id: string) => {
        setExpandedItem(expandedItem === id ? null : id);
    }

    if (loading) return <Loader text="Loading your quiz history..." />;
    if (error) return <p className="text-center text-red-400">{error}</p>;

    return (
        <div className="max-w-4xl mx-auto">
            <button onClick={onBack} className="text-slate-400 hover:text-white transition-colors mb-4">&larr; Back to Dashboard</button>
            <div className="bg-black/30 backdrop-blur-xl border border-white/20 p-6 sm:p-8 rounded-lg shadow-lg">
                <h2 className="text-3xl font-bold text-slate-100 mb-6 border-b border-white/20 pb-4">Quiz History</h2>
                {history.length === 0 ? (
                     <p className="text-slate-400 text-center py-8">You haven't completed any quizzes yet.</p>
                ) : (
                    <div className="space-y-4">
                        {history.map((item) => (
                            <div key={item.id} className="bg-white/5 rounded-lg transition-all">
                               <button onClick={() => toggleItem(item.id)} className="w-full flex justify-between items-center p-4 text-left">
                                    <div>
                                        <p className="font-bold text-slate-200">Quiz Attempt</p>
                                        <p className="text-sm text-slate-400">{new Date(item.created_at).toLocaleString()}</p>
                                    </div>
                                    <div className="text-right flex items-center gap-4">
                                        <p className="font-semibold text-lg text-slate-200">{item.score}%</p>
                                        <span className={`transform transition-transform duration-200 inline-block ${expandedItem === item.id ? 'rotate-180' : ''}`}>▼</span>
                                    </div>
                                </button>
                                {expandedItem === item.id && (
                                    <div className="p-4 border-t border-white/10 space-y-4">
                                        {item.quiz_data.map((q: QuizAttempt, index: number) => (
                                            <div key={index} className="p-3 bg-black/20 rounded-md">
                                                <p className="font-semibold text-slate-200">{index + 1}. {q.question}</p>
                                                <p className={`mt-2 text-slate-300`}>
                                                    Your answer: {q.userAnswerIndex !== null ? q.options[q.userAnswerIndex] : 'Not answered'}
                                                </p>
                                                {q.userAnswerIndex !== q.answerIndex && <p className="text-slate-300">Correct answer: {q.options[q.answerIndex]}</p>}
                                                <p className="text-sm text-slate-400 mt-1 italic">Explanation: {q.explanation}</p>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default HistoryView;