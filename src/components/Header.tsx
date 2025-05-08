import React, { useState, useEffect } from 'react';
import { Menu, X, PenTool } from 'lucide-react';

const Header: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header className={`fixed w-full z-50 transition-all duration-300 ${isScrolled ? 'bg-white shadow-md py-2' : 'bg-transparent py-4'}`}>
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex justify-between items-center">
          <div className="flex items-center">
            <div className="flex items-center">
              <PenTool className="h-8 w-8 mr-2 text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-purple-600" />
              <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-pink-500 to-purple-600">TalentLink</span>
            </div>
          </div>
          
          <div className="hidden md:flex items-center space-x-8">
            <a href="#features" className="font-medium text-gray-700 hover:text-purple-600 transition-colors">Caracteristicas</a>
            <a href="#testimonials" className="font-medium text-gray-700 hover:text-purple-600 transition-colors">Testemunhas</a>
            <a href="#demo" className="font-medium text-gray-700 hover:text-purple-600 transition-colors">Demonstração</a>
            <a href="#contact" className="font-medium text-gray-700 hover:text-purple-600 transition-colors">Contato</a>
            <button className="px-5 py-2 rounded-full font-medium bg-gradient-to-r from-pink-500 to-purple-600 text-white hover:shadow-lg transform hover:-translate-y-0.5 transition-all">
              Entrar
            </button>
          </div>
          
          <button className="md:hidden" onClick={() => setIsOpen(!isOpen)}>
            {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>
      
      {/* Mobile menu */}
      <div className={`md:hidden ${isOpen ? 'block' : 'hidden'} bg-white shadow-lg`}>
        <div className="px-4 py-5 space-y-5">
          <a href="#features" className="block font-medium text-gray-700 hover:text-purple-600">Caracteristicas</a>
          <a href="#testimonials" className="block font-medium text-gray-700 hover:text-purple-600">Testemunhas</a>
          <a href="#demo" className="block font-medium text-gray-700 hover:text-purple-600">Demonstração</a>
          <a href="#contact" className="block font-medium text-gray-700 hover:text-purple-600">Contatos</a>
          <button className="w-full px-5 py-2 rounded-full font-medium bg-gradient-to-r from-pink-500 to-purple-600 text-white">
            Entrar
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;