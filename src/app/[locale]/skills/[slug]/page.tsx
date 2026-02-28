import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { notFound } from "next/navigation";
import type { SkillResponse } from "@/types/skill";

interface Props {
  params: Promise<{ locale: string; slug: string }>;
}

async function getSkill(slug: string): Promise<SkillResponse | null> {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL ?? "http://localhost:3000";
    const res = await fetch(`${baseUrl}/api/skills?slug=${slug}`, {
      next: { revalidate: 60 },
    });
    if (!res.ok) return null;
    const data = await res.json();
    return data.skills?.[0] ?? null;
  } catch {
    return null;
  }
}

export default async function SkillDetailPage({ params }: Props) {
  const { slug } = await params;
  const skill = await getSkill(slug);

  if (!skill) {
    notFound();
  }

  return <SkillDetailClient skill={skill} />;
}

function SkillDetailClient({ skill }: { skill: SkillResponse }) {
  const t = useTranslations("skill_detail");
  const tRoles = useTranslations("roles");

  return (
    <main className="min-h-screen bg-gray-950 text-white">
      <div className="max-w-4xl mx-auto px-6 py-12">
        <Link
          href="/skills"
          className="text-gray-400 hover:text-white text-sm mb-8 inline-block"
        >
          ← {t("back")}
        </Link>
        <h1 className="text-3xl font-bold mb-4">{skill.name}</h1>
        <p className="text-gray-400 mb-8">{skill.description}</p>
        <div className="bg-gray-900 rounded-lg p-6 mb-6">
          <h2 className="text-lg font-semibold mb-3">{t("install_title")}</h2>
          <code className="text-cyan-400 font-mono">{skill.install_command}</code>
        </div>
        <dl className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <dt className="text-gray-500">{t("role")}</dt>
            <dd className="text-white">{tRoles(skill.role)}</dd>
          </div>
          <div>
            <dt className="text-gray-500">{t("author")}</dt>
            <dd className="text-white">{skill.author}</dd>
          </div>
          <div>
            <dt className="text-gray-500">{t("downloads")}</dt>
            <dd className="text-white">{skill.downloads}</dd>
          </div>
        </dl>
      </div>
    </main>
  );
}
