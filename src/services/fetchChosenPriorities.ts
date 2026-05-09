import { createClient } from "@/lib/supabase/client";

export const fetchChosenPriorities = async (roll_no: string) => {
  const supabase = createClient();

  const { data, error } = await supabase
    .from("priorities")
    .select(
      `
        p1:ramanujan_students!p1 (roll_no, name, branch),
        p2:ramanujan_students!p2 (roll_no, name, branch),
        p3:ramanujan_students!p3 (roll_no, name, branch),
        p4:ramanujan_students!p4 (roll_no, name, branch)
    `,
    )
    .eq("voter_roll_no", roll_no)
    .single();

  if (error) throw { message: "Failed to fetch chosen priorities" };
  return data;
};
