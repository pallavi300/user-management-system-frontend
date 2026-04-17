import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function NavItem({ to, children, end }) {
  return (
    <NavLink
      to={to}
      end={end}
      className={({ isActive }) =>
        [
          "px-3 py-2 rounded-lg text-sm transition",
          isActive
            ? "bg-white/70 dark:bg-white/10 text-neutral-900 dark:text-white shadow-sm"
            : "text-neutral-600 hover:text-neutral-900 dark:text-neutral-300 dark:hover:text-white hover:bg-white/50 dark:hover:bg-white/5",
        ].join(" ")
      }
    >
      {children}
    </NavLink>
  );
}

export function AppShell() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const canSeeUsers = user?.role === "admin" || user?.role === "manager";

  return (
    <div className="min-h-screen">
      <header className="sticky top-0 z-10 backdrop-blur border-b border-black/5 dark:border-white/10 bg-white/40 dark:bg-black/20">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="size-9 rounded-xl bg-gradient-to-br from-violet-500 to-blue-500 shadow-sm" />
            <div className="leading-tight">
              <div className="font-semibold text-neutral-900 dark:text-white">
                User Management
              </div>
              <div className="text-xs text-neutral-600 dark:text-neutral-300">
                {user?.email} · {user?.role}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <nav className="hidden sm:flex items-center gap-1 rounded-xl bg-white/50 dark:bg-white/5 p-1 border border-black/5 dark:border-white/10">
              <NavItem to="/" end>
                Dashboard
              </NavItem>
              {canSeeUsers ? <NavItem to="/users">Users</NavItem> : null}
              <NavItem to="/me">My Profile</NavItem>
            </nav>

            <button
              className="px-3 py-2 rounded-lg text-sm bg-neutral-900 text-white hover:bg-neutral-800 dark:bg-white dark:text-black dark:hover:bg-neutral-200 transition"
              onClick={async () => {
                await logout();
                navigate("/login", { replace: true });
              }}
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-8">
        <Outlet />
      </main>
    </div>
  );
}
