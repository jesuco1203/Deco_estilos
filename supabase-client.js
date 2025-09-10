
import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2';

const SUPABASE_URL = 'https://qehmrxrrtestgxvqjjze.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFlaG1yeHJydGVzdGd4dnFqanplIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTYzMTI2OTIsImV4cCI6MjA3MTg4ODY5Mn0.hGXhKwBh-gNjx1sq195nnOdOm2yg2NcHvigF9RkCeAc';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
