import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { PATH } from "../constants/paths";
import { Eye, EyeOff, Mail } from "lucide-react";

type Mode = "login" | "register";

const PENDING_EMAIL_KEY = "pendingConfirmEmail";
const savePendingEmail  = (e: string) => localStorage.setItem(PENDING_EMAIL_KEY, e);
const clearPendingEmail = ()          => localStorage.removeItem(PENDING_EMAIL_KEY);
const getStoredPending  = ()          => localStorage.getItem(PENDING_EMAIL_KEY);

const inp =
  "w-full border border-brownish bg-transparent px-4 py-3 text-sm font-liter text-title placeholder:text-title/40 outline-none focus:border-textish transition-colors";

const Login = () => {
  const { signIn, signUp } = useAuth();
  const navigate = useNavigate();

  const [mode, setMode]            = useState<Mode>("login");
  const [email, setEmail]          = useState("");
  const [password, setPassword]    = useState("");
  const [showPass, setShowPass]    = useState(false);
  const [error, setError]          = useState<string | null>(null);
  const [loading, setLoading]      = useState(false);
  const [pendingEmail, setPending] = useState<string | null>(getStoredPending);

  const showConfirmation  = (e: string) => { savePendingEmail(e); setPending(e); };
  const dismissConfirmation = ()        => { clearPendingEmail(); setPending(null); };
  const switchMode = (next: Mode)       => { setMode(next); setError(null); };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    if (mode === "register") {
      const { error } = await signUp(email, password);
      if (error) {
        const isRate =
          error.toLowerCase().includes("rate limit") ||
          error.toLowerCase().includes("after");
        isRate ? showConfirmation(email) : setError(error);
      } else {
        showConfirmation(email);
      }
    } else {
      const { error } = await signIn(email, password);
      if (error) {
        if (error.includes("Email not confirmed")) {
          if (email) showConfirmation(email);
          setError("Please confirm your email first. Check your inbox.");
        } else {
          setError(error);
        }
      } else {
        clearPendingEmail();
        navigate(PATH.products);
      }
    }
    setLoading(false);
  };

  // ── Confirmation screen ───────────────────────────────────────────────────
  if (pendingEmail) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4 login-bg">
        <div className="w-full max-w-sm border border-brownish p-10 flex flex-col items-center gap-6 text-center">
          <div className="w-14 h-14 bg-brownish flex items-center justify-center">
            <Mail className="w-6 h-6 text-grayish" />
          </div>

          <div className="flex flex-col gap-2">
            <h2 className="font-liter text-2xl text-title">Check your email</h2>
            <p className="font-liter text-sm text-textish">
              We sent a confirmation link to
            </p>
            <p className="font-liter text-sm text-title break-all">{pendingEmail}</p>
          </div>

          <p className="font-liter text-xs text-textish leading-relaxed">
            Click the link to confirm your account, then come back to log in.
          </p>

          <div className="border border-brownish p-2 w-full">
            <button
              onClick={() => {
                setEmail(pendingEmail);
                setMode("login");
                setPassword("");
                dismissConfirmation();
              }}
              className="w-full font-liter text-sm text-grayish bg-brownish py-2.5 hover:bg-brownish/70 transition-colors cursor-pointer"
            >
              Go to Log In
            </button>
          </div>

          <button
            onClick={() => { setMode("register"); dismissConfirmation(); }}
            className="font-liter text-xs text-textish underline underline-offset-4 cursor-pointer hover:text-title transition-colors"
          >
            Back to register
          </button>
        </div>
      </div>
    );
  }

  // ── Auth form ─────────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="w-full max-w-sm flex flex-col gap-8">

        {/* Brand */}
        <div className="flex flex-col items-center gap-1 text-center">
          <Link
            to={PATH.home}
            className="font-liter italic text-title text-3xl hover:opacity-70 transition-opacity"
          >
            Lycoris
          </Link>
          <p className="font-liter text-sm text-textish">
            {mode === "login" ? "Welcome back" : "Create your account"}
          </p>
        </div>

        {/* Mode tabs */}
        <div className="flex border border-brownish">
          {(["login", "register"] as Mode[]).map((m) => (
            <button
              key={m}
              type="button"
              onClick={() => switchMode(m)}
              className={`flex-1 py-2.5 font-liter text-sm transition-colors cursor-pointer ${
                mode === m
                  ? "bg-brownish text-grayish"
                  : "text-textish hover:bg-brownish/20"
              }`}
            >
              {m === "login" ? "Log In" : "Register"}
            </button>
          ))}
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-5">

          <div className="flex flex-col gap-1.5">
            <label className="font-liter text-xs text-textish uppercase tracking-widest">
              Email
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              className={inp}
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="font-liter text-xs text-textish uppercase tracking-widest">
              Password
            </label>
            <div className="relative">
              <input
                type={showPass ? "text" : "password"}
                required
                minLength={6}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className={`${inp} pr-11`}
              />
              <button
                type="button"
                onClick={() => setShowPass((v) => !v)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-textish/50 hover:text-textish transition-colors cursor-pointer"
                aria-label={showPass ? "Hide password" : "Show password"}
              >
                {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
            {mode === "register" && (
              <p className="font-liter text-xs text-textish/60">Minimum 6 characters</p>
            )}
          </div>

          {error && (
            <p className="font-liter text-xs text-pinkish text-center">{error}</p>
          )}

          <div className="border border-brownish p-2">
            <button
              type="submit"
              disabled={loading}
              className="w-full font-liter text-sm text-grayish bg-brownish py-2.5 hover:bg-brownish/70 transition-colors disabled:opacity-50 cursor-pointer"
            >
              {loading
                ? "Please wait..."
                : mode === "login" ? "Log In" : "Create Account"}
            </button>
          </div>
        </form>

        {/* Switch mode */}
        <p className="font-liter text-xs text-center text-textish">
          {mode === "login" ? "Don't have an account? " : "Already have an account? "}
          <button
            type="button"
            onClick={() => switchMode(mode === "login" ? "register" : "login")}
            className="text-title underline underline-offset-4 cursor-pointer hover:opacity-70 transition-opacity"
          >
            {mode === "login" ? "Register" : "Log In"}
          </button>
        </p>

      </div>
    </div>
  );
};

export default Login;
