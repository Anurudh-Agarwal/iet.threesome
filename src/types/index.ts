import { BRANCHES } from "@/lib/constants/branches";

export type Branch = typeof BRANCHES[keyof typeof BRANCHES]["value"];

// ── User ─────────────────────────────────────────
export interface UserProfile {
  clerk_id: string;
  roll_no: string;
}

// ── Students ─────────────────────────────────────
export interface RamanujanStudent {
  roll_no: string;
  name: string;
  branch: Branch;
}

export interface Error { 
  message: string;
}

export interface VotedStudent {
  priority: number;
  roll_no: string;
  name: string;
  branch: Branch;
}

// ── Form ─────────────────────────────────────────
export interface FormData {
  voter_roll_no: string;
  p1: string;
  p2: string;
  p3: string;
  p4: string;
}

// ── Triplet ──────────────────────────────────────
export interface Triplet {
  student_1: RamanujanStudent;   // reuse existing type, don't repeat yourself
  student_2: RamanujanStudent;
  student_3: RamanujanStudent;
}