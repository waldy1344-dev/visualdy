'use server'

import { createClient } from '@supabase/supabase-js'

const resolveSupabaseConfig = () => {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL || process.env.SUPABASE_PROJECT_URL
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_SERVICE_ROLE || process.env.SUPABASE_ANON_KEY
  return { url, key }
}

export async function savePortfolioServer(payload: Record<string, unknown>) {
  const { url, key } = resolveSupabaseConfig()
  if (!url || !key) {
    throw new Error(`Supabase configuration is incomplete. URL: ${Boolean(url)}, Key: ${Boolean(key)}`)
  }

  const admin = createClient(url, key, {
    auth: { persistSession: false, autoRefreshToken: false },
  })

  const { data, error } = await admin.from('portfolio').insert(payload).select().single()

  if (error) throw new Error(`Supabase insert failed: ${error.message} (code: ${error.code || 'n/a'}, hint: ${error.hint || 'n/a'})`)
  return data
}

export async function updatePortfolioServer(id: string, payload: Record<string, unknown>) {
  const { url, key } = resolveSupabaseConfig()
  if (!url || !key) {
    throw new Error(`Supabase configuration is incomplete. URL: ${Boolean(url)}, Key: ${Boolean(key)}`)
  }

  const admin = createClient(url, key, {
    auth: { persistSession: false, autoRefreshToken: false },
  })

  const { data, error } = await admin.from('portfolio').update(payload).eq('id', id).select().single()

  if (error) throw new Error(`Supabase update failed: ${error.message} (code: ${error.code || 'n/a'}, hint: ${error.hint || 'n/a'})`)
  return data
}

export async function uploadMediaServer(formData: FormData) {
  const file = formData.get('file') as File
  const bucket = formData.get('bucket') as string
  const fileName = formData.get('fileName') as string

  if (!file || !bucket || !fileName) {
    throw new Error('Missing file, bucket, or fileName')
  }

  const { url, key } = resolveSupabaseConfig()
  if (!url || !key) {
    throw new Error(`Supabase configuration is incomplete.`)
  }

  const admin = createClient(url, key, {
    auth: { persistSession: false, autoRefreshToken: false },
  })

  const arrayBuffer = await file.arrayBuffer()
  const buffer = Buffer.from(arrayBuffer)

  const { error } = await admin.storage
    .from(bucket)
    .upload(fileName, buffer, { upsert: true, contentType: file.type })

  if (error) throw new Error(`Supabase upload failed: ${error.message}`)

  const { data } = admin.storage.from(bucket).getPublicUrl(fileName)
  return data.publicUrl
}
