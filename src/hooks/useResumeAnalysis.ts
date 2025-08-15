// useResumeAnalysis.ts
import { useState, useEffect, useCallback } from 'react';
import { resumeAnalysisService, ResumeAnalysisResponse, ResumeTipsResponse } from '../services/resumeAnalysisService';

export const useResumeAnalysis = () => {
  const [analysis, setAnalysis] = useState<ResumeAnalysisResponse | null>(null);
  const [tips, setTips] = useState<ResumeTipsResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [cooldownRemaining, setCooldownRemaining] = useState(0);

  // Atualizar cooldown a cada segundo
  useEffect(() => {
    const updateCooldown = () => {
      const remaining = resumeAnalysisService.getCooldownRemaining();
      setCooldownRemaining(remaining);
    };

    updateCooldown();
    const interval = setInterval(updateCooldown, 1000);

    return () => clearInterval(interval);
  }, []);

  // Analisar currículo
  const analyzeResume = useCallback(async (force: boolean = false) => {
    if (!force && !resumeAnalysisService.canAnalyze()) {
      const remaining = resumeAnalysisService.getCooldownRemaining();
      const timeFormatted = resumeAnalysisService.formatCooldownTime(remaining);
      throw new Error(`Aguarde ${timeFormatted} antes de fazer uma nova análise`);
    }

    try {
      setLoading(true);
      setError(null);

      const result = await resumeAnalysisService.analyzeResume();
      setAnalysis(result);
      
      // Marcar tempo da análise apenas se foi bem-sucedida
      resumeAnalysisService.markAnalysisTime();
      
      return result;
    } catch (err: any) {
      console.error('Erro na análise:', err);
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Obter dicas gerais
  const getTips = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const result = await resumeAnalysisService.getResumeTips();
      setTips(result);
      
      return result;
    } catch (err: any) {
      console.error('Erro ao obter dicas:', err);
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Verificar status do serviço
  const checkServiceStatus = useCallback(async () => {
    try {
      const result = await resumeAnalysisService.checkServiceStatus();
      return result;
    } catch (err: any) {
      console.error('Erro ao verificar serviço:', err);
      throw err;
    }
  }, []);

  // Limpar dados
  const clearData = useCallback(() => {
    setAnalysis(null);
    setTips(null);
    setError(null);
  }, []);

  // Verificar se pode analisar
  const canAnalyze = resumeAnalysisService.canAnalyze();
  
  // Formatar tempo de cooldown
  const formatCooldownTime = (ms: number) => resumeAnalysisService.formatCooldownTime(ms);

  return {
    // Estados
    analysis,
    tips,
    loading,
    error,
    cooldownRemaining,
    canAnalyze,
    
    // Ações
    analyzeResume,
    getTips,
    checkServiceStatus,
    clearData,
    
    // Utilitários
    formatCooldownTime
  };
};
