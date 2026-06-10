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
import { ShieldMinus, ShieldPlus } from "lucide-react";

const RoleBadge = ({ role }: { role: Profile["role"] }) => {
  const map = {
    admin:      "bg-blue-100 text-blue-700",
    superadmin: "bg-purple-100 text-purple-700",
    user:       "bg-gray-100 text-gray-600",
  };
  return (
    <span className={`text-xs font-semibold px-2.5 py-0.5 rounded-full capitalize ${map[role]}`}>
      {role}
    </span>
  );
};

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

  const regularUsers = allUsers.filter((u) => u.role === "user");
  const filtered = regularUsers.filter((u) =>
    u.email.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="flex flex-col gap-6">

      {/* ── Current admins ── */}
      <div className="bg-white rounded-2xl overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100 flex items-center gap-2">
          <h3 className="font-bold text-gray-800 text-base">Current Admins</h3>
          {!isLoading && (
            <span className="text-xs bg-gray-100 text-gray-500 font-semibold px-2 py-0.5 rounded-full">
              {admins.length}
            </span>
          )}
        </div>

        {isLoading ? (
          <p className="text-gray-400 text-sm p-6">Loading...</p>
        ) : admins.length === 0 ? (
          <p className="text-gray-400 text-sm p-6">No admins yet.</p>
        ) : (
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                <th className="text-left px-5 py-3 text-xs text-gray-400 font-semibold uppercase tracking-wide">Email</th>
                <th className="text-left px-5 py-3 text-xs text-gray-400 font-semibold uppercase tracking-wide">Role</th>
                <th className="px-5 py-3 w-36" />
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {admins.map((a) => (
                <tr key={a.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-5 py-3 font-medium text-gray-800">
                    {a.email}
                    {a.id === currentUser?.id && (
                      <span className="ml-2 text-xs text-gray-400">(you)</span>
                    )}
                  </td>
                  <td className="px-5 py-3"><RoleBadge role={a.role} /></td>
                  <td className="px-5 py-3 text-right">
                    {a.id !== currentUser?.id && a.role === "admin" && (
                      <button
                        onClick={() => demoteMutation.mutate(a.id)}
                        disabled={demoteMutation.isPending}
                        className="flex items-center gap-1.5 ml-auto text-xs text-gray-500 border border-gray-200 px-3 py-1.5 rounded-lg hover:border-red-300 hover:text-red-500 transition-colors disabled:opacity-40 cursor-pointer"
                      >
                        <ShieldMinus className="w-3.5 h-3.5" />
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

      {/* ── Promote a user ── */}
      <div className="bg-white rounded-2xl overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <h3 className="font-bold text-gray-800 text-base">Promote to Admin</h3>
            <span className="text-xs bg-gray-100 text-gray-500 font-semibold px-2 py-0.5 rounded-full">
              {filtered.length}
            </span>
          </div>
          <input
            placeholder="Search by email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="border border-gray-200 rounded-lg px-3 py-1.5 text-sm text-gray-800 placeholder:text-gray-400 outline-none focus:border-gray-400 w-52 bg-white"
          />
        </div>

        {filtered.length === 0 ? (
          <p className="text-gray-400 text-sm p-6">
            {search ? `No users matching "${search}".` : "No regular users found."}
          </p>
        ) : (
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                <th className="text-left px-5 py-3 text-xs text-gray-400 font-semibold uppercase tracking-wide">Email</th>
                <th className="text-left px-5 py-3 text-xs text-gray-400 font-semibold uppercase tracking-wide">Joined</th>
                <th className="px-5 py-3 w-32" />
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filtered.map((u) => (
                <tr key={u.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-5 py-3 font-medium text-gray-800 max-w-[180px] truncate">{u.email}</td>
                  <td className="px-5 py-3 text-xs text-gray-400">
                    {new Date(u.created_at).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                  </td>
                  <td className="px-5 py-3 text-right">
                    <button
                      onClick={() => promoteMutation.mutate(u.id)}
                      disabled={promoteMutation.isPending}
                      className="flex items-center gap-1.5 ml-auto text-xs text-white bg-gray-900 hover:bg-gray-700 px-3 py-1.5 rounded-lg transition-colors disabled:opacity-50 cursor-pointer"
                    >
                      <ShieldPlus/>
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
