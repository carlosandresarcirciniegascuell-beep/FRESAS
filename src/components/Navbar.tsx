import React from 'react';
import { UserProfile } from '../types';
import { 
  ShoppingBag, 
  ShieldCheck, 
  ShieldAlert, 
  Cpu, 
  GitBranch, 
  Sparkles,
  Menu,
  X
} from 'lucide-react';

interface NavbarProps {
  cartCount: number;
  onOpenCart: () => void;
  currentUser: UserProfile;
  onOpenVerification: () => void;
  onOpenAIScanner: () => void;
  onOpenDevOps: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  cartCount,
  onOpenCart,
  currentUser,
  onOpenVerification,
  onOpenAIScanner,
  onOpenDevOps,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);

  return (
    <header className="sticky top-0 z-40 w-full bg-stone-950/85 backdrop-blur-md border-b border-stone-800/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between">
        {/* Zone 1: Single element Brand Wordmark */}
        <a 
          href="#" 
          className="text-2xl sm:text-3xl font-display font-semibold tracking-tight text-white hover:text-rose-300 transition-colors whitespace-nowrap"
        >
          Sweet Berry
        </a>

        {/* Zone 2: Clean 4-6 nav links (Single-line) */}
        <nav className="hidden md:flex items-center gap-7 text-sm font-medium text-stone-300">
          <a href="#catalogo" className="hover:text-white transition-colors">
            Catálogo Gourmet
          </a>
          <a href="#customizer-3d" className="hover:text-white transition-colors flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-rose-400" />
            <span>Taller 3D</span>
          </a>
          <a href="#conocenos" className="hover:text-white transition-colors">
            Conócenos
          </a>
          <button
            onClick={onOpenAIScanner}
            className="hover:text-rose-400 transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            <Cpu className="w-3.5 h-3.5 text-rose-500" />
            <span>Extractor IA</span>
          </button>
          <button
            onClick={onOpenDevOps}
            className="hover:text-sky-400 transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            <GitBranch className="w-3.5 h-3.5 text-sky-400" />
            <span>GitHub & Cloud</span>
          </button>
        </nav>

        {/* Zone 3: 1-2 Primary Actions */}
        <div className="flex items-center gap-3">
          {/* User Verification / Profile Action */}
          <button
            onClick={onOpenVerification}
            className={`hidden sm:flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold border transition-all cursor-pointer whitespace-nowrap ${
              currentUser.isVerified
                ? 'bg-emerald-950/50 border-emerald-800/80 text-emerald-300 hover:bg-emerald-900/40'
                : 'bg-stone-900 border-stone-700/80 text-stone-300 hover:border-amber-500/80'
            }`}
          >
            {currentUser.isVerified ? (
              <>
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span>Verificado KYC</span>
              </>
            ) : (
              <>
                <ShieldAlert className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                <span>Verificar Cuenta</span>
              </>
            )}
          </button>

          {/* Cart Bag Action */}
          <button
            onClick={onOpenCart}
            className="relative px-3.5 py-2 bg-rose-600 hover:bg-rose-500 active:scale-[0.98] text-white rounded-xl text-xs font-medium flex items-center gap-2 transition-all cursor-pointer shadow-lg shadow-rose-950/40 whitespace-nowrap"
          >
            <ShoppingBag className="w-4 h-4" />
            <span className="hidden sm:inline font-semibold">Bolsa</span>
            <span className="font-mono bg-white text-rose-700 rounded-full px-1.5 py-0.2 text-[11px] font-bold">
              {cartCount}
            </span>
          </button>

          {/* Mobile hamburger toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 text-stone-400 hover:text-white rounded-lg hover:bg-stone-800 transition-colors"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-stone-800 bg-stone-950 px-5 py-4 space-y-3 text-sm">
          <a
            href="#catalogo"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-2 text-stone-300 hover:text-white"
          >
            Catálogo Gourmet
          </a>
          <a
            href="#customizer-3d"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-2 text-stone-300 hover:text-white"
          >
            Taller 3D Interactivo
          </a>
          <a
            href="#conocenos"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-2 text-stone-300 hover:text-white"
          >
            Conócenos & Historia
          </a>
          <button
            onClick={() => {
              setMobileMenuOpen(false);
              onOpenAIScanner();
            }}
            className="w-full text-left py-2 text-rose-400 flex items-center gap-2"
          >
            <Cpu className="w-4 h-4" />
            <span>Extractor de Inventario IA (Gemini)</span>
          </button>
          <button
            onClick={() => {
              setMobileMenuOpen(false);
              onOpenDevOps();
            }}
            className="w-full text-left py-2 text-sky-400 flex items-center gap-2"
          >
            <GitBranch className="w-4 h-4" />
            <span>GitHub CI/CD & Despliegue en la Nube</span>
          </button>
          <button
            onClick={() => {
              setMobileMenuOpen(false);
              onOpenVerification();
            }}
            className="w-full text-left py-2 text-amber-400 flex items-center gap-2 border-t border-stone-800 pt-3"
          >
            <ShieldCheck className="w-4 h-4" />
            <span>
              {currentUser.isVerified ? 'Perfil Verificado KYC' : 'Verificar Identidad del Cliente'}
            </span>
          </button>
        </div>
      )}
    </header>
  );
};
