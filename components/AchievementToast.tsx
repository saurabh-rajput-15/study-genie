import React, { useEffect, useState } from 'react';
import { Achievement } from '../types';

interface AchievementToastProps {
    achievement: Achievement;
    onDismiss: () => void;
}

const AchievementToast: React.FC<AchievementToastProps> = ({ achievement, onDismiss }) => {
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        setVisible(true);
        const timer = setTimeout(() => {
            handleDismiss();
        }, 5000);

        return () => clearTimeout(timer);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [achievement]);

    const handleDismiss = () => {
        setVisible(false);
        setTimeout(onDismiss, 300); // Wait for fade-out animation
    };

    return (
        <div
            className={`flex items-center gap-4 bg-black/50 backdrop-blur-lg border border-white/20 rounded-xl shadow-2xl p-4 transition-all duration-300 ease-in-out transform ${
                visible ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0'
            }`}
        >
            <div className="text-4xl">{achievement.icon}</div>
            <div>
                <p className="font-bold text-slate-100">Achievement Unlocked!</p>
                <p className="text-slate-200">{achievement.name}</p>
                <p className="text-sm text-slate-300 font-semibold">+{achievement.xp} XP</p>
            </div>
            <button onClick={handleDismiss} className="ml-4 text-slate-500 hover:text-white">&times;</button>
        </div>
    );
};

export default AchievementToast;