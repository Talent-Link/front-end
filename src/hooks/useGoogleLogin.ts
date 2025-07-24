import { useCallback } from 'react';

export const useGoogleLogin = () => {
  return useCallback((userType: 'CANDIDATO' | 'RH') => {
    // WORKAROUND: redireciona na mesma aba até backend ser corrigido
    const isLocalhost = window.location.hostname === 'localhost';
    
    if (isLocalhost) {
      // Em localhost, usa popup normal
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
            ? '/Dashboard'
            : '/dashboardRH';
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
    } else {
      // Em produção, redireciona na mesma aba (TEMPORÁRIO)
      window.location.href = `https://talentlink-wd88.onrender.com/auth/google/${userType}`;
    }
  }, []);
};
