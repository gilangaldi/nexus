// src/integrations/supabase/client.ts
import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL || "https://vfkivyuvkjptskqobzzq.supabase.co";
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZma2l2eXV2a2pwdHNrcW9ienpxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODEyNjMxODMsImV4cCI6MjA5NjgzOTE4M30.D7u8YV1Y5oG1EhAMbm7Xm9uxrOCwoIwGm4oF6efj47Q";

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
  },
});