import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Filter, Plus } from 'lucide-react';
import JobCard from '../../components/JobCard';
import { Job } from '../../types';

// Mock data
const mockJobs: Job[] = [
  {
    id: '1',
    title: 'Senior Frontend Developer',
    description: 'We are looking for an experienced Frontend Developer to join our team.',
    requirements: ['5+ years of React experience', 'TypeScript', 'CSS/SCSS'],
    benefits: ['Competitive salary', 'Remote work', 'Health insurance'],
    type: 'Remote',
    location: 'Anywhere',
    status: 'Open',
    createdAt: '2023-09-15T10:00:00Z',
    applicantsCount: 12,
  },
  {
    id: '2',
    title: 'UX/UI Designer',
    description: 'Design beautiful and intuitive interfaces for our products.',
    requirements: ['3+ years of experience', 'Figma', 'User research'],
    benefits: ['Flexible hours', 'Career growth', '401k'],
    type: 'Hybrid',
    location: 'New York, NY',
    status: 'Open',
    createdAt: '2023-09-10T08:30:00Z',
    applicantsCount: 8,
  },
  {
    id: '3',
    title: 'Backend Developer',
    description: 'Develop and maintain our server infrastructure.',
    requirements: ['Node.js', 'MongoDB', 'AWS'],
    benefits: ['Competitive salary', 'Remote work', 'Health insurance'],
    type: 'Remote',
    location: 'Anywhere',
    status: 'Closed',
    createdAt: '2023-08-22T14:15:00Z',
    applicantsCount: 15,
  },
  {
    id: '4',
    title: 'Product Manager',
    description: 'Drive the product development process from conception to launch.',
    requirements: ['3+ years in product management', 'Agile methodologies', 'Data analysis'],
    benefits: ['Competitive salary', 'Remote work', 'Stock options'],
    type: 'Hybrid',
    location: 'San Francisco, CA',
    status: 'Open',
    createdAt: '2023-09-05T09:20:00Z',
    applicantsCount: 6,
  },
  {
    id: '5',
    title: 'DevOps Engineer',
    description: 'Manage our cloud infrastructure and CI/CD pipelines.',
    requirements: ['AWS', 'Docker', 'Kubernetes', 'CI/CD'],
    benefits: ['Flexible hours', 'Health insurance', 'Professional development'],
    type: 'Remote',
    location: 'Anywhere',
    status: 'Completed',
    createdAt: '2023-07-18T11:45:00Z',
    applicantsCount: 9,
  },
  {
    id: '6',
    title: 'Data Scientist',
    description: 'Analyze and interpret complex data to help make business decisions.',
    requirements: ['Python', 'Machine Learning', 'SQL', 'Statistics'],
    benefits: ['Competitive salary', 'Remote work', '401k matching'],
    type: 'On-site',
    location: 'Boston, MA',
    status: 'Open',
    createdAt: '2023-09-12T13:10:00Z',
    applicantsCount: 5,
  },
];

const ManageJobs = () => {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [filteredJobs, setFilteredJobs] = useState<Job[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  
  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setJobs(mockJobs);
      setFilteredJobs(mockJobs);
      setIsLoading(false);
    }, 1000);
  }, []);
  
  useEffect(() => {
    let results = jobs;
    
    // Apply search filter
    if (searchTerm) {
      results = results.filter(
        (job) =>
          job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          job.location.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    // Apply status filter
    if (statusFilter !== 'all') {
      results = results.filter((job) => job.status === statusFilter);
    }
    
    setFilteredJobs(results);
  }, [searchTerm, statusFilter, jobs]);
  
  const handleCreateJob = () => {
    navigate('/dashboardRH/create-job');
  };
  
  const handleEditJob = (id: string) => {
    navigate(`/dashboardRH/create-job?id=${id}`);
  };
  
  const handleDeactivateJob = (id: string) => {
    // In a real app, this would call an API
    setJobs(
      jobs.map((job) =>
        job.id === id
          ? {
              ...job,
              status: job.status === 'Open' ? 'Closed' : 'Open',
            }
          : job
      )
    );
  };
  
  const handleDeleteJob = (id: string) => {
    // In a real app, this would call an API
    setJobs(jobs.filter((job) => job.id !== id));
  };
  
  const handleViewCandidates = (id: string) => {
    navigate(`/dashboardRH/candidates/${id}`);
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
  
  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">Gerenciar Vagas</h1>
          <p className="text-dark-300 mt-1">
            Visualize e gerencie todas as suas vagas
          </p>
        </div>
        
        <button
          onClick={handleCreateJob}
          className="btn btn-primary flex items-center"
        >
          <Plus size={20} className="mr-2" />
          <span>Criar Nova Vaga</span>
        </button>
      </div>
      
      {/* Filters */}
      <div className="card p-4">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search size={18} className="text-dark-400" />
            </div>
            <input
              type="text"
              placeholder="Buscar por título ou localização..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="form-input pl-10 w-full"
            />
          </div>
          
          <div className="md:w-48">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Filter size={18} className="text-dark-400" />
              </div>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="form-input pl-10 w-full appearance-none"
              >
                <option value="all">Todos os Status</option>
                <option value="Open">Aberta</option>
                <option value="Closed">Fechada</option>
                <option value="Completed">Finalizada</option>
              </select>
            </div>
          </div>
        </div>
      </div>
      
      {/* Jobs list */}
      {filteredJobs.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredJobs.map((job) => (
            <JobCard
              key={job.id}
              job={job}
              onEdit={handleEditJob}
              onDeactivate={handleDeactivateJob}
              onDelete={handleDeleteJob}
              onView={handleViewCandidates}
            />
          ))}
        </div>
      ) : (
        <div className="card py-16">
          <div className="text-center">
            <div className="inline-block p-3 rounded-full bg-dark-700 mb-4">
              <Search size={24} className="text-dark-300" />
            </div>
            <h3 className="text-xl font-medium mb-1">Nenhuma vaga encontrada</h3>
            <p className="text-dark-400 mb-6">
              Não encontramos vagas com os filtros aplicados.
            </p>
            <button onClick={() => {
              setSearchTerm('');
              setStatusFilter('all');
            }} className="btn btn-outline">
              Limpar Filtros
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageJobs;