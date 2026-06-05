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

const roleBadge = (role: Role) => {
  const map: Record<Role, string> = {
    user: "bg-gray-100 text-gray-600",
    admin: "bg-blue-100 text-blue-700",
    superadmin: "bg-purple-100 text-purple-700",
  };
  return (
    <span className={`text-xs px-2 py-0.5 rounded-full font-medium capitalize ${map[role]}`}>
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

  const invalidate = () =>
    queryClient.invalidateQueries({ queryKey: ["admin-users"] });

  const { data: users = [], isLoading } = useQuery({
    queryKey: ["admin-users"],
    queryFn: adminFetchUsers,
  });

  const createMutation = useMutation({
    mutationFn: () => adminCreateUser(form.email, form.password, form.role),
    onSuccess: () => {
      invalidate();
      setForm(emptyForm);
      setFormError(null);
    },
    onError: (err: Error) => setFormError(err.message),
  });

  const roleMutation = useMutation({
    mutationFn: ({ id, role }: { id: string; role: Role }) =>
      adminUpdateUserRole(id, role),
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

  // Admins can only create users with role "user"
  // Superadmins can create any role
  const roleOptions: Role[] =
    currentRole === "superadmin"
      ? ["user", "admin", "superadmin"]
      : ["user"];

  return (
    <div className="flex flex-col gap-8">
      <h1 className="text-xl font-semibold">Users</h1>

      {/* Add user form */}
      <form
        onSubmit={handleCreate}
        className="bg-white rounded-xl border p-6 flex flex-col gap-4"
      >
        <h2 className="font-medium text-sm">Add user</h2>
        <div className="grid grid-cols-2 gap-4">
          <input
            type="email"
            placeholder="Email"
            required
            value={form.email}
            onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
            className="border rounded-lg px-3 py-2 text-sm col-span-2"
          />
          <input
            type="password"
            placeholder="Password (min 6 chars)"
            required
            minLength={6}
            value={form.password}
            onChange={(e) => setForm((f) => ({ ...f, password: e.target.value }))}
            className="border rounded-lg px-3 py-2 text-sm"
          />
          <select
            value={form.role}
            onChange={(e) => setForm((f) => ({ ...f, role: e.target.value as Role }))}
            className="border rounded-lg px-3 py-2 text-sm cursor-pointer"
          >
            {roleOptions.map((r) => (
              <option key={r} value={r}>{r}</option>
            ))}
          </select>
        </div>

        {formError && (
          <p className="text-red-500 text-xs">{formError}</p>
        )}

        <button
          type="submit"
          disabled={createMutation.isPending}
          className="bg-black text-white px-5 py-2 rounded-lg text-sm w-fit disabled:opacity-50 cursor-pointer"
        >
          {createMutation.isPending ? "Creating..." : "Create user"}
        </button>
      </form>

      {/* Users table */}
      <div className="bg-white rounded-xl border overflow-hidden">
        {isLoading ? (
          <p className="text-gray-400 text-sm p-6">Loading...</p>
        ) : users.length === 0 ? (
          <p className="text-gray-400 text-sm p-6">No users yet.</p>
        ) : (
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="text-left px-4 py-3 font-medium">Email</th>
                <th className="text-left px-4 py-3 font-medium">Role</th>
                <th className="text-left px-4 py-3 font-medium">Joined</th>
                <th className="px-4 py-3" />
              </tr>
            </thead>
            <tbody className="divide-y">
              {users.map((u) => (
                <tr key={u.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 max-w-[220px] truncate">
                    {u.email}
                    {u.id === currentUser?.id && (
                      <span className="ml-2 text-xs text-gray-400">(you)</span>
                    )}
                  </td>
                  <td className="px-4 py-3">{roleBadge(u.role)}</td>
                  <td className="px-4 py-3 text-gray-400 text-xs">
                    {new Date(u.created_at).toLocaleDateString()}
                  </td>
                  <td className="px-4 py-3">
                    {canChangeRole(u) && (
                      <div className="flex justify-end gap-2">
                        {currentRole === "superadmin" && (
                          <select
                            value={u.role}
                            onChange={(e) =>
                              roleMutation.mutate({
                                id: u.id,
                                role: e.target.value as Role,
                              })
                            }
                            className="text-xs border rounded-lg px-2 py-1 cursor-pointer"
                          >
                            <option value="user">user</option>
                            <option value="admin">admin</option>
                            <option value="superadmin">superadmin</option>
                          </select>
                        )}
                        <button
                          onClick={() => deleteMutation.mutate(u.id)}
                          disabled={deleteMutation.isPending}
                          className="text-xs border border-red-200 text-red-500 px-3 py-1 rounded-lg hover:bg-red-50 disabled:opacity-50 cursor-pointer"
                        >
                          Delete
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
