import { useState, type FormEvent } from "react";
import { Navigate, useLocation, useNavigate } from "react-router-dom";
import { Loader2 } from "lucide-react";
import Logo from "@/components/layout/Logo";
import { useAuth } from "@/context/AuthContext";
import { useDocumentTitle } from "@/hooks/useDocumentTitle";

const AdminLoginPage = () => {
  const { admin, login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  useDocumentTitle("Admin sign in");

  const from = (location.state as { from?: string } | null)?.from || "/admin";

  if (admin) return <Navigate to={from} replace />;

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    setError("");
    setBusy(true);
    try {
      await login(email, password);
      navigate(from, { replace: true });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Couldn't sign in.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-paper px-6 py-16">
        <form onSubmit={submit} className="w-full max-w-sm" noValidate>
          <Logo variant="mark" className="h-28" />
          <h1 className="mt-8 text-[24px]">Admin sign in</h1>
          <p className="mt-1 text-xs text-stone">For Carbon Culture staff only.</p>

          <div className="mt-8 space-y-5">
            <div>
              <label htmlFor="email" className="field-label">Email</label>
              <input
                id="email"
                type="email"
                autoComplete="username"
                className="field"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                required
              />
            </div>
            <div>
              <label htmlFor="password" className="field-label">Password</label>
              <input
                id="password"
                type="password"
                autoComplete="current-password"
                className="field"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                required
              />
            </div>
          </div>

          {error && (
            <p role="alert" className="mt-4 text-[14px] text-[#B42318]">
              {error}
            </p>
          )}

          <button type="submit" disabled={busy || !email || !password} className="btn mt-8 w-full py-4">
            {busy && <Loader2 className="h-4 w-4 animate-spin" />}
            Sign in
          </button>
        </form>
    </div>
  );
};

export default AdminLoginPage;
