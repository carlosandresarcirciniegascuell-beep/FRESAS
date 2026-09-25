import React from 'react';
import { ArrowRight, Sparkles, ShieldCheck, Cpu } from 'lucide-react';

interface HeroProps {
  onOpenAIScanner: () => void;
  onExploreCatalog: () => void;
}

export const Hero: React.FC<HeroProps> = ({ onOpenAIScanner, onExploreCatalog }) => {
  return (
    <section className="relative min-h-[88vh] flex items-center justify-center overflow-hidden">
      {/* Background Hero Image with measured scrim */}
      <div className="absolute inset-0 z-0">
        <img
          src="/src/assets/images/hero_gourmet_strawberries_cream_1790362457851.jpg"
          alt="Gourmet Strawberries and Cream Sweet Berry"
          className="w-full h-full object-cover object-center scale-105 transition-transform duration-1000 ease-out"
          referrerPolicy="no-referrer"
        />
        {/* Measured dark scrim for 4.5:1 WCAG AA text contrast */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#0c0a09] via-[#0c0a09]/80 to-[#0c0a09]/55" />
        <div className="absolute inset-0 bg-radial-gradient from-transparent via-[#0c0a09]/40 to-[#0c0a09]" />
      </div>

      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-24 text-center">
        {/* Subtle unboxed kicker with typographic separator */}
        <div className="flex items-center justify-center gap-2 text-xs sm:text-sm font-medium text-rose-300 tracking-wide uppercase mb-6">
          <span>Fresas Frescas</span>
          <span aria-hidden="true" className="text-rose-500">·</span>
          <span>Crema Artesanal</span>
          <span aria-hidden="true" className="text-rose-500">·</span>
          <span>Alta Repostería</span>
        </div>

        {/* Display Headline with text-wrap: balance */}
        <h1 className="text-4xl sm:text-6xl md:text-7xl font-display font-medium text-white tracking-tight leading-[1.08] text-balance max-w-4xl mx-auto">
          Fresas con crema para endulzar tus momentos más memorables.
        </h1>

        <p className="mt-6 text-base sm:text-lg md:text-xl text-stone-300 font-light max-w-2xl mx-auto leading-relaxed">
          Una propuesta culinaria fresca, deliciosa y de alta gama. Elaboradas con ingredientes de origen seleccionado, bañadas en crema sedosa y decoradas con toppings de autor.
        </p>

        {/* Action Buttons */}
        <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
          <button
            onClick={onExploreCatalog}
            className="w-full sm:w-auto px-8 py-4 bg-rose-600 hover:bg-rose-500 active:scale-[0.98] text-white font-semibold text-sm rounded-xl shadow-xl shadow-rose-950/60 transition-all flex items-center justify-center gap-2.5 cursor-pointer"
          >
            <span>Explorar Productos</span>
            <ArrowRight className="w-4 h-4" />
          </button>

          <a
            href="#customizer-3d"
            className="w-full sm:w-auto px-8 py-4 bg-stone-900/90 hover:bg-stone-800 text-stone-200 hover:text-white font-medium text-sm rounded-xl border border-stone-700/80 backdrop-blur-md transition-all flex items-center justify-center gap-2.5"
          >
            <Sparkles className="w-4 h-4 text-rose-400" />
            <span>Diseña tu Creación 3D</span>
          </a>
        </div>

        {/* AI & Security Trust Indicators */}
        <div className="mt-14 pt-8 border-t border-stone-800/60 flex flex-wrap items-center justify-center gap-6 sm:gap-10 text-xs text-stone-400">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>Verificación de Usuario & Pagos Seguros</span>
          </div>
          <div className="flex items-center gap-2">
            <Cpu className="w-4 h-4 text-rose-400" />
            <span>Inventario IA Sincronizado en Tiempo Real</span>
          </div>
          <button
            onClick={onOpenAIScanner}
            className="text-rose-400 hover:text-rose-300 font-medium underline flex items-center gap-1 cursor-pointer"
          >
            <span>Procesar Factura con Gemini</span>
            <ArrowRight className="w-3 h-3" />
          </button>
        </div>
      </div>
    </section>
  );
};
