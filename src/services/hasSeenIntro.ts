'use client'
import { HAS_SEEN_INTRO } from "@/lib/constants/localStorage";

export const hasSeenIntro = (): boolean => {
  if (typeof window === "undefined") return false;
  return localStorage.getItem(HAS_SEEN_INTRO) === "true";
};

export const markAsSeenIntro = (): void => {
  if (typeof window === "undefined") return;
  localStorage.setItem(HAS_SEEN_INTRO, "true");
};
