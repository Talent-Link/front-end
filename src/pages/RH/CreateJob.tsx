import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Plus,
  X,
  FileText,
  BriefcaseBusiness,
  MapPin,
  Star,
} from "lucide-react";
import { Job } from "../../types";

const emptyJob: Omit<Job, "id" | "createdAt" | "applicantsCount"> & {
  formId?: string;
  companyId?: string;
} = {
  title: "",
  description: "",
  requirements: [],
  benefits: [],
  type: "Remote",
  location: "",
  status: "Open",
  formId: undefined,
  companyId: undefined,
};

const CreateJob = () => {
  const [job, setJob] = useState(emptyJob);
  const [newRequirement, setNewRequirement] = useState("");
  const [newBenefit, setNewBenefit] = useState("");
  const [companies, setCompanies] = useState<{ id: string; name: string }[]>(
    []
  );
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [forms, setForms] = useState<{ id: string; title: string }[]>([]);
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

        if (companyRes.ok) {
          const companyData = await companyRes.json();
          setCompanies(companyData);
        }

        if (formRes.ok) {
          const formData = await formRes.json();
          setForms(formData);
        }
      } catch (err) {
        console.error("Erro ao buscar dados:", err);
      }
    };

    fetchData();
  }, []);

  const handleInputChange = (field: keyof typeof job, value: string) => {
    setJob({ ...job, [field]: value });
  };

  const handleAddItem = (
    field: "requirements" | "benefits",
    value: string,
    setter: React.Dispatch<React.SetStateAction<string>>
  ) => {
    if (value.trim()) {
      setJob({ ...job, [field]: [...job[field], value.trim()] });
      setter("");
    }
  };

  const handleRemoveItem = (
    field: "requirements" | "benefits",
    index: number
  ) => {
    setJob({ ...job, [field]: job[field].filter((_, i) => i !== index) });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const token = localStorage.getItem("authToken");
      const companyId = job.companyId;

      // Validação básica antes de enviar
      if (!job.title || !job.description || !job.location || !companyId) {
        alert("Preencha todos os campos obrigatórios, incluindo a empresa.");
        setIsSubmitting(false);
        return;
      }

      const payload = {
        ...job,
        companyId,
      };

      const res = await fetch(`${import.meta.env.VITE_API_URL}/opportunities`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const errorText = await res.text();
        throw new Error(errorText);
      }

      alert("Oportunidade criada com sucesso!");
      console.log("Payload enviado:", payload);
      navigate("/dashboardRH/manage-jobs");
    } catch (err) {
      console.error("Erro ao criar vaga:", err);
      alert(
        "Erro ao criar oportunidade. Verifique se todos os dados estão corretos."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold ">Criar Nova Vaga</h1>
        <p className="text-dark-300 mt-1">
          Preencha os detalhes para publicar uma nova vaga
        </p>
      </div>

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
          <AddList
            items={job.requirements}
            newItem={newRequirement}
            setNewItem={setNewRequirement}
            onAdd={() =>
              handleAddItem("requirements", newRequirement, setNewRequirement)
            }
            onRemove={(index) => handleRemoveItem("requirements", index)}
            placeholder="Ex: 3+ anos com React"
            emptyText="Nenhum requisito adicionado"
          />
        </Section>

        <Section
          title="Benefícios"
          icon={<Star size={20} className="mr-2 text-pink-500" />}
        >
          <AddList
            items={job.benefits}
            newItem={newBenefit}
            setNewItem={setNewBenefit}
            onAdd={() => handleAddItem("benefits", newBenefit, setNewBenefit)}
            onRemove={(index) => handleRemoveItem("benefits", index)}
            placeholder="Ex: Plano de saúde, VR, etc."
            emptyText="Nenhum benefício adicionado"
          />
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

// Componentes auxiliares
const Section = ({
  title,
  icon,
  children,
}: {
  title: string;
  icon: React.ReactNode;
  children: React.ReactNode;
}) => (
  <div className="space-y-6">
    <h2 className="text-xl font-semibold flex items-center">
      {icon}
      {title}
    </h2>
    {children}
  </div>
);

const Input = ({
  label,
  icon,
  ...props
}: React.InputHTMLAttributes<HTMLInputElement> & {
  label: string;
  icon?: React.ReactNode;
}) => (
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

const Textarea = ({
  label,
  ...props
}: React.TextareaHTMLAttributes<HTMLTextAreaElement> & { label: string }) => (
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

const Select = ({
  label,
  options,
  ...props
}: React.SelectHTMLAttributes<HTMLSelectElement> & {
  label: string;
  options: { value: string; label: string }[];
}) => (
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

const AddList = ({
  items,
  newItem,
  setNewItem,
  onAdd,
  onRemove,
  placeholder,
  emptyText,
}: {
  items: string[];
  newItem: string;
  setNewItem: React.Dispatch<React.SetStateAction<string>>;
  onAdd: () => void;
  onRemove: (index: number) => void;
  placeholder: string;
  emptyText: string;
}) => (
  <div>
    <div className="flex">
      <input
        type="text"
        value={newItem}
        onChange={(e) => setNewItem(e.target.value)}
        className="form-input flex-grow"
        placeholder={placeholder}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            e.preventDefault();
            onAdd();
          }
        }}
      />
      <button type="button" onClick={onAdd} className="btn btn-primary ml-2">
        <Plus size={20} />
      </button>
    </div>
    <div className="mt-4">
      {items.length > 0 ? (
        <ul className="space-y-2">
          {items.map((item, index) => (
            <li
              key={index}
              className="flex items-center justify-between p-3 bg-dark-700 rounded-md"
            >
              <span>{item}</span>
              <button
                type="button"
                onClick={() => onRemove(index)}
                className="text-dark-300 hover:text-red-400"
              >
                <X size={18} />
              </button>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-dark-400 text-sm">{emptyText}</p>
      )}
    </div>
  </div>
);

export default CreateJob;
