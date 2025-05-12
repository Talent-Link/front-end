import React from 'react';

const headerCandidato: React.FC = () => {
    const userPhotoUrl = "https://via.placeholder.com/32";

    return (
        <header className="flex justify-between items-center p-4 bg-gray-800 pl-10">
            <div className="flex items-center gap-2">
                <img src="/logo.png" alt="Logo" className="w-8 h-8" />
                <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-pink-500 to-purple-600">TalentLink</h1>
            </div>
            <nav className="flex gap-4">
                <a href="/Dashboard" className="text-purple-300 hover:text-white">Oportunidades</a>
                <a href="/feedbacks" className="text-purple-300 hover:text-white">Feedbacks</a>
                <div className="flex items-center gap-2 pl-4">
                    <img src={userPhotoUrl} alt="User" className="w-8 h-8 rounded-full" />
                    <button className="text-purple-300 hover:text-white">⟶</button>
                </div>
            </nav>
        </header>
    );
};

export default headerCandidato;
