import { createClient } from "@/lib/supabase/client";
import { getCurrentRollNo } from "@/utils/getCurrentRollNo";
import { Triplet, RamanujanStudent } from "@/types";

export const fetchUserTriplet = async (): Promise<Triplet> => {
  const supabase = createClient();
  const rollNo = getCurrentRollNo();

  const { data, error } = await supabase
    .from("triplets")
    .select(`
      student_1:ramanujan_students!student_1 (roll_no, name, branch),
      student_2:ramanujan_students!student_2 (roll_no, name, branch),
      student_3:ramanujan_students!student_3 (roll_no, name, branch)
    `)
    .or(`student_1.eq.${rollNo},student_2.eq.${rollNo},student_3.eq.${rollNo}`)
    .single();

  if (error) throw new Error(`Failed to fetch triplet: ${error.message}`);

  return {
    student_1: (data.student_1 as unknown as RamanujanStudent[])[0],
    student_2: (data.student_2 as unknown as RamanujanStudent[])[0],
    student_3: (data.student_3 as unknown as RamanujanStudent[])[0],
  };
};