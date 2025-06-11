import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
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
} = {
  title: "",
  description: "",
  requirements: [],
  benefits: [],
  type: "Remote",
  location: "",
  status: "Open",
  formId: undefined,
};

const mockJob: Job = {
  id: "1",
  title: "Senior Frontend Developer",
  description:
    "We are looking for an experienced Frontend Developer to join our team.",
  requirements: ["5+ years of React experience", "TypeScript", "CSS/SCSS"],
  benefits: ["Competitive salary", "Remote work", "Health insurance"],
  type: "Remote",
  location: "Anywhere",
  status: "Open",
  createdAt: "2023-09-15T10:00:00Z",
  applicantsCount: 12,
};

const CreateJob = () => {
  const [job, setJob] =
    useState<Omit<Job, "id" | "createdAt" | "applicantsCount">>(emptyJob);
  const [newRequirement, setNewRequirement] = useState("");
  const [newBenefit, setNewBenefit] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [forms, setForms] = useState<{ id: string; title: string }[]>([]);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const jobId = queryParams.get("id");
    if (jobId) {
      setJob({
        title: mockJob.title,
        description: mockJob.description,
        requirements: [...mockJob.requirements],
        benefits: [...mockJob.benefits],
        type: mockJob.type,
        location: mockJob.location,
        status: mockJob.status,
      });
      setIsEditMode(true);
    }
  }, [location]);

  useEffect(() => {
    const fetchForms = async () => {
      try {
        const token = localStorage.getItem("authToken");
        const res = await fetch(`${process.env.REACT_APP_API_URL}/forms`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        setForms(data);
      } catch (err) {
        console.error("Erro ao buscar formulários", err);
      }
    };
    fetchForms();
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      navigate("manage-jobs");
    }, 1000);
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">
          {isEditMode ? "Editar Vaga" : "Criar Nova Vaga"}
        </h1>
        <p className="text-dark-300 mt-1">
          {isEditMode
            ? "Atualize as informações da vaga existente"
            : "Preencha os detalhes para publicar uma nova vaga"}
        </p>
      </div>

      <form onSubmit={handleSubmit} className="card space-y-8">
        {/* Informações Básicas */}
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
            placeholder="Descreva as responsabilidades e o que você espera do candidato..."
            required
          />
        </Section>

        {/* Tipo e Localização */}
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

        {/* Requisitos */}
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
            placeholder="Ex: 3+ anos de experiência com React"
            emptyText="Nenhum requisito adicionado"
          />
        </Section>

        {/* Benefícios */}
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
            placeholder="Ex: Plano de saúde, Vale refeição, etc."
            emptyText="Nenhum benefício adicionado"
          />
        </Section>

        {/* Botões */}
        <div className="flex flex-col sm:flex-row gap-4 pt-4 border-t border-dark-700">
          <button
            type="submit"
            className="btn btn-primary flex-1"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <span className="inline-block animate-pulse">Salvando...</span>
            ) : (
              <span>{isEditMode ? "Atualizar Vaga" : "Publicar Vaga"}</span>
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

// Componentes auxiliares para clareza e organização

type SectionProps = {
  title: string;
  icon: React.ReactNode;
  children: React.ReactNode;
};
const Section = ({ title, icon, children }: SectionProps) => (
  <div className="space-y-6">
    <h2 className="text-xl font-semibold flex items-center">
      {icon}
      {title}
    </h2>
    {children}
  </div>
);

type InputProps = React.InputHTMLAttributes<HTMLInputElement> & {
  label: string;
  icon?: React.ReactNode;
};
const Input = ({ label, icon, ...props }: InputProps) => (
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

type TextareaProps = React.TextareaHTMLAttributes<HTMLTextAreaElement> & {
  label: string;
};
const Textarea = ({ label, ...props }: TextareaProps) => (
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

type SelectProps = React.SelectHTMLAttributes<HTMLSelectElement> & {
  label: string;
  options: { value: string; label: string }[];
};
const Select = ({ label, options, ...props }: SelectProps) => (
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

type AddListProps = {
  items: string[];
  newItem: string;
  setNewItem: React.Dispatch<React.SetStateAction<string>>;
  onAdd: () => void;
  onRemove: (index: number) => void;
  placeholder: string;
  emptyText: string;
};
const AddList = ({
  items,
  newItem,
  setNewItem,
  onAdd,
  onRemove,
  placeholder,
  emptyText,
}: AddListProps) => (
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
