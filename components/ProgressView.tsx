import React, { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { getQuizHistory } from '../services/historyService';
import { QuizHistory } from '../types';
import Loader from './Loader';

interface ProgressViewProps {
    onBack: () => void;
}

const ProgressView: React.FC<ProgressViewProps> = ({ onBack }) => {
    const [chartData, setChartData] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchHistory = async () => {
            try {
                const data = await getQuizHistory();
                const formattedData = data
                    .map(item => ({
                        date: new Date(item.created_at).toLocaleDateString(),
                        score: item.score,
                    }))
                    .reverse(); // Show oldest first
                setChartData(formattedData);
            } catch (err) {
                setError('Failed to load progress data.');
                console.error('Error fetching progress data:', (err as Error).message);
            } finally {
                setLoading(false);
            }
        };
        fetchHistory();
    }, []);

    if (loading) return <Loader text="Loading your progress report..." />;
    if (error) return <p className="text-center text-red-400">{error}</p>;

    return (
        <div className="max-w-4xl mx-auto">
            <button onClick={onBack} className="text-slate-400 hover:text-white transition-colors mb-4">&larr; Back to Dashboard</button>
            <div className="bg-black/30 backdrop-blur-xl border border-white/20 p-6 sm:p-8 rounded-lg shadow-lg">
                <h2 className="text-3xl font-bold text-slate-100 mb-6 border-b border-white/20 pb-4">Progress Report</h2>
                {chartData.length < 2 ? (
                     <p className="text-slate-400 text-center py-8">Complete at least two quizzes to see your progress chart.</p>
                ) : (
                    <div className="w-full h-80">
                       <ResponsiveContainer width="100%" height="100%">
                            <LineChart
                                data={chartData}
                                margin={{ top: 5, right: 30, left: 0, bottom: 5 }}
                            >
                                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255, 255, 255, 0.2)" />
                                <XAxis dataKey="date" stroke="#a1a1aa" />
                                <YAxis stroke="#a1a1aa" domain={[0, 100]} unit="%" />
                                <Tooltip
                                    contentStyle={{ 
                                        backgroundColor: 'rgba(0, 0, 0, 0.7)', 
                                        borderColor: 'rgba(255, 255, 255, 0.2)',
                                        backdropFilter: 'blur(5px)',
                                    }} 
                                    labelStyle={{ color: '#cbd5e1' }}
                                />
                                <Legend wrapperStyle={{ color: '#cbd5e1' }} />
                                <Line type="monotone" dataKey="score" stroke="#ffffff" strokeWidth={2} activeDot={{ r: 8 }} />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ProgressView;