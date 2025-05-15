import { FileText, Star } from 'lucide-react';
import { Candidate } from '../types/index';

interface CandidateCardProps {
  candidate: Candidate;
  onView: (id: string) => void;
}

const CandidateCard = ({ candidate, onView }: CandidateCardProps) => {
  // Format the date
  const formattedDate = new Date(candidate.appliedAt).toLocaleDateString();
  
  return (
    <div className="card animate-fade-in hover:shadow-xl transition-shadow">
      <div className="flex justify-between items-start">
        <div>
          <h3 className="text-xl font-medium mb-1">{candidate.name}</h3>
          <p className="text-sm text-dark-300">{candidate.email}</p>
        </div>
        
        {candidate.score !== undefined && (
          <div className="flex items-center bg-dark-700 px-3 py-1 rounded-full">
            <Star size={16} className="text-yellow-500 mr-1" />
            <span className="text-sm font-medium">{candidate.score}</span>
          </div>
        )}
      </div>
      
      <div className="mt-4">
        <div className="text-sm text-dark-200 mb-2">Top Skills:</div>
        <div className="flex flex-wrap gap-2">
          {candidate.skills.slice(0, 3).map((skill, index) => (
            <span 
              key={index} 
              className="px-2 py-1 text-xs rounded-full bg-dark-700 text-dark-200"
            >
              {skill}
            </span>
          ))}
          {candidate.skills.length > 3 && (
            <span className="px-2 py-1 text-xs rounded-full bg-dark-700 text-dark-200">
              +{candidate.skills.length - 3} more
            </span>
          )}
        </div>
      </div>
      
      <div className="mt-4 flex items-center text-sm text-dark-300">
        <FileText size={16} className="mr-1" />
        <span>Applied on {formattedDate}</span>
      </div>
      
      <div className="mt-6">
        <button 
          onClick={() => onView(candidate.id)} 
          className="btn btn-primary w-full"
        >
          View Profile
        </button>
      </div>
    </div>
  );
};

export default CandidateCard;