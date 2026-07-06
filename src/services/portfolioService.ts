import supabase from '@/lib/supabaseClient'
import { savePortfolioServer, updatePortfolioServer } from '@/app/actions/portfolioActions'
import { Portfolio, PortfolioInsert, PortfolioUpdate } from '@/types/portfolio'

// ─── Dummy data fallback ───────────────────────────────────────────────────
export const DUMMY_PORTFOLIOS: Portfolio[] = [
  {
    id: 'dummy-1',
    title: 'Logo Kopi Nusantara',
    description: 'Desain logo modern untuk brand kopi lokal dengan nuansa earthy tone.',
    image_url: 'https://images.unsplash.com/photo-1611532736597-de2d4265fba3?w=600&q=80',
    category: 'Logo',
    media_type: 'image',
    created_at: '2024-01-15T00:00:00Z',
  },
  {
    id: 'dummy-2',
    title: 'Logo Startup Fintech',
    description: 'Identitas visual minimalis untuk perusahaan teknologi keuangan.',
    image_url: 'https://images.unsplash.com/photo-1559136555-9303baea8ebd?w=600&q=80',
    category: 'Logo',
    media_type: 'image',
    created_at: '2024-01-20T00:00:00Z',
  },
  {
    id: 'dummy-3',
    title: 'Poster Festival Musik',
    description: 'Desain poster dinamis untuk event festival musik tahunan.',
    image_url: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=600&q=80',
    category: 'Poster',
    media_type: 'image',
    created_at: '2024-02-01T00:00:00Z',
  },
  {
    id: 'dummy-4',
    title: 'Poster Pameran Seni',
    description: 'Visual artistik untuk pameran seni kontemporer Indonesia.',
    image_url: 'https://images.unsplash.com/photo-1536924940846-227afb31e2a5?w=600&q=80',
    category: 'Poster',
    media_type: 'image',
    created_at: '2024-02-10T00:00:00Z',
  },
  {
    id: 'dummy-5',
    title: 'Banner Promo Ramadhan',
    description: 'Banner promosi elegan bertema Ramadhan untuk e-commerce.',
    image_url: 'https://images.unsplash.com/photo-1542831371-29b0f74f9713?w=600&q=80',
    category: 'Banner',
    media_type: 'image',
    created_at: '2024-03-01T00:00:00Z',
  },
  {
    id: 'dummy-6',
    title: 'Banner Digital Agency',
    description: 'Banner web modern untuk landing page digital agency.',
    image_url: 'https://images.unsplash.com/photo-1467232004584-a241de8bcf5d?w=600&q=80',
    category: 'Banner',
    media_type: 'image',
    created_at: '2024-03-15T00:00:00Z',
  },
]

// ─── CRUD ──────────────────────────────────────────────────────────────────
export const getPortfolios = async (): Promise<Portfolio[]> => {
  const { data, error } = await supabase
    .from('portfolio')
    .select('*')
    .order('created_at', { ascending: false })
  if (error) {
    console.warn('Supabase error, using dummy data:', error.message)
    return DUMMY_PORTFOLIOS
  }
  // Gabungkan data real + dummy jika data real kosong
  if (!data || data.length === 0) return DUMMY_PORTFOLIOS
  return data
}

export const getPortfolioById = async (id: string): Promise<Portfolio | null> => {
  const { data, error } = await supabase
    .from('portfolio')
    .select('*')
    .eq('id', id)
    .single()
  if (error) throw error
  return data
}

export const addPortfolio = async (payload: PortfolioInsert): Promise<Portfolio> => {
  return (await savePortfolioServer(payload as Record<string, unknown>)) as Portfolio
}

export const updatePortfolio = async (id: string, payload: PortfolioUpdate): Promise<Portfolio> => {
  return (await updatePortfolioServer(id, payload as Record<string, unknown>)) as Portfolio
}

export const deletePortfolio = async (id: string): Promise<void> => {
  const response = await fetch(`/api/portfolio?id=${encodeURIComponent(id)}`, { method: 'DELETE' })
  const result = await response.json()
  if (!response.ok) {
    throw new Error(result.error || 'Failed to delete portfolio')
  }
}

export const uploadPortfolioImage = async (file: File): Promise<string> => {
  const fileName = `${Date.now()}-${file.name.replace(/\s+/g, '-')}`
  const formData = new FormData()
  formData.append('file', file)
  formData.append('bucket', 'portfolio-images')
  formData.append('fileName', fileName)
  
  return await import('@/app/actions/portfolioActions').then(m => m.uploadMediaServer(formData))
}

export const uploadPortfolioVideo = async (file: File): Promise<string> => {
  const fileName = `${Date.now()}-${file.name.replace(/\s+/g, '-')}`
  const formData = new FormData()
  formData.append('file', file)
  formData.append('bucket', 'portfolio-videos')
  formData.append('fileName', fileName)
  
  return await import('@/app/actions/portfolioActions').then(m => m.uploadMediaServer(formData))
}

export const getCategories = async (): Promise<string[]> => {
  return ['Logo', 'Poster', 'Banner']
}
