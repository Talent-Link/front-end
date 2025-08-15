import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  BriefcaseBusiness,
  Users,
  TrendingUp,
  UserPlus,
  AlertCircle,
} from "lucide-react";
import StatCard from "../../components/StatCard";
import JobCard from "../../components/JobCard";
import ChartContainer from "../../components/ChartContainer";
import { Job } from "../../types";
import { Bar, Doughnut } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from "chart.js";
import dashboardService, {
  DashboardMetrics,
  CandidatoQualificado,
} from "../../services/dashboardService";

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
  const [metrics, setMetrics] = useState<DashboardMetrics | null>(null);
  const [candidatosQualificados, setCandidatosQualificados] = useState<
    CandidatoQualificado[]
  >([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  // Função para buscar métricas do dashboard
  const fetchDashboardMetrics = async () => {
    try {
      const data = await dashboardService.getMetrics();
      setMetrics(data);
      setError(null);
    } catch (err) {
      console.error("Erro ao buscar métricas:", err);
      // Se falhar, ainda define métricas vazias para não quebrar a UI
      setMetrics({
        metrics: {
          totalCandidaturas: {
            value: 0,
            change: "+0%",
            period: "from last period",
          },
          candidatosQualificados: {
            value: 0,
            change: "+0%",
            period: "from last period",
          },
          taxaAprovacao: {
            value: 0,
            change: "+0%",
            period: "from last period",
          },
          vagasAtivas: { value: 0, change: "+0%", period: "from last period" },
        },
        charts: {
          candidaturasMensais: [],
          statusCandidatos: [],
        },
      });
    }
  };

  // Função para buscar candidatos qualificados
  const fetchCandidatosQualificados = async () => {
    try {
      const data = await dashboardService.getCandidatosQualificados();
      setCandidatosQualificados(data);
    } catch (err) {
      console.error("Erro ao buscar candidatos:", err);
      setCandidatosQualificados([]);
    }
  };

  // Função para buscar vagas recentes (mantendo a existente)
  const fetchRecentJobs = async () => {
    try {
      const res = await fetch("/api/jobs?limit=3");
      const data = await res.json();
      setRecentJobs(data);
    } catch (err) {
      setRecentJobs([]);
    }
  };

  useEffect(() => {
    const loadDashboardData = async () => {
      setIsLoading(true);
      setError(null);

      try {
        await Promise.all([
          fetchDashboardMetrics(),
          fetchCandidatosQualificados(),
          fetchRecentJobs(),
        ]);
      } catch (err) {
        console.error("Erro geral ao carregar dashboard:", err);
        setError("Erro ao carregar dados do dashboard");
      } finally {
        setIsLoading(false);
      }
    };

    loadDashboardData();
  }, []);

  const handleCreateJob = () => {
    navigate("create-job");
  };

  const handleEditJob = (id: string) => {
    navigate(`create-job?id=${id}`);
  };

  const handleDeactivateJob = async (id: string) => {
    await fetch(`/api/jobs/${id}/toggle-status`, { method: "PATCH" });
    fetchRecentJobs();
  };

  const handleDeleteJob = async (id: string) => {
    await fetch(`/api/jobs/${id}`, { method: "DELETE" });
    fetchRecentJobs();
  };

  const handleViewCandidates = (id: string) => {
    navigate(`candidates/${id}`);
  };

  // Dados dos gráficos baseados nas métricas do backend
  const barChartData = {
    labels: metrics?.charts?.candidaturasMensais?.map((item) => item.month) || [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
    ],
    datasets: [
      {
        label: "Candidaturas",
        data: metrics?.charts?.candidaturasMensais?.map(
          (item) => item.applications
        ) || [0, 0, 0, 0, 0, 0],
        backgroundColor: "#EC4899",
        borderRadius: 6,
        borderColor: "#EC4899",
        borderWidth: 1,
      },
    ],
  };

  const doughnutChartData = {
    labels: metrics?.charts?.statusCandidatos?.map((item) => item.status) || [
      "Sem dados",
    ],
    datasets: [
      {
        data: metrics?.charts?.statusCandidatos?.map((item) => item.count) || [
          1,
        ],
        backgroundColor: metrics?.charts?.statusCandidatos?.map(
          (item) => item.color
        ) || ["#4CAF50", "#F44336", "#FF9800"],
        borderWidth: 2,
        borderColor: "#1F2937",
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "bottom" as const,
        labels: {
          color: "#C2C3CC",
        },
      },
    },
    scales: {
      x: {
        grid: {
          color: "rgba(102, 106, 128, 0.1)",
        },
        ticks: {
          color: "#A3A5B3",
        },
      },
      y: {
        grid: {
          color: "rgba(102, 106, 128, 0.1)",
        },
        ticks: {
          color: "#A3A5B3",
        },
      },
    },
  };

  const doughnutOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "bottom" as const,
        labels: {
          color: "#C2C3CC",
          padding: 20,
        },
      },
    },
    cutout: "70%",
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

  if (error) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <AlertCircle size={48} className="text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-white mb-2">
            Erro ao carregar dados
          </h2>
          <p className="text-dark-300 mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="btn btn-primary"
          >
            Tentar Novamente
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white">Dashboard</h1>
          <p className="text-dark-300 mt-1">
            Gerencie seu processo de recrutamento
          </p>
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
          value={metrics?.metrics.totalCandidaturas.value || 0}
          icon={<UserPlus size={24} className="text-pink-500" />}
          trend={{
            value: parseInt(
              metrics?.metrics.totalCandidaturas.change
                .replace("%", "")
                .replace("+", "") || "0"
            ),
            isPositive:
              metrics?.metrics.totalCandidaturas.change.includes("+") || false,
          }}
          className="text-white"
        />
        <StatCard
          title="Candidatos Qualificados"
          value={metrics?.metrics.candidatosQualificados.value || 0}
          icon={<Users size={24} className="text-purple-500" />}
          trend={{
            value: parseInt(
              metrics?.metrics.candidatosQualificados.change
                .replace("%", "")
                .replace("+", "") || "0"
            ),
            isPositive:
              metrics?.metrics.candidatosQualificados.change.includes("+") ||
              false,
          }}
          className="text-white"
        />
        <StatCard
          title="Taxa de Aprovação"
          value={`${metrics?.metrics.taxaAprovacao.value || 0}%`}
          icon={<TrendingUp size={24} className="text-green-500" />}
          trend={{
            value: parseInt(
              metrics?.metrics.taxaAprovacao.change
                .replace("%", "")
                .replace("+", "") || "0"
            ),
            isPositive:
              metrics?.metrics.taxaAprovacao.change.includes("+") || false,
          }}
          className="text-white"
        />
        <StatCard
          title="Vagas Ativas"
          value={metrics?.metrics.vagasAtivas.value || 0}
          icon={<BriefcaseBusiness size={24} className="text-blue-500" />}
          trend={{
            value: parseInt(
              metrics?.metrics.vagasAtivas.change
                .replace("%", "")
                .replace("+", "") || "0"
            ),
            isPositive:
              metrics?.metrics.vagasAtivas.change.includes("+") || false,
          }}
          className="text-white"
        />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 text-white">
        <ChartContainer title="Candidaturas Mensais">
          <div className="h-64">
            {metrics?.charts?.candidaturasMensais?.length ? (
              <Bar data={barChartData} options={chartOptions} />
            ) : (
              <div className="flex items-center justify-center h-full text-dark-300">
                <div className="text-center">
                  <p className="text-lg mb-2">📊</p>
                  <p>Nenhuma candidatura registrada</p>
                  <p className="text-sm text-dark-500">
                    Dados aparecerão conforme candidatos se candidatarem
                  </p>
                </div>
              </div>
            )}
          </div>
        </ChartContainer>
        <ChartContainer title="Status dos Candidatos">
          <div className="h-64">
            {metrics?.charts?.statusCandidatos?.length ? (
              <Doughnut data={doughnutChartData} options={doughnutOptions} />
            ) : (
              <div className="flex items-center justify-center h-full text-dark-300">
                <div className="text-center">
                  <p className="text-lg mb-2">📈</p>
                  <p>Nenhum status registrado</p>
                  <p className="text-sm text-dark-500">
                    Dados aparecerão conforme candidatos forem avaliados
                  </p>
                </div>
              </div>
            )}
          </div>
        </ChartContainer>
      </div>

      {/* Candidatos Qualificados */}
      {candidatosQualificados.length > 0 && (
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-white">
              Candidatos Recentes
            </h2>
            <button
              onClick={() => navigate("talent-bank")}
              className="text-pink-500 hover:text-pink-400 text-sm font-medium"
            >
              Ver Todos
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {candidatosQualificados.slice(0, 6).map((candidatura) => (
              <div
                key={candidatura.id}
                className="bg-dark-800 border border-dark-700 rounded-lg p-4 hover:border-dark-600 transition-colors"
              >
                <div className="flex items-start space-x-3">
                  <div className="flex-shrink-0">
                    {candidatura.candidate.photoUrl ? (
                      <img
                        src={candidatura.candidate.photoUrl}
                        alt={candidatura.candidate.name}
                        className="w-10 h-10 rounded-full"
                      />
                    ) : (
                      <div className="w-10 h-10 rounded-full bg-gradient-primary flex items-center justify-center">
                        <span className="text-white font-medium text-sm">
                          {candidatura.candidate.name.charAt(0).toUpperCase()}
                        </span>
                      </div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-white font-medium text-sm truncate">
                      {candidatura.candidate.name}
                    </p>
                    <p className="text-dark-300 text-xs truncate">
                      {candidatura.candidate.email}
                    </p>
                    <p className="text-dark-400 text-xs mt-1 truncate">
                      Aplicou para: {candidatura.opportunity.title}
                    </p>
                    <p className="text-dark-500 text-xs">
                      {new Date(candidatura.createdAt).toLocaleDateString(
                        "pt-BR"
                      )}
                    </p>
                  </div>
                </div>
                <div className="mt-3 flex space-x-2">
                  <button
                    onClick={() =>
                      navigate(`candidate/${candidatura.candidate.id}`)
                    }
                    className="flex-1 text-xs py-2 px-3 bg-gradient-primary text-white rounded-md hover:opacity-90 transition-opacity"
                  >
                    Ver Perfil
                  </button>
                  <button
                    onClick={() =>
                      navigate(`candidates/${candidatura.opportunity.id}`)
                    }
                    className="flex-1 text-xs py-2 px-3 bg-dark-700 text-dark-200 rounded-md hover:bg-dark-600 transition-colors"
                  >
                    Ver Vaga
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Recent Jobs */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-white">Vagas Recentes</h2>
          <button
            onClick={() => navigate("manage-jobs")}
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
