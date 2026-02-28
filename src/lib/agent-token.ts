import { adminDb } from "./firebase-admin";
import { FieldValue, Timestamp } from "firebase-admin/firestore";

const TOKEN_PREFIX = "sk-agent-";
const RATE_LIMIT_PER_HOUR = 100;

export function generateToken(): string {
  const bytes = crypto.getRandomValues(new Uint8Array(16));
  const hex = Array.from(bytes)
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
  return `${TOKEN_PREFIX}${hex}`;
}

export async function createToken(agentName?: string): Promise<string> {
  const token = generateToken();
  const now = Timestamp.now();

  await adminDb.collection("agent_tokens").doc(token).set({
    agent_name: agentName ?? null,
    created_at: now,
    last_used_at: now,
    usage_count: 0,
    hourly_count: 0,
    hourly_reset_at: now,
  });

  return token;
}

export interface RateLimitResult {
  allowed: boolean;
  remaining: number;
}

export async function checkRateLimit(token: string): Promise<RateLimitResult> {
  const ref = adminDb.collection("agent_tokens").doc(token);
  const snap = await ref.get();

  if (!snap.exists) {
    return { allowed: false, remaining: 0 };
  }

  const data = snap.data()!;
  const now = Timestamp.now();
  const resetAt = data.hourly_reset_at as Timestamp;

  // If an hour has passed, reset the hourly counter
  const hourlyCount: number =
    now.seconds - resetAt.seconds > 3600 ? 0 : (data.hourly_count as number);

  if (hourlyCount >= RATE_LIMIT_PER_HOUR) {
    return { allowed: false, remaining: 0 };
  }

  // Update counters
  const updates: Record<string, unknown> = {
    last_used_at: now,
    usage_count: FieldValue.increment(1),
    hourly_count:
      now.seconds - resetAt.seconds > 3600 ? 1 : FieldValue.increment(1),
  };

  if (now.seconds - resetAt.seconds > 3600) {
    updates.hourly_reset_at = now;
  }

  await ref.update(updates);

  return {
    allowed: true,
    remaining: RATE_LIMIT_PER_HOUR - hourlyCount - 1,
  };
}

export async function validateToken(token: string): Promise<boolean> {
  if (!token.startsWith(TOKEN_PREFIX)) return false;
  const snap = await adminDb.collection("agent_tokens").doc(token).get();
  return snap.exists;
}
