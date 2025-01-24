import { createClient } from "@supabase/supabase-js";

export const supabase =createClient(
    "https://svudmitjvxqhfmymuqlr.supabase.co","eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InN2dWRtaXRqdnhxaGZteW11cWxyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzY4ODE1MjAsImV4cCI6MjA1MjQ1NzUyMH0.e3-gRM0xShK4d0nOeT9ov6PwWqrKWrDiX4B2xXJoZT8"
)