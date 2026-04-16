import { useEffect, useState } from "react";
import { api } from "../lib/api";
import { useAuth } from "../context/AuthContext";
import { Card } from "../components/ui/Card";
import { Input } from "../components/ui/Input";
import { Button } from "../components/ui/Button";

export function MyProfile() {
  const { user, refresh } = useAuth();
  const [name, setName] = useState(user?.name || "");
  const [password, setPassword] = useState("");
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    setName(user?.name || "");
  }, [user?.name]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-neutral-900 dark:text-white">
          My Profile
        </h1>
        <p className="mt-1 text-sm text-neutral-600 dark:text-neutral-300">
          Update your name and password.
        </p>
      </div>

      <Card title="Profile">
        <div className="grid gap-4 sm:grid-cols-2">
          <Input label="Email" value={user?.email || ""} disabled />
          <Input label="Role" value={user?.role || ""} disabled />
        </div>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <Input
            label="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Your name"
          />
          <Input
            label="New password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Leave blank to keep current"
          />
        </div>

        {error ? (
          <div className="mt-3 text-sm text-red-600 dark:text-red-400">
            {error}
          </div>
        ) : msg ? (
          <div className="mt-3 text-sm text-emerald-700 dark:text-emerald-300">
            {msg}
          </div>
        ) : null}

        <div className="mt-4 flex justify-end">
          <Button
            disabled={saving}
            onClick={async () => {
              setSaving(true);
              setError("");
              setMsg("");
              try {
                const payload = {};
                if (name.trim()) payload.name = name.trim();
                if (password.trim()) payload.password = password.trim();
                await api.patch("/api/profile", payload);
                setPassword("");
                await refresh();
                setMsg("Saved.");
              } catch (err) {
                setError(err?.response?.data?.message || "Save failed");
              } finally {
                setSaving(false);
              }
            }}
          >
            {saving ? "Saving…" : "Save changes"}
          </Button>
        </div>
      </Card>
    </div>
  );
}

