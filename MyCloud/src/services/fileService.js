import { createClient } from "@supabase/supabase-js";
import { pipeline } from "@xenova/transformers";
import { supabase } from "../createClient.js";

export const fetchFiles = async () => {
  let { data, error } = await supabase.from("uploads").select("*").order("uploaded_dateTime", { ascending: false }); // Limit to 10 latest files
  if (error) {
    console.error("Error fetching files:", error);
    return [];
  }
  return data;
};

const generateEmbedding = async (text) => {
  const response = await fetch('http://localhost:8089/generate_embedding', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ text }),
  });

  if (!response.ok) {
    console.error('Failed to generate embedding:', response.statusText);
    return null;
  }

  const data = await response.json();
  return data.embedding;
};


export const searchFilesByQuery = async (query) => {
  // Generate embedding for the query
  const queryEmbedding = await generateEmbedding(query);

  // Perform hybrid search using Supabase RPC
  const { data, error } = await supabase.rpc("match_files", {
    query_embedding: queryEmbedding,
    query_keyword: query, // Use the query as the keyword
    match_threshold: 0.5, // Adjust as needed
    match_count: 10,      // Adjust as needed
  });

  if (error) {
    console.error("Search error:", error);
    return [];
  }

  return data;
};


const getSummaryEmbeddingFromFlask =async (formData)=>{
  
  const response = await fetch('http://localhost:8089/extract_text', {
    method: 'POST',
    body: formData,
  });
  if (!response.ok) {
    console.error("Failed to extract text:", response.statusText);
    return;
  }
  const jsonData = await response.json();
  const extractedText = jsonData.extracted_text;
  const partialContent = jsonData.summary;
  const embedding = jsonData.embedding;
  return {partialContent,embedding}
}


export const uploadFile = async (file) => {
  const fileName = `${Date.now()}-${file.name}`;
  const { data, error } = await supabase.storage.from('uploads').upload(fileName, file);
  if (error) {
    console.error('Upload error:', error);
    return { success: false, error };
  }
  else{
    console.log("sucess:uploaded in bucket")
  }
  const formData = new FormData();
  formData.append('file', file);
  const { partialContent, embedding } = await getSummaryEmbeddingFromFlask(formData);
  const embedding384 = embedding.slice(0, 384);
  const { error: insertError } = await supabase.from('uploads').insert([
    {
      file_name: file.name,
      file_size: (file.size / 1024).toFixed(2) + ' KB',
      uploaded_by: `User${Math.floor(Math.random() * 1000)}`, // Can be replaced with user authentication
      uploaded_dateTime: new Date().toISOString(),
      file_url: data.path,
      partial_content: partialContent,
      embedding:embedding384
    },
  ]);

  if (insertError) {
    console.error('Database insert error:', insertError);
    return { success: false, error: insertError };
  }
  console.log("uploaded in table:",data.path)

  return { success: true };
};