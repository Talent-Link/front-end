import React from 'react';

const Hero: React.FC = () => {
  return (
    <section className="relative pt-24 md:pt-36 pb-20 bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex flex-col lg:flex-row items-center justify-between">
          <div className="w-full lg:w-1/2 mb-12 lg:mb-0">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-6">
              Revolucione o Recrutamento da Sua Empresa com o <span className="bg-clip-text text-transparent bg-gradient-to-r from-pink-500 to-purple-600">TalentLink</span>
            </h1>
            <p className="text-lg md:text-xl text-gray-600 mb-8 max-w-xl">
              Automatize a triagem de currículos, gere relatórios inteligentes e otimize o seu processo seletivo de forma rápida e eficiente.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <button className="px-8 py-4 rounded-full font-bold bg-gradient-to-r from-pink-500 to-purple-600 text-white shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300">
                Experimente o TalentLink Gratuitamente
              </button>
              <button className="px-8 py-4 rounded-full font-bold border-2 border-purple-300 text-purple-600 hover:bg-purple-50 transform hover:-translate-y-1 transition-all duration-300">
                Agende uma Demo
              </button>
            </div>
          </div>
          <div className="w-full lg:w-1/2 relative">
            <div className="relative z-10 rounded-xl shadow-2xl overflow-hidden">
              <img 
                src="https://images.pexels.com/photos/3184465/pexels-photo-3184465.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2" 
                alt="Equipe de recrutamento usando TalentLink" 
                className="w-full h-auto"
              />
            </div>
            {/* Decorative element */}
            <div className="absolute -top-10 -right-10 w-40 h-40 bg-gradient-to-r from-pink-400 to-purple-500 rounded-full opacity-20 filter blur-3xl"></div>
            <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-gradient-to-r from-purple-400 to-pink-500 rounded-full opacity-20 filter blur-3xl"></div>
          </div>
        </div>
      </div>
      
    
    </section>
  );
};

export default Hero;