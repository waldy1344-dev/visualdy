import supabase from '@/lib/supabaseClient'
import { SocialLink, SocialLinkInsert } from '@/types/social'

export const getSocialLinks = async (): Promise<SocialLink[]> => {
  const { data, error } = await supabase
    .from('social_links')
    .select('*')
    .order('platform')
  if (error) throw error
  return data || []
}

export const upsertSocialLink = async (payload: SocialLinkInsert): Promise<SocialLink> => {
  const { data, error } = await supabase
    .from('social_links')
    .upsert(payload, { onConflict: 'platform' })
    .select()
    .single()
  if (error) throw error
  return data
}

export const deleteSocialLink = async (id: string): Promise<void> => {
  const { error } = await supabase.from('social_links').delete().eq('id', id)
  if (error) throw error
}
