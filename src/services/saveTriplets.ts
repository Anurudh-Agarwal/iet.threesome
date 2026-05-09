import { createClient } from "@/lib/supabase/server";

interface TripletInput {
  student_1: string;
  student_2: string;
  student_3: string;
}

const saveTriplets = async (triplets: TripletInput[]): Promise<void> => {
  const supabase = await createClient(); // ✅ await for server client

  const { error } = await supabase
    .from("triplets")
    .upsert(triplets);

  if (error) throw new Error(error.message);
};

export default saveTriplets;