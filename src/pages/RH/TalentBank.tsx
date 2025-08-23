import { useState, useCallback, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Search,
  Filter,
  Download,
  ArrowUpDown,
  RefreshCw,
  AlertCircle,
} from "lucide-react";
import TalentBankCandidateCard from "../../components/TalentBankCandidateCard";
import { useTalentBank } from "../../hooks/useTalentBank";
import { CandidateFilters } from "../../services/talentBankService";

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
    favoriteCandidate,
    unfavoriteCandidate,
    refreshCandidates,
    loadMoreCandidates,
    favoriteCandidates,
  } = useTalentBank();

  // Estados locais para filtros da UI
  const [searchTerm, setSearchTerm] = useState("");
  const [skillFilter, setSkillFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [sortBy, setSortBy] = useState("date");
  const [showFavorites, setShowFavorites] = useState(false);
  const [showExportModal, setShowExportModal] = useState(false);

  /**
   * Aplicar filtros quando mudarem
   */
  const handleApplyFilters = useCallback(() => {
    const filters: CandidateFilters = {
      search: searchTerm.trim() || undefined,
      skills: skillFilter.trim() || undefined,
      status: statusFilter !== "all" ? statusFilter : undefined,
      sortBy: sortBy as "date" | "score" | "name",
      page: 1,
    };

    applyFilters(filters);
  }, [searchTerm, skillFilter, statusFilter, sortBy, applyFilters]);

  /**
   * Aplicar filtros automaticamente quando os valores mudarem
   */
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      handleApplyFilters();
    }, 500); // Debounce de 500ms

    return () => clearTimeout(timeoutId);
  }, [handleApplyFilters]);

  /**
   * Limpar todos os filtros
   */
  const handleClearFilters = useCallback(() => {
    setSearchTerm("");
    setSkillFilter("");
    setStatusFilter("all");
    setSortBy("date");
    setShowFavorites(false);
    clearFilters();
  }, [clearFilters]);

  /**
   * Visualizar candidato
   */
  const handleViewCandidate = useCallback(
    (id: string) => {
      navigate(`/candidates/profile/${id}`);
    },
    [navigate]
  );

  /**
   * Exportar lista
   */
  const handleExportList = useCallback(async () => {
    setShowExportModal(true);
  }, []);

  /**
   * Toggle favorito
   */
  const handleToggleFavorite = useCallback(
    async (candidateId: string, isFavorite: boolean) => {
      try {
        if (isFavorite) {
          await unfavoriteCandidate(candidateId);
        } else {
          await favoriteCandidate(candidateId);
        }
      } catch (error) {
        console.error("Erro ao alterar favorito:", error);
      }
    },
    [favoriteCandidate, unfavoriteCandidate]
  );

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
          <h2 className="text-xl font-semibold text-white mb-2">
            Erro ao carregar candidatos
          </h2>
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
            {" • "}
          </p>
        </div>

        <div className="flex items-center gap-3">
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
              onKeyPress={(e) => e.key === "Enter" && handleApplyFilters()}
              className="form-input pl-10 w-full"
            />
          </div>

          <div className="flex gap-2">
            <button
              onClick={handleApplyFilters}
              className="btn btn-primary flex items-center"
            >
              <Search size={16} className="mr-1" />
              Buscar
            </button>
            <button onClick={handleClearFilters} className="btn btn-outline">
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
              <TalentBankCandidateCard
                key={candidate.id}
                candidate={candidate}
                onView={handleViewCandidate}
                onFavoriteToggle={(id) =>
                  handleToggleFavorite(id, candidate.isFavorite || false)
                }
              />
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
                {isLoading ? "Carregando..." : "Carregar Mais"}
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
              {showFavorites
                ? "Nenhum candidato favoritado"
                : "Nenhum candidato encontrado"}
            </h3>
            <p className="text-dark-400 mb-6">
              {showFavorites
                ? "Você ainda não possui candidatos favoritos."
                : "Não encontramos candidatos com os filtros aplicados."}
            </p>
            <button
              onClick={
                showFavorites
                  ? () => setShowFavorites(false)
                  : handleClearFilters
              }
              className="btn btn-outline"
            >
              {showFavorites ? "Ver Todos os Candidatos" : "Limpar Filtros"}
            </button>
          </div>
        </div>
      )}

      {/* Export Modal */}
      {showExportModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-dark-800 rounded-lg p-6 border border-dark-700 shadow-lg max-w-xs w-full text-center">
            <h2 className="text-lg font-semibold text-white mb-2">Em breve!</h2>
            <p className="text-gray-300 mb-4">
              A exportação do banco de talentos estará disponível em breve.
            </p>
            <button
              className="mt-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              onClick={() => setShowExportModal(false)}
            >
              OK
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default TalentBank;
