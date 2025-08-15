import { Star, Mail, Phone, Calendar, Award } from 'lucide-react';
import { TalentBankCandidate } from '../services/talentBankService';

interface TalentBankCandidateCardProps {
  candidate: TalentBankCandidate;
  onView: (id: string) => void;
  onFavoriteToggle: (id: string) => void;
}

const TalentBankCandidateCard = ({ candidate, onView, onFavoriteToggle }: TalentBankCandidateCardProps) => {
  // Formatar a data
  const formattedDate = new Date(candidate.appliedAt).toLocaleDateString('pt-BR');
  
  // Obter as 3 principais habilidades
  const topSkills = candidate.skills?.slice(0, 3) || [];

  // Obter a experiência mais recente
  const latestExperience = candidate.experience?.[0];

  return (
    <div className="card animate-fade-in hover:shadow-xl transition-all duration-300 relative group">
      {/* Header */}
      <div className="flex justify-between items-start mb-4">
        <div className="flex items-center">
          {candidate.photoUrl ? (
            <img 
              src={candidate.photoUrl} 
              alt={candidate.name}
              className="w-12 h-12 rounded-full object-cover mr-3"
            />
          ) : (
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center mr-3">
              <span className="text-white font-bold text-lg">
                {candidate.name.charAt(0).toUpperCase()}
              </span>
            </div>
          )}
          <div>
            <h3 className="text-xl font-semibold text-white mb-1">{candidate.name}</h3>
            <p className="text-sm text-dark-300 flex items-center">
              <Mail size={14} className="mr-1" />
              {candidate.email}
            </p>
          </div>
        </div>
        
        {/* Score */}
        {candidate.score !== undefined && (
          <div className="flex items-center bg-gradient-to-r from-yellow-400 to-orange-500 px-3 py-1 rounded-full">
            <Award size={16} className="text-white mr-1" />
            <span className="text-sm font-bold text-white">{candidate.score}</span>
          </div>
        )}
      </div>

      {/* Contact Info */}
      {candidate.phone && (
        <div className="flex items-center text-dark-300 mb-2">
          <Phone size={14} className="mr-2" />
          <span className="text-sm">{candidate.phone}</span>
        </div>
      )}

      {/* Latest Experience */}
      {latestExperience && (
        <div className="mb-4">
          <div className="text-sm text-dark-200 mb-1">Experiência Atual:</div>
          <div className="bg-dark-700 p-3 rounded-lg">
            <h4 className="font-medium text-white">{latestExperience.position}</h4>
            <p className="text-sm text-dark-300">{latestExperience.company}</p>
            <p className="text-xs text-dark-400">{latestExperience.duration}</p>
          </div>
        </div>
      )}

      {/* Skills */}
      {topSkills.length > 0 && (
        <div className="mb-4">
          <div className="text-sm text-dark-200 mb-2">Principais Habilidades:</div>
          <div className="flex flex-wrap gap-1">
            {topSkills.map((skill, index) => (
              <span
                key={index}
                className="bg-pink-500/20 text-pink-300 px-2 py-1 rounded text-xs"
              >
                {skill}
              </span>
            ))}
            {candidate.skills && candidate.skills.length > 3 && (
              <span className="bg-dark-600 text-dark-300 px-2 py-1 rounded text-xs">
                +{candidate.skills.length - 3} mais
              </span>
            )}
          </div>
        </div>
      )}

      {/* Status */}
      <div className="mb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <div className={`w-2 h-2 rounded-full mr-2 ${
              candidate.status === 'Approved' ? 'bg-green-500' :
              candidate.status === 'Rejected' ? 'bg-red-500' : 'bg-yellow-500'
            }`}></div>
            <span className={`text-sm font-medium ${
              candidate.status === 'Approved' ? 'text-green-400' :
              candidate.status === 'Rejected' ? 'text-red-400' : 'text-yellow-400'
            }`}>
              {candidate.status === 'Approved' ? 'Aprovado' :
               candidate.status === 'Rejected' ? 'Rejeitado' : 'Pendente'}
            </span>
          </div>
          
          <div className="flex items-center text-dark-400">
            <Calendar size={14} className="mr-1" />
            <span className="text-xs">{formattedDate}</span>
          </div>
        </div>
      </div>

      {/* Favorite Button */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          onFavoriteToggle(candidate.id);
        }}
        className={`absolute top-3 right-3 p-2 rounded-full transition-all duration-200 ${
          candidate.isFavorite
            ? 'text-yellow-400 bg-yellow-400/20 hover:bg-yellow-400/30 scale-110'
            : 'text-gray-400 bg-dark-700/50 hover:text-yellow-400 hover:bg-yellow-400/20 hover:scale-105'
        }`}
        title={candidate.isFavorite ? 'Remover dos favoritos' : 'Adicionar aos favoritos'}
      >
        <Star 
          size={18} 
          fill={candidate.isFavorite ? 'currentColor' : 'none'}
          className={candidate.isFavorite ? 'drop-shadow-lg' : ''}
        />
      </button>

      {/* Actions */}
      <div className="flex gap-2 pt-4 border-t border-dark-700">
        <button
          onClick={() => onView(candidate.id)}
          className="flex-1 bg-pink-500 hover:bg-pink-600 text-white py-2 px-4 rounded font-medium transition-colors"
        >
          Ver Detalhes
        </button>
        
        <button
          onClick={() => window.open(`mailto:${candidate.email}`, '_blank')}
          className="flex-1 bg-dark-600 hover:bg-dark-500 text-white py-2 px-4 rounded font-medium transition-colors flex items-center justify-center"
        >
          <Mail size={16} className="mr-1" />
          Contatar
        </button>
      </div>

      {/* Hover Effect Overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-pink-500/5 to-purple-500/5 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
    </div>
  );
};

export default TalentBankCandidateCard;
