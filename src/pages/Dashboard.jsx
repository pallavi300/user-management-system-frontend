import { Card } from "../components/ui/Card";
import { useAuth } from "../context/AuthContext";

function Stat({ label, value, tone }) {
  const tones = {
    violet: "from-violet-500/20 to-violet-500/5",
    blue: "from-blue-500/20 to-blue-500/5",
    emerald: "from-emerald-500/20 to-emerald-500/5",
  };
  return (
    <div
      className={[
        "rounded-2xl border border-black/5 dark:border-white/10 bg-white/60 dark:bg-white/5 p-4 shadow-sm",
        "bg-gradient-to-b",
        tones[tone] || tones.violet,
      ].join(" ")}
    >
      <div className="text-xs text-neutral-600 dark:text-neutral-300">{label}</div>
      <div className="mt-1 text-lg font-semibold text-neutral-900 dark:text-white">
        {value}
      </div>
    </div>
  );
}

export function Dashboard() {
  const { user } = useAuth();
  const canManageUsers = user?.role === "admin" || user?.role === "manager";

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-neutral-900 dark:text-white">
          Dashboard
        </h1>
        <p className="mt-1 text-sm text-neutral-600 dark:text-neutral-300">
          Role-based access is enabled. Your role is <span className="font-medium">{user?.role}</span>.
        </p>
      </div>

      <div className="grid gap-3 sm:grid-cols-3">
        <Stat label="Authenticated" value="Yes" tone="emerald" />
        <Stat label="Role" value={user?.role || "-"} tone="violet" />
        <Stat label="Users access" value={canManageUsers ? "Enabled" : "Restricted"} tone="blue" />
      </div>

      <Card
        title="What you can do"
        subtitle="Matches the assessment roles/permissions."
      >
        <ul className="text-sm text-neutral-700 dark:text-neutral-200 space-y-2">
          <li>
            <span className="font-medium">Admin</span>: create users, change roles, deactivate users, full access.
          </li>
          <li>
            <span className="font-medium">Manager</span>: view users; update non-admin name/status (no role changes).
          </li>
          <li>
            <span className="font-medium">User</span>: manage own profile only.
          </li>
        </ul>
      </Card>
    </div>
  );
}

