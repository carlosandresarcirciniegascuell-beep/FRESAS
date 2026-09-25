export interface Product {
  id: string;
  name: string;
  category: 'clasicas' | 'especiales' | 'personalizadas' | 'premium';
  description: string;
  price: number;
  stock: number;
  rating: number;
  reviewCount: number;
  image: string;
  tags: string[];
  ingredients: string[];
  calories: string;
  prepTime: string;
  isBestseller?: boolean;
}

export interface CartItem {
  id: string;
  productId: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
  customization?: {
    size: string;
    cream: string;
    toppings: string[];
    specialNotes?: string;
  };
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  phone: string;
  isRegistered: boolean;
  isVerified: boolean;
  verificationLevel: 'none' | 'pending' | 'verified_tier2';
  verificationMethod?: 'sms_otp' | 'id_document' | 'biometric';
  berryPoints: number;
  address?: string;
  city?: string;
}

export interface InvoiceExtractedItem {
  productName: string;
  category: string;
  quantityAdded: number;
  unitCost: number;
  suggestedSalePrice: number;
  lotNumber: string;
  expiryDate: string;
  confidenceScore: number;
}

export interface InvoiceExtractionResult {
  supplierName: string;
  invoiceNumber: string;
  date: string;
  totalCost: number;
  currency: string;
  items: InvoiceExtractedItem[];
  rawSummary: string;
  processingTimeMs: number;
}

export interface GitCommitRecord {
  id: string;
  hash: string;
  message: string;
  author: string;
  timestamp: string;
  branch: string;
  status: 'synced' | 'deploying' | 'healthy';
}

export interface CloudSystemStatus {
  cloudProvider: string;
  environment: string;
  uptime: string;
  activeNodes: number;
  avgLatencyMs: number;
  peakCapacityRps: number;
  databaseStatus: 'connected' | 'syncing' | 'optimizing';
  lastDeployTime: string;
}
