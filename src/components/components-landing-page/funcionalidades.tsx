import React from 'react';
import { FileCheck, Users, BarChart3, FileText, Briefcase as BriefcaseBusiness, MessageSquare } from 'lucide-react';

interface FeatureProps {
  icon: React.ReactNode;
  title: string;
  description: string;
}

const Feature: React.FC<FeatureProps> = ({ icon, title, description }) => {
  return (
    <div className="flex gap-4">
      <div className="flex-shrink-0 mt-1">
        <div className="w-12 h-12 bg-gradient-to-r from-pink-500/10 to-purple-600/10 rounded-lg flex items-center justify-center">
          <div className="text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-purple-600">
            {icon}
          </div>
        </div>
      </div>
      <div>
        <h3 className="text-lg font-bold mb-2">{title}</h3>
        <p className="text-gray-600">{description}</p>
      </div>
    </div>
  );
};

const funcionalidades: React.FC = () => {
  return (
    <section id="features" className="py-20 bg-gray-50">
      <div className="container mx-auto px-4 md:px-6">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Tudo que Você Precisa em uma Única Plataforma</h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Conheça as funcionalidades que tornam o TalentLink a escolha ideal para pequenas e médias empresas.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-16 gap-y-12 max-w-5xl mx-auto">
          <div>
            <h3 className="text-2xl font-bold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-purple-600">Para Recrutadores</h3>
            
            <div className="space-y-8">
              <Feature 
                icon={<FileCheck size={24} />}
                title="Formulários Personalizados"
                description="Crie formulários adaptados às necessidades específicas de cada vaga e processo seletivo."
              />
              
              <Feature 
                icon={<Users size={24} />}
                title="Banco de Talentos"
                description="Mantenha um banco organizado de candidatos para consultas rápidas em futuras vagas."
              />
              
              <Feature 
                icon={<BarChart3 size={24} />}
                title="Relatórios Inteligentes"
                description="Visualize métricas e tendências que ajudam a otimizar seu processo seletivo."
              />
            </div>
          </div>
          
          <div>
            <h3 className="text-2xl font-bold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-purple-600">Para Candidatos</h3>
            
            <div className="space-y-8">
              <Feature 
                icon={<FileText size={24} />}
                title="Currículo Automático"
                description="Criação de currículos padronizados que destacam as competências mais relevantes."
              />
              
              <Feature 
                icon={<BriefcaseBusiness size={24} />}
                title="Vagas Disponíveis"
                description="Acesso simplificado a todas as vagas abertas, com filtros por área e requisitos."
              />
              
              <Feature 
                icon={<MessageSquare size={24} />}
                title="Feedback Estruturado"
                description="Receba feedbacks construtivos sobre seu desempenho no processo seletivo."
              />
            </div>
          </div>
        </div>
        
        <div className="mt-16 text-center">
          <button className="px-8 py-4 rounded-full font-bold bg-gradient-to-r from-pink-500 to-purple-600 text-white shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300">
            Explorar Todas as Funcionalidades
          </button>
        </div>
      </div>
    </section>
  );
};

export default funcionalidades;