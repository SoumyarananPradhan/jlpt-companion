import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../api';

const Dashboard = () => {
    const [decks, setDecks] = useState([]);
    const [stats, setStats] = useState({ total_studied: 0, due_cards: 0, mastered_cards: 0 });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Fetch both endpoints at the exact same time
        Promise.all([
            api.get('decks/'),
            api.get('stats/')
        ])
        .then(([decksResponse, statsResponse]) => {
            setDecks(decksResponse.data);
            setStats(statsResponse.data);
            setLoading(false);
        })
        .catch(error => {
            console.error("Error fetching dashboard data:", error);
            setLoading(false);
        });
    }, []);

    if (loading) {
        return (
            <div className="text-center mt-20 text-stone-500 font-serif tracking-widest animate-pulse">
                Loading...
            </div>
        );
    }

    return (
        <div className="pb-12">
            {/* --- Analytics Banner --- */}
            <div className="mb-12">
                <h2 className="text-3xl font-serif font-bold text-stone-800 mb-6 border-b-2 border-red-800 inline-block pb-1">
                    修行 (Training Progress)
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* Fuji Blue Stat Card */}
                    <div className="bg-white p-6 border-l-4 border-blue-600 shadow-sm flex items-center gap-5 relative overflow-hidden">
                        <div className="absolute -right-4 -bottom-4 opacity-10 text-7xl select-none">🗻</div>
                        <div className="z-10">
                            <p className="text-xs font-bold text-stone-400 uppercase tracking-widest mb-1">Cards Studied</p>
                            <h3 className="text-4xl font-serif text-stone-800">{stats.total_studied}</h3>
                        </div>
                    </div>

                    {/* Torii Red Stat Card */}
                    <div className="bg-white p-6 border-l-4 border-red-700 shadow-sm flex items-center gap-5 relative overflow-hidden">
                        <div className="absolute -right-4 -bottom-4 opacity-10 text-7xl select-none">⛩️</div>
                        <div className="z-10">
                            <p className="text-xs font-bold text-stone-400 uppercase tracking-widest mb-1">Due Today</p>
                            <h3 className="text-4xl font-serif text-stone-800">{stats.due_cards}</h3>
                        </div>
                    </div>

                    {/* Matcha Green Stat Card */}
                    <div className="bg-white p-6 border-l-4 border-emerald-600 shadow-sm flex items-center gap-5 relative overflow-hidden">
                        <div className="absolute -right-4 -bottom-4 opacity-10 text-7xl select-none">🍵</div>
                        <div className="z-10">
                            <p className="text-xs font-bold text-stone-400 uppercase tracking-widest mb-1">Mastered</p>
                            <h3 className="text-4xl font-serif text-stone-800">{stats.mastered_cards}</h3>
                        </div>
                    </div>
                </div>
            </div>

            {/* --- Deck Selection --- */}
            <h2 className="text-3xl font-serif font-bold text-stone-800 mb-6 border-b-2 border-stone-800 inline-block pb-1">
                単語帳 (Vocab Decks)
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {decks.map(deck => (
                    <div key={deck.id} className="bg-white border border-stone-200 p-6 shadow-sm hover:shadow-md transition-all group relative">
                        {/* A small decorative red stamp mimicking a Hanko (Japanese seal) */}
                        <div className="absolute top-4 right-4 border-2 border-red-700 text-red-700 text-[10px] font-bold px-2 py-1 rounded-sm opacity-80 transform rotate-12 select-none">
                            {deck.level}
                        </div>
                        
                        <h3 className="text-xl font-serif font-bold text-stone-800 mb-3 pr-10">{deck.name}</h3>
                        <p className="text-stone-500 text-sm mb-8 line-clamp-2">
                            {deck.description}
                        </p>
                        
                        <Link 
                            to={`/study/${deck.id}`} 
                            className="block w-full text-center border border-stone-800 text-stone-800 font-medium py-2 hover:bg-stone-800 hover:text-[#FAF9F6] transition-colors"
                        >
                            Begin Session
                        </Link>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Dashboard;