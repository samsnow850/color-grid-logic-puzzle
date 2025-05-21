
import { createClient } from '@supabase/supabase-js';
import type { Database } from './integrations/supabase/types';

const SUPABASE_URL = "https://vgfpmecqpchzqgajujkl.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZnZnBtZWNxcGNoenFnYWp1amtsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDc3NzQ3NDYsImV4cCI6MjA2MzM1MDc0Nn0.eYxZrUkrdb1YrCn4Y-X0j9-huPgH9hBLuauI2BGgI0A";

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);
