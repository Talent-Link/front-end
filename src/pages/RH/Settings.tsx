import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Building, 
  Mail, 
  Camera, 
  Lock, 
  Bell, 
  Shield, 
  LogOut, 
  Check,
  X
} from 'lucide-react';
import { User } from '../../types';

// Mock data
const mockUser: User = {
  id: '1',
  name: 'TechRecruit Solutions',
  email: 'contact@techrecruit.com',
  company: 'TechRecruit',
  logoUrl: 'https://via.placeholder.com/150',
};

const Settings = () => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('profile');
  const [isSaving, setIsSaving] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const navigate = useNavigate();
  
  // Form states
  const [companyName, setCompanyName] = useState('');
  const [email, setEmail] = useState('');
  const [logoUrl, setLogoUrl] = useState('');
  
  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setUser(mockUser);
      setCompanyName(mockUser.name);
      setEmail(mockUser.email);
      setLogoUrl(mockUser.logoUrl || '');
      setIsLoading(false);
    }, 1000);
  }, []);
  
  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
  };
  
  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    
    // Simulate API call
    setTimeout(() => {
      setUser({
        ...user!,
        name: companyName,
        email,
        logoUrl,
      });
      setIsSaving(false);
      setSuccessMessage('Perfil atualizado com sucesso!');
      
      // Hide success message after 3 seconds
      setTimeout(() => {
        setSuccessMessage('');
      }, 3000);
    }, 1000);
  };
  
  const handleLogout = () => {
    // In a real app, this would call an API to logout
    localStorage.removeItem('talentlink-user');
    navigate('/login');
  };
  
  if (isLoading) {
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
        <h1 className="text-3xl font-bold">Configurações</h1>
        <p className="text-dark-300 mt-1">
          Gerencie as configurações da sua conta
        </p>
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
      
      <div className="flex flex-col lg:flex-row gap-6">
        {/* Sidebar */}
        <div className="lg:w-64">
          <div className="card p-4">
            <nav className="space-y-1">
              <button
                onClick={() => handleTabChange('profile')}
                className={`flex items-center w-full px-3 py-2 rounded-md transition-colors ${
                  activeTab === 'profile'
                    ? 'bg-gradient-primary text-white'
                    : 'text-dark-200 hover:bg-dark-700'
                }`}
              >
                <Building size={18} className="mr-2" />
                <span>Perfil da Empresa</span>
              </button>
              
              <button
                onClick={() => handleTabChange('security')}
                className={`flex items-center w-full px-3 py-2 rounded-md transition-colors ${
                  activeTab === 'security'
                    ? 'bg-gradient-primary text-white'
                    : 'text-dark-200 hover:bg-dark-700'
                }`}
              >
                <Lock size={18} className="mr-2" />
                <span>Segurança</span>
              </button>
              
              <button
                onClick={() => handleTabChange('notifications')}
                className={`flex items-center w-full px-3 py-2 rounded-md transition-colors ${
                  activeTab === 'notifications'
                    ? 'bg-gradient-primary text-white'
                    : 'text-dark-200 hover:bg-dark-700'
                }`}
              >
                <Bell size={18} className="mr-2" />
                <span>Notificações</span>
              </button>
              
              <button
                onClick={() => handleTabChange('privacy')}
                className={`flex items-center w-full px-3 py-2 rounded-md transition-colors ${
                  activeTab === 'privacy'
                    ? 'bg-gradient-primary text-white'
                    : 'text-dark-200 hover:bg-dark-700'
                }`}
              >
                <Shield size={18} className="mr-2" />
                <span>Privacidade</span>
              </button>
            </nav>
            
            <div className="mt-8 pt-4 border-t border-dark-700">
              <button
                onClick={handleLogout}
                className="flex items-center w-full px-3 py-2 text-red-400 hover:bg-red-500/10 rounded-md transition-colors"
              >
                <LogOut size={18} className="mr-2" />
                <span>Sair da Conta</span>
              </button>
            </div>
          </div>
        </div>
        
        {/* Content */}
        <div className="flex-1">
          {activeTab === 'profile' && (
            <div className="card animate-fade-in">
              <h2 className="text-xl font-semibold mb-6">Perfil da Empresa</h2>
              
              <form onSubmit={handleSaveProfile} className="space-y-6">
                {/* Company logo */}
                <div className="flex flex-col items-center mb-6">
                  <div className="relative">
                    <img
                      src={logoUrl || 'https://via.placeholder.com/150?text=Logo'}
                      alt="Company logo"
                      className="w-24 h-24 rounded-full object-cover bg-dark-700"
                    />
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
                        onChange={() => {
                          // In a real app, this would upload the file
                          alert('File upload would be implemented here.');
                        }}
                      />
                    </label>
                  </div>
                  <p className="text-sm text-dark-400 mt-2">
                    Clique no ícone de câmera para fazer upload de uma nova logo
                  </p>
                </div>
                
                <div>
                  <label htmlFor="company-name" className="block text-sm font-medium text-dark-200 mb-2">
                    Nome da Empresa
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Building size={18} className="text-dark-400" />
                    </div>
                    <input
                      type="text"
                      id="company-name"
                      value={companyName}
                      onChange={(e) => setCompanyName(e.target.value)}
                      className="form-input pl-10"
                      placeholder="Ex: TechRecruit Solutions"
                      required
                    />
                  </div>
                </div>
                
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-dark-200 mb-2">
                    Email de Contato
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Mail size={18} className="text-dark-400" />
                    </div>
                    <input
                      type="email"
                      id="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="form-input pl-10"
                      placeholder="Ex: contato@empresa.com"
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
                    value={logoUrl}
                    onChange={(e) => setLogoUrl(e.target.value)}
                    className="form-input"
                    placeholder="Ex: https://sua-empresa.com/logo.png"
                  />
                  <p className="text-xs text-dark-400 mt-1">
                    Você pode usar uma URL externa para sua logo
                  </p>
                </div>
                
                <div className="pt-4">
                  <button
                    type="submit"
                    className="btn btn-primary"
                    disabled={isSaving}
                  >
                    {isSaving ? (
                      <span className="inline-block animate-pulse">Salvando...</span>
                    ) : (
                      <span>Salvar Alterações</span>
                    )}
                  </button>
                </div>
              </form>
            </div>
          )}
          
          {activeTab === 'security' && (
            <div className="card animate-fade-in">
              <h2 className="text-xl font-semibold mb-6">Segurança</h2>
              
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-medium mb-3">Alterar Senha</h3>
                  <div className="space-y-4">
                    <div>
                      <label htmlFor="current-password" className="block text-sm font-medium text-dark-200 mb-2">
                        Senha Atual
                      </label>
                      <input
                        type="password"
                        id="current-password"
                        className="form-input"
                        placeholder="Digite sua senha atual"
                      />
                    </div>
                    
                    <div>
                      <label htmlFor="new-password" className="block text-sm font-medium text-dark-200 mb-2">
                        Nova Senha
                      </label>
                      <input
                        type="password"
                        id="new-password"
                        className="form-input"
                        placeholder="Digite a nova senha"
                      />
                    </div>
                    
                    <div>
                      <label htmlFor="confirm-password" className="block text-sm font-medium text-dark-200 mb-2">
                        Confirme a Nova Senha
                      </label>
                      <input
                        type="password"
                        id="confirm-password"
                        className="form-input"
                        placeholder="Digite a nova senha novamente"
                      />
                    </div>
                    
                    <div>
                      <button
                        type="button"
                        className="btn btn-primary"
                        onClick={() => alert('Password change would be implemented here.')}
                      >
                        Atualizar Senha
                      </button>
                    </div>
                  </div>
                </div>
                
                <div className="pt-6 border-t border-dark-700">
                  <h3 className="text-lg font-medium mb-3">Autenticação de Dois Fatores</h3>
                  <p className="text-dark-300 mb-4">
                    Adicione uma camada extra de segurança à sua conta habilitando a autenticação de dois fatores.
                  </p>
                  <button
                    type="button"
                    className="btn btn-primary"
                    onClick={() => alert('2FA setup would be implemented here.')}
                  >
                    Configurar 2FA
                  </button>
                </div>
              </div>
            </div>
          )}
          
          {activeTab === 'notifications' && (
            <div className="card animate-fade-in">
              <h2 className="text-xl font-semibold mb-6">Notificações</h2>
              
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium">Novas Candidaturas</h3>
                    <p className="text-sm text-dark-300">
                      Receba notificações quando novos candidatos se aplicarem às suas vagas.
                    </p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" className="sr-only peer" defaultChecked />
                    <div className="w-11 h-6 bg-dark-700 rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-dark-300 after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-pink-500"></div>
                  </label>
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium">Atualizações de Candidatos</h3>
                    <p className="text-sm text-dark-300">
                      Receba notificações quando um candidato atualizar seu perfil.
                    </p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" className="sr-only peer" />
                    <div className="w-11 h-6 bg-dark-700 rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-dark-300 after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-pink-500"></div>
                  </label>
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium">Email Diário</h3>
                    <p className="text-sm text-dark-300">
                      Receba um resumo diário de todas as atividades.
                    </p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" className="sr-only peer" defaultChecked />
                    <div className="w-11 h-6 bg-dark-700 rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-dark-300 after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-pink-500"></div>
                  </label>
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium">Alertas de Segurança</h3>
                    <p className="text-sm text-dark-300">
                      Receba notificações sobre atividades suspeitas em sua conta.
                    </p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" className="sr-only peer" defaultChecked />
                    <div className="w-11 h-6 bg-dark-700 rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-dark-300 after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-pink-500"></div>
                  </label>
                </div>
                
                <div className="pt-4">
                  <button
                    type="button"
                    className="btn btn-primary"
                    onClick={() => alert('Notification settings would be saved here.')}
                  >
                    Salvar Configurações
                  </button>
                </div>
              </div>
            </div>
          )}
          
          {activeTab === 'privacy' && (
            <div className="card animate-fade-in">
              <h2 className="text-xl font-semibold mb-6">Privacidade</h2>
              
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium">Perfil Público</h3>
                    <p className="text-sm text-dark-300">
                      Tornar seu perfil visível para candidatos não registrados.
                    </p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" className="sr-only peer" defaultChecked />
                    <div className="w-11 h-6 bg-dark-700 rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-dark-300 after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-pink-500"></div>
                  </label>
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium">Compartilhar Dados de Análise</h3>
                    <p className="text-sm text-dark-300">
                      Ajude-nos a melhorar compartilhando dados de uso anônimos.
                    </p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" className="sr-only peer" />
                    <div className="w-11 h-6 bg-dark-700 rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-dark-300 after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-pink-500"></div>
                  </label>
                </div>
                
                <div className="pt-6 border-t border-dark-700">
                  <h3 className="text-lg font-medium mb-3">Exportar Dados</h3>
                  <p className="text-dark-300 mb-4">
                    Baixe uma cópia de todos os seus dados armazenados no TalentLink.
                  </p>
                  <button
                    type="button"
                    className="btn btn-outline"
                    onClick={() => alert('Data export would be implemented here.')}
                  >
                    Exportar Meus Dados
                  </button>
                </div>
                
                <div className="pt-6 border-t border-dark-700">
                  <h3 className="text-lg font-medium mb-3 text-red-400">Zona de Perigo</h3>
                  <p className="text-dark-300 mb-4">
                    Ações permanentes que não podem ser desfeitas.
                  </p>
                  <button
                    type="button"
                    className="btn text-white bg-red-500 hover:bg-red-600"
                    onClick={() => {
                      const confirm = window.confirm(
                        'Esta ação não pode ser desfeita. Tem certeza que deseja excluir sua conta?'
                      );
                      if (confirm) {
                        alert('Account deletion would be implemented here.');
                      }
                    }}
                  >
                    Excluir Minha Conta
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Settings;