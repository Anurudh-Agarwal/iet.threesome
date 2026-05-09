import { NextResponse } from "next/server";
import fetchAllPriorities from "@/services/fetchAllPriorities";
import saveTriplets from "@/services/saveTriplets";
import { calculateTriplets } from "@/lib/algo";

export async function POST() {
  try {
    const students = await fetchAllPriorities();
    const triplets = calculateTriplets(students);
    await saveTriplets(triplets);
    return NextResponse.json({ success: true });
  } catch (err) {
    return NextResponse.json(
      { error: (err as Error).message },
      { status: 500 }
    );
  }
}
