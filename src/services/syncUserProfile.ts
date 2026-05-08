import { getCurrentRollNo } from "@/utils/getCurrentRollNo";
import { createClient } from "@/lib/supabase/client";

export const syncUserProfile = async (clerkId: string): Promise<void> => {
  const supabase = createClient();
  const roll_no = getCurrentRollNo();

  const { error } = await supabase
    .from("profiles")
    .upsert({ clerk_id: clerkId, roll_no: roll_no });
  if (error)
    throw { message: "Error during upserting values in profiles table" };
};
