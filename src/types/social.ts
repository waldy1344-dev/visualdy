export interface SocialLink {
  id: string
  platform: string
  url: string
  icon?: string
}

export type SocialLinkInsert = Omit<SocialLink, 'id'>
export type SocialLinkUpdate = Partial<SocialLinkInsert>
