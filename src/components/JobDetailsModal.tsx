import React from 'react';

interface JobDetailsModalProps {
    isOpen: boolean;
    onClose: () => void;
    title: string;
    description: string;
    requirements: string;
}

const JobDetailsModal: React.FC<JobDetailsModalProps> = ({ isOpen, onClose, title, description, requirements }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center">
            <div className="bg-gray-800 p-6 rounded-lg w-11/12 max-w-md text-white">
                <h2 className="text-2xl font-bold mb-2">{title}</h2>
                <p className="text-gray-400 mb-4">{description}</p>
                <h4 className="font-bold">Requisitos:</h4>
                <p className="text-gray-400 mb-4">{requirements}</p>
                <div className="flex justify-end gap-2">
                    <button className="bg-purple-500 hover:bg-purple-600 text-white px-4 py-2 rounded" onClick={() => alert('Candidatando-se...')}>Candidatar-se</button>
                    <button className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded" onClick={onClose}>Fechar</button>
                </div>
            </div>
        </div>
    );
};

export default JobDetailsModal;
