import React from 'react';
import { CheckCircle, XCircle } from 'lucide-react';

interface ComparisonItemProps {
  title: string;
  traditional: string;
  withTalentLink: string;
  isPositive: boolean;
}

const ComparisonItem: React.FC<ComparisonItemProps> = ({ title, traditional, withTalentLink, isPositive }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 py-4 border-b border-gray-200">
      <div className="font-medium">{title}</div>
      <div className="flex items-center gap-2">
        <XCircle size={20} className="text-red-500 flex-shrink-0" />
        <span className="text-gray-600">{traditional}</span>
      </div>
      <div className="flex items-center gap-2">
        <CheckCircle size={20} className={isPositive ? "text-green-500 flex-shrink-0" : "text-red-500 flex-shrink-0"} />
        <span className="text-gray-800 font-medium">{withTalentLink}</span>
      </div>
    </div>
  );
};

const diferencial: React.FC = () => {
  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4 md:px-6">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">A Diferença TalentLink</h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Veja como nosso sistema transforma o recrutamento em comparação aos métodos tradicionais.
          </p>
        </div>
        
        <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-xl overflow-hidden">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-gray-50 p-4 font-bold">
            <div>Aspectos</div>
            <div className="text-gray-600">Sem TalentLink</div>
            <div className="text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-purple-600">Com TalentLink</div>
          </div>
          
          <div className="p-4">
            <ComparisonItem 
              title="Organização de Currículos" 
              traditional="Currículos desorganizados em diferentes formatos" 
              withTalentLink="Currículos padronizados e facilmente comparáveis" 
              isPositive={true}
            />
            
            <ComparisonItem 
              title="Processo de Triagem" 
              traditional="Manual e demorado" 
              withTalentLink="Automatizado e rápido" 
              isPositive={true}
            />
            
            <ComparisonItem 
              title="Análise de Dados" 
              traditional="Limitada ou inexistente" 
              withTalentLink="Relatórios detalhados e em tempo real" 
              isPositive={true}
            />
            
            <ComparisonItem 
              title="Feedback aos Candidatos" 
              traditional="Esporádico e não estruturado" 
              withTalentLink="Consistente e personalizado" 
              isPositive={true}
            />
            
            <ComparisonItem 
              title="Tempo de Contratação" 
              traditional="Semanas ou meses" 
              withTalentLink="Dias ou semanas" 
              isPositive={true}
            />
          </div>
        </div>
        
        {/* <div className="mt-16 text-center max-w-3xl mx-auto">
          <div className="bg-gradient-to-r from-pink-50 to-purple-50 p-8 rounded-2xl border border-purple-100">
            <h3 className="text-2xl font-bold mb-4">Resultados Comprovados</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-y-6 gap-x-4 mt-8">
              <div>
                <div className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-purple-600">70%</div>
                <p className="text-gray-600">Redução no tempo de triagem</p>
              </div>
              <div>
                <div className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-purple-600">85%</div>
                <p className="text-gray-600">Aumento na satisfação dos candidatos</p>
              </div>
              <div>
                <div className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-purple-600">40%</div>
                <p className="text-gray-600">Melhoria na qualidade das contratações</p>
              </div>
            </div>
          </div>
        </div> */}
      </div>
    </section>
  );
};

export default diferencial;