'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Star, Upload, Loader2, CheckCircle2 } from 'lucide-react'
import Image from 'next/image'
import { addTestimonial, uploadTestimonialPhoto } from '@/services/testimonialService'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'

const schema = z.object({
  name: z.string().min(2, 'Nama minimal 2 karakter'),
  message: z.string().min(10, 'Pesan/ulasan minimal 10 karakter'),
  rating: z.coerce.number().min(1).max(5),
  photo_url: z.string().optional(),
})

type FormData = z.infer<typeof schema>

export default function ReviewPage() {
  const [photoFile, setPhotoFile] = useState<File | null>(null)
  const [photoPreview, setPhotoPreview] = useState<string>('')
  const [uploading, setUploading] = useState(false)
  const [hoverRating, setHoverRating] = useState(0)
  const [submitted, setSubmitted] = useState(false)
  const [errorMsg, setErrorMsg] = useState('')

  const { register, handleSubmit, watch, setValue, formState: { errors, isSubmitting } } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { rating: 5 },
  })

  const currentRating = watch('rating')

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    if (!file.type.startsWith('image/')) {
      setErrorMsg('Silakan pilih file gambar yang valid.')
      return
    }
    setErrorMsg('')
    setPhotoFile(file)
    setPhotoPreview(URL.createObjectURL(file))
  }

  const onSubmit = async (data: FormData) => {
    try {
      setErrorMsg('')
      let photoUrl = ''

      if (photoFile) {
        setUploading(true)
        photoUrl = await uploadTestimonialPhoto(photoFile)
        setUploading(false)
      }

      await addTestimonial({ ...data, photo_url: photoUrl || undefined })
      setSubmitted(true)
    } catch (err: unknown) {
      setUploading(false)
      setErrorMsg(err instanceof Error ? err.message : 'Gagal mengirim ulasan. Coba lagi nanti.')
    }
  }

  return (
    <>
      <Navbar />
      <main style={{ minHeight: '100vh', background: 'var(--bg-base)', paddingTop: '100px', paddingBottom: '4rem' }}>
        <div className="container" style={{ maxWidth: '600px' }}>
          
          {submitted ? (
            <div style={{
              background: 'var(--bg-card)', padding: '4rem 2rem',
              borderRadius: '24px', border: '1px solid var(--border-subtle)',
              textAlign: 'center', animation: 'fadeInUp 0.5s ease',
            }}>
              <CheckCircle2 size={64} color="#10B981" style={{ margin: '0 auto 1.5rem' }} />
              <h1 style={{ fontSize: '2rem', fontWeight: 800, marginBottom: '1rem' }}>Terima Kasih!</h1>
              <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem', marginBottom: '2rem' }}>
                Ulasan Anda sangat berarti bagi kami dan membantu kami untuk terus memberikan yang terbaik.
              </p>
              <button onClick={() => window.location.href = '/'} className="btn-primary" style={{ padding: '0.8rem 2rem' }}>
                Kembali ke Beranda
              </button>
            </div>
          ) : (
            <div style={{
              background: 'var(--bg-card)', padding: '2.5rem',
              borderRadius: '24px', border: '1px solid var(--border-subtle)',
              animation: 'fadeInUp 0.4s ease',
            }}>
              <h1 style={{ fontSize: '2rem', fontWeight: 800, marginBottom: '0.5rem', textAlign: 'center' }}>
                Berikan Ulasan
              </h1>
              <p style={{ color: 'var(--text-secondary)', textAlign: 'center', marginBottom: '2.5rem' }}>
                Bagaimana pengalaman Anda bekerja sama dengan Visualdy?
              </p>

              {errorMsg && (
                <div style={{
                  padding: '1rem', background: 'rgba(239,68,68,0.1)',
                  border: '1px solid rgba(239,68,68,0.3)', borderRadius: '12px',
                  color: '#EF4444', marginBottom: '1.5rem', fontSize: '0.9rem',
                }}>
                  {errorMsg}
                </div>
              )}

              <form onSubmit={handleSubmit(onSubmit)} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                
                {/* Rating */}
                <div style={{ textAlign: 'center' }}>
                  <label style={{ display: 'block', fontSize: '1.1rem', fontWeight: 600, marginBottom: '0.75rem' }}>
                    Rating Anda
                  </label>
                  <div style={{ display: 'flex', justifyContent: 'center', gap: '0.5rem' }}>
                    {[1, 2, 3, 4, 5].map(s => (
                      <button
                        key={s}
                        type="button"
                        onClick={() => setValue('rating', s)}
                        onMouseEnter={() => setHoverRating(s)}
                        onMouseLeave={() => setHoverRating(0)}
                        style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '0.2rem', transition: 'transform 0.1s' }}
                      >
                        <Star
                          size={40}
                          fill={(hoverRating || currentRating) >= s ? '#F59E0B' : 'rgba(255,255,255,0.1)'}
                          color={(hoverRating || currentRating) >= s ? '#F59E0B' : 'rgba(255,255,255,0.2)'}
                          style={{ transition: 'all 0.2s ease', filter: (hoverRating || currentRating) >= s ? 'drop-shadow(0 0 8px rgba(245,158,11,0.4))' : 'none' }}
                        />
                      </button>
                    ))}
                  </div>
                </div>

                {/* Name */}
                <div>
                  <label className="form-label" htmlFor="review-name">Nama Anda</label>
                  <input id="review-name" className="form-input" placeholder="Masukkan nama..." {...register('name')} />
                  {errors.name && <p style={{ color: '#EF4444', fontSize: '0.8rem', marginTop: '0.4rem' }}>{errors.name.message}</p>}
                </div>

                {/* Message */}
                <div>
                  <label className="form-label" htmlFor="review-message">Ceritakan Pengalaman Anda</label>
                  <textarea
                    id="review-message"
                    className="form-input"
                    placeholder="Saya sangat puas dengan desainnya..."
                    rows={5}
                    style={{ resize: 'vertical' }}
                    {...register('message')}
                  />
                  {errors.message && <p style={{ color: '#EF4444', fontSize: '0.8rem', marginTop: '0.4rem' }}>{errors.message.message}</p>}
                </div>

                {/* Photo */}
                <div>
                  <label className="form-label">Foto Profil / Avatar (Opsional)</label>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
                    <div style={{
                      width: '70px', height: '70px', borderRadius: '50%',
                      background: 'var(--bg-elevated)', border: '2px dashed var(--border)',
                      overflow: 'hidden', position: 'relative',
                      display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                    }}>
                      {photoPreview ? (
                        <Image src={photoPreview} alt="Preview" fill style={{ objectFit: 'cover' }} />
                      ) : (
                        <span style={{ fontSize: '1.5rem', opacity: 0.5 }}>👤</span>
                      )}
                    </div>
                    <label
                      htmlFor="review-photo"
                      style={{
                        display: 'flex', alignItems: 'center', gap: '0.5rem',
                        padding: '0.6rem 1.25rem', background: 'var(--bg-elevated)',
                        border: '1px solid var(--border)', borderRadius: '12px',
                        cursor: 'pointer', fontSize: '0.9rem', color: 'var(--text-secondary)',
                        transition: 'all 0.2s',
                      }}
                    >
                      <Upload size={16} /> Pilih Foto
                    </label>
                    <input id="review-photo" type="file" accept="image/*" onChange={handlePhotoChange} style={{ display: 'none' }} />
                  </div>
                </div>

                {/* Submit */}
                <button
                  type="submit"
                  disabled={isSubmitting || uploading}
                  className="btn-primary"
                  style={{ padding: '1rem', fontSize: '1.05rem', marginTop: '1rem', display: 'flex', justifyContent: 'center', opacity: (isSubmitting || uploading) ? 0.7 : 1 }}
                >
                  {(isSubmitting || uploading) && <Loader2 size={18} style={{ animation: 'spin 0.7s linear infinite', marginRight: '0.5rem' }} />}
                  {uploading ? 'Mengunggah Foto...' : isSubmitting ? 'Mengirim...' : 'Kirim Ulasan'}
                </button>
              </form>
            </div>
          )}
        </div>
      </main>
      <Footer />
      <style>{`
        @keyframes fadeInUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes spin { to { transform: rotate(360deg); } }
      `}</style>
    </>
  )
}
