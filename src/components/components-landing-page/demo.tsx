import React, { useState } from 'react';
import { Play, PauseCircle } from 'lucide-react';

const demo: React.FC = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  
  return (
    <section id="demo" className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <img 
          src="https://images.pexels.com/photos/3184465/pexels-photo-3184465.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2" 
          alt="TalentLink Demo Background" 
          className="w-full h-full object-cover filter blur-sm scale-105"
        />
        {/* Dark overlay for better text readability */}
        <div className="absolute inset-0 bg-black bg-opacity-40"></div>
      </div>
      
      {/* Content */}
      <div className="relative z-10 text-center px-4 md:px-6 max-w-4xl mx-auto">
        <h2 className="text-4xl md:text-6xl font-bold mb-6 text-white drop-shadow-lg">
          Veja o TalentLink em Ação
        </h2>
        <p className="text-xl md:text-2xl text-white mb-12 drop-shadow-md max-w-3xl mx-auto leading-relaxed">
          Descubra como nossa plataforma simplifica cada etapa do processo de recrutamento e revoluciona a forma como você encontra talentos.
        </p>
        
        {/* Play Button */}
        <div className="mb-16">
          <button 
            onClick={() => setIsPlaying(!isPlaying)}
            className="w-24 h-24 md:w-32 md:h-32 rounded-full bg-gradient-to-r from-pink-500 to-purple-600 flex items-center justify-center shadow-2xl transform hover:scale-105 transition-all duration-300 hover:shadow-pink-500/25"
          >
            {isPlaying ? 
              <PauseCircle size={48} color="white" className="md:w-16 md:h-16" /> : 
              <Play size={48} color="white" fill="white" className="ml-2 md:w-16 md:h-16" />
            }
          </button>
        </div>
        
        {/* Feature Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
          <div className="bg-white/90 backdrop-blur-sm p-6 rounded-xl border border-white/20 shadow-lg">
            <h3 className="text-xl font-bold mb-3 text-purple-600">Para Recrutadores</h3>
            <p className="text-gray-700">Automatize a triagem de currículos e encontre os melhores talentos com facilidade.</p>
          </div>
          
          <div className="bg-white/90 backdrop-blur-sm p-6 rounded-xl border border-white/20 shadow-lg">
            <h3 className="text-xl font-bold mb-3 text-pink-500">Para Gerentes</h3>
            <p className="text-gray-700">Acompanhe o desempenho do processo seletivo com relatórios inteligentes em tempo real.</p>
          </div>
          
          <div className="bg-white/90 backdrop-blur-sm p-6 rounded-xl border border-white/20 shadow-lg">
            <h3 className="text-xl font-bold mb-3 text-purple-600">Para Candidatos</h3>
            <p className="text-gray-700">Proporcione uma experiência transparente e eficiente para atrair os melhores profissionais.</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default demo;