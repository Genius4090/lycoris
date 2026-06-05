import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { PATH } from "../constants/paths";

type Mode = "login" | "register";

const PENDING_EMAIL_KEY = "pendingConfirmEmail";

// Persist across page close/refresh
const savePendingEmail = (email: string) =>
  localStorage.setItem(PENDING_EMAIL_KEY, email);

const clearPendingEmail = () =>
  localStorage.removeItem(PENDING_EMAIL_KEY);

const getStoredPendingEmail = () =>
  localStorage.getItem(PENDING_EMAIL_KEY);

const Login = () => {
  const { signIn, signUp } = useAuth();
  const navigate = useNavigate();

  const [mode, setMode] = useState<Mode>("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // Initialise from localStorage so the box survives a page refresh/close
  const [pendingEmail, setPendingEmail] = useState<string | null>(
    getStoredPendingEmail
  );

  const showConfirmation = (email: string) => {
    savePendingEmail(email);
    setPendingEmail(email);
  };

  const dismissConfirmation = () => {
    clearPendingEmail();
    setPendingEmail(null);
  };

  const switchMode = (next: Mode) => {
    setMode(next);
    setError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    if (mode === "register") {
      const { error } = await signUp(email, password);
      if (error) {
        // Supabase rate-limits resends — if the user already registered this
        // email and is within the cooldown, show the confirmation box again
        // instead of a confusing error message.
        if (
          error.toLowerCase().includes("rate limit") ||
          error.toLowerCase().includes("email rate limit") ||
          error.toLowerCase().includes("after") // "try again after X seconds"
        ) {
          showConfirmation(email);
        } else {
          setError(error);
        }
      } else {
        showConfirmation(email);
      }
    } else {
      const { error } = await signIn(email, password);
      if (error) {
        if (error.includes("Email not confirmed")) {
          // They confirmed the email in another tab — show the box again
          // so they can easily switch to login
          if (email) showConfirmation(email);
          setError("Please confirm your email first. Check your inbox for a confirmation link.");
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

  // ── Confirmation pending screen ──────────────────────────────────────────
  if (pendingEmail) {
    return (
      <div className="containers flex justify-center items-start pt-10">
        <div className="w-full max-w-sm border rounded-xl p-8 flex flex-col items-center gap-5 text-center">
          <div className="w-14 h-14 rounded-full bg-black flex items-center justify-center text-2xl text-white">
            ✉
          </div>

          <div className="flex flex-col gap-1">
            <h2 className="text-xl font-semibold">Check your email</h2>
            <p className="text-sm text-gray-500">
              We sent a confirmation link to
            </p>
            <p className="text-sm font-medium break-all">{pendingEmail}</p>
          </div>

          <p className="text-xs text-gray-400">
            Click the link in the email to confirm your account, then come back
            here to log in.
          </p>

          <button
            onClick={() => {
              setEmail(pendingEmail);
              setMode("login");
              setPassword("");
              dismissConfirmation();
            }}
            className="w-full bg-black text-white rounded-lg py-2 text-sm font-medium cursor-pointer"
          >
            Go to Log In
          </button>

          <button
            type="button"
            onClick={() => {
              setMode("register");
              dismissConfirmation();
            }}
            className="text-xs text-gray-400 underline"
          >
            Back to register
          </button>
        </div>
      </div>
    );
  }

  // ── Auth form ────────────────────────────────────────────────────────────
  return (
    <div className="containers flex justify-center items-start pt-10">
      <div className="w-full max-w-sm border rounded-xl p-8 flex flex-col gap-6">
        {/* Toggle tabs */}
        <div className="flex border rounded-lg overflow-hidden">
          <button
            type="button"
            onClick={() => switchMode("login")}
            className={`flex-1 py-2 text-sm font-medium transition-colors ${
              mode === "login" ? "bg-black text-white" : "bg-white text-black"
            }`}
          >
            Log In
          </button>
          <button
            type="button"
            onClick={() => switchMode("register")}
            className={`flex-1 py-2 text-sm font-medium transition-colors ${
              mode === "register" ? "bg-black text-white" : "bg-white text-black"
            }`}
          >
            Register
          </button>
        </div>

        <h2 className="text-xl font-semibold text-center">
          {mode === "login" ? "Welcome back" : "Create an account"}
        </h2>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium">Email</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              className="border rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-black"
            />
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium">Password</label>
            <input
              type="password"
              required
              minLength={6}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="border rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-black"
            />
          </div>

          {error && (
            <p className="text-red-500 text-sm text-center">{error}</p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="bg-black text-white rounded-lg py-2 text-sm font-medium disabled:opacity-50 cursor-pointer"
          >
            {loading
              ? "Please wait..."
              : mode === "login"
              ? "Log In"
              : "Create Account"}
          </button>
        </form>

        <p className="text-xs text-center text-gray-500">
          {mode === "login" ? "Don't have an account? " : "Already have an account? "}
          <button
            type="button"
            onClick={() => switchMode(mode === "login" ? "register" : "login")}
            className="underline font-medium text-black"
          >
            {mode === "login" ? "Register" : "Log In"}
          </button>
        </p>
      </div>
    </div>
  );
};

export default Login;
