import React from 'react';
import { useNavigate } from 'react-router-dom';

const HeaderCandidato: React.FC = () => {
  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const userPhotoUrl = user?.photoUrl || "https://via.placeholder.com/32";

  const handleLogout = () => {
    localStorage.removeItem("authToken");
    localStorage.removeItem("user");
    navigate("/loginCandidato");
  };

  return (
    <header className="flex justify-between items-center p-4 bg-gray-800 pl-10">
      <div className="flex items-center gap-2">
        <img src="/logo.png" alt="Logo" className="w-8 h-8" />
        <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-pink-500 to-purple-600">
          TalentLink
        </h1>
      </div>
      <nav className="flex gap-4 items-center">
        <a href="/dashboard" className="text-purple-300 hover:text-white">
          Oportunidades
        </a>
        <a href="/feedbacks" className="text-purple-300 hover:text-white">
          Feedbacks
        </a>
        <div className="flex items-center gap-3 pl-4">
          <img
            src={userPhotoUrl}
            alt="User"
            className="w-8 h-8 rounded-full"
          />
          <button
            onClick={handleLogout}
            className="text-purple-300 hover:text-white text-sm border border-purple-400 px-2 py-1 rounded"
          >
            Sair
          </button>
        </div>
      </nav>
    </header>
  );
};

export default HeaderCandidato;
