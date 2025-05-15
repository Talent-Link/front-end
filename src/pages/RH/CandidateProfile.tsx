import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  ExternalLink, 
  Mail, 
  Phone, 
  Calendar, 
  Briefcase, 
  GraduationCap,
  ThumbsUp,
  ThumbsDown,
  MessageSquare
} from 'lucide-react';
import { Candidate } from '../../types';

// Mock data
const mockCandidate: Candidate = {
  id: '1',
  name: 'Alex Johnson',
  email: 'alex@example.com',
  phone: '+1 (555) 123-4567',
  score: 92,
  experience: [
    {
      company: 'Tech Solutions Inc.',
      position: 'Frontend Developer',
      duration: '2020 - 2023',
      description: 'Developed and maintained React applications. Led a team of junior developers on multiple projects. Implemented new features and optimized existing code for better performance.',
    },
    {
      company: 'WebDesign Co.',
      position: 'UI Developer',
      duration: '2018 - 2020',
      description: 'Designed and implemented user interfaces for web applications. Collaborated with designers and backend developers to create seamless user experiences.',
    },
  ],
  education: [
    {
      institution: 'University of Technology',
      degree: 'Bachelor',
      field: 'Computer Science',
      year: '2018',
    },
    {
      institution: 'Tech Bootcamp',
      degree: 'Certificate',
      field: 'Frontend Development',
      year: '2019',
    }
  ],
  skills: ['React', 'TypeScript', 'CSS', 'Redux', 'Node.js', 'HTML5', 'JavaScript', 'GraphQL', 'Git', 'Responsive Design'],
  resumeUrl: '#',
  appliedAt: '2023-09-16T10:30:00Z',
  status: 'Pending',
};

const CandidateProfile = () => {
  const { id } = useParams<{ id: string }>();
  const [candidate, setCandidate] = useState<Candidate | null>(null);
  const [feedback, setFeedback] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  
  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setCandidate(mockCandidate);
      setIsLoading(false);
    }, 1000);
  }, [id]);
  
  const handleApprove = () => {
    if (candidate) {
      setCandidate({
        ...candidate,
        status: 'Approved',
      });
      
      // In a real app, this would call an API
      setTimeout(() => {
        navigate(-1);
      }, 1500);
    }
  };
  
  const handleReject = () => {
    if (candidate) {
      setCandidate({
        ...candidate,
        status: 'Rejected',
      });
      
      // In a real app, this would call an API
      setTimeout(() => {
        navigate(-1);
      }, 1500);
    }
  };
  
  const handleSendFeedback = () => {
    if (feedback.trim()) {
      // In a real app, this would send feedback to the candidate
      alert('Feedback would be sent to the candidate.');
      setFeedback('');
    }
  };
  
  const handleBack = () => {
    navigate(-1);
  };
  
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-pulse flex flex-col items-center">
          <div className="h-12 w-12 rounded-full bg-dark-700 mb-4"></div>
          <div className="h-4 w-32 bg-dark-700 rounded mb-2"></div>
          <div className="h-3 w-24 bg-dark-700 rounded"></div>
        </div>
      </div>
    );
  }
  
  if (!candidate) {
    return (
      <div className="card py-16 text-center">
        <h2 className="text-2xl font-semibold mb-4">Candidato não encontrado</h2>
        <p className="text-dark-300 mb-6">
          O candidato que você está procurando não existe ou foi removido.
        </p>
        <button onClick={handleBack} className="btn btn-primary">
          Voltar
        </button>
      </div>
    );
  }
  
  return (
    <div className="max-w-5xl mx-auto space-y-8">
      <button
        onClick={handleBack}
        className="flex items-center text-dark-300 hover:text-dark-100"
      >
        <ArrowLeft size={18} className="mr-1" />
        <span>Voltar</span>
      </button>
      
      {/* Status notification */}
      {candidate.status !== 'Pending' && (
        <div className={`p-4 rounded-lg ${
          candidate.status === 'Approved' 
            ? 'bg-green-500/20 border border-green-500/30 text-green-400' 
            : 'bg-red-500/20 border border-red-500/30 text-red-400'
        }`}>
          <p className="text-center font-medium">
            {candidate.status === 'Approved' 
              ? 'Candidato aprovado com sucesso!' 
              : 'Candidato rejeitado.'}
          </p>
        </div>
      )}
      
      {/* Header */}
      <div className="card animate-fade-in">
        <div className="sm:flex justify-between items-start">
          <div>
            <div className="flex items-center mb-2">
              {candidate.score !== undefined && (
                <div className="flex items-center bg-dark-700 px-3 py-1 rounded-full mr-3">
                  <span className="text-sm font-medium">Score: {candidate.score}</span>
                </div>
              )}
              <span className={`px-3 py-1 text-xs rounded-full ${
                candidate.status === 'Approved' 
                  ? 'bg-green-500/20 text-green-400' 
                  : candidate.status === 'Rejected'
                    ? 'bg-red-500/20 text-red-400'
                    : 'bg-blue-500/20 text-blue-400'
              }`}>
                {candidate.status}
              </span>
            </div>
            
            <h1 className="text-3xl font-bold mb-2">{candidate.name}</h1>
            
            <div className="space-y-2 text-dark-300">
              <div className="flex items-center">
                <Mail size={16} className="mr-2" />
                <a 
                  href={`mailto:${candidate.email}`} 
                  className="hover:text-pink-500 transition-colors"
                >
                  {candidate.email}
                </a>
              </div>
              
              <div className="flex items-center">
                <Phone size={16} className="mr-2" />
                <a 
                  href={`tel:${candidate.phone}`} 
                  className="hover:text-pink-500 transition-colors"
                >
                  {candidate.phone}
                </a>
              </div>
              
              <div className="flex items-center">
                <Calendar size={16} className="mr-2" />
                <span>Aplicou em {new Date(candidate.appliedAt).toLocaleDateString()}</span>
              </div>
            </div>
          </div>
          
          <div className="mt-6 sm:mt-0 flex flex-col gap-2">
            {candidate.resumeUrl && (
              <a 
                href={candidate.resumeUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-outline flex items-center"
              >
                <ExternalLink size={16} className="mr-2" />
                <span>Ver Currículo</span>
              </a>
            )}
          </div>
        </div>
      </div>
      
      {/* Skills */}
      <div className="card animate-fade-in">
        <h2 className="text-xl font-semibold mb-4">Habilidades e Competências</h2>
        
        <div className="flex flex-wrap gap-2">
          {candidate.skills.map((skill, index) => (
            <span 
              key={index} 
              className="px-3 py-1.5 text-sm rounded-full bg-dark-700 text-dark-200"
            >
              {skill}
            </span>
          ))}
        </div>
      </div>
      
      {/* Experience */}
      <div className="card animate-fade-in">
        <h2 className="text-xl font-semibold mb-4 flex items-center">
          <Briefcase size={20} className="mr-2 text-pink-500" />
          Experiência Profissional
        </h2>
        
        <div className="space-y-6">
          {candidate.experience.map((exp, index) => (
            <div key={index} className="border-l-2 border-dark-700 pl-4 ml-2">
              <h3 className="text-lg font-medium">{exp.position}</h3>
              <div className="text-pink-500 mb-1">{exp.company}</div>
              <div className="text-dark-300 text-sm mb-2">{exp.duration}</div>
              <p className="text-dark-200">{exp.description}</p>
            </div>
          ))}
        </div>
      </div>
      
      {/* Education */}
      <div className="card animate-fade-in">
        <h2 className="text-xl font-semibold mb-4 flex items-center">
          <GraduationCap size={20} className="mr-2 text-pink-500" />
          Formação Acadêmica
        </h2>
        
        <div className="space-y-6">
          {candidate.education.map((edu, index) => (
            <div key={index} className="border-l-2 border-dark-700 pl-4 ml-2">
              <h3 className="text-lg font-medium">{edu.institution}</h3>
              <div className="text-pink-500 mb-1">
                {edu.degree} em {edu.field}
              </div>
              <div className="text-dark-300 text-sm">{edu.year}</div>
            </div>
          ))}
        </div>
      </div>
      
      {/* Action buttons */}
      {candidate.status === 'Pending' && (
        <div className="card animate-fade-in">
          <h2 className="text-xl font-semibold mb-4">Ações</h2>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <button
              onClick={handleApprove}
              className="btn flex items-center justify-center bg-green-600 hover:bg-green-700 text-white"
            >
              <ThumbsUp size={20} className="mr-2" />
              <span>Aprovar Candidato</span>
            </button>
            
            <button
              onClick={handleReject}
              className="btn flex items-center justify-center bg-red-600 hover:bg-red-700 text-white"
            >
              <ThumbsDown size={20} className="mr-2" />
              <span>Rejeitar Candidato</span>
            </button>
          </div>
          
          <div className="mt-6">
            <h3 className="text-lg font-medium mb-2">Enviar Feedback</h3>
            <textarea
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
              className="form-input min-h-32 mb-4"
              placeholder="Escreva uma mensagem de feedback para o candidato..."
            ></textarea>
            
            <button
              onClick={handleSendFeedback}
              className="btn btn-primary flex items-center"
              disabled={!feedback.trim()}
            >
              <MessageSquare size={20} className="mr-2" />
              <span>Enviar Feedback</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default CandidateProfile;