import React, { useEffect } from 'react';

const VLibras: React.FC = () => {
  useEffect(() => {
    // Criar e inserir o HTML do VLibras
    const vlibrasDiv = document.createElement('div');
    vlibrasDiv.innerHTML = `
      <div vw class="enabled">
        <div vw-access-button class="active"></div>
        <div vw-plugin-wrapper>
          <div class="vw-plugin-top-wrapper"></div>
        </div>
      </div>
    `;
    
    // Adicionar ao body
    document.body.appendChild(vlibrasDiv);

    // Carregar o script do VLibras se ainda não foi carregado
    if (!document.querySelector('script[src="https://vlibras.gov.br/app/vlibras-plugin.js"]')) {
      const script = document.createElement('script');
      script.src = 'https://vlibras.gov.br/app/vlibras-plugin.js';
      script.async = true;
      script.onload = () => {
        // Inicializar o VLibras após o script carregar
        if (window.VLibras) {
          new window.VLibras.Widget('https://vlibras.gov.br/app');
        }
      };
      document.body.appendChild(script);
    }

    // Cleanup function
    return () => {
      const existingVLibras = document.querySelector('[vw]');
      if (existingVLibras) {
        existingVLibras.remove();
      }
    };
  }, []);

  return null; // Este componente não renderiza nada diretamente
};

// Adicionar tipagem para o window.VLibras
declare global {
  interface Window {
    VLibras: any;
  }
}

export default VLibras;
