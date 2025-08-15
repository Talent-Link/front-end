import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  User, 
  Phone, 
  Mail, 
  Upload, 
  Plus, 
  Trash2, 
  Save, 
  ArrowLeft,
  FileText,
  Briefcase,
  GraduationCap,
  Star,
  Brain,
  Sparkles
} from 'lucide-react';
import HeaderCandidato from '../../components/headerCandidato';
import ResumeAnalysisModal from '../../components/ResumeAnalysisModal';
import { profileService } from '../../services/profileService';
import { useResumeAnalysis } from '../../hooks/useResumeAnalysis';

// Types
interface Experience {
  position: string;
  company: string;
  startDate: string;
  endDate: string;
  description: string;
}

interface Education {
  institution: string;
  course: string;
  degree: string;
  startYear: number;
  endYear: number;
}

interface ProfileData {
  phoneNumber: string;
  skills: string[];
  resumeUrl: string;
  experiences: Experience[];
  educations: Education[];
}

const PerfilCandidato: React.FC = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [currentSkill, setCurrentSkill] = useState('');
  const [showResumeAnalysis, setShowResumeAnalysis] = useState(false);
  
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const { canAnalyze, cooldownRemaining, formatCooldownTime } = useResumeAnalysis();
  
  const [profileData, setProfileData] = useState<ProfileData>({
    phoneNumber: '',
    skills: [],
    resumeUrl: '',
    experiences: [{
      position: '',
      company: '',
      startDate: '',
      endDate: '',
      description: ''
    }],
    educations: [{
      institution: '',
      course: '',
      degree: '',
      startYear: new Date().getFullYear(),
      endYear: new Date().getFullYear()
    }]
  });

  // Carregar perfil existente ao montar o componente
  useEffect(() => {
    loadProfile();
    // Tentar sincronizar uploads pendentes
    profileService.syncPendingUploads().catch(console.error);
  }, []);

  const loadProfile = async () => {
    try {
      setIsLoading(true);
      const data = await profileService.getProfile();
      if (data) {
        setProfileData(data);
      }
    } catch (error) {
      console.log('Perfil não encontrado, criando novo...');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    setSuccess('');

    try {
      // Validar dados antes de enviar
      const validationErrors = profileService.validateProfile(profileData);
      if (validationErrors.length > 0) {
        setError(validationErrors.join(', '));
        return;
      }

      await profileService.updateProfile(profileData);
      setSuccess('Perfil atualizado com sucesso!');
      setTimeout(() => setSuccess(''), 3000);
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Erro ao salvar perfil');
    } finally {
      setIsLoading(false);
    }
  };

  const handleUploadResume = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    setError('');

    try {
      const result = await profileService.uploadFile(file);
      setProfileData(prev => ({ ...prev, resumeUrl: result.resumeUrl }));
      
      // Mostrar mensagem específica baseada na resposta da API
      if (result.previousResumeUrl) {
        setSuccess(`${result.message} (currículo anterior substituído)`);
      } else {
        setSuccess(result.message || 'Currículo enviado com sucesso!');
      }
      
      // Se foi salvo localmente, mostrar aviso especial
      if ((result as any).isLocal) {
        setSuccess(`${result.message} ⚠️`);
      }
      
      setTimeout(() => setSuccess(''), 5000);
    } catch (error) {
      console.error('Erro no upload:', error);
      let errorMessage = 'Erro ao enviar currículo';
      
      if (error instanceof Error) {
        if (error.message.includes('PDF')) {
          errorMessage = 'Por favor, selecione apenas arquivos PDF';
        } else if (error.message.includes('5MB')) {
          errorMessage = 'Arquivo muito grande. Tamanho máximo: 5MB';
        } else if (error.message.includes('Token')) {
          errorMessage = 'Sessão expirada. Faça login novamente';
        } else if (error.message.includes('conexão') || error.message.includes('rede')) {
          errorMessage = 'Problema de conexão. Verifique sua internet e tente novamente.';
        } else {
          errorMessage = error.message;
        }
      }
      
      setError(errorMessage);
    } finally {
      setIsUploading(false);
      // Limpar o input para permitir reenvio do mesmo arquivo
      e.target.value = '';
    }
  };

  const handleSyncPendingUploads = async () => {
    setIsSyncing(true);
    setError('');
    
    try {
      await profileService.syncPendingUploads();
      setSuccess('Uploads pendentes sincronizados com sucesso!');
      setTimeout(() => setSuccess(''), 3000);
    } catch (error) {
      console.error('Erro ao sincronizar uploads:', error);
      setError('Erro ao sincronizar uploads pendentes');
    } finally {
      setIsSyncing(false);
    }
  };

  const handleDeleteResume = async () => {
    if (!window.confirm('Tem certeza que deseja excluir seu currículo?')) {
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      const result = await profileService.deleteResume();
      setProfileData(prev => ({ ...prev, resumeUrl: '' }));
      setSuccess(result.message || 'Currículo excluído com sucesso!');
      setTimeout(() => setSuccess(''), 3000);
    } catch (error) {
      console.error('Erro ao excluir currículo:', error);
      setError(error instanceof Error ? error.message : 'Erro ao excluir currículo');
    } finally {
      setIsLoading(false);
    }
  };

  const addSkill = () => {
    if (currentSkill.trim() && !profileData.skills.includes(currentSkill.trim())) {
      setProfileData(prev => ({
        ...prev,
        skills: [...prev.skills, currentSkill.trim()]
      }));
      setCurrentSkill('');
    }
  };

  const removeSkill = (skill: string) => {
    setProfileData(prev => ({
      ...prev,
      skills: prev.skills.filter(s => s !== skill)
    }));
  };

  const addExperience = () => {
    setProfileData(prev => ({
      ...prev,
      experiences: [...prev.experiences, {
        position: '',
        company: '',
        startDate: '',
        endDate: '',
        description: ''
      }]
    }));
  };

  const removeExperience = (index: number) => {
    if (profileData.experiences.length > 1) {
      setProfileData(prev => ({
        ...prev,
        experiences: prev.experiences.filter((_, i) => i !== index)
      }));
    }
  };

  const updateExperience = (index: number, field: keyof Experience, value: string) => {
    setProfileData(prev => ({
      ...prev,
      experiences: prev.experiences.map((exp, i) => 
        i === index ? { ...exp, [field]: value } : exp
      )
    }));
  };

  const addEducation = () => {
    setProfileData(prev => ({
      ...prev,
      educations: [...prev.educations, {
        institution: '',
        course: '',
        degree: '',
        startYear: new Date().getFullYear(),
        endYear: new Date().getFullYear()
      }]
    }));
  };

  const removeEducation = (index: number) => {
    if (profileData.educations.length > 1) {
      setProfileData(prev => ({
        ...prev,
        educations: prev.educations.filter((_, i) => i !== index)
      }));
    }
  };

  const updateEducation = (index: number, field: keyof Education, value: string | number) => {
    setProfileData(prev => ({
      ...prev,
      educations: prev.educations.map((edu, i) => 
        i === index ? { ...edu, [field]: value } : edu
      )
    }));
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <HeaderCandidato />
      
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Header da página */}
        <div className="flex flex-col gap-4 mb-8">
          {/* Primeira linha: Botão voltar + Título */}
          <div className="flex items-start gap-3 md:gap-4">
            <button
              onClick={() => navigate('/dashboard')}
              className="flex-shrink-0 p-2 md:p-3 rounded-lg bg-gray-800 hover:bg-gray-700 transition-colors mt-1"
            >
              <ArrowLeft size={18} className="md:w-5 md:h-5" />
            </button>
            <div className="flex-1 min-w-0">
              <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold bg-gradient-to-r from-pink-500 to-purple-600 bg-clip-text text-transparent leading-tight">
                Meu Perfil
              </h1>
              <p className="text-gray-400 text-sm md:text-base mt-1 md:mt-2">
                Complete seu perfil para receber melhores oportunidades
              </p>
            </div>
          </div>
          
          {/* Segunda linha: Botão de Análise de Currículo */}
          <div className="flex justify-end">
            <button
              onClick={() => setShowResumeAnalysis(true)}
              className={`flex items-center gap-2 px-3 py-2 md:px-4 md:py-2 rounded-lg text-sm md:text-base font-medium transition-all duration-200 shadow-md group relative ${
                canAnalyze 
                  ? 'bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white' 
                  : 'bg-yellow-600 hover:bg-yellow-700 text-white'
              }`}
              title={canAnalyze 
                ? '✨ Análise inteligente do seu perfil - Descubra pontos fortes e receba dicas exclusivas para destacar seu currículo!' 
                : `⏳ Cooldown ativo - Nova análise personalizada disponível em ${formatCooldownTime(cooldownRemaining)}. Vale a pena esperar!`
              }
            >
              <Brain size={16} className="md:w-5 md:h-5" />
              <Sparkles size={14} className="text-yellow-200 md:w-4 md:h-4" />
              <span className="hidden sm:inline">
                {canAnalyze ? 'IA' : formatCooldownTime(cooldownRemaining)}
              </span>
              <span className="sm:hidden">
                {canAnalyze ? 'IA' : '⏳'}
              </span>
            </button>
          </div>
        </div>

        {/* Mensagens de feedback */}
        {error && (
          <div className="mb-6 p-4 bg-red-900 border border-red-700 rounded-lg text-red-200">
            <div className="flex items-center gap-2">
              <span className="text-red-400">❌</span>
              {error}
            </div>
          </div>
        )}
        
        {success && (
          <div className="mb-6 p-4 bg-green-900 border border-green-700 rounded-lg text-green-200">
            <div className="flex items-center gap-2">
              <span className="text-green-400">✅</span>
              {success}
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Informações Básicas */}
          <div className="bg-gray-800 rounded-lg p-6">
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <User size={20} className="text-pink-500" />
              Informações Básicas
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  <Mail size={16} className="inline mr-1" />
                  Email
                </label>
                <input
                  type="email"
                  value={user?.email || ''}
                  disabled
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-gray-400 cursor-not-allowed"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  <Phone size={16} className="inline mr-1" />
                  Telefone
                </label>
                <input
                  type="tel"
                  value={profileData.phoneNumber}
                  onChange={(e) => setProfileData(prev => ({ ...prev, phoneNumber: e.target.value }))}
                  placeholder="+55 (11) 99999-9999"
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500"
                />
              </div>
            </div>
          </div>

          {/* Upload de Currículo */}
          <div className="bg-gray-800 rounded-lg p-6">
            <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
              <FileText size={20} className="text-pink-500" />
              Currículo
            </h2>
            
            {profileData.resumeUrl ? (
              /* Currículo já enviado */
              <div className="space-y-4">
                <div className="p-4 bg-gray-700 rounded-lg border-2 border-green-500">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="flex-shrink-0">
                      <div className="w-12 h-12 bg-green-600 rounded-lg flex items-center justify-center">
                        <FileText size={20} className="text-white" />
                      </div>
                    </div>
                    <div className="flex-1">
                      <h4 className="text-green-400 font-semibold">Currículo disponível</h4>
                      <p className="text-gray-400 text-sm">
                        Arquivo enviado (PDF)
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => {
                        if (profileData.resumeUrl.startsWith('data:')) {
                          // É um arquivo base64, criar blob para download
                          const link = document.createElement('a');
                          link.href = profileData.resumeUrl;
                          link.download = 'curriculo.pdf';
                          link.click();
                        } else {
                          // É uma URL externa
                          window.open(profileData.resumeUrl, '_blank');
                        }
                      }}
                      className="px-4 py-2 bg-pink-600 hover:bg-pink-700 text-white rounded-lg text-sm font-medium transition-colors"
                    >
                      Visualizar
                    </button>
                    <button
                      type="button"
                      onClick={handleDeleteResume}
                      disabled={isLoading || isUploading}
                      className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg text-sm font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isLoading ? 'Excluindo...' : 'Excluir'}
                    </button>
                  </div>
                </div>

                <div className="p-3 bg-yellow-900/20 border border-yellow-600 rounded-lg">
                  <div className="flex items-start gap-2">
                    <span className="text-yellow-400 text-lg">⚠️</span>
                    <div>
                      <p className="text-yellow-200 font-medium text-sm">Novo upload substituirá o atual</p>
                      <p className="text-yellow-300 text-xs">Apenas arquivos PDF (máx. 5MB)</p>
                    </div>
                  </div>
                </div>

                <label className={`flex items-center justify-center gap-3 px-6 py-4 rounded-lg cursor-pointer transition-all duration-200 border-2 border-dashed ${
                  isUploading 
                    ? 'bg-gray-600 border-gray-500 cursor-not-allowed' 
                    : 'bg-pink-600/10 border-pink-500 hover:bg-pink-600/20 hover:border-pink-400'
                }`}>
                  {isUploading ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-pink-400"></div>
                      <span className="text-pink-300 font-medium">Enviando...</span>
                    </>
                  ) : (
                    <>
                      <Upload size={20} className="text-pink-400" />
                      <span className="text-pink-300 font-medium">Substituir Currículo</span>
                    </>
                  )}
                  <input
                    type="file"
                    accept=".pdf"
                    onChange={handleUploadResume}
                    className="hidden"
                    disabled={isUploading || isLoading}
                  />
                </label>
              </div>
            ) : (
              /* Nenhum currículo enviado */
              <div className="space-y-4">
                <div className="text-center py-8">
                  <div className="w-16 h-16 bg-gray-700 rounded-lg flex items-center justify-center mx-auto mb-4">
                    <FileText size={24} className="text-gray-400" />
                  </div>
                  <h4 className="text-gray-300 font-medium mb-2">Nenhum currículo enviado</h4>
                  <p className="text-gray-400 text-sm">Adicione seu currículo para ter mais oportunidades</p>
                </div>

                <label className={`flex items-center justify-center gap-3 px-6 py-4 rounded-lg cursor-pointer transition-all duration-200 border-2 border-dashed ${
                  isUploading 
                    ? 'bg-gray-600 border-gray-500 cursor-not-allowed' 
                    : 'bg-pink-600/10 border-pink-500 hover:bg-pink-600/20 hover:border-pink-400'
                }`}>
                  {isUploading ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-pink-400"></div>
                      <span className="text-pink-300 font-medium">Enviando...</span>
                    </>
                  ) : (
                    <>
                      <Upload size={20} className="text-pink-400" />
                      <span className="text-pink-300 font-medium">Enviar Currículo (PDF)</span>
                    </>
                  )}
                  <input
                    type="file"
                    accept=".pdf"
                    onChange={handleUploadResume}
                    className="hidden"
                    disabled={isUploading || isLoading}
                  />
                </label>

                <div className="text-center text-sm text-gray-400">
                  <p>Apenas arquivos PDF • Máximo 5MB</p>
                </div>
              </div>
            )}

            {/* Verificar se há uploads pendentes */}
            {(() => {
              const pending = JSON.parse(localStorage.getItem('pendingResumeUploads') || '[]');
              return pending.length > 0 ? (
                <div className="mt-4 p-3 bg-yellow-900/20 border border-yellow-600 rounded-lg">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-yellow-400 text-sm">📤</span>
                      <p className="text-yellow-200 text-sm font-medium">
                        {pending.length} upload(s) pendente(s) de sincronização
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={handleSyncPendingUploads}
                      disabled={isSyncing}
                      className="px-3 py-1 bg-yellow-600 hover:bg-yellow-700 disabled:bg-yellow-800 text-white rounded text-xs font-medium transition-colors disabled:opacity-50"
                    >
                      {isSyncing ? 'Sincronizando...' : 'Sincronizar'}
                    </button>
                  </div>
                </div>
              ) : null;
            })()}
          </div>

          {/* Habilidades */}
          <div className="bg-gray-800 rounded-lg p-6">
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <Star size={20} className="text-pink-500" />
              Habilidades
            </h2>
            
            <div className="space-y-4">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={currentSkill}
                  onChange={(e) => setCurrentSkill(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addSkill())}
                  placeholder="Digite uma habilidade..."
                  className="flex-1 px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500"
                />
                <button
                  type="button"
                  onClick={addSkill}
                  className="px-4 py-2 bg-pink-600 hover:bg-pink-700 rounded-lg transition-colors"
                >
                  <Plus size={16} />
                </button>
              </div>
              
              <div className="flex flex-wrap gap-2">
                {profileData.skills.map((skill, index) => (
                  <span
                    key={index}
                    className="flex items-center gap-2 px-3 py-1 bg-gray-700 rounded-full text-sm"
                  >
                    {skill}
                    <button
                      type="button"
                      onClick={() => removeSkill(skill)}
                      className="text-red-400 hover:text-red-300"
                    >
                      <Trash2 size={12} />
                    </button>
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Experiências */}
          <div className="bg-gray-800 rounded-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold flex items-center gap-2">
                <Briefcase size={20} className="text-pink-500" />
                Experiências Profissionais
              </h2>
              <button
                type="button"
                onClick={addExperience}
                className="flex items-center gap-2 px-3 py-1 bg-pink-600 hover:bg-pink-700 rounded-lg transition-colors text-sm"
              >
                <Plus size={16} />
                Adicionar
              </button>
            </div>
            
            <div className="space-y-6">
              {profileData.experiences.map((experience, index) => (
                <div key={index} className="p-4 bg-gray-700 rounded-lg">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="font-medium">Experiência {index + 1}</h3>
                    {profileData.experiences.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeExperience(index)}
                        className="text-red-400 hover:text-red-300"
                      >
                        <Trash2 size={16} />
                      </button>
                    )}
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <input
                      type="text"
                      value={experience.position}
                      onChange={(e) => updateExperience(index, 'position', e.target.value)}
                      placeholder="Cargo"
                      className="px-3 py-2 bg-gray-600 border border-gray-500 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500"
                    />
                    <input
                      type="text"
                      value={experience.company}
                      onChange={(e) => updateExperience(index, 'company', e.target.value)}
                      placeholder="Empresa"
                      className="px-3 py-2 bg-gray-600 border border-gray-500 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500"
                    />
                    <input
                      type="date"
                      value={experience.startDate}
                      onChange={(e) => updateExperience(index, 'startDate', e.target.value)}
                      className="px-3 py-2 bg-gray-600 border border-gray-500 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500"
                    />
                    <input
                      type="date"
                      value={experience.endDate}
                      onChange={(e) => updateExperience(index, 'endDate', e.target.value)}
                      className="px-3 py-2 bg-gray-600 border border-gray-500 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500"
                    />
                  </div>
                  
                  <textarea
                    value={experience.description}
                    onChange={(e) => updateExperience(index, 'description', e.target.value)}
                    placeholder="Descreva suas principais responsabilidades e conquistas..."
                    rows={3}
                    className="w-full px-3 py-2 bg-gray-600 border border-gray-500 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Educação */}
          <div className="bg-gray-800 rounded-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold flex items-center gap-2">
                <GraduationCap size={20} className="text-pink-500" />
                Educação
              </h2>
              <button
                type="button"
                onClick={addEducation}
                className="flex items-center gap-2 px-3 py-1 bg-pink-600 hover:bg-pink-700 rounded-lg transition-colors text-sm"
              >
                <Plus size={16} />
                Adicionar
              </button>
            </div>
            
            <div className="space-y-6">
              {profileData.educations.map((education, index) => (
                <div key={index} className="p-4 bg-gray-700 rounded-lg">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="font-medium">Educação {index + 1}</h3>
                    {profileData.educations.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeEducation(index)}
                        className="text-red-400 hover:text-red-300"
                      >
                        <Trash2 size={16} />
                      </button>
                    )}
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <input
                      type="text"
                      value={education.institution}
                      onChange={(e) => updateEducation(index, 'institution', e.target.value)}
                      placeholder="Instituição"
                      className="px-3 py-2 bg-gray-600 border border-gray-500 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500"
                    />
                    <input
                      type="text"
                      value={education.course}
                      onChange={(e) => updateEducation(index, 'course', e.target.value)}
                      placeholder="Curso"
                      className="px-3 py-2 bg-gray-600 border border-gray-500 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500"
                    />
                    <input
                      type="text"
                      value={education.degree}
                      onChange={(e) => updateEducation(index, 'degree', e.target.value)}
                      placeholder="Grau (Bacharel, Mestre, etc.)"
                      className="px-3 py-2 bg-gray-600 border border-gray-500 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500"
                    />
                    <div className="flex gap-2">
                      <input
                        type="number"
                        value={education.startYear}
                        onChange={(e) => updateEducation(index, 'startYear', parseInt(e.target.value))}
                        placeholder="Ano início"
                        min="1900"
                        max="2030"
                        className="flex-1 px-3 py-2 bg-gray-600 border border-gray-500 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500"
                      />
                      <input
                        type="number"
                        value={education.endYear}
                        onChange={(e) => updateEducation(index, 'endYear', parseInt(e.target.value))}
                        placeholder="Ano fim"
                        min="1900"
                        max="2030"
                        className="flex-1 px-3 py-2 bg-gray-600 border border-gray-500 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Botões de Ação */}
          <div className="flex flex-col sm:flex-row justify-end gap-3 sm:gap-4 pt-4">
            <button
              type="button"
              onClick={() => navigate('/dashboard')}
              className="w-full sm:w-auto px-4 py-3 sm:px-6 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors text-sm sm:text-base font-medium"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="w-full sm:w-auto flex items-center justify-center gap-2 px-4 py-3 sm:px-6 bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm sm:text-base font-medium"
            >
              <Save size={16} className="sm:w-5 sm:h-5" />
              {isLoading ? 'Salvando...' : 'Salvar Perfil'}
            </button>
          </div>
        </form>
      </div>
      
      {/* Modal de Análise de Currículo */}
      {showResumeAnalysis && (
        <ResumeAnalysisModal
          onClose={() => setShowResumeAnalysis(false)}
        />
      )}
    </div>
  );
};

export default PerfilCandidato;
