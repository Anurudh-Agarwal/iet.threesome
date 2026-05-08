"use client";

import { useState, useEffect } from "react";
import getFormDataFromLocalStorage from "@/services/getFormDataFromLocalStorage";
import { FormData, Error } from "@/types";
import { getCurrentRollNo } from "@/utils/getCurrentRollNo";

export const useChosenPrioritites = () => {
  const [error, setError] = useState<Error | null>(null);
  const [chosenPrior, setChosenPrior] = useState<FormData | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const roll_no = getCurrentRollNo();

  const chosenPriorities = () => {
    try {
      setIsLoading(true);
      const data = getFormDataFromLocalStorage();
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
