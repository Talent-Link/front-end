import { useState, useEffect } from 'react';
import { Calendar, Download, BarChart3} from 'lucide-react';
import ChartContainer from '../../components/ChartContainer';
import { ReportData } from '../../types';
import { Line, Bar, Doughnut } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from 'chart.js';

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

// Mock data
const mockReportData: ReportData = {
  period: 'last-6-months',
  candidateCount: 120,
  approvalRate: 35,
  jobPerformance: [
    {
      jobId: '1',
      jobTitle: 'Senior Frontend Developer',
      applicantsCount: 35,
      qualifiedCount: 12,
    },
    {
      jobId: '2',
      jobTitle: 'UX/UI Designer',
      applicantsCount: 28,
      qualifiedCount: 10,
    },
    {
      jobId: '3',
      jobTitle: 'Backend Developer',
      applicantsCount: 42,
      qualifiedCount: 15,
    },
    {
      jobId: '4',
      jobTitle: 'Product Manager',
      applicantsCount: 15,
      qualifiedCount: 5,
    },
  ],
};

const Reports = () => {
  const [reportData, setReportData] = useState<ReportData | null>(null);
  const [period, setPeriod] = useState<string>('last-6-months');
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    // Simulate API call
    setIsLoading(true);
    setTimeout(() => {
      setReportData(mockReportData);
      setIsLoading(false);
    }, 1000);
  }, [period]);
  
  const handleExportReport = () => {
    // In a real app, this would generate and download a PDF report
    alert('Export functionality would be implemented here.');
  };
  
  const handlePeriodChange = (newPeriod: string) => {
    setPeriod(newPeriod);
  };
  
  // Chart data
  const candidatesOverTimeData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    datasets: [
      {
        label: 'Candidatos',
        data: [22, 35, 28, 45, 38, 52],
        borderColor: '#EC4899',
        backgroundColor: 'rgba(236, 72, 153, 0.1)',
        borderWidth: 2,
        tension: 0.3,
        fill: true,
      },
    ],
  };
  
  const jobPerformanceData = {
    labels: reportData?.jobPerformance.map(job => job.jobTitle) || [],
    datasets: [
      {
        label: 'Total de Candidatos',
        data: reportData?.jobPerformance.map(job => job.applicantsCount) || [],
        backgroundColor: '#8B5CF6',
      },
      {
        label: 'Candidatos Qualificados',
        data: reportData?.jobPerformance.map(job => job.qualifiedCount) || [],
        backgroundColor: '#EC4899',
      },
    ],
  };
  
  const candidateStatusData = {
    labels: ['Aprovados', 'Rejeitados', 'Pendentes'],
    datasets: [
      {
        data: [35, 45, 20],
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
        beginAtZero: true,
      },
    },
  };
  
  const barChartOptions = {
    ...chartOptions,
    indexAxis: 'y' as const,
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
          <h1 className="text-3xl font-bold">Relatórios e Análise</h1>
          <p className="text-dark-300 mt-1">
            Acompanhe os dados dos seus processos seletivos
          </p>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Calendar size={18} className="text-dark-400" />
            </div>
            <select
              value={period}
              onChange={(e) => handlePeriodChange(e.target.value)}
              className="form-input pl-10"
            >
              <option value="last-7-days">Últimos 7 dias</option>
              <option value="last-month">Último mês</option>
              <option value="last-6-months">Últimos 6 meses</option>
              <option value="last-year">Último ano</option>
            </select>
          </div>
          
          <button
            onClick={handleExportReport}
            className="btn btn-primary flex items-center"
          >
            <Download size={18} className="mr-2" />
            <span>Exportar Relatório</span>
          </button>
        </div>
      </div>
      
      {/* Summary stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="card animate-fade-in">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-lg font-medium">Total de Candidatos</h3>
            <div className="p-2 rounded-lg bg-dark-700">
              <Users size={20} className="text-pink-500" />
            </div>
          </div>
          <div className="text-3xl font-bold">{reportData?.candidateCount || 0}</div>
          <div className="mt-2 text-sm text-dark-300">Durante o período selecionado</div>
        </div>
        
        <div className="card animate-fade-in">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-lg font-medium">Taxa de Aprovação</h3>
            <div className="p-2 rounded-lg bg-dark-700">
              <TrendingUp size={20} className="text-purple-500" />
            </div>
          </div>
          <div className="text-3xl font-bold">{reportData?.approvalRate || 0}%</div>
          <div className="mt-2 text-sm text-dark-300">Candidatos aprovados vs. total</div>
        </div>
        
        <div className="card animate-fade-in">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-lg font-medium">Vagas Ativas</h3>
            <div className="p-2 rounded-lg bg-dark-700">
              <BriefcaseBusiness size={20} className="text-blue-500" />
            </div>
          </div>
          <div className="text-3xl font-bold">
            {reportData?.jobPerformance.length || 0}
          </div>
          <div className="mt-2 text-sm text-dark-300">No período selecionado</div>
        </div>
      </div>
      
      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ChartContainer title="Candidatos por Mês" className="lg:col-span-2">
          <div className="h-64">
            <Line data={candidatesOverTimeData} options={chartOptions} />
          </div>
        </ChartContainer>
        
        <ChartContainer title="Desempenho por Vaga">
          <div className="h-64">
            <Bar data={jobPerformanceData} options={barChartOptions} />
          </div>
        </ChartContainer>
        
        <ChartContainer title="Status dos Candidatos">
          <div className="h-64">
            <Doughnut data={candidateStatusData} options={doughnutOptions} />
          </div>
        </ChartContainer>
      </div>
      
      {/* Job Performance Table */}
      <div className="card animate-fade-in overflow-hidden">
        <h2 className="text-xl font-semibold mb-4 flex items-center">
          <BarChart3 size={20} className="mr-2 text-pink-500" />
          Detalhamento por Vaga
        </h2>
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-dark-700">
                <th className="text-left py-3 px-4 text-dark-300 font-medium">Título da Vaga</th>
                <th className="text-center py-3 px-4 text-dark-300 font-medium">Candidatos</th>
                <th className="text-center py-3 px-4 text-dark-300 font-medium">Qualificados</th>
                <th className="text-center py-3 px-4 text-dark-300 font-medium">Taxa (%)</th>
              </tr>
            </thead>
            <tbody>
              {reportData?.jobPerformance.map((job) => (
                <tr key={job.jobId} className="border-b border-dark-700/50 hover:bg-dark-700/20">
                  <td className="py-3 px-4">{job.jobTitle}</td>
                  <td className="py-3 px-4 text-center">{job.applicantsCount}</td>
                  <td className="py-3 px-4 text-center">{job.qualifiedCount}</td>
                  <td className="py-3 px-4 text-center">
                    {Math.round((job.qualifiedCount / job.applicantsCount) * 100)}%
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

const Users = ({ size, className }: { size: number, className: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
    <circle cx="9" cy="7" r="4" />
    <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
    <path d="M16 3.13a4 4 0 0 1 0 7.75" />
  </svg>
);

const TrendingUp = ({ size, className }: { size: number, className: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <polyline points="23 6 13.5 15.5 8.5 10.5 1 18" />
    <polyline points="17 6 23 6 23 12" />
  </svg>
);

const BriefcaseBusiness = ({ size, className }: { size: number, className: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <path d="M20 7h-7m-7 0H3a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h18a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3" />
    <path d="M16 7V4a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v3" />
    <path d="M8 21V7" />
    <path d="M16 21V7" />
    <rect width="6" height="4" x="9" y="11" rx="1" />
  </svg>
);

export default Reports;