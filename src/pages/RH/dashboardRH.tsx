import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  BriefcaseBusiness, 
  Users, 
  TrendingUp, 
  UserPlus
} from 'lucide-react';
import StatCard from '../../components/StatCard';
import JobCard from '../../components/JobCard';
import ChartContainer from '../../components/ChartContainer';
import { Job, JobStatistics } from '../../types';
import { Bar, Doughnut } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

const DashboardRH = () => {
  const [recentJobs, setRecentJobs] = useState<Job[]>([]);
  const [statistics, setStatistics] = useState<JobStatistics | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  // Função para buscar vagas recentes
  const fetchRecentJobs = async () => {
    try {
      const res = await fetch('/api/jobs?limit=3'); // ajuste a rota conforme seu backend
      const data = await res.json();
      setRecentJobs(data);
    } catch (err) {
      // Trate erros conforme necessário
      setRecentJobs([]);
    }
  };

  // Função para buscar estatísticas
  const fetchStatistics = async () => {
    try {
      const res = await fetch('/api/jobs/statistics');
      const data = await res.json();
      setStatistics(data);
    } catch (err) {
      setStatistics(null);
    }
  };

  useEffect(() => {
    setIsLoading(true);
    Promise.all([fetchRecentJobs(), fetchStatistics()]).finally(() => setIsLoading(false));
  }, []);

  const handleCreateJob = () => {
    navigate('create-job');
  };

  const handleEditJob = (id: string) => {
    navigate(`create-job?id=${id}`);
  };

  const handleDeactivateJob = async (id: string) => {
    // Exemplo de chamada para desativar vaga
    await fetch(`/api/jobs/${id}/toggle-status`, { method: 'PATCH' });
    fetchRecentJobs();
  };

  const handleDeleteJob = async (id: string) => {
    await fetch(`/api/jobs/${id}`, { method: 'DELETE' });
    fetchRecentJobs();
  };

  const handleViewCandidates = (id: string) => {
    navigate(`candidates/${id}`);
  };

  // Os dados dos gráficos podem vir do backend também
  const barChartData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    datasets: [
      {
        label: 'Applications',
        data: [12, 19, 15, 28, 22, 35],
        backgroundColor: '#EC4899',
      },
    ],
  };

  const doughnutChartData = {
    labels: ['Approved', 'Rejected', 'Pending'],
    datasets: [
      {
        data: [18, 12, 5],
        backgroundColor: ['#8B5CF6', '#EC4899', '#6B7280'],
        borderWidth: 0,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom' as const,
        labels: {
          color: '#C2C3CC',
        },
      },
    },
    scales: {
      x: {
        grid: {
          color: 'rgba(102, 106, 128, 0.1)',
        },
        ticks: {
          color: '#A3A5B3',
        },
      },
      y: {
        grid: {
          color: 'rgba(102, 106, 128, 0.1)',
        },
        ticks: {
          color: '#A3A5B3',
        },
      },
    },
  };

  const doughnutOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom' as const,
        labels: {
          color: '#C2C3CC',
          padding: 20,
        },
      },
    },
    cutout: '70%',
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
          <h1 className="text-3xl font-bold text-white">Dashboard</h1>
          <p className="text-dark-300 mt-1">Gerencie seu processo de recrutamento</p>
        </div>
        <button
          onClick={handleCreateJob}
          className="btn btn-primary flex items-center"
        >
          <BriefcaseBusiness size={20} className="mr-2" />
          <span>Criar Nova Vaga</span>
        </button>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total de Candidaturas"
          value={statistics?.totalApplications || 0}
          icon={<UserPlus size={24} className="text-pink-500" />}
          trend={{ value: 12, isPositive: true }}
        />
        <StatCard
          title="Candidatos Qualificados"
          value={statistics?.qualifiedCandidates || 0}
          icon={<Users size={24} className="text-purple-500" />}
          trend={{ value: 8, isPositive: true }}
        />
        <StatCard
          title="Taxa de Aprovação"
          value={`${statistics?.approvalRate || 0}%`}
          icon={<TrendingUp size={24} className="text-green-500" />}
          trend={{ value: 5, isPositive: true }}
        />
        <StatCard
          title="Vagas Ativas"
          value={recentJobs.filter(job => job.status === 'Open').length}
          icon={<BriefcaseBusiness size={24} className="text-blue-500" />}
        />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ChartContainer title="Candidaturas Mensais">
          <div className="h-64">
            <Bar data={barChartData} options={chartOptions} />
          </div>
        </ChartContainer>
        <ChartContainer title="Status dos Candidatos">
          <div className="h-64">
            <Doughnut data={doughnutChartData} options={doughnutOptions} />
          </div>
        </ChartContainer>
      </div>

      {/* Recent Jobs */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-white">Vagas Recentes</h2>
          <button
            onClick={() => navigate('manage-jobs')}
            className="text-pink-500 hover:text-pink-400 text-sm font-medium"
          >
            Ver Todas
          </button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {recentJobs.map((job) => (
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
      </div>
    </div>
  );
};

export default DashboardRH;
