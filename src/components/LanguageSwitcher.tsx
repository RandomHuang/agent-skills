"use client";

import { useLocale } from "next-intl";
import { useRouter, usePathname } from "@/i18n/navigation";
import { useSearchParams } from "next/navigation";

const LOCALES = [
  { code: "en", label: "EN", flag: "🇺🇸" },
  { code: "zh", label: "中", flag: "🇨🇳" },
];

export default function LanguageSwitcher() {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  function switchLocale(newLocale: string) {
    const query = searchParams.toString();
    router.push(query ? `${pathname}?${query}` : pathname, { locale: newLocale });
  }

  return (
    <div className="flex items-center gap-1">
      {LOCALES.map(({ code, label, flag }) => (
        <button
          key={code}
          onClick={() => switchLocale(code)}
          className={`px-2 py-1 rounded text-xs font-medium transition-colors ${
            locale === code
              ? "bg-gray-700 text-white"
              : "text-gray-500 hover:text-gray-300"
          }`}
          title={code === "en" ? "English" : "中文"}
        >
          {flag} {label}
        </button>
      ))}
    </div>
  );
}
