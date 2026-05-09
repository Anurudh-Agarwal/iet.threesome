import { createClient } from "@/lib/supabase/client";

export const syncUserProfile = async ( clerkId: string, roll_no:string): Promise<void> => {
  const supabase = createClient();

  const { error } = await supabase
    .from("profiles")
    .upsert({ clerk_id: clerkId, roll_no: roll_no });
  if (error)
    throw { message: "Error during upserting values in profiles table" };
};
