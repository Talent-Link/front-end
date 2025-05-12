import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/components-landing-page/Header';
import Hero from './components/components-landing-page/telaInicial';
import Highlights from './components/components-landing-page/Highlights';
import Demo from './components/components-landing-page/demo';
import Features from './components/components-landing-page/funcionalidades';
import Comparison from './components/components-landing-page/diferencial';
import CallToAction from './components/components-landing-page/planos';
import Footer from './components/components-landing-page/Footer';
import TalentLinkLogin from './pages/Candidato/loginCandidato';
import Dashboard from './pages/Candidato/dashboardCandidato'; // Certifique-se de que o nome do componente está correto

function App() {
  return (
    <Router>
      <div className="font-sans text-gray-800">
        <Routes>
          <Route path="/" element={
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
          } />
          <Route path="/login" element={<TalentLinkLogin />} />
          <Route path="/dashboard" element={<Dashboard />} /> {/* Nova rota adicionada */}
        </Routes>
      </div>
    </Router>
  );
}

export default App;
