// notificationService.ts - Serviço para gerenciar notificações
import api from './api';

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'SUCCESS' | 'INFO' | 'WARNING' | 'ERROR';
  status: 'PENDING' | 'SENT' | 'READ';
  score?: number;
  createdAt: string;
  updatedAt: string;
  response?: {
    id: string;
    opportunity: {
      id: string;
      title: string;
      company: {
        name: string;
        logo?: string;
      };
    };
  };
}

export interface NotificationStats {
  total: number;
  unread: number;
  byType: {
    SUCCESS: number;
    INFO: number;
    WARNING: number;
    ERROR: number;
  };
}

class NotificationService {
  /**
   * Busca todas as notificações do usuário
   */
  async getUserNotifications(): Promise<Notification[]> {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('Token de autenticação não encontrado');
      }

      const response = await fetch(`${api.defaults.baseURL}/notifications/user`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error('Erro ao buscar notificações');
      }

      const result = await response.json();
      return result.data || [];
    } catch (error) {
      console.error('Erro ao buscar notificações:', error);
      return [];
    }
  }

  /**
   * Marca uma notificação como lida
   */
  async markAsRead(notificationId: string): Promise<boolean> {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('Token de autenticação não encontrado');
      }

      const response = await fetch(`${api.defaults.baseURL}/notifications/${notificationId}/read`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error('Erro ao marcar notificação como lida');
      }

      return true;
    } catch (error) {
      console.error('Erro ao marcar notificação como lida:', error);
      return false;
    }
  }

  /**
   * Marca todas as notificações como lidas
   */
  async markAllAsRead(): Promise<boolean> {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('Token de autenticação não encontrado');
      }

      const response = await fetch(`${api.defaults.baseURL}/notifications/mark-all-read`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error('Erro ao marcar todas as notificações como lidas');
      }

      return true;
    } catch (error) {
      console.error('Erro ao marcar todas as notificações como lidas:', error);
      return false;
    }
  }

  /**
   * Deleta uma notificação
   */
  async deleteNotification(notificationId: string): Promise<boolean> {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('Token de autenticação não encontrado');
      }

      const response = await fetch(`${api.defaults.baseURL}/notifications/${notificationId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error('Erro ao deletar notificação');
      }

      return true;
    } catch (error) {
      console.error('Erro ao deletar notificação:', error);
      return false;
    }
  }

  /**
   * Busca estatísticas das notificações
   */
  async getNotificationStats(): Promise<NotificationStats> {
    try {
      const notifications = await this.getUserNotifications();
      
      const stats: NotificationStats = {
        total: notifications.length,
        unread: notifications.filter(n => n.status !== 'READ').length,
        byType: {
          SUCCESS: notifications.filter(n => n.type === 'SUCCESS').length,
          INFO: notifications.filter(n => n.type === 'INFO').length,
          WARNING: notifications.filter(n => n.type === 'WARNING').length,
          ERROR: notifications.filter(n => n.type === 'ERROR').length,
        }
      };

      return stats;
    } catch (error) {
      console.error('Erro ao buscar estatísticas:', error);
      return {
        total: 0,
        unread: 0,
        byType: { SUCCESS: 0, INFO: 0, WARNING: 0, ERROR: 0 }
      };
    }
  }

  /**
   * Busca notificações não lidas
   */
  async getUnreadNotifications(): Promise<Notification[]> {
    try {
      const notifications = await this.getUserNotifications();
      return notifications.filter(notification => notification.status !== 'READ');
    } catch (error) {
      console.error('Erro ao buscar notificações não lidas:', error);
      return [];
    }
  }

  /**
   * Formata a data de uma notificação
   */
  formatNotificationDate(dateString: string): string {
    const date = new Date(dateString);
    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 1) {
      return 'Agora mesmo';
    } else if (diffInMinutes < 60) {
      return `${diffInMinutes} min atrás`;
    } else if (diffInMinutes < 1440) {
      const hours = Math.floor(diffInMinutes / 60);
      return `${hours}h atrás`;
    } else {
      return date.toLocaleDateString('pt-BR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    }
  }

  /**
   * Retorna o ícone apropriado para o tipo de notificação
   */
  getNotificationIcon(type: string): string {
    const icons = {
      SUCCESS: '✅',
      INFO: 'ℹ️',
      WARNING: '⚠️',
      ERROR: '❌'
    };
    return icons[type as keyof typeof icons] || 'ℹ️';
  }

  /**
   * Retorna a cor apropriada para o tipo de notificação
   */
  getNotificationColor(type: string): string {
    const colors = {
      SUCCESS: 'text-green-600 bg-green-50 border-green-200',
      INFO: 'text-blue-600 bg-blue-50 border-blue-200',
      WARNING: 'text-yellow-600 bg-yellow-50 border-yellow-200',
      ERROR: 'text-red-600 bg-red-50 border-red-200'
    };
    return colors[type as keyof typeof colors] || colors.INFO;
  }
}

export const notificationService = new NotificationService();
