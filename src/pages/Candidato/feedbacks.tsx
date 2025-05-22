import React, { useEffect, useState } from 'react';
import { MessageSquare } from 'lucide-react';
import Header from '../../components/headerCandidato';
import api from '../../services/api';

interface Feedback {
  id: string;
  title: string;
  message: string;
  status: 'approved' | 'rejected' | 'in-progress';
  score?: number;
  createdAt: string;
  response?: {
    opportunity?: {
      title?: string;
      company?: {
        name?: string;
      };
    };
  };
}

const Feedbacks: React.FC = () => {
  const [feedbacks, setFeedbacks] = useState<Feedback[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFeedbacks = async () => {
      try {
        const res = await api.get("/notifications/feedbacks");
        setFeedbacks(res.data.feedbacks);
      } catch (error) {
        console.error("Erro ao buscar feedbacks:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchFeedbacks();
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-gray-900 text-white">
      <Header />
      <div className="p-8">
        <header className="flex items-center mb-4">
          <div className="w-10 h-10 rounded-lg bg-gradient-to-r from-pink-500 to-purple-600 flex items-center justify-center mr-4">
            <MessageSquare className="text-white" size={20} />
          </div>
          <h1 className="text-2xl font-bold">Meus Feedbacks</h1>
        </header>

        {loading ? (
          <p className="text-gray-400">Carregando feedbacks...</p>
        ) : feedbacks.length === 0 ? (
          <p className="text-gray-400">Você ainda não possui feedbacks de candidaturas.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {feedbacks.map((fb) => (
              <div key={fb.id} className="bg-gray-800 rounded-lg p-4">
                <h3 className="font-bold">
                  {fb.response?.opportunity?.title || "Vaga desconhecida"}
                </h3>
                <p className="text-gray-400">
                  Empresa: {fb.response?.opportunity?.company?.name || "Desconhecida"}
                </p>
                <p className="text-gray-400">Status: {fb.status}</p>
                {fb.score !== undefined && (
                  <p className="text-gray-400">Pontuação: {fb.score}/100</p>
                )}
                {fb.message && (
                  <p className="text-gray-400 mt-2">{fb.message}</p>
                )}
                <p className="text-gray-500 text-sm mt-2">
                  {new Date(fb.createdAt).toLocaleDateString()}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Feedbacks;
