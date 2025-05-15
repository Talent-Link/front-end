import { Clock, MapPin, Users } from 'lucide-react';
import { Job } from '../types';

interface JobCardProps {
  job: Job;
  onEdit: (id: string) => void;
  onDeactivate: (id: string) => void;
  onDelete: (id: string) => void;
  onView: (id: string) => void;
}

const JobCard = ({ job, onEdit, onDeactivate, onDelete, onView }: JobCardProps) => {
  const statusColor = {
    Open: 'bg-green-500',
    Closed: 'bg-yellow-500',
    Completed: 'bg-blue-500',
  }[job.status];

  return (
    <div className="card animate-fade-in hover:shadow-xl transition-shadow">
      <div className="flex justify-between items-start">
        <div>
          <div className="flex items-center mb-2">
            <span className={`h-2.5 w-2.5 rounded-full ${statusColor} mr-2`}></span>
            <span className="text-sm text-dark-300">{job.status}</span>
          </div>
          <h3 className="text-xl font-medium mb-2">{job.title}</h3>
        </div>
        
        <div className="flex items-center space-x-1">
          <Users size={16} className="text-dark-300" />
          <span className="text-sm text-dark-300">{job.applicantsCount}</span>
        </div>
      </div>
      
      <div className="mt-4 space-y-2">
        <div className="flex items-center text-sm text-dark-300">
          <MapPin size={16} className="mr-1" />
          <span>{job.location} • {job.type}</span>
        </div>
        
        <div className="flex items-center text-sm text-dark-300">
          <Clock size={16} className="mr-1" />
          <span>Posted on {new Date(job.createdAt).toLocaleDateString()}</span>
        </div>
      </div>
      
      <div className="mt-6 flex flex-wrap gap-2">
        <button 
          onClick={() => onView(job.id)} 
          className="btn btn-primary text-sm flex-1"
        >
          View Candidates
        </button>
        
        <button 
          onClick={() => onEdit(job.id)} 
          className="btn btn-secondary text-sm"
        >
          Edit
        </button>
        
        <button 
          onClick={() => onDeactivate(job.id)} 
          className="btn btn-outline text-sm"
        >
          {job.status === 'Open' ? 'Deactivate' : 'Activate'}
        </button>
        
        <button 
          onClick={() => onDelete(job.id)} 
          className="btn btn-outline text-sm text-red-500 hover:bg-red-500/10"
        >
          Delete
        </button>
      </div>
    </div>
  );
};

export default JobCard;