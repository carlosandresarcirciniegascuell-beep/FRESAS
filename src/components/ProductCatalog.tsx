import React, { useState } from 'react';
import { Product, CartItem } from '../types';
import { 
  Sparkles, 
  ShoppingBag, 
  Star, 
  Info, 
  Flame, 
  Check, 
  X,
  Clock,
  Layers
} from 'lucide-react';

interface ProductCatalogProps {
  products: Product[];
  onAddToCart: (item: CartItem) => void;
}

export const ProductCatalog: React.FC<ProductCatalogProps> = ({ products, onAddToCart }) => {
  const [activeFilter, setActiveFilter] = useState<'all' | 'clasicas' | 'especiales' | 'premium' | 'personalizadas'>('all');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [addedAnimationId, setAddedAnimationId] = useState<string | null>(null);

  const filteredProducts = activeFilter === 'all'
    ? products
    : products.filter(p => p.category === activeFilter);

  const handleQuickAdd = (product: Product, e: React.MouseEvent) => {
    e.stopPropagation();
    const cartItem: CartItem = {
      id: `cart-${product.id}-${Date.now()}`,
      productId: product.id,
      name: product.name,
      price: product.price,
      quantity: 1,
      image: product.image,
    };
    onAddToCart(cartItem);

    setAddedAnimationId(product.id);
    setTimeout(() => {
      setAddedAnimationId(null);
    }, 1200);
  };

  return (
    <section id="catalogo" className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      {/* Section Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 pb-6 border-b border-stone-800/80 gap-6">
        <div>
          <span className="text-xs uppercase tracking-widest text-rose-500 font-semibold mb-2 block">
            Colección Gourmet Sweet Berry
          </span>
          <h2 className="text-3xl sm:text-4xl font-display font-medium text-white tracking-tight">
            Nuestros Productos Exclusivos
          </h2>
          <p className="text-stone-400 text-sm mt-2 max-w-xl">
            Preparadas al instante con fresas cosechadas el mismo día y crema artesanal montada a mano.
          </p>
        </div>

        {/* Filter Tabs (Interactive Segmented Control) */}
        <div className="flex items-center gap-1.5 p-1 bg-stone-900 border border-stone-800 rounded-xl overflow-x-auto max-w-full">
          {[
            { id: 'all', label: 'Todos' },
            { id: 'clasicas', label: 'Clásicas' },
            { id: 'especiales', label: 'Especiales' },
            { id: 'premium', label: 'Oro 24K' },
            { id: 'personalizadas', label: 'Regalos & Cajas' },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveFilter(tab.id as any)}
              className={`px-3.5 py-1.5 text-xs font-medium rounded-lg transition-colors whitespace-nowrap cursor-pointer ${
                activeFilter === tab.id
                  ? 'bg-rose-600 text-white shadow-sm'
                  : 'text-stone-400 hover:text-stone-200'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* 3-Column Desktop / 2-Column Mobile Product Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
        {filteredProducts.map(product => {
          const isJustAdded = addedAnimationId === product.id;

          return (
            <div
              key={product.id}
              onClick={() => setSelectedProduct(product)}
              className="group cursor-pointer rounded-2xl bg-stone-900/50 border border-stone-800 hover:border-stone-700 transition-all duration-300 overflow-hidden flex flex-col hover:-translate-y-1 hover:shadow-xl hover:shadow-rose-950/20"
            >
              {/* Product Image Slot */}
              <div className="relative aspect-[4/3] w-full overflow-hidden bg-stone-950">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
                  referrerPolicy="no-referrer"
                />

                {/* Subtle Stock indicator badge synced with AI inventory */}
                <div className="absolute top-3 left-3 bg-stone-950/80 backdrop-blur-md px-2.5 py-1 rounded-md text-[11px] font-mono text-stone-300 border border-stone-800">
                  <span className="text-emerald-400 font-semibold">{product.stock}</span> disp.
                </div>

                {product.isBestseller && (
                  <div className="absolute top-3 right-3 bg-rose-600/90 backdrop-blur-md px-2.5 py-1 rounded-md text-[11px] font-semibold text-white flex items-center gap-1 shadow-sm">
                    <Flame className="w-3 h-3 text-amber-300" />
                    <span>Favorito</span>
                  </div>
                )}
              </div>

              {/* Product Details Content */}
              <div className="p-5 flex-1 flex flex-col justify-between text-left">
                <div>
                  <div className="flex items-center justify-between text-xs text-stone-400 mb-1.5">
                    <span className="uppercase tracking-wider text-[11px] font-medium text-rose-400/90">
                      {product.category}
                    </span>
                    <div className="flex items-center gap-1 text-amber-400">
                      <Star className="w-3 h-3 fill-current" />
                      <span className="font-mono tabular-nums">{product.rating}</span>
                      <span className="text-stone-500">({product.reviewCount})</span>
                    </div>
                  </div>

                  <h3 className="text-lg font-semibold text-white group-hover:text-rose-300 transition-colors">
                    {product.name}
                  </h3>

                  <p className="text-xs text-stone-400 mt-2 line-clamp-2 leading-relaxed">
                    {product.description}
                  </p>
                </div>

                <div className="mt-5 pt-4 border-t border-stone-800/80 flex items-center justify-between">
                  <div>
                    <span className="text-[11px] text-stone-500 block">Precio porción</span>
                    <span className="text-lg font-mono font-bold text-white tabular-nums">
                      ${product.price.toLocaleString('es-CO')}{' '}
                      <span className="text-xs font-sans font-normal text-stone-400">COP</span>
                    </span>
                  </div>

                  <button
                    onClick={e => handleQuickAdd(product, e)}
                    className={`px-3.5 py-2 rounded-xl text-xs font-semibold transition-all flex items-center gap-1.5 cursor-pointer shadow-md ${
                      isJustAdded
                        ? 'bg-emerald-600 text-white'
                        : 'bg-rose-600 hover:bg-rose-500 text-white'
                    }`}
                  >
                    {isJustAdded ? (
                      <>
                        <Check className="w-3.5 h-3.5" />
                        <span>¡Agregado!</span>
                      </>
                    ) : (
                      <>
                        <ShoppingBag className="w-3.5 h-3.5" />
                        <span>Pedir</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Product Detail Modal */}
      {selectedProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md overflow-y-auto">
          <div className="relative w-full max-w-2xl bg-stone-900 border border-stone-800 rounded-2xl shadow-2xl overflow-hidden text-left my-8">
            <button
              onClick={() => setSelectedProduct(null)}
              className="absolute top-4 right-4 z-10 p-2 text-stone-300 hover:text-white bg-stone-950/60 rounded-full hover:bg-stone-800 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="aspect-[16/9] w-full relative">
              <img
                src={selectedProduct.image}
                alt={selectedProduct.name}
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-stone-900 via-transparent to-transparent" />
            </div>

            <div className="p-6 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-xs uppercase font-medium text-rose-400 tracking-wider">
                    {selectedProduct.category}
                  </span>
                  <h3 className="text-2xl font-display font-medium text-white">
                    {selectedProduct.name}
                  </h3>
                </div>
                <div className="text-right">
                  <span className="text-xl font-mono font-bold text-rose-400 tabular-nums">
                    ${selectedProduct.price.toLocaleString('es-CO')} COP
                  </span>
                  <span className="block text-[11px] text-emerald-400 font-mono">
                    Stock en tiempo real: {selectedProduct.stock} unidades
                  </span>
                </div>
              </div>

              <p className="text-sm text-stone-300 leading-relaxed">
                {selectedProduct.description}
              </p>

              {/* Tags and badges */}
              <div className="flex flex-wrap gap-2 pt-1">
                {selectedProduct.tags.map((tag, idx) => (
                  <span key={idx} className="text-xs bg-stone-800 text-stone-300 px-2.5 py-1 rounded-md">
                    {tag}
                  </span>
                ))}
              </div>

              {/* Ingredients & Prep */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-3 border-t border-stone-800 text-xs">
                <div>
                  <span className="font-semibold text-stone-300 block mb-1">Ingredientes Selectos:</span>
                  <ul className="space-y-1 text-stone-400">
                    {selectedProduct.ingredients.map((ing, i) => (
                      <li key={i}>• {ing}</li>
                    ))}
                  </ul>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-stone-400">
                    <Clock className="w-3.5 h-3.5 text-stone-500" />
                    <span>Tiempo de montaje: {selectedProduct.prepTime}</span>
                  </div>
                  <div className="flex items-center gap-2 text-stone-400">
                    <Layers className="w-3.5 h-3.5 text-stone-500" />
                    <span>Aporte calórico aprox: {selectedProduct.calories}</span>
                  </div>
                </div>
              </div>

              {/* Modal Action CTA */}
              <div className="pt-4 border-t border-stone-800 flex justify-end gap-3">
                <button
                  onClick={() => setSelectedProduct(null)}
                  className="px-4 py-2.5 bg-stone-800 hover:bg-stone-700 text-stone-300 text-xs font-medium rounded-xl transition-colors cursor-pointer"
                >
                  Regresar
                </button>
                <button
                  onClick={e => {
                    handleQuickAdd(selectedProduct, e);
                    setSelectedProduct(null);
                  }}
                  className="px-6 py-2.5 bg-rose-600 hover:bg-rose-500 text-white text-xs font-semibold rounded-xl shadow-lg transition-all flex items-center gap-2 cursor-pointer"
                >
                  <ShoppingBag className="w-4 h-4" />
                  <span>Agregar a mi Bolsa</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
