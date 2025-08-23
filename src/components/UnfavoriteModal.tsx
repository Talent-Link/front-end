import React from 'react';
import { StarOff, CheckCircle, X } from 'lucide-react';

interface UnfavoriteModalProps {
  isOpen: boolean;
  onClose: () => void;
  candidateName: string;
}

const UnfavoriteModal: React.FC<UnfavoriteModalProps> = ({
  isOpen,
  onClose,
  candidateName
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 animate-fadeIn">
      <div className="bg-dark-800 rounded-lg p-6 max-w-md w-full mx-4 border border-dark-700 shadow-xl transform transition-all duration-300 animate-scaleIn">
        {/* Header do Modal */}
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-red-500 rounded-full">
              <StarOff size={20} className="text-white" />
            </div>
            <h3 className="text-lg font-semibold text-white">
              Removido dos Favoritos
            </h3>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors p-1 rounded-full hover:bg-gray-700"
          >
            <X size={20} />
          </button>
        </div>

        {/* Conteúdo do Modal */}
        <div className="text-center">
          <div className="mb-4">
            <CheckCircle size={48} className="text-green-500 mx-auto" />
          </div>
          
          <h4 className="text-xl font-medium text-white mb-2">
            Candidato removido!
          </h4>
          
          <p className="text-gray-300 mb-6">
            <span className="font-medium text-red-400">{candidateName}</span> foi 
            removido do seu Banco de Talentos com sucesso.
          </p>

          {/* Botão */}
          <button
            onClick={onClose}
            className="w-full px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium"
          >
            Entendi
          </button>
        </div>
      </div>
    </div>
  );
};

export default UnfavoriteModal;
