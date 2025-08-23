import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Building, 
  Camera, 
  LogOut, 
  Check,
  X,
  MapPin,
  FileText
} from 'lucide-react';
import { useCompany } from '../../hooks/useCompany';
import { companyService } from '../../services/companyService';

const Settings = () => {
  const navigate = useNavigate();
  const { company, loading, error, saveCompany, uploadLogo, deleteLogo } = useCompany();
  
  const [isSaving, setIsSaving] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [validationErrors, setValidationErrors] = useState<string[]>([]);
  
  // Form states
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    address: '',
    logoUrl: ''
  });
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [logoPreview, setLogoPreview] = useState<string>('');
  
  // Carregar dados da empresa quando o componente montar
  useEffect(() => {
    if (company) {
      setFormData({
        name: company.name || '',
        description: company.description || '',
        address: company.address || '',
        logoUrl: company.logoUrl || ''
      });
      setLogoPreview(company.logoUrl || '');
    }
  }, [company]);
  
  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    setValidationErrors([]);
  };
  
  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validar dados
    const errors = companyService.validateCompany(formData);
    if (errors.length > 0) {
      setValidationErrors(errors);
      return;
    }
    
    try {
      setIsSaving(true);
      setValidationErrors([]);
      
      // Salvar dados da empresa
      await saveCompany(formData);
      
      // Se há arquivo de logo, fazer upload
      if (logoFile) {
        const uploadResult = await uploadLogo(logoFile);
        setLogoFile(null);
        // Atualizar o preview com a URL retornada pelo backend
        setLogoPreview(uploadResult.logoUrl);
        // Atualizar também o formData
        setFormData(prev => ({ ...prev, logoUrl: uploadResult.logoUrl }));
      }
      
      setSuccessMessage(company ? 'Empresa atualizada com sucesso!' : 'Empresa criada com sucesso!');
      
      // Hide success message after 3 seconds
      setTimeout(() => {
        setSuccessMessage('');
      }, 3000);
    } catch (error: any) {
      setValidationErrors([error.message || 'Erro ao salvar empresa']);
    } finally {
      setIsSaving(false);
    }
  };
  
  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setLogoFile(file);
      
      // Criar preview da imagem
      const reader = new FileReader();
      reader.onload = () => {
        setLogoPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };
  
  const handleDeleteLogo = async () => {
    if (!company?.logoUrl) return;
    
    if (!window.confirm('Tem certeza que deseja excluir a logo da empresa?')) {
      return;
    }
    
    try {
      await deleteLogo();
      setLogoPreview('');
      setLogoFile(null);
      setFormData(prev => ({ ...prev, logoUrl: '' }));
      setSuccessMessage('Logo excluída com sucesso!');
      
      setTimeout(() => {
        setSuccessMessage('');
      }, 3000);
    } catch (error: any) {
      setValidationErrors([error.message || 'Erro ao excluir logo']);
    }
  };
  
  const handleLogout = () => {
    // In a real app, this would call an API to logout
    localStorage.removeItem('authToken');
    navigate('/login');
  };
  
  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-pulse flex flex-col items-center">
          <div className="h-12 w-12 rounded-full bg-dark-700 mb-4"></div>
          <div className="h-4 w-32 bg-dark-700 rounded mb-2"></div>
          <div className="h-3 w-24 bg-dark-700 rounded"></div>
        </div>
      </div>
    );
  }
  
  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-white">Configurações da Empresa</h1>
            <p className="text-dark-300 mt-1">
              Gerencie as informações da sua empresa
            </p>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center px-4 py-2 text-red-400 hover:bg-red-500/10 rounded-md transition-colors"
          >
            <LogOut size={18} className="mr-2" />
            <span>Sair da Conta</span>
          </button>
        </div>
      </div>
      
      {/* Success message */}
      {successMessage && (
        <div className="mb-6 p-4 bg-green-500/20 border border-green-500/30 rounded-md flex items-center justify-between text-green-400">
          <div className="flex items-center">
            <Check size={18} className="mr-2 flex-shrink-0" />
            <p>{successMessage}</p>
          </div>
          <button 
            onClick={() => setSuccessMessage('')}
            className="text-green-400 hover:text-green-300"
          >
            <X size={18} />
          </button>
        </div>
      )}
      
      {/* Error messages */}
      {(error || validationErrors.length > 0) && (
        <div className="mb-6 p-4 bg-red-500/20 border border-red-500/30 rounded-md text-red-400">
          <div className="flex items-start">
            <X size={18} className="mr-2 flex-shrink-0 mt-0.5" />
            <div>
              {error && <p className="mb-2">{error}</p>}
              {validationErrors.map((err, index) => (
                <p key={index} className="mb-1">{err}</p>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Company Profile Form */}
      <div className="card animate-fade-in">
        <h2 className="text-xl font-semibold mb-6">Perfil da Empresa</h2>
        
        <form onSubmit={handleSaveProfile} className="space-y-6">
          {/* Company logo */}
          <div className="flex flex-col items-center mb-6">
            <div className="relative">
              {logoPreview ? (
                <img
                  src={logoPreview}
                  alt="Company logo"
                  className="w-24 h-24 rounded-full object-cover bg-dark-700"
                />
              ) : (
                <div className="w-24 h-24 rounded-full bg-dark-700 flex items-center justify-center border-2 border-dashed border-dark-600">
                  <svg
                    className="w-8 h-8 text-dark-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                    />
                  </svg>
                </div>
              )}
              <label
                htmlFor="logo-upload"
                className="absolute bottom-0 right-0 bg-dark-800 p-2 rounded-full cursor-pointer border border-dark-600 hover:bg-dark-700 transition-colors"
              >
                <Camera size={16} className="text-dark-300" />
                <input
                  id="logo-upload"
                  type="file"
                  className="hidden"
                  accept="image/*"
                  onChange={handleLogoChange}
                />
              </label>
            </div>
            <div className="mt-2 text-center">
              <p className="text-sm text-dark-400">
                Clique no ícone de câmera para fazer upload de uma nova logo
              </p>
              {company?.logoUrl && (
                <button
                  type="button"
                  onClick={handleDeleteLogo}
                  className="text-red-400 hover:text-red-300 text-sm mt-1"
                >
                  Excluir Logo
                </button>
              )}
            </div>
          </div>
          
          <div>
            <label htmlFor="company-name" className="block text-sm font-medium text-dark-200 mb-2">
              Nome da Empresa *
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Building size={18} className="text-dark-400" />
              </div>
              <input
                type="text"
                id="company-name"
                value={formData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                className="form-input pl-10"
                placeholder="Ex: TechRecruit Solutions"
                required
              />
            </div>
          </div>
          
          <div>
            <label htmlFor="company-description" className="block text-sm font-medium text-dark-200 mb-2">
              Descrição da Empresa
            </label>
            <div className="relative">
              <div className="absolute top-3 left-3 pointer-events-none">
                <FileText size={18} className="text-dark-400" />
              </div>
              <textarea
                id="company-description"
                value={formData.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                className="form-input pl-10 min-h-[80px]"
                placeholder="Descreva sua empresa, cultura e valores..."
                rows={3}
              />
            </div>
          </div>
          
          <div>
            <label htmlFor="company-address" className="block text-sm font-medium text-dark-200 mb-2">
              Endereço da Empresa *
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <MapPin size={18} className="text-dark-400" />
              </div>
              <input
                type="text"
                id="company-address"
                value={formData.address}
                onChange={(e) => handleInputChange('address', e.target.value)}
                className="form-input pl-10"
                placeholder="Ex: Rua das Flores, 123 - São Paulo, SP"
                required
              />
            </div>
          </div>
          
          <div>
            <label htmlFor="logo-url" className="block text-sm font-medium text-dark-200 mb-2">
              URL da Logo (opcional)
            </label>
            <input
              type="url"
              id="logo-url"
              value={formData.logoUrl}
              onChange={(e) => handleInputChange('logoUrl', e.target.value)}
              className="form-input"
              placeholder="Ex: https://sua-empresa.com/logo.png"
            />
            <p className="text-xs text-dark-400 mt-1">
              Você pode usar uma URL externa para sua logo ou fazer upload de um arquivo
            </p>
          </div>
          
          <div className="pt-4">
            <div className="flex justify-end">
              <button
              type="submit"
              className="btn btn-primary"
              disabled={isSaving}
              >
              {isSaving ? (
                <span className="inline-block animate-pulse">Salvando...</span>
              ) : (
                <span>{company ? 'Atualizar Empresa' : 'Criar Empresa'}</span>
              )}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Settings;