"use client"

import { useEffect, useState } from "react"
import styles from "../../styles/RH/FormList.module.css"
import { useNavigate } from "react-router-dom"
import Button from "../../components/Button"
import { toast } from "react-toastify"


interface Question {
  type: "MULTIPLE_CHOICE" | "OPEN_TEXT"
  text: string
  options?: string[]
}

interface Form {
  id: string
  title: string
  description: string
  questions: Question[]
  createdAt: string
}

export default function FormList() {
  const [forms, setForms] = useState<Form[]>([])
  const [loading, setLoading] = useState(true)

  const API_URL = import.meta.env.VITE_API_URL
  const navigate = useNavigate()

  const fetchForms = async () => {
    const token = localStorage.getItem("authToken")
    if (!token) {
      alert("Token não encontrado. Faça login novamente.")
      return
    }

    try {
      const res = await fetch(`${API_URL}/forms`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (!res.ok) throw new Error("Erro ao buscar formulários.")
      const data = await res.json()
      setForms(data)
    } catch (err) {
      console.error("Erro ao buscar formulários:", err)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (formId: string) => {
  const confirmDelete = window.confirm("Deseja realmente excluir este formulário?")
  if (!confirmDelete) return

  const token = localStorage.getItem("authToken")
  if (!token) {
    toast.error("Token não encontrado. Faça login novamente.")
    return
  }

  try {
    const res = await fetch(`${API_URL}/forms/${formId}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })

    if (!res.ok) {
      const errorMessage = await res.text()
      toast.error(errorMessage)
      return
    }

    setForms((prev) => prev.filter((form) => form.id !== formId))
    toast.success("Formulário excluído com sucesso.")
  } catch (err) {
    console.error("Erro ao excluir formulário:", err)
    toast.error("Erro inesperado ao excluir formulário.")
  }
}

  const handleEdit = (formId: string) => {
    navigate(`/dashboardRH/forms/edit/${formId}`)
  }

  const handleCreateNew = () => {
    navigate("/dashboardRH/create-form")
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    })
  }

  useEffect(() => {
    fetchForms()
  }, [])

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h1 className={styles.title}>Meus Formulários</h1>
        <Button className={styles.createButton} onClick={handleCreateNew}>
          Criar Novo Formulário
        </Button>
      </header>

      {loading ? (
        <p className={styles.loading}>Carregando formulários...</p>
      ) : forms.length === 0 ? (
        <div className={styles.emptyState}>
          <p>Nenhum formulário encontrado.</p>
          <button className={styles.createButton} onClick={handleCreateNew}>
            Criar Primeiro Formulário
          </button>
        </div>
      ) : (
        <div className={styles.formGrid}>
          {forms.map((form) => (
            <div key={form.id} className={styles.formCard}>
              <div className={styles.cardHeader}>
                <h2 className={styles.formTitle}>{form.title}</h2>
                <div className={styles.cardActions}>
                  <Button className={styles.editButton} onClick={() => handleEdit(form.id)}>
                    Editar
                  </Button>
                  <button className={styles.deleteButton} onClick={() => handleDelete(form.id)}>
                    Excluir
                  </button>
                </div>
              </div>
              <p className={styles.formDescription}>{form.description}</p>
              <div className={styles.formMeta}>
                <div className={styles.questionsCount}>
                  <span className={styles.metaLabel}>Perguntas:</span>
                  <span className={styles.metaValue}>{form.questions.length}</span>
                </div>
                <div className={styles.createdDate}>
                  <span className={styles.metaLabel}>Criado em:</span>
                  <span className={styles.metaValue}>{formatDate(form.createdAt)}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}