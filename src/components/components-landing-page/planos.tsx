import React from 'react';
import { CheckCircle } from 'lucide-react';

const planos: React.FC = () => {
  return (
    <section className="py-20 bg-gradient-to-r from-gray-900 to-purple-900 text-white">
      <div className="container mx-auto px-4 md:px-6">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Pronto para Transformar o Recrutamento da Sua Empresa?
          </h2>
          <p className="text-xl text-gray-300 mb-8">
            Junte-se a centenas de empresas que já otimizaram seu processo de recrutamento.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
            <div className="bg-white/10 backdrop-blur-sm p-6 rounded-xl">
              <h3 className="text-2xl font-bold mb-6">Plano Grátis</h3>
              <p className="text-3xl font-bold mb-6">
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-purple-500">R$ 0</span>
                <span className="text-gray-400 text-sm">/mês</span>
              </p>
              <ul className="space-y-3 text-left mb-8">
                <li className="flex items-center gap-2">
                  <CheckCircle size={18} className="text-pink-400 flex-shrink-0" />
                  <span>Até 5 vagas abertas</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle size={18} className="text-pink-400 flex-shrink-0" />
                  <span>Formulários básicos</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle size={18} className="text-pink-400 flex-shrink-0" />
                  <span>Relatórios mensais</span>
                </li>
              </ul>
              <button className="w-full px-6 py-3 rounded-full font-bold bg-white text-purple-700 hover:shadow-lg transform hover:-translate-y-1 transition-all duration-300">
                Começar Grátis
              </button>
            </div>
            
            <div className="bg-gradient-to-r from-pink-600/20 to-purple-600/20 backdrop-blur-sm p-6 rounded-xl relative overflow-hidden border border-purple-500/30">
              <div className="absolute top-3 right-3 bg-gradient-to-r from-pink-500 to-purple-600 text-white text-xs font-bold px-3 py-1 rounded-full">
                Recomendado
              </div>
              <h3 className="text-2xl font-bold mb-6">Plano Business</h3>
              <p className="text-3xl font-bold mb-6">
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-purple-500">R$ 200</span>
                <span className="text-gray-400 text-sm">/mês</span>
              </p>
              <ul className="space-y-3 text-left mb-8">
                <li className="flex items-center gap-2">
                  <CheckCircle size={18} className="text-pink-400 flex-shrink-0" />
                  <span>Vagas ilimitadas</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle size={18} className="text-pink-400 flex-shrink-0" />
                  <span>Formulários personalizados</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle size={18} className="text-pink-400 flex-shrink-0" />
                  <span>Relatórios em tempo real</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle size={18} className="text-pink-400 flex-shrink-0" />
                  <span>Suporte prioritário</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle size={18} className="text-pink-400 flex-shrink-0" />
                  <span>Integração com sistemas existentes</span>
                </li>
              </ul>
              <button className="w-full px-6 py-3 rounded-full font-bold bg-gradient-to-r from-pink-500 to-purple-600 text-white hover:shadow-lg transform hover:-translate-y-1 transition-all duration-300">
                Experimente o TalentLink Agora
              </button>
            </div>
          </div>
          
          <p className="text-gray-300">
            Não tem certeza de qual plano escolher? <a href="#" className="text-pink-300 underline hover:text-pink-200">Agende uma demonstração</a> com nossa equipe.
          </p>
        </div>
      </div>
    </section>
  );
};

export default planos;