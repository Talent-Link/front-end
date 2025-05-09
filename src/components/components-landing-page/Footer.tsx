import React from 'react';
import { PenTool, Mail, Phone, MapPin, Facebook, Twitter, Linkedin, Instagram } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="container mx-auto px-4 md:px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1 md:col-span-1">
            <div className="flex items-center mb-4">
              <PenTool className="h-8 w-8 mr-2 text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-purple-600" />
              <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-pink-500 to-purple-600">TalentLink</span>
            </div>
            <p className="mb-4 text-gray-400">
              Transformando o recrutamento para pequenas e médias empresas com tecnologia inteligente.
            </p>
            <div className="flex space-x-4">
             
              <a href="#" className="text-gray-400 hover:text-pink-400 transition-colors">
                <Linkedin size={20} />
              </a>
              <a href="#" className="text-gray-400 hover:text-pink-400 transition-colors">
                <Instagram size={20} />
              </a>
            </div>
          </div>
          
          <div>
            <h3 className="text-lg font-bold mb-4 text-white">Produto</h3>
            <ul className="space-y-2">
              <li><a href="#" className="hover:text-pink-400 transition-colors">Funcionalidades</a></li>
              <li><a href="#" className="hover:text-pink-400 transition-colors">Preços</a></li>
              <li><a href="#" className="hover:text-pink-400 transition-colors">Demonstração</a></li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-bold mb-4 text-white">Empresa</h3>
            <ul className="space-y-2">
              <li><a href="#" className="hover:text-pink-400 transition-colors">Sobre Nós</a></li>
              <li><a href="#" className="hover:text-pink-400 transition-colors">Blog</a></li>
              <li><a href="#" className="hover:text-pink-400 transition-colors">Contato</a></li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-bold mb-4 text-white">Contato</h3>
            <ul className="space-y-3">
              <li className="flex items-center gap-2">
                <Mail size={18} className="text-gray-400" />
                <span>talentlink1234@gmail.com</span>
              </li>
              <li className="flex items-center gap-2">
                <Phone size={18} className="text-gray-400" />
                <span>+55 (11) 4321-1234</span>
              </li>
           
            </ul>
          </div>
        </div>
        
        <div className="mt-12 pt-8 border-t border-gray-800 flex flex-col md:flex-row justify-between items-center">
          <p className="text-sm text-gray-500 mb-4 md:mb-0">
            &copy; {new Date().getFullYear()} TalentLink. Developed by: Filipi Dantas.
          </p>
          <div className="flex space-x-6">
            <a href="#" className="text-sm text-gray-500 hover:text-pink-400 transition-colors">Termos de Serviço</a>
            <a href="#" className="text-sm text-gray-500 hover:text-pink-400 transition-colors">Política de Privacidade</a>
            <a href="#" className="text-sm text-gray-500 hover:text-pink-400 transition-colors">Cookies</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;