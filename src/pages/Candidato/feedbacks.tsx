import React from 'react';
import { MessageSquare } from 'lucide-react';
import Header from '../../components/headerCandidato';

interface Feedback {
    id: string;
    jobTitle: string;
    date: string;
    status: 'approved' | 'rejected' | 'in-progress';
    score?: number;
    comment?: string;
}

const mockFeedbacks: Feedback[] = [
    {
        id: '1',
        jobTitle: 'Frontend Developer',
        date: '2025-05-10',
        status: 'approved',
        score: 90,
        comment: 'Excelente desempenho na entrevista.'
    },
    {
        id: '2',
        jobTitle: 'Backend Developer',
        date: '2025-05-08',
        status: 'rejected',
        comment: 'Faltou experiência com Node.js.'
    },
    {
        id: '3',
        jobTitle: 'UX/UI Designer',
        date: '2025-05-05',
        status: 'in-progress'
    }
];

const feedbacks: React.FC = () => {
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

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {mockFeedbacks.length === 0 ? (
                        <p className="text-gray-400">Você ainda não possui feedbacks de candidaturas.</p>
                    ) : (
                        mockFeedbacks.map(feedback => (
                            <div key={feedback.id} className="bg-gray-800 rounded-lg p-4">
                                <h3 className="font-bold">{feedback.jobTitle}</h3>
                                <p className="text-gray-400">Status: {feedback.status}</p>
                                {feedback.score && <p className="text-gray-400">Pontuação: {feedback.score}/100</p>}
                                {feedback.comment && <p className="text-gray-400 mt-2">{feedback.comment}</p>}
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
};

export default feedbacks;
