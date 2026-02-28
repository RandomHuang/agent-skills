import { NextRequest, NextResponse } from "next/server";
import { adminDb } from "@/lib/firebase-admin";
import { Timestamp } from "firebase-admin/firestore";
import type { ReviewBody } from "@/types/skill";

export async function POST(req: NextRequest) {
  // Verify admin key
  const adminKey = req.headers.get("x-admin-key");
  if (!adminKey || adminKey !== process.env.ADMIN_SECRET_KEY) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body: ReviewBody = await req.json();

    if (!body.id || !body.action) {
      return NextResponse.json(
        { error: "Missing required fields: id, action" },
        { status: 400 }
      );
    }

    if (body.action !== "approve" && body.action !== "reject") {
      return NextResponse.json(
        { error: "Invalid action. Must be approve or reject" },
        { status: 400 }
      );
    }

    const pendingRef = adminDb.collection("skills_pending").doc(body.id);
    const snap = await pendingRef.get();

    if (!snap.exists) {
      return NextResponse.json(
        { error: "Pending skill not found" },
        { status: 404 }
      );
    }

    const data = snap.data()!;

    if (body.action === "approve") {
      // Move from skills_pending to skills
      const { status: _status, ...skillData } = data;
      const now = Timestamp.now();

      await adminDb
        .collection("skills")
        .doc(body.id)
        .set({ ...skillData, updated_at: now });

      await pendingRef.update({ status: "approved", updated_at: now });

      return NextResponse.json({ success: true, action: "approved", id: body.id });
    } else {
      // Reject: just update status
      await pendingRef.update({
        status: "rejected",
        reject_reason: body.reason ?? null,
        updated_at: Timestamp.now(),
      });

      return NextResponse.json({ success: true, action: "rejected", id: body.id });
    }
  } catch (err) {
    console.error("admin review error", err);
    return NextResponse.json(
      { error: "Failed to process review" },
      { status: 500 }
    );
  }
}
