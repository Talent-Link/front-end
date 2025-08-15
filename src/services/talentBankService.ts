/**
 * Serviço para gerenciamento do Banco de Talentos
 * Implementa as melhores práticas do React para integração com API
 */

const API_BASE_URL = 'https://talentlink-wd88.onrender.com';

// Interface para candidato do banco de talentos
export interface TalentBankCandidate {
  id: string;
  name: string;
  email: string;
  phone?: string;
  score?: number;
  skills: string[];
  experience: {
    company: string;
    position: string;
    duration: string;
    description: string;
  }[];
  education: {
    institution: string;
    degree: string;
    field: string;
    year: string;
  }[];
  appliedAt: string;
  status: 'Approved' | 'Rejected' | 'Pending';
  photoUrl?: string;
  isFavorite?: boolean;
}

// Interface para resposta da API de candidatos
export interface CandidatesResponse {
  candidates: TalentBankCandidate[];
  total: number;
  page: number;
  limit: number;
}

// Parâmetros para busca e filtros
export interface CandidateFilters {
  search?: string;
  skills?: string;
  status?: string;
  sortBy?: 'date' | 'score' | 'name';
  sortOrder?: 'asc' | 'desc';
  page?: number;
  limit?: number;
}

class TalentBankService {
  private getAuthHeaders(): HeadersInit {
    const token = localStorage.getItem('authToken');
    return {
      'Content-Type': 'application/json',
      ...(token && { 'Authorization': `Bearer ${token}` }),
    };
  }

  /**
   * Testar conectividade com o backend
   */
  async testConnection(): Promise<boolean> {
    try {
      console.log('🔍 Testando conexão com:', `${API_BASE_URL}/health`);
      
      const response = await fetch(`${API_BASE_URL}/health`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      console.log('📡 Status do health check:', response.status);
      return response.ok;
    } catch (error) {
      console.error('❌ Erro na conexão:', error);
      return false;
    }
  }

  private async handleResponse<T>(response: Response): Promise<T> {
    if (!response.ok) {
      let errorMessage = `Erro ${response.status}: ${response.statusText}`;
      
      try {
        const errorData = await response.json();
        errorMessage = errorData.message || errorData.error || errorMessage;
      } catch (e) {
        // Se não conseguir fazer parse do JSON, usa a mensagem padrão
        console.warn('Erro ao fazer parse da resposta de erro:', e);
      }
      
      throw new Error(errorMessage);
    }
    return response.json();
  }

  /**
   * GET /talents/candidates - Listar todos os candidatos
   */
  async getAllCandidates(filters: CandidateFilters = {}): Promise<CandidatesResponse> {
    try {
      const queryParams = new URLSearchParams();
      
      if (filters.search) queryParams.append('search', filters.search);
      if (filters.skills) queryParams.append('skills', filters.skills);
      if (filters.status && filters.status !== 'all') queryParams.append('status', filters.status);
      if (filters.sortBy) queryParams.append('sortBy', filters.sortBy);
      if (filters.sortOrder) queryParams.append('sortOrder', filters.sortOrder);
      if (filters.page) queryParams.append('page', filters.page.toString());
      if (filters.limit) queryParams.append('limit', filters.limit.toString());

      const url = `${API_BASE_URL}/talents/candidates${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
      
      console.log('🔍 Fazendo requisição para:', url);
      console.log('📋 Headers:', this.getAuthHeaders());
      
      const response = await fetch(url, {
        method: 'GET',
        headers: this.getAuthHeaders(),
      });

      console.log('📡 Status da resposta:', response.status, response.statusText);
      
      if (!response.ok) {
        // Se houve erro na requisição, retornar estrutura vazia válida
        console.warn(`⚠️ Erro na API (${response.status}): ${response.statusText}`);
        return {
          candidates: [],
          total: 0,
          page: filters.page || 1,
          limit: filters.limit || 20
        };
      }
      
      const data = await this.handleResponse<CandidatesResponse>(response);
      
      // Validar e normalizar a resposta da API
      const normalizedResponse: CandidatesResponse = {
        candidates: Array.isArray(data.candidates) ? data.candidates : [],
        total: typeof data.total === 'number' ? data.total : 0,
        page: typeof data.page === 'number' ? data.page : (filters.page || 1),
        limit: typeof data.limit === 'number' ? data.limit : (filters.limit || 20)
      };
      
      console.log('✅ Resposta normalizada:', normalizedResponse);
      
      return normalizedResponse;
    } catch (error) {
      console.error('❌ Erro ao buscar candidatos:', error);
      
      // Retornar estrutura vazia válida em caso de erro
      return {
        candidates: [],
        total: 0,
        page: filters.page || 1,
        limit: filters.limit || 20
      };
    }
  }

  /**
   * GET /talents/candidates/{id} - Obter candidato por ID
   */
  async getCandidateById(candidateId: string): Promise<TalentBankCandidate> {
    try {
      const response = await fetch(`${API_BASE_URL}/talents/candidates/${candidateId}`, {
        method: 'GET',
        headers: this.getAuthHeaders(),
      });

      return this.handleResponse<TalentBankCandidate>(response);
    } catch (error) {
      console.error('Erro ao buscar candidato:', error);
      throw new Error('Não foi possível carregar os dados do candidato');
    }
  }

  /**
   * GET /bank-talents - Obter banco de talentos
   */
  async getTalentBank(filters: CandidateFilters = {}): Promise<CandidatesResponse> {
    try {
      const queryParams = new URLSearchParams();
      
      if (filters.search) queryParams.append('search', filters.search);
      if (filters.skills) queryParams.append('skills', filters.skills);
      if (filters.status && filters.status !== 'all') queryParams.append('status', filters.status);
      if (filters.sortBy) queryParams.append('sortBy', filters.sortBy);
      if (filters.sortOrder) queryParams.append('sortOrder', filters.sortOrder);
      if (filters.page) queryParams.append('page', filters.page.toString());
      if (filters.limit) queryParams.append('limit', filters.limit.toString());

      const url = `${API_BASE_URL}/bank-talents${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
      
      console.log('🔍 Fazendo requisição para banco de talentos:', url);
      console.log('📋 Headers:', this.getAuthHeaders());
      
      const response = await fetch(url, {
        method: 'GET',
        headers: this.getAuthHeaders(),
      });

      console.log('📡 Status da resposta:', response.status, response.statusText);
      
      if (!response.ok) {
        // Se houve erro na requisição, retornar estrutura vazia válida
        console.warn(`⚠️ Erro na API (${response.status}): ${response.statusText}`);
        return {
          candidates: [],
          total: 0,
          page: filters.page || 1,
          limit: filters.limit || 20
        };
      }
      
      const data = await this.handleResponse<CandidatesResponse>(response);
      
      // Validar e normalizar a resposta da API
      const normalizedResponse: CandidatesResponse = {
        candidates: Array.isArray(data.candidates) ? data.candidates : [],
        total: typeof data.total === 'number' ? data.total : 0,
        page: typeof data.page === 'number' ? data.page : (filters.page || 1),
        limit: typeof data.limit === 'number' ? data.limit : (filters.limit || 20)
      };
      
      console.log('✅ Banco de talentos normalizado:', normalizedResponse);
      
      return normalizedResponse;
    } catch (error) {
      console.error('❌ Erro ao buscar banco de talentos:', error);
      
      // Retornar estrutura vazia válida em caso de erro
      return {
        candidates: [],
        total: 0,
        page: filters.page || 1,
        limit: filters.limit || 20
      };
    }
  }

  /**
   * POST /bank-talents/favorite/{candidateId} - Favoritar candidato
   */
  async favoriteCandidate(candidateId: string): Promise<{ message: string }> {
    try {
      console.log('❤️ Favoritando candidato:', candidateId);
      
      const response = await fetch(`${API_BASE_URL}/bank-talents/favorite/${candidateId}`, {
        method: 'POST',
        headers: this.getAuthHeaders(),
      });

      console.log('📡 Status favoritar:', response.status, response.statusText);

      if (response.ok) {
        const result = await response.json();
        console.log('✅ Candidato favoritado:', result);
        return result;
      } else {
        const error = await response.json().catch(() => ({ message: 'Erro ao favoritar candidato' }));
        throw new Error(error.message || 'Erro ao favoritar candidato');
      }
    } catch (error) {
      console.error('❌ Erro ao favoritar candidato:', error);
      throw error instanceof Error ? error : new Error('Não foi possível favoritar o candidato');
    }
  }

  /**
   * DELETE /bank-talents/unfavorite/{candidateId} - Desfavoritar candidato
   * Ou POST /bank-talents/favorite/{candidateId} como toggle
   */
  async unfavoriteCandidate(candidateId: string): Promise<{ message: string }> {
    try {
      console.log('💔 Desfavoritando candidato:', candidateId);
      
      // Primeiro tenta DELETE unfavorite
      let response = await fetch(`${API_BASE_URL}/bank-talents/unfavorite/${candidateId}`, {
        method: 'DELETE',
        headers: this.getAuthHeaders(),
      });

      // Se DELETE não funcionar (404), tenta POST como toggle
      if (response.status === 404) {
        console.log('⚠️ Endpoint unfavorite não encontrado, tentando toggle');
        response = await fetch(`${API_BASE_URL}/bank-talents/favorite/${candidateId}`, {
          method: 'POST',
          headers: this.getAuthHeaders(),
        });
      }

      console.log('📡 Status desfavoritar:', response.status, response.statusText);

      if (response.ok) {
        const result = await response.json();
        console.log('✅ Candidato desfavoritado:', result);
        return result;
      } else {
        const error = await response.json().catch(() => ({ message: 'Erro ao desfavoritar candidato' }));
        throw new Error(error.message || 'Erro ao desfavoritar candidato');
      }
    } catch (error) {
      console.error('❌ Erro ao desfavoritar candidato:', error);
      throw error instanceof Error ? error : new Error('Não foi possível desfavoritar o candidato');
    }
  }

  /**
   * Exportar lista de candidatos para CSV
   */
  async exportCandidates(filters: CandidateFilters = {}): Promise<Blob> {
    try {
      const candidates = await this.getAllCandidates({ ...filters, limit: 1000 });
      
      // Gerar CSV
      const csvHeaders = [
        'Nome',
        'Email',
        'Telefone',
        'Pontuação',
        'Status',
        'Habilidades',
        'Data de Candidatura'
      ];
      
      const csvRows = candidates.candidates.map(candidate => [
        candidate.name,
        candidate.email,
        candidate.phone || 'N/A',
        candidate.score?.toString() || 'N/A',
        candidate.status,
        candidate.skills.join('; '),
        new Date(candidate.appliedAt).toLocaleDateString('pt-BR')
      ]);
      
      const csvContent = [
        csvHeaders.join(','),
        ...csvRows.map(row => row.map(field => `"${field}"`).join(','))
      ].join('\n');
      
      return new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    } catch (error) {
      console.error('Erro ao exportar candidatos:', error);
      throw new Error('Não foi possível exportar a lista de candidatos');
    }
  }

}

// Instância singleton do serviço
const talentBankService = new TalentBankService();
export default talentBankService;
