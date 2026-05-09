"use client";

import { fetchUserTriplet } from "@/services/fetchUserTriplet";
import { useState, useEffect } from "react";
import { Triplet, Error } from "@/types";
import { useClerk } from "@clerk/nextjs";

const useUserTriplet = () => {

  const {user}=useClerk();
  const [triplet, setTriplet] = useState<Triplet | null>(null);
  const [error, setError] = useState<Error | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const roll_no = user?.publicMetadata?.roll_no as string;

  const userTriplet = async () => {
    if(!roll_no) return ;
    try {
      setIsLoading(true);
      const data = await fetchUserTriplet (roll_no);
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
