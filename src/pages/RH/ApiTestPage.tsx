import { useState } from 'react';
import { AlertCircle, CheckCircle, RefreshCw, Zap } from 'lucide-react';
import talentBankService from '../../services/talentBankService';

const ApiTestPage = () => {
  const [isTestingConnection, setIsTestingConnection] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [isTestingEndpoint, setIsTestingEndpoint] = useState(false);
  const [endpointResults, setEndpointResults] = useState<any>(null);
  const [logs, setLogs] = useState<string[]>([]);

  const addLog = (message: string) => {
    const timestamp = new Date().toLocaleTimeString();
    setLogs(prev => [...prev, `[${timestamp}] ${message}`]);
  };

  const testConnection = async () => {
    setIsTestingConnection(true);
    setConnectionStatus('idle');
    addLog('Iniciando teste de conexão...');
    
    try {
      const isConnected = await talentBankService.testConnection();
      
      if (isConnected) {
        setConnectionStatus('success');
        addLog('✅ Conexão com backend estabelecida com sucesso!');
      } else {
        setConnectionStatus('error');
        addLog('❌ Falha na conexão com backend');
      }
    } catch (error) {
      setConnectionStatus('error');
      addLog(`❌ Erro na conexão: ${error}`);
    } finally {
      setIsTestingConnection(false);
    }
  };

  const testCandidatesEndpoint = async () => {
    setIsTestingEndpoint(true);
    setEndpointResults(null);
    addLog('Testando endpoint /talents/candidates...');
    
    try {
      const result = await talentBankService.getAllCandidates({ 
        page: 1, 
        limit: 5 
      });
      
      setEndpointResults(result);
      addLog(`✅ Endpoint funcionando! Encontrados ${result.total} candidatos.`);
    } catch (error) {
      addLog(`❌ Erro no endpoint: ${error}`);
      setEndpointResults({ error: error instanceof Error ? error.message : 'Erro desconhecido' });
    } finally {
      setIsTestingEndpoint(false);
    }
  };

  const clearLogs = () => {
    setLogs([]);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-white">Teste de API - Banco de Talentos</h1>
        <p className="text-dark-300 mt-1">
          Ferramenta para diagnosticar problemas de conectividade com o backend
        </p>
      </div>

      {/* Connection Test */}
      <div className="card p-6">
        <h2 className="text-xl font-semibold text-white mb-4 flex items-center">
          <Zap className="mr-2" size={20} />
          Teste de Conectividade
        </h2>
        
        <div className="flex items-center gap-4 mb-4">
          <button
            onClick={testConnection}
            disabled={isTestingConnection}
            className="btn btn-primary flex items-center"
          >
            <RefreshCw className={`mr-2 ${isTestingConnection ? 'animate-spin' : ''}`} size={18} />
            {isTestingConnection ? 'Testando...' : 'Testar Conexão'}
          </button>

          {connectionStatus === 'success' && (
            <div className="flex items-center text-green-500">
              <CheckCircle size={20} className="mr-2" />
              <span>Conectado!</span>
            </div>
          )}

          {connectionStatus === 'error' && (
            <div className="flex items-center text-red-500">
              <AlertCircle size={20} className="mr-2" />
              <span>Erro na conexão</span>
            </div>
          )}
        </div>

        <div className="text-sm text-dark-300">
          <p><strong>URL do Backend:</strong> https://talentlink-wd88.onrender.com</p>
          <p><strong>Endpoint Health:</strong> /health</p>
        </div>
      </div>

      {/* Endpoint Test */}
      <div className="card p-6">
        <h2 className="text-xl font-semibold text-white mb-4">
          Teste de Endpoints
        </h2>
        
        <button
          onClick={testCandidatesEndpoint}
          disabled={isTestingEndpoint}
          className="btn btn-outline flex items-center mb-4"
        >
          <RefreshCw className={`mr-2 ${isTestingEndpoint ? 'animate-spin' : ''}`} size={18} />
          {isTestingEndpoint ? 'Testando...' : 'Testar /talents/candidates'}
        </button>

        {endpointResults && (
          <div className="bg-dark-800 p-4 rounded-lg">
            <h3 className="text-white font-medium mb-2">Resultado:</h3>
            <pre className="text-sm text-dark-200 overflow-x-auto">
              {JSON.stringify(endpointResults, null, 2)}
            </pre>
          </div>
        )}
      </div>

      {/* Logs */}
      <div className="card p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-white">
            Logs de Debug
          </h2>
          <button
            onClick={clearLogs}
            className="btn btn-outline btn-sm"
          >
            Limpar Logs
          </button>
        </div>
        
        <div className="bg-dark-900 p-4 rounded-lg max-h-64 overflow-y-auto">
          {logs.length === 0 ? (
            <p className="text-dark-400 text-sm">Nenhum log ainda...</p>
          ) : (
            <div className="space-y-1">
              {logs.map((log, index) => (
                <div key={index} className="text-sm font-mono text-dark-200">
                  {log}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Debug Info */}
      <div className="card p-6">
        <h2 className="text-xl font-semibold text-white mb-4">
          Informações de Debug
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div>
            <h3 className="text-white font-medium mb-2">Token de Autenticação:</h3>
            <p className="text-dark-300 font-mono break-all">
              {localStorage.getItem('token') ? 
                `${localStorage.getItem('token')?.substring(0, 20)}...` : 
                'Nenhum token encontrado'
              }
            </p>
          </div>
          
          <div>
            <h3 className="text-white font-medium mb-2">User Agent:</h3>
            <p className="text-dark-300 font-mono text-xs break-all">
              {navigator.userAgent}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ApiTestPage;
