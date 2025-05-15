import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Filter, Download, ArrowUpDown } from 'lucide-react';
import CandidateCard from '../../components/CandidateCard';
import { Candidate } from '../../types';

// Mock data
const mockCandidates: Candidate[] = [
  {
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
        description: 'Developed and maintained React applications.',
      },
      {
        company: 'WebDesign Co.',
        position: 'UI Developer',
        duration: '2018 - 2020',
        description: 'Designed and implemented user interfaces.',
      },
    ],
    education: [
      {
        institution: 'University of Technology',
        degree: 'Bachelor',
        field: 'Computer Science',
        year: '2018',
      },
    ],
    skills: ['React', 'TypeScript', 'CSS', 'Redux', 'Node.js'],
    appliedAt: '2023-09-16T10:30:00Z',
    status: 'Approved',
  },
  {
    id: '2',
    name: 'Sarah Miller',
    email: 'sarah@example.com',
    phone: '+1 (555) 987-6543',
    score: 85,
    experience: [
      {
        company: 'Frontend Masters',
        position: 'Senior Developer',
        duration: '2019 - 2023',
        description: 'Led frontend development for multiple projects.',
      },
    ],
    education: [
      {
        institution: 'State University',
        degree: 'Master',
        field: 'Web Development',
        year: '2019',
      },
    ],
    skills: ['JavaScript', 'React', 'HTML', 'CSS', 'Git'],
    appliedAt: '2023-09-17T14:45:00Z',
    status: 'Rejected',
  },
  {
    id: '3',
    name: 'Michael Chen',
    email: 'michael@example.com',
    phone: '+1 (555) 456-7890',
    score: 78,
    experience: [
      {
        company: 'App Innovators',
        position: 'Frontend Developer',
        duration: '2021 - 2023',
        description: 'Developed responsive web applications.',
      },
      {
        company: 'Tech Start',
        position: 'Junior Developer',
        duration: '2019 - 2021',
        description: 'Assisted in frontend development tasks.',
      },
    ],
    education: [
      {
        institution: 'Tech Institute',
        degree: 'Bachelor',
        field: 'Information Technology',
        year: '2019',
      },
    ],
    skills: ['JavaScript', 'React', 'Bootstrap', 'SASS'],
    appliedAt: '2023-09-18T09:15:00Z',
    status: 'Pending',
  },
  {
    id: '4',
    name: 'Julia Roberts',
    email: 'julia@example.com',
    phone: '+1 (555) 234-5678',
    score: 95,
    experience: [
      {
        company: 'Tech Giants',
        position: 'Lead Frontend Developer',
        duration: '2018 - 2023',
        description: 'Led a team of frontend developers and architected solutions.',
      },
      {
        company: 'Web Solutions',
        position: 'Senior Developer',
        duration: '2015 - 2018',
        description: 'Developed complex web applications.',
      },
    ],
    education: [
      {
        institution: 'Elite University',
        degree: 'Master',
        field: 'Computer Science',
        year: '2015',
      },
    ],
    skills: ['React', 'TypeScript', 'JavaScript', 'HTML', 'CSS', 'Redux', 'GraphQL'],
    appliedAt: '2023-09-16T11:20:00Z',
    status: 'Approved',
  },
  {
    id: '5',
    name: 'David Kim',
    email: 'david@example.com',
    phone: '+1 (555) 876-5432',
    score: 82,
    experience: [
      {
        company: 'Creative Apps',
        position: 'Frontend Developer',
        duration: '2020 - 2023',
        description: 'Built and maintained React applications.',
      },
    ],
    education: [
      {
        institution: 'State College',
        degree: 'Bachelor',
        field: 'Software Engineering',
        year: '2020',
      },
    ],
    skills: ['JavaScript', 'React', 'CSS', 'HTML', 'jQuery'],
    appliedAt: '2023-09-17T16:40:00Z',
    status: 'Pending',
  },
  // Backend developers
  {
    id: '6',
    name: 'Emma Wilson',
    email: 'emma@example.com',
    phone: '+1 (555) 345-6789',
    score: 88,
    experience: [
      {
        company: 'Server Solutions',
        position: 'Backend Developer',
        duration: '2019 - 2023',
        description: 'Developed and optimized server-side applications.',
      },
    ],
    education: [
      {
        institution: 'Tech University',
        degree: 'Master',
        field: 'Computer Engineering',
        year: '2019',
      },
    ],
    skills: ['Node.js', 'Express', 'MongoDB', 'REST API', 'AWS'],
    appliedAt: '2023-09-15T13:20:00Z',
    status: 'Approved',
  },
  {
    id: '7',
    name: 'James Taylor',
    email: 'james@example.com',
    phone: '+1 (555) 567-8901',
    score: 79,
    experience: [
      {
        company: 'Data Systems',
        position: 'Backend Engineer',
        duration: '2020 - 2023',
        description: 'Designed and implemented database solutions.',
      },
    ],
    education: [
      {
        institution: 'State University',
        degree: 'Bachelor',
        field: 'Computer Science',
        year: '2020',
      },
    ],
    skills: ['Python', 'Django', 'PostgreSQL', 'Docker', 'Microservices'],
    appliedAt: '2023-09-14T10:15:00Z',
    status: 'Rejected',
  },
];

const TalentBank = () => {
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [filteredCandidates, setFilteredCandidates] = useState<Candidate[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [skillFilter, setSkillFilter] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [sortBy, setSortBy] = useState<string>('date');
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  
  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setCandidates(mockCandidates);
      setFilteredCandidates(mockCandidates);
      setIsLoading(false);
    }, 1000);
  }, []);
  
  useEffect(() => {
    let results = candidates;
    
    // Apply search filter
    if (searchTerm) {
      results = results.filter(
        (candidate) =>
          candidate.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          candidate.email.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    // Apply skill filter
    if (skillFilter) {
      results = results.filter((candidate) =>
        candidate.skills.some((skill) =>
          skill.toLowerCase().includes(skillFilter.toLowerCase())
        )
      );
    }
    
    // Apply status filter
    if (statusFilter !== 'all') {
      results = results.filter((candidate) => candidate.status === statusFilter);
    }
    
    // Apply sorting
    results = [...results].sort((a, b) => {
      if (sortBy === 'date') {
        return new Date(b.appliedAt).getTime() - new Date(a.appliedAt).getTime();
      } else if (sortBy === 'score') {
        return (b.score || 0) - (a.score || 0);
      } else if (sortBy === 'name') {
        return a.name.localeCompare(b.name);
      }
      return 0;
    });
    
    setFilteredCandidates(results);
  }, [searchTerm, skillFilter, statusFilter, sortBy, candidates]);
  
  const handleViewCandidate = (id: string) => {
    navigate(`/candidate/${id}`);
  };
  
  const handleExportList = () => {
    // In a real app, this would generate and download a CSV/PDF
    alert('Export functionality would be implemented here.');
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
          <h1 className="text-3xl font-bold">Banco de Talentos</h1>
          <p className="text-dark-300 mt-1">
            {candidates.length} candidatos no total
          </p>
        </div>
        
        <button
          onClick={handleExportList}
          className="btn btn-outline flex items-center"
        >
          <Download size={18} className="mr-2" />
          <span>Exportar Lista</span>
        </button>
      </div>
      
      {/* Advanced Filters */}
      <div className="card p-4">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search size={18} className="text-dark-400" />
            </div>
            <input
              type="text"
              placeholder="Buscar por nome ou email..."
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
              <input
                type="text"
                placeholder="Filtrar por habilidade"
                value={skillFilter}
                onChange={(e) => setSkillFilter(e.target.value)}
                className="form-input pl-10 w-full"
              />
            </div>
          </div>
          
          <div className="md:w-48">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="form-input w-full"
            >
              <option value="all">Todos os Status</option>
              <option value="Approved">Aprovados</option>
              <option value="Rejected">Rejeitados</option>
              <option value="Pending">Pendentes</option>
            </select>
          </div>
          
          <div className="md:w-48">
            <div className="relative">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="form-input w-full appearance-none"
              >
                <option value="date">Ordenar por Data</option>
                <option value="score">Ordenar por Pontuação</option>
                <option value="name">Ordenar por Nome</option>
              </select>
              <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                <ArrowUpDown size={18} className="text-dark-400" />
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Candidates list */}
      {filteredCandidates.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCandidates.map((candidate) => (
            <CandidateCard
              key={candidate.id}
              candidate={candidate}
              onView={handleViewCandidate}
            />
          ))}
        </div>
      ) : (
        <div className="card py-16">
          <div className="text-center">
            <div className="inline-block p-3 rounded-full bg-dark-700 mb-4">
              <Search size={24} className="text-dark-300" />
            </div>
            <h3 className="text-xl font-medium mb-1">Nenhum candidato encontrado</h3>
            <p className="text-dark-400 mb-6">
              Não encontramos candidatos com os filtros aplicados.
            </p>
            <button onClick={() => {
              setSearchTerm('');
              setSkillFilter('');
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

export default TalentBank;