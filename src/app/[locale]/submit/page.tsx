import { useTranslations } from "next-intl";
import SubmitForm from "@/components/SubmitForm";

export default function SubmitPage() {
  const t = useTranslations("submit");

  return (
    <main className="min-h-screen bg-gray-950 text-white">
      <div className="max-w-2xl mx-auto px-6 py-12">
        <h1 className="text-3xl font-bold mb-3">{t("title")}</h1>
        <p className="text-gray-400 mb-8">{t("subtitle")}</p>
        <SubmitForm />
      </div>
    </main>
  );
}
