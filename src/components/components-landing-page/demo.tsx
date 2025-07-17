import React, { useState } from 'react';
import { Play, PauseCircle } from 'lucide-react';

const demo: React.FC = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  
  return (
    <section id="demo" className="py-20 bg-white">
      <div className="container mx-auto px-4 md:px-6">
        <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-purple-600">Veja o TalentLink em Ação</h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Descubra como nossa plataforma simplifica cada etapa do processo de recrutamento.
          </p>
        </div>
        
        <div className="max-w-5xl mx-auto">
          <div className="relative rounded-2xl overflow-hidden shadow-2xl">
            {/* Video Placeholder */}
            <div className="aspect-w-16 aspect-h-9 bg-gray-200 relative">
              <img 
                src="https://images.pexels.com/photos/3184465/pexels-photo-3184465.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2" 
                alt="TalentLink Demo" 
                className="w-full h-full object-cover"
              />
              {/* Play Button Overlay */}
              <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-30">
                <button 
                  onClick={() => setIsPlaying(!isPlaying)}
                  className="w-20 h-20 rounded-full bg-gradient-to-r from-pink-500 to-purple-600 flex items-center justify-center shadow-lg transform hover:scale-105 transition-transform"
                >
                  {isPlaying ? 
                    <PauseCircle size={40} color="white" /> : 
                    <Play size={40} color="white" fill="white" className="ml-2" />
                  }
                </button>
              </div>
            </div>
            
            {/* Video Controls */}
            <div className="bg-gray-900 p-4 flex items-center justify-between">
              <div className="text-white font-medium">TalentLink: Simplificando o Recrutamento</div>
              
            </div>
          </div>
          
          <div className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-gray-50 p-6 rounded-xl border border-gray-200">
              <h3 className="text-xl font-bold mb-3 text-purple-600">Para Recrutadores</h3>
              <p className="text-gray-600">Veja como automatizar a triagem de currículos e encontrar os melhores talentos com facilidade.</p>
            </div>
            
            <div className="bg-gray-50 p-6 rounded-xl border border-gray-200">
              <h3 className="text-xl font-bold mb-3 text-pink-500">Para Gerentes</h3>
              <p className="text-gray-600">Acompanhe o desempenho do processo seletivo com relatórios inteligentes e em tempo real.</p>
            </div>
            
            <div className="bg-gray-50 p-6 rounded-xl border border-gray-200">
              <h3 className="text-xl font-bold mb-3 text-purple-600">Para Candidatos</h3>
              <p className="text-gray-600">Proporcione uma experiência transparente e eficiente para atrair os melhores profissionais.</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default demo;