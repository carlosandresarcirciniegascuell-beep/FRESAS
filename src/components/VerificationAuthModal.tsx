import React, { useState } from 'react';
import { UserProfile } from '../types';
import { 
  X, 
  ShieldCheck, 
  Lock, 
  Phone, 
  Mail, 
  User, 
  MapPin, 
  CheckCircle2, 
  KeyRound,
  ArrowRight,
  ShieldAlert
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface VerificationAuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: UserProfile;
  onUpdateUser: (updatedUser: UserProfile) => void;
  onSuccessProceedToCheckout?: () => void;
  triggerReason?: string;
}

export const VerificationAuthModal: React.FC<VerificationAuthModalProps> = ({
  isOpen,
  onClose,
  currentUser,
  onUpdateUser,
  onSuccessProceedToCheckout,
  triggerReason,
}) => {
  const [step, setStep] = useState<'register' | 'otp' | 'success'>(
    currentUser.isRegistered && !currentUser.isVerified ? 'otp' : 'register'
  );

  const [fullName, setFullName] = useState(currentUser.name || 'Carlos Andrés Arciniegas');
  const [email, setEmail] = useState(currentUser.email || 'carlos.arciniegas@gourmet.co');
  const [phone, setPhone] = useState(currentUser.phone || '+57 312 849 2011');
  const [address, setAddress] = useState(currentUser.address || 'Carrera 7 # 116-50, Apto 402');
  const [city, setCity] = useState(currentUser.city || 'Bogotá D.C.');

  const [otpCode, setOtpCode] = useState(['', '', '', '', '', '']);
  const [otpDemoCode, setOtpDemoCode] = useState('749210');
  const [otpError, setOtpError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName || !email || !phone) return;

    // Generate random 6 digit demo OTP
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    setOtpDemoCode(code);
    setStep('otp');
  };

  const handleOtpChange = (index: number, val: string) => {
    if (val.length > 1) val = val[0];
    const newOtp = [...otpCode];
    newOtp[index] = val;
    setOtpCode(newOtp);

    // Auto-focus next input
    if (val && index < 5) {
      const nextInput = document.getElementById(`otp-${index + 1}`);
      nextInput?.focus();
    }
  };

  const handleFillDemoOtp = () => {
    setOtpCode(otpDemoCode.split(''));
  };

  const handleVerifyOtp = () => {
    const entered = otpCode.join('');
    if (entered !== otpDemoCode && entered.length !== 6) {
      setOtpError('El código ingresado no coincide o está incompleto.');
      return;
    }

    setOtpError(null);
    const verifiedUser: UserProfile = {
      ...currentUser,
      name: fullName,
      email: email,
      phone: phone,
      address: address,
      city: city,
      isRegistered: true,
      isVerified: true,
      verificationLevel: 'verified_tier2',
      verificationMethod: 'sms_otp',
      berryPoints: currentUser.berryPoints + 250,
    };

    onUpdateUser(verifiedUser);
    setStep('success');

    // Trigger celebratory confetti
    try {
      confetti({
        particleCount: 60,
        spread: 60,
        origin: { y: 0.7 },
        colors: ['#e11d48', '#f59e0b', '#10b981'],
      });
    } catch (e) {
      // Ignore
    }
  };

  const handleFinishAndCheckout = () => {
    onClose();
    if (onSuccessProceedToCheckout) {
      onSuccessProceedToCheckout();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-md my-8 bg-stone-900 border border-stone-800 rounded-2xl shadow-2xl overflow-hidden text-left">
        {/* Header */}
        <div className="p-6 pb-4 border-b border-stone-800 flex items-center justify-between bg-stone-950/60">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-white">Verificación de Seguridad</h3>
              <span className="text-[11px] text-stone-400">Protección de Datos & Pagos Seguros</span>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-stone-400 hover:text-white rounded-lg hover:bg-stone-800 transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {triggerReason && (
          <div className="mx-6 mt-4 p-3 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-start gap-2.5 text-xs text-amber-300">
            <ShieldAlert className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
            <div>
              <strong className="font-semibold block text-amber-200">Requisito obligatorio de compra</strong>
              {triggerReason}
            </div>
          </div>
        )}

        <div className="p-6">
          {/* STEP 1: REGISTRATION / PROFILE */}
          {step === 'register' && (
            <form onSubmit={handleRegisterSubmit} className="space-y-4">
              <div>
                <p className="text-xs text-stone-300 leading-relaxed mb-4">
                  Para proteger tus transacciones bancarias y garantizar la entrega de tu pedido gourmet, solicitamos un registro verificado de tu cuenta.
                </p>
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-300 mb-1.5 flex items-center gap-1.5">
                  <User className="w-3.5 h-3.5 text-stone-400" />
                  Nombre Completo
                </label>
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={e => setFullName(e.target.value)}
                  className="w-full bg-stone-950 border border-stone-800 rounded-xl px-3.5 py-2 text-xs text-stone-200 focus:outline-none focus:border-rose-500"
                  placeholder="Ej: Carlos Arciniegas"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-300 mb-1.5 flex items-center gap-1.5">
                  <Mail className="w-3.5 h-3.5 text-stone-400" />
                  Correo Electrónico
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  className="w-full bg-stone-950 border border-stone-800 rounded-xl px-3.5 py-2 text-xs text-stone-200 focus:outline-none focus:border-rose-500"
                  placeholder="ejemplo@correo.com"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-300 mb-1.5 flex items-center gap-1.5">
                  <Phone className="w-3.5 h-3.5 text-stone-400" />
                  Teléfono Móvil (Para código SMS de verificación)
                </label>
                <input
                  type="tel"
                  required
                  value={phone}
                  onChange={e => setPhone(e.target.value)}
                  className="w-full bg-stone-950 border border-stone-800 rounded-xl px-3.5 py-2 text-xs text-stone-200 focus:outline-none focus:border-rose-500 font-mono"
                  placeholder="+57 312 000 0000"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-stone-300 mb-1.5 flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-stone-400" />
                    Dirección de Entrega
                  </label>
                  <input
                    type="text"
                    value={address}
                    onChange={e => setAddress(e.target.value)}
                    className="w-full bg-stone-950 border border-stone-800 rounded-xl px-3 py-2 text-xs text-stone-200 focus:outline-none focus:border-rose-500"
                    placeholder="Calle / Carrera"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-stone-300 mb-1.5">Ciudad</label>
                  <input
                    type="text"
                    value={city}
                    onChange={e => setCity(e.target.value)}
                    className="w-full bg-stone-950 border border-stone-800 rounded-xl px-3 py-2 text-xs text-stone-200 focus:outline-none focus:border-rose-500"
                    placeholder="Ciudad"
                  />
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full py-3 bg-rose-600 hover:bg-rose-500 text-white font-semibold text-xs rounded-xl shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <span>Continuar a Verificación 2FA</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>

              <div className="flex items-center justify-center gap-2 text-[11px] text-stone-500 pt-1">
                <Lock className="w-3 h-3 text-stone-600" />
                <span>Cifrado bancario AES-256 bits · Cumplimiento PCI-DSS</span>
              </div>
            </form>
          )}

          {/* STEP 2: OTP SMS VERIFICATION */}
          {step === 'otp' && (
            <div className="space-y-5">
              <div className="text-center">
                <div className="w-12 h-12 rounded-full bg-rose-500/10 border border-rose-500/20 text-rose-400 flex items-center justify-center mx-auto mb-3">
                  <KeyRound className="w-6 h-6" />
                </div>
                <h4 className="text-sm font-semibold text-white">Ingresa el Código de Seguridad</h4>
                <p className="text-xs text-stone-400 mt-1">
                  Enviado al teléfono <strong className="text-stone-200 font-mono">{phone}</strong>
                </p>
              </div>

              {/* Demo Helper Banner */}
              <div className="p-3 bg-stone-950 border border-stone-800 rounded-xl flex items-center justify-between text-xs">
                <span className="text-stone-400">Código OTP simulado: <strong className="text-rose-400 font-mono">{otpDemoCode}</strong></span>
                <button
                  onClick={handleFillDemoOtp}
                  className="text-xs text-rose-400 hover:text-rose-300 font-medium underline cursor-pointer"
                >
                  Autocompletar
                </button>
              </div>

              {/* 6 Digits inputs */}
              <div className="flex justify-between gap-2">
                {otpCode.map((digit, idx) => (
                  <input
                    key={idx}
                    id={`otp-${idx}`}
                    type="text"
                    maxLength={1}
                    value={digit}
                    onChange={e => handleOtpChange(idx, e.target.value)}
                    className="w-11 h-12 text-center font-mono text-lg font-bold bg-stone-950 border border-stone-800 focus:border-rose-500 rounded-xl text-white focus:outline-none transition-colors"
                  />
                ))}
              </div>

              {otpError && (
                <p className="text-xs text-rose-400 text-center">{otpError}</p>
              )}

              <button
                onClick={handleVerifyOtp}
                className="w-full py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs rounded-xl shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <ShieldCheck className="w-4 h-4" />
                <span>Verificar Cuenta & Autorizar Transacción</span>
              </button>

              <div className="text-center">
                <button
                  onClick={() => setStep('register')}
                  className="text-xs text-stone-400 hover:text-stone-300 transition-colors cursor-pointer"
                >
                  ← Modificar número o datos personales
                </button>
              </div>
            </div>
          )}

          {/* STEP 3: SUCCESS STATE */}
          {step === 'success' && (
            <div className="text-center space-y-4 py-3">
              <div className="w-14 h-14 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-7 h-7" />
              </div>

              <div>
                <h4 className="text-base font-semibold text-white">¡Identidad Verificada con Éxito!</h4>
                <p className="text-xs text-stone-400 mt-1">
                  Tu perfil ahora cuenta con la certificación <strong className="text-emerald-400">KYC Nivel 2 Antifraude</strong>.
                </p>
              </div>

              <div className="p-3.5 bg-stone-950 border border-stone-800 rounded-xl text-xs space-y-1.5 text-left">
                <div className="flex justify-between">
                  <span className="text-stone-400">Titular verificado:</span>
                  <span className="text-stone-200 font-medium">{fullName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-stone-400">Teléfono autenticado:</span>
                  <span className="text-stone-200 font-mono">{phone}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-stone-400">Berry Points acreditados:</span>
                  <span className="text-amber-400 font-bold">+250 pts</span>
                </div>
              </div>

              <button
                onClick={handleFinishAndCheckout}
                className="w-full py-3 bg-rose-600 hover:bg-rose-500 text-white font-semibold text-xs rounded-xl shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>Proceder al Pago Seguro</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
