import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { LogIn, UserPlus, Loader2, X } from 'lucide-react';
import { ANIMATION_CONFIG, FORM_CONFIG, MESSAGES } from '../utils/constants';
import { validateAuthForm } from '../utils/validation';

interface AuthProps {
  onClose?: () => void;
}

export function Auth({ onClose }: AuthProps) {
  const [isLogin, setIsLogin] = useState(true);
  const [isFlipping, setIsFlipping] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [username, setUsername] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { signIn, signUp } = useAuth();

  const handleToggleMode = () => {
    setIsFlipping(true);
    setError('');
    // Limpiar campos después de un pequeño delay para que la animación se vea
    setTimeout(() => {
      setEmail('');
      setPassword('');
      setFullName('');
      setUsername('');
    }, ANIMATION_CONFIG.FLIP_DELAY);
    // Cambiar el estado después de la mitad de la animación
    setTimeout(() => {
      setIsLogin(!isLogin);
      setIsFlipping(false);
    }, ANIMATION_CONFIG.FLIP_DURATION);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    // Validar formulario antes de enviar
    const validation = validateAuthForm(email, password, username, fullName);
    if (!validation.isValid) {
      setError(validation.errors[0]);
      return;
    }

    setLoading(true);

    try {
      if (isLogin) {
        await signIn(email, password);
      } else {
        await signUp(email, password, fullName, username);
      }
    } catch (err) {
      setError(
        err instanceof Error 
          ? err.message 
          : isLogin 
            ? MESSAGES.AUTH.LOGIN_ERROR 
            : MESSAGES.AUTH.REGISTER_ERROR
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative w-full">
      {/* Contenedor con animación de flip */}
      <div
        className="relative w-full"
        style={{ perspective: '1000px' }}
      >
        <div
          className={`relative w-full transition-transform duration-600 ease-in-out ${
            isFlipping ? 'pointer-events-none' : ''
          }`}
          style={{
            transformStyle: 'preserve-3d',
            transform: isLogin ? 'rotateY(0deg)' : 'rotateY(180deg)',
          }}
        >
          {/* Cara frontal - Login */}
          <div
            className="relative w-full"
            style={{
              backfaceVisibility: 'hidden',
              WebkitBackfaceVisibility: 'hidden',
              transform: 'rotateY(0deg)',
            }}
          >
            <div className="bg-slate-800 rounded-2xl shadow-2xl border border-slate-700 overflow-hidden relative">
              {/* Botón cerrar dentro del card */}
              {onClose && (
                <button
                  onClick={onClose}
                  className="absolute top-4 right-4 p-2 text-white/80 hover:text-white transition-colors z-10 bg-white/10 hover:bg-white/20 backdrop-blur-md rounded-full shadow-lg border border-white/20"
                >
                  <X className="w-5 h-5" />
                </button>
              )}
              <div className="p-8">
                <div className="text-center mb-8">
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl mb-4">
                    <LogIn className="w-8 h-8 text-white" />
                  </div>
                  <h2 className="text-3xl font-bold text-white mb-2">
                    Bienvenido de nuevo
                  </h2>
                  <p className="text-white/80 text-sm">
                    Inicia sesión para compartir tus proyectos
                  </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-5">
                  <div className="space-y-2">
                    <label
                      htmlFor="email-login"
                      className="block text-sm font-medium text-white/90"
                    >
                      Correo Electrónico
                    </label>
                    <input
                      id="email-login"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      className="w-full px-4 py-3 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition-all duration-200"
                      placeholder={FORM_CONFIG.PLACEHOLDERS.EMAIL}
                    />
                  </div>

                  <div className="space-y-2">
                    <label
                      htmlFor="password-login"
                      className="block text-sm font-medium text-white/90"
                    >
                      Contraseña
                    </label>
                    <input
                      id="password-login"
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      minLength={6}
                      className="w-full px-4 py-3 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition-all duration-200"
                      placeholder={FORM_CONFIG.PLACEHOLDERS.PASSWORD}
                    />
                  </div>

                  {error && isLogin && (
                    <div className="bg-red-500/20 backdrop-blur-sm border border-red-400/30 rounded-xl p-3">
                      <p className="text-red-200 text-sm text-center">{error}</p>
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={loading || isFlipping}
                    className="w-full font-semibold py-3 rounded-xl transition-all duration-300 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg bg-blue-600/80 backdrop-blur-sm hover:bg-blue-600 text-white border border-blue-400/30"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        <span>{MESSAGES.COMMON.PROCESSING}</span>
                      </>
                    ) : (
                      <span>Iniciar Sesión</span>
                    )}
                  </button>
                </form>

                <div className="mt-6 text-center">
                  <button
                    onClick={handleToggleMode}
                    disabled={isFlipping}
                    className="text-white/70 hover:text-white transition-colors text-sm font-medium disabled:opacity-50"
                  >
                    ¿No tienes una cuenta?{' '}
                    <span className="underline text-blue-300 hover:text-blue-200">
                      Crear cuenta
                    </span>
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Cara trasera - Registro */}
          <div
            className="absolute top-0 left-0 w-full"
            style={{
              backfaceVisibility: 'hidden',
              WebkitBackfaceVisibility: 'hidden',
              transform: 'rotateY(180deg)',
            }}
          >
            <div className="bg-slate-800 rounded-2xl shadow-2xl border border-slate-700 overflow-hidden relative">
              {/* Botón cerrar dentro del card */}
              {onClose && (
                <button
                  onClick={onClose}
                  className="absolute top-4 right-4 p-2 text-white/80 hover:text-white transition-colors z-10 bg-white/10 hover:bg-white/20 backdrop-blur-md rounded-full shadow-lg border border-white/20"
                >
                  <X className="w-5 h-5" />
                </button>
              )}
              <div className="p-8">
                <div className="text-center mb-8">
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl mb-4">
                    <UserPlus className="w-8 h-8 text-white" />
                  </div>
                  <h2 className="text-3xl font-bold text-white mb-2">
                    Crear Cuenta
                  </h2>
                  <p className="text-white/80 text-sm">
                    Únete a la comunidad de desarrolladores
                  </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-5">
                  <div className="space-y-2">
                    <label
                      htmlFor="fullName"
                      className="block text-sm font-medium text-white/90"
                    >
                      Nombre Completo
                    </label>
                    <input
                      id="fullName"
                      type="text"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      required
                      className="w-full px-4 py-3 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-purple-400 transition-all duration-200"
                      placeholder={FORM_CONFIG.PLACEHOLDERS.FULL_NAME}
                    />
                  </div>

                  <div className="space-y-2">
                    <label
                      htmlFor="username"
                      className="block text-sm font-medium text-white/90"
                    >
                      Nombre de Usuario
                    </label>
                    <input
                      id="username"
                      type="text"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      required
                      className="w-full px-4 py-3 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-purple-400 transition-all duration-200"
                      placeholder={FORM_CONFIG.PLACEHOLDERS.USERNAME}
                    />
                  </div>

                  <div className="space-y-2">
                    <label
                      htmlFor="email-signup"
                      className="block text-sm font-medium text-white/90"
                    >
                      Correo Electrónico
                    </label>
                    <input
                      id="email-signup"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      className="w-full px-4 py-3 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-purple-400 transition-all duration-200"
                      placeholder={FORM_CONFIG.PLACEHOLDERS.EMAIL}
                    />
                  </div>

                  <div className="space-y-2">
                    <label
                      htmlFor="password-signup"
                      className="block text-sm font-medium text-white/90"
                    >
                      Contraseña
                    </label>
                    <input
                      id="password-signup"
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      minLength={6}
                      className="w-full px-4 py-3 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-purple-400 transition-all duration-200"
                      placeholder={FORM_CONFIG.PLACEHOLDERS.PASSWORD}
                    />
                  </div>

                  {error && !isLogin && (
                    <div className="bg-red-500/20 backdrop-blur-sm border border-red-400/30 rounded-xl p-3">
                      <p className="text-red-200 text-sm text-center">{error}</p>
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={loading || isFlipping}
                    className="w-full font-semibold py-3 rounded-xl transition-all duration-300 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg bg-purple-600/80 backdrop-blur-sm hover:bg-purple-600 text-white border border-purple-400/30"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        <span>{MESSAGES.COMMON.PROCESSING}</span>
                      </>
                    ) : (
                      <span>Crear Cuenta</span>
                    )}
                  </button>
                </form>

                <div className="mt-6 text-center">
                  <button
                    onClick={handleToggleMode}
                    disabled={isFlipping}
                    className="text-white/70 hover:text-white transition-colors text-sm font-medium disabled:opacity-50"
                  >
                    ¿Ya tienes una cuenta?{' '}
                    <span className="underline text-purple-300 hover:text-purple-200">
                      Iniciar sesión
                    </span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
