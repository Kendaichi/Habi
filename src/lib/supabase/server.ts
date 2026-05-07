import { cookies } from 'next/headers'
import { createServerClient } from '@supabase/ssr'
import { getSupabaseBrowserEnv } from '@/lib/supabase/env'

export async function createSupabaseServerClient() {
  const cookieStore = await cookies()
  const { url, key } = getSupabaseBrowserEnv()

  return createServerClient(url, key, {
    cookies: {
      getAll() {
        return cookieStore.getAll()
      },
      setAll(cookiesToSet) {
        try {
          cookiesToSet.forEach(({ name, value, options }) => {
            cookieStore.set(name, value, options)
          })
        } catch {
          // Server Components cannot set cookies; proxy/route handlers can.
        }
      },
    },
  })
}
