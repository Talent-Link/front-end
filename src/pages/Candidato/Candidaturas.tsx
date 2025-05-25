import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Clock, CheckCircle, XCircle, AlertCircle } from "lucide-react";
import api from "../../services/api";
import Button from "../../components/Button";
import Header from "../../components/headerCandidato";

type Application = {
  responseId: string;
  createdAt: string;
  status?: "pending" | "approved" | "rejected" | "interview";
  score?: number;
  feedback?: string;
  title?: string;
  companyName?: string;
};


const Candidaturas: React.FC = () => {
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchApplications = async () => {
      try {
        const res = await api.get("/opportunities/my-applications");
        setApplications(res.data);
      } catch (error) {
        console.error("Erro ao buscar candidaturas:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchApplications();
  }, []);

  const getStatusBadge = (status: string | undefined) => {
    const base =
      "inline-flex items-center gap-1 px-2 py-1 text-xs font-medium rounded border";
    switch (status) {
      case "pending":
        return (
          <span
            className={`${base} text-yellow-400 bg-yellow-900/20 border-yellow-500`}
          >
            <Clock size={14} /> Em análise
          </span>
        );
      case "approved":
        return (
          <span
            className={`${base} text-green-400 bg-green-900/20 border-green-500`}
          >
            <CheckCircle size={14} /> Aprovado
          </span>
        );
      case "rejected":
        return (
          <span className={`${base} text-red-400 bg-red-900/20 border-red-500`}>
            <XCircle size={14} /> Recusado
          </span>
        );
      case "interview":
        return (
          <span
            className={`${base} text-blue-400 bg-blue-900/20 border-blue-500`}
          >
            <AlertCircle size={14} /> Entrevista
          </span>
        );
      default:
        return null;
    }
  };

  return (
    <div>
      <Header />
      <div className="max-w-5xl mx-auto p-6 space-y-6">
        <h1 className="text-3xl md:text-4xl font-bold text-center mb-8 bg-gradient-to-r from-pink-500 to-purple-600 bg-clip-text text-transparent">
          Minhas Candidaturas
        </h1>

        {loading ? (
          <p className="text-gray-400 text-center">
            Carregando candidaturas...
          </p>
        ) : applications.length === 0 ? (
          <div className="p-8 bg-gray-900 border border-gray-800 rounded-lg text-center">
            <p className="text-gray-300 mb-4">
              Você ainda não possui candidaturas enviadas.
            </p>
            <Link to="/dashboard">
              <Button>Ver oportunidades</Button>
            </Link>
          </div>
        ) : (
          <>
            {applications.map((app) => (
              <div
                key={app.responseId}
                className="p-6 bg-gray-900 border border-gray-800 hover:border-gray-700 rounded-lg transition-all"
              >
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="space-y-2">
                    <h3 className="text-xl font-semibold text-white">
                      {app.title ?? "Título não disponível"}
                    </h3>
                    <p className="text-gray-300">
                      {app.companyName ?? "Empresa não informada"}
                    </p>

                    <div className="flex items-center gap-4">
                      <span className="text-sm text-gray-400">
                        Enviado em:{" "}
                        {new Date(app.createdAt).toLocaleDateString()}
                      </span>
                      {getStatusBadge(app.status)}
                    </div>
                  </div>
                  <Button
                    onClick={async () => {
                      const confirmDelete = confirm(
                        "Tem certeza que deseja cancelar esta candidatura?"
                      );
                      if (!confirmDelete) return;

                      try {
                        await api.delete(`/opportunities/${app.responseId}/withdraw`);
                        setApplications((prev) =>
                          prev.filter((a) => a.responseId !== app.responseId)
                        );
                      } catch (error) {
                        console.error("Erro ao cancelar candidatura:", error);
                        alert("Erro ao cancelar candidatura. Tente novamente.");
                      }
                    }}
                  >
                    Cancelar candidatura
                  </Button>
                </div>

                {app.feedback && (
                  <div className="mt-4 pt-4 border-t border-gray-800">
                    <p className="text-sm text-gray-300">
                      <span className="font-medium text-gray-200">
                        Feedback:
                      </span>{" "}
                      {app.feedback}
                    </p>
                  </div>
                )}
              </div>
            ))}
          </>
        )}
      </div>
    </div>
  );
};

export default Candidaturas;
