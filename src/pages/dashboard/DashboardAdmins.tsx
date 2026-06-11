import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  adminDemoteToUser, adminFetchAdmins, adminFetchUsers, adminPromoteToAdmin,
} from "../../supabase/adminService";
import type { Profile } from "../../@types";
import { useAuth } from "../../context/AuthContext";
import { useState } from "react";
import { ShieldMinus, ShieldPlus } from "lucide-react";
import { useTranslation } from "react-i18next";

const RoleBadge = ({ role }: { role: Profile["role"] }) => {
  const map = {
    admin:      "bg-brownish/25 text-title font-sora text-[10px] px-2 py-0.5",
    superadmin: "bg-pinkish/15 text-pinkish font-sora text-[10px] px-2 py-0.5",
    user:       "bg-brownish/15 text-brownish font-sora text-[10px] px-2 py-0.5",
  };
  return (
    <span className={`capitalize ${map[role]}`}>
      {role}
    </span>
  );
};

const DashboardAdmins = () => {
  const queryClient = useQueryClient();
  const { user: currentUser } = useAuth();
  const { t } = useTranslation();
  const [search, setSearch] = useState("");

  const invalidateAll = () => {
    queryClient.invalidateQueries({ queryKey: ["admin-admins"] });
    queryClient.invalidateQueries({ queryKey: ["admin-users"] });
  };

  const { data: admins = [], isLoading } = useQuery({ queryKey: ["admin-admins"], queryFn: adminFetchAdmins });
  const { data: allUsers = [] }          = useQuery({ queryKey: ["admin-users"],  queryFn: adminFetchUsers });

  const promoteMutation = useMutation({ mutationFn: (id: string) => adminPromoteToAdmin(id), onSuccess: invalidateAll });
  const demoteMutation  = useMutation({ mutationFn: (id: string) => adminDemoteToUser(id),   onSuccess: invalidateAll });

  const regularUsers = allUsers.filter((u) => u.role === "user");
  const filtered     = regularUsers.filter((u) => u.email.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="flex flex-col gap-6">

      {/* Current admins */}
      <div className="border border-brownish/40 bg-stonish overflow-hidden">
        <div className="px-6 py-4 border-b border-brownish/15 flex items-center gap-2">
          <h3 className="font-liter text-title text-base">{t("dashboard.admins_currentAdmins")}</h3>
          {!isLoading && (
            <span className="font-sora text-[10px] bg-brownish/20 text-brownish px-2 py-0.5">{admins.length}</span>
          )}
        </div>

        {isLoading ? (
          <p className="font-sora text-lightish text-sm p-6">{t("dashboard.admins_loading")}</p>
        ) : admins.length === 0 ? (
          <p className="font-sora text-lightish text-sm p-6">{t("dashboard.admins_noAdmins")}</p>
        ) : (
          <table className="w-full text-sm">
            <thead className="bg-brownish/5 border-b border-brownish/10">
              <tr>
                <th className="text-left font-sora text-[10px] uppercase tracking-widest text-title px-5 py-3">{t("dashboard.admins_emailCol")}</th>
                <th className="text-left font-sora text-[10px] uppercase tracking-widest text-title px-5 py-3">{t("dashboard.admins_roleCol")}</th>
                <th className="px-5 py-3 w-36" />
              </tr>
            </thead>
            <tbody>
              {admins.map((a) => (
                <tr key={a.id} className="border-b border-brownish/10 hover:bg-brownish/5 transition-colors">
                  <td className="px-5 py-3 font-sora text-title">
                    {a.email}
                    {a.id === currentUser?.id && (
                      <span className="ml-2 font-sora text-xs text-lightish">{t("dashboard.users_you")}</span>
                    )}
                  </td>
                  <td className="px-5 py-3"><RoleBadge role={a.role} /></td>
                  <td className="px-5 py-3 text-right">
                    {a.id !== currentUser?.id && a.role === "admin" && (
                      <button
                        onClick={() => demoteMutation.mutate(a.id)}
                        disabled={demoteMutation.isPending}
                        className="flex items-center gap-1.5 ml-auto font-sora text-xs text-title border border-brownish/30 px-3 py-1.5 hover:border-pinkish/50 hover:text-pinkish transition-colors disabled:opacity-40 cursor-pointer"
                      >
                        <ShieldMinus className="w-3.5 h-3.5" />
                        {t("dashboard.admins_removeAdmin")}
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Promote a user */}
      <div className="border border-brownish/40 bg-stonish overflow-hidden">
        <div className="px-6 py-4 border-b border-brownish/15 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <h3 className="font-liter text-title text-base">{t("dashboard.admins_promoteTitle")}</h3>
            <span className="font-sora text-[10px] bg-brownish/20 text-brownish px-2 py-0.5">{filtered.length}</span>
          </div>
          <input
            placeholder={t("dashboard.admins_searchPlaceholder")}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="border border-brownish/40 bg-stonish px-3 py-2 font-sora text-sm text-title placeholder:text-lightish outline-none focus:border-brownish/60 transition-colors w-52"
          />
        </div>

        {filtered.length === 0 ? (
          <p className="font-sora text-title text-sm p-6">
            {search ? `${t("dashboard.admins_noUsersMatching")} "${search}".` : t("dashboard.admins_noRegularUsers")}
          </p>
        ) : (
          <table className="w-full text-sm">
            <thead className="bg-brownish/5 border-b border-brownish/10">
              <tr>
                <th className="text-left font-sora text-[10px] uppercase tracking-widest text-title px-5 py-3">{t("dashboard.admins_emailCol")}</th>
                <th className="text-left font-sora text-[10px] uppercase tracking-widest text-title px-5 py-3">{t("dashboard.admins_joinedCol")}</th>
                <th className="px-5 py-3 w-32" />
              </tr>
            </thead>
            <tbody>
              {filtered.map((u) => (
                <tr key={u.id} className="border-b border-brownish/10 hover:bg-brownish/5 transition-colors">
                  <td className="px-5 py-3 font-sora text-title max-w-[180px] truncate">{u.email}</td>
                  <td className="px-5 py-3 font-sora text-xs text-title">
                    {new Date(u.created_at).toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" })}
                  </td>
                  <td className="px-5 py-3 text-right">
                    <button
                      onClick={() => promoteMutation.mutate(u.id)}
                      disabled={promoteMutation.isPending}
                      className="flex items-center gap-1.5 ml-auto bg-brownish text-grayish font-sora text-xs tracking-wide py-2.5 px-4 hover:bg-brownish/70 transition-colors disabled:opacity-50 cursor-pointer"
                    >
                      <ShieldPlus className="w-3.5 h-3.5" />
                      {t("dashboard.admins_makeAdmin")}
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
