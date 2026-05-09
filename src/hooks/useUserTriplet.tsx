"use client";

import { fetchUserTriplet } from "@/services/fetchUserTriplet";
import { useState, useEffect } from "react";
import { Triplet, Error } from "@/types";
import { useUser } from "@clerk/nextjs";

const useUserTriplet = () => {
  const { user, isLoaded } = useUser();
  const [triplet, setTriplet] = useState<Triplet | null>(null);
  const [error, setError] = useState<Error | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Extract roll_no from email instead of publicMetadata
  const roll_no = user?.primaryEmailAddress?.emailAddress?.split("@")[0];

  useEffect(() => {
    if (!isLoaded) return; // wait for Clerk to load

    if (!roll_no) {
      setIsLoading(false); // not logged in, stop loading
      return;
    }

    const userTriplet = async () => {
      try {
        setIsLoading(true);
        const data = await fetchUserTriplet(roll_no);
        setTriplet(data);
        setError(null);
      } catch (err) {
        setError(err as Error);
      } finally {
        setIsLoading(false);
      }
    };

    userTriplet();
  }, [roll_no, isLoaded]);

  return { error, triplet, isLoading };
};

export default useUserTriplet;