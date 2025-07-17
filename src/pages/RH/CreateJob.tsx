import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { FileText, BriefcaseBusiness, MapPin, Star } from "lucide-react";
import { Job } from "../../types";

interface Company {
  id: string;
  name: string;
}
interface Form {
  id: string;
  title: string;
}
interface CreateJobState
  extends Omit<
    Job,
    "id" | "createdAt" | "applicantsCount" | "requirements" | "benefits"
  > {
  requirements: string;
  benefits: string;
  formId?: string;
  companyId?: string;
}

const emptyJob: CreateJobState = {
  title: "",
  description: "",
  requirements: "",
  benefits: "",
  type: "Remote",
  location: "",
  status: "Open",
  formId: undefined,
  companyId: undefined,
};

const CreateJob = () => {
  const [job, setJob] = useState<CreateJobState>(emptyJob);
  const [companies, setCompanies] = useState<Company[]>([]);
  const [forms, setForms] = useState<Form[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem("authToken");
      try {
        const [companyRes, formRes] = await Promise.all([
          fetch(`${import.meta.env.VITE_API_URL}/empresa/rh`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
          fetch(`${import.meta.env.VITE_API_URL}/forms`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ]);
        if (companyRes.ok) setCompanies(await companyRes.json());
        if (formRes.ok) setForms(await formRes.json());
      } catch (err) {
        setError("Erro ao buscar dados.");
      }
    };
    fetchData();
  }, []);

  const handleInputChange = useCallback(
    (field: keyof CreateJobState, value: string) => {
      setJob((prev) => ({ ...prev, [field]: value }));
    },
    []
  );

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      setIsSubmitting(true);
      setError(null);

      const { title, description, location, companyId } = job;
      if (!title || !description || !location || !companyId) {
        setError("Preencha todos os campos obrigatórios, incluindo a empresa.");
        setIsSubmitting(false);
        return;
      }

      try {
        const token = localStorage.getItem("authToken");
        const payload = { ...job, companyId };
        const res = await fetch(
          `${import.meta.env.VITE_API_URL}/opportunities`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(payload),
          }
        );
        if (!res.ok) throw new Error(await res.text());
        alert("Oportunidade criada com sucesso!");
        navigate("/dashboardRH/manage-jobs");
      } catch (err) {
        setError(
          "Erro ao criar oportunidade. Verifique se todos os dados estão corretos."
        );
      } finally {
        setIsSubmitting(false);
      }
    },
    [job, navigate]
  );

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white">Criar Nova Vaga</h1>
        <p className="text-dark-300 mt-1">
          Preencha os detalhes para publicar uma nova vaga
        </p>
      </div>
      {error && (
        <div className="mb-4 text-red-500 bg-red-100 rounded p-2">{error}</div>
      )}
      <form onSubmit={handleSubmit} className="card space-y-8">
        <Section
          title="Informações Básicas"
          icon={<FileText size={20} className="mr-2 text-pink-500" />}
        >
          <Input
            label="Título da Vaga*"
            id="title"
            value={job.title}
            onChange={(e) => handleInputChange("title", e.target.value)}
            placeholder="Ex: Desenvolvedor Frontend Senior"
            required
          />
          <Textarea
            label="Descrição da Vaga*"
            id="description"
            value={job.description}
            onChange={(e) => handleInputChange("description", e.target.value)}
            placeholder="Descreva as responsabilidades..."
            required
          />
        </Section>
        <Section
          title="Tipo e Localização"
          icon={<BriefcaseBusiness size={20} className="mr-2 text-pink-500" />}
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Select
              label="Tipo de Vaga*"
              id="type"
              value={job.type}
              onChange={(e) => handleInputChange("type", e.target.value)}
              options={[
                { value: "Remote", label: "Remoto" },
                { value: "Hybrid", label: "Híbrido" },
                { value: "On-site", label: "Presencial" },
              ]}
              required
            />
            <Input
              label="Localização*"
              id="location"
              value={job.location}
              onChange={(e) => handleInputChange("location", e.target.value)}
              placeholder="Ex: São Paulo, SP ou Remoto"
              icon={<MapPin size={18} className="text-dark-400" />}
              required
            />
          </div>
        </Section>
        <Section
          title="Requisitos"
          icon={<Star size={20} className="mr-2 text-pink-500" />}
        >
          <div className="space-y-2">
            {job.requirements
              .split("\n")
              .filter((req) => req.trim() !== "")
              .map((req, idx, arr) => (
                <div key={idx} className="flex items-center gap-2">
                  <span className="flex-1 bg-dark-800 rounded px-3 py-2 text-dark-100">
                    {req}
                  </span>
                  <button
                    type="button"
                    className="text-red-400 hover:text-red-600 text-sm"
                    onClick={() => {
                      const newReqs = arr
                        .filter((_, i) => i !== idx)
                        .join("\n");
                      setJob((prev) => ({ ...prev, requirements: newReqs }));
                    }}
                  >
                    Remover
                  </button>
                </div>
              ))}

            <AddRequirementInput
              onAdd={(newReq) => {
                if (newReq.trim()) {
                  setJob((prev) => ({
                    ...prev,
                    requirements: prev.requirements
                      ? `${prev.requirements}\n${newReq.trim()}`
                      : newReq.trim(),
                  }));
                }
              }}
            />
          </div>
        </Section>

        <Section
  title="Benefícios"
  icon={<Star size={20} className="mr-2 text-pink-500" />}
>
  <div className="space-y-2">
    {job.benefits
      .split("\n")
      .filter((b) => b.trim() !== "")
      .map((b, idx, arr) => (
        <div key={idx} className="flex items-center gap-2">
          <span className="flex-1 bg-dark-800 rounded px-3 py-2 text-dark-100">
            {b}
          </span>
          <button
            type="button"
            className="text-red-400 hover:text-red-600 text-sm"
            onClick={() => {
              const newBenefits = arr.filter((_, i) => i !== idx).join("\n");
              setJob((prev) => ({ ...prev, benefits: newBenefits }));
            }}
          >
            Remover
          </button>
        </div>
      ))}
    <AddBenefitInput
      onAdd={(newBenefit) => {
        if (newBenefit.trim()) {
          setJob((prev) => ({
            ...prev,
            benefits: prev.benefits
              ? `${prev.benefits}\n${newBenefit.trim()}`
              : newBenefit.trim(),
          }));
        }
      }}
    />
  </div>
</Section>

        <Section
          title="Empresa"
          icon={<BriefcaseBusiness size={20} className="mr-2 text-pink-500" />}
        >
          <Select
            label="Selecionar Empresa"
            id="companyId"
            value={job.companyId ?? ""}
            onChange={(e) => handleInputChange("companyId", e.target.value)}
            options={[
              { value: "", label: "Nenhuma empresa selecionada" },
              ...companies.map((c) => ({ value: c.id, label: c.name })),
            ]}
            required
          />
        </Section>
        <Section
          title="Formulário Vinculado"
          icon={<FileText size={20} className="mr-2 text-pink-500" />}
        >
          <Select
            label="Selecionar Formulário"
            id="formId"
            value={job.formId ?? ""}
            onChange={(e) => handleInputChange("formId", e.target.value)}
            options={[
              { value: "", label: "Nenhum formulário" },
              ...forms.map((f) => ({ value: f.id, label: f.title })),
            ]}
          />
        </Section>
        <div className="flex flex-col sm:flex-row gap-4 pt-4 border-t border-dark-700">
          <button
            type="submit"
            className="btn btn-primary flex-1"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <span className="animate-pulse">Salvando...</span>
            ) : (
              "Publicar Vaga"
            )}
          </button>
          <button
            type="button"
            className="btn btn-outline"
            onClick={() => navigate(-1)}
          >
            Cancelar
          </button>
        </div>
      </form>
    </div>
  );
};

function Section({
  title,
  icon,
  children,
}: {
  title: string;
  icon: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold flex items-center">
        {icon}
        {title}
      </h2>
      {children}
    </div>
  );
}

function Input({
  label,
  icon,
  ...props
}: React.InputHTMLAttributes<HTMLInputElement> & {
  label: string;
  icon?: React.ReactNode;
}) {
  return (
    <div>
      <label
        htmlFor={props.id}
        className="block text-sm font-medium text-dark-200 mb-2"
      >
        {label}
      </label>
      <div className="relative">
        {icon && (
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            {icon}
          </div>
        )}
        <input {...props} className={`form-input ${icon ? "pl-10" : ""}`} />
      </div>
    </div>
  );
}

function Textarea({
  label,
  ...props
}: React.TextareaHTMLAttributes<HTMLTextAreaElement> & { label: string }) {
  return (
    <div>
      <label
        htmlFor={props.id}
        className="block text-sm font-medium text-dark-200 mb-2"
      >
        {label}
      </label>
      <textarea {...props} className="form-input min-h-32" />
    </div>
  );
}

function Select({
  label,
  options,
  ...props
}: React.SelectHTMLAttributes<HTMLSelectElement> & {
  label: string;
  options: { value: string; label: string }[];
}) {
  return (
    <div>
      <label
        htmlFor={props.id}
        className="block text-sm font-medium text-dark-200 mb-2"
      >
        {label}
      </label>
      <select {...props} className="form-input">
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    </div>
  );
}

function AddRequirementInput({ onAdd }: { onAdd: (value: string) => void }) {
  const [value, setValue] = useState("");

  const handleAdd = () => {
    if (value.trim()) {
      onAdd(value);
      setValue("");
    }
  };

  return (
    <div className="flex gap-2 mt-2">
      <input
        type="text"
        className="form-input flex-1"
        placeholder="Adicionar requisito"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            e.preventDefault();
            handleAdd();
          }
        }}
      />
      <button type="button" className="btn btn-secondary" onClick={handleAdd}>
        Adicionar
      </button>
    </div>
  );
}

// AddBenefitInput component, similar to AddRequirementInput
function AddBenefitInput({ onAdd }: { onAdd: (value: string) => void }) {
  const [value, setValue] = useState("");

  const handleAdd = () => {
    if (value.trim()) {
      onAdd(value);
      setValue("");
    }
  };

  return (
    <div className="flex gap-2 mt-2">
      <input
        type="text"
        className="form-input flex-1"
        placeholder="Adicionar benefício"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            e.preventDefault();
            handleAdd();
          }
        }}
      />
      <button type="button" className="btn btn-secondary" onClick={handleAdd}>
        Adicionar
      </button>
    </div>
  );
}

export default CreateJob;
