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
  opportunities?: string; // Campo adicional com as oportunidades do candidato
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
   * GET /bank-talents - Obter banco de talentos (candidatos favoritados)
   */
  async getTalentBank(filters: CandidateFilters = {}): Promise<CandidatesResponse> {
    try {
      const url = `${API_BASE_URL}/bank-talents`;
      
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
      
      // O endpoint /bank-talents retorna diretamente um array de candidatos favoritados
      const candidatesData = await response.json();
      
      // Verificar se a resposta é um array
      const candidatesArray = Array.isArray(candidatesData) ? candidatesData : [];
      
      console.log('📊 Candidatos recebidos do banco de talentos:', candidatesArray);
      
      // Transformar a estrutura do backend para a estrutura esperada pelo frontend
      const transformedCandidates: TalentBankCandidate[] = candidatesArray.map((candidate: any) => {
        console.log('🔍 Candidato do backend:', candidate);
        console.log('📋 Campos disponíveis:', Object.keys(candidate));
        
        // Use userId se disponível, senão use id
        const candidateId = candidate.userId || candidate.id;
        console.log('🎯 ID final usado:', candidateId);
        
        return {
          id: candidateId,
          name: candidate.name,
          email: candidate.email,
          phone: candidate.phone || '',
          photoUrl: candidate.photoUrl,
          score: 0, // Não disponível no backend
          skills: [], // Não disponível diretamente no backend
          experience: [], // Não disponível diretamente no backend
          education: [], // Não disponível diretamente no backend
          appliedAt: new Date().toISOString(), // Data atual como fallback
          status: 'Approved' as const, // Candidatos favoritados são considerados aprovados
          isFavorite: true, // Todos os candidatos do banco de talentos são favoritos
          opportunities: candidate.opportunities || '' // Campo adicional com oportunidades
        };
      });
      
      // Aplicar filtros localmente já que o endpoint não suporta parâmetros de filtro
      let filteredCandidates = transformedCandidates;
      
      console.log('🔍 Aplicando filtros:', filters);
      console.log('📊 Candidatos antes dos filtros:', filteredCandidates.length);
      
      // Filtro de busca por nome ou email
      if (filters.search) {
        const searchTerm = filters.search.toLowerCase();
        console.log('🔎 Termo de busca:', searchTerm);
        
        filteredCandidates = filteredCandidates.filter(candidate => 
          candidate.name.toLowerCase().includes(searchTerm) ||
          candidate.email.toLowerCase().includes(searchTerm)
        );
        
        console.log('📊 Candidatos após busca:', filteredCandidates.length);
      }
      
      // Filtro por habilidades (nas oportunidades já que skills está vazio)
      if (filters.skills) {
        const skillTerm = filters.skills.toLowerCase();
        console.log('🎯 Filtro de habilidade:', skillTerm);
        
        filteredCandidates = filteredCandidates.filter(candidate => 
          candidate.opportunities?.toLowerCase().includes(skillTerm) ||
          candidate.name.toLowerCase().includes(skillTerm) ||
          candidate.email.toLowerCase().includes(skillTerm)
        );
        
        console.log('📊 Candidatos após filtro de habilidade:', filteredCandidates.length);
      }
      
      // Ordenação
      if (filters.sortBy) {
        filteredCandidates.sort((a, b) => {
          let compareValue = 0;
          
          switch (filters.sortBy) {
            case 'name':
              compareValue = a.name.localeCompare(b.name);
              break;
            case 'date':
              compareValue = new Date(a.appliedAt).getTime() - new Date(b.appliedAt).getTime();
              break;
            case 'score':
              compareValue = (a.score || 0) - (b.score || 0);
              break;
          }
          
          return filters.sortOrder === 'desc' ? -compareValue : compareValue;
        });
      }
      
      // Paginação local
      const page = filters.page || 1;
      const limit = filters.limit || 20;
      const startIndex = (page - 1) * limit;
      const endIndex = startIndex + limit;
      const paginatedCandidates = filteredCandidates.slice(startIndex, endIndex);
      
      const normalizedResponse: CandidatesResponse = {
        candidates: paginatedCandidates,
        total: filteredCandidates.length,
        page: page,
        limit: limit
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
        // Tenta ler a resposta como texto primeiro
        const responseText = await response.text();
        console.log('📋 Resposta do servidor:', responseText);
        
        // Se a resposta não está vazia, tenta parsear como JSON
        if (responseText.trim()) {
          try {
            const result = JSON.parse(responseText);
            console.log('✅ Candidato favoritado (JSON):', result);
            return result;
          } catch {
            // Se não é JSON válido, retorna uma resposta padrão com a mensagem
            console.log('✅ Candidato favoritado (texto):', responseText);
            return { message: responseText || 'Candidato favoritado com sucesso!' };
          }
        } else {
          // Resposta vazia, mas sucesso
          console.log('✅ Candidato favoritado (resposta vazia)');
          return { message: 'Candidato adicionado ao Banco de Talentos com sucesso!' };
        }
      } else {
        // Tenta ler a resposta como texto primeiro
        const errorText = await response.text();
        console.log('❌ Erro do servidor:', errorText);
        
        // Se a resposta é JSON, tenta parsear
        let errorMessage = errorText;
        try {
          const errorJson = JSON.parse(errorText);
          errorMessage = errorJson.message || errorText;
        } catch {
          // Se não é JSON, usa o texto diretamente
        }
        
        throw new Error(errorMessage || 'Erro ao favoritar candidato');
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
        // Tenta ler a resposta como texto primeiro
        const responseText = await response.text();
        console.log('📋 Resposta do servidor:', responseText);
        
        // Se a resposta não está vazia, tenta parsear como JSON
        if (responseText.trim()) {
          try {
            const result = JSON.parse(responseText);
            console.log('✅ Candidato desfavoritado (JSON):', result);
            return result;
          } catch {
            // Se não é JSON válido, retorna uma resposta padrão com a mensagem
            console.log('✅ Candidato desfavoritado (texto):', responseText);
            return { message: responseText || 'Candidato removido do Banco de Talentos com sucesso!' };
          }
        } else {
          // Resposta vazia, mas sucesso
          console.log('✅ Candidato desfavoritado (resposta vazia)');
          return { message: 'Candidato removido do Banco de Talentos com sucesso!' };
        }
      } else {
        // Tenta ler a resposta como texto primeiro
        const errorText = await response.text();
        console.log('❌ Erro do servidor:', errorText);
        
        // Se a resposta é JSON, tenta parsear
        let errorMessage = errorText;
        try {
          const errorJson = JSON.parse(errorText);
          errorMessage = errorJson.message || errorText;
        } catch {
          // Se não é JSON, usa o texto diretamente
        }
        
        throw new Error(errorMessage || 'Erro ao desfavoritar candidato');
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

  // 🔍 Verificar se um candidato específico está favoritado
  async isCandidateFavorited(candidateId: string): Promise<{ isFavorited: boolean; favoritedAt?: string }> {
    try {
      const response = await fetch(`${API_BASE_URL}/bank-talents/status/${candidateId}`, {
        method: 'GET',
        headers: this.getAuthHeaders(),
      });

      if (response.ok) {
        const result = await response.json();
        return {
          isFavorited: result.data.isFavorited,
          favoritedAt: result.data.favoritedAt
        };
      } else {
        // Se der erro, assume que não está favoritado
        return { isFavorited: false };
      }
    } catch (error) {
      console.error('Erro ao verificar candidato favoritado:', error);
      return { isFavorited: false };
    }
  }

  // 🔍 Verificar múltiplos candidatos de uma vez (batch)
  async checkMultipleFavorites(candidateIds: string[]): Promise<Record<string, boolean>> {
    try {
      console.log('🔍 Iniciando verificação de favoritos para:', candidateIds.length, 'candidatos');
      
      // Faz as verificações em paralelo com Promise.allSettled para não falhar se um der erro
      const promises = candidateIds.map(async (id) => {
        try {
          const result = await this.isCandidateFavorited(id);
          return { id, ...result };
        } catch (error) {
          console.warn(`⚠️ Erro ao verificar candidato ${id}:`, error);
          return { id, isFavorited: false };
        }
      });
      
      const results = await Promise.allSettled(promises);
      
      const favoriteMap: Record<string, boolean> = {};
      results.forEach((result, index) => {
        const candidateId = candidateIds[index];
        if (result.status === 'fulfilled') {
          favoriteMap[candidateId] = result.value.isFavorited;
        } else {
          console.warn(`⚠️ Falha ao verificar candidato ${candidateId}:`, result.reason);
          favoriteMap[candidateId] = false;
        }
      });
      
      const favoritedCount = Object.values(favoriteMap).filter(Boolean).length;
      console.log(`✅ Verificação concluída: ${favoritedCount}/${candidateIds.length} candidatos favoritados`);
      
      return favoriteMap;
    } catch (error) {
      console.error('Erro ao verificar candidatos favoritados em lote:', error);
      // Retorna todos como não favoritados em caso de erro
      return candidateIds.reduce((acc, id) => ({ ...acc, [id]: false }), {});
    }
  }

}

// Instância singleton do serviço
const talentBankService = new TalentBankService();
export default talentBankService;
