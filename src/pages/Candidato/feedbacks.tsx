/*
  Responsividade Melhorada para Feedbacks
  
  Classes CSS adicionais recomendadas para melhor responsividade:
  
  @media (max-width: 640px) {
    .line-clamp-2 {
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
      overflow: hidden;
    }
    
    .line-clamp-3 {
      display: -webkit-box;
      -webkit-line-clamp: 3;
      -webkit-box-orient: vertical;
      overflow: hidden;
    }
    
    .hover\:bg-gray-750:hover {
      background-color: rgb(55 65 81);
    }
  }
*/

import React, { useEffect, useState } from 'react';
import { 
  MessageSquare, 
  Bell, 
  CheckCircle, 
  AlertTriangle, 
  Info, 
  XCircle,
  Trash2,
  Eye,
  Filter,
  Search,
  RefreshCw,
  ChevronUp,
  ChevronDown
} from 'lucide-react';
import Header from '../../components/headerCandidato';
import api from '../../services/api';
import '../../styles/feedbacks-responsive.css';

interface Feedback {
  id: string;
  title: string;
  message: string;
  status: 'approved' | 'rejected' | 'in-progress';
  score?: number;
  createdAt: string;
  response?: {
    opportunity?: {
      title?: string;
      company?: {
        name?: string;
      };
    };
  };
}

interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'SUCCESS' | 'INFO' | 'WARNING' | 'ERROR';
  status: 'PENDING' | 'SENT' | 'READ';
  score?: number;
  createdAt: string;
  response?: {
    opportunity: {
      title: string;
      company: {
        name: string;
      };
    };
  };
}

interface NotificationStats {
  total: number;
  unread: number;
  byType: {
    SUCCESS: number;
    INFO: number;
    WARNING: number;
    ERROR: number;
  };
}

interface CandidatureSubmission {
  opportunityId: string;
  responses: {
    question: string;
    answer: string;
  }[];
}

interface CandidatureResponse {
  success: boolean;
  message: string;
  data: {
    response: any;
    emailSent: boolean;
    feedbackCreated: boolean;
  };
}

const statusMessages: Record<Feedback["status"], string> = {
  approved: "Aprovado",
  rejected: "Reprovado",
  "in-progress": "Em análise",
};

// Função utilitária para submissão de candidatura (pode ser exportada)
export const submitCandidature = async (data: CandidatureSubmission): Promise<CandidatureResponse> => {
  try {
    const response = await api.post('/candidate/responses', data);
    return response.data;
  } catch (error) {
    console.error('Erro na candidatura:', error);
    throw error;
  }
};

// Função para exibir feedback de sucesso
export const handleSubmitSuccess = (result: CandidatureResponse) => {
  // Aqui você pode integrar com sua biblioteca de notificações (toast, etc.)
  console.log('✅ Candidatura enviada com sucesso!', result.message);
  
  if (result.data.emailSent) {
    console.log('📧 Email de confirmação enviado!');
  }
  
  if (result.data.feedbackCreated) {
    console.log('🔔 Notificação criada! Você pode acompanhar na aba de notificações.');
  }
};

const Feedbacks: React.FC = () => {
  const [feedbacks, setFeedbacks] = useState<Feedback[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [filteredNotifications, setFilteredNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [stats, setStats] = useState<NotificationStats | null>(null);
  const [selectedFilter, setSelectedFilter] = useState<'ALL' | 'SUCCESS' | 'INFO' | 'WARNING' | 'ERROR' | 'UNREAD'>('ALL');
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState<'feedbacks' | 'notifications'>('feedbacks');
  const [expandedNotifications, setExpandedNotifications] = useState<Set<string>>(new Set());
  const [expandedFeedbacks, setExpandedFeedbacks] = useState<Set<string>>(new Set());

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    filterNotifications();
  }, [notifications, selectedFilter, searchTerm]);

  const loadData = async () => {
    try {
      setLoading(true);
      const [feedbacksData, notificationsData, statsData] = await Promise.all([
        fetchFeedbacks(),
        fetchUserNotifications(),
        getNotificationStats()
      ]);
      
      setFeedbacks(feedbacksData);
      setNotifications(notificationsData);
      setStats(statsData);
    } catch (error) {
      console.error('Erro ao carregar dados:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchFeedbacks = async (): Promise<Feedback[]> => {
    try {
      const res = await api.get("/notifications/feedbacks");
      return res.data.feedbacks || [];
    } catch (error) {
      console.error("Erro ao buscar feedbacks:", error);
      return [];
    }
  };

  const fetchUserNotifications = async (): Promise<Notification[]> => {
    try {
      const response = await api.get('/notifications/user');
      return response.data.data || [];
    } catch (error) {
      console.error('Erro ao buscar notificações:', error);
      return [];
    }
  };

  const getNotificationStats = async (): Promise<NotificationStats | null> => {
    try {
      const response = await api.get('/notifications/stats');
      return response.data.data || null;
    } catch (error) {
      console.error('Erro ao buscar estatísticas:', error);
      return null;
    }
  };

  const refreshData = async () => {
    setRefreshing(true);
    await loadData();
    setRefreshing(false);
  };

  const filterNotifications = () => {
    let filtered = [...notifications];

    // Filtro por tipo
    if (selectedFilter !== 'ALL') {
      if (selectedFilter === 'UNREAD') {
        filtered = filtered.filter(n => n.status !== 'READ');
      } else {
        filtered = filtered.filter(n => n.type === selectedFilter);
      }
    }

    // Filtro por busca
    if (searchTerm.trim()) {
      const search = searchTerm.toLowerCase();
      filtered = filtered.filter(n => 
        n.title.toLowerCase().includes(search) ||
        n.message.toLowerCase().includes(search) ||
        n.response?.opportunity?.title?.toLowerCase().includes(search) ||
        n.response?.opportunity?.company?.name?.toLowerCase().includes(search)
      );
    }

    // Ordenar por data (mais recentes primeiro)
    filtered.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

    setFilteredNotifications(filtered);
  };

  const handleMarkAsRead = async (notificationId: string) => {
    try {
      await api.patch(`/notifications/${notificationId}/read`);
      setNotifications(prev => 
        prev.map(n => 
          n.id === notificationId 
            ? { ...n, status: 'READ' as const }
            : n
        )
      );
      // Atualizar stats
      const newStats = await getNotificationStats();
      setStats(newStats);
    } catch (error) {
      console.error('Erro ao marcar como lida:', error);
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      await api.patch('/notifications/mark-all-read');
      setNotifications(prev => 
        prev.map(n => ({ ...n, status: 'READ' as const }))
      );
      // Atualizar stats
      const newStats = await getNotificationStats();
      setStats(newStats);
    } catch (error) {
      console.error('Erro ao marcar todas como lidas:', error);
    }
  };

  const handleDeleteNotification = async (notificationId: string) => {
    if (!window.confirm('Tem certeza que deseja excluir esta notificação?')) {
      return;
    }

    try {
      await api.delete(`/notifications/${notificationId}`);
      setNotifications(prev => prev.filter(n => n.id !== notificationId));
      // Atualizar stats
      const newStats = await getNotificationStats();
      setStats(newStats);
    } catch (error) {
      console.error('Erro ao excluir notificação:', error);
    }
  };

  const getNotificationIcon = (type: string) => {
    const icons = {
      SUCCESS: <CheckCircle className="w-5 h-5 text-green-500" />,
      INFO: <Info className="w-5 h-5 text-blue-500" />,
      WARNING: <AlertTriangle className="w-5 h-5 text-yellow-500" />,
      ERROR: <XCircle className="w-5 h-5 text-red-500" />
    };
    return icons[type as keyof typeof icons] || icons.INFO;
  };

  const getFilterIcon = (filter: string) => {
    switch (filter) {
      case 'SUCCESS': return <CheckCircle className="w-4 h-4" />;
      case 'INFO': return <Info className="w-4 h-4" />;
      case 'WARNING': return <AlertTriangle className="w-4 h-4" />;
      case 'ERROR': return <XCircle className="w-4 h-4" />;
      case 'UNREAD': return <Eye className="w-4 h-4" />;
      default: return <Filter className="w-4 h-4" />;
    }
  };

  const getFilterColor = (filter: string) => {
    const isActive = selectedFilter === filter;
    const baseClasses = "flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors";
    
    if (!isActive) {
      return `${baseClasses} bg-gray-700 text-gray-300 hover:bg-gray-600`;
    }

    switch (filter) {
      case 'SUCCESS': return `${baseClasses} bg-green-600 text-white`;
      case 'INFO': return `${baseClasses} bg-blue-600 text-white`;
      case 'WARNING': return `${baseClasses} bg-yellow-600 text-white`;
      case 'ERROR': return `${baseClasses} bg-red-600 text-white`;
      case 'UNREAD': return `${baseClasses} bg-purple-600 text-white`;
      default: return `${baseClasses} bg-pink-600 text-white`;
    }
  };

  const formatNotificationDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 1) {
      return 'Agora';
    } else if (diffInMinutes < 60) {
      return `${diffInMinutes}m atrás`;
    } else if (diffInMinutes < 1440) {
      const hours = Math.floor(diffInMinutes / 60);
      return `${hours}h atrás`;
    } else {
      return date.toLocaleDateString('pt-BR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
      });
    }
  };

  const toggleNotificationExpansion = (notificationId: string) => {
    setExpandedNotifications(prev => {
      const newSet = new Set(prev);
      if (newSet.has(notificationId)) {
        newSet.delete(notificationId);
      } else {
        newSet.add(notificationId);
      }
      return newSet;
    });
  };

  const toggleFeedbackExpansion = (feedbackId: string) => {
    setExpandedFeedbacks(prev => {
      const newSet = new Set(prev);
      if (newSet.has(feedbackId)) {
        newSet.delete(feedbackId);
      } else {
        newSet.add(feedbackId);
      }
      return newSet;
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col bg-gray-900 text-white">
        <Header />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-500 mx-auto mb-4"></div>
            <p className="text-gray-400">Carregando dados...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-900 text-white">
      <Header />
      
      <div className="flex-1 container mx-auto px-3 sm:px-4 lg:px-6 py-4 sm:py-6 lg:py-8 max-w-7xl">
        {/* Header da página */}
        <div className="flex flex-col gap-4 mb-6 sm:mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4">
            <div className="flex items-center gap-3 sm:gap-4">
              <div className="p-2 sm:p-3 bg-pink-600 rounded-lg flex-shrink-0">
                <Bell size={20} className="sm:w-6 sm:h-6" />
              </div>
              <div className="min-w-0 flex-1">
                <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold bg-gradient-to-r from-pink-500 to-purple-600 bg-clip-text text-transparent leading-tight">
                  Feedbacks & Notificações
                </h1>
                <p className="text-sm sm:text-base text-gray-400 mt-1">
                  Acompanhe suas candidaturas
                </p>
              </div>
            </div>
          </div>

          {/* Botões de ação */}
          <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
            <button
              onClick={refreshData}
              disabled={refreshing}
              className="flex items-center justify-center gap-2 px-3 sm:px-4 py-2 bg-gray-700 hover:bg-gray-600 disabled:bg-gray-800 text-white rounded-lg transition-colors disabled:cursor-not-allowed text-sm sm:text-base"
            >
              <RefreshCw size={14} className={`sm:w-4 sm:h-4 ${refreshing ? 'animate-spin' : ''}`} />
              <span className="hidden sm:inline">{refreshing ? 'Atualizando...' : 'Atualizar'}</span>
              <span className="sm:hidden">{refreshing ? 'Atualizando...' : 'Atualizar'}</span>
            </button>

            {stats && stats.unread > 0 && (
              <button
                onClick={handleMarkAllAsRead}
                className="flex items-center justify-center gap-2 px-3 sm:px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors text-sm sm:text-base"
              >
                <CheckCircle size={14} className="sm:w-4 sm:h-4" />
                <span className="hidden sm:inline">Marcar Todas como Lidas</span>
                <span className="sm:hidden">Marcar Todas</span>
              </button>
            )}
          </div>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-gray-700 mb-4 sm:mb-6 overflow-x-auto">
          <button
            onClick={() => setActiveTab('feedbacks')}
            className={`flex items-center gap-2 px-3 sm:px-6 py-2 sm:py-3 font-medium transition-colors whitespace-nowrap text-sm sm:text-base ${
              activeTab === 'feedbacks'
                ? 'text-pink-500 border-b-2 border-pink-500'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            <MessageSquare size={16} className="sm:w-5 sm:h-5" />
            <span className="hidden sm:inline">Feedbacks Tradicionais</span>
            <span className="sm:hidden">Feedbacks</span>
          </button>
          <button
            onClick={() => setActiveTab('notifications')}
            className={`flex items-center gap-2 px-3 sm:px-6 py-2 sm:py-3 font-medium transition-colors whitespace-nowrap text-sm sm:text-base ${
              activeTab === 'notifications'
                ? 'text-pink-500 border-b-2 border-pink-500'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            <Bell size={16} className="sm:w-5 sm:h-5" />
            <span className="hidden sm:inline">Notificações</span>
            <span className="sm:hidden">Notificações</span>
            {stats && stats.unread > 0 && (
              <span className="bg-pink-500 text-white text-xs rounded-full px-1.5 sm:px-2 py-0.5 ml-1 font-semibold min-w-[18px] text-center">
                {stats.unread > 99 ? '99+' : stats.unread}
              </span>
            )}
          </button>
        </div>

        {/* Conteúdo das Tabs */}
        {activeTab === 'feedbacks' ? (
          <div>
            <div className="mb-4 sm:mb-6">
              <h2 className="text-lg sm:text-xl font-semibold mb-2">Feedbacks Tradicionais</h2>
              <p className="text-sm sm:text-base text-gray-400">Feedbacks detalhados enviados pelos recrutadores</p>
            </div>

            {feedbacks.length === 0 ? (
              <div className="text-center py-8 sm:py-12">
                <div className="w-12 sm:w-16 h-12 sm:h-16 bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4">
                  <MessageSquare size={20} className="sm:w-6 sm:h-6 text-gray-400" />
                </div>
                <h3 className="text-lg sm:text-xl font-semibold text-gray-300 mb-2">Nenhum feedback tradicional</h3>
                <p className="text-sm sm:text-base text-gray-400 px-4">
                  Você ainda não recebeu feedbacks detalhados. Eles aparecerão aqui quando disponíveis.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
                {feedbacks.map((fb) => (
                  <div key={fb.id} className="bg-gray-800 rounded-lg p-4 sm:p-6 border border-gray-700">
                    <h3 className="font-bold text-base sm:text-lg mb-2 line-clamp-2">
                      {fb.response?.opportunity?.title || "Vaga desconhecida"}
                    </h3>
                    <p className="text-sm sm:text-base text-gray-400 mb-2 truncate">
                      Empresa: {fb.response?.opportunity?.company?.name || "Desconhecida"}
                    </p>
                    <p className="text-sm sm:text-base text-gray-400 mb-3">
                      Status:{" "}
                      <span
                        className={`font-semibold ${
                          fb.status === "approved"
                            ? "text-green-400"
                            : fb.status === "rejected"
                            ? "text-red-400"
                            : "text-yellow-400"
                        }`}
                      >
                        {statusMessages[fb.status]}
                      </span>
                    </p>
                    {fb.score !== undefined && (
                      <p className="text-sm sm:text-base text-gray-400 mb-3">
                        Pontuação: <span className="font-semibold text-white">{fb.score}/100</span>
                      </p>
                    )}
                    {fb.message && (
                      <div className="bg-gray-700 rounded-lg p-3 sm:p-4 mb-3">
                        <div 
                          className="expandable-text clickable-text"
                          onClick={() => toggleFeedbackExpansion(fb.id)}
                        >
                          <p className={`text-sm sm:text-base text-gray-300 italic transition-all duration-300 ${
                            expandedFeedbacks.has(fb.id) ? 'text-expand-animation' : 'line-clamp-3'
                          }`}>
                            "{fb.message}"
                          </p>
                          {fb.message.length > 150 && (
                            <button 
                              className="text-pink-500 hover:text-pink-400 text-xs sm:text-sm mt-2 font-medium expand-button inline-flex items-center gap-1"
                              onClick={(e) => {
                                e.stopPropagation();
                                toggleFeedbackExpansion(fb.id);
                              }}
                            >
                              {expandedFeedbacks.has(fb.id) ? (
                                <>
                                  <span>Ver menos</span>
                                  <ChevronUp size={12} />
                                </>
                              ) : (
                                <>
                                  <span>Ver mais</span>
                                  <ChevronDown size={12} />
                                </>
                              )}
                            </button>
                          )}
                        </div>
                      </div>
                    )}
                    <p className="text-xs sm:text-sm text-gray-500">
                      {new Date(fb.createdAt).toLocaleDateString('pt-BR')}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        ) : (
          <div>
            {/* Estatísticas */}
            {stats && (
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2 sm:gap-4 mb-4 sm:mb-8">
                <div className="bg-gray-800 rounded-lg p-3 sm:p-4 text-center">
                  <div className="text-lg sm:text-2xl font-bold text-white mb-1">{stats.total}</div>
                  <div className="text-xs sm:text-sm text-gray-400">Total</div>
                </div>
                <div className="bg-purple-900/30 border border-purple-500/30 rounded-lg p-3 sm:p-4 text-center">
                  <div className="text-lg sm:text-2xl font-bold text-purple-400 mb-1">{stats.unread}</div>
                  <div className="text-xs sm:text-sm text-gray-400">Não Lidas</div>
                </div>
                <div className="bg-green-900/30 border border-green-500/30 rounded-lg p-3 sm:p-4 text-center">
                  <div className="text-lg sm:text-2xl font-bold text-green-400 mb-1">{stats.byType.SUCCESS}</div>
                  <div className="text-xs sm:text-sm text-gray-400">Sucessos</div>
                </div>
                <div className="bg-blue-900/30 border border-blue-500/30 rounded-lg p-3 sm:p-4 text-center">
                  <div className="text-lg sm:text-2xl font-bold text-blue-400 mb-1">{stats.byType.INFO}</div>
                  <div className="text-xs sm:text-sm text-gray-400">Infos</div>
                </div>
                <div className="bg-yellow-900/30 border border-yellow-500/30 rounded-lg p-3 sm:p-4 text-center">
                  <div className="text-lg sm:text-2xl font-bold text-yellow-400 mb-1">{stats.byType.WARNING}</div>
                  <div className="text-xs sm:text-sm text-gray-400">Avisos</div>
                </div>
                <div className="bg-red-900/30 border border-red-500/30 rounded-lg p-3 sm:p-4 text-center">
                  <div className="text-lg sm:text-2xl font-bold text-red-400 mb-1">{stats.byType.ERROR}</div>
                  <div className="text-xs sm:text-sm text-gray-400">Erros</div>
                </div>
              </div>
            )}

            {/* Filtros e Busca */}
            <div className="mb-4 sm:mb-6">
              <div className="flex flex-col gap-3 sm:gap-4">
                {/* Filtros */}
                <div className="overflow-x-auto">
                  <div className="flex gap-2 pb-2 min-w-max sm:min-w-0 sm:flex-wrap">
                    {[
                      { key: 'ALL', label: 'Todas' },
                      { key: 'UNREAD', label: 'Não Lidas' },
                      { key: 'SUCCESS', label: 'Sucessos' },
                      { key: 'INFO', label: 'Infos' },
                      { key: 'WARNING', label: 'Avisos' },
                      { key: 'ERROR', label: 'Erros' }
                    ].map(filter => (
                      <button
                        key={filter.key}
                        onClick={() => setSelectedFilter(filter.key as any)}
                        className={getFilterColor(filter.key) + ' text-xs sm:text-sm whitespace-nowrap'}
                      >
                        <span className="hidden sm:inline">{getFilterIcon(filter.key)}</span>
                        {filter.label}
                        {filter.key === 'UNREAD' && stats && stats.unread > 0 && (
                          <span className="bg-white text-purple-600 text-xs rounded-full px-1.5 sm:px-2 py-0.5 ml-1 font-semibold">
                            {stats.unread > 99 ? '99+' : stats.unread}
                          </span>
                        )}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Busca */}
                <div className="w-full sm:max-w-md">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <input
                      type="text"
                      placeholder="Buscar notificações..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 sm:py-3 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500 text-white placeholder-gray-400 text-sm sm:text-base"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Lista de Notificações */}
            <div className="space-y-3 sm:space-y-4">
              {filteredNotifications.length === 0 ? (
                <div className="text-center py-8 sm:py-12">
                  <div className="w-12 sm:w-16 h-12 sm:h-16 bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4">
                    <Bell size={20} className="sm:w-6 sm:h-6 text-gray-400" />
                  </div>
                  <h3 className="text-lg sm:text-xl font-semibold text-gray-300 mb-2">
                    {searchTerm ? 'Nenhuma notificação encontrada' : 'Nenhuma notificação'}
                  </h3>
                  <p className="text-sm sm:text-base text-gray-400 px-4">
                    {searchTerm 
                      ? 'Tente ajustar os filtros ou o termo de busca' 
                      : 'Você será notificado quando enviar candidaturas'
                    }
                  </p>
                </div>
              ) : (
                filteredNotifications.map((notification) => (
                  <div 
                    key={notification.id} 
                    className={`bg-gray-800 rounded-lg p-6 border-l-4 ${
                      notification.status === 'READ' 
                        ? 'opacity-75 border-gray-600' 
                        : (() => {
                            switch (notification.type) {
                              case 'SUCCESS': return 'border-green-500';
                              case 'WARNING': return 'border-yellow-500';
                              case 'ERROR': return 'border-red-500';
                              default: return 'border-blue-500';
                            }
                          })()
                    } transition-all duration-200 hover:bg-gray-750`}
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex items-start gap-4 flex-1">
                        {/* Ícone */}
                        <div className="flex-shrink-0 mt-1">
                          {getNotificationIcon(notification.type)}
                        </div>

                        {/* Conteúdo */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-4 mb-2">
                            <h3 className="text-lg font-semibold text-white truncate">
                              {notification.title}
                            </h3>
                            <div className="flex items-center gap-2 flex-shrink-0">
                              {notification.status !== 'READ' && (
                                <span className="w-2 h-2 bg-pink-500 rounded-full"></span>
                              )}
                              <span className="text-sm text-gray-400">
                                {formatNotificationDate(notification.createdAt)}
                              </span>
                            </div>
                          </div>

                          <div 
                            className="text-gray-300 mb-4 leading-relaxed expandable-text clickable-text"
                            onClick={() => toggleNotificationExpansion(notification.id)}
                          >
                            <p className={`transition-all duration-300 ${
                              expandedNotifications.has(notification.id) 
                                ? 'text-expand-animation' 
                                : 'line-clamp-3'
                            }`}>
                              {notification.message}
                            </p>
                            {notification.message.length > 150 && (
                              <button 
                                className="text-pink-500 hover:text-pink-400 text-sm mt-2 font-medium expand-button inline-flex items-center gap-1"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  toggleNotificationExpansion(notification.id);
                                }}
                              >
                                {expandedNotifications.has(notification.id) ? (
                                  <>
                                    <span>Ver menos</span>
                                    <ChevronUp size={14} />
                                  </>
                                ) : (
                                  <>
                                    <span>Ver mais</span>
                                    <ChevronDown size={14} />
                                  </>
                                )}
                              </button>
                            )}
                          </div>

                          {/* Detalhes da vaga (se disponível) */}
                          {notification.response?.opportunity && (
                            <div className="bg-gray-700 rounded-lg p-4 mb-4">
                              <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-pink-600 rounded-lg flex items-center justify-center">
                                  <MessageSquare size={20} className="text-white" />
                                </div>
                                <div className="flex-1">
                                  <h4 className="font-medium text-white">
                                    {notification.response.opportunity.title}
                                  </h4>
                                  <p className="text-sm text-gray-400">
                                    {notification.response.opportunity.company.name}
                                  </p>
                                </div>
                              </div>
                            </div>
                          )}

                          {/* Score (se disponível) */}
                          {notification.score !== undefined && (
                            <div className="flex items-center gap-2 mb-4">
                              <span className="text-sm text-gray-400">Score:</span>
                              <div className={`px-3 py-1 rounded-full text-sm font-semibold ${
                                notification.score >= 80 
                                  ? 'bg-green-600 text-white'
                                  : notification.score >= 60
                                  ? 'bg-yellow-600 text-white'
                                  : 'bg-red-600 text-white'
                              }`}>
                                {notification.score}/100
                              </div>
                            </div>
                          )}

                          {/* Ações */}
                          <div className="flex items-center gap-2">
                            {notification.status !== 'READ' && (
                              <button
                                onClick={() => handleMarkAsRead(notification.id)}
                                className="flex items-center gap-2 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm transition-colors"
                              >
                                <CheckCircle size={14} />
                                Marcar como Lida
                              </button>
                            )}
                            
                            <button
                              onClick={() => handleDeleteNotification(notification.id)}
                              className="flex items-center gap-2 px-3 py-1.5 bg-red-600 hover:bg-red-700 text-white rounded-lg text-sm transition-colors"
                            >
                              <Trash2 size={14} />
                              Excluir
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Feedbacks;
