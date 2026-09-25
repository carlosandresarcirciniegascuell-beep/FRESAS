import React from 'react';
import { Instagram, MessageCircle, ShieldCheck, Heart } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="border-t border-stone-800 bg-stone-950 text-stone-400 text-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-10 text-left">
          {/* Col 1: Brand */}
          <div className="md:col-span-2 space-y-3">
            <span className="text-xl font-display font-semibold text-white tracking-tight">
              Sweet Berry
            </span>
            <p className="text-stone-400 text-xs max-w-sm leading-relaxed">
              Fresas con crema para endulzar tus momentos. Emprendimiento dedicado a la alta repostería artesanal, con tecnología de inventario en tiempo real y transacciones verificadas.
            </p>
            <div className="flex items-center gap-2 text-[11px] text-stone-500 pt-1">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span>Transacciones seguras cifradas con verificación de identidad KYC</span>
            </div>
          </div>

          {/* Col 2: Enlaces Rápidos */}
          <div className="space-y-2.5">
            <span className="text-xs font-semibold uppercase tracking-wider text-stone-300 block mb-2">
              Navegación
            </span>
            <ul className="space-y-2">
              <li>
                <a href="#catalogo" className="hover:text-white transition-colors">
                  Catálogo de Productos
                </a>
              </li>
              <li>
                <a href="#customizer-3d" className="hover:text-white transition-colors">
                  Diseño 3D Personalizado
                </a>
              </li>
              <li>
                <a href="#conocenos" className="hover:text-white transition-colors">
                  Conócenos & Emprendimiento
                </a>
              </li>
            </ul>
          </div>

          {/* Col 3: Canales Oficiales from PDF */}
          <div className="space-y-2.5">
            <span className="text-xs font-semibold uppercase tracking-wider text-stone-300 block mb-2">
              Contacto & Redes
            </span>
            <ul className="space-y-2.5">
              <li>
                <a
                  href="https://wa.me/573128492011"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-stone-300 hover:text-emerald-400 transition-colors"
                >
                  <MessageCircle className="w-4 h-4 text-emerald-400" />
                  <span>WhatsApp: +57 312 849 2011</span>
                </a>
              </li>
              <li>
                <a
                  href="https://instagram.com/sweetberry"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-stone-300 hover:text-rose-400 transition-colors"
                >
                  <Instagram className="w-4 h-4 text-rose-400" />
                  <span>Instagram: @sweetberry</span>
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom copyright */}
        <div className="pt-8 border-t border-stone-800/80 flex flex-col sm:flex-row items-center justify-between gap-4 text-stone-500 text-[11px]">
          <div>
            © {new Date().getFullYear()} Sweet Berry Gourmet S.A.S. Todos los derechos reservados.
          </div>
          <div className="flex items-center gap-1">
            <span>Elaborado con amor por las fresas y la frescura</span>
            <Heart className="w-3 h-3 text-rose-500 fill-current inline" />
          </div>
        </div>
      </div>
    </footer>
  );
};
