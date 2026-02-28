"use client";

import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import InstallBadge from "./InstallBadge";
import type { SkillResponse, SkillRole } from "@/types/skill";

const ROLE_COLORS: Record<SkillRole, string> = {
  pm: "bg-purple-900/50 text-purple-300",
  "frontend-dev": "bg-blue-900/50 text-blue-300",
  "backend-dev": "bg-green-900/50 text-green-300",
  qa: "bg-yellow-900/50 text-yellow-300",
  devops: "bg-orange-900/50 text-orange-300",
  designer: "bg-pink-900/50 text-pink-300",
  general: "bg-gray-800 text-gray-300",
};

interface Props {
  skill: SkillResponse;
}

export default function SkillCard({ skill }: Props) {
  const t = useTranslations("skill_card");
  const tRoles = useTranslations("roles");

  return (
    <div className="bg-gray-900 border border-gray-800 rounded-xl p-5 hover:border-gray-600 transition-colors flex flex-col gap-4">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h3 className="font-semibold text-white text-lg">{skill.name}</h3>
          <span
            className={`text-xs px-2 py-0.5 rounded-full mt-1 inline-block ${ROLE_COLORS[skill.role]}`}
          >
            {tRoles(skill.role)}
          </span>
        </div>
        <span className="text-xs text-gray-500 whitespace-nowrap">
          {t("downloads", { count: skill.downloads })}
        </span>
      </div>

      <p className="text-gray-400 text-sm line-clamp-2">{skill.description}</p>

      {skill.tags.length > 0 && (
        <div className="flex flex-wrap gap-1">
          {skill.tags.map((tag) => (
            <span
              key={tag}
              className="text-xs bg-gray-800 text-gray-400 px-2 py-0.5 rounded"
            >
              {tag}
            </span>
          ))}
        </div>
      )}

      <div className="flex gap-2 mt-auto pt-2">
        <InstallBadge command={skill.install_command} />
        <Link
          href={`/skills/${skill.slug}`}
          className="text-sm text-gray-400 hover:text-white px-3 py-1.5 border border-gray-700 rounded-lg transition-colors"
        >
          {t("view")}
        </Link>
      </div>
    </div>
  );
}
