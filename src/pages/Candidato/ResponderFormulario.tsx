import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../../services/api";

const ResponderFormulario: React.FC = () => {
  const { id } = useParams(); // ID da oportunidade
  const navigate = useNavigate();

  const [form, setForm] = useState<any>(null);
  const [respostas, setRespostas] = useState<any>({});
  const [loading, setLoading] = useState(true);
  const [jaRespondeu, setJaRespondeu] = useState(false);

  useEffect(() => {
  const checkAndFetch = async () => {
    try {
      let jaRespondeuFlag = false;

      // Tenta verificar se o candidato já respondeu
      try {
        const resposta = await api.get(`/candidate/${id}/responded`);

        jaRespondeuFlag = resposta.data.responded;
        setJaRespondeu(jaRespondeuFlag);
      } catch (err) {
        console.warn("Não foi possível verificar se já respondeu. Pode ser uma nova candidatura.");
      }

      if (!jaRespondeuFlag) {
        const res = await api.get(`/opportunities/${id}`);
        console.log("Dados da oportunidade:", res.data);
        const formFromApi = res?.data?.form;

        if (formFromApi) {
          setForm(formFromApi);
        } else {
          alert("Essa vaga não possui formulário.");
          navigate("/dashboard");
        }
      }
    } catch (err) {
      console.error("Erro geral ao carregar:", err);
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

    console.log("Enviando para API:", payload);

    await api.post("/candidate/responses", payload);

    alert("Candidatura enviada com sucesso!");
    navigate("/dashboard");
  } catch (err: any) {
    console.error("Erro ao enviar candidatura:", err.response?.data || err.message);
    alert("Erro ao enviar respostas.");
  }
};


  // Condições de renderização
  if (loading) {
    return <p className="text-white p-4">Carregando...</p>;
  }

  if (jaRespondeu) {
    return (
      <div className="text-white p-6 text-center">
        <h2 className="text-2xl font-bold mb-4">Você já se candidatou!</h2>
        <p className="text-gray-400 mb-4">Aguardando avaliação do recrutador.</p>
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
    <div className="p-6 max-w-3xl mx-auto text-white">
      <h2 className="text-2xl font-bold mb-4">{form.title}</h2>
      <p className="mb-6 text-gray-300">{form.description}</p>

      {form.questions.map((q: any, index: number) => (
        <div key={index} className="mb-4">
          <label className="block font-semibold mb-1">{q.text}</label>

          {q.type === "MULTIPLE_CHOICE" ? (
            <select
              className="bg-gray-800 p-2 w-full rounded"
              onChange={(e) => handleChange(index, e.target.value)}
            >
              <option value="">Selecione</option>
              {q.options.map((opt: string, i: number) => (
                <option key={i} value={opt}>
                  {opt}
                </option>
              ))}
            </select>
          ) : (
            <textarea
              className="bg-gray-800 p-2 w-full rounded"
              onChange={(e) => handleChange(index, e.target.value)}
            />
          )}
        </div>
      ))}

      <button
        onClick={handleSubmit}
        className="bg-purple-600 hover:bg-purple-700 px-4 py-2 rounded mt-4"
      >
        Enviar Respostas
      </button>
    </div>
  );
};

export default ResponderFormulario;
