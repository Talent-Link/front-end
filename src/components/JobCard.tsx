import { Clock, MapPin, Users, Loader2 } from 'lucide-react';
import { Job } from '../types';
import { useState } from 'react';
import { jobService } from '../services/jobService';

interface JobCardProps {
  job: Job;
  onEdit: (id: string, currentJobData?: Job) => void;
  onDeactivate: (id: string) => void;
  onDelete: (id: string) => void;
  onView: (id: string) => void;
  onJobUpdate?: (updatedJob: Partial<Job>) => void;
}

const JobCard = ({ job, onEdit, onDeactivate, onDelete, onView, onJobUpdate }: JobCardProps) => {
  const [isToggling, setIsToggling] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentJob, setCurrentJob] = useState(job);
  
  const statusColor = {
    Open: 'bg-green-500',
    Closed: 'bg-yellow-500',
    Completed: 'bg-blue-500',
  }[currentJob.status];

  const statusTranslation = {
    Open: 'Aberta',
    Closed: 'Fechada',
    Completed: 'Concluída',
  }[currentJob.status] || currentJob.status;

  const typeTranslation = {
    'Full-time': 'Tempo Integral',
    'Part-time': 'Meio Período',
    'Contract': 'Contrato',
    'Temporary': 'Temporário',
    'Internship': 'Estágio',
    'Remote': 'Remoto',
    'Hybrid': 'Híbrido',
    'On-site': 'Presencial',
  }[currentJob.type] || currentJob.type;

  const handleToggleActivation = async () => {
    if (isToggling) return;
    
    setIsToggling(true);
    try {
      // Determina se a vaga está ativa baseado no status
      const isCurrentlyActive = currentJob.status === 'Open';
      
      // Chama a API para ativar/desativar
      const updatedJobData = await jobService.toggleJobActivation(currentJob.id, isCurrentlyActive);
      
      // Atualiza o estado local baseado na resposta da API
      const newStatus = updatedJobData.isActive ? 'Open' : 'Closed';
      const updatedJob = {
        ...currentJob,
        status: newStatus as 'Open' | 'Closed' | 'Completed'
      };
      
      setCurrentJob(updatedJob);
      
      // Notifica o componente pai sobre a atualização
      if (onJobUpdate) {
        onJobUpdate(updatedJob);
      }
      
      // Mantém compatibilidade com o callback original
      onDeactivate(currentJob.id);
      
      // Mostra mensagem de sucesso
      const actionText = updatedJobData.isActive ? 'ativada' : 'desativada';
      
      // Verifica se foi simulado
      if (updatedJobData.description?.includes('simulada') || updatedJobData.benefits?.includes('offline')) {
        console.log(`Oportunidade ${actionText} (simulado - API indisponível)`);
      } else {
        console.log(`Oportunidade ${actionText} com sucesso!`);
      }
      
    } catch (error: any) {
      console.error('Erro ao alterar status da vaga:', error);
      
      // Exibe mensagem de erro baseada no tipo
      let errorMessage = 'Erro ao alterar status da vaga';
      
      // Verifica se é erro de CORS ou rede
      if (error.code === 'ERR_NETWORK' || error.message?.includes('CORS') || error.message?.includes('cross-origin') || error.message?.includes('fetch')) {
        errorMessage = 'API temporariamente indisponível. A interface foi atualizada localmente.';
        
        // Se for erro de rede, simula a mudança localmente
        const isCurrentlyActive = currentJob.status === 'Open';
        const newStatus = isCurrentlyActive ? 'Closed' : 'Open';
        const updatedJob = {
          ...currentJob,
          status: newStatus as 'Open' | 'Closed' | 'Completed'
        };
        
        setCurrentJob(updatedJob);
        
        if (onJobUpdate) {
          onJobUpdate(updatedJob);
        }
        
        console.warn('Status alterado localmente devido à API indisponível');
        return; // Não mostra alert de erro
      } else if (error.response?.status === 404) {
        errorMessage = 'Oportunidade não encontrada.';
      } else if (error.response?.status === 401) {
        errorMessage = 'Token inválido. Faça login novamente.';
      } else if (error.response?.status === 403) {
        errorMessage = 'Sem permissão para alterar esta oportunidade.';
      } else if (error.message && !error.message.includes('HTML')) {
        errorMessage = error.message;
      }
      
      // Mostra alert com a mensagem de erro
      alert(errorMessage);
    } finally {
      setIsToggling(false);
    }
  };

  const handleDelete = async () => {
    if (isDeleting) return;
    
    // Confirmação antes de deletar
    const confirmDelete = window.confirm(
      `Tem certeza que deseja deletar a vaga "${currentJob.title}"?\n\nEsta ação não pode ser desfeita.`
    );
    
    if (!confirmDelete) return;
    
    setIsDeleting(true);
    try {
      // Chama a API para deletar
      const result = await jobService.deleteJob(currentJob.id);
      
      console.log('Vaga deletada com sucesso:', result);
      
      // Notifica o componente pai sobre a deleção
      onDelete(currentJob.id);
      
    } catch (error: any) {
      console.error('Erro ao deletar vaga:', error);
      
      // Exibe mensagem de erro baseada no tipo
      let errorMessage = 'Erro ao deletar vaga';
      
      if (error.response?.status === 404) {
        errorMessage = 'Vaga não encontrada.';
      } else if (error.response?.status === 401) {
        errorMessage = 'Token inválido. Faça login novamente.';
      } else if (error.response?.status === 403) {
        errorMessage = 'Sem permissão para deletar esta vaga.';
      } else if (error.message && !error.message.includes('HTML')) {
        errorMessage = error.message;
      }
      
      // Mostra alert com a mensagem de erro
      alert(errorMessage);
    } finally {
      setIsDeleting(false);
    }
  };

  const handleEdit = async () => {
    if (isEditing) return;
    
    setIsEditing(true);
    try {
      // Passa os dados atuais da vaga para o callback de edição
      // Isso permite que a página/modal de edição tenha os dados pré-preenchidos
      onEdit(currentJob.id, currentJob);
      
      console.log('Iniciando edição da oportunidade:', currentJob.id, 'com dados:', currentJob);
      
    } catch (error: any) {
      console.error('Erro ao iniciar edição:', error);
      alert('Erro ao abrir edição da oportunidade');
    } finally {
      setIsEditing(false);
    }
  };

  return (
    <div className="card animate-fade-in hover:shadow-xl transition-shadow">
      <div className="flex justify-between items-start">
        <div>
          <div className="flex items-center mb-2">
            <span className={`h-2.5 w-2.5 rounded-full ${statusColor} mr-2`}></span>
            <span className="text-sm text-dark-300">{statusTranslation}</span>
          </div>
            <h3 className="text-xl font-medium mb-2 text-white">{currentJob.title}</h3>
        </div>
        
        <div className="flex items-center space-x-1">
          <Users size={16} className="text-dark-300" />
          <span className="text-sm text-dark-300">{currentJob.applicantsCount}</span>
        </div>
      </div>
      
      <div className="mt-4 space-y-2">
        <div className="flex items-center text-sm text-dark-300">
          <MapPin size={16} className="mr-1" />
          <span>{currentJob.location} • {typeTranslation}</span>
        </div>
        
        <div className="flex items-center text-sm text-dark-300">
          <Clock size={16} className="mr-1" />
          <span>Publicada em {new Date(currentJob.createdAt).toLocaleDateString('pt-BR')}</span>
        </div>
      </div>
      
      <div className="mt-6 flex flex-wrap gap-2">
        <button 
          onClick={() => onView(currentJob.id)} 
          className="btn btn-primary text-sm flex-1"
        >
          Ver Candidatos
        </button>
        
        <button 
          onClick={handleEdit}
          disabled={isEditing || isToggling || isDeleting}
          className="btn btn-secondary text-sm flex items-center justify-center min-w-[60px]"
        >
          {isEditing ? (
            <>
              <Loader2 size={14} className="animate-spin mr-1" />
              <span className="text-xs">...</span>
            </>
          ) : (
            'Editar'
          )}
        </button>
        
        <button 
          onClick={handleToggleActivation}
          disabled={isToggling}
          className="btn btn-outline text-sm flex items-center justify-center min-w-[80px]"
        >
          {isToggling ? (
            <>
              <Loader2 size={14} className="animate-spin mr-1" />
              <span className="text-xs">...</span>
            </>
          ) : (
            currentJob.status === 'Open' ? 'Desativar' : 'Ativar'
          )}
        </button>
        
        <button 
          onClick={handleDelete}
          disabled={isDeleting || isToggling}
          className="btn btn-outline text-sm text-red-500 hover:bg-red-500/10 flex items-center justify-center min-w-[70px]"
        >
          {isDeleting ? (
            <>
              <Loader2 size={14} className="animate-spin mr-1" />
              <span className="text-xs">...</span>
            </>
          ) : (
            'Excluir'
          )}
        </button>
      </div>
    </div>
  );
};

export default JobCard;