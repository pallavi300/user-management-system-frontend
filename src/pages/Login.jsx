import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { Card } from "../components/ui/Card";
import { Input } from "../components/ui/Input";
import { Button } from "../components/ui/Button";

export function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const isProd = import.meta.env.PROD;
  const [email, setEmail] = useState(isProd ? "" : "admin@example.com");
  const [password, setPassword] = useState(isProd ? "" : "Password@123");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  return (
    <div className="min-h-screen grid place-items-center px-4">
      <div className="w-full max-w-md">
        <div className="mb-6 text-center">
          <div className="mx-auto mb-3 size-12 rounded-2xl bg-gradient-to-br from-violet-500 to-blue-500 shadow-sm" />
          <h1 className="text-2xl font-semibold text-neutral-900 dark:text-white">
            Sign in
          </h1>
          <p className="mt-1 text-sm text-neutral-600 dark:text-neutral-300">
            Use your email and password to continue.
          </p>
        </div>

        <Card
          title="Login"
          subtitle="JWT is stored in an httpOnly cookie."
        >
          <form
            className="space-y-4"
            onSubmit={async (e) => {
              e.preventDefault();
              setError("");
              setLoading(true);
              try {
                await login(email, password);
                navigate("/", { replace: true });
              } catch (err) {
                setError(err?.response?.data?.message || "Login failed");
              } finally {
                setLoading(false);
              }
            }}
          >
            <Input
              label="Email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="email"
              placeholder="you@example.com"
              required
            />
            <Input
              label="Password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="current-password"
              required
            />

            {error ? (
              <div className="text-sm text-red-600 dark:text-red-400">{error}</div>
            ) : null}

            <Button className="w-full" disabled={loading} type="submit">
              {loading ? "Signing in…" : "Sign in"}
            </Button>
          </form>
        </Card>

        {!isProd ? (
          <div className="mt-4 text-xs text-neutral-600 dark:text-neutral-300 text-center">
            Demo: admin@example.com / Password@123
          </div>
        ) : null}
      </div>
    </div>
  );
}

