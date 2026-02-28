"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import type { SkillRole, SubmitSkillBody } from "@/types/skill";

const ROLES: SkillRole[] = [
  "pm",
  "frontend-dev",
  "backend-dev",
  "qa",
  "devops",
  "designer",
  "general",
];

export default function SubmitForm() {
  const t = useTranslations("submit.form");
  const tSubmit = useTranslations("submit");
  const tRoles = useTranslations("roles");

  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    const formData = new FormData(e.currentTarget);

    const tagsRaw = formData.get("tags") as string;
    const tags = tagsRaw
      ? tagsRaw
          .split(",")
          .map((t) => t.trim())
          .filter(Boolean)
      : [];

    const body: SubmitSkillBody = {
      name: formData.get("name") as string,
      description: formData.get("description") as string,
      description_zh: (formData.get("description_zh") as string) || undefined,
      role: formData.get("role") as SkillRole,
      tags,
      install_command: formData.get("install_command") as string,
      source_url: formData.get("source_url") as string,
      author: formData.get("author") as string,
      author_url: (formData.get("author_url") as string) || undefined,
    };

    try {
      const res = await fetch("/api/skills", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error ?? "Submission failed");
      }

      setSuccess(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : tSubmit("error"));
    } finally {
      setSubmitting(false);
    }
  }

  if (success) {
    return (
      <div className="bg-green-900/30 border border-green-700 rounded-xl p-8 text-center">
        <div className="text-4xl mb-4">🎉</div>
        <h2 className="text-xl font-semibold text-green-300 mb-2">
          {tSubmit("success.title")}
        </h2>
        <p className="text-gray-400">{tSubmit("success.message")}</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {error && (
        <div className="bg-red-900/30 border border-red-700 rounded-lg p-3 text-red-300 text-sm">
          {error}
        </div>
      )}

      <Field label={t("name")} required>
        <input
          name="name"
          required
          placeholder={t("name_placeholder")}
          className="input-field"
        />
      </Field>

      <Field label={t("description")} required>
        <textarea
          name="description"
          required
          rows={3}
          placeholder={t("description_placeholder")}
          className="input-field resize-none"
        />
      </Field>

      <Field label={t("description_zh")}>
        <textarea
          name="description_zh"
          rows={2}
          placeholder={t("description_zh_placeholder")}
          className="input-field resize-none"
        />
      </Field>

      <Field label={t("role")} required>
        <select name="role" required className="input-field">
          <option value="">{t("role_placeholder")}</option>
          {ROLES.map((r) => (
            <option key={r} value={r}>
              {tRoles(r)}
            </option>
          ))}
        </select>
      </Field>

      <Field label={t("tags")}>
        <input
          name="tags"
          placeholder={t("tags_placeholder")}
          className="input-field"
        />
      </Field>

      <Field label={t("install_command")} required>
        <input
          name="install_command"
          required
          placeholder={t("install_placeholder")}
          className="input-field font-mono text-sm"
        />
      </Field>

      <Field label={t("source_url")} required>
        <input
          name="source_url"
          type="url"
          required
          placeholder={t("source_url_placeholder")}
          className="input-field"
        />
      </Field>

      <Field label={t("author")} required>
        <input
          name="author"
          required
          placeholder={t("author_placeholder")}
          className="input-field"
        />
      </Field>

      <Field label={t("author_url")}>
        <input
          name="author_url"
          type="url"
          placeholder={t("author_url_placeholder")}
          className="input-field"
        />
      </Field>

      <button
        type="submit"
        disabled={submitting}
        className="w-full py-3 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 rounded-lg font-medium transition-colors"
      >
        {submitting ? t("submitting") : t("submit")}
      </button>
    </form>
  );
}

function Field({
  label,
  required,
  children,
}: {
  label: string;
  required?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-1.5">
      <label className="block text-sm font-medium text-gray-300">
        {label}
        {required && <span className="text-red-400 ml-1">*</span>}
      </label>
      {children}
    </div>
  );
}
