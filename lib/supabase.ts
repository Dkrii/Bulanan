import { createClient } from '@supabase/supabase-js'

// TODO: User needs to configure these in .env.local
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder-key';

if (supabaseUrl === 'https://placeholder.supabase.co' || supabaseAnonKey === 'placeholder-key') {
    console.warn('⚠️ Supabase credentials are not set. Please configure .env.local with your actual URL and Key.');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
