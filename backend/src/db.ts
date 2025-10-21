import { createClient } from '@supabase/supabase-js'

export const getSupabase = (env: Env) => {
  const supabase = createClient(env.SUPABASE_URL, env.SUPABASE_ANON_KEY)
  return supabase
}
