import { createClient } from "@supabase/supabase-js";
import { pipeline } from "@xenova/transformers";
import { supabase } from "../createClient.js";

// export const fetchFiles = async () => {
//   let { data, error } = await supabase.from("uploads").select("*").limit(10); // Limit to 10 latest files
//   if (error) {
//     console.error("Error fetching files:", error);
//     return [];
//   }
//   return data;
// };

// const extractTextFromFile = async (file) => {
//   const reader = new FileReader();
//   return new Promise((resolve) => {
//     reader.onload = (event) => resolve(event.target.result);
//     reader.readAsText(file);
//   });
// };

// const summarizeText = async (text) => {
//   const summarizer = await pipeline("summarization", "Xenova/facebook/bart-large-cnn");
//   const summary = await summarizer(text, { max_length: 200, min_length: 50 });
//   return summary[0].summary_text;
// };

// const generateEmbedding = async (content) => {
//   const embedder = await pipeline("feature-extraction", "Xenova/all-MiniLM-L6-v2");
//   const output = await embedder(content, { pooling: "mean", normalize: true });
//   return output.data;
// };

// export const uploadFile = async (file) => {
//   const content = await extractTextFromFile(file);
//   const processedContent = content.split(" ").length > 1000 ? await summarizeText(content) : content;
//   const embedding = await generateEmbedding(processedContent);

//   const { data, error } = await supabase.from("uploads").insert([
//     {
//       file_name: file.name,
//       file_size: file.size,
//       uploaded_by: "User",
//       file_url: `public/uploads/${file.name}`,
//       partial_content: processedContent,
//       embedding,
//     },
//   ]);

//   if (error) {
//     console.error("Upload error:", error);
//     return false;
//   }
//   return data;
// };


// export const searchFilesByQuery = async (query) => {
//   const queryEmbedding = await generateEmbedding(query);

//   const { data, error } = await supabase.rpc("match_files", {
//     query_embedding: queryEmbedding,
//     match_threshold: 0.8,
//     match_count: 10,
//   });

//   if (error) {
//     console.error("Search error:", error);
//     return [];
//   }
//   return data;
// };


export const fetchFiles = async () => {
  let { data, error } = await supabase
    .from('uploads')
    .select('*')
    .order('uploaded_date', { ascending: false })
    .limit(10);
  
  if (error) {
    console.error('Error fetching files:', error);
    return [];
  }

  return data;
};

export const uploadFile = async (file) => {
  const fileName = `${Date.now()}-${file.name}`;
  const { data, error } = await supabase.storage.from('uploads').upload(fileName, file);

  if (error) {
    console.error('Upload error:', error);
    return { success: false, error };
  }

  const { error: insertError } = await supabase.from('uploads').insert([
    {
      file_name: file.name,
      file_size: (file.size / 1024).toFixed(2) + ' KB',
      uploaded_by: `User${Math.floor(Math.random() * 1000)}`, // Can be replaced with user authentication
      uploaded_date: new Date().toISOString().split('T')[0],
      file_url: data.path,
    },
  ]);

  if (insertError) {
    console.error('Database insert error:', insertError);
    return { success: false, error: insertError };
  }

  return { success: true };
};