import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useNavigate } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import StudySession from './pages/StudySession';
import Login from './pages/Login';
import Register from './pages/Register';

const Navigation = () => {
  const navigate = useNavigate();
  const isLoggedIn = !!localStorage.getItem('access');

  const handleLogout = () => {
    localStorage.removeItem('access');
    localStorage.removeItem('refresh');
    navigate('/login');
  };

  return (
    // Minimalist nav with a subtle bottom border mimicking a stroke
    <nav className="bg-[#FAF9F6] border-b border-stone-200 px-6 py-5 mb-8">
      <div className="max-w-5xl mx-auto flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2 text-2xl font-serif font-bold text-red-800 tracking-wide">
          <span className="text-3xl">⛩️</span> JLPT Companion
        </Link>
        <div>
          {isLoggedIn ? (
            <button onClick={handleLogout} className="text-sm font-medium text-stone-500 hover:text-red-800 transition-colors">
              Logout
            </button>
          ) : (
            <div className="flex gap-4 items-center">
              <Link to="/register" className="text-sm font-medium text-stone-500 hover:text-red-800 transition-colors">
                Register
              </Link>
              <Link to="/login" className="text-sm font-medium border-2 border-red-800 text-red-800 px-5 py-1.5 rounded-none hover:bg-red-800 hover:text-white transition-all">
                Login
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

function App() {
  return (
    <Router>
      {/* Changed background to Washi Cream and default text to deep ink/stone */}
      <div className="min-h-screen bg-[#FAF9F6] text-stone-800 font-sans">
        <Navigation />

        <main className="max-w-5xl mx-auto px-6">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/study/:deckId" element={<StudySession />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;