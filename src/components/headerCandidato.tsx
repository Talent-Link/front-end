import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const HeaderCandidato: React.FC = () => {
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const [userPhoto, setUserPhoto] = useState<string | null>(null);
  
  useEffect(() => {
    // Verificar se há foto do usuário no localStorage
    const userData = JSON.parse(localStorage.getItem("user") || "{}");
    console.log("📱 Header - User data from localStorage:", userData);
    console.log("📱 Header - Available photo fields:", {
      photoUrl: userData?.photoUrl,
      picture: userData?.picture,
      avatar: userData?.avatar,
      profilePicture: userData?.profilePicture,
      image: userData?.image
    });
    
    // Tentar várias possibilidades de campo de foto
    const possiblePhotoFields = [
      userData?.photoUrl,
      userData?.picture, 
      userData?.avatar,
      userData?.profilePicture,
      userData?.image,
      userData?.profile?.picture,
      userData?.profile?.photoUrl
    ];
    
    const foundPhoto = possiblePhotoFields.find(photo => photo && typeof photo === 'string');
    
    if (foundPhoto) {
      console.log("📱 Header - Foto encontrada:", foundPhoto);
      setUserPhoto(foundPhoto);
    } else {
      // Verificar se há foto salva separadamente
      const savedPhoto = localStorage.getItem("userPhoto");
      if (savedPhoto) {
        console.log("📱 Header - Foto salva separadamente:", savedPhoto);
        setUserPhoto(savedPhoto);
      } else {
        console.log("📱 Header - Nenhuma foto encontrada");
      }
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("authToken");
    localStorage.removeItem("user");
    localStorage.removeItem("userPhoto");
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
          <button
            onClick={() => navigate("/perfil")}
            className="focus:outline-none hover:scale-105 transition-transform"
            title="Editar perfil"
          >
            {userPhoto ? (
              <img 
                src={userPhoto} 
                alt="User" 
                className="w-8 h-8 rounded-full border-2 border-purple-400 hover:border-pink-400 transition-colors object-cover"
                onError={() => {
                  console.log("Erro ao carregar foto do usuário:", userPhoto);
                  setUserPhoto(null);
                }}
              />
            ) : (
              <div className="w-8 h-8 rounded-full border-2 border-purple-400 hover:border-pink-400 transition-colors bg-gray-600 flex items-center justify-center">
                <svg
                  className="w-4 h-4 text-gray-300"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                </svg>
              </div>
            )}
          </button>
          <button
            onClick={handleLogout}
            className="text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 px-3 py-1 rounded transition-colors font-semibold border border-pink-500 hover:border-pink-600 border-[1px]"
          >
            Sair
          </button>
        </div>
      </nav>
    </header>
  );
};

export default HeaderCandidato;
