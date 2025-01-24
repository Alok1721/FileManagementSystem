import { supabase } from "../createClient.js";

export const fetchFiles = async () => {
  let { data, error } = await supabase.from("uploads").select("*").limit(10); // Limit to 10 latest files
  if (error) {
    console.error("Error fetching files:", error);
    return [];
  }
  return data;
};
