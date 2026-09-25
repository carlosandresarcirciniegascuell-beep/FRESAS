import React, { useState } from 'react';
import { GitCommitRecord, CloudSystemStatus } from '../types';
import { 
  X, 
  GitBranch, 
  GitCommit, 
  CloudLightning, 
  Cpu, 
  Database, 
  Activity, 
  ShieldCheck, 
  Server, 
  ArrowUpRight,
  Terminal,
  CheckCircle2
} from 'lucide-react';

interface DevOpsPipelineModalProps {
  isOpen: boolean;
  onClose: () => void;
  commits: GitCommitRecord[];
  cloudStatus: CloudSystemStatus;
  onTriggerWebhookSync: () => void;
}

export const DevOpsPipelineModal: React.FC<DevOpsPipelineModalProps> = ({
  isOpen,
  onClose,
  commits,
  cloudStatus,
  onTriggerWebhookSync,
}) => {
  const [isSimulatingLoad, setIsSimulatingLoad] = useState(false);
  const [loadSimulatedSuccess, setLoadSimulatedSuccess] = useState(false);

  if (!isOpen) return null;

  const handleSimulateHighVolumeLoad = () => {
    setIsSimulatingLoad(true);
    setLoadSimulatedSuccess(false);

    setTimeout(() => {
      setIsSimulatingLoad(false);
      setLoadSimulatedSuccess(true);
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-4xl my-8 bg-stone-900 border border-stone-800 rounded-2xl shadow-2xl overflow-hidden text-left flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-6 border-b border-stone-800 flex items-center justify-between bg-stone-950/70">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-sky-500/10 border border-sky-500/20 flex items-center justify-center text-sky-400">
              <CloudLightning className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-semibold text-white">Pipeline GitHub & Cloud Run</h3>
                <span className="text-[11px] font-mono bg-emerald-950 text-emerald-400 border border-emerald-800/80 px-2 py-0.5 rounded">
                  CI/CD Automatizado
                </span>
              </div>
              <p className="text-xs text-stone-400 mt-0.5">
                Sincronización en tiempo real de inventario, escalabilidad elástica y commits automáticos
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-stone-400 hover:text-white rounded-lg hover:bg-stone-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto space-y-6 text-xs flex-1">
          {/* Top Cloud Metrics Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="p-3.5 bg-stone-950 border border-stone-800 rounded-xl">
              <div className="flex items-center justify-between text-stone-400 mb-1">
                <span>Disponibilidad SLA</span>
                <Activity className="w-3.5 h-3.5 text-emerald-400" />
              </div>
              <span className="text-lg font-mono font-bold text-white tabular-nums">99.99%</span>
              <p className="text-[10px] text-stone-500 mt-0.5">Multi-Region Failover</p>
            </div>

            <div className="p-3.5 bg-stone-950 border border-stone-800 rounded-xl">
              <div className="flex items-center justify-between text-stone-400 mb-1">
                <span>Latencia Media</span>
                <Cpu className="w-3.5 h-3.5 text-sky-400" />
              </div>
              <span className="text-lg font-mono font-bold text-sky-400 tabular-nums">18 ms</span>
              <p className="text-[10px] text-stone-500 mt-0.5">Edge CDN Cloudflare</p>
            </div>

            <div className="p-3.5 bg-stone-950 border border-stone-800 rounded-xl">
              <div className="flex items-center justify-between text-stone-400 mb-1">
                <span>Capacidad Pico</span>
                <Server className="w-3.5 h-3.5 text-amber-400" />
              </div>
              <span className="text-lg font-mono font-bold text-amber-400 tabular-nums">15k req/s</span>
              <p className="text-[10px] text-stone-500 mt-0.5">Alto Volumen de Ventas</p>
            </div>

            <div className="p-3.5 bg-stone-950 border border-stone-800 rounded-xl">
              <div className="flex items-center justify-between text-stone-400 mb-1">
                <span>Base de Datos</span>
                <Database className="w-3.5 h-3.5 text-rose-400" />
              </div>
              <span className="text-lg font-mono font-bold text-emerald-400 tabular-nums">Sincronizada</span>
              <p className="text-[10px] text-stone-500 mt-0.5">ACID Compliance</p>
            </div>
          </div>

          {/* Stress test simulator banner */}
          <div className="p-4 rounded-xl bg-gradient-to-r from-stone-950 via-stone-900 to-stone-950 border border-stone-800 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              <h4 className="text-sm font-semibold text-white flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span>Simulador de Resiliencia ante Tráfico Masivo</span>
              </h4>
              <p className="text-xs text-stone-400 mt-0.5">
                Comprueba la escalabilidad elástica y respuesta del cluster ante ráfagas de 10.000 clientes concurrentes.
              </p>
            </div>
            <button
              onClick={handleSimulateHighVolumeLoad}
              disabled={isSimulatingLoad}
              className="px-4 py-2 bg-stone-800 hover:bg-stone-700 text-stone-200 text-xs font-semibold rounded-xl border border-stone-700 transition-colors flex items-center gap-2 cursor-pointer shrink-0 disabled:opacity-50"
            >
              {isSimulatingLoad ? (
                <span>Ejecutando Stress Test...</span>
              ) : (
                <span>Ejecutar Test de Carga</span>
              )}
            </button>
          </div>

          {loadSimulatedSuccess && (
            <div className="p-3 bg-emerald-950/40 border border-emerald-800/80 rounded-xl text-emerald-300 text-xs flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>
                Prueba de estrés aprobada: 0 paquetes perdidos · Auto-scaling instanció +4 réplicas en 450ms.
              </span>
            </div>
          )}

          {/* Real-time GitHub Commit Logs */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider text-stone-400 flex items-center gap-2">
                <GitBranch className="w-3.5 h-3.5 text-stone-400" />
                <span>Historial de Commits Automatizados (Branch: main)</span>
              </span>
              <button
                onClick={onTriggerWebhookSync}
                className="text-xs text-rose-400 hover:text-rose-300 transition-colors cursor-pointer"
              >
                Disparar Webhook Manual
              </button>
            </div>

            <div className="space-y-2 border border-stone-800 rounded-xl bg-stone-950 p-3 divide-y divide-stone-800/60 font-mono">
              {commits.map(commit => (
                <div key={commit.id} className="pt-2 first:pt-0 flex items-start justify-between gap-3 text-xs">
                  <div className="flex items-start gap-2.5 min-w-0">
                    <GitCommit className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    <div className="min-w-0">
                      <p className="text-stone-200 truncate font-sans font-medium">{commit.message}</p>
                      <div className="flex items-center gap-2 text-[11px] text-stone-500 mt-0.5">
                        <span className="text-stone-400">{commit.author}</span>
                        <span>·</span>
                        <span>{commit.timestamp}</span>
                      </div>
                    </div>
                  </div>
                  <span className="px-2 py-0.5 bg-stone-900 border border-stone-800 rounded text-stone-400 text-[11px] shrink-0">
                    {commit.hash}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Cloud Run Service Details */}
          <div className="p-4 bg-stone-950 border border-stone-800 rounded-xl space-y-2 font-mono text-[11px] text-stone-400">
            <div className="flex items-center gap-2 text-stone-300 font-semibold mb-1 font-sans">
              <Terminal className="w-3.5 h-3.5 text-sky-400" />
              <span>Configuración del Cluster en la Nube</span>
            </div>
            <div className="flex justify-between">
              <span>Cloud Provider:</span>
              <span className="text-stone-200">{cloudStatus.cloudProvider}</span>
            </div>
            <div className="flex justify-between">
              <span>Environment:</span>
              <span className="text-stone-200">{cloudStatus.environment}</span>
            </div>
            <div className="flex justify-between">
              <span>Contenedores Activos:</span>
              <span className="text-emerald-400 font-bold">{cloudStatus.activeNodes} pods (min: 2, max: 120)</span>
            </div>
            <div className="flex justify-between">
              <span>Último Despliegue:</span>
              <span className="text-stone-200">{cloudStatus.lastDeployTime}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
