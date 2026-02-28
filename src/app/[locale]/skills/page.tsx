import { useTranslations } from "next-intl";

export default function BrowsePage() {
  const t = useTranslations("browse");

  return (
    <main className="min-h-screen bg-gray-950 text-white">
      <div className="max-w-6xl mx-auto px-6 py-12">
        <h1 className="text-3xl font-bold mb-8">{t("title")}</h1>
        <p className="text-gray-400">{t("no_results")}</p>
      </div>
    </main>
  );
}
