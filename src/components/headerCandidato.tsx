import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const HeaderCandidato: React.FC = () => {
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const userPhotoUrl = user?.photoUrl || "https://via.placeholder.com/32";

  const handleLogout = () => {
    localStorage.removeItem("authToken");
    localStorage.removeItem("user");
    navigate("/loginCandidato");
  };

  return (
    <header className="flex flex-col md:flex-row justify-between items-center p-4 bg-gray-800 pl-4 md:pl-10">
      <div className="flex items-center gap-2 w-full md:w-auto justify-between">
        <div className="flex items-center gap-2">
          <img src="/logo.png" alt="Logo" className="w-8 h-8" />
          <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-pink-500 to-purple-600">
            TalentLink
          </h1>
        </div>
        <button
          className="md:hidden text-purple-300 focus:outline-none"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Abrir menu"
        >
          <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d={menuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"}
            />
          </svg>
        </button>
      </div>
      <nav
        className={`flex-col md:flex-row flex gap-4 items-center w-full md:w-auto ${
          menuOpen ? "flex" : "hidden"
        } md:flex mt-4 md:mt-0`}
      >
        <a
          href="/dashboard"
          className="text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 px-4 py-2 rounded transition-colors font-semibold"
        >
          Oportunidades
        </a>
        <a
          href="/feedbacks"
          className="text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 px-4 py-2 rounded transition-colors font-semibold"
        >
          Feedbacks
        </a>
        <a
          href="/candidaturas"
          className="text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 px-4 py-2 rounded transition-colors font-semibold"
        >
          Candidaturas
        </a>
        <div className="flex items-center gap-3 pl-1">
          <img src={userPhotoUrl} alt="User" className="w-8 h-8 rounded-full" />
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
