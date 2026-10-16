import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { LockIcon, SunIcon, MoonIcon, GoogleIcon } from './Icons';

const ERROR_MESSAGES = {
  'Invalid login credentials': 'Email o contraseña incorrectos.',
  'User already registered': 'Ya existe una cuenta con ese email. Inicia sesión con tu contraseña o con Google.',
  'Email not confirmed': 'Confirma tu email antes de iniciar sesión. Revisa tu bandeja de entrada.',
  'Unsupported provider: provider is not enabled': 'El inicio de sesión con Google aún no está habilitado.',
};

function friendlyError(err) {
  const msg = err?.message ?? String(err);
  if (ERROR_MESSAGES[msg]) return ERROR_MESSAGES[msg];
  if (/password should be at least/i.test(msg)) return 'La contraseña debe tener al menos 6 caracteres.';
  if (/rate limit/i.test(msg)) return 'Demasiados intentos. Espera un momento y vuelve a probar.';
  if (/invalid.*email|email.*invalid/i.test(msg)) return 'El email no es válido.';
  if (/failed to fetch|network/i.test(msg)) return 'No se pudo conectar con el servidor. Revisa tu conexión.';
  return msg;
}

const inputClass = 'w-full py-2.5 px-3.5 rounded-[10px] border border-warm-200 dark:border-dark-500 bg-warm-50 dark:bg-dark-700 text-base sm:text-sm text-warm-800 dark:text-dark-100 placeholder:text-warm-400 dark:placeholder:text-dark-400 outline-none focus:border-lavender transition-colors';
const labelClass = 'block text-[13px] font-semibold text-warm-600 dark:text-dark-300 mb-1.5';

export default function AuthScreen({ dark, onToggleTheme }) {
  const { signIn, signUp, signInWithGoogle } = useAuth();
  const [mode, setMode] = useState('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');
  const [busy, setBusy] = useState(false);

  const isLogin = mode === 'login';

  const switchMode = () => {
    setMode(isLogin ? 'signup' : 'login');
    setError('');
    setNotice('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setNotice('');
    setBusy(true);
    try {
      if (isLogin) {
        await signIn(email.trim(), password);
      } else {
        const needsConfirmation = await signUp(email.trim(), password);
        if (needsConfirmation) {
          setNotice('Cuenta creada. Te hemos enviado un email para confirmarla.');
          setMode('login');
          setPassword('');
        }
      }
    } catch (err) {
      setError(friendlyError(err));
    } finally {
      setBusy(false);
    }
  };

  const handleGoogle = async () => {
    setError('');
    setNotice('');
    try {
      await signInWithGoogle();
    } catch (err) {
      setError(friendlyError(err));
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-warm-50 dark:bg-dark-900 text-warm-800 dark:text-dark-100 transition-colors">
      <div className="flex justify-end px-4 sm:px-10 pt-[max(0.75rem,env(safe-area-inset-top))] py-3">
        <button
          onClick={onToggleTheme}
          className="w-[38px] h-[38px] rounded-[10px] border border-warm-200 dark:border-dark-500 bg-white dark:bg-dark-700 flex items-center justify-center text-warm-600 dark:text-dark-200 hover:bg-warm-100 dark:hover:bg-dark-600 transition-colors cursor-pointer"
          aria-label={dark ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro'}
        >
          {dark ? <MoonIcon /> : <SunIcon />}
        </button>
      </div>

      <main className="flex-1 flex items-center justify-center px-4 pb-[max(2rem,env(safe-area-inset-bottom))]">
        <div className="w-full max-w-sm">
          <div className="flex flex-col items-center text-center mb-7">
            <div className="w-[72px] h-[72px] rounded-full bg-gradient-to-br from-[#EDE7F6] via-[#F3E5F5] to-[#FCE4EC] dark:from-[#2a2545] dark:via-[#2e2540] dark:to-[#352535] flex items-center justify-center mb-4">
              <LockIcon className="w-8 h-8" stroke="#C3B1E1" />
            </div>
            <h1 className="text-[22px] font-bold tracking-tight">Prompt Vault</h1>
            <p className="text-[14px] text-warm-500 dark:text-dark-300 mt-1">
              {isLogin ? 'Inicia sesión para acceder a tu bóveda' : 'Crea tu cuenta para empezar a guardar'}
            </p>
          </div>

          <div className="bg-white dark:bg-dark-800 border border-warm-200 dark:border-dark-600 rounded-2xl p-5 sm:p-7 shadow-sm">
            <button
              onClick={handleGoogle}
              type="button"
              className="w-full flex items-center justify-center gap-2.5 py-2.5 rounded-[10px] border border-warm-200 dark:border-dark-500 bg-white dark:bg-dark-700 text-sm font-medium text-warm-700 dark:text-dark-100 hover:bg-warm-50 dark:hover:bg-dark-600 transition-colors cursor-pointer"
            >
              <GoogleIcon />
              Iniciar sesión con Google
            </button>

            <div className="flex items-center gap-3 my-5">
              <div className="flex-1 h-px bg-warm-200 dark:bg-dark-500" />
              <span className="text-[12px] text-warm-400 dark:text-dark-400">o con tu email</span>
              <div className="flex-1 h-px bg-warm-200 dark:bg-dark-500" />
            </div>

            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <div>
                <label htmlFor="auth-email" className={labelClass}>Email</label>
                <input
                  id="auth-email"
                  type="email"
                  autoComplete="email"
                  required
                  placeholder="tu@email.com"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  className={inputClass}
                />
              </div>
              <div>
                <label htmlFor="auth-password" className={labelClass}>Contraseña</label>
                <input
                  id="auth-password"
                  type="password"
                  autoComplete={isLogin ? 'current-password' : 'new-password'}
                  required
                  minLength={6}
                  placeholder={isLogin ? 'Tu contraseña' : 'Mínimo 6 caracteres'}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  className={inputClass}
                />
              </div>

              {error && (
                <p role="alert" className="text-[13px] leading-snug text-danger bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-900/40 rounded-[10px] px-3.5 py-2.5">
                  {error}
                </p>
              )}
              {notice && (
                <p role="status" className="text-[13px] leading-snug text-[#2E6644] dark:text-mint bg-mint/20 dark:bg-mint/10 border border-mint/60 rounded-[10px] px-3.5 py-2.5">
                  {notice}
                </p>
              )}

              <button
                type="submit"
                disabled={busy}
                className="w-full py-2.5 rounded-[10px] bg-lavender text-warm-800 dark:text-dark-900 text-sm font-semibold hover:brightness-95 transition disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
              >
                {busy ? 'Un momento...' : isLogin ? 'Iniciar sesión' : 'Crear cuenta'}
              </button>
            </form>
          </div>

          <p className="text-center text-[13px] text-warm-500 dark:text-dark-300 mt-5">
            {isLogin ? '¿No tienes cuenta?' : '¿Ya tienes cuenta?'}{' '}
            <button onClick={switchMode} className="font-semibold text-[#5B4682] dark:text-lavender hover:underline cursor-pointer">
              {isLogin ? 'Regístrate' : 'Inicia sesión'}
            </button>
          </p>
        </div>
      </main>
    </div>
  );
}
