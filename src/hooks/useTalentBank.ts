/**
 * Hook customizado para gerenciamento do Banco de Talentos
 * Implementa as melhores práticas do React com gerenciamento de estado otimizado
 */

import { useState, useEffect, useCallback, useMemo } from 'react';
import talentBankService, { 
  TalentBankCandidate, 
  CandidateFilters, 
  CandidatesResponse 
} from '../services/talentBankService';

// Estados possíveis da requisição
type RequestState = 'idle' | 'loading' | 'success' | 'error';

// Interface do estado do hook
interface UseTalentBankState {
  candidates: TalentBankCandidate[];
  isLoading: boolean;
  error: string | null;
  total: number;
  currentPage: number;
  hasMore: boolean;
}

// Interface para retorno do hook
interface UseTalentBankReturn extends UseTalentBankState {
  // Actions
  loadCandidates: (filters?: CandidateFilters) => Promise<void>;
  loadMoreCandidates: () => Promise<void>;
  refreshCandidates: () => Promise<void>;
  favoriteCandidate: (candidateId: string) => Promise<void>;
  unfavoriteCandidate: (candidateId: string) => Promise<void>;
  exportCandidates: () => Promise<void>;
  
  // Computed values
  filteredCandidates: TalentBankCandidate[];
  approvedCandidates: TalentBankCandidate[];
  favoriteCandidates: TalentBankCandidate[];
  
  // Filter management
  applyFilters: (filters: CandidateFilters) => void;
  clearFilters: () => void;
  currentFilters: CandidateFilters;
}

// Filtros padrão
const DEFAULT_FILTERS: CandidateFilters = {
  page: 1,
  limit: 20,
  sortBy: 'date',
  sortOrder: 'desc',
  status: 'all',
};

export function useTalentBank(): UseTalentBankReturn {
  // Estados principais
  const [state, setState] = useState<UseTalentBankState>({
    candidates: [],
    isLoading: false,
    error: null,
    total: 0,
    currentPage: 1,
    hasMore: true,
  });

  // Estados de filtros
  const [currentFilters, setCurrentFilters] = useState<CandidateFilters>(DEFAULT_FILTERS);
  const [requestState, setRequestState] = useState<RequestState>('idle');

  /**
   * Função principal para carregar candidatos
   */
  const loadCandidates = useCallback(async (filters: CandidateFilters = {}) => {
    const finalFilters = { ...DEFAULT_FILTERS, ...filters };
    setCurrentFilters(finalFilters);
    setRequestState('loading');
    
    setState(prev => ({
      ...prev,
      isLoading: true,
      error: null,
    }));

    try {
      console.log('🔄 Carregando candidatos com filtros:', finalFilters);
      
      const response: CandidatesResponse = await talentBankService.getTalentBank(finalFilters);
      
      console.log('📊 Resposta recebida:', response);
      
      // Validar se a resposta tem a estrutura esperada
      if (!response || typeof response !== 'object') {
        throw new Error('Resposta da API inválida: formato não reconhecido');
      }
      
      // Garantir que candidates seja um array
      const candidates = Array.isArray(response.candidates) ? response.candidates : [];
      const total = typeof response.total === 'number' ? response.total : 0;
      const page = typeof response.page === 'number' ? response.page : finalFilters.page || 1;
      
      console.log(`📋 Processando ${candidates.length} candidatos, total: ${total}, página: ${page}`);
      
      setState(prev => ({
        ...prev,
        candidates: finalFilters.page === 1 ? candidates : [...prev.candidates, ...candidates],
        total: total,
        currentPage: page,
        hasMore: candidates.length === finalFilters.limit,
        isLoading: false,
        error: null,
      }));
      
      setRequestState('success');
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erro ao carregar candidatos';
      
      console.error('❌ Erro no loadCandidates:', error);
      
      setState(prev => ({
        ...prev,
        candidates: finalFilters.page === 1 ? [] : prev.candidates, // Limpa candidatos apenas se for primeira página
        isLoading: false,
        error: errorMessage,
      }));
      
      setRequestState('error');
    }
  }, []);

  /**
   * Carregar mais candidatos (paginação infinita)
   */
  const loadMoreCandidates = useCallback(async () => {
    if (!state.hasMore || state.isLoading) return;

    const nextPage = state.currentPage + 1;
    await loadCandidates({
      ...currentFilters,
      page: nextPage,
    });
  }, [state.hasMore, state.isLoading, state.currentPage, currentFilters, loadCandidates]);

  /**
   * Recarregar candidatos (refresh)
   */
  const refreshCandidates = useCallback(async () => {
    await loadCandidates({ ...currentFilters, page: 1 });
  }, [currentFilters, loadCandidates]);

  /**
   * Favoritar candidato
   */
  const favoriteCandidate = useCallback(async (candidateId: string) => {
    try {
      console.log('❤️ Favoritando candidato:', candidateId);
      
      const result = await talentBankService.favoriteCandidate(candidateId);
      
      console.log('✅ Resultado favoritar:', result);
      
      // Atualizar estado local otimisticamente
      setState(prev => ({
        ...prev,
        candidates: prev.candidates.map(candidate =>
          candidate.id === candidateId
            ? { ...candidate, isFavorite: true }
            : candidate
        ),
      }));
      
      // Opcional: Recarregar dados para garantir sincronização
      // await refreshCandidates();
    } catch (error) {
      console.error('❌ Erro ao favoritar candidato:', error);
      // Recarregar para garantir estado consistente
      await refreshCandidates();
      throw error;
    }
  }, [refreshCandidates]);

  /**
   * Desfavoritar candidato
   */
  const unfavoriteCandidate = useCallback(async (candidateId: string) => {
    try {
      console.log('💔 Desfavoritando candidato:', candidateId);
      
      const result = await talentBankService.unfavoriteCandidate(candidateId);
      
      console.log('✅ Resultado desfavoritar:', result);
      
      // Atualizar estado local otimisticamente
      setState(prev => ({
        ...prev,
        candidates: prev.candidates.map(candidate =>
          candidate.id === candidateId
            ? { ...candidate, isFavorite: false }
            : candidate
        ),
      }));
      
      // Opcional: Recarregar dados para garantir sincronização
      // await refreshCandidates();
    } catch (error) {
      console.error('❌ Erro ao desfavoritar candidato:', error);
      // Recarregar para garantir estado consistente
      await refreshCandidates();
      throw error;
    }
  }, [refreshCandidates]);

  /**
   * Exportar candidatos
   */
  const exportCandidates = useCallback(async () => {
    try {
      const blob = await talentBankService.exportCandidates(currentFilters);
      
      // Criar link de download
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `candidatos-${new Date().toISOString().split('T')[0]}.csv`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Erro ao exportar candidatos:', error);
      // Aqui você pode mostrar uma notificação de erro
    }
  }, [currentFilters]);

  /**
   * Aplicar filtros
   */
  const applyFilters = useCallback((filters: CandidateFilters) => {
    const newFilters = { ...currentFilters, ...filters, page: 1 };
    loadCandidates(newFilters);
  }, [currentFilters, loadCandidates]);

  /**
   * Limpar filtros
   */
  const clearFilters = useCallback(() => {
    loadCandidates(DEFAULT_FILTERS);
  }, [loadCandidates]);

  /**
   * Valores computados com memoização para otimização de performance
   */
  const filteredCandidates = useMemo(() => {
    // Por enquanto retorna todos os candidatos, filtros server-side já aplicados
    return state.candidates;
  }, [state.candidates]);

  const approvedCandidates = useMemo(() => {
    return state.candidates.filter(candidate => candidate.status === 'Approved');
  }, [state.candidates]);

  const favoriteCandidates = useMemo(() => {
    return state.candidates.filter(candidate => candidate.isFavorite);
  }, [state.candidates]);

  /**
   * Carregar dados iniciais
   */
  useEffect(() => {
    if (requestState === 'idle') {
      loadCandidates(DEFAULT_FILTERS);
    }
  }, [loadCandidates, requestState]);

  return {
    // Estado
    ...state,
    
    // Actions
    loadCandidates,
    loadMoreCandidates,
    refreshCandidates,
    favoriteCandidate,
    unfavoriteCandidate,
    exportCandidates,
    
    // Computed values
    filteredCandidates,
    approvedCandidates,
    favoriteCandidates,
    
    // Filter management
    applyFilters,
    clearFilters,
    currentFilters,
  };
}

/**
 * Hook para buscar um candidato específico
 */
export function useCandidate(candidateId: string | undefined) {
  const [candidate, setCandidate] = useState<TalentBankCandidate | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadCandidate = useCallback(async (id: string) => {
    setIsLoading(true);
    setError(null);

    try {
      const candidateData = await talentBankService.getCandidateById(id);
      setCandidate(candidateData);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erro ao carregar candidato';
      setError(errorMessage);
      console.error('Erro ao carregar candidato:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (candidateId) {
      loadCandidate(candidateId);
    }
  }, [candidateId, loadCandidate]);

  return {
    candidate,
    isLoading,
    error,
    refetch: candidateId ? () => loadCandidate(candidateId) : undefined,
  };
}
