import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Hero from './components/Hero';
import Highlights from './components/Highlights';
import Demo from './components/Demo';
import Features from './components/Features';
import Comparison from './components/Comparison';
import CallToAction from './components/CallToAction';
import Footer from './components/Footer';
import TalentLinkLogin from './pages/Candidato/loginCandidato';

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
        </Routes>
      </div>
    </Router>
  );
}

export default App;
