export interface Portfolio {
  id: string
  title: string
  description: string
  image_url: string
  video_url?: string
  media_type?: 'image' | 'video'
  category: string
  created_at: string
}

export type PortfolioInsert = Omit<Portfolio, 'id' | 'created_at'>
export type PortfolioUpdate = Partial<PortfolioInsert>
