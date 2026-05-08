import { createClient } from "@/lib/supabase/client";
import { getCurrentRollNo } from "@/utils/getCurrentRollNo";

export const fetchChosenPriorities = async () => {
  const supabase = createClient();
  const roll_no = getCurrentRollNo();

  const { data, error } = await supabase
    .from("priorities")
    .select(
      `
        p1,
        p2, 
        p3, 
        p4
    `,
    )
    .eq("voter_roll_no", roll_no)
    .single();

  if (error) throw { message: "Failed to fetch chosen priorities" };
  return data;
};
