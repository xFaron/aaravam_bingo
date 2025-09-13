import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://ufnwjkggstcblhkxdlyl.supabase.co' // Found in API settings
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVmbndqa2dnc3RjYmxoa3hkbHlsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTc3NjI5MjYsImV4cCI6MjA3MzMzODkyNn0.h-TisdMU05VY85lPbAqLy6jy_IPVkgOUphXrg0Yk3hk'   // Found in API settings

export const supabase = createClient(supabaseUrl, supabaseAnonKey)