import { createClient } from "@/lib/supabase/client";

export const fetchAllStudents = async () => {
  const supabase = createClient();

  const { data, error } = await supabase
    .from("ramanujan_students")
    .select(`roll_no, name, branch`);

  if (error) {
    console.error("Supabase error:", error);
    throw { message: "Failed to fetch Students" };
  }

  console.log("Fetched students:", data);
  return data;
};