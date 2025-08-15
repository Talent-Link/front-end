// companyService.ts
const API_BASE_URL = 'https://talentlink-wd88.onrender.com';

interface Company {
  id?: string;
  name: string;
  description?: string;
  address: string;
  logoUrl?: string;
  recruiterId?: string;
  createdAt?: string;
}

export const companyService = {
  // Criar ou atualizar empresa
  async createOrUpdateCompany(companyData: Omit<Company, 'id' | 'recruiterId' | 'createdAt'>): Promise<Company> {
    try {
      const token = localStorage.getItem('authToken');
      if (!token) {
        throw new Error('Token de autenticação não encontrado');
      }

      console.log('Salvando empresa:', companyData);

      const response = await fetch(`${API_BASE_URL}/empresa`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(companyData)
      });

      if (!response.ok) {
        const error = await response.text();
        throw new Error(error || 'Erro ao salvar empresa');
      }

      const result = await response.json();
      console.log('Empresa salva:', result);
      return result;
    } catch (error) {
      console.error('Erro ao salvar empresa:', error);
      throw error;
    }
  },

  // Buscar empresa do RH logado
  async getCompany(): Promise<Company | null> {
    try {
      const token = localStorage.getItem('authToken');
      if (!token) {
        throw new Error('Token de autenticação não encontrado');
      }

      const response = await fetch(`${API_BASE_URL}/empresa`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.status === 404) {
        // Empresa não encontrada
        return null;
      }

      if (!response.ok) {
        const error = await response.text();
        throw new Error(error || 'Erro ao buscar empresa');
      }

      return await response.json();
    } catch (error) {
      console.error('Erro ao buscar empresa:', error);
      throw error;
    }
  },

  // Listar empresas do RH
  async listCompanies(): Promise<{id: string, name: string, logoUrl: string | null}[]> {
    try {
      const token = localStorage.getItem('authToken');
      if (!token) {
        throw new Error('Token de autenticação não encontrado');
      }

      const response = await fetch(`${API_BASE_URL}/empresa/rh`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        const error = await response.text();
        throw new Error(error || 'Erro ao listar empresas');
      }

      return await response.json();
    } catch (error) {
      console.error('Erro ao listar empresas:', error);
      throw error;
    }
  },

  // Upload de logo da empresa
  async uploadLogo(logoUrl: string): Promise<{ message: string; logoUrl: string; previousLogoUrl?: string }> {
    try {
      const token = localStorage.getItem('authToken');
      if (!token) {
        throw new Error('Token de autenticação não encontrado');
      }

      console.log('Enviando logo:', logoUrl.length > 100 ? `${logoUrl.substring(0, 100)}...` : logoUrl);

      const response = await fetch(`${API_BASE_URL}/empresa/logo`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ logoUrl })
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Erro ao fazer upload da logo');
      }

      const result = await response.json();
      console.log('Logo enviada com sucesso:', result);
      return result;
    } catch (error) {
      console.error('Erro no upload da logo:', error);
      throw error;
    }
  },

  // Upload de arquivo de logo (converte para base64)
  async uploadLogoFile(file: File): Promise<{ message: string; logoUrl: string; previousLogoUrl?: string }> {
    try {
      // Validar tipo de arquivo
      if (!file.type.startsWith('image/')) {
        throw new Error('Apenas arquivos de imagem são aceitos');
      }

      // Validar tamanho (max 2MB)
      if (file.size > 2 * 1024 * 1024) {
        throw new Error('Imagem deve ter no máximo 2MB');
      }

      // Converter arquivo para base64
      const base64File = await this.fileToBase64(file);
      const dataUrl = `data:${file.type};base64,${base64File}`;
      
      console.log('Imagem convertida para base64:', file.name, file.size, file.type);

      return await this.uploadLogo(dataUrl);
    } catch (error) {
      console.error('Erro no upload do arquivo de logo:', error);
      throw error;
    }
  },

  // Excluir logo da empresa
  async deleteLogo(): Promise<{ message: string; deletedLogoUrl: string }> {
    try {
      const token = localStorage.getItem('authToken');
      if (!token) {
        throw new Error('Token de autenticação não encontrado');
      }

      console.log('Excluindo logo...');

      const response = await fetch(`${API_BASE_URL}/empresa/logo`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Erro ao excluir logo');
      }

      const result = await response.json();
      console.log('Logo excluída com sucesso:', result);
      return result;
    } catch (error) {
      console.error('Erro ao excluir logo:', error);
      throw error;
    }
  },

  // Converter arquivo para base64
  fileToBase64(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        if (typeof reader.result === 'string') {
          // Remove o prefixo "data:image/type;base64," para enviar apenas o base64
          const base64 = reader.result.split(',')[1];
          resolve(base64);
        } else {
          reject(new Error('Erro ao converter arquivo'));
        }
      };
      reader.onerror = error => reject(error);
    });
  },

  // Validar dados da empresa
  validateCompany(companyData: Omit<Company, 'id' | 'recruiterId' | 'createdAt'>): string[] {
    const errors: string[] = [];

    if (!companyData.name || companyData.name.trim().length === 0) {
      errors.push('Nome da empresa é obrigatório');
    }

    if (companyData.name && companyData.name.length > 100) {
      errors.push('Nome da empresa deve ter no máximo 100 caracteres');
    }

    if (!companyData.address || companyData.address.trim().length === 0) {
      errors.push('Endereço é obrigatório');
    }

    if (companyData.address && companyData.address.length > 255) {
      errors.push('Endereço deve ter no máximo 255 caracteres');
    }

    if (companyData.description && companyData.description.length > 500) {
      errors.push('Descrição deve ter no máximo 500 caracteres');
    }

    if (companyData.logoUrl && !this.isValidUrl(companyData.logoUrl)) {
      errors.push('URL da logo deve ser uma URL válida');
    }

    return errors;
  },

  // Validar se é uma URL válida
  isValidUrl(url: string): boolean {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  }
};

export type { Company };
