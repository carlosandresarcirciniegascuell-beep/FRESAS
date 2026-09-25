import React from 'react';
import { Heart, Sparkles, Truck, ShieldCheck, Award } from 'lucide-react';

export const BrandStory: React.FC = () => {
  return (
    <section id="conocenos" className="py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-stone-800/80">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
        {/* Left Column: Brand Story Editorial */}
        <div className="lg:col-span-6 space-y-6 text-left">
          <span className="text-xs uppercase tracking-widest text-rose-500 font-semibold block">
            Conócenos · Una Idea Dulce Con Futuro
          </span>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-display font-medium text-white tracking-tight leading-tight text-balance">
            Convertir un postre sencillo en una experiencia gourmet inolvidable.
          </h2>

          <p className="text-stone-300 text-sm sm:text-base leading-relaxed">
            Sweet Berry nace como un emprendimiento apasionado enfocado en la elaboración artesanal y comercialización de fresas con crema de categoría superior. Buscamos ofrecer un producto impecablemente presentado, preparado con ingredientes minuciosamente seleccionados y acompañado de una atención personalizada y cercana.
          </p>

          <p className="text-stone-400 text-xs sm:text-sm leading-relaxed">
            Nuestra propuesta: transformar cada porción en un momento especial, cuidando rigurosamente el sabor, la frescura de la cadena de frío, la presentación estética y la optimización tecnológica de nuestro inventario y pedidos digitales.
          </p>

          {/* Pillars from PDF */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 border-t border-stone-800/80">
            <div className="p-4 bg-stone-900/60 border border-stone-800 rounded-xl">
              <span className="text-xs font-semibold text-rose-400 block mb-1">01. Emprender</span>
              <p className="text-xs text-stone-400">
                Poner en marcha un modelo de negocio sostenible, moderno y escalable.
              </p>
            </div>

            <div className="p-4 bg-stone-900/60 border border-stone-800 rounded-xl">
              <span className="text-xs font-semibold text-amber-400 block mb-1">02. Calidad</span>
              <p className="text-xs text-stone-400">
                Fresas de altura cosechadas al punto y crema batida con ingredientes puros.
              </p>
            </div>

            <div className="p-4 bg-stone-900/60 border border-stone-800 rounded-xl">
              <span className="text-xs font-semibold text-sky-400 block mb-1">03. Presencia Digital</span>
              <p className="text-xs text-stone-400">
                Automatización con IA, verificación de pagos y pedidos en línea fluidos.
              </p>
            </div>
          </div>
        </div>

        {/* Right Column: High Quality Visual Showcase */}
        <div className="lg:col-span-6 relative">
          <div className="relative rounded-2xl overflow-hidden border border-stone-800 shadow-2xl bg-stone-950">
            <img
              src="/src/assets/images/product_personalizada_gold_1790362490211.jpg"
              alt="Sweet Berry Gourmet Craftsmanship"
              className="w-full h-[420px] object-cover"
              referrerPolicy="no-referrer"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-stone-950 via-stone-950/20 to-transparent" />

            {/* Overlaid statement banner */}
            <div className="absolute bottom-6 left-6 right-6 p-5 rounded-xl bg-stone-950/85 backdrop-blur-md border border-stone-800 text-left">
              <div className="flex items-center gap-2 text-rose-400 text-xs font-semibold uppercase tracking-wider mb-1">
                <Heart className="w-3.5 h-3.5 fill-current" />
                <span>Hecho con Pasión Artesanal</span>
              </div>
              <p className="text-xs text-stone-300">
                "Fresco. Natural. Delicioso. Gracias por apoyar nuestro emprendimiento dulce."
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
