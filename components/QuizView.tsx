import React, { useState } from 'react';
import { QuizQuestion } from '../types';

interface QuizViewProps {
    quiz: QuizQuestion[];
    onComplete: (score: number, finalAnswers: (number | null)[]) => void;
    onBack: () => void;
}

const QuizView: React.FC<QuizViewProps> = ({ quiz, onComplete, onBack }) => {
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [selectedAnswers, setSelectedAnswers] = useState<(number | null)[]>(new Array(quiz.length).fill(null));
    const [isFinished, setIsFinished] = useState(false);
    const [isCurrentQuestionAnswered, setIsCurrentQuestionAnswered] = useState(false);

    const handleSelectOption = (optionIndex: number) => {
        if (isCurrentQuestionAnswered) return;
        const newAnswers = [...selectedAnswers];
        newAnswers[currentQuestionIndex] = optionIndex;
        setSelectedAnswers(newAnswers);
        setIsCurrentQuestionAnswered(true);
    };

    const handleNext = () => {
        if (currentQuestionIndex < quiz.length - 1) {
            setCurrentQuestionIndex(currentQuestionIndex + 1);
            setIsCurrentQuestionAnswered(false);
        } else {
            setIsFinished(true);
            const score = selectedAnswers.reduce((acc, answer, index) => {
                return answer === quiz[index].answerIndex ? acc + 1 : acc;
            }, 0);
            onComplete(Math.round((score / quiz.length) * 100), selectedAnswers);
        }
    };

    const isCorrectAnswer = (questionIndex: number) => {
        return selectedAnswers[questionIndex] === quiz[questionIndex].answerIndex;
    };
    
    if (isFinished) {
        const correctCount = selectedAnswers.reduce((acc, answer, index) => {
            return answer === quiz[index].answerIndex ? acc + 1 : acc;
        }, 0);
        const wrongCount = quiz.length - correctCount;
        const percentage = Math.round((correctCount / quiz.length) * 100);

        return (
            <div className="max-w-3xl mx-auto bg-black/30 backdrop-blur-xl border border-white/20 p-8 rounded-lg">
                <h2 className="text-3xl font-bold text-center text-slate-100">Quiz Completed!</h2>
                <div className="text-center my-6">
                    <p className="text-6xl font-bold text-white mb-2">
                        {percentage}%
                    </p>
                    <div className="flex justify-center gap-6 mt-4">
                        <div className="bg-green-500/20 border border-green-500/40 rounded-lg px-6 py-3">
                            <p className="text-2xl font-bold text-green-400">{correctCount}</p>
                            <p className="text-green-300 text-sm">Correct</p>
                        </div>
                        <div className="bg-red-500/20 border border-red-500/40 rounded-lg px-6 py-3">
                            <p className="text-2xl font-bold text-red-400">{wrongCount}</p>
                            <p className="text-red-300 text-sm">Wrong</p>
                        </div>
                    </div>
                    <p className="text-slate-400 mt-4">({correctCount} out of {quiz.length} correct)</p>
                </div>
                <div className="space-y-4 max-h-96 overflow-y-auto pr-2">
                    {quiz.map((q, index) => {
                        const isCorrect = isCorrectAnswer(index);
                        return (
                            <div 
                                key={index} 
                                className={`p-4 rounded-lg border-2 ${
                                    isCorrect 
                                        ? 'bg-green-500/10 border-green-500/40' 
                                        : 'bg-red-500/10 border-red-500/40'
                                }`}
                            >
                                <div className="flex items-start gap-3">
                                    <span className={`text-2xl ${isCorrect ? 'text-green-400' : 'text-red-400'}`}>
                                        {isCorrect ? '✓' : '✗'}
                                    </span>
                                    <div className="flex-1">
                                        <p className="font-semibold text-slate-200">{index + 1}. {q.question}</p>
                                        <p className={`mt-2 ${isCorrect ? 'text-green-300' : 'text-red-300'}`}>
                                            Your answer: {selectedAnswers[index] !== null ? q.options[selectedAnswers[index]!] : 'Not answered'}
                                        </p>
                                        {!isCorrect && (
                                            <p className="text-green-300 mt-1">
                                                ✓ Correct answer: {q.options[q.answerIndex]}
                                            </p>
                                        )}
                                        <p className="text-sm text-slate-400 mt-2 italic">💡 {q.explanation}</p>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
                <button onClick={onBack} className="w-full mt-8 bg-white hover:bg-slate-200 text-black font-bold py-3 px-4 rounded-lg transition-colors">
                    Back to Dashboard
                </button>
            </div>
        );
    }

    const currentQuestion = quiz[currentQuestionIndex];
    const selectedOptionIndex = selectedAnswers[currentQuestionIndex];
    const isCurrentCorrect = selectedOptionIndex === currentQuestion.answerIndex;

    return (
        <div className="max-w-3xl mx-auto bg-black/30 backdrop-blur-xl border border-white/20 p-6 sm:p-8 rounded-lg shadow-2xl">
            <div className="flex justify-between items-center mb-6">
                 <button onClick={onBack} className="text-slate-400 hover:text-white transition-colors">&larr; Back</button>
                <p className="text-slate-400 font-medium">Question {currentQuestionIndex + 1} of {quiz.length}</p>
            </div>
            
            <p className="text-xl sm:text-2xl font-semibold text-slate-100 mb-6">{currentQuestion.question}</p>
            
            <div className="space-y-4">
                {currentQuestion.options.map((option, index) => {
                     const isSelected = selectedOptionIndex === index;
                     const isCorrectOption = index === currentQuestion.answerIndex;
                     let buttonClass = 'w-full text-left p-4 rounded-lg border-2 transition-all duration-200';

                     if (isCurrentQuestionAnswered) {
                         if (isCorrectOption) {
                             // Always highlight correct answer in green
                             buttonClass += ' bg-green-500/20 border-green-500 text-green-100 ring-2 ring-green-500/30';
                         } else if (isSelected && !isCorrectOption) {
                             // Selected wrong answer in red
                             buttonClass += ' bg-red-500/20 border-red-500 text-red-100 ring-2 ring-red-500/30';
                         } else {
                            buttonClass += ' bg-transparent border-white/10 text-slate-500 opacity-50';
                         }
                     } else {
                         buttonClass += isSelected 
                            ? ' bg-white/20 border-white/40 text-white' 
                            : ' bg-white/10 border-white/20 hover:bg-white/15 hover:border-white/30 text-slate-200';
                     }
                     
                     return (
                        <button
                            key={index}
                            onClick={() => handleSelectOption(index)}
                            disabled={isCurrentQuestionAnswered}
                            className={buttonClass}
                        >
                            <span className="flex items-center gap-3">
                                <span className={`font-mono ${isCurrentQuestionAnswered && isCorrectOption ? 'text-green-300' : isCurrentQuestionAnswered && isSelected && !isCorrectOption ? 'text-red-300' : isSelected ? 'text-slate-100' : 'text-slate-400'}`}>
                                    {isCurrentQuestionAnswered && isCorrectOption ? '✓' : isCurrentQuestionAnswered && isSelected && !isCorrectOption ? '✗' : String.fromCharCode(65 + index)}
                                </span>
                                <span>{option}</span>
                            </span>
                        </button>
                     );
                })}
            </div>
            
            {isCurrentQuestionAnswered && (
                <div className="mt-6 p-4 bg-white/5 rounded-lg">
                    <h4 className="font-bold text-lg text-slate-200">Explanation</h4>
                    <p className="text-slate-300">{currentQuestion.explanation}</p>
                </div>
            )}

            <button
                onClick={handleNext}
                disabled={!isCurrentQuestionAnswered}
                className="w-full mt-8 bg-white hover:bg-slate-200 text-black font-bold py-3 px-4 rounded-lg transition-colors disabled:bg-white/20 disabled:text-slate-400 disabled:cursor-not-allowed"
            >
                {currentQuestionIndex < quiz.length - 1 ? 'Next Question' : 'Finish Quiz'}
            </button>
        </div>
    );
};

export default QuizView;