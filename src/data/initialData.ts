import { Product, GitCommitRecord, CloudSystemStatus } from '../types';

export const INITIAL_PRODUCTS: Product[] = [
  {
    id: 'sb-01',
    name: 'Fresa Clásica Gourmet',
    category: 'clasicas',
    description: 'Fresas frescas de cultivo orgánico bañadas en nuestra cremosa receta artesanal de la casa con un toque sedoso de vainilla Bourbon de Madagascar.',
    price: 14900,
    stock: 45,
    rating: 4.9,
    reviewCount: 184,
    image: '/src/assets/images/product_fresa_clasica_1790362470052.jpg',
    tags: ['Artesanal', 'Firma de la Casa', 'Frescura Diaria'],
    ingredients: ['Fresas seleccionadas de altura', 'Crema de leche batida artesanal', 'Vainilla natural Bourbon', 'Miel suave'],
    calories: '280 kcal',
    prepTime: '5 min',
    isBestseller: true,
  },
  {
    id: 'sb-02',
    name: 'Sweet Berry Especial',
    category: 'especiales',
    description: 'La consentida de la casa. Fresas jugosas, doble capa de crema batida, hilos tibios de Nutella italiana, dados de brownie de chocolate belga y almendras fileteadas tostadas.',
    price: 22500,
    stock: 32,
    rating: 5.0,
    reviewCount: 312,
    image: '/src/assets/images/product_sweet_berry_especial_1790362480034.jpg',
    tags: ['Top Ventas', 'Brownie & Nutella', 'Compartir'],
    ingredients: ['Fresas jumbo', 'Crema artesanal batida', 'Nutella original Ferrero', 'Brownie melcochudo de cacao 70%', 'Almendras doradas'],
    calories: '490 kcal',
    prepTime: '7 min',
    isBestseller: true,
  },
  {
    id: 'sb-03',
    name: 'Copa Royale Oro 24K',
    category: 'premium',
    description: 'Presentación de alta gama en copa de cristal templado. Fresas maceradas en licor de frambuesa, crema de mascarpone suave, hilos de chocolate amargo belga y hojuelas comestibles de oro puro 24k.',
    price: 34000,
    stock: 18,
    rating: 5.0,
    reviewCount: 96,
    image: '/src/assets/images/hero_gourmet_strawberries_cream_1790362457851.jpg',
    tags: ['Edición Limitada', 'Oro 24K', 'Experiencia VIP'],
    ingredients: ['Fresas premium seleccionadas a mano', 'Crema de mascarpone italiana', 'Hojuelas de oro 24k comestibles', 'Cacao Belga Callebaut'],
    calories: '360 kcal',
    prepTime: '10 min',
    isBestseller: false,
  },
  {
    id: 'sb-04',
    name: 'Luxury Gift Box Sweet Berry',
    category: 'personalizadas',
    description: 'Caja joyero negra mate con terminaciones doradas. Incluye 12 fresas gigantes bañadas individualmente en chocolate rubí y semiamargo, con dos dispensadores de crema gourmet artesanal y perlas crocantes.',
    price: 42000,
    stock: 15,
    rating: 4.9,
    reviewCount: 78,
    image: '/src/assets/images/product_personalizada_gold_1790362490211.jpg',
    tags: ['Regalo Exclusivo', 'Empaque de Lujo', 'Eventos'],
    ingredients: ['12 Fresas de exportación', 'Chocolate Belga 54%', 'Chocolate Ruby', 'Crema artesanal Sweet Berry', 'Pistacho molido'],
    calories: '580 kcal',
    prepTime: '15 min',
    isBestseller: false,
  },
  {
    id: 'sb-05',
    name: 'Doble Tentación Lotus & Arequipe',
    category: 'especiales',
    description: 'Generosa copa con fresas frescas, crema batida, crema de galletas Lotus Biscoff caramelizada, crujiente de galleta belga y toffee de dulce de leche campesino.',
    price: 24500,
    stock: 28,
    rating: 4.8,
    reviewCount: 142,
    image: '/src/assets/images/product_sweet_berry_especial_1790362480034.jpg',
    tags: ['Lotus Biscoff', 'Caramelo Artesanal'],
    ingredients: ['Fresas de la sabana', 'Crema batida', 'Pasta Biscoff Lotus', 'Galletas trituradas', 'Arequipe de paila'],
    calories: '460 kcal',
    prepTime: '6 min',
    isBestseller: false,
  },
  {
    id: 'sb-06',
    name: 'Sweet Berry Fit & Sin Azúcar',
    category: 'clasicas',
    description: 'Para disfrutar sin remordimientos: fresas frescas silvestres con crema ligera batida a base de almendras y yogur griego artesanal, endulzada con alulosa natural.',
    price: 18500,
    stock: 22,
    rating: 4.9,
    reviewCount: 64,
    image: '/src/assets/images/product_fresa_clasica_1790362470052.jpg',
    tags: ['Keto Friendly', 'Sin Azúcar Añadida', '0% Culpa'],
    ingredients: ['Fresas frescas orgánicas', 'Crema ligera de yogur griego & coco', 'Alulosa pura', 'Semillas de chía'],
    calories: '160 kcal',
    prepTime: '5 min',
    isBestseller: false,
  },
];

export const SAMPLE_INVOICES = [
  {
    id: 'inv-valle',
    label: 'Factura Distribuidora Fresas del Huerto #FH-8921',
    type: 'invoice',
    content: `FACTURA ELECTRÓNICA DE VENTA #FH-8921
PROVEEDOR: Agroindustria & Fresas de Exportación El Valle S.A.S.
NIT: 901.382.119-4
FECHA EMISIÓN: 24/09/2026
CLIENTE: Sweet Berry Gourmet SAS - Sede Principal
DETALLE DE ARTÍCULOS E INSUMOS RECIBIDOS:
1. Fresa Clásica Gourmet (Caja Selección 10kg Calibre Extra)
   - Cantidad: 60 unidades
   - Costo Unitario: $7,200 COP
   - Precio Sugerido Venta: $14,900 COP
   - Lote: LOTE-FRE-2609A
   - Caducidad: 05/10/2026
2. Crema de Leche Artesanal Pasteurizada 35% Grasa (Balde 5 Litros)
   - Cantidad: 25 unidades
   - Costo Unitario: $11,500 COP
   - Precio Sugerido Venta: $22,500 COP
   - Lote: LOTE-CRM-991
   - Caducidad: 18/10/2026
3. Topping Chocolate Belga Callebaut 70% & Hojuelas Oro Gourmet
   - Cantidad: 15 unidades
   - Costo Unitario: $16,800 COP
   - Precio Sugerido Venta: $34,000 COP
   - Lote: LOTE-ORO-442
   - Caducidad: 30/12/2026
TOTAL FACTURADO: $971,500 COP
ESTADO DE PAGO: Aprobado / Transferencia Inmediata`,
  },
  {
    id: 'inv-suisse',
    label: 'Catálogo & Albarán Toppings Suisse Gourmet #CT-5510',
    type: 'catalog',
    content: `LISTA DE REABASTECIMIENTO & CATÁLOGO TÉCNICO DE INSUMOS
PROVEEDOR: Importaciones Gourmet Suisse & Delice Ltd.
CÓDIGO PEDIDO: CT-5510-2026
DESTINO: Almacén Sweet Berry Gourmet
PRODUCTOS INGRESADOS AL SISTEMA:
1. Sweet Berry Especial (Kit Premium Brownie Cacao & Nutella)
   - Cantidad reabastecida: 40 porciones
   - Costo de Insumo por Porción: $10,200 COP
   - Precio Venta al Público: $22,500 COP
   - Lote: BROW-CHOC-2026
   - Vencimiento: 15/11/2026
2. Luxury Gift Box Sweet Berry (Cajas Rígidas Negras + Cintas de Seda)
   - Cantidad reabastecida: 20 unidades
   - Costo unitario empaque & fresas: $19,500 COP
   - Precio Venta al Público: $42,000 COP
   - Lote: PACK-LUX-082
   - Vencimiento: Indefinido
VALOR TOTAL ORDEN DE COMPRA: $808,000 COP
FIRMA CONTROL CALIDAD: Ing. Alimentaria Aprobada`,
  },
];

export const INITIAL_COMMITS: GitCommitRecord[] = [
  {
    id: 'c-1',
    hash: '8f2a1b9',
    message: 'feat(inventory): auto-sync 60 units from Invoice FH-8921 via Gemini AI',
    author: 'ai-sync-bot[bot]',
    timestamp: 'Hace 8 min',
    branch: 'main',
    status: 'synced',
  },
  {
    id: 'c-2',
    hash: '4d9e77c',
    message: 'security(auth): enforce 2FA verification gate on all checkout transactions',
    author: 'sweet-berry-dev',
    timestamp: 'Hace 34 min',
    branch: 'main',
    status: 'healthy',
  },
  {
    id: 'c-3',
    hash: '1a3b592',
    message: 'chore(deploy): cloud auto-scale threshold updated for 15,000 peak rps',
    author: 'github-actions[bot]',
    timestamp: 'Hace 1 hora',
    branch: 'release/v2.4',
    status: 'synced',
  },
];

export const INITIAL_CLOUD_STATUS: CloudSystemStatus = {
  cloudProvider: 'Google Cloud Run (Enterprise Auto-Scaling)',
  environment: 'production-us-east1',
  uptime: '99.99%',
  activeNodes: 6,
  avgLatencyMs: 18,
  peakCapacityRps: 15000,
  databaseStatus: 'connected',
  lastDeployTime: 'Hace 12 min (Automated CI/CD)',
};
