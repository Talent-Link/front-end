import React from 'react';
import Button from "../components/Button";

interface JobDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  description: string;
  requirements: string[];
  benefits: string[];
  jobId: string;
  hasForm: boolean;
}

const JobDetailsModal: React.FC<JobDetailsModalProps> = ({
  isOpen,
  onClose,
  title,
  description,
  requirements,
  benefits,
  jobId,
  hasForm
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-gray-800 p-6 rounded-lg w-11/12 max-w-md text-white shadow-lg">
        <h2 className="text-2xl font-bold mb-2">{title}</h2>
        <p className="text-gray-400 mb-4">{description}</p>

        <h4 className="font-bold mb-1">Requisitos:</h4>
        <ul className="text-gray-400 mb-4 list-disc list-inside space-y-1">
          {requirements.length > 0 ? (
            requirements.map((req, index) => (
              <li key={index}>{req}</li>
            ))
          ) : (
            <li>Nenhum requisito informado.</li>
          )}
        </ul>

        <h4 className="font-bold mb-1">Benefícios:</h4>
        <ul className="text-gray-400 mb-4 list-disc list-inside space-y-1">
          {benefits.length > 0 ? (
            benefits.map((benefit, index) => (
              <li key={index}>{benefit}</li>
            ))
          ) : (
            <li>Nenhum benefício informado.</li>
          )}
        </ul>

        <div className="flex justify-end gap-2">
          {hasForm && (
            <Button
              onClick={() =>
                (window.location.href = `/candidato/oportunidade/${jobId}`)
              }
            >
              Candidatar-se
            </Button>
          )}
          <button
            className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded"
            onClick={onClose}
          >
            Fechar
          </button>
        </div>
      </div>
    </div>
  );
};

export default JobDetailsModal;