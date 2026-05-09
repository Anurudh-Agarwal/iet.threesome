"use client";

import { useState, useEffect } from "react";
import getFormDataFromLocalStorage from "@/services/getFormDataFromLocalStorage";
import { FormData, Error } from "@/types";
import { useClerk } from "@clerk/nextjs";

export const useChosenPrioritites = () => {
  const [error, setError] = useState<Error | null>(null);
  const [chosenPrior, setChosenPrior] = useState<FormData | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const {user}= useClerk();
  const roll_no = user?.publicMetadata?.roll_no as string;

  const chosenPriorities = () => {
    if(!roll_no) return;
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
  };
  useEffect(() => {
    chosenPriorities();
  }, [roll_no]);

  return { error, isLoading, chosenPrior };
};
