"use client";

import { fetchUserTriplet } from "@/services/fetchUserTriplet";
import { useState, useEffect } from "react";
import { Triplet, Error } from "@/types";
import { getCurrentRollNo } from "@/utils/getCurrentRollNo";


const useUserTriplet = () => {

  const [triplet, setTriplet] = useState<Triplet | null>(null);
  const [error, setError] = useState<Error | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const roll_no=getCurrentRollNo()

  const userTriplet = async () => {
    try {
      setIsLoading(true);
      const data = await fetchUserTriplet ();
      setTriplet(data);
      setError(null);
    } catch (err) {
      setError(err as Error);
    } finally {
      setIsLoading(false);
    }
  };
  useEffect(() => {
    userTriplet();
  }, [roll_no]);

  return { error, triplet, isLoading };
};

export default useUserTriplet;
