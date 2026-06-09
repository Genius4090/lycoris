import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  adminCreateUser,
  adminDeleteUser,
  adminFetchUsers,
  adminUpdateUserRole,
} from "../../supabase/adminService";
import type { Profile, Role } from "../../@types";
import { useAuth } from "../../context/AuthContext";
import { Trash2 } from "lucide-react";

const inp =
  "w-full border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-800 placeholder:text-gray-400 outline-none focus:border-gray-400 transition-colors bg-white";

const RoleBadge = ({ role }: { role: Role }) => {
  const map: Record<Role, string> = {
    user:       "bg-gray-100 text-gray-600",
    admin:      "bg-blue-100 text-blue-700",
    superadmin: "bg-purple-100 text-purple-700",
  };
  return (
    <span className={`text-xs font-semibold px-2.5 py-0.5 rounded-full capitalize ${map[role]}`}>
      {role}
    </span>
  );
};

const emptyForm = { email: "", password: "", role: "user" as Role };

const DashboardUsers = () => {
  const queryClient = useQueryClient();
  const { user: currentUser, role: currentRole } = useAuth();

  const [form, setForm] = useState(emptyForm);
  const [formError, setFormError] = useState<string | null>(null);

  const invalidate = () => queryClient.invalidateQueries({ queryKey: ["admin-users"] });

  const { data: users = [], isLoading } = useQuery({
    queryKey: ["admin-users"],
    queryFn: adminFetchUsers,
  });

  const createMutation = useMutation({
    mutationFn: () => adminCreateUser(form.email, form.password, form.role),
    onSuccess: () => { invalidate(); setForm(emptyForm); setFormError(null); },
    onError: (err: Error) => setFormError(err.message),
  });

  const roleMutation = useMutation({
    mutationFn: ({ id, role }: { id: string; role: Role }) => adminUpdateUserRole(id, role),
    onSuccess: invalidate,
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => adminDeleteUser(id),
    onSuccess: invalidate,
  });

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);
    if (!form.email || !form.password) return;
    createMutation.mutate();
  };

  const canChangeRole = (target: Profile) => {
    if (target.id === currentUser?.id) return false;
    if (currentRole === "admin" && target.role !== "user") return false;
    return true;
  };

  const roleOptions: Role[] =
    currentRole === "superadmin" ? ["user", "admin", "superadmin"] : ["user"];

  return (
    <div className="flex flex-col gap-6">

      {/* ── Add user card ── */}
      <div className="bg-white rounded-2xl p-6 flex flex-col gap-5">
        <h2 className="font-bold text-gray-800 text-base">Add New User</h2>
        <form onSubmit={handleCreate} className="flex flex-col gap-4">
          <div className="grid grid-cols-2 gap-4">
            <input
              type="email" placeholder="Email address" required
              value={form.email}
              onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
              className={`${inp} col-span-2`}
            />
            <input
              type="password" placeholder="Password (min 6 chars)" required minLength={6}
              value={form.password}
              onChange={(e) => setForm((f) => ({ ...f, password: e.target.value }))}
              className={inp}
            />
            <select
              value={form.role}
              onChange={(e) => setForm((f) => ({ ...f, role: e.target.value as Role }))}
              className={`${inp} cursor-pointer`}
            >
              {roleOptions.map((r) => <option key={r} value={r}>{r}</option>)}
            </select>
          </div>
          {formError && <p className="text-xs text-red-500">{formError}</p>}
          <button
            type="submit"
            disabled={createMutation.isPending}
            className="bg-gray-900 hover:bg-gray-700 text-white text-sm font-semibold px-6 py-2 rounded-lg transition-colors disabled:opacity-50 cursor-pointer w-fit"
          >
            {createMutation.isPending ? "Creating..." : "Create user"}
          </button>
        </form>
      </div>

      {/* ── Users table card ── */}
      <div className="bg-white rounded-2xl overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100 flex items-center gap-2">
          <h3 className="font-bold text-gray-800 text-base">All Users</h3>
          {!isLoading && (
            <span className="text-xs bg-gray-100 text-gray-500 font-semibold px-2 py-0.5 rounded-full">
              {users.length}
            </span>
          )}
        </div>

        {isLoading ? (
          <p className="text-gray-400 text-sm p-6">Loading...</p>
        ) : users.length === 0 ? (
          <p className="text-gray-400 text-sm p-6">No users yet.</p>
        ) : (
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                <th className="text-left px-5 py-3 text-xs text-gray-400 font-semibold uppercase tracking-wide">Email</th>
                <th className="text-left px-5 py-3 text-xs text-gray-400 font-semibold uppercase tracking-wide">Role</th>
                <th className="text-left px-5 py-3 text-xs text-gray-400 font-semibold uppercase tracking-wide">Joined</th>
                <th className="px-5 py-3 w-32" />
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {users.map((u) => (
                <tr key={u.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-5 py-3 text-gray-800 font-medium max-w-[240px] truncate">
                    {u.email}
                    {u.id === currentUser?.id && (
                      <span className="ml-2 text-xs text-gray-400">(you)</span>
                    )}
                  </td>
                  <td className="px-5 py-3"><RoleBadge role={u.role} /></td>
                  <td className="px-5 py-3 text-xs text-gray-400">
                    {new Date(u.created_at).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                  </td>
                  <td className="px-5 py-3">
                    {canChangeRole(u) && (
                      <div className="flex justify-end items-center gap-3">
                        {currentRole === "superadmin" && (
                          <select
                            value={u.role}
                            onChange={(e) => roleMutation.mutate({ id: u.id, role: e.target.value as Role })}
                            className="border border-gray-200 rounded-lg text-xs px-2 py-1.5 text-gray-700 cursor-pointer outline-none bg-white"
                          >
                            <option value="user">user</option>
                            <option value="admin">admin</option>
                            <option value="superadmin">superadmin</option>
                          </select>
                        )}
                        <button
                          onClick={() => deleteMutation.mutate(u.id)}
                          disabled={deleteMutation.isPending}
                          className="text-gray-400 hover:text-red-500 transition-colors disabled:opacity-40 cursor-pointer"
                          aria-label="Delete user"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default DashboardUsers;
