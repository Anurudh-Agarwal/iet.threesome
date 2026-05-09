"use client";

import { useState, useEffect } from "react";
import getFormDataFromLocalStorage from "@/services/getFormDataFromLocalStorage";
import { useClerk } from "@clerk/nextjs";
import { FormData } from "@/types";

export const useFilledFormData = () => {
  const { user } = useClerk();
  const roll_no = user?.publicMetadata?.roll_no as string | undefined;
  const [data, setData] = useState<FormData | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    if (!roll_no) {
      setIsLoading(false);
      return;
    }
    const stored = getFormDataFromLocalStorage(roll_no);
    setData(stored);
    setIsLoading(false);
  }, [roll_no]);

  return { data, isLoading };
};
