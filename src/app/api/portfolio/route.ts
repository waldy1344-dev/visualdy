import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_SERVICE_ROLE_KEY

const getSupabaseConfigStatus = () => ({
  hasUrl: Boolean(supabaseUrl),
  hasServiceRoleKey: Boolean(serviceRoleKey),
  url: supabaseUrl ? supabaseUrl.replace(/https?:\/\/[^/]+/, 'https://***') : null,
})

const normalizePayload = (body: any) => {
  if (!body || typeof body !== 'object') return body

  const normalized = { ...body }

  if (normalized.id === undefined || normalized.id === null || normalized.id === '') {
    delete normalized.id
  }
  if (normalized.created_at === undefined || normalized.created_at === null || normalized.created_at === '') {
    delete normalized.created_at
  }

  const allowedFields = ['title', 'description', 'image_url', 'video_url', 'media_type', 'category']
  const cleaned: Record<string, unknown> = {}

  for (const field of allowedFields) {
    if (normalized[field] !== undefined) {
      const value = normalized[field]
      if (value === null || value === '') {
        if (field === 'title') {
          cleaned[field] = ''
        } else if (field === 'category') {
          cleaned[field] = 'Logo'
        } else if (field === 'media_type') {
          cleaned[field] = 'image'
        } else if (field === 'image_url') {
          cleaned[field] = null
        } else if (field === 'video_url') {
          cleaned[field] = null
        } else if (field === 'description') {
          cleaned[field] = null
        }
      } else {
        cleaned[field] = value
      }
    }
  }

  if (cleaned.title === undefined) cleaned.title = ''
  if (cleaned.category === undefined) cleaned.category = 'Logo'
  if (cleaned.media_type === undefined) cleaned.media_type = 'image'
  if (cleaned.image_url === undefined) cleaned.image_url = null
  if (cleaned.video_url === undefined) cleaned.video_url = null
  if (cleaned.description === undefined) cleaned.description = null

  return cleaned
}

const getAdminClient = () => {
  if (!supabaseUrl || !serviceRoleKey) {
    throw new Error(`Supabase service role key is not configured. Config: ${JSON.stringify(getSupabaseConfigStatus())}`)
  }

  return createClient(supabaseUrl, serviceRoleKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  })
}

export async function POST(request: NextRequest) {
  try {
    const body = normalizePayload(await request.json())
    const supabase = getAdminClient()
    const { data, error } = await supabase
      .from('portfolio')
      .insert(body)
      .select()
      .single()

    if (error) {
      return NextResponse.json({
        error: error.message,
        details: { code: error.code, hint: error.hint, status: error.status, config: getSupabaseConfigStatus() },
      }, { status: 400 })
    }

    return NextResponse.json({ data })
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to save portfolio'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')
    if (!id) {
      return NextResponse.json({ error: 'Missing portfolio id' }, { status: 400 })
    }

    const body = normalizePayload(await request.json())
    const supabase = getAdminClient()
    const { data, error } = await supabase
      .from('portfolio')
      .update(body)
      .eq('id', id)
      .select()
      .single()

    if (error) {
      return NextResponse.json({
        error: error.message,
        details: { code: error.code, hint: error.hint, status: error.status, config: getSupabaseConfigStatus() },
      }, { status: 400 })
    }

    return NextResponse.json({ data })
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to update portfolio'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')
    if (!id) {
      return NextResponse.json({ error: 'Missing portfolio id' }, { status: 400 })
    }

    const supabase = getAdminClient()
    const { error } = await supabase.from('portfolio').delete().eq('id', id)

    if (error) {
      return NextResponse.json({
        error: error.message,
        details: { code: error.code, hint: error.hint, status: error.status, config: getSupabaseConfigStatus() },
      }, { status: 400 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to delete portfolio'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
