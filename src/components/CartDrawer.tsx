import React from 'react';
import { CartItem, UserProfile } from '../types';
import { 
  X, 
  Trash2, 
  Plus, 
  Minus, 
  ShoppingBag, 
  ShieldCheck, 
  ShieldAlert, 
  ArrowRight,
  Sparkles
} from 'lucide-react';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  currentUser: UserProfile;
  onUpdateQuantity: (id: string, delta: number) => void;
  onRemoveItem: (id: string) => void;
  onCheckout: () => void;
  onOpenVerification: () => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({
  isOpen,
  onClose,
  items,
  currentUser,
  onUpdateQuantity,
  onRemoveItem,
  onCheckout,
  onOpenVerification,
}) => {
  if (!isOpen) return null;

  const subtotal = items.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const deliveryFee = subtotal >= 40000 || subtotal === 0 ? 0 : 5000;
  const total = subtotal + deliveryFee;

  const handleCheckoutClick = () => {
    if (!currentUser.isVerified) {
      onOpenVerification();
    } else {
      onCheckout();
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/70 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-stone-900 border-l border-stone-800 text-left flex flex-col shadow-2xl">
          {/* Header */}
          <div className="p-5 border-b border-stone-800 flex items-center justify-between bg-stone-950/60">
            <div className="flex items-center gap-2.5">
              <ShoppingBag className="w-5 h-5 text-rose-500" />
              <h2 className="text-base font-semibold text-white">Bolsa de Pedidos</h2>
              <span className="text-xs font-mono text-stone-400">
                ({items.reduce((a, b) => a + b.quantity, 0)})
              </span>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 text-stone-400 hover:text-white rounded-lg hover:bg-stone-800 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* User Verification Status Header Pill */}
          <div className="px-5 py-2.5 bg-stone-950/40 border-b border-stone-800/80 flex items-center justify-between text-xs">
            <span className="text-stone-400">Estado de Seguridad:</span>
            {currentUser.isVerified ? (
              <span className="flex items-center gap-1.5 text-emerald-400 font-medium">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Cuenta Verificada · KYC OK</span>
              </span>
            ) : (
              <button
                onClick={onOpenVerification}
                className="flex items-center gap-1.5 text-amber-400 hover:text-amber-300 font-medium underline cursor-pointer"
              >
                <ShieldAlert className="w-3.5 h-3.5" />
                <span>Verificar para pagar</span>
              </button>
            )}
          </div>

          {/* Items List */}
          <div className="flex-1 overflow-y-auto p-5 space-y-4">
            {items.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center py-12 text-stone-500">
                <ShoppingBag className="w-12 h-12 stroke-[1.2] mb-3 text-stone-600" />
                <p className="text-sm font-medium text-stone-300">Tu bolsa está vacía</p>
                <p className="text-xs text-stone-500 mt-1 max-w-xs">
                  Explora nuestro catálogo gourmet o diseña tu creación 3D para agregarla aquí.
                </p>
              </div>
            ) : (
              items.map(item => (
                <div
                  key={item.id}
                  className="p-3.5 rounded-xl bg-stone-950/60 border border-stone-800/80 flex gap-3 text-xs"
                >
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-16 h-16 rounded-lg object-cover shrink-0 border border-stone-800"
                    referrerPolicy="no-referrer"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-start">
                      <h4 className="font-semibold text-stone-200 truncate pr-2">{item.name}</h4>
                      <button
                        onClick={() => onRemoveItem(item.id)}
                        className="text-stone-500 hover:text-rose-400 transition-colors p-0.5 cursor-pointer"
                        title="Eliminar"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    {item.customization && (
                      <div className="text-[11px] text-stone-400 mt-1 space-y-0.5">
                        <p className="truncate">Crema: {item.customization.cream}</p>
                        {item.customization.toppings.length > 0 && (
                          <p className="truncate text-amber-300/90">
                            Toppings: {item.customization.toppings.join(', ')}
                          </p>
                        )}
                        {item.customization.specialNotes && (
                          <p className="truncate italic text-stone-500">"{item.customization.specialNotes}"</p>
                        )}
                      </div>
                    )}

                    <div className="flex justify-between items-center mt-2.5">
                      <span className="font-mono font-medium text-rose-300 tabular-nums">
                        ${(item.price * item.quantity).toLocaleString('es-CO')}
                      </span>

                      {/* Quantity Stepper */}
                      <div className="flex items-center gap-1.5 bg-stone-900 border border-stone-800 rounded-lg p-0.5">
                        <button
                          onClick={() => onUpdateQuantity(item.id, -1)}
                          className="w-5 h-5 flex items-center justify-center text-stone-400 hover:text-white rounded transition-colors cursor-pointer"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="font-mono text-xs w-5 text-center text-stone-200">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => onUpdateQuantity(item.id, 1)}
                          className="w-5 h-5 flex items-center justify-center text-stone-400 hover:text-white rounded transition-colors cursor-pointer"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer & Checkout Action */}
          {items.length > 0 && (
            <div className="p-5 border-t border-stone-800 bg-stone-950/80 space-y-3">
              <div className="space-y-1.5 text-xs">
                <div className="flex justify-between text-stone-400">
                  <span>Subtotal</span>
                  <span className="font-mono tabular-nums">${subtotal.toLocaleString('es-CO')} COP</span>
                </div>
                <div className="flex justify-between text-stone-400">
                  <span>Envío refrigerado exprés</span>
                  <span className="font-mono tabular-nums">
                    {deliveryFee === 0 ? (
                      <span className="text-emerald-400">GRATIS</span>
                    ) : (
                      `$${deliveryFee.toLocaleString('es-CO')} COP`
                    )}
                  </span>
                </div>
                {subtotal < 40000 && (
                  <p className="text-[11px] text-stone-500">
                    Agrega ${(40000 - subtotal).toLocaleString('es-CO')} más para envío gratis.
                  </p>
                )}
                <div className="flex justify-between text-sm font-semibold text-white pt-2 border-t border-stone-800">
                  <span>Total a Pagar</span>
                  <span className="font-mono text-base text-rose-400 tabular-nums">
                    ${total.toLocaleString('es-CO')} COP
                  </span>
                </div>
              </div>

              {!currentUser.isVerified && (
                <div className="p-2.5 rounded-lg bg-amber-500/10 border border-amber-500/20 text-[11px] text-amber-300 flex items-center gap-2">
                  <ShieldAlert className="w-4 h-4 text-amber-400 shrink-0" />
                  <span>Requiere verificación de identidad antes de procesar el pago.</span>
                </div>
              )}

              <button
                onClick={handleCheckoutClick}
                className={`w-full py-3.5 rounded-xl font-semibold text-xs transition-all flex items-center justify-center gap-2 cursor-pointer shadow-lg ${
                  currentUser.isVerified
                    ? 'bg-rose-600 hover:bg-rose-500 text-white shadow-rose-900/30'
                    : 'bg-amber-600 hover:bg-amber-500 text-stone-950 font-bold'
                }`}
              >
                {currentUser.isVerified ? (
                  <>
                    <ShieldCheck className="w-4 h-4" />
                    <span>Completar Transacción Segura</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                ) : (
                  <>
                    <ShieldAlert className="w-4 h-4" />
                    <span>Verificar Identidad & Pagar</span>
                  </>
                )}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
