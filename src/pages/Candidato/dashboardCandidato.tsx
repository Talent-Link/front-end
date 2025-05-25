import React, { useState, useEffect } from "react";
import JobDetailsModal from "../../components/JobDetailsModal";
import { FaFilter } from "react-icons/fa";
import HeaderCandidato from "../../components/headerCandidato";
import api from "../../services/api";

const Dashboard: React.FC = () => {
  const [opportunities, setOpportunities] = useState<any[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedJob, setSelectedJob] = useState({
    title: "",
    description: "",
    requirements: "",
    jobId: "",
    hasForm: false,
  });

  const [searchTerm, setSearchTerm] = useState("");
  const [isFilterMenuOpen, setIsFilterMenuOpen] = useState(false);
  const [selectedFilters, setSelectedFilters] = useState<string[]>([]);

  useEffect(() => {
    const fetchOpportunities = async () => {
      try {
        const res = await api.get("/opportunities");
        setOpportunities(res.data);
      } catch (error) {
        console.error("Erro ao buscar oportunidades:", error);
      }
    };

    fetchOpportunities();
  }, []);

  const openModal = (
    title: string,
    description: string,
    requirements: string,
    jobId: string,
    hasForm: boolean
  ) => {
    setSelectedJob({ title, description, requirements, jobId, hasForm });
    setIsModalOpen(true);
  };

  const closeModal = () => setIsModalOpen(false);
  const toggleFilterMenu = () => setIsFilterMenuOpen(!isFilterMenuOpen);

  const toggleFilter = (filter: string) => {
    setSelectedFilters((prev) =>
      prev.includes(filter)
        ? prev.filter((f) => f !== filter)
        : [...prev, filter]
    );
  };

  const filteredJobs = opportunities.filter((job) => {
    const matchesSearch = job.title
      .toLowerCase()
      .includes(searchTerm.toLowerCase());

    const matchesFilter =
      selectedFilters.length === 0 || selectedFilters.includes(job.location);

    return matchesSearch && matchesFilter;
  });

  return (
    <div className="min-h-screen flex flex-col bg-gray-900 text-white">
      <HeaderCandidato />

      <main className="p-8 flex-grow">
        <h2 className="text-2xl font-bold mb-2">Banco de Oportunidades</h2>

        <div className="relative mb-4">
          <input
            type="text"
            placeholder="Pesquisar oportunidades..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full p-2 rounded bg-gray-800 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
          <button
            onClick={toggleFilterMenu}
            className="absolute right-2 top-2 text-purple-400 hover:text-white"
          >
            <FaFilter size={20} />
          </button>
          {isFilterMenuOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-gray-800 rounded shadow-lg z-10">
              <div className="p-2">
                {["Remoto", "Híbrido", "Presencial"].map((tipo) => (
                  <label key={tipo} className="flex items-center gap-2 mt-2">
                    <input
                      type="checkbox"
                      checked={selectedFilters.includes(tipo)}
                      onChange={() => toggleFilter(tipo)}
                    />
                    {tipo}
                  </label>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredJobs.map((job) => (
            <div key={job.id} className="bg-gray-800 p-4 rounded-lg">
              <h3 className="font-bold">{job.title}</h3>
              <p className="text-gray-400">
                {job.company?.name} - {job.location}
              </p>
                <button
                  className="text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 px-30 py-2 rounded mt-3 transition-colors font-semibold"
                  onClick={() =>
                    openModal(
                      job.title,
                      job.description,
                      job.requirements || "Requisitos não informados.",
                      job.id,
                      !!job.formId
                    )
                  }
                >
                  Visualizar Detalhes →
                </button>
            </div>
          ))}
        </div>
      </main>

      <JobDetailsModal
        isOpen={isModalOpen}
        onClose={closeModal}
        title={selectedJob.title}
        description={selectedJob.description}
        requirements={selectedJob.requirements}
        jobId={selectedJob.jobId}
        hasForm={selectedJob.hasForm}
      />

      <footer className="p-2 bg-gray-800 text-center text-gray-500 mt-auto">
        © 2025 TalentLink. Desenvolvido por Filipi Dantas.
      </footer>
    </div>
  );
};

export default Dashboard;
