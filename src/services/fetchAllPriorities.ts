import { createClient } from "@/lib/supabase/server";

interface StudentPriority {
  roll_no: string;
  priorities: string[]; 
}

const fetchAllPriorities = async (): Promise<StudentPriority[]> => {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("priorities")              
    .select("voter_roll_no, p1, p2, p3, p4");

  if (error) throw new Error(error.message);

  return data.map((row) => ({
    roll_no: row.voter_roll_no,     
    priorities: [row.p1, row.p2, row.p3, row.p4],
  }));
};

export default fetchAllPriorities;