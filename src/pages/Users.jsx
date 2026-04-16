import { useEffect, useMemo, useState } from "react";
import { api } from "../lib/api";
import { useAuth } from "../context/AuthContext";
import { Card } from "../components/ui/Card";
import { Input } from "../components/ui/Input";
import { Button } from "../components/ui/Button";

function Badge({ children }) {
  return (
    <span className="inline-flex items-center rounded-full px-2 py-0.5 text-xs border border-black/10 dark:border-white/10 bg-white/60 dark:bg-white/5 text-neutral-700 dark:text-neutral-200">
      {children}
    </span>
  );
}

export function Users() {
  const { user } = useAuth();
  const canManage = user?.role === "admin" || user?.role === "manager";
  const isAdmin = user?.role === "admin";

  const [q, setQ] = useState("");
  const [role, setRole] = useState("");
  const [status, setStatus] = useState("");
  const [page, setPage] = useState(1);

  const [items, setItems] = useState([]);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [selected, setSelected] = useState(null);
  const [editName, setEditName] = useState("");
  const [editStatus, setEditStatus] = useState("");
  const [editRole, setEditRole] = useState("");
  const [saving, setSaving] = useState(false);
  const [detailLoading, setDetailLoading] = useState(false);
  const [detailError, setDetailError] = useState("");

  const [createOpen, setCreateOpen] = useState(false);
  const [createName, setCreateName] = useState("");
  const [createEmail, setCreateEmail] = useState("");
  const [createPassword, setCreatePassword] = useState("");
  const [createRole, setCreateRole] = useState("user");
  const [createStatus, setCreateStatus] = useState("active");
  const [creating, setCreating] = useState(false);
  const [createError, setCreateError] = useState("");
  const [generatedPassword, setGeneratedPassword] = useState("");

  const queryParams = useMemo(() => {
    const params = { page, limit: 10 };
    if (q.trim()) params.q = q.trim();
    if (role) params.role = role;
    if (status) params.status = status;
    return params;
  }, [q, role, status, page]);

  async function load() {
    setLoading(true);
    setError("");
    try {
      const { data } = await api.get("/api/users", { params: queryParams });
      setItems(data.items);
      setTotalPages(data.totalPages || 1);
    } catch (err) {
      setError(err?.response?.data?.message || "Failed to load users");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (!canManage) return;
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [JSON.stringify(queryParams), canManage]);

  async function open(userRow) {
    setDetailError("");
    setDetailLoading(true);
    setSelected(userRow);
    setEditName(userRow.name || "");
    setEditStatus(userRow.status || "active");
    setEditRole(userRow.role || "user");
    try {
      const { data } = await api.get(`/api/users/${userRow.id}`);
      setSelected(data.user);
      setEditName(data.user?.name || "");
      setEditStatus(data.user?.status || "active");
      setEditRole(data.user?.role || "user");
    } catch (err) {
      setDetailError(err?.response?.data?.message || "Failed to load user details");
    } finally {
      setDetailLoading(false);
    }
  }

  const canEditSelected = useMemo(() => {
    if (!selected) return false;
    if (isAdmin) return true;
    // manager rules: cannot edit admins, no role changes (backend enforces too)
    return selected.role !== "admin";
  }, [selected, isAdmin]);

  if (!canManage) {
    return (
      <Card title="Users" subtitle="You don't have access to this page.">
        <div className="text-sm text-neutral-700 dark:text-neutral-200">
          Only Admin and Manager can view the user list.
        </div>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-end justify-between gap-3 flex-wrap">
        <div>
          <h1 className="text-2xl font-semibold text-neutral-900 dark:text-white">
            Users
          </h1>
          <p className="mt-1 text-sm text-neutral-600 dark:text-neutral-300">
            Search, filter, and view user details.
          </p>
        </div>
        <div className="flex items-center gap-2">
          {isAdmin ? (
            <Button
              onClick={() => {
                setCreateError("");
                setGeneratedPassword("");
                setCreateName("");
                setCreateEmail("");
                setCreatePassword("");
                setCreateRole("user");
                setCreateStatus("active");
                setCreateOpen(true);
              }}
            >
              Create user
            </Button>
          ) : null}
          <Button variant="secondary" onClick={load} disabled={loading}>
            Refresh
          </Button>
        </div>
      </div>

      {createOpen ? (
        <Card
          title="Create user"
          subtitle="Admin only. Leave password blank to auto-generate one."
          actions={
            <Button
              variant="secondary"
              onClick={() => {
                setCreateOpen(false);
              }}
              disabled={creating}
            >
              Close
            </Button>
          }
        >
          <div className="space-y-4">
            <div className="grid gap-3 sm:grid-cols-2">
              <Input
                label="Name"
                value={createName}
                onChange={(e) => setCreateName(e.target.value)}
                placeholder="Full name"
              />
              <Input
                label="Email"
                type="email"
                value={createEmail}
                onChange={(e) => setCreateEmail(e.target.value)}
                placeholder="user@example.com"
              />
            </div>
            <div className="grid gap-3 sm:grid-cols-3">
              <Input
                label="Password (optional)"
                type="text"
                value={createPassword}
                onChange={(e) => setCreatePassword(e.target.value)}
                placeholder="Leave blank to generate"
              />
              <label className="block">
                <div className="text-sm font-medium text-neutral-900 dark:text-white">Role</div>
                <select
                  className="mt-1 w-full rounded-lg border border-black/10 dark:border-white/10 bg-white/70 dark:bg-black/20 px-3 py-2.5 text-sm text-neutral-900 dark:text-white"
                  value={createRole}
                  onChange={(e) => setCreateRole(e.target.value)}
                >
                  <option value="admin">admin</option>
                  <option value="manager">manager</option>
                  <option value="user">user</option>
                </select>
              </label>
              <label className="block">
                <div className="text-sm font-medium text-neutral-900 dark:text-white">Status</div>
                <select
                  className="mt-1 w-full rounded-lg border border-black/10 dark:border-white/10 bg-white/70 dark:bg-black/20 px-3 py-2.5 text-sm text-neutral-900 dark:text-white"
                  value={createStatus}
                  onChange={(e) => setCreateStatus(e.target.value)}
                >
                  <option value="active">active</option>
                  <option value="inactive">inactive</option>
                </select>
              </label>
            </div>

            {createError ? (
              <div className="text-sm text-red-600 dark:text-red-400">{createError}</div>
            ) : null}
            {generatedPassword ? (
              <div className="rounded-xl border border-black/10 dark:border-white/10 bg-white/60 dark:bg-white/5 p-3">
                <div className="text-xs text-neutral-600 dark:text-neutral-300">
                  Generated password (copy it now):
                </div>
                <div className="mt-1 flex items-center justify-between gap-3">
                  <div className="font-mono text-sm text-neutral-900 dark:text-white">
                    {generatedPassword}
                  </div>
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={async () => {
                      try {
                        await navigator.clipboard.writeText(generatedPassword);
                      } catch {
                        // ignore
                      }
                    }}
                  >
                    Copy
                  </Button>
                </div>
              </div>
            ) : null}

            <div className="flex justify-end">
              <Button
                disabled={creating}
                onClick={async () => {
                  setCreating(true);
                  setCreateError("");
                  setGeneratedPassword("");
                  try {
                    const payload = {
                      name: createName.trim(),
                      email: createEmail.trim(),
                      role: createRole,
                      status: createStatus,
                    };
                    if (createPassword.trim()) payload.password = createPassword.trim();
                    const { data } = await api.post("/api/users", payload);
                    setGeneratedPassword(data.generatedPassword || "");
                    await load();
                  } catch (err) {
                    setCreateError(err?.response?.data?.message || "Create failed");
                  } finally {
                    setCreating(false);
                  }
                }}
              >
                {creating ? "Creating…" : "Create"}
              </Button>
            </div>
          </div>
        </Card>
      ) : null}

      <Card title="Filters" subtitle="Search by name/email and filter by role/status.">
        <div className="grid gap-3 sm:grid-cols-3">
          <Input label="Search" value={q} onChange={(e) => setQ(e.target.value)} placeholder="name or email" />
          <label className="block">
            <div className="text-sm font-medium text-neutral-900 dark:text-white">Role</div>
            <select
              className="mt-1 w-full rounded-lg border border-black/10 dark:border-white/10 bg-white/70 dark:bg-black/20 px-3 py-2.5 text-sm text-neutral-900 dark:text-white"
              value={role}
              onChange={(e) => {
                setRole(e.target.value);
                setPage(1);
              }}
            >
              <option value="">All</option>
              <option value="admin">admin</option>
              <option value="manager">manager</option>
              <option value="user">user</option>
            </select>
          </label>
          <label className="block">
            <div className="text-sm font-medium text-neutral-900 dark:text-white">Status</div>
            <select
              className="mt-1 w-full rounded-lg border border-black/10 dark:border-white/10 bg-white/70 dark:bg-black/20 px-3 py-2.5 text-sm text-neutral-900 dark:text-white"
              value={status}
              onChange={(e) => {
                setStatus(e.target.value);
                setPage(1);
              }}
            >
              <option value="">All</option>
              <option value="active">active</option>
              <option value="inactive">inactive</option>
            </select>
          </label>
        </div>
      </Card>

      <Card
        title="User list"
        subtitle={loading ? "Loading…" : `${items.length} users shown`}
        actions={
          <div className="flex items-center gap-2">
            <Button
              variant="secondary"
              disabled={page <= 1 || loading}
              onClick={() => setPage((p) => Math.max(1, p - 1))}
            >
              Prev
            </Button>
            <div className="text-xs text-neutral-600 dark:text-neutral-300">
              Page {page} / {totalPages}
            </div>
            <Button
              variant="secondary"
              disabled={page >= totalPages || loading}
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            >
              Next
            </Button>
          </div>
        }
      >
        {error ? (
          <div className="text-sm text-red-600 dark:text-red-400">{error}</div>
        ) : null}

        <div className="mt-2 overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="text-left text-neutral-600 dark:text-neutral-300">
              <tr className="border-b border-black/5 dark:border-white/10">
                <th className="py-2 pr-3">Name</th>
                <th className="py-2 pr-3">Email</th>
                <th className="py-2 pr-3">Role</th>
                <th className="py-2 pr-3">Status</th>
                <th className="py-2 pr-3"></th>
              </tr>
            </thead>
            <tbody>
              {items.map((u) => (
                <tr
                  key={u.id}
                  className="border-b border-black/5 dark:border-white/10 hover:bg-white/40 dark:hover:bg-white/5"
                >
                  <td className="py-2 pr-3 text-neutral-900 dark:text-white">
                    {u.name}
                  </td>
                  <td className="py-2 pr-3 text-neutral-700 dark:text-neutral-200">
                    {u.email}
                  </td>
                  <td className="py-2 pr-3">
                    <Badge>{u.role}</Badge>
                  </td>
                  <td className="py-2 pr-3">
                    <Badge>{u.status}</Badge>
                  </td>
                  <td className="py-2 pr-3 text-right">
                    <Button variant="secondary" size="sm" onClick={() => open(u)}>
                      View / Edit
                    </Button>
                  </td>
                </tr>
              ))}
              {items.length === 0 && !loading ? (
                <tr>
                  <td className="py-6 text-center text-neutral-600 dark:text-neutral-300" colSpan={5}>
                    No users found.
                  </td>
                </tr>
              ) : null}
            </tbody>
          </table>
        </div>
      </Card>

      {selected ? (
        <Card
          title="Edit user"
          subtitle={`${selected.email} · ${selected.role}`}
          actions={
            <Button variant="secondary" onClick={() => setSelected(null)}>
              Close
            </Button>
          }
        >
          {detailError ? (
            <div className="mb-3 text-sm text-red-600 dark:text-red-400">{detailError}</div>
          ) : null}
          {!canEditSelected ? (
            <div className="text-sm text-neutral-700 dark:text-neutral-200">
              You don’t have permission to edit this user.
            </div>
          ) : (
            <div className="space-y-4">
              <div className="rounded-2xl border border-black/5 dark:border-white/10 bg-white/40 dark:bg-white/5 p-3">
                <div className="text-xs text-neutral-600 dark:text-neutral-300">
                  Details / Audit
                </div>
                <div className="mt-2 grid gap-2 sm:grid-cols-2 text-sm">
                  <div className="text-neutral-700 dark:text-neutral-200">
                    <span className="text-neutral-600 dark:text-neutral-300">Created:</span>{" "}
                    {selected.createdAt ? new Date(selected.createdAt).toLocaleString() : "-"}
                  </div>
                  <div className="text-neutral-700 dark:text-neutral-200">
                    <span className="text-neutral-600 dark:text-neutral-300">Updated:</span>{" "}
                    {selected.updatedAt ? new Date(selected.updatedAt).toLocaleString() : "-"}
                  </div>
                  <div className="text-neutral-700 dark:text-neutral-200">
                    <span className="text-neutral-600 dark:text-neutral-300">Created by:</span>{" "}
                    {selected.createdBy ? String(selected.createdBy) : "-"}
                  </div>
                  <div className="text-neutral-700 dark:text-neutral-200">
                    <span className="text-neutral-600 dark:text-neutral-300">Updated by:</span>{" "}
                    {selected.updatedBy ? String(selected.updatedBy) : "-"}
                  </div>
                </div>
                {detailLoading ? (
                  <div className="mt-2 text-xs text-neutral-600 dark:text-neutral-300">
                    Refreshing details…
                  </div>
                ) : null}
              </div>

              <div className="grid gap-3 sm:grid-cols-3">
                <Input label="Name" value={editName} onChange={(e) => setEditName(e.target.value)} />
                <label className="block">
                  <div className="text-sm font-medium text-neutral-900 dark:text-white">Status</div>
                  <select
                    className="mt-1 w-full rounded-lg border border-black/10 dark:border-white/10 bg-white/70 dark:bg-black/20 px-3 py-2.5 text-sm text-neutral-900 dark:text-white"
                    value={editStatus}
                    onChange={(e) => setEditStatus(e.target.value)}
                  >
                    <option value="active">active</option>
                    <option value="inactive">inactive</option>
                  </select>
                </label>
                <label className="block">
                  <div className="text-sm font-medium text-neutral-900 dark:text-white">Role</div>
                  <select
                    disabled={!isAdmin}
                    className="mt-1 w-full rounded-lg border border-black/10 dark:border-white/10 bg-white/70 dark:bg-black/20 px-3 py-2.5 text-sm text-neutral-900 dark:text-white disabled:opacity-60"
                    value={editRole}
                    onChange={(e) => setEditRole(e.target.value)}
                  >
                    <option value="admin">admin</option>
                    <option value="manager">manager</option>
                    <option value="user">user</option>
                  </select>
                </label>
              </div>

              <div className="flex items-center justify-end gap-2 flex-wrap">
                {isAdmin ? (
                  <Button
                    variant="secondary"
                    disabled={saving || String(selected.id) === String(user?.id)}
                    onClick={async () => {
                      const isSelf = String(selected.id) === String(user?.id);
                      if (isSelf) return;
                      const v = window.prompt(
                        `This will permanently delete ${selected.email}. Type DELETE to confirm.`,
                        "",
                      );
                      if (v !== "DELETE") return;
                      setSaving(true);
                      try {
                        await api.delete(`/api/users/${selected.id}`);
                        setSelected(null);
                        await load();
                      } catch (err) {
                        setDetailError(err?.response?.data?.message || "Delete failed");
                      } finally {
                        setSaving(false);
                      }
                    }}
                  >
                    Delete user
                  </Button>
                ) : null}
                <Button
                  disabled={saving}
                  onClick={async () => {
                    setSaving(true);
                    try {
                      const payload = {
                        name: editName.trim(),
                        status: editStatus,
                      };
                      if (isAdmin) payload.role = editRole;
                      const { data } = await api.patch(`/api/users/${selected.id}`, payload);
                      setSelected(data.user);
                      await load();
                    } finally {
                      setSaving(false);
                    }
                  }}
                >
                  {saving ? "Saving…" : "Save"}
                </Button>
              </div>
              <div className="text-xs text-neutral-600 dark:text-neutral-300">
                Managers can’t edit admins or change roles/emails (enforced by API).
              </div>
            </div>
          )}
        </Card>
      ) : null}
    </div>
  );
}

