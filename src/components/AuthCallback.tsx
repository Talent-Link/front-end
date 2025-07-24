import React, { useEffect } from 'react';

const AuthCallback: React.FC = () => {
  useEffect(() => {
    // Pega o token e dados do usuário da URL
    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get('token');
    const userString = urlParams.get('user');

    if (token && userString) {
      try {
        const user = JSON.parse(decodeURIComponent(userString));
        
        // Salva no localStorage
        localStorage.setItem('authToken', token);
        localStorage.setItem('user', JSON.stringify(user));
        
        // Redireciona baseado no tipo de usuário
        if (user.userType === 'CANDIDATO') {
          window.location.href = '/candidato/dashboard';
        } else if (user.userType === 'RH') {
          window.location.href = '/rh/dashboard';
        } else {
          console.error('Tipo de usuário não reconhecido:', user.userType);
          window.location.href = '/';
        }
      } catch (error) {
        console.error('Erro ao processar dados de autenticação:', error);
        window.location.href = '/';
      }
    } else {
      console.error('Token ou dados do usuário não encontrados na URL');
      window.location.href = '/';
    }
  }, []);

  return (
    <div style={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      height: '100vh',
      fontFamily: 'Arial, sans-serif',
      background: '#f5f5f5'
    }}>
      <div style={{
        textAlign: 'center',
        background: 'white',
        padding: '40px',
        borderRadius: '10px',
        boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
      }}>
        <h2 style={{ color: '#4CAF50', marginBottom: '20px' }}>✅ Autenticando...</h2>
        <p style={{ color: '#666', marginBottom: '20px' }}>Processando seu login...</p>
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-500 mx-auto"></div>
      </div>
    </div>
  );
};

export default AuthCallback;
