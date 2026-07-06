import supabase from '@/lib/supabaseClient'
import { Testimonial, TestimonialInsert, TestimonialUpdate } from '@/types/testimonial'

export const getTestimonials = async (): Promise<Testimonial[]> => {
  const { data, error } = await supabase
    .from('testimonials')
    .select('*')
    .order('id', { ascending: false })
  if (error) throw error
  return data || []
}

export const addTestimonial = async (payload: TestimonialInsert): Promise<Testimonial> => {
  return await import('@/app/actions/testimonialActions').then(m => m.addTestimonialServer(payload as Record<string, unknown>)) as Testimonial
}

export const updateTestimonial = async (id: string, payload: TestimonialUpdate): Promise<Testimonial> => {
  const { data, error } = await supabase
    .from('testimonials')
    .update(payload)
    .eq('id', id)
    .select()
    .single()
  if (error) throw error
  return data
}

export const deleteTestimonial = async (id: string): Promise<void> => {
  const { error } = await supabase.from('testimonials').delete().eq('id', id)
  if (error) throw error
}

export const uploadTestimonialPhoto = async (file: File): Promise<string> => {
  const fileName = `${Date.now()}-${file.name.replace(/\s+/g, '-')}`
  const formData = new FormData()
  formData.append('file', file)
  formData.append('bucket', 'testimonial-photos')
  formData.append('fileName', fileName)
  
  return await import('@/app/actions/portfolioActions').then(m => m.uploadMediaServer(formData))
}
