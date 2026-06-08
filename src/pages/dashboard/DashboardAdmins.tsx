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
    admin: "bg-blue-100 text-blue-700",
    superadmin: "bg-amber-100 text-amber-700",
    user: "bg-brownish/40 text-title",
  };
  return (
    <span className={`font-liter text-xs px-2.5 py-0.5 capitalize ${map[role]}`}>
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
    <div className="flex flex-col gap-8">

      {/* ── Header ── */}
      <div className="flex items-end gap-3">
        <h1 className="font-liter text-3xl text-title">Admins</h1>
        {!isLoading && (
          <span className="font-liter text-textish text-sm mb-0.5">
            {admins.length} total
          </span>
        )}
      </div>

      {/* ── Current admins ── */}
      <div className="flex flex-col gap-0">
        <div className="bg-brownish/20 border border-brownish border-b-0 px-5 py-3">
          <h2 className="font-liter text-sm text-title">Current Admins</h2>
        </div>
        <div className="border border-brownish overflow-hidden">
          {isLoading ? (
            <p className="font-liter text-textish text-sm p-6">Loading...</p>
          ) : admins.length === 0 ? (
            <p className="font-liter text-textish text-sm p-6">No admins yet.</p>
          ) : (
            <table className="w-full text-sm">
              <thead className="border-b border-brownish/60">
                <tr>
                  <th className="text-left px-4 py-3 font-liter text-textish font-normal">Email</th>
                  <th className="text-left px-4 py-3 font-liter text-textish font-normal">Role</th>
                  <th className="px-4 py-3 w-32" />
                </tr>
              </thead>
              <tbody className="divide-y divide-brownish/40">
                {admins.map((a) => (
                  <tr key={a.id} className="hover:bg-brownish/10 transition-colors">
                    <td className="px-4 py-3 font-liter text-title text-sm">
                      {a.email}
                      {a.id === currentUser?.id && (
                        <span className="ml-2 font-liter text-xs text-lightish">(you)</span>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <RoleBadge role={a.role} />
                    </td>
                    <td className="px-4 py-3 text-right">
                      {a.id !== currentUser?.id && a.role === "admin" && (
                        <button
                          onClick={() => demoteMutation.mutate(a.id)}
                          disabled={demoteMutation.isPending}
                          className="flex items-center gap-1.5 ml-auto font-liter text-xs text-textish border border-brownish/50 px-3 py-1.5 hover:text-pinkish hover:border-pinkish/40 transition-colors disabled:opacity-40 cursor-pointer"
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
      </div>

      {/* ── Promote a user ── */}
      <div className="flex flex-col gap-0">
        <div className="bg-brownish/20 border border-brownish border-b-0 px-5 py-3 flex items-center justify-between">
          <h2 className="font-liter text-sm text-title">Promote User to Admin</h2>
          <input
            placeholder="Search by email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="border border-brownish bg-transparent font-liter text-xs px-3 py-1.5 text-title placeholder:text-title/40 outline-none focus:border-textish transition-colors w-52"
          />
        </div>
        <div className="border border-brownish overflow-hidden">
          {filtered.length === 0 ? (
            <p className="font-liter text-textish text-sm p-6">
              {search ? `No users matching "${search}".` : "No regular users found."}
            </p>
          ) : (
            <table className="w-full text-sm">
              <thead className="border-b border-brownish/60">
                <tr>
                  <th className="text-left px-4 py-3 font-liter text-textish font-normal">Email</th>
                  <th className="text-left px-4 py-3 font-liter text-textish font-normal">Joined</th>
                  <th className="px-4 py-3 w-32" />
                </tr>
              </thead>
              <tbody className="divide-y divide-brownish/40">
                {filtered.map((u) => (
                  <tr key={u.id} className="hover:bg-brownish/10 transition-colors">
                    <td className="px-4 py-3 font-liter text-title text-sm">{u.email}</td>
                    <td className="px-4 py-3 font-liter text-textish text-xs">
                      {new Date(u.created_at).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      })}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <button
                        onClick={() => promoteMutation.mutate(u.id)}
                        disabled={promoteMutation.isPending}
                        className="flex items-center gap-1.5 ml-auto font-liter text-xs text-title border border-brownish px-3 py-1.5 bg-brownish/30 hover:bg-brownish/60 transition-colors disabled:opacity-50 cursor-pointer"
                      >
                        <ShieldPlus className="w-3.5 h-3.5" />
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

    </div>
  );
};

export default DashboardAdmins;



