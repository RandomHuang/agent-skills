import { NextRequest, NextResponse } from "next/server";
import { adminDb } from "@/lib/firebase-admin";
import { FieldValue, Timestamp } from "firebase-admin/firestore";
import type { SkillResponse } from "@/types/skill";

function serializeTimestamp(ts: Timestamp | string): string {
  if (typeof ts === "string") return ts;
  return ts.toDate().toISOString();
}

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const docRef = adminDb.collection("skills").doc(id);
    const snap = await docRef.get();

    if (!snap.exists) {
      return NextResponse.json({ error: "Skill not found" }, { status: 404 });
    }

    // Increment download counter (non-blocking)
    docRef.update({ downloads: FieldValue.increment(1) }).catch(console.error);

    const data = snap.data()!;
    const skill: SkillResponse = {
      id: snap.id,
      ...(data as Omit<SkillResponse, "id" | "created_at" | "updated_at">),
      created_at: serializeTimestamp(data.created_at),
      updated_at: serializeTimestamp(data.updated_at),
    };

    return NextResponse.json(skill);
  } catch (err) {
    console.error("skill GET by id error", err);
    return NextResponse.json(
      { error: "Failed to fetch skill" },
      { status: 500 }
    );
  }
}
