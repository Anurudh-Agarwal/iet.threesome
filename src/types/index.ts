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
    p1: RamanujanStudent; 
    p2: RamanujanStudent;
    p3: RamanujanStudent;
    p4: RamanujanStudent;
}

// ── Triplet ──────────────────────────────────────
export interface Triplet {
  student_1: RamanujanStudent;   
  student_2: RamanujanStudent;
  student_3: RamanujanStudent;
}