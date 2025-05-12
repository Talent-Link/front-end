import React, { useState } from 'react';
import JobDetailsModal from '../../components/JobDetailsModal';
import { FaFilter } from 'react-icons/fa';
import feedbacks from './Feedbacks';

const Dashboard: React.FC = () => {
    const userPhotoUrl = "https://via.placeholder.com/32";

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedJob, setSelectedJob] = useState({
        title: '',
        description: '',
        requirements: ''
    });

    const [searchTerm, setSearchTerm] = useState('');
    const [isFilterMenuOpen, setIsFilterMenuOpen] = useState(false);
    const [selectedFilters, setSelectedFilters] = useState<string[]>([]);

    const openModal = (title: string, description: string, requirements: string) => {
        setSelectedJob({ title, description, requirements });
        setIsModalOpen(true);
    };

    const closeModal = () => setIsModalOpen(false);

    const toggleFilterMenu = () => setIsFilterMenuOpen(!isFilterMenuOpen);

    const toggleFilter = (filter: string) => {
        setSelectedFilters((prev) =>
            prev.includes(filter) ? prev.filter((f) => f !== filter) : [...prev, filter]
        );
    };

    return (
        <div className="min-h-screen flex flex-col bg-gray-900 text-white">
            <header className="flex justify-between items-center p-4 bg-gray-800">
                <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-gradient-to-r from-pink-500 to-purple-500 rounded-full" />
                    <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-pink-500 to-purple-600">TalentLink</h1>
                </div>
                <nav className="flex gap-4">
                    <a href="#" className="text-purple-300 hover:text-white">Oportunidades</a>
                    <a href="/feedbacks" className="text-purple-300 hover:text-white">Feedbacks</a>
                    <div className="flex items-center gap-2">
                        <img src={userPhotoUrl} alt="User" className="w-8 h-8 rounded-full" />
                        <button className="text-purple-300 hover:text-white">⟶</button>
                    </div>
                </nav>
            </header>

            <main className="p-8 flex-grow">
                <h2 className="text-2xl font-bold mb-2">Banco de Oportunidades</h2>

                <div className="relative mb-4">
                    <input 
                        type="text" 
                        placeholder="Pesquisar oportunidades..." 
                        value={searchTerm} 
                        onChange={(e) => setSearchTerm(e.target.value)} 
                        className="w-full p-2 rounded bg-gray-800 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500" 
                    />
                    <button 
                        onClick={toggleFilterMenu} 
                        className="absolute right-2 top-2 text-purple-400 hover:text-white"
                    >
                        <FaFilter size={20} />
                    </button>
                    {isFilterMenuOpen && (
                        <div className="absolute right-0 mt-2 w-48 bg-gray-800 rounded shadow-lg z-10">
                            <div className="p-2">
                                <label className="flex items-center gap-2">
                                    <input 
                                        type="checkbox" 
                                        checked={selectedFilters.includes('Remoto')} 
                                        onChange={() => toggleFilter('Remoto')} 
                                    />
                                    Remoto
                                </label>
                                <label className="flex items-center gap-2 mt-2">
                                    <input 
                                        type="checkbox" 
                                        checked={selectedFilters.includes('Híbrido')} 
                                        onChange={() => toggleFilter('Híbrido')} 
                                    />
                                    Híbrido
                                </label>
                                <label className="flex items-center gap-2 mt-2">
                                    <input 
                                        type="checkbox" 
                                        checked={selectedFilters.includes('Presencial')} 
                                        onChange={() => toggleFilter('Presencial')} 
                                    />
                                    Presencial
                                </label>
                            </div>
                        </div>
                    )}
                </div>

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
