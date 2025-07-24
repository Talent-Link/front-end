import { useCallback } from 'react';

// Versão com debug para identificar o problema
export const useGoogleLoginDebug = () => {
  return useCallback((userType: 'CANDIDATO' | 'RH') => {
    console.log('🚀 Iniciando login Google para:', userType);
    
    const popup = window.open(
      `https://talentlink-wd88.onrender.com/auth/google/${userType}?popup=true`,
      'googleAuth',
      'width=500,height=600,scrollbars=yes,resizable=yes'
    );

    if (!popup) {
      console.error('❌ Popup bloqueado pelo navegador');
      return;
    }

    console.log('✅ Popup aberto, aguardando resposta...');

    const listener = (event: MessageEvent) => {
      console.log('📨 Evento recebido:', event);
      console.log('📍 Origin:', event.origin);
      console.log('📦 Data:', event.data);
      
      if (event.origin !== 'https://talentlink-wd88.onrender.com') {
        console.log('❌ Origin incorreta, ignorando...');
        return;
      }
      
      if (event.data.type === 'GOOGLE_AUTH_SUCCESS') {
        console.log('✅ Sucesso! Dados recebidos:', event.data);
        
        const { token, user } = event.data;
        localStorage.setItem('authToken', token);
        localStorage.setItem('user', JSON.stringify(user));
        
        window.removeEventListener('message', listener);
        popup.close();
        clearInterval(checkClosed);
        
        console.log('🏠 Redirecionando para dashboard...');
        
        const dashboardUrl = user.userType === 'CANDIDATO'
          ? '/dashboard-candidato'
          : '/dashboard-rh';
        window.location.href = dashboardUrl;
      }
    };

    window.addEventListener('message', listener);

    // Monitora se popup foi fechado manualmente
    const checkClosed = setInterval(() => {
      if (popup?.closed) {
        console.log('🚪 Popup fechado manualmente');
        clearInterval(checkClosed);
        window.removeEventListener('message', listener);
      }
    }, 1000);

    // Debug: monitora mudanças na URL do popup
    const checkUrl = setInterval(() => {
      try {
        if (popup.location) {
          console.log('🔗 URL do popup:', popup.location.href);
        }
      } catch (e) {
        // Cross-origin, normal
      }
    }, 2000);

    // Para o debug após 30 segundos
    setTimeout(() => {
      clearInterval(checkUrl);
    }, 30000);

  }, []);
};

// Hook original (use este quando o backend estiver corrigido)
export const useGoogleLogin = () => {
  return useCallback((userType: 'CANDIDATO' | 'RH') => {
    const popup = window.open(
      `https://talentlink-wd88.onrender.com/auth/google/${userType}?popup=true`,
      'googleAuth',
      'width=500,height=600,scrollbars=yes,resizable=yes'
    );

    if (!popup) {
      console.error('Popup bloqueado pelo navegador');
      return;
    }

    const listener = (event: MessageEvent) => {
      if (event.origin !== 'https://talentlink-wd88.onrender.com') return;
      
      if (event.data.type === 'GOOGLE_AUTH_SUCCESS') {
        const { token, user } = event.data;
        localStorage.setItem('authToken', token);
        localStorage.setItem('user', JSON.stringify(user));
        
        window.removeEventListener('message', listener);
        popup.close();
        clearInterval(checkClosed);
        
        const dashboardUrl = user.userType === 'CANDIDATO'
          ? '/dashboard-candidato'
          : '/dashboard-rh';
        window.location.href = dashboardUrl;
      }
    };

    window.addEventListener('message', listener);

    const checkClosed = setInterval(() => {
      if (popup?.closed) {
        clearInterval(checkClosed);
        window.removeEventListener('message', listener);
      }
    }, 1000);
  }, []);
};
