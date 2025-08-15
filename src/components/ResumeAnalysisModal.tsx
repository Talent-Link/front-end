import React, { useState, useEffect } from 'react';
import { 
  X, 
  Brain, 
  Sparkles, 
  Star, 
  AlertCircle, 
  CheckCircle, 
  TrendingUp, 
  Clock,
  Lightbulb,
  Target,
  Award,
  RefreshCw
} from 'lucide-react';
import { useResumeAnalysis } from '../hooks/useResumeAnalysis';

interface ResumeAnalysisModalProps {
  onClose: () => void;
}

const ResumeAnalysisModal: React.FC<ResumeAnalysisModalProps> = ({ onClose }) => {
  const { 
    analysis, 
    tips, 
    loading, 
    error, 
    cooldownRemaining, 
    canAnalyze, 
    analyzeResume, 
    getTips, 
    formatCooldownTime 
  } = useResumeAnalysis();
  
  const [activeTab, setActiveTab] = useState<'analysis' | 'tips'>('analysis');
  const [showCooldownModal, setShowCooldownModal] = useState(false);

  // Tentar análise ao abrir modal se possível
  useEffect(() => {
    if (canAnalyze && !analysis) {
      handleAnalyze();
    } else if (!canAnalyze) {
      // Se não pode analisar, carregar dicas
      if (!tips) {
        getTips().catch(console.error);
      }
      setActiveTab('tips');
    }
  }, []);

  const handleAnalyze = async () => {
    try {
      await analyzeResume();
      setActiveTab('analysis');
    } catch (err: any) {
      console.error('Erro na análise:', err);
    }
  };

  const handleForceAnalyze = () => {
    if (!canAnalyze) {
      setShowCooldownModal(true);
      return;
    }
    handleAnalyze();
  };

  const handleRetry = () => {
    handleAnalyze();
  };

  // Fechar modal ao clicar no backdrop
  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  // Renderizar score com cor
  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-400';
    if (score >= 60) return 'text-yellow-400';
    return 'text-red-400';
  };

  const getScoreBackground = (score: number) => {
    if (score >= 80) return 'bg-green-900/20 border-green-500/30';
    if (score >= 60) return 'bg-yellow-900/20 border-yellow-500/30';
    return 'bg-red-900/20 border-red-500/30';
  };

  // Modal de cooldown
  const CooldownModal = () => (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-[60] p-4">
      <div className="bg-dark-800 rounded-lg max-w-md w-full border border-dark-700 shadow-2xl">
        <div className="p-6 border-b border-dark-700">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-yellow-600/20 flex items-center justify-center">
              <Clock className="text-yellow-400" size={20} />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-white">Aguarde um Pouco</h3>
              <p className="text-gray-400 text-sm">Análise disponível em breve</p>
            </div>
          </div>
        </div>
        
        <div className="p-6">
          <div className="text-center mb-4">
            <div className="text-4xl mb-3">⏱️</div>
            <p className="text-gray-300 mb-2">
              Para manter a qualidade das análises, você pode solicitar uma nova análise a cada <strong>3 minutos</strong>.
            </p>
            <div className="bg-dark-700 rounded-lg p-4 border border-dark-600">
              <p className="text-yellow-400 font-medium">
                Próxima análise disponível em: <strong>{formatCooldownTime(cooldownRemaining)}</strong>
              </p>
            </div>
          </div>
          
          <div className="bg-blue-900/20 border border-blue-500/30 rounded-lg p-4 mb-4">
            <h4 className="text-blue-400 font-medium mb-2 flex items-center gap-2">
              <Lightbulb size={16} />
              Enquanto aguarda:
            </h4>
            <ul className="text-gray-300 text-sm space-y-1">
              <li>• Complete mais informações no seu perfil</li>
              <li>• Atualize suas experiências profissionais</li>
              <li>• Adicione novas habilidades técnicas</li>
              <li>• Confira as dicas de melhoria disponíveis</li>
            </ul>
          </div>
          
          <div className="flex gap-3">
            <button
              onClick={() => {
                setActiveTab('tips');
                setShowCooldownModal(false);
              }}
              className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors text-sm font-medium"
            >
              Ver Dicas Gerais
            </button>
            <button
              onClick={() => setShowCooldownModal(false)}
              className="px-4 py-2 bg-dark-600 hover:bg-dark-500 text-gray-300 rounded-lg transition-colors text-sm"
            >
              Fechar
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <>
      <div 
        className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4"
        onClick={handleBackdropClick}
      >
        <div className="bg-dark-800 rounded-lg max-w-6xl w-full max-h-[90vh] overflow-hidden border border-dark-700 shadow-2xl">
          {/* Header */}
          <div className="bg-gradient-to-r from-purple-900/50 to-pink-900/50 p-4 md:p-6 border-b border-dark-700">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-3 md:gap-4">
                <div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-purple-600/20 flex items-center justify-center border border-purple-500/30 flex-shrink-0">
                  <Brain className="text-purple-400" size={18} />
                </div>
                <div>
                  <h2 className="text-lg md:text-xl font-semibold text-white flex items-center gap-2 flex-wrap">
                    🤖 Análise de Currículo com IA
                    <Sparkles className="text-yellow-400" size={16} />
                  </h2>
                  <p className="text-gray-400 text-xs md:text-sm">
                    Sugestões personalizadas para melhorar seu currículo
                  </p>
                </div>
              </div>
              <button 
                onClick={onClose} 
                className="text-gray-400 hover:text-white transition-colors self-start sm:self-auto"
              >
                <X size={24} />
              </button>
            </div>

            {/* Tabs */}
            <div className="flex flex-col sm:flex-row gap-2 mt-4">
              <button
                onClick={() => setActiveTab('analysis')}
                className={`px-3 md:px-4 py-2 rounded-lg font-medium text-xs md:text-sm transition-colors ${
                  activeTab === 'analysis'
                    ? 'bg-purple-600 text-white'
                    : 'bg-dark-700 text-gray-300 hover:bg-dark-600'
                }`}
              >
                <Target className="inline mr-1 md:mr-2" size={14} />
                Análise Personalizada
              </button>
              <button
                onClick={() => {
                  setActiveTab('tips');
                  if (!tips) getTips().catch(console.error);
                }}
                className={`px-3 md:px-4 py-2 rounded-lg font-medium text-xs md:text-sm transition-colors ${
                  activeTab === 'tips'
                    ? 'bg-purple-600 text-white'
                    : 'bg-dark-700 text-gray-300 hover:bg-dark-600'
                }`}
              >
                <Lightbulb className="inline mr-1 md:mr-2" size={14} />
                Dicas Gerais
              </button>
            </div>
          </div>

          {/* Content */}
          <div className="overflow-y-auto max-h-[calc(90vh-180px)]">
            {activeTab === 'analysis' && (
              <div className="p-4 md:p-6">
                {loading && (
                  <div className="text-center py-12">
                    <div className="animate-pulse flex flex-col items-center">
                      <div className="h-16 w-16 rounded-full bg-purple-600/20 mb-4 flex items-center justify-center">
                        <Brain className="text-purple-400 animate-spin" size={24} />
                      </div>
                      <p className="text-gray-300 mb-2">Analisando seu currículo com IA...</p>
                      <p className="text-gray-400 text-sm">Isso pode levar alguns segundos</p>
                    </div>
                  </div>
                )}

                {error && !loading && (
                  <div className="text-center py-8">
                    <div className="text-red-400 text-5xl mb-4">⚠️</div>
                    <h3 className="text-lg font-medium text-red-400 mb-3">Erro na Análise</h3>
                    <div className="bg-red-900/20 border border-red-500/30 rounded-lg p-4 mb-4 max-w-2xl mx-auto">
                      <p className="text-gray-300 mb-2">{error}</p>
                    </div>
                    <div className="flex gap-3 justify-center">
                      <button
                        onClick={handleRetry}
                        disabled={loading}
                        className="px-4 py-2 bg-purple-600 hover:bg-purple-700 disabled:bg-gray-500 disabled:cursor-not-allowed text-white rounded-lg transition-colors text-sm flex items-center gap-2"
                      >
                        <RefreshCw size={16} />
                        Tentar Novamente
                      </button>
                      <button
                        onClick={() => setActiveTab('tips')}
                        className="px-4 py-2 bg-dark-600 hover:bg-dark-500 text-gray-300 rounded-lg transition-colors text-sm"
                      >
                        Ver Dicas Gerais
                      </button>
                    </div>
                  </div>
                )}

                {analysis && !loading && (
                  <div className="space-y-6">
                    {/* Score e Resumo */}
                    <div className={`rounded-lg p-6 border ${getScoreBackground(analysis.data.analysis.overall_score)}`}>
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="text-xl font-semibold text-white flex items-center gap-2">
                          <Award className="text-yellow-400" size={24} />
                          Pontuação Geral
                        </h3>
                        <div className={`text-4xl font-bold ${getScoreColor(analysis.data.analysis.overall_score)}`}>
                          {analysis.data.analysis.overall_score}/100
                        </div>
                      </div>
                      <p className="text-gray-300 leading-relaxed">{analysis.data.analysis.summary}</p>
                    </div>

                    {/* Stats do Perfil */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
                      <div className="bg-dark-700 rounded-lg p-4 text-center border border-dark-600">
                        <p className="text-2xl font-bold text-blue-400 mb-1">
                          {analysis.data.profile_stats.total_skills}
                        </p>
                        <p className="text-gray-400 text-sm">Habilidades</p>
                      </div>
                      <div className="bg-dark-700 rounded-lg p-4 text-center border border-dark-600">
                        <p className="text-2xl font-bold text-green-400 mb-1">
                          {analysis.data.profile_stats.total_experiences}
                        </p>
                        <p className="text-gray-400 text-sm">Experiências</p>
                      </div>
                      <div className="bg-dark-700 rounded-lg p-4 text-center border border-dark-600">
                        <p className="text-2xl font-bold text-purple-400 mb-1">
                          {analysis.data.profile_stats.total_educations}
                        </p>
                        <p className="text-gray-400 text-sm">Formações</p>
                      </div>
                      <div className="bg-dark-700 rounded-lg p-4 text-center border border-dark-600">
                        <p className="text-2xl font-bold text-yellow-400 mb-1">
                          {analysis.data.profile_stats.has_resume ? '✅' : '❌'}
                        </p>
                        <p className="text-gray-400 text-sm">Currículo PDF</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                      {/* Pontos Fortes */}
                      <div className="bg-green-900/20 rounded-lg p-4 md:p-6 border border-green-500/30">
                        <h3 className="text-lg font-semibold text-white mb-3 flex items-center gap-2">
                          <CheckCircle className="text-green-400" size={20} />
                          ✅ Pontos Fortes
                        </h3>
                        <ul className="space-y-2">
                          {analysis.data.analysis.strengths.map((strength, index) => (
                            <li key={index} className="text-gray-300 flex items-start gap-2">
                              <Star className="text-green-400 flex-shrink-0 mt-1" size={14} />
                              {strength}
                            </li>
                          ))}
                        </ul>
                      </div>

                      {/* Sugestões de Melhoria */}
                      <div className="bg-blue-900/20 rounded-lg p-4 md:p-6 border border-blue-500/30">
                        <h3 className="text-lg font-semibold text-white mb-3 flex items-center gap-2">
                          <TrendingUp className="text-blue-400" size={20} />
                          💡 Sugestões de Melhoria
                        </h3>
                        <ul className="space-y-2">
                          {analysis.data.analysis.suggestions.map((suggestion, index) => (
                            <li key={index} className="text-gray-300 flex items-start gap-2">
                              <Lightbulb className="text-blue-400 flex-shrink-0 mt-1" size={14} />
                              {suggestion}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>

                    {/* Melhorias Específicas */}
                    <div className="bg-orange-900/20 rounded-lg p-4 md:p-6 border border-orange-500/30">
                      <h3 className="text-lg font-semibold text-white mb-3 flex items-center gap-2">
                        <AlertCircle className="text-orange-400" size={20} />
                        🔧 Ações Recomendadas
                      </h3>
                      <ul className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {analysis.data.analysis.improvements.map((improvement, index) => (
                          <li key={index} className="text-gray-300 flex items-start gap-2 bg-dark-700/50 rounded-lg p-2 md:p-3">
                            <Target className="text-orange-400 flex-shrink-0 mt-0.5" size={16} />
                            {improvement}
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Timestamp */}
                    <div className="text-center text-gray-400 text-sm border-t border-dark-600 pt-3 md:pt-4">
                      <p>
                        Análise realizada em {new Date(analysis.data.analyzed_at).toLocaleString('pt-BR')}
                        {!canAnalyze && (
                          <span className="ml-2 text-yellow-400">
                            • Próxima análise em {formatCooldownTime(cooldownRemaining)}
                          </span>
                        )}
                      </p>
                    </div>
                  </div>
                )}

                {!analysis && !loading && !error && (
                  <div className="text-center py-12">
                    <div className="text-6xl mb-4">🤖</div>
                    <h3 className="text-lg font-medium text-white mb-3">Pronto para Análise</h3>
                    <p className="text-gray-400 mb-6 max-w-md mx-auto">
                      Nossa IA irá analisar seu perfil, experiências e habilidades para fornecer 
                      sugestões personalizadas de melhoria.
                    </p>
                    <button
                      onClick={handleForceAnalyze}
                      disabled={loading}
                      className="px-6 py-3 bg-purple-600 hover:bg-purple-700 disabled:bg-gray-500 disabled:cursor-not-allowed text-white rounded-lg transition-colors font-medium flex items-center gap-2 mx-auto"
                    >
                      <Brain size={18} />
                      Analisar Meu Currículo
                    </button>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'tips' && (
              <div className="p-4 md:p-6">
                {tips ? (
                  <div className="space-y-4 md:space-y-6">
                    <div className="text-center mb-6 md:mb-8">
                      <h3 className="text-lg md:text-xl font-semibold text-white mb-2 flex items-center justify-center gap-2">
                        <Lightbulb className="text-yellow-400 w-5 h-5 md:w-6 md:h-6" />
                        💡 Dicas Gerais para um Currículo Excelente
                      </h3>
                      <p className="text-gray-400 text-sm md:text-base">
                        Orientações fundamentais para destacar seu perfil profissional
                      </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                      {/* Estrutura */}
                      <div className="bg-blue-900/20 rounded-lg p-4 md:p-6 border border-blue-500/30">
                        <h4 className="text-base md:text-lg font-semibold text-white mb-3 md:mb-4 flex items-center gap-2">
                          📋 Estrutura e Formatação
                        </h4>
                        <ul className="space-y-2">
                          {tips.data.structure.map((tip, index) => (
                            <li key={index} className="text-gray-300 flex items-start gap-2">
                              <CheckCircle className="text-blue-400 flex-shrink-0 mt-1" size={14} />
                              {tip}
                            </li>
                          ))}
                        </ul>
                      </div>

                      {/* Conteúdo */}
                      <div className="bg-green-900/20 rounded-lg p-4 md:p-6 border border-green-500/30">
                        <h4 className="text-base md:text-lg font-semibold text-white mb-3 md:mb-4 flex items-center gap-2">
                          📝 Conteúdo e Redação
                        </h4>
                        <ul className="space-y-2">
                          {tips.data.content.map((tip, index) => (
                            <li key={index} className="text-gray-300 flex items-start gap-2">
                              <CheckCircle className="text-green-400 flex-shrink-0 mt-1" size={14} />
                              {tip}
                            </li>
                          ))}
                        </ul>
                      </div>

                      {/* Habilidades */}
                      <div className="bg-purple-900/20 rounded-lg p-4 md:p-6 border border-purple-500/30">
                        <h4 className="text-base md:text-lg font-semibold text-white mb-3 md:mb-4 flex items-center gap-2">
                          ⚡ Habilidades e Competências
                        </h4>
                        <ul className="space-y-2">
                          {tips.data.skills.map((tip, index) => (
                            <li key={index} className="text-gray-300 flex items-start gap-2">
                              <CheckCircle className="text-purple-400 flex-shrink-0 mt-1" size={14} />
                              {tip}
                            </li>
                          ))}
                        </ul>
                      </div>

                      {/* Erros Comuns */}
                      <div className="bg-red-900/20 rounded-lg p-4 md:p-6 border border-red-500/30">
                        <h4 className="text-base md:text-lg font-semibold text-white mb-3 md:mb-4 flex items-center gap-2">
                          ⚠️ Erros Comuns para Evitar
                        </h4>
                        <ul className="space-y-2">
                          {tips.data.common_mistakes.map((mistake, index) => (
                            <li key={index} className="text-gray-300 flex items-start gap-2">
                              <X className="text-red-400 flex-shrink-0 mt-1" size={14} />
                              {mistake}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>

                    {/* Call to Action */}
                    <div className="bg-gradient-to-r from-purple-900/20 to-pink-900/20 rounded-lg p-4 md:p-6 border border-purple-500/30 text-center">
                      <h4 className="text-base md:text-lg font-semibold text-white mb-2">
                        🚀 Quer uma Análise Personalizada?
                      </h4>
                      <p className="text-gray-300 mb-3 md:mb-4 text-sm md:text-base">
                        Receba sugestões específicas baseadas no seu perfil e experiências
                      </p>
                      <button
                        onClick={handleForceAnalyze}
                        disabled={loading}
                        className={`px-4 py-2 md:px-6 md:py-3 text-sm md:text-base ${canAnalyze 
                          ? 'bg-purple-600 hover:bg-purple-700' 
                          : 'bg-yellow-600 hover:bg-yellow-700'
                        } disabled:bg-gray-500 disabled:cursor-not-allowed text-white rounded-lg transition-colors font-medium flex items-center gap-2 mx-auto`}
                      >
                        <Brain className="w-4 h-4 md:w-5 md:h-5" />
                        {canAnalyze ? 'Analisar Agora' : `Aguardar ${formatCooldownTime(cooldownRemaining)}`}
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-8 md:py-12">
                    <div className="animate-pulse flex flex-col items-center">
                      <div className="h-12 w-12 md:h-16 md:w-16 rounded-full bg-blue-600/20 mb-4 flex items-center justify-center">
                        <Lightbulb className="text-blue-400 animate-pulse w-6 h-6 md:w-8 md:h-8" />
                      </div>
                      <p className="text-gray-300 text-sm md:text-base">Carregando dicas...</p>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {showCooldownModal && <CooldownModal />}
    </>
  );
};

export default ResumeAnalysisModal;
