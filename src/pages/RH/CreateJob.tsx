import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Plus, X, FileText, BriefcaseBusiness, MapPin, Star } from 'lucide-react';
import { Job } from '../../types';

// Initial empty job
const emptyJob: Omit<Job, 'id' | 'createdAt' | 'applicantsCount'> = {
  title: '',
  description: '',
  requirements: [],
  benefits: [],
  type: 'Remote',
  location: '',
  status: 'Open',
};

// Mock existing job for editing
const mockJob: Job = {
  id: '1',
  title: 'Senior Frontend Developer',
  description: 'We are looking for an experienced Frontend Developer to join our team.',
  requirements: ['5+ years of React experience', 'TypeScript', 'CSS/SCSS'],
  benefits: ['Competitive salary', 'Remote work', 'Health insurance'],
  type: 'Remote',
  location: 'Anywhere',
  status: 'Open',
  createdAt: '2023-09-15T10:00:00Z',
  applicantsCount: 12,
};

const CreateJob = () => {
  const [job, setJob] = useState<Omit<Job, 'id' | 'createdAt' | 'applicantsCount'>>(emptyJob);
  const [newRequirement, setNewRequirement] = useState('');
  const [newBenefit, setNewBenefit] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  
  useEffect(() => {
    // Check if we're editing an existing job
    const queryParams = new URLSearchParams(location.search);
    const jobId = queryParams.get('id');
    
    if (jobId) {
      // In a real app, fetch the job from API
      // For demo, use mock data
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
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false);
      navigate('manage-jobs');
    }, 1000);
  };
  
  const handleAddRequirement = () => {
    if (newRequirement.trim()) {
      setJob({
        ...job,
        requirements: [...job.requirements, newRequirement.trim()],
      });
      setNewRequirement('');
    }
  };
  
  const handleRemoveRequirement = (index: number) => {
    setJob({
      ...job,
      requirements: job.requirements.filter((_, i) => i !== index),
    });
  };
  
  const handleAddBenefit = () => {
    if (newBenefit.trim()) {
      setJob({
        ...job,
        benefits: [...job.benefits, newBenefit.trim()],
      });
      setNewBenefit('');
    }
  };
  
  const handleRemoveBenefit = (index: number) => {
    setJob({
      ...job,
      benefits: job.benefits.filter((_, i) => i !== index),
    });
  };
  
  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">{isEditMode ? 'Editar Vaga' : 'Criar Nova Vaga'}</h1>
        <p className="text-dark-300 mt-1">
          {isEditMode
            ? 'Atualize as informações da vaga existente'
            : 'Preencha os detalhes para publicar uma nova vaga'}
        </p>
      </div>
      
      <form onSubmit={handleSubmit} className="card space-y-8">
        {/* Job Basics */}
        <div className="space-y-6">
          <h2 className="text-xl font-semibold flex items-center">
            <FileText size={20} className="mr-2 text-pink-500" />
            Informações Básicas
          </h2>
          
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-dark-200 mb-2">
              Título da Vaga*
            </label>
            <input
              type="text"
              id="title"
              value={job.title}
              onChange={(e) => setJob({ ...job, title: e.target.value })}
              className="form-input"
              placeholder="Ex: Desenvolvedor Frontend Senior"
              required
            />
          </div>
          
          <div>
            <label htmlFor="description" className="block text-sm font-medium text-dark-200 mb-2">
              Descrição da Vaga*
            </label>
            <textarea
              id="description"
              value={job.description}
              onChange={(e) => setJob({ ...job, description: e.target.value })}
              className="form-input min-h-32"
              placeholder="Descreva as responsabilidades e o que você espera do candidato..."
              required
            />
          </div>
        </div>
        
        {/* Job Type and Location */}
        <div className="space-y-6">
          <h2 className="text-xl font-semibold flex items-center">
            <BriefcaseBusiness size={20} className="mr-2 text-pink-500" />
            Tipo e Localização
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="type" className="block text-sm font-medium text-dark-200 mb-2">
                Tipo de Vaga*
              </label>
              <select
                id="type"
                value={job.type}
                onChange={(e) => setJob({ ...job, type: e.target.value as any })}
                className="form-input"
                required
              >
                <option value="Remote">Remoto</option>
                <option value="Hybrid">Híbrido</option>
                <option value="On-site">Presencial</option>
              </select>
            </div>
            
            <div>
              <label htmlFor="location" className="block text-sm font-medium text-dark-200 mb-2">
                Localização*
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <MapPin size={18} className="text-dark-400" />
                </div>
                <input
                  type="text"
                  id="location"
                  value={job.location}
                  onChange={(e) => setJob({ ...job, location: e.target.value })}
                  className="form-input pl-10"
                  placeholder="Ex: São Paulo, SP ou Remoto"
                  required
                />
              </div>
            </div>
          </div>
        </div>
        
        {/* Requirements */}
        <div className="space-y-6">
          <h2 className="text-xl font-semibold flex items-center">
            <Star size={20} className="mr-2 text-pink-500" />
            Requisitos
          </h2>
          
          <div>
            <div className="flex">
              <input
                type="text"
                value={newRequirement}
                onChange={(e) => setNewRequirement(e.target.value)}
                className="form-input flex-grow"
                placeholder="Ex: 3+ anos de experiência com React"
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleAddRequirement();
                  }
                }}
              />
              <button
                type="button"
                onClick={handleAddRequirement}
                className="btn btn-primary ml-2"
              >
                <Plus size={20} />
              </button>
            </div>
            
            <div className="mt-4">
              {job.requirements.length > 0 ? (
                <ul className="space-y-2">
                  {job.requirements.map((req, index) => (
                    <li
                      key={index}
                      className="flex items-center justify-between p-3 bg-dark-700 rounded-md"
                    >
                      <span>{req}</span>
                      <button
                        type="button"
                        onClick={() => handleRemoveRequirement(index)}
                        className="text-dark-300 hover:text-red-400"
                      >
                        <X size={18} />
                      </button>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-dark-400 text-sm">Nenhum requisito adicionado</p>
              )}
            </div>
          </div>
        </div>
        
        {/* Benefits */}
        <div className="space-y-6">
          <h2 className="text-xl font-semibold flex items-center">
            <Star size={20} className="mr-2 text-pink-500" />
            Benefícios
          </h2>
          
          <div>
            <div className="flex">
              <input
                type="text"
                value={newBenefit}
                onChange={(e) => setNewBenefit(e.target.value)}
                className="form-input flex-grow"
                placeholder="Ex: Plano de saúde, Vale refeição, etc."
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleAddBenefit();
                  }
                }}
              />
              <button
                type="button"
                onClick={handleAddBenefit}
                className="btn btn-primary ml-2"
              >
                <Plus size={20} />
              </button>
            </div>
            
            <div className="mt-4">
              {job.benefits.length > 0 ? (
                <ul className="space-y-2">
                  {job.benefits.map((benefit, index) => (
                    <li
                      key={index}
                      className="flex items-center justify-between p-3 bg-dark-700 rounded-md"
                    >
                      <span>{benefit}</span>
                      <button
                        type="button"
                        onClick={() => handleRemoveBenefit(index)}
                        className="text-dark-300 hover:text-red-400"
                      >
                        <X size={18} />
                      </button>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-dark-400 text-sm">Nenhum benefício adicionado</p>
              )}
            </div>
          </div>
        </div>
        
        {/* Submit buttons */}
        <div className="flex flex-col sm:flex-row gap-4 pt-4 border-t border-dark-700">
          <button
            type="submit"
            className="btn btn-primary flex-1"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <span className="inline-block animate-pulse">Salvando...</span>
            ) : (
              <span>{isEditMode ? 'Atualizar Vaga' : 'Publicar Vaga'}</span>
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

export default CreateJob;