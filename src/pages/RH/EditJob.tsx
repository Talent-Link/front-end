import { useState, useEffect } from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import { ArrowLeft, Save, Loader2 } from "lucide-react";
import { Job } from "../../types";
import { jobService } from "../../services/jobService";

interface EditJobState {
  title: string;
  description: string;
  requirements: string;
  benefits: string;
  location: string;
  companyId?: string;
  formId?: string | null;
}

const EditJob = () => {
  const { id } = useParams<{ id: string }>();
  const location = useLocation();
  const navigate = useNavigate();
  
  // Dados passados pelo JobCard
  const initialJobData = location.state?.jobData as Job | undefined;
  
  // Estados do formulário
  const [formData, setFormData] = useState<EditJobState>({
    title: '',
    description: '',
    requirements: '',
    benefits: '',
    location: ''
  });
  
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [dataLoaded, setDataLoaded] = useState(false);

  // Pré-preenche o formulário com os dados atuais
  useEffect(() => {
    if (id) {
      // Sempre tenta carregar dados atuais da API primeiro
      loadJobData();
    } else if (initialJobData) {
      // Fallback para dados passados via state (para casos offline)
      console.log('Usando dados passados via state como fallback:', initialJobData);
      
      const requirementsText = Array.isArray(initialJobData.requirements) 
        ? initialJobData.requirements.join('\n')
        : (initialJobData.requirements as any)?.toString?.() || '';
        
      const benefitsText = Array.isArray(initialJobData.benefits) 
        ? initialJobData.benefits.join('\n')
        : (initialJobData.benefits as any)?.toString?.() || '';
      
      setFormData({
        title: initialJobData.title,
        description: initialJobData.description,
        location: initialJobData.location,
        requirements: requirementsText,
        benefits: benefitsText
      });
    }
  }, [id, initialJobData]);

  const loadJobData = async () => {
    if (!id) return;
    
    setLoading(true);
    setError(null);
    
    try {
      // Busca os dados da oportunidade via API
      const jobData = await jobService.getJobById(id);
      
      // Converte requirements e benefits para string se forem arrays
      const requirementsText = Array.isArray(jobData.requirements) 
        ? jobData.requirements.join('\n')
        : String(jobData.requirements || '');
        
      const benefitsText = Array.isArray(jobData.benefits) 
        ? jobData.benefits.join('\n')
        : String(jobData.benefits || '');
      
      setFormData({
        title: jobData.title,
        description: jobData.description,
        location: jobData.location,
        requirements: requirementsText,
        benefits: benefitsText,
        companyId: jobData.companyId,
        formId: jobData.formId
      });
      
      setDataLoaded(true);
      console.log('Dados da vaga carregados via API:', jobData);
      console.log('CompanyId:', jobData.companyId, 'FormId:', jobData.formId);
    } catch (error: any) {
      console.error('Erro ao carregar dados da vaga:', error);
      setError(error.message || 'Erro ao carregar dados da vaga');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!id) return;

    setSaving(true);
    setError(null);
    
    try {
      // Prepara os dados conforme a documentação da API
      const updateData = {
        title: formData.title.trim(),
        description: formData.description.trim(),
        location: formData.location.trim(),
        requirements: formData.requirements.trim(), // A API espera string, não array
        benefits: formData.benefits.trim(), // A API espera string, não array
        companyId: formData.companyId, // Campo obrigatório conforme documentação
        formId: formData.formId || null // Campo opcional
      };

      console.log('Enviando dados de atualização:', updateData);
      console.log('CompanyId no updateData:', updateData.companyId);
      console.log('FormId no updateData:', updateData.formId);
      
      // 🔍 Teste adicional: verificar se conseguimos fazer um GET antes do PUT
      console.log('🔍 Verificando se ainda conseguimos acessar a oportunidade...');
      try {
        const currentData = await jobService.getJobById(id);
        console.log('✅ Oportunidade ainda existe, dados atuais:', currentData);
      } catch (checkError) {
        console.log('❌ Erro ao verificar oportunidade:', checkError);
      }
      
      const updatedJob = await jobService.updateJob(id, updateData);
      
      console.log('Vaga atualizada com sucesso:', updatedJob);
      
      // Exibe mensagem de sucesso
      alert('Vaga atualizada com sucesso!');
      
      // Volta para a lista de vagas
      navigate('/dashboardRH/manage-jobs');
      
    } catch (error: any) {
      console.error('Erro ao atualizar vaga:', error);
      
      let errorMessage = 'Erro ao atualizar vaga';
      
      if (error.message?.includes('não encontrada')) {
        errorMessage = 'Oportunidade não encontrada. Ela pode ter sido removida ou você não tem permissão para editá-la.';
      } else if (error.response?.status === 401 || error.message?.includes('Token')) {
        errorMessage = 'Sua sessão expirou. Faça login novamente.';
      } else if (error.response?.status === 403 || error.message?.includes('permissão')) {
        errorMessage = 'Sem permissão para editar esta vaga.';
      } else if (error.response?.status === 400 || error.message?.includes('inválidos') || error.message?.includes('obrigatórios')) {
        errorMessage = 'Dados inválidos. Verifique se todos os campos obrigatórios foram preenchidos.';
      } else if (error.message?.includes('rede') || error.message?.includes('conexão')) {
        errorMessage = 'Erro de conexão. Verifique sua internet e tente novamente.';
      } else if (error.message && !error.message.includes('HTML')) {
        errorMessage = error.message;
      }
      
      setError(errorMessage);
    } finally {
      setSaving(false);
    }
  };

  const handleBack = () => {
    navigate('/dashboardRH/manage-jobs');
  };

  // 🔍 Função para testar diferentes endpoints
  const testApiEndpoints = async () => {
    if (!id) return;
    
    console.log('🧪 Testando endpoints da API...');
    const token = localStorage.getItem('authToken');
    
    const testData = {
      title: 'Teste',
      description: 'Teste de endpoint',
      location: 'Teste',
      requirements: 'Teste',
      benefits: 'Teste',
      companyId: formData.companyId,
      formId: formData.formId
    };
    
    const endpoints = [
      { method: 'PUT', url: `/opportunities/${id}` },
      { method: 'PATCH', url: `/opportunities/${id}` },
      { method: 'POST', url: `/opportunities/${id}/edit` },
      { method: 'PUT', url: `/opportunities/update/${id}` }
    ];
    
    for (const endpoint of endpoints) {
      try {
        console.log(`🔍 Testando ${endpoint.method} ${endpoint.url}`);
        
        const response = await fetch(`https://talentlink-wd88.onrender.com${endpoint.url}`, {
          method: endpoint.method,
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(testData)
        });
        
        console.log(`${endpoint.method} ${endpoint.url}: ${response.status} ${response.statusText}`);
        
        if (response.ok) {
          console.log(`✅ Endpoint funcionando: ${endpoint.method} ${endpoint.url}`);
          return endpoint;
        }
      } catch (error) {
        console.log(`❌ Erro no endpoint ${endpoint.method} ${endpoint.url}:`, error);
      }
    }
    
    return null;
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="flex flex-col items-center space-y-4">
          <Loader2 className="h-12 w-12 animate-spin text-blue-500" />
          <p className="text-gray-300">Carregando dados da vaga...</p>
        </div>
      </div>
    );
  }

  if (error && !initialJobData) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="bg-red-500/10 border border-red-500 rounded-lg p-4 mb-6">
          <p className="text-red-400 text-center">{error}</p>
        </div>
        <div className="text-center">
          <button
            onClick={handleBack}
            className="btn btn-outline"
          >
            ← Voltar para Gerenciar Vagas
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center space-x-4">
          <button
            onClick={handleBack}
            className="p-2 hover:bg-gray-700 rounded-lg transition-colors"
          >
            <ArrowLeft className="h-5 w-5 text-gray-400" />
          </button>
          <div>
            <h1 className="text-3xl font-bold text-white">Editar Vaga</h1>
            <p className="text-gray-400 mt-1">
              {initialJobData ? `Editando: ${initialJobData.title}` : 'Modificar detalhes da oportunidade'}
            </p>
            {id && (
              <p className="text-gray-500 text-sm mt-1">ID: {id}</p>
            )}
          </div>
        </div>
      </div>

      {error && (
        <div className="bg-red-500/10 border border-red-500 rounded-lg p-4 mb-6">
          <p className="text-red-400 mb-3">{error}</p>
          {error.includes('não encontrada') && (
            <div className="flex gap-3">
              <button
                onClick={() => {
                  setError(null);
                  if (id) loadJobData();
                }}
                className="btn btn-outline text-sm"
              >
                Tentar Recarregar
              </button>
              <button
                onClick={handleBack}
                className="btn btn-secondary text-sm"
              >
                Voltar para Lista
              </button>
            </div>
          )}
          {!error.includes('não encontrada') && (
            <div className="flex gap-3">
              <button
                onClick={testApiEndpoints}
                className="btn btn-outline text-sm"
              >
                🧪 Testar Endpoints
              </button>
              <button
                onClick={handleBack}
                className="btn btn-secondary text-sm"
              >
                Voltar para Lista
              </button>
            </div>
          )}
        </div>
      )}

      {dataLoaded && !error && (
        <div className="bg-green-500/10 border border-green-500 rounded-lg p-4 mb-6">
          <p className="text-green-400">✓ Dados da vaga carregados com sucesso</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="card p-6">
          <h2 className="text-xl font-semibold text-white mb-6">Informações Básicas</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-1 gap-6">
            {/* Título */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Título da Vaga *
              </label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                required
                className="form-input w-full"
                placeholder="Ex: Desenvolvedor Full Stack"
              />
            </div>

            {/* Localização */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Localização *
              </label>
              <input
                type="text"
                name="location"
                value={formData.location}
                onChange={handleInputChange}
                required
                className="form-input w-full"
                placeholder="Ex: São Paulo, SP - Híbrido"
              />
            </div>
          </div>

          {/* Descrição */}
          <div className="mt-6">
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Descrição da Vaga *
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              required
              rows={5}
              className="form-input w-full"
              placeholder="Descreva a vaga, responsabilidades e o que a empresa oferece..."
            />
          </div>

          {/* Requisitos */}
          <div className="mt-6">
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Requisitos
            </label>
            <div className="space-y-2">
              {formData.requirements
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
                        setFormData((prev) => ({ ...prev, requirements: newReqs }));
                      }}
                    >
                      Remover
                    </button>
                  </div>
                ))}

              <AddRequirementInput
                onAdd={(newReq) => {
                  if (newReq.trim()) {
                    setFormData((prev) => ({
                      ...prev,
                      requirements: prev.requirements
                        ? `${prev.requirements}\n${newReq.trim()}`
                        : newReq.trim(),
                    }));
                  }
                }}
              />
            </div>
          </div>

          {/* Benefícios */}
          <div className="mt-6">
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Benefícios
            </label>
            <div className="space-y-2">
              {formData.benefits
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
                        setFormData((prev) => ({ ...prev, benefits: newBenefits }));
                      }}
                    >
                      Remover
                    </button>
                  </div>
                ))}
              <AddBenefitInput
                onAdd={(newBenefit) => {
                  if (newBenefit.trim()) {
                    setFormData((prev) => ({
                      ...prev,
                      benefits: prev.benefits
                        ? `${prev.benefits}\n${newBenefit.trim()}`
                        : newBenefit.trim(),
                    }));
                  }
                }}
              />
            </div>
          </div>
        </div>

        {/* Botões */}
        <div className="flex space-x-4">
          <button
            type="submit"
            disabled={saving}
            className="btn btn-primary flex items-center justify-center min-w-[140px]"
          >
            {saving ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
                Salvando...
              </>
            ) : (
              <>
                <Save className="h-4 w-4 mr-2" />
                Salvar Alterações
              </>
            )}
          </button>
          
          <button
            type="button"
            onClick={handleBack}
            className="btn btn-outline"
          >
            Cancelar
          </button>
        </div>
      </form>

      {/* Debug: Mostra dados originais para referência
      {initialJobData && (
        <div className="mt-8 p-4 bg-gray-800 rounded-lg">
          <h3 className="text-lg font-medium text-white mb-2">Dados Originais (Debug):</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-gray-300"><strong>Title:</strong> {initialJobData.title}</p>
              <p className="text-gray-300"><strong>Description:</strong> {initialJobData.description}</p>
              <p className="text-gray-300"><strong>Location:</strong> {initialJobData.location}</p>
            </div>
            <div>
              <div className="mb-2">
                <p className="text-gray-300"><strong>Requirements (tipo: {typeof initialJobData.requirements}):</strong></p>
                <pre className="text-gray-400 text-xs mt-1 bg-gray-900 p-2 rounded overflow-auto">
                  {JSON.stringify(initialJobData.requirements, null, 2)}
                </pre>
              </div>
              <div>
                <p className="text-gray-300"><strong>Benefits (tipo: {typeof initialJobData.benefits}):</strong></p>
                <pre className="text-gray-400 text-xs mt-1 bg-gray-900 p-2 rounded overflow-auto">
                  {JSON.stringify(initialJobData.benefits, null, 2)}
                </pre>
              </div>
            </div>
          </div>
        </div>
      )} */}
    </div>
  );
};

// Componente para adicionar requisitos
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

// Componente para adicionar benefícios
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

export default EditJob;
