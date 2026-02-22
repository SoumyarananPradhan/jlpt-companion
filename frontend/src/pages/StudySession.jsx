import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api';
import Flashcard from '../components/Flashcard';

const StudySession = () => {
    const { deckId } = useParams();
    const navigate = useNavigate();
    
    const [cards, setCards] = useState([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        setLoading(true);
        setError(null);
        
        api.get(`study/${deckId}/`)
            .then(response => {
                setCards(response.data);
                setLoading(false);
            })
            .catch(err => {
                console.error("API Error:", err);
                setError(err.response?.data?.error || "Failed to fetch cards. Is the server running?");
                setLoading(false);
            });
    }, [deckId]);

    const handleReviewSubmit = async (cardId, quality) => {
        try {
            await api.post('review/', {
                card_id: cardId,
                quality: quality
            });
            setCurrentIndex(prevIndex => prevIndex + 1);
        } catch (error) {
            console.error("Error submitting review:", error);
            alert("There was an error saving your progress. Please try again.");
        }
    };

    if (error) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
                <div className="bg-[#FAF9F6] p-10 border-2 border-red-800 max-w-md w-full shadow-[8px_8px_0px_0px_rgba(153,27,27,1)]">
                    <h2 className="text-2xl font-serif font-bold text-red-800 mb-2">問題が発生しました</h2>
                    <p className="mb-8 text-stone-600">{error}</p>
                    <button 
                        onClick={() => navigate('/')} 
                        className="w-full bg-stone-800 hover:bg-stone-700 text-[#FAF9F6] font-medium py-3 px-6 transition-colors"
                    >
                        Return to Dashboard
                    </button>
                </div>
            </div>
        );
    }

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <div className="text-stone-500 font-serif tracking-widest animate-pulse">Preparing your session...</div>
            </div>
        );
    }
    
    if (cards.length === 0 || currentIndex >= cards.length) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
                <div className="bg-[#FAF9F6] p-12 border-4 border-stone-800 max-w-md w-full shadow-[8px_8px_0px_0px_rgba(28,25,23,1)] relative">
                    <div className="text-6xl mb-6">🌸</div>
                    <h2 className="text-3xl font-serif font-bold text-stone-900 mb-4">修行完了</h2>
                    <p className="text-stone-600 mb-8 font-serif">Training Complete. You've reviewed all your due cards for this deck today.</p>
                    <button 
                        onClick={() => navigate('/')} 
                        className="w-full border-2 border-stone-800 text-stone-900 font-bold py-3 px-6 hover:bg-stone-800 hover:text-[#FAF9F6] transition-colors"
                    >
                        Return to Dashboard
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="flex flex-col items-center justify-center min-h-[70vh]">
            <div className="w-full max-w-md mb-8 flex items-center justify-between">
                <button 
                    onClick={() => navigate('/')}
                    className="text-stone-400 hover:text-red-800 font-serif text-sm flex items-center gap-2 transition-colors"
                >
                    ← 戻る (Back)
                </button>
                <div className="text-sm font-serif font-bold text-stone-800 tracking-widest">
                    {currentIndex + 1} / {cards.length}
                </div>
            </div>
            
            <Flashcard 
                card={cards[currentIndex]} 
                onReview={handleReviewSubmit} 
            />
            
            {/* Ink Stroke Progress Bar */}
            <div className="w-full max-w-md mt-10 bg-stone-200 h-1 rounded-none overflow-hidden">
                <div 
                    className="bg-red-800 h-1 transition-all duration-300 ease-out" 
                    style={{ width: `${((currentIndex) / cards.length) * 100}%` }}
                ></div>
            </div>
        </div>
    );
};

export default StudySession;