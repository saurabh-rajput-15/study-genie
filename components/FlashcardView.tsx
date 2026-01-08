import React, { useState } from 'react';
import { Flashcard } from '../types';

interface FlashcardViewProps {
    flashcards: Flashcard[];
    onBack: () => void;
}

const FlashcardView: React.FC<FlashcardViewProps> = ({ flashcards, onBack }) => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isFlipped, setIsFlipped] = useState(false);

    const handleNext = () => {
        setIsFlipped(false);
        // A brief delay to allow the card to flip back before changing content
        setTimeout(() => {
            setCurrentIndex((prev) => (prev + 1) % flashcards.length);
        }, 300);
    };

    const handlePrev = () => {
        setIsFlipped(false);
        setTimeout(() => {
            setCurrentIndex((prev) => (prev - 1 + flashcards.length) % flashcards.length);
        }, 300);
    };

    const card = flashcards[currentIndex];

    return (
        <div className="max-w-2xl mx-auto flex flex-col items-center">
            <div className="w-full flex justify-between items-center mb-4">
                <button onClick={onBack} className="text-slate-400 hover:text-white transition-colors">&larr; Back to Dashboard</button>
                <p className="text-slate-400">{currentIndex + 1} / {flashcards.length}</p>
            </div>

            <div className="w-full h-64 sm:h-80 perspective-1000">
                <div
                    className={`relative w-full h-full transform-style-3d transition-transform duration-700 ${isFlipped ? 'rotate-y-180' : ''}`}
                    onClick={() => setIsFlipped(!isFlipped)}
                >
                    <div className="absolute w-full h-full backface-hidden flex items-center justify-center p-6 bg-white/5 backdrop-blur-lg border border-white/20 rounded-xl shadow-lg cursor-pointer">
                        <p className="text-2xl text-center text-slate-100">{card.front}</p>
                    </div>
                    <div className="absolute w-full h-full backface-hidden flex items-center justify-center p-6 bg-white/10 backdrop-blur-lg border border-white/30 rounded-xl shadow-lg cursor-pointer rotate-y-180">
                        <p className="text-xl text-center text-slate-100">{card.back}</p>
                    </div>
                </div>
            </div>

            <p className="text-slate-500 mt-4">Click card to flip</p>

            <div className="flex justify-center items-center gap-6 mt-6 w-full">
                <button onClick={handlePrev} className="bg-white/10 hover:bg-white/20 border border-white/20 text-white font-bold py-3 px-8 rounded-lg transition-colors">Previous</button>
                <button onClick={handleNext} className="bg-white hover:bg-slate-200 text-black font-bold py-3 px-8 rounded-lg transition-colors">Next</button>
            </div>
             <style>{`
                .perspective-1000 { perspective: 1000px; }
                .transform-style-3d { transform-style: preserve-3d; }
                .rotate-y-180 { transform: rotateY(180deg); }
                .backface-hidden { backface-visibility: hidden; -webkit-backface-visibility: hidden; }
            `}</style>
        </div>
    );
};

export default FlashcardView;