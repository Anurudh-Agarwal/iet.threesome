import fetchAllPriorities from "@/services/fetchAllPriorities";
import saveTriplets from "@/services/saveTriplets";
import { calculateTriplets } from "@/lib/algo";

export const runAlgorithm = async (): Promise<void> => {
  const students = await fetchAllPriorities();
  const triplets = calculateTriplets(students);
  await saveTriplets(triplets);
};