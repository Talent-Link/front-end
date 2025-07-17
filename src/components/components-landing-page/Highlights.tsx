import React from 'react';
import { FileText, Search, BarChart } from 'lucide-react';

interface HighlightProps {
  icon: React.ReactNode;
  title: string;
  description: string;
}

const HighlightCard: React.FC<HighlightProps> = ({ icon, title, description }) => {
  return (
    <div className="flex-1 p-8 bg-white rounded-2xl shadow-lg hover:shadow-xl transition-shadow border border-gray-100 transform hover:-translate-y-1 transition-transform duration-300">
      <div className="w-16 h-16 mb-6 flex items-center justify-center rounded-full bg-gradient-to-r from-pink-500/10 to-purple-600/10">
        <div className="text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-purple-600">
          {icon}
        </div>
      </div>
      <h3 className="text-xl font-bold mb-3">{title}</h3>
      <p className="text-gray-600">{description}</p>
    </div>
  );
};

const Highlights: React.FC = () => {
  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4 md:px-6">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-purple-600">Potencialize Seu Processo de Recrutamento</h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Elimine tarefas manuais e encontre os melhores talentos com nossa plataforma inteligente.
          </p>
        </div>
        
        <div className="flex flex-col md:flex-row gap-8">
          <HighlightCard 
            icon={<FileText size={36} />}
            title="📄 Currículos Gerados Automaticamente"
            description="Crie currículos padronizados em segundos, eliminando a necessidade de revisão manual e economizando tempo valioso da sua equipe."
          />
          
          <HighlightCard 
            icon={<Search size={36} />}
            title="🤖 Pontuação Inteligente de Candidatos"
            description="Algoritmos avançados identificam os melhores talentos com base em critérios personalizados, facilitando a seleção dos candidatos ideais."
          />
          
          <HighlightCard 
            icon={<BarChart size={36} />}
            title="📊 Relatórios Inteligentes"
            description="Visualize e analise dados do processo seletivo em tempo real, permitindo decisões baseadas em dados concretos e mensuráveis."
          />
        </div>
      </div>
    </section>
  );
};

export default Highlights;