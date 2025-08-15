// Service para consumir as APIs do dashboard RH
const API_BASE_URL = 'https://talentlink-wd88.onrender.com';

// Função para obter o token de autenticação
const getAuthToken = () => {
  return localStorage.getItem('authToken') || localStorage.getItem('token') || '';
};

// Headers padrão para as requisições
const getHeaders = () => {
  const token = getAuthToken();
  const headers: Record<string, string> = {
    'Content-Type': 'application/json'
  };
  
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  
  return headers;
};

// Tipos para as respostas da API
export interface DashboardMetrics {
  metrics: {
    totalCandidaturas: {
      value: number;
      change: string;
      period: string;
    };
    candidatosQualificados: {
      value: number;
      change: string;
      period: string;
    };
    taxaAprovacao: {
      value: number;
      change: string;
      period: string;
    };
    vagasAtivas: {
      value: number;
      change: string;
      period: string;
    };
  };
  charts: {
    candidaturasMensais: Array<{
      month: string;
      applications: number;
    }>;
    statusCandidatos: Array<{
      status: string;
      count: number;
      color?: string; // Cor opcional que vem do backend
    }>;
  };
}

export interface CandidatoQualificado {
  id: string;
  createdAt: string;
  candidate: {
    id: string;
    name: string;
    email: string;
    photoUrl?: string;
  };
  opportunity: {
    id: string;
    title: string;
    description: string;
  };
}

export interface DetalhesVaga {
  id: string;
  title: string;
  description: string;
  salary?: string;
  location?: string;
  isActive: boolean;
  createdAt: string;
  responses: Array<{
    id: string;
    createdAt: string;
    candidate: {
      id: string;
      name: string;
      email: string;
      photoUrl?: string;
    };
  }>;
  estatisticas: {
    totalCandidatos: number;
    ultimaCandidatura?: string;
  };
}

// Serviços da API
export const dashboardService = {
  // 📊 Buscar métricas do dashboard
  async getMetrics(): Promise<DashboardMetrics> {
    try {
      const response = await fetch(`${API_BASE_URL}/dashboard/metrics`, {
        method: 'GET',
        headers: getHeaders()
      });

      if (!response.ok) {
        throw new Error(`Erro ao buscar métricas: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Erro ao buscar métricas do dashboard:', error);
      
      // Fallback com dados mockados se API falhar
      return {
        metrics: {
          totalCandidaturas: { value: 0, change: "+0%", period: "from last period" },
          candidatosQualificados: { value: 0, change: "+0%", period: "from last period" },
          taxaAprovacao: { value: 0, change: "+0%", period: "from last period" },
          vagasAtivas: { value: 0, change: "+0%", period: "from last period" }
        },
        charts: {
          candidaturasMensais: [],
          statusCandidatos: []
        }
      };
    }
  },

  // 👥 Buscar candidatos qualificados
  async getCandidatosQualificados(): Promise<CandidatoQualificado[]> {
    try {
      const response = await fetch(`${API_BASE_URL}/dashboard/candidatos`, {
        method: 'GET',
        headers: getHeaders()
      });

      if (!response.ok) {
        throw new Error(`Erro ao buscar candidatos: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Erro ao buscar candidatos qualificados:', error);
      return []; // Retorna array vazio se falhar
    }
  },

  // 📋 Buscar detalhes de uma vaga específica
  async getDetalhesVaga(vagaId: string): Promise<DetalhesVaga> {
    try {
      const response = await fetch(`${API_BASE_URL}/dashboard/vaga/${vagaId}`, {
        method: 'GET',
        headers: getHeaders()
      });

      if (!response.ok) {
        throw new Error(`Erro ao buscar detalhes da vaga: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Erro ao buscar detalhes da vaga:', error);
      throw error;
    }
  }
};

export default dashboardService;
