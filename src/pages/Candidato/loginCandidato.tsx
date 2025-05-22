import React from "react";
import Button from "../../components/Button";
import "../../styles/Candidato/login.css";

const LoginCandidato: React.FC = () => {
  return (
    <div className="login-container">
      <div className="login-card space-y-8">
        <div className="login-header space-y-8">
          <div className="login-icon">
            <img src="/logo.png" alt="Logo" className="w-16 h-16" />
          </div>
          <h2 className="login-title">Bem-vindo ao TalentLink!</h2>
          <p className="login-subtitle">
            Faça login para acessar sua conta e começar a explorar as
            oportunidades de emprego disponíveis.
          </p>
        </div>

        <Button
          variant="primary"
          size="md"
          className="login-button"
          onClick={() => {
            window.open(
              "https://talentlink-wd88.onrender.com/auth/google/CANDIDATO",
              "_blank",
              "width=500,height=600"
            );

            const handleMessage = (event: MessageEvent) => {
              if (event.origin !== "https://talentlink-wd88.onrender.com")
                return;

              const { token, user } = event.data;

              if (token) {
                localStorage.setItem("authToken", token);
                localStorage.setItem("user", JSON.stringify(user));
                window.removeEventListener("message", handleMessage);
                window.location.href = "/dashboard"; // redireciona para a dashboard
              }
            };

            window.addEventListener("message", handleMessage);
          }}
        >
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
