import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  Mail, 
  Phone, 
  Briefcase, 
  GraduationCap,
  User,
  Download,
  Star
} from 'lucide-react';
import { profileService } from '../../services/profileService';

interface CandidateProfile {
  id: string;
  userId: string;
  phoneNumber?: string;
  resumeUrl?: string;
  skills: string[];
  experiences: Array<{
    id: string;
    position: string;
    company: string;
    startDate: string;
    endDate?: string | null;
    description?: string;
  }>;
  educations: Array<{
    id: string;
    institution: string;
    course: string;
    degree: string;
    startYear: number;
    endYear: number;
  }>;
  createdAt: string;
  updatedAt: string;
  user: {
    id: string;
    email: string;
    name: string;
    userType: string;
    emailConfirmed: boolean;
    profilePicture?: string;
    createdAt: string;
    updatedAt: string;
  };
}

const CandidateProfileView = () => {
  const { candidateId } = useParams<{ candidateId: string }>();
  const navigate = useNavigate();
  
  const [profile, setProfile] = useState<CandidateProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProfile = async () => {
      if (!candidateId) {
        setError('ID do candidato não fornecido');
        setLoading(false);
        return;
      }

      console.log('🔍 Tentando buscar perfil para candidateId:', candidateId);

      try {
        const data = await profileService.getCandidateProfile(candidateId);
        console.log('✅ Perfil encontrado:', data);
        setProfile(data);
      } catch (err: any) {
        console.error('❌ Erro ao buscar perfil:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
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
      
      if (remainingMonths === 0) {
        return `${years} ${years === 1 ? 'ano' : 'anos'}`;
      } else {
        return `${years} ${years === 1 ? 'ano' : 'anos'} e ${remainingMonths} ${remainingMonths === 1 ? 'mês' : 'meses'}`;
      }
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-dark-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-500 mx-auto mb-4"></div>
          <p className="text-white">Carregando perfil do candidato...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-dark-900 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto p-6">
          <div className="mb-6">
            <User size={48} className="text-gray-400 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-white mb-2">
              Perfil Não Disponível
            </h2>
          </div>
          
          <div className="bg-yellow-500/20 border border-yellow-500 rounded-lg p-4 mb-6">
            <p className="text-yellow-300 text-sm">
              {error.includes('não possui perfil completo') 
                ? 'Este candidato ainda não completou seu perfil profissional no sistema.'
                : error
              }
            </p>
          </div>
          
          <div className="space-y-3">
            <p className="text-gray-400 text-sm">
              Algumas informações básicas podem estar disponíveis no banco de talentos.
            </p>
            
            <button
              onClick={() => navigate(-1)}
              className="w-full bg-pink-500 hover:bg-pink-600 text-white px-4 py-2 rounded-lg transition-colors"
            >
              Voltar ao Banco de Talentos
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen bg-dark-900 flex items-center justify-center">
        <div className="text-center">
          <p className="text-white">Perfil não encontrado</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-dark-900 p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center text-gray-400 hover:text-white transition-colors"
          >
            <ArrowLeft size={20} className="mr-2" />
            Voltar
          </button>
        </div>

        {/* Profile Card */}
        <div className="card mb-6">
          <div className="flex items-start justify-between mb-6">
            <div className="flex items-center">
              {profile.user.profilePicture ? (
                <img 
                  src={profile.user.profilePicture} 
                  alt={profile.user.name}
                  className="w-20 h-20 rounded-full object-cover mr-6"
                />
              ) : (
                <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center mr-6">
                  <User size={32} className="text-white" />
                </div>
              )}
              <div>
                <h1 className="text-3xl font-bold text-white mb-2">{profile.user.name}</h1>
                <div className="flex items-center text-gray-300 mb-2">
                  <Mail size={16} className="mr-2" />
                  {profile.user.email}
                </div>
                {profile.phoneNumber && (
                  <div className="flex items-center text-gray-300">
                    <Phone size={16} className="mr-2" />
                    {profile.phoneNumber}
                  </div>
                )}
              </div>
            </div>
            
            {profile.resumeUrl && (
              <button
                onClick={() => window.open(profile.resumeUrl, '_blank')}
                className="flex items-center bg-pink-500 hover:bg-pink-600 text-white px-4 py-2 rounded-lg transition-colors"
              >
                <Download size={16} className="mr-2" />
                Baixar Currículo
              </button>
            )}
          </div>

          {/* Contact Actions */}
          <div className="flex gap-4 pt-4 border-t border-dark-700">
            <button
              onClick={() => window.open(`mailto:${profile.user.email}`, '_blank')}
              className="flex-1 bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-lg font-medium transition-colors flex items-center justify-center"
            >
              <Mail size={16} className="mr-2" />
              Enviar Email
            </button>
            
            {profile.phoneNumber && (
              <button
                onClick={() => window.open(`tel:${profile.phoneNumber}`, '_blank')}
                className="flex-1 bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded-lg font-medium transition-colors flex items-center justify-center"
              >
                <Phone size={16} className="mr-2" />
                Ligar
              </button>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Skills */}
          {profile.skills && profile.skills.length > 0 && (
            <div className="card">
              <h2 className="text-xl font-semibold text-white mb-4 flex items-center">
                <Star size={20} className="mr-2 text-yellow-400" />
                Habilidades
              </h2>
              <div className="flex flex-wrap gap-2">
                {profile.skills.map((skill, index) => (
                  <span
                    key={index}
                    className="bg-pink-500/20 text-pink-300 px-3 py-1 rounded-full text-sm"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Account Info */}
          <div className="card">
            <h2 className="text-xl font-semibold text-white mb-4 flex items-center">
              <User size={20} className="mr-2 text-blue-400" />
              Informações da Conta
            </h2>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-400">Status:</span>
                <span className={`px-2 py-1 rounded text-xs font-medium ${
                  profile.user.emailConfirmed 
                    ? 'bg-green-500/20 text-green-400' 
                    : 'bg-yellow-500/20 text-yellow-400'
                }`}>
                  {profile.user.emailConfirmed ? 'Email Confirmado' : 'Email Pendente'}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Membro desde:</span>
                <span className="text-white">{formatDate(profile.user.createdAt)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Última atualização:</span>
                <span className="text-white">{formatDate(profile.updatedAt)}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Experience */}
        {profile.experiences && profile.experiences.length > 0 && (
          <div className="card mt-6">
            <h2 className="text-xl font-semibold text-white mb-4 flex items-center">
              <Briefcase size={20} className="mr-2 text-green-400" />
              Experiência Profissional
            </h2>
            <div className="space-y-4">
              {profile.experiences.map((exp) => (
                <div key={exp.id} className="bg-dark-700 p-4 rounded-lg">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h3 className="text-lg font-medium text-white">{exp.position}</h3>
                      <p className="text-pink-400 font-medium">{exp.company}</p>
                    </div>
                    <div className="text-right text-sm">
                      <p className="text-gray-300">
                        {formatDate(exp.startDate)} - {exp.endDate ? formatDate(exp.endDate) : 'Atual'}
                      </p>
                      <p className="text-gray-400">
                        {calculateDuration(exp.startDate, exp.endDate)}
                      </p>
                    </div>
                  </div>
                  {exp.description && (
                    <p className="text-gray-300 mt-2">{exp.description}</p>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Education */}
        {profile.educations && profile.educations.length > 0 && (
          <div className="card mt-6">
            <h2 className="text-xl font-semibold text-white mb-4 flex items-center">
              <GraduationCap size={20} className="mr-2 text-purple-400" />
              Formação Acadêmica
            </h2>
            <div className="space-y-4">
              {profile.educations.map((edu) => (
                <div key={edu.id} className="bg-dark-700 p-4 rounded-lg">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-lg font-medium text-white">{edu.degree} em {edu.course}</h3>
                      <p className="text-purple-400 font-medium">{edu.institution}</p>
                    </div>
                    <div className="text-right text-sm">
                      <p className="text-gray-300">
                        {edu.startYear} - {edu.endYear}
                      </p>
                      <p className="text-gray-400">
                        {edu.endYear - edu.startYear + 1} anos
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CandidateProfileView;
