// Exemplo de como usar o novo sistema de candidatura com feedback automático
import React, { useState } from 'react';
import { candidatureService, handleSubmitSuccess, handleSubmitError, type CandidatureSubmission } from '../services/candidatureService';

interface Props {
  opportunityId: string;
  questions: Array<{
    id: string;
    question: string;
    required: boolean;
  }>;
  onSuccess?: () => void;
}

const CandidatureForm: React.FC<Props> = ({ opportunityId, questions, onSuccess }) => {
  const [responses, setResponses] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);

  const handleInputChange = (questionId: string, value: string) => {
    setResponses(prev => ({
      ...prev,
      [questionId]: value
    }));
  };

  const validateForm = (): boolean => {
    const requiredQuestions = questions.filter(q => q.required);
    
    for (const question of requiredQuestions) {
      if (!responses[question.id]?.trim()) {
        alert(`Por favor, responda à pergunta: ${question.question}`);
        return false;
      }
    }
    
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setSubmitting(true);

    try {
      // Preparar dados da candidatura
      const candidatureData: CandidatureSubmission = {
        opportunityId,
        responses: questions.map(question => ({
          question: question.question,
          answer: responses[question.id] || ''
        }))
      };

      // Submeter candidatura
      const result = await candidatureService.submitCandidature(candidatureData);

      // Exibir feedback de sucesso
      handleSubmitSuccess(result, (message, type) => {
        // Aqui você pode integrar com sua biblioteca de notificações
        // Exemplo com react-hot-toast:
        // if (type === 'success') toast.success(message);
        // if (type === 'info') toast.info(message);
        // if (type === 'error') toast.error(message);
        
        // Por enquanto, usando alert como exemplo
        alert(`${type?.toUpperCase()}: ${message}`);
      });

      // Limpar formulário
      setResponses({});

      // Callback de sucesso personalizado
      if (onSuccess) {
        onSuccess();
      }

      // Opcional: redirecionar para página de candidaturas
      // window.location.href = '/dashboard/candidaturas';

    } catch (error) {
      handleSubmitError(error, (message, type) => {
        alert(`${type?.toUpperCase()}: ${message}`);
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">
        Candidatar-se para esta vaga
      </h2>

      <form onSubmit={handleSubmit} className="space-y-6">
        {questions.map((question) => (
          <div key={question.id} className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              {question.question}
              {question.required && <span className="text-red-500 ml-1">*</span>}
            </label>
            
            <textarea
              value={responses[question.id] || ''}
              onChange={(e) => handleInputChange(question.id, e.target.value)}
              placeholder="Digite sua resposta aqui..."
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-vertical"
              required={question.required}
            />
          </div>
        ))}

        <div className="flex justify-end space-x-4">
          <button
            type="button"
            onClick={() => setResponses({})}
            className="px-6 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors"
            disabled={submitting}
          >
            Limpar
          </button>
          
          <button
            type="submit"
            disabled={submitting}
            className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-blue-400 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
          >
            {submitting ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                Enviando...
              </>
            ) : (
              'Enviar Candidatura'
            )}
          </button>
        </div>
      </form>

      {/* Informações sobre o feedback */}
      <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
        <h3 className="text-sm font-medium text-blue-800 mb-2">
          📧 Feedback Automático
        </h3>
        <p className="text-sm text-blue-700">
          Após enviar sua candidatura, você receberá:
        </p>
        <ul className="text-sm text-blue-700 mt-1 ml-4 list-disc">
          <li>Um email de confirmação</li>
          <li>Uma notificação em tempo real no sistema</li>
          <li>Atualizações sobre o status da sua candidatura</li>
        </ul>
      </div>
    </div>
  );
};

export default CandidatureForm;

/*
  EXEMPLO DE USO:

  import CandidatureForm from './components/CandidatureForm.example';

  const questions = [
    {
      id: '1',
      question: 'Por que você quer trabalhar nesta empresa?',
      required: true
    },
    {
      id: '2', 
      question: 'Quais são suas principais qualificações para esta vaga?',
      required: true
    },
    {
      id: '3',
      question: 'Você tem experiência com as tecnologias mencionadas?',
      required: false
    }
  ];

  <CandidatureForm 
    opportunityId="123e4567-e89b-12d3-a456-426614174000"
    questions={questions}
    onSuccess={() => {
      console.log('Candidatura enviada com sucesso!');
      // Redirecionar ou atualizar estado
    }}
  />
*/
