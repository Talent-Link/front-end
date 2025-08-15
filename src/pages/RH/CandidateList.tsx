import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Search, Filter, ArrowLeft, Download, ExternalLink, Star } from 'lucide-react';
import TalentBankCandidateCard from '../../components/TalentBankCandidateCard';
import { Job } from '../../types';
import { TalentBankCandidate } from '../../services/talentBankService';
import talentBankService from '../../services/talentBankService';

// Mock data para a vaga (manter temporariamente)
const mockJob: Job = {
  id: '1',
  title: 'Todos os Candidatos',
  description: 'Visualize todos os candidatos da plataforma.',
  requirements: [],
  benefits: [],
  type: 'Remote',
  location: 'Anywhere',
  status: 'Open',
  createdAt: '2023-09-15T10:00:00Z',
  applicantsCount: 0,
};

const CandidateList = () => {
  const { jobId } = useParams<{ jobId: string }>();
  const navigate = useNavigate();
  
  // Estados locais para este componente
  const [candidates, setCandidates] = useState<TalentBankCandidate[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [total, setTotal] = useState(0);
  
  const [job, setJob] = useState<Job | null>(null);
  const [filteredCandidates, setFilteredCandidates] = useState<TalentBankCandidate[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [skillFilter, setSkillFilter] = useState<string>('');
  
  // Carregar todos os candidatos e sincronizar com favoritos
  const loadAllCandidatesWithFavorites = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      console.log('🔄 Carregando todos os candidatos...');
      
      // Carregar todos os candidatos da plataforma
      const allCandidatesResponse = await talentBankService.getAllCandidates();
      console.log('📋 Todos os candidatos:', allCandidatesResponse);
      
      // Carregar candidatos favoritados
      const favoritesResponse = await talentBankService.getTalentBank();
      console.log('⭐ Candidatos favoritados:', favoritesResponse);
      
      // Criar set com IDs dos candidatos favoritados
      const favoriteIds = new Set(favoritesResponse.candidates.map((c: TalentBankCandidate) => c.id));
      
      // Marcar candidatos que estão favoritados
      const candidatesWithFavorites = allCandidatesResponse.candidates.map((candidate: TalentBankCandidate) => ({
        ...candidate,
        isFavorite: favoriteIds.has(candidate.id)
      }));
      
      setCandidates(candidatesWithFavorites);
      setTotal(allCandidatesResponse.total);
      
      console.log('✅ Candidatos sincronizados com favoritos:', candidatesWithFavorites);
      
    } catch (err) {
      console.error('❌ Erro ao carregar candidatos:', err);
      setError(err instanceof Error ? err.message : 'Erro ao carregar candidatos');
    } finally {
      setIsLoading(false);
    }
  };
  
  // Carregar candidatos quando o componente montar
  useEffect(() => {
    loadAllCandidatesWithFavorites();
  }, []);
  
  useEffect(() => {
    // Simular carregamento da vaga
    setJob({
      ...mockJob,
      title: jobId ? `Candidatos para Vaga ${jobId}` : 'Todos os Candidatos',
      applicantsCount: total
    });
  }, [jobId, total]);
  
  useEffect(() => {
    let results = candidates;
    
    // Aplicar filtro de busca
    if (searchTerm) {
      results = results.filter(
        (candidate) =>
          candidate.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          candidate.email.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    // Aplicar filtro de habilidade (buscar nas skills)
    if (skillFilter) {
      results = results.filter((candidate) => {
        // Buscar nas skills
        const hasSkill = candidate.skills?.some((skill: string) =>
          skill.toLowerCase().includes(skillFilter.toLowerCase())
        );
        
        return hasSkill;
      });
    }
    
    setFilteredCandidates(results);
  }, [searchTerm, skillFilter, candidates]);
  
  const handleViewCandidate = (id: string) => {
    navigate(`/candidate/${id}`);
  };
  
  const handleFavoriteToggle = async (candidateId: string) => {
    try {
      // Verificar se já está favoritado
      const candidate = candidates.find(c => c.id === candidateId);
      const isFavorited = candidate?.isFavorite;
      
      if (isFavorited) {
        // Desfavoritar
        await talentBankService.unfavoriteCandidate(candidateId);
        
        // Atualizar estado local
        setCandidates(prev => prev.map(c => 
          c.id === candidateId ? { ...c, isFavorite: false } : c
        ));
      } else {
        // Favoritar
        await talentBankService.favoriteCandidate(candidateId);
        
        // Atualizar estado local
        setCandidates(prev => prev.map(c => 
          c.id === candidateId ? { ...c, isFavorite: true } : c
        ));
      }
      
      console.log(`✅ Candidato ${isFavorited ? 'desfavoritado' : 'favoritado'} com sucesso!`);
    } catch (err) {
      console.error('❌ Erro ao atualizar favorito:', err);
      // Em caso de erro, recarregar para sincronizar
      await loadAllCandidatesWithFavorites();
    }
  };
  
  const handleExportList = () => {
    // Implementar exportação de lista
    const csvContent = [
      ['Nome', 'Email', 'Data de Candidatura', 'Status', 'Pontuação'],
      ...filteredCandidates.map(candidate => [
        candidate.name,
        candidate.email,
        new Date(candidate.appliedAt).toLocaleDateString('pt-BR'),
        candidate.status,
        candidate.score || 0
      ])
    ].map(row => row.join(',')).join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'candidatos.csv';
    a.click();
    window.URL.revokeObjectURL(url);
  };
  
  const handleBackToJobs = () => {
    navigate('/manage-jobs');
  };
  
  const handleViewTalentBank = () => {
    navigate('/talent-bank');
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
          <div className="text-red-500 text-xl mb-4">⚠️ Erro ao carregar candidatos</div>
          <p className="text-dark-300 mb-4">{error}</p>
          <button 
            onClick={() => loadAllCandidatesWithFavorites()} 
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
          <button
            onClick={handleBackToJobs}
            className="flex items-center text-dark-300 hover:text-dark-100 mb-4"
          >
            <ArrowLeft size={18} className="mr-1" />
            <span>Voltar para Vagas</span>
          </button>
          
          <h1 className="text-3xl font-bold">{job?.title}</h1>
          <p className="text-dark-300 mt-1">
            {total} candidatos • Plataforma Geral
          </p>
        </div>
        
        <div className="flex gap-2">
          <button
            onClick={handleViewTalentBank}
            className="btn btn-secondary flex items-center"
          >
            <Star size={18} className="mr-2" />
            <span>Ver Banco de Talentos</span>
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
      
      {/* Filtros */}
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
                className="form-input pl-10 w-full"
              />
            </div>
          </div>
        </div>
      </div>
      
      {/* Stats summary */}
      <div className="flex gap-4 flex-wrap">
        <div className="px-4 py-2 bg-dark-800 rounded-lg flex items-center">
          <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
          <span className="text-sm text-dark-300">
            Pontuação Média: {filteredCandidates.length > 0 ? 
              (filteredCandidates.reduce((sum, c) => sum + (c.score || 0), 0) / filteredCandidates.length).toFixed(1) : 
              '0'}
          </span>
        </div>
        
        <div className="px-4 py-2 bg-dark-800 rounded-lg flex items-center">
          <div className="w-2 h-2 bg-pink-500 rounded-full mr-2"></div>
          <span className="text-sm text-dark-300">
            Aprovados: {filteredCandidates.filter(c => c.status === 'Approved').length}
          </span>
        </div>
        
        <div className="px-4 py-2 bg-dark-800 rounded-lg flex items-center">
          <div className="w-2 h-2 bg-yellow-500 rounded-full mr-2"></div>
          <span className="text-sm text-dark-300">
            Rejeitados: {filteredCandidates.filter(c => c.status === 'Rejected').length}
          </span>
        </div>
        
        <div className="px-4 py-2 bg-dark-800 rounded-lg flex items-center">
          <div className="w-2 h-2 bg-blue-500 rounded-full mr-2"></div>
          <span className="text-sm text-dark-300">
            Pendentes: {filteredCandidates.filter(c => c.status === 'Pending').length}
          </span>
        </div>

        <div className="px-4 py-2 bg-dark-800 rounded-lg flex items-center">
          <div className="w-2 h-2 bg-yellow-400 rounded-full mr-2"></div>
          <span className="text-sm text-dark-300">
            Favoritados: {filteredCandidates.filter(c => c.isFavorite).length}
          </span>
        </div>
      </div>
      
      {/* Candidates list */}
      {filteredCandidates.length > 0 ? (
        <div className="space-y-4">
          <h2 className="text-xl font-semibold">Candidatos Encontrados ({filteredCandidates.length})</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCandidates.map((candidate) => (
              <TalentBankCandidateCard
                key={candidate.id}
                candidate={candidate}
                onView={handleViewCandidate}
                onFavoriteToggle={handleFavoriteToggle}
              />
            ))}
          </div>
        </div>
      ) : (
        <div className="card py-16">
          <div className="text-center">
            <div className="inline-block p-3 rounded-full bg-dark-700 mb-4">
              <Search size={24} className="text-dark-300" />
            </div>
            <h3 className="text-xl font-medium mb-1">Nenhum candidato encontrado</h3>
            <p className="text-dark-400 mb-6">
              {searchTerm || skillFilter 
                ? 'Não encontramos candidatos com os filtros aplicados.'
                : 'Não há candidatos registrados na plataforma.'
              }
            </p>
            {(searchTerm || skillFilter) && (
              <button onClick={() => {
                setSearchTerm('');
                setSkillFilter('');
              }} className="btn btn-outline">
                Limpar Filtros
              </button>
            )}
          </div>
        </div>
      )}
      
      {/* External links */}
      <div className="mt-8 p-4 bg-dark-800 rounded-lg">
        <div className="flex items-center text-dark-300">
          <ExternalLink size={18} className="mr-2 text-pink-500" />
          <span>
            Procurando talentos específicos? 
            <button 
              onClick={handleViewTalentBank}
              className="text-pink-500 hover:text-pink-400 ml-1 underline"
            >
              Acesse seu banco de talentos personalizado
            </button>
          </span>
        </div>
      </div>
    </div>
  );
};

export default CandidateList;