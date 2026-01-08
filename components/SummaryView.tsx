import React from 'react';

interface SummaryViewProps {
    summary: string;
    onBack: () => void;
}

const SummaryView: React.FC<SummaryViewProps> = ({ summary, onBack }) => {
    return (
        <div className="max-w-3xl mx-auto">
            <button onClick={onBack} className="text-slate-400 hover:text-white transition-colors mb-4">&larr; Back to Dashboard</button>
            <div className="bg-black/30 backdrop-blur-xl border border-white/20 p-8 rounded-lg shadow-lg">
                <h2 className="text-3xl font-bold text-slate-100 mb-6 border-b border-white/20 pb-4">Content Summary</h2>
                <div className="prose prose-invert max-w-none text-slate-300">
                    {summary.split('\n').map((paragraph, index) => (
                        <p key={index}>{paragraph}</p>
                    ))}
                </div>
            </div>
        </div>
    );
}

export default SummaryView;