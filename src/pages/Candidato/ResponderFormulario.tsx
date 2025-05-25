import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../../services/api";
import Button from "../../components/Button";

const ResponderFormulario: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [form, setForm] = useState<any>(null);
  const [respostas, setRespostas] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [jaRespondeu, setJaRespondeu] = useState(false);
  const [showExitModal, setShowExitModal] = useState(false);
  const [showIncompleteModal, setShowIncompleteModal] = useState(false);

  useEffect(() => {
    const checkAndFetch = async () => {
      try {
        let jaRespondeuFlag = false;

        try {
          const resposta = await api.get(`/candidate/${id}/responded`);
          jaRespondeuFlag = resposta.data.responded;
          setJaRespondeu(jaRespondeuFlag);
        } catch {
          console.warn("Não foi possível verificar se já respondeu.");
        }

        if (!jaRespondeuFlag) {
          const res = await api.get(`/opportunities/${id}`);
          const formFromApi = res?.data?.form;

          if (formFromApi) {
            setForm(formFromApi);
            setRespostas(new Array(formFromApi.questions.length).fill(""));
          } else {
            alert("Essa vaga não possui formulário.");
            navigate("/dashboard");
          }
        }
      } catch (err) {
        console.error("Erro ao carregar formulário:", err);
        alert("Erro ao carregar formulário.");
      } finally {
        setLoading(false);
      }
    };

    checkAndFetch();
  }, [id, navigate]);

  const handleChange = (index: number, value: string) => {
    setRespostas((prev) => {
      const updated = [...prev];
      updated[index] = value;
      return updated;
    });
  };

  const handleSubmit = async () => {
    const todasRespondidas = respostas.every((res) => res.trim() !== "");

    if (!todasRespondidas) {
      setShowIncompleteModal(true);
      return;
    }

    try {
      const payload = {
        opportunityId: id,
        answers: form.questions.reduce((acc: any, q: any, index: number) => {
          acc[q.text] = respostas[index] || "";
          return acc;
        }, {}),
      };

      await api.post("/candidate/responses", payload);

      alert("Candidatura enviada com sucesso!");
      navigate("/dashboard");
    } catch (err: any) {
      console.error(
        "Erro ao enviar candidatura:",
        err.response?.data || err.message
      );
      alert("Erro ao enviar respostas.");
    }
  };

  if (loading) {
    return <p className="text-white p-4">Carregando...</p>;
  }

  if (jaRespondeu) {
    return (
      <div className="text-white p-6 text-center">
        <h2 className="text-2xl font-bold mb-4">Você já se candidatou!</h2>
        <p className="text-gray-400 mb-4">
          Aguardando avaliação do recrutador.
        </p>
        <div className="flex justify-center mt-8">
          <Button className="mt-2" onClick={() => navigate("/dashboard")}>
            Voltar para a Dashboard
          </Button>
        </div>
      </div>
    );
  }

  if (!form) {
    return (
      <div className="text-white p-6 text-center">
        <h2 className="text-xl font-bold">Formulário não encontrado</h2>
        <p className="text-gray-400">
          Essa vaga pode não estar mais disponível ou não possui formulário
          associado.
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 pb-10 mt-12">
      <h1 className="text-4xl md:text-5xl font-bold text-center mb-6 bg-gradient-to-r from-pink-500 to-purple-600 bg-clip-text text-transparent">
        Formulário de Candidatura
      </h1>
      <p className="text-gray-300 text-center mb-10 text-lg">
        Preencha o formulário abaixo com atenção. Suas informações são
        confidenciais e utilizadas apenas para fins seletivos.
      </p>

      {/* Botão flutuante para sair */}
      <button
        type="button"
        onClick={() => setShowExitModal(true)}
        className="fixed top-20 right-60 z-50 bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white rounded-full w-12 h-12 flex items-center justify-center shadow-lg transition"
        title="Voltar para Dashboard"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-6 w-6"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M15 19l-7-7 7-7"
          />
        </svg>
      </button>

      {/* Modal de saída */}
      {showExitModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60">
          <div className="bg-gray-900 rounded-lg p-8 max-w-sm w-full shadow-lg border border-gray-700">
            <h2 className="text-xl font-bold mb-4 text-white">
              Sair do formulário?
            </h2>
            <p className="text-gray-300 mb-6">
              Tem certeza que deseja sair? Suas respostas não serão salvas.
            </p>
            <div className="flex justify-end gap-4">
              <button
                className="px-4 py-2 rounded bg-gray-700 text-white hover:bg-gray-600 transition"
                onClick={() => setShowExitModal(false)}
              >
                Cancelar
              </button>
              <button
                className="px-4 py-2 rounded bg-pink-500 text-white hover:bg-pink-600 transition"
                onClick={() => navigate("/dashboard")}
              >
                Sair
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal de respostas incompletas */}
      {showIncompleteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60">
          <div className="bg-gray-900 rounded-lg p-8 max-w-sm w-full shadow-lg border border-gray-700">
            <h2 className="text-xl font-bold mb-4 text-white">
              Responda todas as perguntas
            </h2>
            <p className="text-gray-300 mb-6">
              Por favor, responda todas as perguntas antes de enviar sua candidatura.
            </p>
            <div className="flex justify-end">
              <button
                className="px-4 py-2 rounded bg-pink-500 text-white hover:bg-pink-600 transition"
                onClick={() => setShowIncompleteModal(false)}
              >
                Ok
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Formulário */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSubmit();
        }}
        className="space-y-8"
      >
        {form.questions.map((q: any, index: number) => (
          <div
            key={index}
            className="bg-gray-900 border border-gray-800 p-6 rounded-lg space-y-4"
          >
            <label className="block text-lg font-semibold text-white">
              {q.text}
            </label>
            {q.type === "MULTIPLE_CHOICE" ? (
              <select
                value={respostas[index] || ""}
                onChange={(e) => handleChange(index, e.target.value)}
                className="w-full bg-gray-800 text-gray-200 p-3 rounded border border-gray-700 focus:ring-pink-500 focus:border-pink-500"
              >
                <option value="">Selecione uma opção</option>
                {q.options.map((opt: string, i: number) => (
                  <option key={i} value={opt}>
                    {opt}
                  </option>
                ))}
              </select>
            ) : (
              <textarea
                value={respostas[index] ?? ""}
                onChange={(e) => handleChange(index, e.target.value)}
                className="w-full bg-gray-800 text-gray-200 p-3 rounded border border-gray-700 min-h-[120px] resize-none focus:ring-pink-500 focus:border-pink-500"
                placeholder="Digite sua resposta..."
              />
            )}
          </div>
        ))}

        <div className="flex justify-center">
          <Button type="submit" size="lg" className="px-8 py-4 text-lg ml-auto">
            Enviar Candidatura
          </Button>
        </div>
      </form>
    </div>
  );
};

export default ResponderFormulario;
