import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Mail, Lock, AlertCircle } from 'lucide-react';

interface LoginProps {
  onLogin: () => void;
  isAuthenticated: boolean;
}

const LoginRH = ({ onLogin, isAuthenticated }: LoginProps) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  
  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/', { replace: true });
    }
  }, [isAuthenticated, navigate]);
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Basic validation
    if (!email || !password) {
      setError('Please fill in all fields');
      return;
    }
    
    // For demo purposes, accept any valid-looking email
    if (!email.includes('@')) {
      setError('Please enter a valid email');
      return;
    }
    
    // In a real app, you would validate credentials server-side
    onLogin();
    navigate('/', { replace: true });
  };
  
  const handleGoogleLogin = () => {
    // In a real app, this would use the Google OAuth flow
    onLogin();
    navigate('/', { replace: true });
  };
  
  return (
    <div className="min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8 bg-dark-900">
      <div className="w-full max-w-md animate-slide-up">
        <div className="card">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold gradient-text mb-2">TalentLink</h1>
            <h2 className="text-2xl font-bold mb-1 text-white">Acesse como Empresa</h2>
            <p className="text-dark-300">
              Faça login para gerenciar suas vagas e encontrar os melhores talentos.
            </p>
          </div>
          
          {error && (
            <div className="mb-6 p-3 bg-red-500/20 border border-red-500/30 rounded-md flex items-center text-red-400">
              <AlertCircle size={18} className="mr-2 flex-shrink-0" />
              <p className="text-sm">{error}</p>
            </div>
          )}
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label 
                htmlFor="email" 
                className="block text-sm font-medium text-dark-200 mb-2"
              >
                Email
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail size={18} className="text-dark-400" />
                </div>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="form-input pl-10"
                  placeholder="seu@email.com"
                />
              </div>
            </div>
            
            <div>
              <label 
                htmlFor="password" 
                className="block text-sm font-medium text-dark-200 mb-2"
              >
                Senha
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock size={18} className="text-dark-400" />
                </div>
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="form-input pl-10"
                  placeholder="••••••••"
                />
              </div>
            </div>
            
            <div>
              <button
                type="submit"
                className="btn btn-primary w-full font-medium"
              >
                Entrar
              </button>
            </div>
          </form>
          
          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-dark-700"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-dark-800 text-dark-300">Ou continue com</span>
              </div>
            </div>
            
            <div className="mt-6">
              <button
                type="button"
                onClick={handleGoogleLogin}
                className="w-full flex items-center justify-center px-4 py-2 border border-dark-600 rounded-md shadow-sm text-sm font-medium text-dark-100 bg-dark-800 hover:bg-dark-700 transition-colors"
              >
                <svg 
                  className="h-5 w-5 mr-2" 
                  viewBox="0 0 24 24" 
                  fill="none" 
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M23.766 12.2764C23.766 11.4607 23.6999 10.6406 23.5588 9.83807H12.24V14.4591H18.7217C18.4528 15.9494 17.5885 17.2678 16.323 18.1056V21.1039H20.19C22.4608 19.0139 23.766 15.9274 23.766 12.2764Z" fill="#4285F4"/>
                  <path d="M12.2401 24.0008C15.4766 24.0008 18.2059 22.9382 20.1945 21.1039L16.3276 18.1055C15.2517 18.8375 13.8627 19.252 12.2445 19.252C9.11388 19.252 6.45946 17.1399 5.50705 14.3003H1.5166V17.3912C3.55371 21.4434 7.7029 24.0008 12.2401 24.0008Z" fill="#34A853"/>
                  <path d="M5.50253 14.3003C4.99987 12.8099 4.99987 11.1961 5.50253 9.70575V6.61481H1.51649C-0.18551 10.0056 -0.18551 14.0004 1.51649 17.3912L5.50253 14.3003Z" fill="#FBBC04"/>
                  <path d="M12.2401 4.74966C13.9509 4.7232 15.6044 5.36697 16.8434 6.54867L20.2695 3.12262C18.1001 1.0855 15.2208 -0.034466 12.2401 0.000808666C7.7029 0.000808666 3.55371 2.55822 1.5166 6.61481L5.50264 9.70575C6.45064 6.86173 9.10947 4.74966 12.2401 4.74966Z" fill="#EA4335"/>
                </svg>
                Entrar com Google
              </button>
            </div>
          </div>
          
          <p className="mt-6 text-center text-sm text-dark-400">
            Não tem uma conta? <a href="#" className="font-medium text-pink-500 hover:text-pink-400">Cadastre-se</a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginRH;