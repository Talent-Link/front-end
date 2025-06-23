import { useState } from "react";
import Button from "../../components/Button"; // seu próprio botão

interface Question {
  id: string;
  type: "text" | "multiple";
  question: string;
  options?: string[];
}

export default function CreateForm() {
  const [formTitle, setFormTitle] = useState("");
  const [formDescription, setFormDescription] = useState("");
  const [questions, setQuestions] = useState<Question[]>([]);

  const addQuestion = (type: "text" | "multiple") => {
    const newQuestion: Question = {
      id: Date.now().toString(),
      type,
      question: "",
      options: type === "multiple" ? [""] : undefined,
    };
    setQuestions([...questions, newQuestion]);
  };

  const updateQuestion = (id: string, field: keyof Question, value: any) => {
    setQuestions(questions.map((q) => (q.id === id ? { ...q, [field]: value } : q)));
  };

  const addOption = (questionId: string) => {
    setQuestions(
      questions.map((q) =>
        q.id === questionId && q.options
          ? { ...q, options: [...q.options, ""] }
          : q
      )
    );
  };

  const updateOption = (questionId: string, optionIndex: number, value: string) => {
    setQuestions(
      questions.map((q) =>
        q.id === questionId && q.options
          ? {
              ...q,
              options: q.options.map((opt, idx) =>
                idx === optionIndex ? value : opt
              ),
            }
          : q
      )
    );
  };

  const removeQuestion = (id: string) => {
    setQuestions(questions.filter((q) => q.id !== id));
  };

  const removeOption = (questionId: string, optionIndex: number) => {
    setQuestions(
      questions.map((q) =>
        q.id === questionId && q.options && q.options.length > 1
          ? {
              ...q,
              options: q.options.filter((_, idx) => idx !== optionIndex),
            }
          : q
      )
    );
  };

  const handleSubmit = async () => {
    const formattedQuestions = questions.map((q) => ({
      type: q.type === "text" ? "OPEN_TEXT" : "MULTIPLE_CHOICE",
      text: q.question,
      ...(q.options ? { options: q.options } : {}),
    }));

    try {
      const token = localStorage.getItem("authToken");

      const res = await fetch("https://talentlink-wd88.onrender.com/forms", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          title: formTitle,
          description: formDescription,
          questions: formattedQuestions,
        }),
      });

      if (!res.ok) throw new Error("Erro ao criar formulário.");

      alert("Formulário criado com sucesso!");
      setFormTitle("");
      setFormDescription("");
      setQuestions([]);
    } catch (err) {
      alert("Erro ao salvar o formulário.");
      console.error(err);
    }
  };

  const generateAIQuestion = async (type: "text" | "multiple") => {
  try {
    const mappedType = type === "text" ? "OPEN_TEXT" : "MULTIPLE_CHOICE";
    const token = localStorage.getItem("authToken");

    const questionContext = questions.length > 0
      ? questions.map((q) => ({ text: q.question }))
      : [{ text: "Qual sua motivação para essa vaga?" }];

    const res = await fetch("https://talentlink-wd88.onrender.com/forms/generate-local-question", {      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        type: mappedType,
        questions: questionContext,
      }),
    });

    const data = await res.json();

    if (!res.ok || !data.text) {
      console.error("Resposta inválida da IA:", data);
      throw new Error("IA não retornou uma questão válida.");
    }

    const newQuestion: Question = {
      id: Date.now().toString(),
      type,
     question:
  type === "multiple"
    ? data.text.split("\n").find((line: string) => !/^[A-D][\).]/.test(line.trim()))?.trim() || data.text
    : data.text,

      options: data.options ?? [],
    };

    setQuestions((prev) => [...prev, newQuestion]);
  } catch (err) {
    console.error("Erro ao gerar questão com IA:", err);
    alert("Erro ao gerar questão com IA.");
  }
};



  return (
    <div className="max-w-4xl mx-auto p-6 space-y-8">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-white">Criar Formulário</h1>
        <p className="text-dark-300">Adicione perguntas personalizadas para sua vaga.</p>
      </div>

      <div className="space-y-4">
        <label className="block text-white font-medium">Título do Formulário</label>
        <input
          type="text"
          value={formTitle}
          onChange={(e) => setFormTitle(e.target.value)}
          className="w-full p-2 bg-dark-700 border border-dark-600 text-white rounded"
          placeholder="Ex: Processo Seletivo - Desenvolvedor(a)"
        />

        <label className="block text-white font-medium">Descrição</label>
        <textarea
          value={formDescription}
          onChange={(e) => setFormDescription(e.target.value)}
          className="w-full p-2 bg-dark-700 border border-dark-600 text-white rounded min-h-[100px]"
          placeholder="Instruções ou objetivos do formulário"
        />
      </div>

      <div className="flex flex-wrap gap-4">
  <Button onClick={() => addQuestion("text")}>+ Adicionar pergunta aberta</Button>
  <Button onClick={() => addQuestion("multiple")}>+ Adicionar múltipla escolha</Button>
  <Button onClick={() => generateAIQuestion("text")}>✨ Gerar aberta com IA</Button>
  <Button onClick={() => generateAIQuestion("multiple")}>✨ Gerar múltipla escolha com IA</Button>
</div>


      {questions.map((q, i) => (
        <div key={q.id} className="p-4 bg-dark-800 border border-dark-700 rounded space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-white font-semibold">Pergunta {i + 1}</h2>
            <button onClick={() => removeQuestion(q.id)} className="text-red-400 text-sm hover:underline">
              Remover
            </button>
          </div>

          <div className="space-y-2">
            <label className="block text-dark-200">Tipo</label>
            <select
              value={q.type}
              onChange={(e) => updateQuestion(q.id, "type", e.target.value)}
              className="w-full bg-dark-700 border border-dark-600 text-white p-2 rounded"
            >
              <option value="text">Texto Aberto</option>
              <option value="multiple">Múltipla Escolha</option>
            </select>
          </div>

          <div className="space-y-2">
            <label className="block text-dark-200">Pergunta</label>
            <input
              type="text"
              value={q.question}
              onChange={(e) => updateQuestion(q.id, "question", e.target.value)}
              className="w-full p-2 bg-dark-700 border border-dark-600 text-white rounded"
              placeholder="Digite sua pergunta"
            />
          </div>

          {q.type === "multiple" && (
            <div className="space-y-2">
              <label className="block text-dark-200">Opções</label>
              {(q.options ?? []).map((opt, idx) => (
                <div key={idx} className="flex gap-2">
                  <input
                    type="text"
                    value={opt}
                    onChange={(e) => updateOption(q.id, idx, e.target.value)}
                    className="flex-1 p-2 bg-dark-700 border border-dark-600 text-white rounded"
                    placeholder={`Opção ${idx + 1}`}
                  />
                  {q.options && q.options.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeOption(q.id, idx)}
                      className="text-red-400 text-sm hover:underline"
                    >
                      Remover
                    </button>
                  )}
                </div>
              ))}
              <button
                type="button"
                onClick={() => addOption(q.id)}
                className="text-sm text-blue-400 hover:underline"
              >
                + Adicionar opção
              </button>
            </div>
          )}
        </div>
      ))}

      <div className="text-center pt-6">
        <Button onClick={handleSubmit}>Criar Formulário</Button>
      </div>
    </div>
  );
}
