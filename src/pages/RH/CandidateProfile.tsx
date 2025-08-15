import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { 
  ArrowLeft, 
  Mail, 
  Phone, 
  Calendar, 
  Briefcase, 
  GraduationCap,
  User,
  Download,
  Star,
  BookOpen,
  MessageSquare,
  X,
  Users,
  FileText,
  Brain,
  Sparkles
} from 'lucide-react';
import { jobService } from '../../services/jobService';

// Interfaces para o Modal
interface ModalProps {
  candidateId: string;
  candidateName: string;
  onClose: () => void;
}

interface AIReport {
  resumo: string;
  pontos_fortes: string;
  pontos_fracos: string;
  adequacao_vaga: string;
  proximos_passos: string;
  informacoes_adicionais: string;
}

interface AIReportModalProps {
  candidateId: string;
  opportunityId: string;
  candidateName: string;
  onClose: () => void;
}

interface ProfileData {
  id: string;
  userId: string;
  phoneNumber?: string;
  resumeUrl?: string;
  skills: string[];
  createdAt: string;
  updatedAt: string;
  user?: {
    id: string;
    name: string;
    email: string;
    photoUrl?: string;
    createdAt: string;
  };
  experiences?: Array<{
    id: string;
    position: string;
    company: string;
    startDate: string;
    endDate?: string | null;
    description?: string;
  }>;
  educations?: Array<{
    id: string;
    institution: string;
    course: string;
    degree: string;
    startYear: number;
    endYear: number;
  }>;
}

// Componente do Modal de Informações Adicionais
const AdditionalInfoModal: React.FC<ModalProps> = ({ candidateId, candidateName, onClose }) => {
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        console.log('🔍 Buscando perfil para candidato:', candidateId);
        
        const token = localStorage.getItem('authToken');
        if (!token) {
          throw new Error('Token não encontrado');
        }

        // ROTA CORRETA: /candidates/profile/:candidateId
        const response = await fetch(`https://talentlink-wd88.onrender.com/candidates/profile/${candidateId}`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });

        console.log('📡 Response status:', response.status);

        if (!response.ok) {
          if (response.status === 404) {
            throw new Error('Candidato ainda não completou o perfil profissional');
          } else if (response.status === 403) {
            throw new Error('Sem permissão - verifique se está logado como RH');
          } else if (response.status === 401) {
            throw new Error('Token expirado - faça login novamente');
          } else {
            throw new Error(`Erro ${response.status}: ${response.statusText}`);
          }
        }

        const data = await response.json();
        console.log('✅ Dados recebidos:', data);
        console.log('📊 Análise:');
        console.log('  - Skills:', data.skills?.length || 0);
        console.log('  - Experiências:', data.experiences?.length || 0);
        console.log('  - Educação:', data.educations?.length || 0);

        setProfile(data);
      } catch (err: any) {
        console.error('❌ Erro:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (candidateId) {
      fetchProfile();
    }
  }, [candidateId]);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR', { 
      year: 'numeric', 
      month: 'long' 
    });
  };

  const calculateDuration = (startDate: string, endDate?: string | null) => {
    const start = new Date(startDate);
    const end = endDate ? new Date(endDate) : new Date();
    
    const months = (end.getFullYear() - start.getFullYear()) * 12 + 
                   (end.getMonth() - start.getMonth());
    
    if (months < 12) {
      return `${months} ${months === 1 ? 'mês' : 'meses'}`;
    } else {
      const years = Math.floor(months / 12);
      const remainingMonths = months % 12;
      
      let duration = `${years} ${years === 1 ? 'ano' : 'anos'}`;
      if (remainingMonths > 0) {
        duration += ` e ${remainingMonths} ${remainingMonths === 1 ? 'mês' : 'meses'}`;
      }
      return duration;
    }
  };

  // Fechar modal ao clicar no backdrop
  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  if (loading) {
    return (
      <div 
        className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4"
        onClick={handleBackdropClick}
      >
        <div className="bg-dark-800 rounded-lg max-w-4xl w-full max-h-[90vh] overflow-hidden border border-dark-700">
          <div className="p-6 border-b border-dark-700 flex items-center justify-between">
            <h2 className="text-xl font-semibold text-white">📊 Informações Adicionais</h2>
            <button onClick={onClose} className="text-gray-400 hover:text-white">
              <X size={24} />
            </button>
          </div>
          <div className="p-8 text-center">
            <div className="animate-pulse flex flex-col items-center">
              <div className="h-16 w-16 rounded-full bg-blue-600/20 mb-4 flex items-center justify-center">
                <Users className="text-blue-400" size={24} />
              </div>
              <p className="text-gray-300">Carregando perfil do candidato...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div 
        className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4"
        onClick={handleBackdropClick}
      >
        <div className="bg-dark-800 rounded-lg max-w-2xl w-full border border-dark-700">
          <div className="p-6 border-b border-dark-700 flex items-center justify-between">
            <h2 className="text-xl font-semibold text-white">📊 Informações Adicionais</h2>
            <button onClick={onClose} className="text-gray-400 hover:text-white">
              <X size={24} />
            </button>
          </div>
          <div className="p-8 text-center">
            <div className="text-red-400 text-5xl mb-4">⚠️</div>
            <h3 className="text-lg font-medium text-red-400 mb-3">Perfil Não Disponível</h3>
            <p className="text-gray-300 mb-4">{error}</p>
            <p className="text-gray-400 text-sm">
              O candidato <strong className="text-white">{candidateName}</strong> ainda não completou seu perfil profissional na plataforma.
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (!profile) {
    return null;
  }

  return (
    <div 
      className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4"
      onClick={handleBackdropClick}
    >
      <div className="bg-dark-800 rounded-lg max-w-6xl w-full max-h-[90vh] overflow-hidden border border-dark-700">
        {/* Header */}
        <div className="p-6 border-b border-dark-700 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-blue-600/20 flex items-center justify-center">
              <Users className="text-blue-400" size={20} />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-white">📊 {profile.user?.name || candidateName}</h2>
              <p className="text-gray-400 text-sm">{profile.user?.email}</p>
              {profile.user?.createdAt && (
                <p className="text-gray-500 text-xs">
                  👤 Membro desde: {new Date(profile.user.createdAt).toLocaleDateString('pt-BR')}
                </p>
              )}
            </div>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-white transition-colors">
            <X size={24} />
          </button>
        </div>

        {/* Content */}
        <div className="overflow-y-auto max-h-[calc(90vh-120px)]">
          <div className="p-6">
            {/* Resumo */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
              <div className="bg-dark-700 rounded-lg p-4 text-center border border-dark-600">
                <p className="text-3xl font-bold text-blue-400 mb-2">
                  {profile.experiences?.length || 0}
                </p>
                <p className="text-gray-400 text-sm">Experiências Profissionais</p>
              </div>
              <div className="bg-dark-700 rounded-lg p-4 text-center border border-dark-600">
                <p className="text-3xl font-bold text-green-400 mb-2">
                  {profile.educations?.length || 0}
                </p>
                <p className="text-gray-400 text-sm">Formações Acadêmicas</p>
              </div>
              <div className="bg-dark-700 rounded-lg p-4 text-center border border-dark-600">
                <p className="text-3xl font-bold text-purple-400 mb-2">
                  {profile.skills?.length || 0}
                </p>
                <p className="text-gray-400 text-sm">Habilidades Técnicas</p>
              </div>
            </div>

            {/* Habilidades */}
            <div className="mb-8">
              <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                <Star className="text-yellow-400" size={20} />
                💡 Habilidades Técnicas ({profile.skills?.length || 0})
              </h3>
              {profile.skills && profile.skills.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {profile.skills.map((skill, index) => (
                    <span 
                      key={index}
                      className="px-3 py-2 bg-blue-600/20 text-blue-400 border border-blue-500/30 rounded-lg text-sm font-medium"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              ) : (
                <div className="bg-dark-700 border-2 border-dashed border-dark-600 rounded-lg p-8 text-center">
                  <div className="text-4xl mb-3 opacity-50">📝</div>
                  <p className="text-gray-400">Nenhuma habilidade cadastrada</p>
                </div>
              )}
            </div>

            {/* Experiências */}
            <div className="mb-8">
              <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                <Briefcase className="text-blue-400" size={20} />
                💼 Experiências Profissionais ({profile.experiences?.length || 0})
              </h3>
              {profile.experiences && profile.experiences.length > 0 ? (
                <div className="space-y-4">
                  {profile.experiences.map((exp, index) => (
                    <div key={index} className="bg-dark-700 border border-dark-600 rounded-lg p-6">
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <h4 className="text-lg font-medium text-white">{exp.position}</h4>
                          <p className="text-blue-400 font-medium">🏢 {exp.company}</p>
                        </div>
                        {!exp.endDate && (
                          <span className="bg-green-600 text-white px-2 py-1 rounded-full text-xs font-medium">
                            Atual
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-4 text-sm text-gray-400 mb-3">
                        <span>📅 {formatDate(exp.startDate)} - {exp.endDate ? formatDate(exp.endDate) : 'Atual'}</span>
                        <span>⏱️ {calculateDuration(exp.startDate, exp.endDate)}</span>
                      </div>
                      {exp.description && (
                        <div className="border-t border-dark-600 pt-3">
                          <p className="text-gray-300 leading-relaxed">{exp.description}</p>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="bg-dark-700 border-2 border-dashed border-dark-600 rounded-lg p-8 text-center">
                  <div className="text-4xl mb-3 opacity-50">💼</div>
                  <p className="text-gray-400">Nenhuma experiência profissional cadastrada</p>
                </div>
              )}
            </div>

            {/* Educação */}
            <div className="mb-8">
              <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                <GraduationCap className="text-green-400" size={20} />
                🎓 Formação Acadêmica ({profile.educations?.length || 0})
              </h3>
              {profile.educations && profile.educations.length > 0 ? (
                <div className="space-y-4">
                  {profile.educations.map((edu, index) => (
                    <div key={index} className="bg-dark-700 border border-dark-600 rounded-lg p-6">
                      <div className="flex items-start justify-between mb-3">
                        <h4 className="text-lg font-medium text-white">{edu.course}</h4>
                        <span className="bg-blue-600 text-white px-2 py-1 rounded-full text-xs font-medium">
                          {edu.degree}
                        </span>
                      </div>
                      <p className="text-green-400 font-medium mb-2">🏫 {edu.institution}</p>
                      <p className="text-gray-400 text-sm">
                        📅 {edu.startYear} - {edu.endYear || 'Em andamento'}
                      </p>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="bg-dark-700 border-2 border-dashed border-dark-600 rounded-lg p-8 text-center">
                  <div className="text-4xl mb-3 opacity-50">🎓</div>
                  <p className="text-gray-400">Nenhuma formação acadêmica cadastrada</p>
                </div>
              )}
            </div>

            {/* Informações de Contato e Currículo */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {profile.phoneNumber && (
                <div className="bg-dark-700 border border-dark-600 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-white mb-3 flex items-center gap-2">
                    <Phone className="text-blue-400" size={20} />
                    📞 Contato
                  </h3>
                  <p className="text-gray-300 flex items-center gap-2">
                    <Phone size={16} />
                    {profile.phoneNumber}
                  </p>
                </div>
              )}

              {profile.resumeUrl && (
                <div className="bg-dark-700 border border-dark-600 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-white mb-3 flex items-center gap-2">
                    <FileText className="text-green-400" size={20} />
                    📄 Currículo
                  </h3>
                  <a 
                    href={profile.resumeUrl} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition-colors"
                  >
                    <Download size={16} />
                    Visualizar Currículo PDF
                  </a>
                  <p className="text-gray-400 text-xs mt-2">
                    Última atualização: {new Date(profile.updatedAt || profile.createdAt).toLocaleDateString('pt-BR')}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Componente do Modal de Relatório de IA
const AIReportModal: React.FC<AIReportModalProps> = ({ candidateId, opportunityId, candidateName, onClose }) => {
  const [report, setReport] = useState<AIReport | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false); // Prevenir execuções múltiplas
  const [hasAttempted, setHasAttempted] = useState(false); // Controlar se já tentou gerar

  const generateReport = async (forceRegenerate = false) => {
    // Evitar execuções simultâneas
    if (isGenerating) {
      console.log('🚫 Geração já em andamento, ignorando nova tentativa');
      return;
    }

    // Se já tem relatório e não é forçado, não regenerar
    if (report && !forceRegenerate) {
      console.log('✅ Relatório já existe, pulando geração');
      setLoading(false);
      return;
    }

    // Se já tentou e falhou, não tentar automaticamente novamente
    if (hasAttempted && error && !forceRegenerate) {
      console.log('⚠️ Já tentou anteriormente e falhou, use "Tentar Novamente" para forçar');
      setLoading(false);
      return;
    }

    try {
      setIsGenerating(true);
      setLoading(true);
      setError(null);
      setHasAttempted(true); // Marcar que tentou gerar
      
      console.log('🤖 === INICIANDO GERAÇÃO DE RELATÓRIO ===');
      console.log('📍 Candidato ID:', candidateId);
      console.log('📍 Oportunidade ID:', opportunityId);
      console.log('👤 Nome do candidato:', candidateName);
      console.log('🔄 Forçar regeneração:', forceRegenerate);
      
      const token = localStorage.getItem('authToken');
      if (!token) {
        console.log('❌ Token não encontrado no localStorage');
        throw new Error('Token não encontrado');
      }
      console.log('🔑 Token encontrado:', token.substring(0, 20) + '...');

      const url = `https://talentlink-wd88.onrender.com/reports/${candidateId}/${opportunityId}`;
      console.log('🔗 URL da requisição:', url);

      // Timeout de 60 segundos para evitar travamentos
      const controller = new AbortController();
      const timeoutId = setTimeout(() => {
        controller.abort();
      }, 60000); // 60 segundos

      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        signal: controller.signal // Adicionar timeout
      });

      clearTimeout(timeoutId); // Limpar timeout se a requisição completou

      console.log('📡 Response status:', response.status);
      console.log('📡 Response headers:', Object.fromEntries(response.headers.entries()));

      // Verificar se é erro 500 mas com JSON válido (problema comum com Gemini)
      if (response.status === 500) {
        console.log('⚠️ Status 500 detectado, tentando parse da resposta mesmo assim...');
        
        try {
          const errorData = await response.text();
          console.log('📄 Corpo completo da resposta 500:', errorData);
          
          // Verificar se é mensagem específica do serviço de IA
          if (errorData.includes('Erro ao obter resposta da IA') || errorData.includes('sobrecarga do serviço')) {
            throw new Error(`Serviço de IA temporariamente indisponível: ${errorData}`);
          }
          
          // Tentar parsear como JSON mesmo sendo 500
          try {
            const parsedData = JSON.parse(errorData);
            console.log('🔍 JSON parseado com sucesso apesar do status 500:', parsedData);
            
            // Se tem um relatório válido, usar mesmo com status 500
            if (parsedData.report && typeof parsedData.report === 'object') {
              console.log('✅ Encontrado relatório válido na resposta 500, prosseguindo...');
              
              // Validar campos do relatório
              const requiredFields = ['resumo', 'pontos_fortes', 'pontos_fracos', 'adequacao_vaga', 'proximos_passos', 'informacoes_adicionais'];
              const missingFields = requiredFields.filter(field => !parsedData.report[field]);
              
              if (missingFields.length > 0) {
                console.log('⚠️ Campos faltando no relatório:', missingFields);
                missingFields.forEach(field => {
                  parsedData.report[field] = 'Informação não disponível no relatório gerado.';
                });
              }
              
              console.log('✅ Relatório de status 500 validado e aceito');
              setReport(parsedData.report);
              return; // Sair da função com sucesso
            }
            
            // Se não tem relatório válido, tratar como erro normal
            throw new Error(`Erro 500: ${parsedData.message || 'Erro interno do servidor sem relatório válido'}`);
            
          } catch (jsonError) {
            console.log('❌ Falha no parse JSON da resposta 500:', jsonError);
            throw new Error(`Erro interno do servidor: ${errorData}`);
          }
        } catch (readError: any) {
          console.log('❌ Erro ao ler corpo da resposta 500:', readError);
          throw new Error(`Erro 500: Falha na comunicação com o servidor - ${readError?.message || 'Erro desconhecido'}`);
        }
      }

      if (!response.ok) {
        // Tentar ler o corpo da resposta para mais detalhes do erro
        let errorMessage = `Erro ${response.status}: ${response.statusText}`;
        
        try {
          const errorData = await response.text();
          console.log('📄 Corpo da resposta de erro:', errorData);
          
          // Tentar parsear como JSON se possível
          try {
            const errorJson = JSON.parse(errorData);
            if (errorJson.message) {
              errorMessage = errorJson.message;
            }
          } catch {
            // Se não for JSON, usar o texto direto
            if (errorData && errorData.length > 0) {
              errorMessage = errorData;
            }
          }
        } catch (parseError) {
          console.log('❌ Erro ao ler corpo da resposta:', parseError);
        }

        if (response.status === 404) {
          throw new Error('Candidato ou oportunidade não encontrados');
        } else if (response.status === 403) {
          throw new Error('Acesso negado - apenas RH pode gerar relatórios');
        } else if (response.status === 401) {
          throw new Error('Token expirado - faça login novamente');
        } else if (response.status === 500) {
          throw new Error(`Erro interno do servidor: ${errorMessage}`);
        } else {
          throw new Error(errorMessage);
        }
      }

      const data = await response.json();
      console.log('✅ Relatório recebido:', data);
      console.log('🔍 Estrutura do relatório:', {
        hasReport: !!data.report,
        reportKeys: data.report ? Object.keys(data.report) : [],
        dataKeys: Object.keys(data)
      });
      
      if (data.report && typeof data.report === 'object') {
        // Validar se o relatório tem as propriedades esperadas
        const requiredFields = ['resumo', 'pontos_fortes', 'pontos_fracos', 'adequacao_vaga', 'proximos_passos', 'informacoes_adicionais'];
        const missingFields = requiredFields.filter(field => !data.report[field]);
        
        if (missingFields.length > 0) {
          console.log('⚠️ Campos faltando no relatório:', missingFields);
          // Preencher campos faltando com mensagem padrão
          missingFields.forEach(field => {
            data.report[field] = 'Informação não disponível no relatório gerado.';
          });
        }
        
        console.log('✅ Relatório validado e pronto para exibição');
        setReport(data.report);
      } else if (data.message && data.message.includes('sucesso')) {
        throw new Error('Relatório gerado mas formato inválido - reporte este erro ao suporte técnico');
      } else {
        throw new Error('Formato de relatório inválido ou não encontrado na resposta');
      }
    } catch (err: any) {
      console.error('❌ Erro ao gerar relatório:', err);
      
      // Tratar erro de timeout especificamente
      if (err.name === 'AbortError') {
        setError('Timeout: A geração do relatório demorou mais de 60 segundos. Tente novamente.');
      } else {
        setError(err.message);
      }
    } finally {
      setLoading(false);
      setIsGenerating(false); // Liberar para novas tentativas
    }
  };

  useEffect(() => {
    // Só tentar gerar se não tem relatório ainda e não tentou antes
    if (candidateId && opportunityId && !isGenerating && !report && !hasAttempted) {
      console.log('🎯 Primeira tentativa de geração automática');
      generateReport();
    } else if (report) {
      console.log('✅ Relatório já existe, definindo loading como false');
      setLoading(false);
    } else if (hasAttempted && error) {
      console.log('⚠️ Já tentou antes e falhou, aguardando ação manual');
      setLoading(false);
    }
  }, [candidateId, opportunityId]); // Remover outras dependências para evitar loops

  // Fechar modal ao clicar no backdrop
  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  if (loading) {
    return (
      <div 
        className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4"
        onClick={handleBackdropClick}
      >
        <div className="bg-dark-800 rounded-lg max-w-4xl w-full max-h-[90vh] overflow-hidden border border-dark-700">
          <div className="p-6 border-b border-dark-700 flex items-center justify-between">
            <h2 className="text-xl font-semibold text-white flex items-center gap-2">
              <Sparkles className="text-blue-400" size={24} />
              🤖 Relatório de IA
            </h2>
            <button onClick={onClose} className="text-gray-400 hover:text-white">
              <X size={24} />
            </button>
          </div>
          <div className="p-8 text-center">
            <div className="animate-pulse flex flex-col items-center">
              <div className="h-16 w-16 rounded-full bg-blue-600/20 mb-4 flex items-center justify-center">
                <Brain className="text-blue-400 animate-spin" size={24} />
              </div>
              <p className="text-gray-300 mb-2">Gerando relatório com Inteligência Artificial...</p>
              <p className="text-gray-400 text-sm">Analisando perfil e respostas do candidato</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div 
        className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4"
        onClick={handleBackdropClick}
      >
        <div className="bg-dark-800 rounded-lg max-w-2xl w-full max-h-[90vh] overflow-hidden border border-dark-700">
          <div className="p-6 border-b border-dark-700 flex items-center justify-between flex-shrink-0">
            <h2 className="text-xl font-semibold text-white flex items-center gap-2">
              <Sparkles className="text-blue-400" size={24} />
              🤖 Relatório de IA
            </h2>
            <button onClick={onClose} className="text-gray-400 hover:text-white">
              <X size={24} />
            </button>
          </div>
          <div className="overflow-y-auto max-h-[calc(90vh-80px)]">
            <div className="p-8 text-center">
              <div className="text-red-400 text-5xl mb-4">⚠️</div>
            <h3 className="text-lg font-medium text-red-400 mb-3">Erro ao Gerar Relatório</h3>
            <div className="bg-red-900/20 border border-red-500/30 rounded-lg p-4 mb-4">
              <p className="text-gray-300 mb-2 font-medium">Detalhes do erro:</p>
              <p className="text-gray-400 text-sm bg-dark-900/50 rounded p-2 font-mono break-words">{error}</p>
            </div>
            <div className="bg-dark-700 rounded-lg p-4 mb-4 text-left">
              <h4 className="text-gray-300 font-medium mb-2">🔍 Informações de Debug:</h4>
              <div className="text-xs text-gray-400 space-y-1">
                <p><strong>Candidato ID:</strong> {candidateId}</p>
                <p><strong>Oportunidade ID:</strong> {opportunityId}</p>
                <p><strong>Nome do Candidato:</strong> {candidateName}</p>
                <p><strong>Endpoint:</strong> /reports/{candidateId}/{opportunityId}</p>
              </div>
            </div>
            <div className="text-gray-400 text-sm">
              <p className="mb-2">Possíveis causas:</p>
              <ul className="text-left text-xs space-y-1 bg-dark-700 rounded p-3">
                <li>• <strong>Sobrecarga do Gemini:</strong> O serviço de IA do Google está temporariamente sobrecarregado</li>
                <li>• <strong>JSON malformado:</strong> O serviço de IA gerou uma resposta inválida ou incompleta</li>
                <li>• <strong>Timeout na IA:</strong> A resposta foi cortada no meio da geração (mais de 60s)</li>
                <li>• <strong>Múltiplas tentativas falharam:</strong> O backend já tentou 3 vezes sem sucesso</li>
                <li>• <strong>Dados muito extensos:</strong> Perfil ou respostas muito longas para processar</li>
                <li>• <strong>Rate limiting:</strong> Muitas requisições simultâneas ao serviço de IA</li>
              </ul>
              <div className="mt-3 p-2 bg-yellow-900/20 border border-yellow-500/30 rounded text-xs">
                <p><strong>💡 Recomendação:</strong> Aguarde 2-3 minutos antes de tentar novamente. 
                O serviço Gemini pode estar em alta demanda no momento.</p>
              </div>
              {error?.includes('sobrecarga do serviço') && (
                <div className="mt-2 p-2 bg-blue-900/20 border border-blue-500/30 rounded text-xs">
                  <p><strong>ℹ️ Status:</strong> O backend já detectou sobrecarga e está aguardando disponibilidade da IA.</p>
                </div>
              )}
            </div>
            <div className="flex gap-3 justify-center mt-6">
              <button
                onClick={() => {
                  console.log('🔄 Tentativa manual iniciada');
                  setError(null);
                  setIsGenerating(false); // Reset do flag
                  
                  // Delay maior para casos de sobrecarga do serviço de IA
                  if (error?.includes('sobrecarga do serviço') || error?.includes('IA após 3 tentativas')) {
                    console.log('⏳ Aguardando 3 segundos devido à sobrecarga da IA...');
                    setTimeout(() => {
                      generateReport(true); // forceRegenerate = true
                    }, 3000);
                  } else {
                    generateReport(true); // forceRegenerate = true
                  }
                }}
                disabled={isGenerating}
                className={`px-4 py-2 ${isGenerating ? 'bg-gray-500 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'} text-white rounded-lg transition-colors text-sm flex items-center gap-2`}
              >
                {isGenerating ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    Gerando...
                  </>
                ) : (
                  <>
                    🔄 Tentar Novamente
                    {(error?.includes('sobrecarga') || error?.includes('IA após 3 tentativas')) && (
                      <span className="text-xs bg-yellow-600 px-1 rounded">+3s delay</span>
                    )}
                  </>
                )}
              </button>
              <button
                onClick={onClose}
                className="px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg transition-colors text-sm"
              >
                Fechar
              </button>
            </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!report) {
    return null;
  }

  return (
    <div 
      className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4"
      onClick={handleBackdropClick}
    >
      <div className="bg-dark-800 rounded-lg max-w-6xl w-full max-h-[90vh] overflow-hidden border border-dark-700">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-900/50 to-purple-900/50 p-6 border-b border-dark-700">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-blue-600/20 flex items-center justify-center border border-blue-500/30">
                <Brain className="text-blue-400" size={20} />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-white flex items-center gap-2">
                  🤖 Relatório de IA
                  <Sparkles className="text-yellow-400" size={18} />
                </h2>
                <p className="text-gray-400 text-sm">Análise detalhada de {candidateName}</p>
              </div>
            </div>
            <button onClick={onClose} className="text-gray-400 hover:text-white transition-colors">
              <X size={24} />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="overflow-y-auto max-h-[calc(90vh-120px)]">
          <div className="p-6 space-y-6">
            {/* Resumo */}
            <div className="bg-gradient-to-r from-blue-900/20 to-purple-900/20 rounded-lg p-6 border border-blue-500/30">
              <h3 className="text-lg font-semibold text-white mb-3 flex items-center gap-2">
                📊 Resumo Executivo
              </h3>
              <p className="text-gray-300 leading-relaxed">{report.resumo}</p>
            </div>

            {/* Grid de Análises */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Pontos Fortes */}
              <div className="bg-green-900/20 rounded-lg p-6 border border-green-500/30">
                <h3 className="text-lg font-semibold text-white mb-3 flex items-center gap-2">
                  ✅ Pontos Fortes
                </h3>
                <p className="text-gray-300 leading-relaxed whitespace-pre-wrap">{report.pontos_fortes}</p>
              </div>

              {/* Pontos Fracos */}
              <div className="bg-orange-900/20 rounded-lg p-6 border border-orange-500/30">
                <h3 className="text-lg font-semibold text-white mb-3 flex items-center gap-2">
                  ⚠️ Pontos de Atenção
                </h3>
                <p className="text-gray-300 leading-relaxed whitespace-pre-wrap">{report.pontos_fracos}</p>
              </div>
            </div>

            {/* Adequação à Vaga */}
            <div className="bg-purple-900/20 rounded-lg p-6 border border-purple-500/30">
              <h3 className="text-lg font-semibold text-white mb-3 flex items-center gap-2">
                🎯 Adequação à Vaga
              </h3>
              <p className="text-gray-300 leading-relaxed whitespace-pre-wrap">{report.adequacao_vaga}</p>
            </div>

            {/* Próximos Passos e Informações Adicionais */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-indigo-900/20 rounded-lg p-6 border border-indigo-500/30">
                <h3 className="text-lg font-semibold text-white mb-3 flex items-center gap-2">
                  🚀 Próximos Passos
                </h3>
                <p className="text-gray-300 leading-relaxed whitespace-pre-wrap">{report.proximos_passos}</p>
              </div>

              <div className="bg-cyan-900/20 rounded-lg p-6 border border-cyan-500/30">
                <h3 className="text-lg font-semibold text-white mb-3 flex items-center gap-2">
                  📋 Informações Adicionais
                </h3>
                <p className="text-gray-300 leading-relaxed whitespace-pre-wrap">{report.informacoes_adicionais}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const CandidateProfile = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  // Receber dados do candidato via state do navigate ou buscar da API
  const candidate = location.state?.candidate || null;
  const answers = location.state?.answers || {};
  const opportunityId = location.state?.opportunityId || null;
  const [loading, setLoading] = useState(!location.state?.candidate);
  const [error, setError] = useState<string | null>(null);
  const [showAdditionalInfo, setShowAdditionalInfo] = useState(false);
  const [showAIReport, setShowAIReport] = useState(false);
  
  useEffect(() => {
    // Se não temos dados do candidato no state, mostrar erro
    if (!candidate && !loading) {
      setError('Dados do candidato não encontrados. Volte à lista de candidatos.');
    }
    setLoading(false);
    
    // Debug: verificar os dados recebidos
    console.log('🔍 Debug CandidateProfile:');
    console.log('  - candidate:', candidate);
    console.log('  - opportunityId:', opportunityId);
    console.log('  - answers:', answers);
    console.log('  - location.state:', location.state);
  }, [candidate, loading, opportunityId, answers, location.state]);
  
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  const formatMemberSince = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR', {
      month: 'long',
      year: 'numeric'
    });
  };

  const downloadResume = async () => {
    if (candidate?.id) {
      try {
        console.log('🔗 Baixando currículo do candidato:', candidate.id);
        
        const resumeData = await jobService.getCandidateResume(candidate.id);
        
        if (resumeData.resumeUrl) {
          window.open(resumeData.resumeUrl, '_blank');
        } else {
          alert(`Currículo não encontrado para ${candidate.name}`);
        }
      } catch (error: any) {
        console.error('❌ Erro ao baixar currículo:', error);
        alert(`Erro ao baixar currículo: ${error.message}`);
      }
    }
  };

  const handleBack = () => {
    navigate(-1);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-center h-64">
            <div className="animate-pulse flex flex-col items-center">
              <div className="h-16 w-16 rounded-full bg-blue-200 mb-4"></div>
              <div className="h-4 w-32 bg-gray-200 rounded mb-2"></div>
              <div className="h-3 w-24 bg-gray-200 rounded"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-4xl mx-auto">
          <div className="bg-red-50 border border-red-200 rounded-lg p-8 text-center">
            <h2 className="text-lg font-medium text-red-800 mb-2">Erro ao carregar candidato</h2>
            <p className="text-red-600 mb-4">{error}</p>
            <div className="flex gap-4 justify-center">
              <button
                onClick={() => navigate(-1)}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
              >
                Voltar à Lista
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!candidate) {
    return (
      <div className="min-h-screen bg-dark-900 p-6">
        <div className="max-w-4xl mx-auto">
          <div className="bg-dark-800 rounded-lg shadow-sm p-8 text-center border border-dark-700">
            <User className="mx-auto text-gray-500 mb-4" size={48} />
            <h2 className="text-lg font-medium text-gray-300 mb-2">Candidato não encontrado</h2>
            <p className="text-gray-400 mb-4">O candidato solicitado não foi localizado.</p>
            <button
              onClick={handleBack}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Voltar
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-dark-900">
      <div className="max-w-6xl mx-auto p-6">
        {/* Header */}
        <div className="mb-6">
          <button
            onClick={handleBack}
            className="flex items-center gap-2 text-gray-400 hover:text-blue-400 font-medium mb-4"
          >
            <ArrowLeft size={20} />
            Voltar
          </button>
        </div>

        {/* Perfil Principal */}
        <div className="bg-dark-800 rounded-lg shadow-sm mb-6 border border-dark-700">
          <div className="p-8">
            <div className="flex flex-col lg:flex-row lg:items-start gap-6">
              {/* Foto e Info Básica */}
              <div className="flex flex-col items-center lg:items-start">
                {candidate.photoUrl ? (
                  <img 
                    src={candidate.photoUrl} 
                    alt={candidate.name}
                    className="w-24 h-24 rounded-full object-cover mb-4"
                  />
                ) : (
                  <div className="w-24 h-24 rounded-full bg-blue-900/30 flex items-center justify-center mb-4 border border-blue-500/30">
                    <User className="text-blue-400" size={32} />
                  </div>
                )}
                <div className="text-center lg:text-left">
                  <h1 className="text-2xl font-bold text-white mb-2">{candidate.name}</h1>
                  <div className="flex items-center gap-2 text-gray-300 mb-2">
                    <Mail size={16} />
                    <span>{candidate.email}</span>
                  </div>
                  {candidate.profile?.phoneNumber && (
                    <div className="flex items-center gap-2 text-gray-300 mb-2">
                      <Phone size={16} />
                      <span>{candidate.profile.phoneNumber}</span>
                    </div>
                  )}
                  <div className="flex items-center gap-2 text-gray-400 text-sm">
                    <Calendar size={16} />
                    <span>Membro desde {formatMemberSince(candidate.memberSince)}</span>
                  </div>
                </div>
              </div>

              {/* Ações */}
              <div className="lg:ml-auto flex flex-col gap-3">
                <button
                  onClick={downloadResume}
                  className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all duration-200 shadow-lg font-medium"
                >
                  <Download size={18} />
                  Baixar Currículo PDF
                </button>
                <button 
                  onClick={() => setShowAdditionalInfo(true)}
                  className="flex items-center gap-2 px-4 py-2 border border-dark-600 text-gray-300 rounded-lg hover:bg-dark-700 transition-colors"
                >
                  <BookOpen size={16} />
                  Ver Informações Adicionais
                </button>
                {opportunityId && (
                  <button 
                    onClick={() => {
                    console.log('Clicou no botão IA, opportunityId:', opportunityId);
                    setShowAIReport(true);
                    }}
                    className="flex items-center justify-center px-2 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg hover:from-purple-700 hover:to-pink-700 transition-all duration-200 shadow-lg font-medium group relative"
                    title="Gerar Relatório IA"
                  >
                    <Sparkles size={16} />
                    <span className="absolute top-10 left-1/2 transform -translate-x-1/2 bg-dark-800 text-white text-sm px-3 py-1 rounded-md opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap border border-dark-600 shadow-lg z-10">
                      Gerar Relatório IA
                    </span>
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Grid de Informações */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Habilidades */}
          {candidate.profile?.skills && candidate.profile.skills.length > 0 && (
            <div className="bg-dark-800 rounded-lg shadow-sm p-6 border border-dark-700">
              <div className="flex items-center gap-2 mb-4">
                <Star className="text-yellow-400" size={20} />
                <h2 className="text-lg font-semibold text-white">Habilidades</h2>
              </div>
              <div className="flex flex-wrap gap-2">
                {candidate.profile.skills.map((skill: string, index: number) => (
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

          {/* Experiência Profissional */}
          {candidate.profile?.experiences && candidate.profile.experiences.length > 0 && (
            <div className="bg-dark-800 rounded-lg shadow-sm p-6 border border-dark-700">
              <div className="flex items-center gap-2 mb-4">
                <Briefcase className="text-blue-400" size={20} />
                <h2 className="text-lg font-semibold text-white">Experiência Profissional</h2>
              </div>
              <div className="space-y-4">
                {candidate.profile.experiences.map((exp: any, index: number) => (
                  <div key={index} className="border-l-2 border-blue-500/30 pl-4">
                    <h3 className="font-medium text-gray-300">{exp.position}</h3>
                    <p className="text-blue-400 font-medium">{exp.company}</p>
                    <p className="text-gray-400 text-sm mb-2">
                      {formatDate(exp.startDate)} - {exp.endDate ? formatDate(exp.endDate) : 'Atual'}
                    </p>
                    {exp.description && (
                      <p className="text-gray-400 text-sm">{exp.description}</p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Formação Acadêmica */}
          {candidate.profile?.educations && candidate.profile.educations.length > 0 && (
            <div className="bg-dark-800 rounded-lg shadow-sm p-6 border border-dark-700">
              <div className="flex items-center gap-2 mb-4">
                <GraduationCap className="text-green-400" size={20} />
                <h2 className="text-lg font-semibold text-white">Formação Acadêmica</h2>
              </div>
              <div className="space-y-4">
                {candidate.profile.educations.map((edu: any, index: number) => (
                  <div key={index} className="border-l-2 border-green-500/30 pl-4">
                    <h3 className="font-medium text-gray-300">{edu.course}</h3>
                    <p className="text-green-400 font-medium">{edu.institution}</p>
                    <p className="text-gray-400 text-sm">
                      {edu.degree} • {edu.startYear} - {edu.endYear}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Respostas do Formulário */}
        {Object.keys(answers).length > 0 && (
          <div className="mt-6 bg-dark-800 rounded-lg shadow-sm border border-dark-700 overflow-hidden">
            <div className="bg-gradient-to-r from-indigo-900/50 to-purple-900/50 p-6 border-b border-dark-700">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-indigo-600/20 rounded-lg border border-indigo-500/30">
                  <MessageSquare className="text-indigo-400" size={24} />
                </div>
                <div>
                  <h2 className="text-xl font-semibold text-white">Respostas do Formulário</h2>
                  <p className="text-gray-400 text-sm">{Object.keys(answers).length} {Object.keys(answers).length === 1 ? 'resposta' : 'respostas'} fornecidas</p>
                </div>
              </div>
            </div>
            
            <div className="p-6">
              <div className="grid gap-6">
                {Object.entries(answers).map(([question, answer], index) => (
                  <div key={index} className="bg-dark-700 rounded-lg p-5 border border-dark-600 hover:border-indigo-500/30 transition-colors">
                    <div className="flex items-start gap-4">
                      <div className="flex-shrink-0 w-8 h-8 rounded-full bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center">
                        <span className="text-indigo-400 font-semibold text-sm">{index + 1}</span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="mb-3">
                          <h3 className="font-semibold text-white leading-relaxed text-base">
                            {question}
                          </h3>
                        </div>
                        <div className="bg-dark-900/50 rounded-lg p-4 border border-dark-600">
                          <p className="text-gray-300 leading-relaxed whitespace-pre-wrap">
                            {String(answer)}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Modal de Informações Adicionais */}
        {showAdditionalInfo && candidate && (
          <AdditionalInfoModal
            candidateId={candidate.id}
            candidateName={candidate.name}
            onClose={() => setShowAdditionalInfo(false)}
          />
        )}

        {/* Modal de Relatório de IA */}
        {showAIReport && candidate && opportunityId && (
          <AIReportModal
            candidateId={candidate.id}
            opportunityId={opportunityId}
            candidateName={candidate.name}
            onClose={() => setShowAIReport(false)}
          />
        )}
      </div>
    </div>
  );
};

export default CandidateProfile;
