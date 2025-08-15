import React from 'react';
import { User, Briefcase } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const ChoiceScreen: React.FC = () => {
    const navigate = useNavigate();

    const navigateToCandidate = () => {
        navigate('/loginCandidato');
    };

    const navigateToCompany = () => {
        navigate('/LoginRH');
    };

    return (
        <div className="min-h-screen flex flex-col justify-center items-center bg-gray-900 text-white p-4">
            <h1 className="text-3xl md:text-4xl font-bold mb-2 text-center">Bem-vindo ao TalentLink</h1>
            <p className="text-base md:text-lg mb-8 text-center">Escolha como deseja acessar:</p>

            <div className="flex flex-col md:flex-row gap-8">
                <div className="bg-gray-800 p-6 rounded-xl flex flex-col items-center text-center transition duration-300 hover:scale-105">
                    <User className="w-16 h-16 text-purple-500 mb-4" />
                    <h2 className="text-2xl font-semibold">Entrar como Candidato</h2>
                    <p className="text-gray-400 mt-2 mb-4">Encontre vagas e receba feedbacks sobre suas candidaturas.</p>
                    <button 
                        onClick={navigateToCandidate} 
                        className="bg-gradient-to-r from-pink-500 to-purple-600 px-4 py-2 rounded-md text-white font-bold hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-purple-500"
                    >
                        Acessar como Candidato
                    </button>
                </div>

                {/* <div className="bg-gray-800 p-6 rounded-xl flex flex-col items-center text-center transition duration-300 hover:scale-105">
                    <Briefcase className="w-16 h-16 text-purple-500 mb-4" />
                    <h2 className="text-2xl font-semibold">Entrar como Empresa</h2>
                    <p className="text-gray-400 mt-2 mb-4">Gerencie vagas e encontre os melhores talentos.</p>
                    <button 
                        onClick={navigateToCompany} 
                        className="bg-gradient-to-r from-pink-500 to-purple-600 px-4 py-2 rounded-md text-white font-bold hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-purple-500"
                    >
                        Acessar como Empresa
                    </button>
                </div> */}
            </div>
        </div>
    );
};

export default ChoiceScreen;
