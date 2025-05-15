import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";

// Layouts
import DashboardLayout from "./layouts/DashboardLayout";

// Pages - Landing Page
import Header from "./components/components-landing-page/Header";
import Hero from "./components/components-landing-page/telaInicial";
import Highlights from "./components/components-landing-page/Highlights";
import Demo from "./components/components-landing-page/demo";
import Features from "./components/components-landing-page/funcionalidades";
import Comparison from "./components/components-landing-page/diferencial";
import CallToAction from "./components/components-landing-page/planos";
import Footer from "./components/components-landing-page/Footer";

// Pages - Candidato
import LoginCandidato from "./pages/Candidato/loginCandidato";
import Dashboard from "./pages/Candidato/dashboardCandidato";
import Feedbacks from "./pages/Candidato/feedbacks";

// Pages - RH
import ChoiceScreen from "./pages/ChoiceScreen";
import LoginRH from "./pages/RH/LoginRH";
import DashboardRH from "./pages/RH/DashboardRH";

function App() {
  return (
    <Router>
      <div className="font-sans text-gray-800 min-h-screen flex flex-col">
        <Routes>
          {/* Rota da Landing Page */}
          <Route path="/" element={<>
            <Header />
            <main>
              <Hero />
              <Highlights />
              <Demo />
              <Features />
              <Comparison />
              <CallToAction />
            </main>
            <Footer />
          </>} />

          {/* Rota das telas (Candidato ou Empresa) */}
          <Route path="/ChoiceScreen" element={<ChoiceScreen />} />

          <Route path="/loginCandidato" element={<LoginCandidato />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/feedbacks" element={<Feedbacks />} />

          {/* Rotas para RH */}
          <Route path="/loginRH" element={<LoginRH onLogin={() => {}} isAuthenticated={false} />} />

          {/* Dashboard RH */}
          <Route path="/DashboardRH" element={<DashboardLayout onLogout={() => {}} />} />
      

          
        </Routes>
      </div>
    </Router>
  );
}

export default App;
