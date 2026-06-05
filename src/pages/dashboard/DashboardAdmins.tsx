import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  adminDemoteToUser,
  adminFetchAdmins,
  adminFetchUsers,
  adminPromoteToAdmin,
} from "../../supabase/adminService";
import type { Profile } from "../../@types";
import { useAuth } from "../../context/AuthContext";
import { useState } from "react";

const DashboardAdmins = () => {
  const queryClient = useQueryClient();
  const { user: currentUser } = useAuth();
  const [search, setSearch] = useState("");

  const invalidateAll = () => {
    queryClient.invalidateQueries({ queryKey: ["admin-admins"] });
    queryClient.invalidateQueries({ queryKey: ["admin-users"] });
  };

  const { data: admins = [], isLoading } = useQuery({
    queryKey: ["admin-admins"],
    queryFn: adminFetchAdmins,
  });

  // All users to pick from when promoting
  const { data: allUsers = [] } = useQuery({
    queryKey: ["admin-users"],
    queryFn: adminFetchUsers,
  });

  const promoteMutation = useMutation({
    mutationFn: (id: string) => adminPromoteToAdmin(id),
    onSuccess: invalidateAll,
  });

  const demoteMutation = useMutation({
    mutationFn: (id: string) => adminDemoteToUser(id),
    onSuccess: invalidateAll,
  });

  // Users who are not yet admin/superadmin
  const regularUsers = allUsers.filter((u) => u.role === "user");
  const filtered = regularUsers.filter((u) =>
    u.email.toLowerCase().includes(search.toLowerCase())
  );

  const roleBadge = (role: Profile["role"]) => {
    const map = {
      admin: "bg-blue-100 text-blue-700",
      superadmin: "bg-purple-100 text-purple-700",
      user: "bg-gray-100 text-gray-600",
    };
    return (
      <span className={`text-xs px-2 py-0.5 rounded-full font-medium capitalize ${map[role]}`}>
        {role}
      </span>
    );
  };

  return (
    <div className="flex flex-col gap-8">
      <h1 className="text-xl font-semibold">Admins</h1>

      {/* Current admins */}
      <div className="bg-white rounded-xl border overflow-hidden">
        <div className="px-4 py-3 border-b bg-gray-50">
          <h2 className="font-medium text-sm">Current Admins</h2>
        </div>
        {isLoading ? (
          <p className="text-gray-400 text-sm p-6">Loading...</p>
        ) : (
          <table className="w-full text-sm">
            <thead className="border-b">
              <tr>
                <th className="text-left px-4 py-3 font-medium">Email</th>
                <th className="text-left px-4 py-3 font-medium">Role</th>
                <th className="px-4 py-3" />
              </tr>
            </thead>
            <tbody className="divide-y">
              {admins.map((a) => (
                <tr key={a.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3">
                    {a.email}
                    {a.id === currentUser?.id && (
                      <span className="ml-2 text-xs text-gray-400">(you)</span>
                    )}
                  </td>
                  <td className="px-4 py-3">{roleBadge(a.role)}</td>
                  <td className="px-4 py-3 text-right">
                    {/* Can't demote yourself or other superadmins */}
                    {a.id !== currentUser?.id && a.role === "admin" && (
                      <button
                        onClick={() => demoteMutation.mutate(a.id)}
                        disabled={demoteMutation.isPending}
                        className="text-xs border border-red-200 text-red-500 px-3 py-1 rounded-lg hover:bg-red-50 disabled:opacity-50 cursor-pointer"
                      >
                        Remove admin
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Promote a user to admin */}
      <div className="bg-white rounded-xl border overflow-hidden">
        <div className="px-4 py-3 border-b bg-gray-50 flex items-center justify-between">
          <h2 className="font-medium text-sm">Promote User to Admin</h2>
          <input
            placeholder="Search by email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="border rounded-lg px-3 py-1.5 text-sm w-56"
          />
        </div>
        {filtered.length === 0 ? (
          <p className="text-gray-400 text-sm p-6">No users found.</p>
        ) : (
          <table className="w-full text-sm">
            <thead className="border-b">
              <tr>
                <th className="text-left px-4 py-3 font-medium">Email</th>
                <th className="text-left px-4 py-3 font-medium">Joined</th>
                <th className="px-4 py-3" />
              </tr>
            </thead>
            <tbody className="divide-y">
              {filtered.map((u) => (
                <tr key={u.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3">{u.email}</td>
                  <td className="px-4 py-3 text-xs text-gray-400">
                    {new Date(u.created_at).toLocaleDateString()}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <button
                      onClick={() => promoteMutation.mutate(u.id)}
                      disabled={promoteMutation.isPending}
                      className="text-xs bg-black text-white px-3 py-1 rounded-lg disabled:opacity-50 cursor-pointer"
                    >
                      Make admin
                    </button>
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

export default DashboardAdmins;
