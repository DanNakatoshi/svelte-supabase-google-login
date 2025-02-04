import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;


export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
    auth: {
        persistSession: true,  // ✅ Ensures session is saved in localStorage
        detectSessionInUrl: true, // ✅ Extracts session from URL after login
        autoRefreshToken: true,  // ✅ Refreshes token automatically when expired
    },    
    global: {
        headers: { 'x-forwarded-proto': 'https' } // 🛠 Fix for self-hosted Supabase
    }
});