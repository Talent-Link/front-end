import React from 'react';
import { Star, CheckCircle, X } from 'lucide-react';

interface FavoriteModalProps {
  isOpen: boolean;
  onClose: () => void;
  candidateName: string;
  isAlreadyFavorited: boolean;
  onUnfavorite?: () => void;
}

const FavoriteModal: React.FC<FavoriteModalProps> = ({
  isOpen,
  onClose,
  candidateName,
  isAlreadyFavorited,
  onUnfavorite
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 animate-fadeIn">
      <div className="bg-dark-800 rounded-lg p-6 max-w-md w-full mx-4 border border-dark-700 shadow-xl transform transition-all duration-300 animate-scaleIn">
        {/* Header do Modal */}
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center gap-3">
            <div className={`p-2 rounded-full ${isAlreadyFavorited ? 'bg-yellow-500' : 'bg-yellow-500 animate-pulse'}`}>
              <Star size={20} className="text-white fill-current" />
            </div>
            <h3 className="text-lg font-semibold text-white">
              Banco de Talentos
            </h3>
          </div>
          {/* Botão X sempre disponível */}
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors p-1 rounded-full hover:bg-gray-700"
          >
            <X size={20} />
          </button>
        </div>

        {/* Conteúdo do Modal */}
        <div className="text-center">
          {isAlreadyFavorited ? (
            <>
              <div className="mb-4">
                <CheckCircle size={48} className="text-yellow-500 mx-auto" />
              </div>
              <h4 className="text-xl font-medium text-white mb-2">
                Candidato já favoritado!
              </h4>
              <p className="text-gray-300 mb-6">
                <span className="font-medium text-yellow-400">{candidateName}</span> já está 
                no seu Banco de Talentos.
              </p>
            </>
          ) : (
            <>
              <div className="mb-4">
                <Star size={48} className="text-yellow-500 mx-auto fill-current" />
              </div>
              <h4 className="text-xl font-medium text-white mb-2">
                Candidato favoritado!
              </h4>
              <p className="text-gray-300 mb-6">
                <span className="font-medium text-yellow-400">{candidateName}</span> foi 
                adicionado ao seu Banco de Talentos com sucesso!
              </p>
            </>
          )}

          {/* Botões */}
          <div className="flex gap-3">
            {isAlreadyFavorited ? (
              // Botões para candidato já favoritado
              <>
                <button
                  onClick={onUnfavorite}
                  className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium"
                >
                  Remover dos Favoritos
                </button>
                <button
                  onClick={() => {
                    onClose();
                    // Navegar para o banco de talentos
                    window.location.href = '/rh/talent-bank';
                  }}
                  className="flex-1 px-4 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition-colors font-medium"
                >
                  Ver Banco de Talentos
                </button>
              </>
            ) : (
              // Botões para candidato recém favoritado
              <>
                <button
                  onClick={onClose}
                  className="flex-1 px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-colors"
                >
                  Fechar
                </button>
                <button
                  onClick={() => {
                    onClose();
                    // Navegar para o banco de talentos
                    window.location.href = '/rh/talent-bank';
                  }}
                  className="flex-1 px-4 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition-colors"
                >
                  Ver Banco de Talentos
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FavoriteModal;
