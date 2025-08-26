import React from 'react';

const TelaInicial: React.FC = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <img 
          src="https://images.pexels.com/photos/3184465/pexels-photo-3184465.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2" 
          alt="Equipe de recrutamento usando TalentLink" 
          className="w-full h-full object-cover filter blur-sm scale-155"
        />
        {/* Dark overlay for better text readability */}
        <div className="absolute inset-0 bg-black bg-opacity-60"></div>
      </div>
      
      {/* Content */}
      <div className="relative z-10 text-center px-4 md:px-6 max-w-5xl mx-auto">
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-8 text-white drop-shadow-lg">
          Revolucione o Recrutamento da Sua Empresa com o <span className="bg-clip-text text-transparent bg-gradient-to-r from-pink-400 to-purple-400">TalentLink</span>
        </h1>
        <p className="text-lg md:text-xl lg:text-2xl text-white mb-12 drop-shadow-md max-w-4xl mx-auto leading-relaxed">
          Automatize a triagem de currículos, gere relatórios inteligentes e otimize o seu processo seletivo de forma rápida e eficiente.
        </p>
        <div className="flex justify-center">
          <button 
            className="px-8 py-4 rounded-full font-bold text-lg bg-gradient-to-r from-pink-500 to-purple-600 text-white shadow-2xl hover:shadow-xl transform hover:-translate-y-2 transition-all duration-300 hover:shadow-pink-500/25"
            onClick={() => window.location.href = '/choiceScreen'}
          >
            Experimente o TalentLink Gratuitamente
          </button>
        </div>
      </div>
    </section>
  );
};

export default TelaInicial;