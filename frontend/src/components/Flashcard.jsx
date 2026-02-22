import React, { useState } from 'react';

const Flashcard = ({ card, onReview }) => {
    const [isFlipped, setIsFlipped] = useState(false);

    const handleFlip = () => {
        if (!isFlipped) setIsFlipped(true);
    };

    const handleGrade = (e, quality) => {
        e.stopPropagation(); 
        setIsFlipped(false); 
        onReview(card.id, quality);
    };

    const playAudio = (e) => {
        e.stopPropagation();
        window.speechSynthesis.cancel(); 
        const utterance = new SpeechSynthesisUtterance(card.front_text);
        utterance.lang = 'ja-JP'; 
        utterance.rate = 0.85;    
        window.speechSynthesis.speak(utterance);
    };

    return (
        <div 
            className="relative flex flex-col items-center justify-center p-8 border-4 border-stone-800 w-full max-w-md min-h-[400px] bg-[#FAF9F6] text-center cursor-pointer transition-transform hover:-translate-y-1 shadow-[8px_8px_0px_0px_rgba(28,25,23,1)]"
            onClick={handleFlip}
        >
            {/* Inner decorative border mimicking traditional cards */}
            <div className="absolute inset-2 border border-red-800/30 pointer-events-none"></div>

            {!isFlipped ? (
                <div className="w-full h-full flex flex-col items-center justify-center">
                    <h2 className="text-7xl font-serif font-bold text-stone-900 tracking-widest">{card.front_text}</h2>
                    <p className="text-stone-400 mt-12 text-xs font-bold tracking-[0.2em] uppercase">Click to Reveal</p>
                </div>
            ) : (
                <div className="w-full h-full flex flex-col items-center justify-between animate-in fade-in duration-300 z-10">
                    <div className="flex-grow flex flex-col justify-center items-center w-full">
                        
                        <div className="flex items-center gap-3 mb-4 border-b border-stone-300 pb-2 px-6">
                            <p className="text-3xl font-serif text-stone-600">{card.reading}</p>
                            <button 
                                onClick={playAudio}
                                className="p-2 text-red-800 hover:bg-red-50 rounded-full transition-colors"
                                title="Listen to pronunciation"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 20 20" fill="currentColor">
                                  <path fillRule="evenodd" d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.707.707L4.586 13H2a1 1 0 01-1-1V8a1 1 0 011-1h2.586l3.707-3.707a1 1 0 011.09-.217zM14.657 2.929a1 1 0 011.414 0A9.972 9.972 0 0119 10a9.972 9.972 0 01-2.929 7.071 1 1 0 01-1.414-1.414A7.971 7.971 0 0017 10c0-2.21-.894-4.208-2.343-5.657a1 1 0 010-1.414zm-2.829 2.828a1 1 0 011.415 0A5.983 5.983 0 0115 10a5.984 5.984 0 01-1.757 4.243 1 1 0 01-1.415-1.415A3.984 3.984 0 0013 10a3.983 3.983 0 00-1.172-2.828 1 1 0 010-1.415z" clipRule="evenodd" />
                                </svg>
                            </button>
                        </div>
                        
                        <h2 className="text-3xl font-serif font-bold text-stone-900 mb-6">{card.meaning}</h2>
                        {card.example_sentence && (
                            <p className="text-sm font-serif italic text-stone-600 mt-2 px-4 leading-relaxed">
                                "{card.example_sentence}"
                            </p>
                        )}
                    </div>
                    
                    {/* Wafu Grading Buttons */}
                    <div className="flex gap-4 mt-8 w-full justify-center">
                        <button 
                            onClick={(e) => handleGrade(e, 1)} 
                            className="flex-1 py-2 border-2 border-rose-800 text-rose-800 font-bold tracking-wider hover:bg-rose-800 hover:text-white transition-colors"
                        >
                            困難 (Hard)
                        </button>
                        <button 
                            onClick={(e) => handleGrade(e, 3)} 
                            className="flex-1 py-2 border-2 border-amber-700 text-amber-700 font-bold tracking-wider hover:bg-amber-700 hover:text-white transition-colors"
                        >
                            普通 (Good)
                        </button>
                        <button 
                            onClick={(e) => handleGrade(e, 5)} 
                            className="flex-1 py-2 border-2 border-emerald-800 text-emerald-800 font-bold tracking-wider hover:bg-emerald-800 hover:text-white transition-colors"
                        >
                            簡単 (Easy)
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Flashcard;