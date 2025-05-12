import React from "react";
import Button from "../../components/Button";
import "../../styles/Candidato/login.css";

const LoginCandidato: React.FC = () => {
  return (
    <div className="login-container">
      <div className="login-card">
        <div className="login-header">
          <div className="login-icon">
            <svg
              className="w-8 h-8 text-white"
              fill="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M12 2a10 10 0 100 20 10 10 0 000-20zm0 18a8 8 0 110-16 8 8 0 010 16z" />
            </svg>
          </div>
          <h2 className="login-title">Bem-vindo ao TalentLink</h2>
          <p className="login-subtitle">
            Acesse sua conta com Google para continuar.
          </p>
        </div>

        <Button variant="primary" size="md" className="login-button">
          <div className="flex items-center justify-center">
            <svg
              className="w-6 h-6 mr-2"
              fill="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M21.35 11.1h-9.6v3.3h5.4c-.25 1.25-1 2.3-2 3l3.05 2.35c1.8-1.65 2.85-4.1 2.85-6.95 0-.65-.05-1.3-.15-1.9z" />
            </svg>
            Continuar com Google
          </div>
        </Button>

        <p className="login-footer">
          Ao fazer login, você concorda com nossos{" "}
          <a href="#" className="text-pink-400 underline">
            Termos de Serviço
          </a>{" "}
          e{" "}
          <a href="#" className="text-pink-400 underline">
            Política de Privacidade
          </a>
          .
        </p>
      </div>
    </div>
  );
};

export default LoginCandidato;
