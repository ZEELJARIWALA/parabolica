import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''

console.log("--- SUPABASE DEBUG INFO ---");
console.log("TARGET URL:", supabaseUrl);
console.log("KEY PRESENT:", !!supabaseAnonKey);
console.log("KEY LENGTH:", supabaseAnonKey.length);
console.log("---------------------------");

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
