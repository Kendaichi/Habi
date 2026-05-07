import { createClient } from '@supabase/supabase-js'
import { getSupabaseBrowserEnv, hasSupabaseBrowserEnv } from '@/lib/supabase/env'

export const supabase = hasSupabaseBrowserEnv()
  ? createClient(getSupabaseBrowserEnv().url, getSupabaseBrowserEnv().key)
  : null
