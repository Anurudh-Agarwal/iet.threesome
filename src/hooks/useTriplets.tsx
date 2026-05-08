"use client";

import { fetchAllTriplets } from "@/services/fetchAllTriplets";
import { useState, useEffect } from "react";
import { Triplet, Error } from "@/types";

const useTriplets = () => {
  const [triplets, setTriplets] = useState<Triplet[]>([]);
  const [error, setError] = useState<Error | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const allTriplets = async () => {
    try {
      setIsLoading(true);
      const data = await fetchAllTriplets();
      setTriplets(data);
      setError(null);
    } catch (err) {
      setError(err as Error);
    } finally {
      setIsLoading(false);
    }
  };
  useEffect(() => {
    allTriplets();
  }, []);

  return { error, triplets, isLoading };
};

export default useTriplets;
