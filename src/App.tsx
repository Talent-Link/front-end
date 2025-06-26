import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

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
import ResponderFormulario from "./pages/Candidato/ResponderFormulario";
import Candidaturas from "./pages/Candidato/Candidaturas";
// Pages - RH
import ChoiceScreen from "./pages/ChoiceScreen";
import LoginRH from "./pages/RH/LoginRH";
import DashboardRH from "./pages/RH/dashboardRH";
import DashboardLayout from "./layouts/DashboardLayout";
import CandidateList from "./pages/RH/CandidateList";
import CreateJob from "./pages/RH/CreateJob";
import ManageJobs from "./pages/RH/ManageJobs";
import CandidateProfile from "./pages/RH/CandidateProfile";
import TalentBank from "./pages/RH/TalentBank";
import Reports from "./pages/RH/Reports";
import Settings from "./pages/RH/Settings";
import CreateForm from "./pages/RH/CreateForm";
import FormList from "./pages/RH/FormList";
import EditForm from "./pages/RH/EditForm";

function App() {
  return (
    <Router>
        <ToastContainer position="top-right" autoClose={3000} />
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

          {/* Rota das telas (Candidato ou Empresa) */}
          <Route path="/ChoiceScreen" element={<ChoiceScreen />} />

          {/* Rota para o login do Candidato */}
          <Route path="/loginCandidato" element={<LoginCandidato />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/feedbacks" element={<Feedbacks />} />
          <Route path="/candidaturas" element={<Candidaturas />} />
          <Route
            path="/candidato/oportunidade/:id"
            element={<ResponderFormulario />}
          />

          {/* Rotas para RH */}
          <Route path="/loginRH" element={<LoginRH />} />
          <Route path="/dashboardRH" element={<DashboardLayout />}>
            <Route index element={<DashboardRH />} />
            <Route path="create-job" element={<CreateJob />} />
            <Route path="create-form" element={<CreateForm />} />
            <Route path="manage-jobs" element={<ManageJobs />} />
            <Route path="candidate/:id" element={<CandidateProfile />} />
            <Route path="talent-bank" element={<TalentBank />} />
            <Route path="reports" element={<Reports />} />
            <Route path="settings" element={<Settings />} />
            <Route path="candidates/:jobId" element={<CandidateList />} />
            <Route path="forms" element={<FormList />} />
            <Route path="forms/edit/:id" element={<EditForm />} />
          </Route>
        </Routes>
      </div>
    </Router>
  );
}

export default App;
