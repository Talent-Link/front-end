import { useState } from "react";

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

  const API_URL = import.meta.env.VITE_API_URL;

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
    setQuestions(
      questions.map((q) => (q.id === id ? { ...q, [field]: value } : q))
    );
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

  const updateOption = (
    questionId: string,
    optionIndex: number,
    value: string
  ) => {
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

      const res = await fetch(`${API_URL}/forms`, {
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

      const questionContext =
        questions.length > 0
          ? questions.map((q) => ({ text: q.question }))
          : [{ text: "Qual sua motivação para essa vaga?" }];

      const res = await fetch(`${API_URL}/forms/generate-local-question`, {
        method: "POST",
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
            ? data.text
                .split("\n")
                .find((line: string) => !/^[A-D][\).]/.test(line.trim()))
                ?.trim() || data.text
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
    <div className="max-w-5xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-white mb-2">Criar Formulário</h1>
        <p className="text-dark-300 text-lg">
          Configure perguntas personalizadas para processos seletivos
        </p>
      </div>

      {/* Informações básicas do formulário */}
      <div className="bg-gradient-to-r from-dark-800/50 to-dark-700/50 backdrop-blur-sm border border-dark-600/50 rounded-xl p-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div>
            <label className="block text-white font-medium mb-3 text-sm uppercase tracking-wide">
              Título do Formulário
            </label>
            <input
              type="text"
              value={formTitle}
              onChange={(e) => setFormTitle(e.target.value)}
              className="w-full px-4 py-3 bg-dark-900/50 border border-dark-600 text-white rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all"
              placeholder="Nome do processo seletivo"
            />
          </div>

          <div>
            <label className="block text-white font-medium mb-3 text-sm uppercase tracking-wide">
              Descrição
            </label>
            <textarea
              value={formDescription}
              onChange={(e) => setFormDescription(e.target.value)}
              className="w-full px-4 py-3 bg-dark-900/50 border border-dark-600 text-white rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all resize-none"
              placeholder="Instruções para os candidatos"
              rows={3}
            />
          </div>
        </div>
      </div>

      {/* Ações para adicionar perguntas */}
      <div className="flex flex-wrap gap-3 justify-center">
        <button
          onClick={() => addQuestion("text")}
          className="inline-flex items-center px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-all transform hover:scale-105 shadow-lg hover:shadow-xl"
        >
          <span className="mr-2">📝</span>
          Pergunta Aberta
        </button>
        
        <button
          onClick={() => addQuestion("multiple")}
          className="inline-flex items-center px-6 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-all transform hover:scale-105 shadow-lg hover:shadow-xl"
        >
          <span className="mr-2">📋</span>
          Múltipla Escolha
        </button>
        
        <button
          onClick={() => generateAIQuestion("text")}
          className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white rounded-lg transition-all transform hover:scale-105 shadow-lg hover:shadow-xl"
        >
          <span className="mr-2">✨</span>
          IA: Aberta
        </button>
        
        <button
          onClick={() => generateAIQuestion("multiple")}
          className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white rounded-lg transition-all transform hover:scale-105 shadow-lg hover:shadow-xl"
        >
          <span className="mr-2">🤖</span>
          IA: Múltipla
        </button>
      </div>

      {/* Lista de perguntas */}
      {questions.length > 0 && (
        <div className="space-y-4">
          {questions.map((q, i) => (
            <div
              key={q.id}
              className="bg-gradient-to-r from-dark-800/60 to-dark-700/60 backdrop-blur-sm border border-dark-600/30 rounded-xl p-6 shadow-lg"
            >
              {/* Header da pergunta */}
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-pink-600 rounded-full flex items-center justify-center text-white font-bold text-sm">
                    {i + 1}
                  </div>
                  <div>
                    <span className="text-white font-medium">Pergunta {i + 1}</span>
                    <div className="flex items-center mt-1">
                      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                        q.type === "text" 
                          ? "bg-blue-100 text-blue-800" 
                          : "bg-green-100 text-green-800"
                      }`}>
                        {q.type === "text" ? "📝 Aberta" : "📋 Múltipla"}
                      </span>
                    </div>
                  </div>
                </div>
                
                <button
                  onClick={() => removeQuestion(q.id)}
                  className="text-red-400 hover:text-red-300 hover:bg-red-400/10 p-2 rounded-lg transition-all"
                  title="Remover pergunta"
                >
                  🗑️
                </button>
              </div>

              {/* Conteúdo da pergunta */}
              <div className="space-y-4">
                <div>
                  <label className="block text-dark-200 mb-2 text-sm font-medium">
                    Pergunta
                  </label>
                  <textarea
                    value={q.question}
                    onChange={(e) => updateQuestion(q.id, "question", e.target.value)}
                    className="w-full px-4 py-3 bg-dark-900/50 border border-dark-600 text-white rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all resize-none"
                    placeholder="Digite sua pergunta..."
                    rows={2}
                  />
                </div>

                {q.type === "multiple" && (
                  <div>
                    <label className="block text-dark-200 mb-3 text-sm font-medium">
                      Opções de Resposta
                    </label>
                    <div className="space-y-2">
                      {(q.options ?? []).map((opt, idx) => (
                        <div key={idx} className="flex items-center space-x-3">
                          <div className="w-6 h-6 bg-dark-600 rounded-full flex items-center justify-center text-white text-xs font-medium">
                            {String.fromCharCode(65 + idx)}
                          </div>
                          <input
                            type="text"
                            value={opt}
                            onChange={(e) => updateOption(q.id, idx, e.target.value)}
                            className="flex-1 px-4 py-2 bg-dark-900/50 border border-dark-600 text-white rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all"
                            placeholder={`Opção ${String.fromCharCode(65 + idx)}`}
                          />
                          {q.options && q.options.length > 1 && (
                            <button
                              type="button"
                              onClick={() => removeOption(q.id, idx)}
                              className="text-red-400 hover:text-red-300 hover:bg-red-400/10 p-2 rounded-lg transition-all"
                              title="Remover opção"
                            >
                              ❌
                            </button>
                          )}
                        </div>
                      ))}
                    </div>
                    
                    <button
                      type="button"
                      onClick={() => addOption(q.id)}
                      className="mt-3 text-blue-400 hover:text-blue-300 text-sm font-medium hover:bg-blue-400/10 px-3 py-1 rounded-lg transition-all"
                    >
                      + Adicionar opção
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Botão de ação principal */}
      <div className="text-center py-8">
        <div className="mb-4">
          <span className="text-dark-300 text-sm">
            {questions.length === 0 
              ? "Adicione perguntas para criar o formulário" 
              : `${questions.length} pergunta${questions.length > 1 ? 's' : ''} criada${questions.length > 1 ? 's' : ''}`
            }
          </span>
        </div>
        
        <button
          onClick={handleSubmit}
          disabled={!formTitle.trim() || questions.length === 0}
          className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-700 hover:to-purple-700 disabled:from-gray-600 disabled:to-gray-700 disabled:cursor-not-allowed text-white text-lg font-semibold rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 disabled:transform-none transition-all"
        >
          <span className="mr-2">🚀</span>
          Criar Formulário
        </button>
        
        {(!formTitle.trim() || questions.length === 0) && (
          <div className="mt-4 text-sm text-yellow-400/80">
            {!formTitle.trim() && <div>• Adicione um título</div>}
            {questions.length === 0 && <div>• Adicione pelo menos uma pergunta</div>}
          </div>
        )}
      </div>
    </div>
  );
}
