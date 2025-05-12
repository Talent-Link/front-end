import React, { useState } from 'react';
import JobDetailsModal from '../../components/JobDetailsModal';

const Dashboard: React.FC = () => {
    const userPhotoUrl = "https://via.placeholder.com/32";

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedJob, setSelectedJob] = useState({
        title: '',
        description: '',
        requirements: ''
    });

    const openModal = (title: string, description: string, requirements: string) => {
        setSelectedJob({ title, description, requirements });
        setIsModalOpen(true);
    };

    const closeModal = () => setIsModalOpen(false);

    return (
        <div className="min-h-screen flex flex-col bg-gray-900 text-white">
            <header className="flex justify-between items-center p-4 bg-gray-800">
                <div className="flex items-center gap-2">
                    <h1 className="text-xl font-bold">TalentLink</h1>
                </div>
            </header>

            <main className="p-8 flex-grow">
                <h2 className="text-2xl font-bold mb-2">Banco de Oportunidades</h2>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    <div className="bg-gray-800 p-4 rounded-lg">
                        <h3 className="font-bold">Senior Frontend Developer</h3>
                        <p className="text-gray-400">TechCorp - Remoto</p>
                        <button className="text-purple-400 mt-2" onClick={() => openModal('Senior Frontend Developer', 'Desenvolvimento de interfaces modernas.', 'React, Typescript, CSS.')}>Visualizar Detalhes →</button>
                    </div>

                    <div className="bg-gray-800 p-4 rounded-lg">
                        <h3 className="font-bold">Backend Developer</h3>
                        <p className="text-gray-400">DataSystems - Híbrido</p>
                        <button className="text-purple-400 mt-2" onClick={() => openModal('Backend Developer', 'Desenvolvimento de APIs robustas.', 'Node.js, Express, MongoDB.')}>Visualizar Detalhes →</button>
                    </div>

                    <div className="bg-gray-800 p-4 rounded-lg">
                        <h3 className="font-bold">UX/UI Designer</h3>
                        <p className="text-gray-400">CreativeMinds - Presencial</p>
                        <button className="text-purple-400 mt-2" onClick={() => openModal('UX/UI Designer', 'Design de interfaces intuitivas.', 'Figma, Adobe XD.')}>Visualizar Detalhes →</button>
                    </div>
                </div>
            </main>

            <JobDetailsModal 
                isOpen={isModalOpen} 
                onClose={closeModal} 
                title={selectedJob.title} 
                description={selectedJob.description} 
                requirements={selectedJob.requirements} 
            />

            <footer className="p-4 bg-gray-800 text-center text-gray-500 mt-auto">© 2025 TalentLink. Todos os direitos reservados.</footer>
        </div>
    );
};

export default Dashboard;
