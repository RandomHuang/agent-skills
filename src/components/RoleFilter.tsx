"use client";

import { useTranslations } from "next-intl";
import { useRouter, usePathname } from "@/i18n/navigation";
import { useSearchParams } from "next/navigation";
import type { SkillRole } from "@/types/skill";

const ROLES: SkillRole[] = [
  "pm",
  "frontend-dev",
  "backend-dev",
  "qa",
  "devops",
  "designer",
  "general",
];

export default function RoleFilter() {
  const t = useTranslations("browse");
  const tRoles = useTranslations("roles");
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const currentRole = searchParams.get("role");

  function handleRoleChange(role: string | null) {
    const params = new URLSearchParams(searchParams.toString());
    if (role) {
      params.set("role", role);
    } else {
      params.delete("role");
    }
    params.delete("page");
    router.push(`${pathname}?${params.toString()}`);
  }

  return (
    <div className="flex flex-wrap gap-2">
      <button
        onClick={() => handleRoleChange(null)}
        className={`px-3 py-1.5 rounded-lg text-sm transition-colors ${
          !currentRole
            ? "bg-blue-600 text-white"
            : "bg-gray-800 text-gray-400 hover:text-white"
        }`}
      >
        {t("all_roles")}
      </button>
      {ROLES.map((role) => (
        <button
          key={role}
          onClick={() => handleRoleChange(role)}
          className={`px-3 py-1.5 rounded-lg text-sm transition-colors ${
            currentRole === role
              ? "bg-blue-600 text-white"
              : "bg-gray-800 text-gray-400 hover:text-white"
          }`}
        >
          {tRoles(role)}
        </button>
      ))}
    </div>
  );
}
