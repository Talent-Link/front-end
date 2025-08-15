import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Users, Mail, Calendar, Filter, Search, Download, Eye, Phone, BookOpen, GraduationCap } from 'lucide-react';
import { jobService, OpportunityCandidate, OpportunityCandidatesResponse } from '../../services/jobService';

const OpportunityCandidates = () => {
  const { jobId } = useParams<{ jobId: string }>();
  const navigate = useNavigate();
  
  const [data, setData] = useState<OpportunityCandidatesResponse | null>(null);
  const [filteredCandidates, setFilteredCandidates] = useState<OpportunityCandidate[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [expandedAnswers, setExpandedAnswers] = useState<string | null>(null);
  const [showExportModal, setShowExportModal] = useState(false);
  
  // Filtros
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  useEffect(() => {
    if (jobId) {
      loadCandidates();
    }
  }, [jobId]);

  useEffect(() => {
    applyFilters();
  }, [data, searchTerm, statusFilter]);

  const loadCandidates = async () => {
    try {
      setLoading(true);
      setError(null);
      
      console.log('🔄 Carregando candidatos...');
      const response = await jobService.getOpportunityCandidates(jobId!);
      console.log('📋 Resposta da API:', response);
      
      setData(response);
      
    } catch (err: any) {
      console.error('❌ Erro ao carregar candidatos:', err);
      setError(err.message || 'Erro ao carregar candidatos');
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    if (!data?.candidates) {
      setFilteredCandidates([]);
      return;
    }

    let filtered = [...data.candidates];

    // Filtro de busca por nome ou email
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(candidate => 
        candidate.candidate.name.toLowerCase().includes(term) ||
        candidate.candidate.email.toLowerCase().includes(term)
      );
    }

    // Filtro de status (se implementado no futuro)
    if (statusFilter !== 'all') {
      // Por enquanto não há campo de status na nova estrutura
      // filtered = filtered.filter(candidate => candidate.status === statusFilter);
    }

    setFilteredCandidates(filtered);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const downloadResume = async (candidateId: string, candidateName: string) => {
    try {
      console.log('🔗 Baixando currículo do candidato:', candidateId);
      
      const resumeData = await jobService.getCandidateResume(candidateId);
      
      if (resumeData.resumeUrl) {
        window.open(resumeData.resumeUrl, '_blank');
      } else {
        alert(`Currículo não encontrado para ${candidateName}`);
      }
    } catch (error: any) {
      console.error('❌ Erro ao baixar currículo:', error);
      alert(`Erro ao baixar currículo: ${error.message}`);
    }
  };

  const viewCandidateProfile = (candidateItem: OpportunityCandidate) => {
    console.log('🔗 Navegando para perfil do candidato com opportunityId:', jobId);
    navigate(`/dashboardRH/candidate/${candidateItem.candidate.id}`, {
      state: {
        candidate: candidateItem.candidate,
        answers: candidateItem.answers,
        candidatureDate: candidateItem.candidatureDate,
        opportunityId: jobId // ✅ Adicionando o opportunityId aqui!
      }
    });
  };

  const handleBack = () => {
    navigate('/dashboardRH/manage-jobs');
  };

  const toggleAnswers = (candidatureId: string) => {
    setExpandedAnswers(expandedAnswers === candidatureId ? null : candidatureId);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-center h-64">
            <div className="animate-pulse flex flex-col items-center">
              <div className="h-12 w-12 rounded-full bg-blue-200 mb-4"></div>
              <div className="h-4 w-32 bg-gray-200 rounded mb-2"></div>
              <div className="h-3 w-24 bg-gray-200 rounded"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-dark-900 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-4">
            <button
              onClick={handleBack}
              className="flex items-center gap-2 text-gray-400 hover:text-blue-400 font-medium"
            >
              <ArrowLeft size={20} />
              Voltar para Gerenciar Oportunidades
            </button>
          </div>
          
          <div className="bg-dark-800 rounded-lg shadow-sm p-6 border border-dark-700">
            <div className="flex items-center gap-3 mb-2">
              <Users className="text-blue-400" size={28} />
              <h1 className="text-2xl font-bold text-white">Candidatos da Oportunidade</h1>
            </div>
            <p className="text-gray-300">{data?.opportunity.title || 'Carregando...'}</p>
            <div className="flex items-center gap-6 mt-4 text-sm text-gray-400">
              <div className="flex items-center gap-2">
                <Users size={16} />
                <span className="font-medium">{data?.totalCandidates || 0} candidatos</span>
              </div>
              <div className="flex items-center gap-2">
                <span>{data?.opportunity.location}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Filtros */}
        <div className="bg-dark-800 rounded-lg shadow-sm p-6 mb-6 border border-dark-700">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Busca */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Buscar por nome ou email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-dark-700 border border-dark-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-white placeholder-gray-400"
              />
            </div>

            {/* Filtro de Status */}
            <div className="relative">
              <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-dark-700 border border-dark-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none text-white"
              >
                <option value="all">Todos os status</option>
                <option value="pending">Pendente</option>
                <option value="accepted">Aceito</option>
                <option value="rejected">Rejeitado</option>
              </select>
            </div>

            {/* Exportar */}
            <>
              <button
              className="flex items-center justify-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
              onClick={() => setShowExportModal(true)}
              >
              <Download size={20} />
              Exportar Lista
              </button>
              {showExportModal && (
              <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
                <div className="bg-dark-800 rounded-lg p-6 border border-dark-700 shadow-lg max-w-xs w-full text-center">
                <h2 className="text-lg font-semibold text-white mb-2">Em breve!</h2>
                <p className="text-gray-300 mb-4">A exportação de candidatos estará disponível em breve.</p>
                <button
                  className="mt-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  onClick={() => setShowExportModal(false)}
                >
                  OK
                </button>
                </div>
              </div>
              )}
            </>
          </div>
        </div>

        {/* Contador de resultados */}
        <div className="mb-4">
          <p className="text-gray-400">
            Exibindo {filteredCandidates.length} de {data?.totalCandidates || 0} candidatos
          </p>
        </div>

        {/* Lista de Candidatos */}
        {error ? (
          <div className="bg-red-900/20 border border-red-500/30 rounded-lg p-6 text-center">
            <p className="text-red-400 font-medium">Erro ao carregar candidatos</p>
            <p className="text-red-300 text-sm mt-2">{error}</p>
            <button
              onClick={loadCandidates}
              className="mt-4 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
            >
              Tentar Novamente
            </button>
          </div>
        ) : filteredCandidates.length === 0 ? (
          <div className="bg-dark-800 rounded-lg shadow-sm p-12 text-center border border-dark-700">
            <Users className="mx-auto text-gray-500 mb-4" size={48} />
            <h3 className="text-lg font-medium text-gray-300 mb-2">
              {!data?.candidates?.length ? 'Nenhum candidato encontrado' : 'Nenhum candidato corresponde aos filtros'}
            </h3>
            <p className="text-gray-400">
              {!data?.candidates?.length
                ? 'Esta oportunidade ainda não recebeu candidaturas.'
                : 'Tente ajustar os filtros de busca.'}
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredCandidates.map(item => (
              <div key={item.candidatureId} className="bg-dark-800 rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow border border-dark-700">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center gap-4">
                    {item.candidate.photoUrl ? (
                      <img 
                        src={item.candidate.photoUrl} 
                        alt={item.candidate.name}
                        className="w-12 h-12 rounded-full object-cover"
                      />
                    ) : (
                      <div className="w-12 h-12 rounded-full bg-blue-900/30 flex items-center justify-center border border-blue-500/30">
                        <span className="text-blue-400 font-medium text-lg">
                          {item.candidate.name.charAt(0)}
                        </span>
                      </div>
                    )}
                    <div>
                      <h3 className="font-semibold text-lg text-white">{item.candidate.name}</h3>
                      <div className="flex items-center gap-2 text-gray-300">
                        <Mail size={16} />
                        <span className="text-sm">{item.candidate.email}</span>
                      </div>
                      {item.candidate.profile?.phoneNumber && (
                        <div className="flex items-center gap-2 text-gray-300 mt-1">
                          <Phone size={16} />
                          <span className="text-sm">{item.candidate.profile.phoneNumber}</span>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Calendar size={16} className="text-gray-400" />
                    <span className="text-sm text-gray-400">
                      Candidatura: {formatDate(item.candidatureDate)}
                    </span>
                  </div>
                </div>

                {/* Informações do perfil */}
                {item.candidate.profile && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Habilidades */}
                    {item.candidate.profile.skills.length > 0 && (
                      <div>
                        <h4 className="font-medium text-white mb-2 flex items-center gap-2">
                          <BookOpen size={16} />
                          Habilidades
                        </h4>
                        <div className="flex flex-wrap gap-2">
                          {item.candidate.profile.skills.map((skill, index) => (
                            <span 
                              key={index}
                              className="px-3 py-1 bg-blue-900/30 text-blue-400 border border-blue-500/30 rounded-full text-sm font-medium"
                            >
                              {skill}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Experiências */}
                    {item.candidate.profile.experiences.length > 0 && (
                      <div>
                        <h4 className="font-medium text-white mb-2">Experiência Profissional</h4>
                        <div className="space-y-2">
                          {item.candidate.profile.experiences.slice(0, 2).map((exp, index) => (
                            <div key={index} className="text-sm">
                              <p className="font-medium text-gray-300">{exp.position} - {exp.company}</p>
                              <p className="text-gray-400">
                                {new Date(exp.startDate).getFullYear()} - {exp.endDate ? new Date(exp.endDate).getFullYear() : 'Atual'}
                              </p>
                            </div>
                          ))}
                          {item.candidate.profile.experiences.length > 2 && (
                            <p className="text-gray-400 text-sm">
                              +{item.candidate.profile.experiences.length - 2} experiências adicionais
                            </p>
                          )}
                        </div>
                      </div>
                    )}

                    {/* Formação */}
                    {item.candidate.profile.educations.length > 0 && (
                      <div>
                        <h4 className="font-medium text-white mb-2 flex items-center gap-2">
                          <GraduationCap size={16} />
                          Formação
                        </h4>
                        <div className="space-y-2">
                          {item.candidate.profile.educations.slice(0, 1).map((edu, index) => (
                            <div key={index} className="text-sm">
                              <p className="font-medium text-gray-300">{edu.course}</p>
                              <p className="text-gray-400">{edu.institution}</p>
                              <p className="text-gray-400">{edu.startYear} - {edu.endYear}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* Ações */}
                <div className="flex justify-between items-center mt-6 pt-4 border-t border-dark-600">
                  <div className="flex gap-3">
                    <button
                      onClick={() => downloadResume(item.candidate.id, item.candidate.name)}
                      className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all duration-200 shadow-lg font-medium"
                    >
                      <Download size={16} />
                      Baixar Currículo
                    </button>
                    
                    <button 
                      onClick={() => viewCandidateProfile(item)}
                      className="flex items-center gap-2 px-4 py-2 text-gray-300 border border-dark-600 rounded-lg hover:bg-dark-700 transition-colors"
                    >
                      <Eye size={16} />
                      Ver Perfil Completo
                    </button>
                  </div>

                  {/* Respostas do formulário */}
                  {Object.keys(item.answers).length > 0 && (
                    <button 
                      onClick={() => toggleAnswers(item.candidatureId)}
                      className="flex items-center gap-2 px-4 py-2 text-green-400 border border-green-500/30 rounded-lg hover:bg-green-900/20 transition-colors"
                    >
                      <BookOpen size={16} />
                      {expandedAnswers === item.candidatureId ? 'Ocultar' : 'Ver'} Respostas ({Object.keys(item.answers).length})
                    </button>
                  )}
                </div>

                {/* Seção de Respostas Expandidas */}
                {expandedAnswers === item.candidatureId && Object.keys(item.answers).length > 0 && (
                  <div className="mt-4 pt-4 border-t border-dark-600">
                    <h4 className="font-medium text-white mb-3 flex items-center gap-2">
                      <BookOpen size={16} />
                      Respostas do Formulário
                    </h4>
                    <div className="space-y-3">
                      {Object.entries(item.answers).map(([question, answer], index) => (
                        <div key={index} className="bg-dark-700 rounded-lg p-3 border border-dark-600">
                          <p className="font-medium text-gray-300 text-sm mb-1">{question}</p>
                          <p className="text-gray-400 text-sm">{answer}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default OpportunityCandidates;
