import React, { useState } from 'react';
import { ThreeDessertViewer } from './ThreeDessertViewer';
import { CartItem } from '../types';
import { Sparkles, Plus, Check, Wand2 } from 'lucide-react';
import { getAISommelierRecommendation } from '../services/geminiService';

interface ProductCustomizer3DProps {
  onAddToCart: (item: CartItem) => void;
}

const CONTAINER_OPTIONS = [
  { id: 'copa-clasica', name: 'Copa Individual Clásica', desc: 'Porción 280g de fresas y crema', basePrice: 14900 },
  { id: 'bowl-gourmet', name: 'Bowl Gourmet Compartir', desc: 'Porción 550g con doble fresa y crema', basePrice: 22500 },
  { id: 'cristal-royale', name: 'Copa Cristal Royale Oro', desc: 'Copa de diseño con hojuelas doradas', basePrice: 34000 },
  { id: 'gift-box', name: 'Luxury Gift Box Negra & Oro', desc: '12 fresas bañadas en caja de lujo', basePrice: 42000 },
];

const CREAM_OPTIONS = [
  { id: 'tradicional', name: 'Crema Batida Tradicional', desc: 'Nuestra icónica receta dulce y cremosa' },
  { id: 'vainilla', name: 'Crema Vainilla Bourbon Francesa', desc: 'Infusionada con vainilla en rama pura' },
  { id: 'mascarpone', name: 'Crema de Mascarpone Italiano', desc: 'Textura aterciopelada y sutilmente cítrica' },
  { id: 'keto-fit', name: 'Crema Ligera de Coco & Almendras', desc: '0% azúcar refinada, apta para Keto' },
];

const TOPPING_OPTIONS = [
  { id: 'nutella', name: 'Nutella Ferrero Tibia', price: 3500 },
  { id: 'brownie', name: 'Brownie Melcochudo Artesanal', price: 3000 },
  { id: 'oro24k', name: 'Hojuelas de Oro 24K Comestibles', price: 6000 },
  { id: 'almendras', name: 'Almendras Fileteadas Tostadas', price: 2500 },
  { id: 'lotus', name: 'Pasta & Galleta Lotus Biscoff', price: 3500 },
  { id: 'choc-belga', name: 'Chocolate Belga Callebaut 70%', price: 3000 },
  { id: 'fresas-extra', name: 'Fresas Jumbo Extra', price: 3500 },
];

export const ProductCustomizer3D: React.FC<ProductCustomizer3DProps> = ({ onAddToCart }) => {
  const [selectedContainer, setSelectedContainer] = useState(CONTAINER_OPTIONS[1]);
  const [selectedCream, setSelectedCream] = useState(CREAM_OPTIONS[0]);
  const [selectedToppings, setSelectedToppings] = useState<string[]>(['Nutella Ferrero Tibia', 'Brownie Melcochudo Artesanal']);
  const [specialNotes, setSpecialNotes] = useState('');
  const [aiSommelierLoading, setAiSommelierLoading] = useState(false);
  const [aiRecommendation, setAiRecommendation] = useState<{
    title: string;
    notes: string;
    toppings: string[];
  } | null>(null);

  const toggleTopping = (toppingName: string) => {
    setSelectedToppings(prev =>
      prev.includes(toppingName)
        ? prev.filter(t => t !== toppingName)
        : [...prev, toppingName]
    );
  };

  const calculateTotalPrice = () => {
    const toppingsTotal = selectedToppings.reduce((acc, toppingName) => {
      const found = TOPPING_OPTIONS.find(t => t.name === toppingName);
      return acc + (found ? found.price : 0);
    }, 0);
    return selectedContainer.basePrice + toppingsTotal;
  };

  const handleAddCustomToCart = () => {
    const customItem: CartItem = {
      id: `custom-${Date.now()}`,
      productId: selectedContainer.id,
      name: `${selectedContainer.name} (Bespoke Gourmet)`,
      price: calculateTotalPrice(),
      quantity: 1,
      image: '/src/assets/images/hero_gourmet_strawberries_cream_1790362457851.jpg',
      customization: {
        size: selectedContainer.name,
        cream: selectedCream.name,
        toppings: selectedToppings,
        specialNotes: specialNotes || undefined,
      },
    };
    onAddToCart(customItem);
  };

  const askAISommelier = async () => {
    setAiSommelierLoading(true);
    try {
      const rec = await getAISommelierRecommendation('Celebración especial de alta repostería', 'Gourmet equilibrado');
      setAiRecommendation({
        title: rec.recommendationTitle,
        notes: rec.pairingNotes,
        toppings: rec.suggestedToppings,
      });

      // Auto-select recommended toppings
      const matchingToppings = TOPPING_OPTIONS
        .filter(t => rec.suggestedToppings.some(st => st.toLowerCase().includes(t.name.toLowerCase()) || t.name.toLowerCase().includes(st.toLowerCase())))
        .map(t => t.name);

      if (matchingToppings.length > 0) {
        setSelectedToppings(matchingToppings);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setAiSommelierLoading(false);
    }
  };

  return (
    <section id="customizer-3d" className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-stone-800/60">
      <div className="text-center max-w-3xl mx-auto mb-12">
        <span className="text-xs uppercase tracking-widest text-rose-500 font-semibold mb-2 block">
          Taller de Alta Repostería en Tiempo Real
        </span>
        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-display font-medium text-stone-100 tracking-tight text-balance">
          Diseña tu Sweet Berry en 3D
        </h2>
        <p className="mt-4 text-stone-400 text-sm sm:text-base leading-relaxed">
          Selecciona tu base, crema artesanal batida y combinaciones de toppings de autor. Observa cómo cobra vida en el render tridimensional interactivo.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left: 3D Live Interactive Stage */}
        <div className="lg:col-span-6 space-y-4 sticky top-24">
          <ThreeDessertViewer
            customToppings={selectedToppings}
            creamType={selectedCream.name}
            containerType={selectedContainer.name}
          />

          {/* AI Sommelier Recommendation Box */}
          <div className="p-4 rounded-xl bg-stone-900/60 border border-stone-800/90 text-left">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Wand2 className="w-4 h-4 text-rose-400" />
                <span className="text-xs font-semibold text-stone-200">Asesor Sommelier IA</span>
              </div>
              <button
                onClick={askAISommelier}
                disabled={aiSommelierLoading}
                className="text-xs text-rose-400 hover:text-rose-300 transition-colors font-medium flex items-center gap-1 cursor-pointer disabled:opacity-50"
              >
                {aiSommelierLoading ? 'Analizando maridaje...' : 'Generar Maridaje de Autor'}
              </button>
            </div>

            {aiRecommendation && (
              <div className="mt-3 pt-3 border-t border-stone-800/80">
                <p className="text-xs font-medium text-amber-300">{aiRecommendation.title}</p>
                <p className="text-xs text-stone-400 mt-1 leading-relaxed">{aiRecommendation.notes}</p>
              </div>
            )}
          </div>
        </div>

        {/* Right: Customization Controls */}
        <div className="lg:col-span-6 space-y-8 bg-stone-900/40 p-6 sm:p-8 rounded-2xl border border-stone-800/70">
          {/* Step 1: Base / Container */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-semibold uppercase tracking-wider text-stone-400">1. Presentación Base</span>
              <span className="text-xs text-stone-500">Selecciona 1 formato</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {CONTAINER_OPTIONS.map(opt => {
                const active = selectedContainer.id === opt.id;
                return (
                  <button
                    key={opt.id}
                    onClick={() => setSelectedContainer(opt)}
                    className={`p-3.5 rounded-xl text-left transition-all border cursor-pointer ${
                      active
                        ? 'border-rose-500 bg-rose-500/10 text-white'
                        : 'border-stone-800 bg-stone-900/70 text-stone-300 hover:border-stone-700'
                    }`}
                  >
                    <div className="flex justify-between items-start">
                      <span className="text-sm font-semibold">{opt.name}</span>
                      {active && <Check className="w-4 h-4 text-rose-400 shrink-0 ml-2" />}
                    </div>
                    <p className="text-xs text-stone-400 mt-1 line-clamp-1">{opt.desc}</p>
                    <p className="text-xs font-mono font-medium text-rose-300 mt-2 tabular-nums">
                      ${opt.basePrice.toLocaleString('es-CO')} COP
                    </p>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Step 2: Artisanal Cream */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-semibold uppercase tracking-wider text-stone-400">2. Crema Artesanal de la Casa</span>
              <span className="text-xs text-stone-500">Receta secreta Sweet Berry</span>
            </div>
            <div className="space-y-2">
              {CREAM_OPTIONS.map(opt => {
                const active = selectedCream.id === opt.id;
                return (
                  <button
                    key={opt.id}
                    onClick={() => setSelectedCream(opt)}
                    className={`w-full p-3 rounded-xl flex items-center justify-between text-left transition-colors border cursor-pointer ${
                      active
                        ? 'border-rose-500 bg-rose-500/10 text-white'
                        : 'border-stone-800/80 bg-stone-900/50 text-stone-300 hover:border-stone-700'
                    }`}
                  >
                    <div>
                      <p className="text-sm font-medium">{opt.name}</p>
                      <p className="text-xs text-stone-400">{opt.desc}</p>
                    </div>
                    {active && <Check className="w-4 h-4 text-rose-400 shrink-0" />}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Step 3: Gourmet Toppings */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-semibold uppercase tracking-wider text-stone-400">3. Toppings Gourmet de Autor</span>
              <span className="text-xs text-stone-500">{selectedToppings.length} seleccionados</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {TOPPING_OPTIONS.map(t => {
                const isSelected = selectedToppings.includes(t.name);
                return (
                  <button
                    key={t.id}
                    onClick={() => toggleTopping(t.name)}
                    className={`p-3 rounded-xl flex items-center justify-between text-left transition-colors border cursor-pointer ${
                      isSelected
                        ? 'border-amber-500/80 bg-amber-500/10 text-white'
                        : 'border-stone-800/80 bg-stone-900/40 text-stone-300 hover:border-stone-700'
                    }`}
                  >
                    <div className="truncate mr-2">
                      <p className="text-xs font-medium truncate">{t.name}</p>
                      <p className="text-[11px] font-mono text-stone-400 tabular-nums">
                        +${t.price.toLocaleString('es-CO')}
                      </p>
                    </div>
                    <div className={`w-5 h-5 rounded-md flex items-center justify-center border text-xs ${
                      isSelected ? 'border-amber-400 bg-amber-500 text-stone-950 font-bold' : 'border-stone-700'
                    }`}>
                      {isSelected ? '✓' : <Plus className="w-3 h-3 text-stone-500" />}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Step 4: Special Dedication Note */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-stone-400 mb-2">
              Mensaje o Dedicatoria para la Entrega (Opcional)
            </label>
            <input
              type="text"
              value={specialNotes}
              onChange={e => setSpecialNotes(e.target.value)}
              placeholder="Ej: Para el cumpleaños de Sofía con tarjeta especial..."
              className="w-full bg-stone-950/80 border border-stone-800 rounded-xl px-4 py-2.5 text-sm text-stone-200 placeholder:text-stone-600 focus:outline-none focus:border-rose-500 transition-colors"
            />
          </div>

          {/* Price Bar & Add to Bag CTA */}
          <div className="pt-4 border-t border-stone-800 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              <span className="text-xs text-stone-400">Total Personalizado</span>
              <p className="text-2xl font-mono font-bold text-white tabular-nums">
                ${calculateTotalPrice().toLocaleString('es-CO')} <span className="text-xs text-stone-500 font-sans font-normal">COP</span>
              </p>
            </div>

            <button
              onClick={handleAddCustomToCart}
              className="w-full sm:w-auto px-7 py-3.5 bg-rose-600 hover:bg-rose-500 active:scale-[0.98] text-white font-medium text-sm rounded-xl shadow-lg shadow-rose-900/30 transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <Sparkles className="w-4 h-4" />
              <span>Agregar Creación al Pedido</span>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};
