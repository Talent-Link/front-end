const API_BASE_URL = 'https://talentlink-wd88.onrender.com';

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

export const profileService = {
  // Buscar perfil do candidato
  async getProfile(): Promise<ProfileData | null> {
    try {
      const token = localStorage.getItem('authToken');
      if (!token) {
        throw new Error('Token de autenticação não encontrado');
      }

      const response = await fetch(`${API_BASE_URL}/candidates/profile`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.status === 404) {
        // Perfil não existe ainda
        return null;
      }

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Erro ao buscar perfil');
      }

      return await response.json();
    } catch (error) {
      console.error('Erro ao buscar perfil:', error);
      throw error;
    }
  },

  // Atualizar ou criar perfil do candidato
  async updateProfile(profileData: ProfileData): Promise<ProfileData> {
    try {
      const token = localStorage.getItem('authToken');
      if (!token) {
        throw new Error('Token de autenticação não encontrado');
      }

      console.log('Enviando dados do perfil:', profileData);

      const response = await fetch(`${API_BASE_URL}/candidates/profile`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(profileData)
      });

      if (!response.ok) {
        const error = await response.json();
        console.error('Erro da API:', error);
        throw new Error(error.message || 'Erro ao salvar perfil');
      }

      const result = await response.json();
      console.log('Perfil salvo com sucesso:', result);
      return result;
    } catch (error) {
      console.error('Erro ao salvar perfil:', error);
      throw error;
    }
  },

  // Upload de currículo
  async uploadResume(resumeUrl: string): Promise<{ message: string; resumeUrl: string; previousResumeUrl?: string }> {
    try {
      const token = localStorage.getItem('authToken');
      if (!token) {
        throw new Error('Token de autenticação não encontrado');
      }

      console.log('Enviando currículo:', resumeUrl.length > 100 ? `${resumeUrl.substring(0, 100)}...` : resumeUrl);

      const response = await fetch(`${API_BASE_URL}/candidates/profile/resume`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ resumeUrl })
      });

      console.log('Status da resposta:', response.status, response.statusText);

      if (!response.ok) {
        let errorMessage = `Erro ${response.status}: ${response.statusText}`;
        try {
          const error = await response.json();
          console.error('Erro da API:', error);
          errorMessage = error.message || errorMessage;
        } catch (parseError) {
          console.error('Erro ao fazer parse da resposta:', parseError);
        }
        throw new Error(errorMessage);
      }

      const result = await response.json();
      console.log('Upload realizado com sucesso:', result);
      return result;
    } catch (error) {
      console.error('Erro no upload do currículo:', error);
      
      // Tratar diferentes tipos de erro de rede
      if (error instanceof TypeError && error.message.includes('fetch')) {
        throw new Error('Erro de conexão. Verifique sua internet e tente novamente.');
      }
      
      if (error instanceof Error && error.message.includes('NetworkError')) {
        throw new Error('Erro de rede. Tente novamente em alguns segundos.');
      }
      
      throw error;
    }
  },

  // Upload de arquivo local (converte para base64 e depois chama uploadResume)
  async uploadFile(file: File): Promise<{ message: string; resumeUrl: string; previousResumeUrl?: string }> {
    try {
      // Validar tipo de arquivo
      if (file.type !== 'application/pdf') {
        throw new Error('Apenas arquivos PDF são aceitos');
      }

      // Validar tamanho (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        throw new Error('Arquivo deve ter no máximo 5MB');
      }

      // Converter arquivo para base64
      const base64File = await this.fileToBase64(file);
      const dataUrl = `data:application/pdf;base64,${base64File}`;
      
      console.log('Arquivo convertido para base64:', file.name, file.size, file.type);

      try {
        // Tentar upload normal primeiro
        return await this.uploadResume(dataUrl);
      } catch (apiError) {
        console.warn('Upload via API falhou, salvando localmente:', apiError);
        
        // Se falhar, salvar localmente como fallback
        const fallbackData = {
          message: 'Currículo salvo localmente (será sincronizado quando a conexão for restaurada)',
          resumeUrl: dataUrl,
          isLocal: true
        };
        
        // Salvar no localStorage para tentar sincronizar depois
        const pendingUploads = JSON.parse(localStorage.getItem('pendingResumeUploads') || '[]');
        pendingUploads.push({
          data: dataUrl,
          timestamp: new Date().toISOString(),
          fileName: file.name
        });
        localStorage.setItem('pendingResumeUploads', JSON.stringify(pendingUploads));
        
        return fallbackData;
      }
    } catch (error) {
      console.error('Erro no upload do arquivo:', error);
      throw error;
    }
  },

  // Tentar sincronizar uploads pendentes
  async syncPendingUploads(): Promise<void> {
    try {
      const pendingUploads = JSON.parse(localStorage.getItem('pendingResumeUploads') || '[]');
      
      if (pendingUploads.length === 0) {
        return;
      }

      console.log(`Tentando sincronizar ${pendingUploads.length} uploads pendentes...`);

      for (let i = pendingUploads.length - 1; i >= 0; i--) {
        const upload = pendingUploads[i];
        try {
          await this.uploadResume(upload.data);
          console.log(`Upload sincronizado: ${upload.fileName}`);
          
          // Remover da lista de pendentes
          pendingUploads.splice(i, 1);
        } catch (error) {
          console.warn(`Falha ao sincronizar ${upload.fileName}:`, error);
          // Manter na lista para tentar depois
        }
      }

      // Atualizar lista de pendentes
      localStorage.setItem('pendingResumeUploads', JSON.stringify(pendingUploads));
      
      if (pendingUploads.length === 0) {
        console.log('Todos os uploads foram sincronizados com sucesso!');
      }
    } catch (error) {
      console.error('Erro ao sincronizar uploads pendentes:', error);
    }
  },

  // Excluir currículo
  async deleteResume(): Promise<{ message: string; deletedResumeUrl: string }> {
    try {
      const token = localStorage.getItem('authToken');
      if (!token) {
        throw new Error('Token de autenticação não encontrado');
      }

      console.log('Excluindo currículo...');

      const response = await fetch(`${API_BASE_URL}/candidates/profile/resume`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        const error = await response.json();
        console.error('Erro ao excluir currículo:', error);
        throw new Error(error.message || 'Erro ao excluir currículo');
      }

      const result = await response.json();
      console.log('Currículo excluído com sucesso:', result);
      return result;
    } catch (error) {
      console.error('Erro ao excluir currículo:', error);
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
          // Remove o prefixo "data:application/pdf;base64," para enviar apenas o base64
          const base64 = reader.result.split(',')[1];
          resolve(base64);
        } else {
          reject(new Error('Erro ao converter arquivo'));
        }
      };
      reader.onerror = error => reject(error);
    });
  },

  // Validar dados do perfil antes de enviar
  validateProfile(profileData: ProfileData): string[] {
    const errors: string[] = [];

    // Validar telefone
    if (profileData.phoneNumber && !/^\+?[\d\s\-\(\)]+$/.test(profileData.phoneNumber)) {
      errors.push('Formato do telefone inválido');
    }

    // Validar experiências
    profileData.experiences.forEach((exp, index) => {
      if (exp.position && !exp.company) {
        errors.push(`Experiência ${index + 1}: Empresa é obrigatória quando cargo é informado`);
      }
      if (exp.company && !exp.position) {
        errors.push(`Experiência ${index + 1}: Cargo é obrigatório quando empresa é informada`);
      }
      if (exp.startDate && exp.endDate && exp.startDate > exp.endDate) {
        errors.push(`Experiência ${index + 1}: Data de início não pode ser posterior à data de fim`);
      }
    });

    // Validar educação
    profileData.educations.forEach((edu, index) => {
      if (edu.startYear && edu.endYear && edu.startYear > edu.endYear) {
        errors.push(`Educação ${index + 1}: Ano de início não pode ser posterior ao ano de fim`);
      }
      if (edu.startYear && (edu.startYear < 1900 || edu.startYear > new Date().getFullYear() + 10)) {
        errors.push(`Educação ${index + 1}: Ano de início inválido`);
      }
      if (edu.endYear && (edu.endYear < 1900 || edu.endYear > new Date().getFullYear() + 10)) {
        errors.push(`Educação ${index + 1}: Ano de fim inválido`);
      }
    });

    return errors;
  },

  // Buscar perfil de candidato específico (para RH)
  async getCandidateProfile(candidateId: string): Promise<any> {
    try {
      const token = localStorage.getItem('authToken');
      if (!token) {
        throw new Error('Token de autenticação não encontrado');
      }

      const url = `${API_BASE_URL}/candidates/profile/${candidateId}`;
      console.log('🔗 Fazendo requisição para:', url);
      console.log('🎯 CandidateId recebido:', candidateId);

      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      console.log('📡 Status da resposta:', response.status, response.statusText);

      if (!response.ok) {
        if (response.status === 404) {
          throw new Error(`Candidato com ID "${candidateId}" não possui perfil completo ou o ID está incorreto`);
        }
        if (response.status === 403) {
          throw new Error('Acesso negado - apenas usuários RH podem acessar');
        }
        if (response.status === 401) {
          throw new Error('Token inválido ou expirado');
        }
        
        const error = await response.json();
        throw new Error(error.message || `Erro ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      console.log('✅ Dados do perfil recebidos:', data);
      return data;
    } catch (error: any) {
      console.error('❌ Erro detalhado:', error);
      throw error;
    }
  }
};

export type { ProfileData, Experience, Education };
