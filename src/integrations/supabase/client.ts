
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://jexczwnpirrgvywdmjeg.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpleGN6d25waXJyZ3Z5d2RtamVnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTAyNzgyODcsImV4cCI6MjA2NTg1NDI4N30.2v10eSRNduYrMt76D_Q4Z9596pi6KAIXUTLrl4sKSpA'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
