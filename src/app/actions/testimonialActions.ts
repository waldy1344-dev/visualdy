'use server'

import { createClient } from '@supabase/supabase-js'

const resolveSupabaseConfig = () => {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL || process.env.SUPABASE_PROJECT_URL
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_SERVICE_ROLE || process.env.SUPABASE_ANON_KEY
  return { url, key }
}

export async function addTestimonialServer(payload: Record<string, unknown>) {
  const { url, key } = resolveSupabaseConfig()
  if (!url || !key) {
    throw new Error(`Supabase configuration is incomplete. URL: ${Boolean(url)}, Key: ${Boolean(key)}`)
  }

  const admin = createClient(url, key, {
    auth: { persistSession: false, autoRefreshToken: false },
  })

  const { data, error } = await admin.from('testimonials').insert(payload).select().single()

  if (error) throw new Error(`Supabase insert failed: ${error.message}`)
  return data
}
