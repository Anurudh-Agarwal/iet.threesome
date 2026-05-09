import { createClient } from "@/lib/supabase/client";
import { Triplet, RamanujanStudent } from "@/types";

export const fetchUserTriplet = async (roll_no: string): Promise<Triplet> => {
  const supabase = createClient();

  const { data, error } = await supabase
    .from("triplets")
    .select(
      `
      student_1:ramanujan_students!student_1 (roll_no, name, branch),
      student_2:ramanujan_students!student_2 (roll_no, name, branch),
      student_3:ramanujan_students!student_3 (roll_no, name, branch)
    `,
    )
    .or(`student_1.eq.${roll_no},student_2.eq.${roll_no},student_3.eq.${roll_no}`)
    .single();

  if (error) throw new Error(`Failed to fetch triplet: ${error.message}`);

  return {
    student_1: (data.student_1 as unknown as RamanujanStudent[])[0],
    student_2: (data.student_2 as unknown as RamanujanStudent[])[0],
    student_3: (data.student_3 as unknown as RamanujanStudent[])[0],
  };
};
