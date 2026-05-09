import { FormData } from "@/types";
import { createClient } from "@/lib/supabase/client";

export const saveFormDataToSupabase = async (voter_roll_no:string , formData: FormData) : Promise<void>=> {
  const supabase = createClient();

  const { error } = await supabase.from("priorities").upsert({
    voter_roll_no,
    p1: formData.p1.roll_no,
    p2: formData.p2.roll_no,
    p3: formData.p3.roll_no,
    p4: formData.p4.roll_no,
  });
  if (error)
    throw { message: "Error during upsert the formData into supabase" };
};
