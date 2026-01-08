import React from 'react';
import { Link } from 'react-router-dom';

const Header: React.FC = () => {
    return (
        <header className="relative">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <Link to="/" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
                        <img src="/logo.png" alt="StudyGenie" className="h-8" />
                        <h1 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-white to-slate-400 bg-clip-text text-transparent">
                            StudyGenie
                        </h1>
                    </Link>
                </div>

                <div className="flex items-center gap-3">
                    <Link 
                        to="/app/profile"
                        className="bg-white/10 hover:bg-white/20 border border-white/20 p-2 rounded-lg transition-colors"
                        title="Profile"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                    </Link>
                    <Link 
                        to="/"
                        className="bg-white/10 hover:bg-white/20 border border-white/20 text-white text-sm font-semibold py-2 px-4 rounded-lg transition-colors"
                    >
                        Home
                    </Link>
                </div>
            </div>
        </header>
    );
}

export default Header;