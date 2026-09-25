import React, { useState } from 'react';
import { extractInvoiceDataWithAI } from '../services/geminiService';
import { SAMPLE_INVOICES } from '../data/initialData';
import { Product, InvoiceExtractionResult, GitCommitRecord } from '../types';
import { 
  X, 
  Upload, 
  Sparkles, 
  CheckCircle2, 
  FileText, 
  GitCommit, 
  CloudLightning, 
  ArrowRight,
  RefreshCw,
  Cpu
} from 'lucide-react';

interface AIInvoiceScannerModalProps {
  isOpen: boolean;
  onClose: () => void;
  products: Product[];
  onApplyInventoryUpdate: (
    extraction: InvoiceExtractionResult, 
    newCommit: GitCommitRecord
  ) => void;
}

export const AIInvoiceScannerModal: React.FC<AIInvoiceScannerModalProps> = ({
  isOpen,
  onClose,
  products,
  onApplyInventoryUpdate,
}) => {
  const [selectedSample, setSelectedSample] = useState(SAMPLE_INVOICES[0].id);
  const [rawText, setRawText] = useState(SAMPLE_INVOICES[0].content);
  const [isProcessing, setIsProcessing] = useState(false);
  const [result, setResult] = useState<InvoiceExtractionResult | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isApplied, setIsApplied] = useState(false);

  if (!isOpen) return null;

  const handleSelectSample = (sampleId: string) => {
    setSelectedSample(sampleId);
    const found = SAMPLE_INVOICES.find(s => s.id === sampleId);
    if (found) {
      setRawText(found.content);
      setResult(null);
      setIsApplied(false);
    }
  };

  const handleProcessWithAI = async () => {
    if (!rawText.trim()) return;
    setIsProcessing(true);
    setErrorMsg(null);
    setIsApplied(false);

    try {
      const extracted = await extractInvoiceDataWithAI(
        rawText,
        selectedSample === 'inv-valle' ? 'factura_fresas_valle.pdf' : 'catalogo_toppings_suisse.pdf'
      );
      setResult(extracted);
    } catch (err) {
      console.error(err);
      setErrorMsg('Ocurrió una interrupción procesando el documento. Intenta nuevamente.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleApplyToInventory = () => {
    if (!result) return;

    // Create an automated git commit record for the pipeline
    const commitRecord: GitCommitRecord = {
      id: `commit-${Date.now()}`,
      hash: Math.random().toString(16).substring(2, 9),
      message: `feat(inventory): auto-sync ${result.items.reduce((a, b) => a + b.quantityAdded, 0)} units via Gemini AI from ${result.invoiceNumber}`,
      author: 'sweet-berry-ai-pipeline[bot]',
      timestamp: 'Justo ahora',
      branch: 'main',
      status: 'synced',
    };

    onApplyInventoryUpdate(result, commitRecord);
    setIsApplied(true);
    setTimeout(() => {
      onClose();
    }, 1800);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-4xl my-8 bg-stone-900 border border-stone-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="px-6 py-5 border-b border-stone-800 flex items-center justify-between bg-stone-950/60">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-rose-500">
              <Cpu className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-semibold text-white">Extractor de Inventario IA</h3>
                <span className="text-[11px] font-mono bg-rose-950/80 text-rose-300 border border-rose-800/60 px-2 py-0.5 rounded">
                  Gemini 3.8 Flash
                </span>
              </div>
              <p className="text-xs text-stone-400 mt-0.5">
                Procesamiento de facturas, albaranes y catálogos con sincronización en tiempo real
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

        {/* Content body */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1 text-left">
          {/* Sample quick selectors */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-stone-400 mb-2">
              Seleccionar Documento de Prueba o Cargar Personalizado
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {SAMPLE_INVOICES.map(sample => (
                <button
                  key={sample.id}
                  onClick={() => handleSelectSample(sample.id)}
                  className={`p-3 text-left rounded-xl border transition-all cursor-pointer ${
                    selectedSample === sample.id
                      ? 'border-rose-500/80 bg-rose-500/10 text-white'
                      : 'border-stone-800 bg-stone-950/40 text-stone-400 hover:border-stone-700'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <FileText className="w-4 h-4 text-rose-400 shrink-0" />
                    <span className="text-xs font-medium truncate">{sample.label}</span>
                  </div>
                  <span className="text-[11px] text-stone-500 block mt-1">
                    {sample.type === 'invoice' ? 'Factura electrónica proveedor' : 'Catálogo insumos gourmet'}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Textarea for invoice content */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-semibold uppercase tracking-wider text-stone-400">
                Contenido del Documento / Factura
              </label>
              <span className="text-xs text-stone-500">Puedes editar o pegar texto libre</span>
            </div>
            <textarea
              rows={6}
              value={rawText}
              onChange={e => {
                setRawText(e.target.value);
                setResult(null);
                setIsApplied(false);
              }}
              className="w-full font-mono text-xs bg-stone-950 border border-stone-800 rounded-xl p-3.5 text-stone-300 focus:outline-none focus:border-rose-500 leading-relaxed resize-none"
              placeholder="Pega aquí el contenido de la factura o albarán..."
            />
          </div>

          {/* Process Button */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3 text-xs text-stone-400">
              <span className="flex items-center gap-1.5">
                <GitCommit className="w-3.5 h-3.5 text-emerald-400" />
                Auto-Commit GitHub
              </span>
              <span>·</span>
              <span className="flex items-center gap-1.5">
                <CloudLightning className="w-3.5 h-3.5 text-sky-400" />
                Despliegue Cloud en Vivo
              </span>
            </div>

            <button
              onClick={handleProcessWithAI}
              disabled={isProcessing || !rawText.trim()}
              className="px-5 py-2.5 bg-rose-600 hover:bg-rose-500 disabled:opacity-50 text-white text-xs font-semibold rounded-xl transition-all flex items-center gap-2 cursor-pointer shadow-lg shadow-rose-950/40"
            >
              {isProcessing ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Procesando con Gemini AI...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>Extraer Datos con IA</span>
                </>
              )}
            </button>
          </div>

          {errorMsg && (
            <div className="p-3 rounded-lg bg-rose-950/40 border border-rose-800 text-rose-300 text-xs">
              {errorMsg}
            </div>
          )}

          {/* Extraction Result Showcase */}
          {result && (
            <div className="space-y-4 pt-4 border-t border-stone-800/80">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-semibold text-white flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    <span>Datos Extraídos con Éxito</span>
                  </h4>
                  <p className="text-xs text-stone-400 mt-0.5">
                    Proveedor: <strong className="text-stone-200">{result.supplierName}</strong> · Factura: <strong className="text-stone-200">{result.invoiceNumber}</strong> · Fecha: {result.date}
                  </p>
                </div>
                <div className="text-right">
                  <span className="text-[11px] text-stone-500 block">Total Compra</span>
                  <span className="text-sm font-mono font-bold text-amber-400 tabular-nums">
                    ${result.totalCost.toLocaleString('es-CO')} {result.currency}
                  </span>
                </div>
              </div>

              {/* Items Table */}
              <div className="border border-stone-800 rounded-xl overflow-hidden bg-stone-950/60">
                <table className="w-full text-left text-xs">
                  <thead className="bg-stone-900/80 text-stone-400 border-b border-stone-800">
                    <tr>
                      <th className="py-2.5 px-4 font-semibold">Producto Detectado</th>
                      <th className="py-2.5 px-3 font-semibold">Lote & Caducidad</th>
                      <th className="py-2.5 px-3 font-semibold text-center">Unidades +</th>
                      <th className="py-2.5 px-3 font-semibold text-right">Costo Unit.</th>
                      <th className="py-2.5 px-4 font-semibold text-right">Precio Venta</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-stone-800/50">
                    {result.items.map((item, idx) => (
                      <tr key={idx} className="hover:bg-stone-900/30 transition-colors">
                        <td className="py-2.5 px-4">
                          <span className="font-medium text-stone-200 block">{item.productName}</span>
                          <span className="text-[11px] text-stone-500">Confianza: {(item.confidenceScore * 100).toFixed(0)}%</span>
                        </td>
                        <td className="py-2.5 px-3 font-mono text-[11px] text-stone-400">
                          <div>{item.lotNumber}</div>
                          <div className="text-stone-500 text-[10px]">Exp: {item.expiryDate}</div>
                        </td>
                        <td className="py-2.5 px-3 font-mono font-bold text-emerald-400 text-center tabular-nums">
                          +{item.quantityAdded} u
                        </td>
                        <td className="py-2.5 px-3 font-mono text-stone-300 text-right tabular-nums">
                          ${item.unitCost.toLocaleString('es-CO')}
                        </td>
                        <td className="py-2.5 px-4 font-mono font-medium text-rose-300 text-right tabular-nums">
                          ${item.suggestedSalePrice.toLocaleString('es-CO')}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Action Banner */}
              <div className="p-4 rounded-xl bg-stone-950 border border-stone-800 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="text-xs text-stone-400 leading-relaxed">
                  Al sincronizar, se incrementará el stock en vivo de la tienda, se generará el commit en GitHub y se actualizarán las métricas de Cloud.
                </div>

                <button
                  onClick={handleApplyToInventory}
                  disabled={isApplied}
                  className={`w-full sm:w-auto px-5 py-2.5 rounded-xl text-xs font-semibold transition-all flex items-center justify-center gap-2 cursor-pointer ${
                    isApplied
                      ? 'bg-emerald-600 text-white'
                      : 'bg-emerald-500 hover:bg-emerald-400 text-stone-950 font-bold'
                  }`}
                >
                  {isApplied ? (
                    <>
                      <CheckCircle2 className="w-4 h-4" />
                      <span>¡Inventario y GitHub Actualizados!</span>
                    </>
                  ) : (
                    <>
                      <span>Sincronizar Inventario & GitHub</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
