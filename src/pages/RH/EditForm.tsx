"use client"

import { useEffect, useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import Button from "../../components/Button"

const API_URL = import.meta.env.VITE_API_URL

interface Question {
  id: string
  type: "text" | "multiple"
  question: string
  options?: string[]
}

export default function EditForm() {
  const { id } = useParams()
  const navigate = useNavigate()

  const [formTitle, setFormTitle] = useState("")
  const [formDescription, setFormDescription] = useState("")
  const [questions, setQuestions] = useState<Question[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const token = localStorage.getItem("authToken")
    const fetchForm = async () => {
      try {
        const res = await fetch(`${API_URL}/forms/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        const data = await res.json()

        // Adaptar estrutura recebida do backend para o formato do front
        const formattedQuestions = data.questions.map((q: any) => ({
          id: crypto.randomUUID(),
          question: q.text,
          type: q.type === "OPEN_TEXT" ? "text" : "multiple",
          options: q.options ?? [],
        }))

        setFormTitle(data.title)
        setFormDescription(data.description)
        setQuestions(formattedQuestions)
      } catch (err) {
        alert("Erro ao carregar o formulário.")
        console.error(err)
      } finally {
        setLoading(false)
      }
    }

    if (id) fetchForm()
  }, [id])

  const updateQuestion = (id: string, field: keyof Question, value: any) => {
    setQuestions((prev) =>
      prev.map((q) => (q.id === id ? { ...q, [field]: value } : q))
    )
  }

  const addOption = (questionId: string) => {
    setQuestions(
      questions.map((q) =>
        q.id === questionId && q.options
          ? { ...q, options: [...q.options, ""] }
          : q
      )
    )
  }

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
    )
  }

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
    )
  }

  const removeQuestion = (id: string) => {
    setQuestions((prev) => prev.filter((q) => q.id !== id))
  }

  const handleSubmit = async () => {
    const token = localStorage.getItem("authToken")
    const formattedQuestions = questions.map((q) => ({
      type: q.type === "text" ? "OPEN_TEXT" : "MULTIPLE_CHOICE",
      text: q.question,
      ...(q.options ? { options: q.options } : {}),
    }))

    try {
      const res = await fetch(`${API_URL}/forms/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          title: formTitle,
          description: formDescription,
          questions: formattedQuestions,
        }),
      })

      if (!res.ok) throw new Error("Erro ao atualizar o formulário.")

      alert("Formulário atualizado com sucesso!")
      navigate("/dashboardRH/forms")
    } catch (err) {
      alert("Erro ao salvar alterações.")
      console.error(err)
    }
  }

  if (loading) return <p className="text-white">Carregando formulário...</p>

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-8">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-white">Editar Formulário</h1>
        <p className="text-dark-300">Altere as perguntas ou o conteúdo do formulário.</p>
      </div>

      <div className="space-y-4">
        <label className="block text-white font-medium">Título</label>
        <input
          type="text"
          value={formTitle}
          onChange={(e) => setFormTitle(e.target.value)}
          className="w-full p-2 bg-dark-700 border border-dark-600 text-white rounded"
        />

        <label className="block text-white font-medium">Descrição</label>
        <textarea
          value={formDescription}
          onChange={(e) => setFormDescription(e.target.value)}
          className="w-full p-2 bg-dark-700 border border-dark-600 text-white rounded min-h-[100px]"
        />
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
        <Button onClick={handleSubmit}>Salvar Alterações</Button>
      </div>
    </div>
  )
}
