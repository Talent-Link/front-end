import { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Filter, Download, ArrowUpDown, Heart, HeartOff, RefreshCw, AlertCircle } from 'lucide-react';
import CandidateCard from '../../components/CandidateCard';
import { useTalentBank } from '../../hooks/useTalentBank';
import { CandidateFilters } from '../../services/talentBankService';

const TalentBank = () => {
  const navigate = useNavigate();
  
  // Estados do hook customizado
  const {
    candidates,
    isLoading,
    error,
    total,
    hasMore,
    applyFilters,
    clearFilters,
    exportCandidates,
    favoriteCandidate,
    unfavoriteCandidate,
    refreshCandidates,
    loadMoreCandidates,
    favoriteCandidates,
    approvedCandidates
  } = useTalentBank();

  // Estados locais para filtros da UI
  const [searchTerm, setSearchTerm] = useState('');
  const [skillFilter, setSkillFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [sortBy, setSortBy] = useState('date');
  const [showFavorites, setShowFavorites] = useState(false);

  /**
   * Aplicar filtros quando mudarem
   */
  const handleApplyFilters = useCallback(() => {
    const filters: CandidateFilters = {
      search: searchTerm.trim() || undefined,
      skills: skillFilter.trim() || undefined,
      status: statusFilter !== 'all' ? statusFilter : undefined,
      sortBy: sortBy as 'date' | 'score' | 'name',
      page: 1
    };
    
    applyFilters(filters);
  }, [searchTerm, skillFilter, statusFilter, sortBy, applyFilters]);

  /**
   * Limpar todos os filtros
   */
  const handleClearFilters = useCallback(() => {
    setSearchTerm('');
    setSkillFilter('');
    setStatusFilter('all');
    setSortBy('date');
    setShowFavorites(false);
    clearFilters();
  }, [clearFilters]);

  /**
   * Visualizar candidato
   */
  const handleViewCandidate = useCallback((id: string) => {
    navigate(`candidate/${id}`);
  }, [navigate]);

  /**
   * Exportar lista
   */
  const handleExportList = useCallback(async () => {
    try {
      await exportCandidates();
    } catch (error) {
      console.error('Erro ao exportar:', error);
      // Aqui você pode adicionar uma notificação de erro
    }
  }, [exportCandidates]);

  /**
   * Toggle favorito
   */
  const handleToggleFavorite = useCallback(async (candidateId: string, isFavorite: boolean) => {
    try {
      if (isFavorite) {
        await unfavoriteCandidate(candidateId);
      } else {
        await favoriteCandidate(candidateId);
      }
    } catch (error) {
      console.error('Erro ao alterar favorito:', error);
    }
  }, [favoriteCandidate, unfavoriteCandidate]);

  // Candidatos para exibir (favoritos ou todos)
  const displayCandidates = showFavorites ? favoriteCandidates : candidates;

  // Loading state
  if (isLoading && candidates.length === 0) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-pulse flex flex-col items-center">
          <div className="h-12 w-12 rounded-full bg-dark-700 mb-4"></div>
          <div className="h-4 w-32 bg-dark-700 rounded mb-2"></div>
          <div className="h-3 w-24 bg-dark-700 rounded"></div>
        </div>
      </div>
    );
  }

  // Error state
  if (error && candidates.length === 0) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <AlertCircle size={48} className="text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-white mb-2">Erro ao carregar candidatos</h2>
          <p className="text-dark-300 mb-4">{error}</p>
          <button
            onClick={refreshCandidates}
            className="btn btn-primary flex items-center"
          >
            <RefreshCw size={18} className="mr-2" />
            Tentar Novamente
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white">Banco de Talentos</h1>
          <p className="text-dark-300 mt-1">
            {total} candidatos encontrados
            {showFavorites && ` • ${favoriteCandidates.length} favoritos`}
            {' • '}
            {approvedCandidates.length} aprovados
          </p>
        </div>
        
        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowFavorites(!showFavorites)}
            className={`btn ${showFavorites ? 'btn-primary' : 'btn-outline'} flex items-center`}
          >
            {showFavorites ? (
              <><Heart size={18} className="mr-2" />Favoritos</>
            ) : (
              <><HeartOff size={18} className="mr-2" />Todos</>
            )}
          </button>
          
          <button
            onClick={refreshCandidates}
            disabled={isLoading}
            className="btn btn-outline flex items-center"
          >
            <RefreshCw size={18} className={`mr-2 ${isLoading ? 'animate-spin' : ''}`} />
            <span>Atualizar</span>
          </button>
          
          <button
            onClick={handleExportList}
            className="btn btn-outline flex items-center"
          >
            <Download size={18} className="mr-2" />
            <span>Exportar Lista</span>
          </button>
        </div>
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
              onKeyPress={(e) => e.key === 'Enter' && handleApplyFilters()}
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
                onKeyPress={(e) => e.key === 'Enter' && handleApplyFilters()}
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
          
          <div className="flex gap-2">
            <button
              onClick={handleApplyFilters}
              disabled={isLoading}
              className="btn btn-primary whitespace-nowrap"
            >
              {isLoading ? 'Buscando...' : 'Aplicar'}
            </button>
            
            <button
              onClick={handleClearFilters}
              className="btn btn-outline whitespace-nowrap"
            >
              Limpar
            </button>
          </div>
        </div>
      </div>
      
      {/* Candidates list */}
      {displayCandidates.length > 0 ? (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {displayCandidates.map((candidate) => (
              <div key={candidate.id} className="relative">
                <CandidateCard
                  candidate={{
                    ...candidate,
                    phone: candidate.phone || 'N/A'
                  }}
                  onView={handleViewCandidate}
                />
                
                {/* Botão de favorito */}
                <button
                  onClick={() => handleToggleFavorite(candidate.id, candidate.isFavorite || false)}
                  className={`absolute top-3 right-3 p-2 rounded-full transition-colors ${
                    candidate.isFavorite
                      ? 'bg-pink-500 text-white hover:bg-pink-600'
                      : 'bg-dark-800 text-dark-300 hover:bg-dark-700 hover:text-pink-500'
                  }`}
                  title={candidate.isFavorite ? 'Remover dos favoritos' : 'Adicionar aos favoritos'}
                >
                  {candidate.isFavorite ? (
                    <Heart size={16} className="fill-current" />
                  ) : (
                    <Heart size={16} />
                  )}
                </button>
              </div>
            ))}
          </div>
          
          {/* Load More Button */}
          {hasMore && !showFavorites && (
            <div className="flex justify-center">
              <button
                onClick={loadMoreCandidates}
                disabled={isLoading}
                className="btn btn-outline"
              >
                {isLoading ? 'Carregando...' : 'Carregar Mais'}
              </button>
            </div>
          )}
        </>
      ) : (
        <div className="card py-16">
          <div className="text-center">
            <div className="inline-block p-3 rounded-full bg-dark-700 mb-4">
              <Search size={24} className="text-dark-300" />
            </div>
            <h3 className="text-xl font-medium mb-1">
              {showFavorites ? 'Nenhum candidato favoritado' : 'Nenhum candidato encontrado'}
            </h3>
            <p className="text-dark-400 mb-6">
              {showFavorites 
                ? 'Você ainda não possui candidatos favoritos.'
                : 'Não encontramos candidatos com os filtros aplicados.'
              }
            </p>
            <button 
              onClick={showFavorites ? () => setShowFavorites(false) : handleClearFilters} 
              className="btn btn-outline"
            >
              {showFavorites ? 'Ver Todos os Candidatos' : 'Limpar Filtros'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default TalentBank;