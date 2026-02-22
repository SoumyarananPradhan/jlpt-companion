import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api';

const Login = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const response = await api.post('token/', {
                username: username,
                password: password
            });

            localStorage.setItem('access', response.data.access);
            localStorage.setItem('refresh', response.data.refresh);
            
            navigate('/');
        } catch (err) {
            console.error(err);
            setError('Invalid credentials. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-[75vh]">
            <div className="bg-[#FAF9F6] p-10 border-4 border-stone-800 max-w-md w-full shadow-[8px_8px_0px_0px_rgba(28,25,23,1)] relative overflow-hidden">
                {/* Kanji Watermark */}
                <div className="absolute -top-4 -right-4 text-8xl text-stone-200 select-none pointer-events-none font-serif opacity-50">入</div>
                
                <h2 className="text-3xl font-serif font-bold text-stone-900 mb-8 text-center relative z-10 border-b-2 border-red-800 inline-block pb-1 mx-auto flex justify-center">
                    ログイン (Login)
                </h2>
                
                {error && (
                    <div className="border-l-4 border-red-800 bg-red-50 text-red-800 p-3 mb-6 text-sm font-bold tracking-wide">
                        {error}
                    </div>
                )}
                
                <form onSubmit={handleLogin} className="flex flex-col gap-5 relative z-10">
                    <div>
                        <label className="block text-xs font-bold tracking-widest text-stone-500 uppercase mb-2">Username</label>
                        <input 
                            type="text" 
                            value={username} 
                            onChange={(e) => setUsername(e.target.value)} 
                            className="w-full px-4 py-3 bg-white border-2 border-stone-300 focus:border-red-800 focus:outline-none transition-colors rounded-none font-serif"
                            required 
                        />
                    </div>
                    <div>
                        <label className="block text-xs font-bold tracking-widest text-stone-500 uppercase mb-2">Password</label>
                        <input 
                            type="password" 
                            value={password} 
                            onChange={(e) => setPassword(e.target.value)} 
                            className="w-full px-4 py-3 bg-white border-2 border-stone-300 focus:border-red-800 focus:outline-none transition-colors rounded-none font-serif"
                            required 
                        />
                    </div>
                    <button 
                        type="submit" 
                        disabled={loading}
                        className="w-full border-2 border-stone-800 bg-stone-800 text-[#FAF9F6] font-bold tracking-widest py-3 px-6 hover:bg-[#FAF9F6] hover:text-stone-800 transition-colors mt-4 disabled:opacity-70 disabled:cursor-not-allowed"
                    >
                        {loading ? '認証中...' : 'ENTER'}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default Login;