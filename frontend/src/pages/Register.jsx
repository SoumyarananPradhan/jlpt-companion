import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../api';

const Register = () => {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleRegister = async (e) => {
        e.preventDefault();
        setError('');

        if (password !== confirmPassword) {
            setError("Passwords do not match.");
            return;
        }

        setLoading(true);

        try {
            await api.post('register/', { username, email, password });
            navigate('/login');
        } catch (err) {
            console.error(err);
            const errorMsg = err.response?.data?.username?.[0] || 'Registration failed. Please try again.';
            setError(errorMsg);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-[80vh] py-10">
            <div className="bg-[#FAF9F6] p-10 border-4 border-stone-800 max-w-md w-full shadow-[8px_8px_0px_0px_rgba(28,25,23,1)] relative overflow-hidden">
                {/* Kanji Watermark */}
                <div className="absolute -top-4 -right-4 text-8xl text-stone-200 select-none pointer-events-none font-serif opacity-50">録</div>
                
                <div className="text-center relative z-10 mb-8">
                    <h2 className="text-3xl font-serif font-bold text-stone-900 border-b-2 border-red-800 inline-block pb-1">
                        登録 (Register)
                    </h2>
                    <p className="text-stone-500 text-sm mt-4 font-serif italic">Begin your journey to mastery.</p>
                </div>
                
                {error && (
                    <div className="border-l-4 border-red-800 bg-red-50 text-red-800 p-3 mb-6 text-sm font-bold tracking-wide">
                        {error}
                    </div>
                )}
                
                <form onSubmit={handleRegister} className="flex flex-col gap-4 relative z-10">
                    <div>
                        <label className="block text-xs font-bold tracking-widest text-stone-500 uppercase mb-1">Username</label>
                        <input 
                            type="text" value={username} onChange={(e) => setUsername(e.target.value)} 
                            className="w-full px-4 py-2 bg-white border-2 border-stone-300 focus:border-red-800 focus:outline-none transition-colors rounded-none font-serif" required 
                        />
                    </div>
                    <div>
                        <label className="block text-xs font-bold tracking-widest text-stone-500 uppercase mb-1">Email (Optional)</label>
                        <input 
                            type="email" value={email} onChange={(e) => setEmail(e.target.value)} 
                            className="w-full px-4 py-2 bg-white border-2 border-stone-300 focus:border-red-800 focus:outline-none transition-colors rounded-none font-serif" 
                        />
                    </div>
                    <div>
                        <label className="block text-xs font-bold tracking-widest text-stone-500 uppercase mb-1">Password</label>
                        <input 
                            type="password" value={password} onChange={(e) => setPassword(e.target.value)} 
                            className="w-full px-4 py-2 bg-white border-2 border-stone-300 focus:border-red-800 focus:outline-none transition-colors rounded-none font-serif" required minLength="8"
                        />
                    </div>
                    <div>
                        <label className="block text-xs font-bold tracking-widest text-stone-500 uppercase mb-1">Confirm Password</label>
                        <input 
                            type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} 
                            className="w-full px-4 py-2 bg-white border-2 border-stone-300 focus:border-red-800 focus:outline-none transition-colors rounded-none font-serif" required 
                        />
                    </div>
                    <button 
                        type="submit" disabled={loading}
                        className="w-full border-2 border-red-800 bg-red-800 text-[#FAF9F6] font-bold tracking-widest py-3 px-6 hover:bg-[#FAF9F6] hover:text-red-800 transition-colors mt-4 disabled:opacity-70 disabled:cursor-not-allowed"
                    >
                        {loading ? '処理中...' : 'SIGN UP'}
                    </button>
                </form>

                <div className="mt-8 text-center text-sm font-bold tracking-widest text-stone-500 uppercase relative z-10">
                    Already enrolled? <Link to="/login" className="text-red-800 border-b border-red-800 hover:text-stone-900 transition-colors pb-0.5">Log In</Link>
                </div>
            </div>
        </div>
    );
};

export default Register;