import { supabase } from "../createClient.js";

export const registerUser = async (name, email, password) => {
  try {
    const { user, error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { name } }, 
    });

    if (error) throw error;

    return user;
  } catch (error) {
    throw new Error(error.message);
  }
};


  export const loginUser = async (email, password) => {
    try {
      const { user, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
  
      if (error) throw error;
      return user;
    } catch (error) {
      throw new Error(error.message);
    }
  };
  
