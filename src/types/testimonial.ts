export interface Testimonial {
  id: string
  name: string
  message: string
  photo_url?: string
  rating: number
  admin_reply?: string
  created_at?: string
}

export type TestimonialInsert = Omit<Testimonial, 'id' | 'created_at'>
export type TestimonialUpdate = Partial<TestimonialInsert>
