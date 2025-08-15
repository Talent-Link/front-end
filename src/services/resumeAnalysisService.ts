// resumeAnalysisService.ts
const API_BASE_URL = 'https://talentlink-wd88.onrender.com';

interface ResumeAnalysis {
  overall_score: number;
  summary: string;
  strengths: string[];
  suggestions: string[];
  improvements: string[];
}

interface ResumeAnalysisResponse {
  message: string;
  data: {
    candidate: {
      id: string;
      name: string;
      email: string;
    };
    analysis: ResumeAnalysis;
    profile_stats: {
      total_skills: number;
      total_experiences: number;
      total_educations: number;
      has_resume: boolean;
    };
    analyzed_at: string;
  };
}

interface ResumeTipsResponse {
  message: string;
  data: {
    structure: string[];
    content: string[];
    skills: string[];
    common_mistakes: string[];
  };
}

interface ServiceStatusResponse {
  message: string;
  status: string;
  provider: string;
  model: string;
  tested_at: string;
}

export const resumeAnalysisService = {
  // Analisar currículo do candidato
  async analyzeResume(): Promise<ResumeAnalysisResponse> {
    try {
      const token = localStorage.getItem('authToken');
      if (!token) {
        throw new Error('Token de autenticação não encontrado');
      }

      console.log('🤖 Iniciando análise de currículo...');

      // Timeout de 45 segundos para análise de IA
      const controller = new AbortController();
      const timeoutId = setTimeout(() => {
        controller.abort();
      }, 45000);

      const response = await fetch(`${API_BASE_URL}/resume-analysis/analyze`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        signal: controller.signal
      });

      clearTimeout(timeoutId);

      console.log('📡 Response status:', response.status);

      if (!response.ok) {
        let errorMessage = `Erro ${response.status}`;
        
        try {
          const errorData = await response.json();
          errorMessage = errorData.message || errorMessage;
        } catch {
          // Se não conseguir parsear o erro, usar mensagem genérica
        }

        if (response.status === 400) {
          throw new Error('Perfil incompleto: Adicione habilidades, experiências ou formação acadêmica para análise');
        } else if (response.status === 401) {
          throw new Error('Token expirado - faça login novamente');
        } else if (response.status === 403) {
          throw new Error('Acesso negado - apenas candidatos podem usar esta funcionalidade');
        } else if (response.status === 404) {
          throw new Error('Perfil não encontrado - complete seu perfil profissional');
        } else if (response.status === 408) {
          throw new Error('Tempo limite excedido - tente novamente em alguns minutos');
        } else if (response.status === 429) {
          throw new Error('Muitas tentativas - aguarde antes de tentar novamente');
        } else {
          throw new Error(errorMessage);
        }
      }

      const data = await response.json();
      console.log('✅ Análise concluída:', data);
      
      return data;
    } catch (error: any) {
      console.error('❌ Erro na análise:', error);
      
      if (error.name === 'AbortError') {
        throw new Error('Análise interrompida por timeout - tente novamente');
      }
      
      throw error;
    }
  },

  // Obter dicas gerais de currículo
  async getResumeTips(): Promise<ResumeTipsResponse> {
    try {
      const token = localStorage.getItem('authToken');
      if (!token) {
        throw new Error('Token de autenticação não encontrado');
      }

      const response = await fetch(`${API_BASE_URL}/resume-analysis/tips`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error(`Erro ao obter dicas: ${response.status}`);
      }

      return await response.json();
    } catch (error: any) {
      console.error('❌ Erro ao obter dicas:', error);
      throw error;
    }
  },

  // Verificar status do serviço
  async checkServiceStatus(): Promise<ServiceStatusResponse> {
    try {
      const token = localStorage.getItem('authToken');
      if (!token) {
        throw new Error('Token de autenticação não encontrado');
      }

      const response = await fetch(`${API_BASE_URL}/resume-analysis/test`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error(`Serviço indisponível: ${response.status}`);
      }

      return await response.json();
    } catch (error: any) {
      console.error('❌ Erro ao verificar serviço:', error);
      throw error;
    }
  },

  // Gerenciar cooldown de 3 minutos
  getCooldownRemaining(): number {
    const lastAnalysis = localStorage.getItem('lastResumeAnalysis');
    if (!lastAnalysis) return 0;
    
    const lastTime = parseInt(lastAnalysis);
    const now = Date.now();
    const cooldownTime = 3 * 60 * 1000; // 3 minutos em ms
    
    const remaining = cooldownTime - (now - lastTime);
    return Math.max(0, remaining);
  },

  // Marcar última análise
  markAnalysisTime(): void {
    localStorage.setItem('lastResumeAnalysis', Date.now().toString());
  },

  // Verificar se pode fazer análise
  canAnalyze(): boolean {
    return this.getCooldownRemaining() === 0;
  },

  // Formatar tempo restante
  formatCooldownTime(milliseconds: number): string {
    const minutes = Math.ceil(milliseconds / (60 * 1000));
    return `${minutes} minuto${minutes !== 1 ? 's' : ''}`;
  }
};

export type { ResumeAnalysis, ResumeAnalysisResponse, ResumeTipsResponse, ServiceStatusResponse };
