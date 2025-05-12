// src/App.tsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/components-landing-page/Header';
import Hero from './components/components-landing-page/telaInicial';
import Highlights from './components/components-landing-page/Highlights';
import Demo from './components/components-landing-page/demo';
import Features from './components/components-landing-page/funcionalidades';
import Comparison from './components/components-landing-page/diferencial';
import CallToAction from './components/components-landing-page/planos';
import Footer from './components/components-landing-page/Footer';
import LoginCandidato from './pages/Candidato/loginCandidato';
import Dashboard from './pages/Candidato/dashboardCandidato';
import Feedbacks from './pages/Candidato/feedbacks';
import ChoiceScreen from './pages/ChoiceScreen';

function App() {
  return (
    <Router>
      <div className="font-sans text-gray-800 min-h-screen flex flex-col">
        <Routes>
          {/* Rota da Landing Page */}
          <Route 
            path="/" 
            element={
              <>
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
              </>
            } 
          />
          
          {/* Rota da Tela de Escolha (Candidato ou Empresa) */}
          <Route path="/ChoiceScreen" element={<ChoiceScreen />} />

          {/* Rota de Login do Candidato */}
          <Route path="/loginCandidato" element={<LoginCandidato />} />

          {/* Rota do Dashboard do Candidato */}
          <Route path="/dashboard" element={<Dashboard />} />

          {/* Rota dos Feedbacks do Candidato */}
          <Route path="/feedbacks" element={<Feedbacks />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
