"use client";

import { useState, useEffect } from "react";
import { useUser } from "@clerk/nextjs";
import { FormData } from "@/types";
import { fetchChosenPriorities } from "@/services/fetchChosenPriorities";

export const useFilledFormData = () => {
  const { user, isLoaded, isSignedIn } = useUser();
  const roll_no = user?.primaryEmailAddress?.emailAddress?.split("@")[0];
  const [data, setData] = useState<FormData | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    if (!isLoaded) return;

    // Guest user — never show chosen priorities
    if (!isSignedIn || !roll_no) {
      setData(null);
      setIsLoading(false);
      return;
    }

    const load = async () => {
      try {
        const result = await fetchChosenPriorities(roll_no);
        if (!result) {
          setData(null);
          return;
        }

        // Supabase returns arrays for joined fields, extract first element
        setData({
          p1: Array.isArray(result.p1) ? result.p1[0] : result.p1,
          p2: Array.isArray(result.p2) ? result.p2[0] : result.p2,
          p3: Array.isArray(result.p3) ? result.p3[0] : result.p3,
          p4: Array.isArray(result.p4) ? result.p4[0] : result.p4,
        });
      } catch {
        setData(null); // any error = show form
      } finally {
        setIsLoading(false);
      }
    };

    load(); // 👈 was missing
  }, [roll_no, isLoaded, isSignedIn]);

  return { data, isLoading };
};