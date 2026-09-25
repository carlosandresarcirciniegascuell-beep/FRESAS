/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { ProductCustomizer3D } from './components/ProductCustomizer3D';
import { ProductCatalog } from './components/ProductCatalog';
import { BrandStory } from './components/BrandStory';
import { Footer } from './components/Footer';
import { CartDrawer } from './components/CartDrawer';
import { AIInvoiceScannerModal } from './components/AIInvoiceScannerModal';
import { VerificationAuthModal } from './components/VerificationAuthModal';
import { OrderConfirmationModal } from './components/OrderConfirmationModal';
import { DevOpsPipelineModal } from './components/DevOpsPipelineModal';

import { 
  INITIAL_PRODUCTS, 
  INITIAL_COMMITS, 
  INITIAL_CLOUD_STATUS 
} from './data/initialData';
import { 
  Product, 
  CartItem, 
  UserProfile, 
  InvoiceExtractionResult, 
  GitCommitRecord, 
  CloudSystemStatus 
} from './types';
import { Sparkles, ShieldCheck, CheckCircle2 } from 'lucide-react';

export default function App() {
  const [products, setProducts] = useState<Product[]>(INITIAL_PRODUCTS);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [currentUser, setCurrentUser] = useState<UserProfile>({
    id: 'usr-921',
    name: 'Carlos Andrés Arciniegas',
    email: 'carlosandresarcirciniegascuell@gmail.com',
    phone: '+57 312 849 2011',
    isRegistered: false,
    isVerified: false,
    verificationLevel: 'none',
    berryPoints: 100,
    address: 'Carrera 7 # 116-50, Apto 402',
    city: 'Bogotá D.C.',
  });

  const [commits, setCommits] = useState<GitCommitRecord[]>(INITIAL_COMMITS);
  const [cloudStatus, setCloudStatus] = useState<CloudSystemStatus>(INITIAL_CLOUD_STATUS);

  // Modal open states
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isAIScannerOpen, setIsAIScannerOpen] = useState(false);
  const [isDevOpsOpen, setIsDevOpsOpen] = useState(false);
  const [isVerificationOpen, setIsVerificationOpen] = useState(false);
  const [verificationTriggerReason, setVerificationTriggerReason] = useState<string | undefined>(undefined);
  const [isOrderConfirmationOpen, setIsOrderConfirmationOpen] = useState(false);
  const [lastCompletedOrderId, setLastCompletedOrderId] = useState<string>('SB-2026-9841');
  const [lastCompletedOrderItems, setLastCompletedOrderItems] = useState<CartItem[]>([]);
  const [lastCompletedOrderTotal, setLastCompletedOrderTotal] = useState<number>(0);

  // Toast notification state
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3500);
  };

  // Add to Cart handler
  const handleAddToCart = (item: CartItem) => {
    setCartItems(prev => {
      const existing = prev.find(i => i.productId === item.productId && !i.customization);
      if (existing && !item.customization) {
        return prev.map(i =>
          i.id === existing.id ? { ...i, quantity: i.quantity + item.quantity } : i
        );
      }
      return [...prev, item];
    });

    showToast(`"${item.name}" agregada a tu bolsa de pedidos.`);
  };

  // Update Cart quantity
  const handleUpdateQuantity = (id: string, delta: number) => {
    setCartItems(prev =>
      prev
        .map(item => {
          if (item.id === id) {
            const newQty = item.quantity + delta;
            return newQty > 0 ? { ...item, quantity: newQty } : null;
          }
          return item;
        })
        .filter(Boolean) as CartItem[]
    );
  };

  // Remove item from Cart
  const handleRemoveFromCart = (id: string) => {
    setCartItems(prev => prev.filter(i => i.id !== id));
  };

  // Open verification from Cart
  const handlePromptVerification = (reason?: string) => {
    setVerificationTriggerReason(
      reason || 'Debes registrarte y verificar tu identidad con el código SMS antes de completar cualquier pago.'
    );
    setIsVerificationOpen(true);
  };

  // Checkout execution (only permitted if user is verified)
  const handleCompleteCheckout = () => {
    if (!currentUser.isVerified) {
      handlePromptVerification('Debes estar verificado antes de pagar para proteger tus datos financieros.');
      return;
    }

    if (cartItems.length === 0) return;

    const subtotal = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);
    const deliveryFee = subtotal >= 40000 ? 0 : 5000;
    const finalTotal = subtotal + deliveryFee;

    const orderNum = `SB-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;

    // Deduct stock in real-time
    setProducts(prev =>
      prev.map(p => {
        const bought = cartItems.find(c => c.productId === p.id);
        if (bought) {
          return { ...p, stock: Math.max(0, p.stock - bought.quantity) };
        }
        return p;
      })
    );

    // Record order confirmation details
    setLastCompletedOrderId(orderNum);
    setLastCompletedOrderItems([...cartItems]);
    setLastCompletedOrderTotal(finalTotal);

    // Close cart and open order confirmation modal
    setIsCartOpen(false);
    setCartItems([]);
    setIsOrderConfirmationOpen(true);
  };

  // Apply AI extracted invoice to inventory & GitHub
  const handleApplyInventoryUpdate = (
    extraction: InvoiceExtractionResult,
    newCommit: GitCommitRecord
  ) => {
    let totalItemsAdded = 0;

    // Update product stock counts matching names or first item
    setProducts(prev =>
      prev.map(prod => {
        const matchingExtracted = extraction.items.find(
          item =>
            item.productName.toLowerCase().includes(prod.name.toLowerCase()) ||
            prod.name.toLowerCase().includes(item.productName.toLowerCase())
        );

        if (matchingExtracted) {
          totalItemsAdded += matchingExtracted.quantityAdded;
          return {
            ...prod,
            stock: prod.stock + matchingExtracted.quantityAdded,
          };
        }
        return prod;
      })
    );

    // If no exact name matched, add units to first product
    if (totalItemsAdded === 0 && extraction.items.length > 0) {
      const addedQty = extraction.items[0].quantityAdded;
      setProducts(prev => [
        { ...prev[0], stock: prev[0].stock + addedQty },
        ...prev.slice(1),
      ]);
      totalItemsAdded = addedQty;
    }

    // Prepend commit to GitHub stream
    setCommits(prev => [newCommit, ...prev]);

    // Update cloud status
    setCloudStatus(prev => ({
      ...prev,
      lastDeployTime: 'Hace 30 seg (Sincronizado vía webhook)',
      activeNodes: Math.min(12, prev.activeNodes + 1),
    }));

    showToast(`¡IA Sincronizada! +${totalItemsAdded} unidades cargadas a la base de datos y GitHub.`);
  };

  const handleTriggerManualWebhook = () => {
    const manualCommit: GitCommitRecord = {
      id: `commit-${Date.now()}`,
      hash: Math.random().toString(16).substring(2, 9),
      message: 'chore(cloud): manual healthcheck triggered & inventory cache warm-up',
      author: 'devops-operator',
      timestamp: 'Justo ahora',
      branch: 'main',
      status: 'synced',
    };
    setCommits(prev => [manualCommit, ...prev]);
    showToast('Webhook de sincronización ejecutado con éxito.');
  };

  return (
    <div className="min-h-screen bg-[#0c0a09] text-[#f5f5f4] flex flex-col font-sans selection:bg-rose-500/20 selection:text-rose-300">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-20 right-4 z-50 p-4 rounded-xl bg-stone-900 border border-stone-700 shadow-2xl text-xs text-stone-200 flex items-center gap-2.5 transition-all">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Top Navbar */}
      <Navbar
        cartCount={cartItems.reduce((acc, item) => acc + item.quantity, 0)}
        onOpenCart={() => setIsCartOpen(true)}
        currentUser={currentUser}
        onOpenVerification={() => {
          setVerificationTriggerReason(undefined);
          setIsVerificationOpen(true);
        }}
        onOpenAIScanner={() => setIsAIScannerOpen(true)}
        onOpenDevOps={() => setIsDevOpsOpen(true)}
      />

      <main className="flex-1">
        {/* Hero Section */}
        <Hero
          onOpenAIScanner={() => setIsAIScannerOpen(true)}
          onExploreCatalog={() => {
            const el = document.getElementById('catalogo');
            el?.scrollIntoView({ behavior: 'smooth' });
          }}
        />

        {/* 3D Interactive Dessert Customizer */}
        <ProductCustomizer3D onAddToCart={handleAddToCart} />

        {/* Gourmet Product Catalog */}
        <ProductCatalog
          products={products}
          onAddToCart={handleAddToCart}
        />

        {/* Brand Story (Conócenos from PDF) */}
        <BrandStory />
      </main>

      {/* Footer */}
      <Footer />

      {/* Cart Drawer */}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        items={cartItems}
        currentUser={currentUser}
        onUpdateQuantity={handleUpdateQuantity}
        onRemoveItem={handleRemoveFromCart}
        onCheckout={handleCompleteCheckout}
        onOpenVerification={() => {
          setIsCartOpen(false);
          handlePromptVerification();
        }}
      />

      {/* AI Invoice / Catalog Extractor Modal */}
      <AIInvoiceScannerModal
        isOpen={isAIScannerOpen}
        onClose={() => setIsAIScannerOpen(false)}
        products={products}
        onApplyInventoryUpdate={handleApplyInventoryUpdate}
      />

      {/* Customer Registration & Verification 2FA Modal */}
      <VerificationAuthModal
        isOpen={isVerificationOpen}
        onClose={() => setIsVerificationOpen(false)}
        currentUser={currentUser}
        onUpdateUser={updatedUser => {
          setCurrentUser(updatedUser);
          showToast('¡Identidad y teléfono verificados con éxito! Nivel KYC 2 activado.');
        }}
        onSuccessProceedToCheckout={() => {
          setIsCartOpen(true);
        }}
        triggerReason={verificationTriggerReason}
      />

      {/* Order Confirmation & WhatsApp Dispatch Modal */}
      <OrderConfirmationModal
        isOpen={isOrderConfirmationOpen}
        onClose={() => setIsOrderConfirmationOpen(false)}
        orderId={lastCompletedOrderId}
        items={lastCompletedOrderItems}
        user={currentUser}
        totalAmount={lastCompletedOrderTotal}
      />

      {/* DevOps GitHub & Cloud Scalability Modal */}
      <DevOpsPipelineModal
        isOpen={isDevOpsOpen}
        onClose={() => setIsDevOpsOpen(false)}
        commits={commits}
        cloudStatus={cloudStatus}
        onTriggerWebhookSync={handleTriggerManualWebhook}
      />
    </div>
  );
}
