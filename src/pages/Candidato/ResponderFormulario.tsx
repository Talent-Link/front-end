import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../../services/api";
import Button from "../../components/Button";

const ResponderFormulario: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [form, setForm] = useState<any>(null);
  const [respostas, setRespostas] = useState<any>({});
  const [loading, setLoading] = useState(true);
  const [jaRespondeu, setJaRespondeu] = useState(false);

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
    setRespostas((prev: any) => ({ ...prev, [index]: value }));
  };

  const handleSubmit = async () => {
    try {
      const payload = {
        opportunityId: id,
        answers: form.questions.reduce((acc: any, _unused: any, i: number) => {
          acc[`question${i + 1}`] = respostas[i] || "";
          return acc;
        }, {}),
      };

      await api.post("/candidate/responses", payload);

      alert("Candidatura enviada com sucesso!");
      navigate("/dashboard");
    } catch (err: any) {
      console.error("Erro ao enviar candidatura:", err.response?.data || err.message);
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
        <p className="text-gray-400 mb-4">Aguardando avaliação do recrutador.</p>
        <div className="flex justify-center mt-8">
          <Button
            className="mt-2"
            onClick={() => navigate("/dashboard")}
          >
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
          Essa vaga pode não estar mais disponível ou não possui formulário associado.
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
        Preencha o formulário abaixo com atenção. Suas informações são confidenciais e utilizadas apenas para fins
        seletivos.
      </p>

      <form onSubmit={(e) => { e.preventDefault(); handleSubmit(); }} className="space-y-8">
        {form.questions.map((q: any, index: number) => (
          <div key={index} className="bg-gray-900 border border-gray-800 p-6 rounded-lg space-y-4">
            <label className="block text-lg font-semibold text-white">{q.text}</label>

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
                value={respostas[index] || ""}
                onChange={(e) => handleChange(index, e.target.value)}
                className="w-full bg-gray-800 text-gray-200 p-3 rounded border border-gray-700 min-h-[120px] resize-none focus:ring-pink-500 focus:border-pink-500"
                placeholder="Digite sua resposta..."
              />
            )}
          </div>
        ))}

        <div className="flex justify-center">
            <Button
            type="submit"
            size="lg"
            className="px-8 py-4 text-lg ml-auto"
            >
            Enviar Candidatura
            </Button>
        </div>
      </form>
    </div>
  );
};

export default ResponderFormulario;
