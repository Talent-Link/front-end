import React, { useState } from "react";
import Button from "../../components/Button";
import "../../styles/Candidato/login.css";

const LoginRH: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!email || !password) {
      setError("Por favor, preencha todos os campos.");
      return;
    }

    try {
      const response = await fetch(
        "https://talentlink-wd88.onrender.com/auth/email/login",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email, password }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || "Erro ao fazer login.");
        return;
      }

      localStorage.setItem("authToken", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));
      window.location.href = "/dashboardRH";
    } catch (err) {
      console.error(err);
      setError("Erro ao conectar com o servidor.");
    }
  };

  const handleGoogleLogin = () => {
    window.open(
      "https://talentlink-wd88.onrender.com/auth/google/RH",
      "_blank",
      "width=500,height=600"
    );

    const handleMessage = (event: MessageEvent) => {
      if (event.origin !== "https://talentlink-wd88.onrender.com") return;

      const { token, user } = event.data;

      if (token) {
        localStorage.setItem("authToken", token);
        localStorage.setItem("user", JSON.stringify(user));
        window.removeEventListener("message", handleMessage);
        window.location.href = "/dashboardRH";
      }
    };

    window.addEventListener("message", handleMessage);
  };

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

        {error && <p className="text-red-500 text-sm">{error}</p>}

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="email"
            placeholder="Seu email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="form-input"
            required
          />
          <div style={{ position: "relative" }}>
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Sua senha"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="form-input"
              required
              style={{ paddingRight: "40px" }}
            />
            <button
              type="button"
              onClick={() => setShowPassword((v) => !v)}
              style={{
                position: "absolute",
                right: 8,
                top: "50%",
                transform: "translateY(-50%)",
                background: "none",
                border: "none",
                cursor: "pointer",
                padding: 0,
              }}
              tabIndex={-1}
              aria-label={showPassword ? "Ocultar senha" : "Mostrar senha"}
            >
              {showPassword ? (
                // Olho aberto
                <svg width="22" height="22" fill="none" viewBox="0 0 24 24">
                  <path
                    d="M12 5C7 5 2.73 8.11 1 12c1.73 3.89 6 7 11 7s9.27-3.11 11-7c-1.73-3.89-6-7-11-7zm0 12c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8a3 3 0 100 6 3 3 0 000-6z"
                    fill="#888"
                  />
                </svg>
              ) : (
                // Olho fechado
                <svg width="22" height="22" fill="none" viewBox="0 0 24 24">
                  <path
                    d="M12 5c-5 0-9.27 3.11-11 7 1.09 2.44 3.19 4.47 5.93 5.74l-1.42 1.42 1.41 1.41 16-16-1.41-1.41-2.1 2.1C17.27 6.11 13 5 12 5zm0 2c2.76 0 5 2.24 5 5 0 .34-.03.67-.08 1l-1.52-1.52A3 3 0 0012 9c-.34 0-.67.03-1 .08L9.08 7.08C9.67 7.03 10.34 7 12 7zm-7.07 7.07C4.73 15.89 8.99 19 12 19c1.34 0 2.61-.26 3.74-.74l-1.43-1.43A4.978 4.978 0 0112 17c-2.76 0-5-2.24-5-5 0-.34.03-.67.08-1l-1.15-1.15z"
                    fill="#888"
                  />
                </svg>
              )}
            </button>
          </div>
          <Button variant="primary" size="md" className="w-full" type="submit">
            Entrar com Email
          </Button>
        </form>

        <div className="flex items-center justify-center my-4">
          <hr className="flex-grow border-t border-gray-600" />
          <span className="mx-4 text-gray-400">ou</span>
          <hr className="flex-grow border-t border-gray-600" />
        </div>

        <Button
          variant="primary"
          size="md"
          className="login-button"
          onClick={handleGoogleLogin}
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

export default LoginRH;
