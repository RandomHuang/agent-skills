import type { Timestamp } from "firebase-admin/firestore";

export type SkillRole =
  | "pm"
  | "frontend-dev"
  | "backend-dev"
  | "qa"
  | "devops"
  | "designer"
  | "general";

export interface Skill {
  id: string;
  slug: string;
  name: string;
  description: string;
  description_zh?: string;
  role: SkillRole;
  tags: string[];
  install_command: string;
  source_url: string;
  author: string;
  author_url?: string;
  downloads: number;
  created_at: Timestamp | string;
  updated_at: Timestamp | string;
}

export type SkillStatus = "pending" | "approved" | "rejected";

export interface SkillPending extends Omit<Skill, "id"> {
  id: string;
  status: SkillStatus;
}

export interface AgentToken {
  // document ID is the token string itself
  agent_name?: string;
  created_at: Timestamp | string;
  last_used_at: Timestamp | string;
  usage_count: number;
  hourly_count: number;
  hourly_reset_at: Timestamp | string;
}

// API response types (serialized — Timestamp replaced with string)
export type SkillResponse = Omit<Skill, "created_at" | "updated_at"> & {
  created_at: string;
  updated_at: string;
};

export interface SkillListResponse {
  skills: SkillResponse[];
  total: number;
  page: number;
  per_page: number;
}

export interface AgentTokenResponse {
  token: string;
  created_at: string;
  note: string;
}

export interface SubmitSkillBody {
  name: string;
  description: string;
  description_zh?: string;
  role: SkillRole;
  tags?: string[];
  install_command: string;
  source_url: string;
  author: string;
  author_url?: string;
}

export interface ReviewBody {
  id: string;
  action: "approve" | "reject";
  reason?: string;
}
