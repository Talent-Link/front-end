// candidatureService.ts - Serviço para gerenciar candidaturas
import { useState } from 'react';
import api from './api';

export interface CandidatureSubmission {
  opportunityId: string;
  responses: {
    question: string;
    answer: string;
  }[];
}

export interface CandidatureResponse {
  success: boolean;
  message: string;
  data: {
    response: {
      id: string;
      userId: string;
      opportunityId: string;
      responses: any[];
      createdAt: string;
    };
    emailSent: boolean;
    feedbackCreated: boolean;
  };
}

export interface UserCandidature {
  id: string;
  opportunity: {
    id: string;
    title: string;
    company: {
      name: string;
      logo?: string;
    };
  };
  status: 'PENDING' | 'UNDER_REVIEW' | 'APPROVED' | 'REJECTED';
  submittedAt: string;
  responses: {
    question: string;
    answer: string;
  }[];
}

class CandidatureService {
  /**
   * Submete uma candidatura para uma vaga
   */
  async submitCandidature(data: CandidatureSubmission): Promise<CandidatureResponse> {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('Token de autenticação não encontrado');
      }

      const response = await fetch(`${api.defaults.baseURL}/candidate/responses`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: 'Erro desconhecido' }));
        throw new Error(errorData.message || 'Erro ao enviar candidatura');
      }

      return await response.json();
    } catch (error) {
      console.error('Erro na candidatura:', error);
      throw error;
    }
  }

  /**
   * Lista todas as candidaturas do usuário
   */
  async getUserCandidatures(): Promise<UserCandidature[]> {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('Token de autenticação não encontrado');
      }

      const response = await fetch(`${api.defaults.baseURL}/candidate/candidatures`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error('Erro ao buscar candidaturas');
      }

      const result = await response.json();
      return result.data || [];
    } catch (error) {
      console.error('Erro ao buscar candidaturas:', error);
      return [];
    }
  }

  /**
   * Busca detalhes de uma candidatura específica
   */
  async getCandidatureDetails(candidatureId: string): Promise<UserCandidature | null> {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('Token de autenticação não encontrado');
      }

      const response = await fetch(`${api.defaults.baseURL}/candidate/candidatures/${candidatureId}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error('Erro ao buscar detalhes da candidatura');
      }

      const result = await response.json();
      return result.data;
    } catch (error) {
      console.error('Erro ao buscar detalhes da candidatura:', error);
      return null;
    }
  }

  /**
   * Cancela uma candidatura (se permitido)
   */
  async cancelCandidature(candidatureId: string): Promise<{ success: boolean; message: string }> {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('Token de autenticação não encontrado');
      }

      const response = await fetch(`${api.defaults.baseURL}/candidate/candidatures/${candidatureId}/cancel`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: 'Erro desconhecido' }));
        throw new Error(errorData.message || 'Erro ao cancelar candidatura');
      }

      return await response.json();
    } catch (error) {
      console.error('Erro ao cancelar candidatura:', error);
      throw error;
    }
  }
}

export const candidatureService = new CandidatureService();

/**
 * Função para exibir feedback de sucesso ao usuário
 * Pode ser customizada para integrar com sua biblioteca de notificações preferida
 */
export const handleSubmitSuccess = (result: CandidatureResponse, showNotification?: (message: string, type?: 'success' | 'info' | 'warning' | 'error') => void) => {
  // Exibir mensagem principal
  if (showNotification) {
    showNotification(result.message, 'success');
  } else {
    console.log('✅ Candidatura enviada com sucesso!', result.message);
  }
  
  // Verificar se email foi enviado
  if (result.data.emailSent) {
    if (showNotification) {
      showNotification('📧 Email de confirmação enviado para seu endereço cadastrado!', 'info');
    } else {
      console.log('📧 Email de confirmação enviado!');
    }
  }
  
  // Verificar se feedback foi criado
  if (result.data.feedbackCreated) {
    if (showNotification) {
      showNotification('🔔 Você pode acompanhar o status da sua candidatura na aba de notificações!', 'info');
    } else {
      console.log('🔔 Notificação criada! Você pode acompanhar na aba de notificações.');
    }
  }
};

/**
 * Função para exibir erros de candidatura
 */
export const handleSubmitError = (error: any, showNotification?: (message: string, type?: 'success' | 'info' | 'warning' | 'error') => void) => {
  const errorMessage = error.message || 'Erro ao enviar candidatura. Tente novamente.';
  
  if (showNotification) {
    showNotification(errorMessage, 'error');
  } else {
    console.error('❌ Erro na candidatura:', errorMessage);
  }
};

/**
 * Hook personalizado para submissão de candidatura (exemplo para React)
 */
export const useCandidatureSubmission = () => {
  const [submitting, setSubmitting] = useState(false);
  
  const submitCandidature = async (
    data: CandidatureSubmission,
    onSuccess?: (result: CandidatureResponse) => void,
    onError?: (error: any) => void
  ) => {
    setSubmitting(true);
    
    try {
      const result = await candidatureService.submitCandidature(data);
      
      // Chamar callback de sucesso personalizado ou usar o padrão
      if (onSuccess) {
        onSuccess(result);
      } else {
        handleSubmitSuccess(result);
      }
      
      return result;
    } catch (error) {
      // Chamar callback de erro personalizado ou usar o padrão
      if (onError) {
        onError(error);
      } else {
        handleSubmitError(error);
      }
      
      throw error;
    } finally {
      setSubmitting(false);
    }
  };
  
  return {
    submitCandidature,
    submitting
  };
};

// Adicionar import do React no topo do arquivo para o hook
