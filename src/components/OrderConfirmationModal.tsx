import React, { useEffect } from 'react';
import { CartItem, UserProfile } from '../types';
import { 
  CheckCircle2, 
  X, 
  MessageCircle, 
  Download, 
  ShieldCheck, 
  Truck, 
  Clock, 
  Sparkles,
  ExternalLink
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface OrderConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  orderId: string;
  items: CartItem[];
  user: UserProfile;
  totalAmount: number;
}

export const OrderConfirmationModal: React.FC<OrderConfirmationModalProps> = ({
  isOpen,
  onClose,
  orderId,
  items,
  user,
  totalAmount,
}) => {
  useEffect(() => {
    if (isOpen) {
      try {
        confetti({
          particleCount: 80,
          spread: 80,
          origin: { y: 0.6 },
          colors: ['#e11d48', '#fb7185', '#f59e0b', '#10b981'],
        });
      } catch (e) {
        // Ignore
      }
    }
  }, [isOpen]);

  if (!isOpen) return null;

  // Build WhatsApp prefilled message
  const itemsText = items
    .map(i => `• ${i.quantity}x ${i.name} ($${(i.price * i.quantity).toLocaleString('es-CO')})`)
    .join('%0A');

  const waMessage = `¡Hola Sweet Berry Gourmet! 🍓%0AAcabo de confirmar mi pedido verificado:%0A%0A*Orden:* %23${orderId}%0A*Cliente:* ${encodeURIComponent(user.name)} (Verificado KYC)%0A*Tel:* ${encodeURIComponent(user.phone)}%0A*Dirección:* ${encodeURIComponent(user.address || 'Principal')}, ${encodeURIComponent(user.city || 'Bogotá')}%0A%0A*Artículos:*%0A${itemsText}%0A%0A*Total:* $${totalAmount.toLocaleString('es-CO')} COP%0A%0APor favor coordinar mi entrega refrigerada. ¡Muchas gracias!`;

  const waUrl = `https://wa.me/573128492011?text=${waMessage}`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-lg my-8 bg-stone-900 border border-stone-800 rounded-2xl shadow-2xl overflow-hidden text-left">
        {/* Header */}
        <div className="p-6 text-center border-b border-stone-800 bg-stone-950/70">
          <div className="w-14 h-14 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 flex items-center justify-center mx-auto mb-3">
            <CheckCircle2 className="w-8 h-8" />
          </div>
          <span className="text-[11px] font-mono text-emerald-400 bg-emerald-950/60 border border-emerald-800/60 px-2.5 py-0.5 rounded-full inline-block mb-1">
            Transacción 256-Bit Aprobada · Verificada
          </span>
          <h3 className="text-xl font-display font-medium text-white">¡Gracias por tu Pedido!</h3>
          <p className="text-xs text-stone-400 mt-1">
            Orden <span className="font-mono text-stone-200 font-semibold">#{orderId}</span>
          </p>
        </div>

        {/* Body receipt */}
        <div className="p-6 space-y-4 text-xs">
          {/* Customer verification status card */}
          <div className="p-3 bg-stone-950/80 border border-stone-800 rounded-xl flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <div>
                <p className="font-semibold text-stone-200">{user.name}</p>
                <p className="text-[11px] text-stone-500">{user.phone} · {user.address || 'Entrega a domicilio'}</p>
              </div>
            </div>
            <span className="text-[10px] uppercase font-mono text-emerald-400 bg-emerald-950 px-2 py-0.5 rounded border border-emerald-800/80">
              KYC Verificado
            </span>
          </div>

          {/* Delivery estimate */}
          <div className="grid grid-cols-2 gap-3">
            <div className="p-3 bg-stone-950/50 border border-stone-800/80 rounded-xl flex items-center gap-2.5">
              <Clock className="w-4 h-4 text-rose-400" />
              <div>
                <span className="text-[10px] text-stone-500 block">Tiempo Estimado</span>
                <span className="font-semibold text-stone-200">30 - 45 min</span>
              </div>
            </div>
            <div className="p-3 bg-stone-950/50 border border-stone-800/80 rounded-xl flex items-center gap-2.5">
              <Truck className="w-4 h-4 text-sky-400" />
              <div>
                <span className="text-[10px] text-stone-500 block">Transporte</span>
                <span className="font-semibold text-stone-200">Refrigerado 4°C</span>
              </div>
            </div>
          </div>

          {/* Items breakdown */}
          <div className="border border-stone-800 rounded-xl p-3 bg-stone-950/40 space-y-2">
            <span className="text-[11px] font-semibold uppercase text-stone-400 block border-b border-stone-800 pb-1.5">
              Resumen de Productos
            </span>
            {items.map(item => (
              <div key={item.id} className="flex justify-between items-start text-xs">
                <div className="text-stone-300">
                  <span>{item.quantity}x {item.name}</span>
                  {item.customization && (
                    <span className="block text-[10px] text-stone-500">
                      {item.customization.size} · {item.customization.cream}
                    </span>
                  )}
                </div>
                <span className="font-mono text-stone-300 tabular-nums">
                  ${(item.price * item.quantity).toLocaleString('es-CO')}
                </span>
              </div>
            ))}
            <div className="flex justify-between items-center font-semibold text-white pt-2 border-t border-stone-800">
              <span>Total Pagado</span>
              <span className="font-mono text-rose-400 text-sm tabular-nums">
                ${totalAmount.toLocaleString('es-CO')} COP
              </span>
            </div>
          </div>

          {/* WhatsApp dispatch CTA button */}
          <div className="pt-2 space-y-2.5">
            <a
              href={waUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-3.5 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs rounded-xl shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <MessageCircle className="w-4 h-4" />
              <span>Notificar Pedido en WhatsApp Sweet Berry</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>

            <button
              onClick={onClose}
              className="w-full py-2.5 bg-stone-800 hover:bg-stone-700 text-stone-300 font-medium text-xs rounded-xl transition-colors cursor-pointer"
            >
              Cerrar y Continuar en la Tienda
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
