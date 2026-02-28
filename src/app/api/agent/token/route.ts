import { NextRequest, NextResponse } from "next/server";
import { createToken } from "@/lib/agent-token";

export async function POST(req: NextRequest) {
  try {
    let agentName: string | undefined;

    const contentType = req.headers.get("content-type") ?? "";
    if (contentType.includes("application/json")) {
      const body = await req.json().catch(() => ({}));
      agentName = typeof body.name === "string" ? body.name : undefined;
    }

    const token = await createToken(agentName);

    return NextResponse.json({
      token,
      created_at: new Date().toISOString(),
      note: "Save this token. It will not be shown again.",
    });
  } catch (err) {
    console.error("token creation error", err);
    return NextResponse.json(
      { error: "Failed to create token" },
      { status: 500 }
    );
  }
}
