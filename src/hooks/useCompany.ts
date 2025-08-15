// useCompany.ts
import { useState, useEffect } from 'react';
import { companyService, Company } from '../services/companyService';

export const useCompany = () => {
  const [company, setCompany] = useState<Company | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadCompany = async () => {
    try {
      setLoading(true);
      setError(null);
      const companyData = await companyService.getCompany();
      setCompany(companyData);
    } catch (err: any) {
      setError(err.message || 'Erro ao carregar empresa');
    } finally {
      setLoading(false);
    }
  };

  const saveCompany = async (companyData: Omit<Company, 'id' | 'recruiterId' | 'createdAt'>) => {
    try {
      setLoading(true);
      setError(null);
      const savedCompany = await companyService.createOrUpdateCompany(companyData);
      setCompany(savedCompany);
      return savedCompany;
    } catch (err: any) {
      setError(err.message || 'Erro ao salvar empresa');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const uploadLogo = async (file: File) => {
    try {
      setError(null);
      const result = await companyService.uploadLogoFile(file);
      
      // Atualizar a empresa local com a nova logo
      if (company) {
        setCompany({
          ...company,
          logoUrl: result.logoUrl
        });
      }
      
      return result;
    } catch (err: any) {
      setError(err.message || 'Erro ao fazer upload da logo');
      throw err;
    }
  };

  const deleteLogo = async () => {
    try {
      setError(null);
      const result = await companyService.deleteLogo();
      
      // Atualizar a empresa local removendo a logo
      if (company) {
        setCompany({
          ...company,
          logoUrl: undefined
        });
      }
      
      return result;
    } catch (err: any) {
      setError(err.message || 'Erro ao excluir logo');
      throw err;
    }
  };

  useEffect(() => {
    loadCompany();
  }, []);

  return {
    company,
    loading,
    error,
    loadCompany,
    saveCompany,
    uploadLogo,
    deleteLogo,
    hasCompany: !!company
  };
};
