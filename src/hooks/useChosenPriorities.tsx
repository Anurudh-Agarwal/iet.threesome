"use client";

import { useState, useEffect } from "react";
import getFormDataFromLocalStorage from "@/services/getFormDataFromLocalStorage";
import { FormData, Error } from "@/types";
import { useUser } from "@clerk/nextjs"; // changed from useClerk

export const useChosenPriorities = () => {
  const [error, setError] = useState<Error | null>(null);
  const [chosenPrior, setChosenPrior] = useState<FormData | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const { user, isLoaded } = useUser();
  const roll_no = user?.primaryEmailAddress?.emailAddress?.split("@")[0];

  useEffect(() => {
    if (!isLoaded) return;

    if (!roll_no) {
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      const data = getFormDataFromLocalStorage(roll_no);
      setChosenPrior(data);
      setError(null);
    } catch (err) {
      setError(err as Error);
    } finally {
      setIsLoading(false);
    }
  }, [roll_no, isLoaded]);

  return { error, isLoading, chosenPrior };
};