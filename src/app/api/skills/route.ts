import { NextRequest, NextResponse } from "next/server";
import { adminDb } from "@/lib/firebase-admin";
import type { SkillRole, SubmitSkillBody, SkillResponse } from "@/types/skill";
import { Timestamp } from "firebase-admin/firestore";

const VALID_ROLES: SkillRole[] = [
  "pm",
  "frontend-dev",
  "backend-dev",
  "qa",
  "devops",
  "designer",
  "general",
];

function toSlug(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

function serializeTimestamp(ts: Timestamp | string): string {
  if (typeof ts === "string") return ts;
  return ts.toDate().toISOString();
}

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const role = searchParams.get("role");
    const q = searchParams.get("q");
    const slug = searchParams.get("slug");
    const page = Math.max(1, parseInt(searchParams.get("page") ?? "1", 10));
    const perPage = 20;

    let query = adminDb
      .collection("skills")
      .orderBy("created_at", "desc") as FirebaseFirestore.Query;

    if (role && VALID_ROLES.includes(role as SkillRole)) {
      query = query.where("role", "==", role);
    }

    if (slug) {
      query = query.where("slug", "==", slug);
    }

    const snapshot = await query.get();
    let skills = snapshot.docs.map((doc) => {
      const data = doc.data();
      return {
        id: doc.id,
        ...data,
        created_at: serializeTimestamp(data.created_at),
        updated_at: serializeTimestamp(data.updated_at),
      } as SkillResponse;
    });

    // Client-side text search (Firestore doesn't support full-text)
    if (q) {
      const lower = q.toLowerCase();
      skills = skills.filter(
        (s) =>
          s.name.toLowerCase().includes(lower) ||
          s.description.toLowerCase().includes(lower) ||
          s.tags.some((tag) => tag.toLowerCase().includes(lower))
      );
    }

    const total = skills.length;
    const paginated = skills.slice((page - 1) * perPage, page * perPage);

    return NextResponse.json({
      skills: paginated,
      total,
      page,
      per_page: perPage,
    });
  } catch (err) {
    console.error("skills GET error", err);
    return NextResponse.json(
      { error: "Failed to fetch skills" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const body: SubmitSkillBody = await req.json();

    // Validate required fields
    const required: (keyof SubmitSkillBody)[] = [
      "name",
      "description",
      "role",
      "install_command",
      "source_url",
      "author",
    ];
    for (const field of required) {
      if (!body[field]) {
        return NextResponse.json(
          { error: `Missing required field: ${field}` },
          { status: 400 }
        );
      }
    }

    if (!VALID_ROLES.includes(body.role)) {
      return NextResponse.json({ error: "Invalid role" }, { status: 400 });
    }

    // Validate URLs
    try {
      new URL(body.source_url);
    } catch {
      return NextResponse.json(
        { error: "Invalid source_url" },
        { status: 400 }
      );
    }

    if (body.author_url) {
      try {
        new URL(body.author_url);
      } catch {
        return NextResponse.json(
          { error: "Invalid author_url" },
          { status: 400 }
        );
      }
    }

    const slug = toSlug(body.name);
    const now = Timestamp.now();

    const docRef = await adminDb.collection("skills_pending").add({
      slug,
      name: body.name,
      description: body.description,
      description_zh: body.description_zh ?? null,
      role: body.role,
      tags: body.tags ?? [],
      install_command: body.install_command,
      source_url: body.source_url,
      author: body.author,
      author_url: body.author_url ?? null,
      downloads: 0,
      status: "pending",
      created_at: now,
      updated_at: now,
    });

    return NextResponse.json({ id: docRef.id, slug }, { status: 201 });
  } catch (err) {
    console.error("skills POST error", err);
    return NextResponse.json(
      { error: "Failed to submit skill" },
      { status: 500 }
    );
  }
}
