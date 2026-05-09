import { createClient } from "@/lib/supabase/client";
import { Triplet, RamanujanStudent } from "@/types";

const extractStudent = (raw: unknown): RamanujanStudent => {
  if (Array.isArray(raw)) {
    const student = raw[0] as RamanujanStudent | undefined;
    if (!student) throw new Error("Joined student record missing from triplet row");
    return student;
  }
  if (raw && typeof raw === "object") {
    return raw as RamanujanStudent;
  }
  throw new Error("Unexpected shape for joined student record");
};

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
    student_1: extractStudent(data.student_1),
    student_2: extractStudent(data.student_2),
    student_3: extractStudent(data.student_3),
  };
};
