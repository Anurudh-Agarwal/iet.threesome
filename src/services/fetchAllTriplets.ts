import { createClient } from "@/lib/supabase/client";
import { type Triplet, type RamanujanStudent } from "@/types";

export const fetchAllTriplets = async (): Promise<Triplet[]> => {
  const supabase = createClient();

  const { data, error } = await supabase
    .from("triplets")
    .select(`
      student_1:ramanujan_students!student_1 (roll_no, name, branch),
      student_2:ramanujan_students!student_2 (roll_no, name, branch),
      student_3:ramanujan_students!student_3 (roll_no, name, branch)
    `);

  if (error) throw new Error(`Failed to fetch triplets: ${error.message}`);

  return data.map((row) => ({
    student_1: (row.student_1 as unknown as RamanujanStudent[])[0],
    student_2: (row.student_2 as unknown as RamanujanStudent[])[0],
    student_3: (row.student_3 as unknown as RamanujanStudent[])[0],
  }));
};