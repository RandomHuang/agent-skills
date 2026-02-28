import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";

export default function HomePage() {
  const t = useTranslations("home");
  const tNav = useTranslations("nav");

  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-950 to-gray-900 text-white">
      {/* Navbar */}
      <nav className="border-b border-gray-800 px-6 py-4 flex items-center justify-between">
        <Link href="/" className="text-xl font-bold text-white">
          agent-skills
        </Link>
        <div className="flex gap-6 text-sm text-gray-400">
          <Link href="/skills" className="hover:text-white transition-colors">
            {tNav("browse")}
          </Link>
          <Link href="/submit" className="hover:text-white transition-colors">
            {tNav("submit")}
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <section className="px-6 py-24 text-center max-w-4xl mx-auto">
        <h1 className="text-5xl font-bold mb-6 bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
          {t("hero.title")}
        </h1>
        <p className="text-xl text-gray-400 mb-10 max-w-2xl mx-auto">
          {t("hero.subtitle")}
        </p>
        <div className="flex gap-4 justify-center">
          <Link
            href="/skills"
            className="px-8 py-3 bg-blue-600 hover:bg-blue-500 rounded-lg font-medium transition-colors"
          >
            {t("hero.browse_cta")}
          </Link>
          <Link
            href="/submit"
            className="px-8 py-3 border border-gray-600 hover:border-gray-400 rounded-lg font-medium transition-colors"
          >
            {t("hero.submit_cta")}
          </Link>
        </div>
      </section>
    </main>
  );
}
