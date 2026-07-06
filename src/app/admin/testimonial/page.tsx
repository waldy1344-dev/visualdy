'use client'

import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import Image from 'next/image'
import { Plus, Pencil, Trash2, X, Star, Upload, Loader2, MessageSquare } from 'lucide-react'
import {
  getTestimonials, addTestimonial, updateTestimonial,
  deleteTestimonial, uploadTestimonialPhoto
} from '@/services/testimonialService'
import { Testimonial } from '@/types/testimonial'

const schema = z.object({
  name: z.string().min(2, 'Nama minimal 2 karakter'),
  message: z.string().min(5, 'Pesan minimal 5 karakter'),
  rating: z.number().min(1).max(5),
  photo_url: z.string().optional(),
  admin_reply: z.string().optional(),
})

type FormData = z.infer<typeof schema>

export default function AdminTestimonialPage() {
  const qc = useQueryClient()
  const [modal, setModal] = useState<{ open: boolean; item?: Testimonial }>({ open: false })
  const [photoFile, setPhotoFile] = useState<File | null>(null)
  const [photoPreview, setPhotoPreview] = useState<string>('')
  const [uploading, setUploading] = useState(false)
  const [isDraggingPhoto, setIsDraggingPhoto] = useState(false)
  const [hoverRating, setHoverRating] = useState(0)
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null)
  const [toast, setToast] = useState<{ msg: string; type: 'success' | 'error' } | null>(null)
  const [filterRating, setFilterRating] = useState<number>(0)

  const { data: testimonials = [], isLoading } = useQuery({ queryKey: ['testimonials'], queryFn: getTestimonials })

  const filteredTestimonials = filterRating === 0 ? testimonials : testimonials.filter(t => t.rating === filterRating)

  const showToast = (msg: string, type: 'success' | 'error' = 'success') => {
    setToast({ msg, type })
    setTimeout(() => setToast(null), 3000)
  }

  const { register, handleSubmit, reset, watch, setValue, formState: { errors, isSubmitting } } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { rating: 5 },
  })

  const currentRating = watch('rating')

  const openAdd = () => {
    reset({ name: '', message: '', rating: 5, photo_url: '' })
    setPhotoFile(null)
    setPhotoPreview('')
    setIsDraggingPhoto(false)
    setModal({ open: true })
  }

  const openEdit = (item: Testimonial) => {
    reset({ name: item.name, message: item.message, rating: item.rating, photo_url: item.photo_url || '', admin_reply: item.admin_reply || '' })
    setPhotoPreview(item.photo_url || '')
    setPhotoFile(null)
    setIsDraggingPhoto(false)
    setModal({ open: true, item })
  }

  const closeModal = () => {
    setModal({ open: false })
    setPhotoFile(null)
    setPhotoPreview('')
    setIsDraggingPhoto(false)
  }

  const deleteMutation = useMutation({
    mutationFn: deleteTestimonial,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['testimonials'] })
      setDeleteConfirm(null)
      showToast('Testimoni berhasil dihapus')
    },
    onError: () => showToast('Gagal menghapus testimoni', 'error'),
  })

  const handlePhotoSelection = (file: File | null | undefined) => {
    if (!file) return

    if (!file.type.startsWith('image/')) {
      showToast('Silakan pilih file gambar yang valid.', 'error')
      return
    }

    setPhotoFile(file)
    setPhotoPreview(URL.createObjectURL(file))
  }

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    handlePhotoSelection(e.target.files?.[0])
    e.target.value = ''
  }

  const handlePhotoDrop = (e: React.DragEvent<HTMLLabelElement>) => {
    e.preventDefault()
    setIsDraggingPhoto(false)
    handlePhotoSelection(e.dataTransfer.files?.[0])
  }

  const handlePhotoDragOver = (e: React.DragEvent<HTMLLabelElement>) => {
    e.preventDefault()
    setIsDraggingPhoto(true)
  }

  const handlePhotoDragLeave = (e: React.DragEvent<HTMLLabelElement>) => {
    e.preventDefault()
    setIsDraggingPhoto(false)
  }

  const onSubmit = async (data: FormData) => {
    try {
      let photoUrl = data.photo_url || ''

      if (photoFile) {
        setUploading(true)
        photoUrl = await uploadTestimonialPhoto(photoFile)
        setUploading(false)
      }

      const payload = { ...data, photo_url: photoUrl || undefined, admin_reply: data.admin_reply?.trim() || undefined }

      if (modal.item) {
        await updateTestimonial(modal.item.id, payload)
        showToast('Testimoni berhasil diperbarui')
      } else {
        await addTestimonial(payload)
        showToast('Testimoni berhasil ditambahkan')
      }

      qc.invalidateQueries({ queryKey: ['testimonials'] })
      closeModal()
    } catch {
      setUploading(false)
      showToast('Terjadi kesalahan. Coba lagi.', 'error')
    }
  }

  return (
    <div style={{ maxWidth: '900px' }}>
      {/* Toast */}
      {toast && (
        <div style={{
          position: 'fixed', top: '1.5rem', right: '1.5rem', zIndex: 200,
          padding: '0.75rem 1.25rem',
          background: toast.type === 'success' ? 'rgba(16, 185, 129, 0.15)' : 'rgba(239, 68, 68, 0.15)',
          border: `1px solid ${toast.type === 'success' ? 'rgba(16, 185, 129, 0.4)' : 'rgba(239, 68, 68, 0.4)'}`,
          color: toast.type === 'success' ? '#10B981' : '#EF4444',
          borderRadius: '12px', fontSize: '0.9rem', fontWeight: 600,
          boxShadow: 'var(--shadow-lg)',
        }}>
          {toast.msg}
        </div>
      )}

      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: '0.25rem' }}>Testimoni</h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>{testimonials.length} ulasan tersimpan</p>
        </div>
        <button id="add-testimonial-btn" onClick={openAdd} className="btn-primary" style={{ fontSize: '0.875rem' }}>
          <Plus size={16} />
          Tambah Testimoni
        </button>
      </div>

      {/* Filter Rating */}
      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '2rem', overflowX: 'auto', paddingBottom: '0.5rem', scrollbarWidth: 'none' }}>
        <button
          onClick={() => setFilterRating(0)}
          style={{
            padding: '0.4rem 1rem',
            background: filterRating === 0 ? 'rgba(245, 158, 11, 0.15)' : 'var(--bg-elevated)',
            border: `1px solid ${filterRating === 0 ? 'rgba(245, 158, 11, 0.4)' : 'var(--border)'}`,
            borderRadius: '100px',
            color: filterRating === 0 ? '#F59E0B' : 'var(--text-muted)',
            fontSize: '0.8rem', fontWeight: filterRating === 0 ? 700 : 500,
            cursor: 'pointer', whiteSpace: 'nowrap', transition: 'all 0.2s',
          }}
        >
          Semua Rating
        </button>
        {[5, 4, 3, 2, 1].map(r => (
          <button
            key={r}
            onClick={() => setFilterRating(r)}
            style={{
              padding: '0.4rem 1rem',
              display: 'flex', alignItems: 'center', gap: '0.3rem',
              background: filterRating === r ? 'rgba(245, 158, 11, 0.15)' : 'var(--bg-elevated)',
              border: `1px solid ${filterRating === r ? 'rgba(245, 158, 11, 0.4)' : 'var(--border)'}`,
              borderRadius: '100px',
              color: filterRating === r ? '#F59E0B' : 'var(--text-muted)',
              fontSize: '0.8rem', fontWeight: filterRating === r ? 700 : 500,
              cursor: 'pointer', whiteSpace: 'nowrap', transition: 'all 0.2s',
            }}
          >
            <Star size={13} fill={filterRating === r ? '#F59E0B' : 'none'} color={filterRating === r ? '#F59E0B' : 'var(--text-muted)'} /> {r} Bintang
          </button>
        ))}
      </div>

      {/* Cards grid */}
      {isLoading ? (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '1.25rem' }}>
          {[...Array(4)].map((_, i) => (
            <div key={i} style={{ height: '180px', background: 'var(--bg-card)', borderRadius: '16px', animation: 'pulse 1.5s infinite' }} />
          ))}
        </div>
      ) : filteredTestimonials.length === 0 ? (
        <div style={{
          padding: '5rem', textAlign: 'center', color: 'var(--text-muted)',
          background: 'var(--bg-card)', border: '1px solid var(--border-subtle)', borderRadius: '16px',
        }}>
          <MessageSquare size={40} style={{ opacity: 0.3, margin: '0 auto 1rem' }} />
          <p style={{ marginBottom: '1rem' }}>{testimonials.length === 0 ? 'Belum ada testimoni' : 'Tidak ada testimoni dengan rating ini'}</p>
          {testimonials.length === 0 && (
            <button onClick={openAdd} className="btn-primary" style={{ fontSize: '0.875rem' }}>
              <Plus size={15} /> Tambah Sekarang
            </button>
          )}
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1.25rem' }}>
          {filteredTestimonials.map(t => (
            <div key={t.id} style={{
              background: 'var(--bg-card)',
              border: '1px solid var(--border-subtle)',
              borderRadius: '16px',
              padding: '1.25rem',
              position: 'relative',
            }}>
              {/* Actions */}
              <div style={{ position: 'absolute', top: '1rem', right: '1rem', display: 'flex', gap: '0.4rem' }}>
                <button
                  onClick={() => openEdit(t)}
                  style={{
                    padding: '0.35rem',
                    background: 'rgba(124, 58, 237, 0.1)',
                    border: '1px solid rgba(124, 58, 237, 0.2)',
                    borderRadius: '7px',
                    color: 'var(--primary-light)',
                    cursor: 'pointer',
                  }}
                >
                  <Pencil size={13} />
                </button>
                <button
                  onClick={() => setDeleteConfirm(t.id)}
                  style={{
                    padding: '0.35rem',
                    background: 'rgba(239, 68, 68, 0.1)',
                    border: '1px solid rgba(239, 68, 68, 0.2)',
                    borderRadius: '7px',
                    color: '#EF4444',
                    cursor: 'pointer',
                  }}
                >
                  <Trash2 size={13} />
                </button>
              </div>

              {/* Stars */}
              <div style={{ display: 'flex', gap: '2px', marginBottom: '0.6rem' }}>
                {[1,2,3,4,5].map(s => (
                  <Star key={s} size={13}
                    fill={s <= t.rating ? '#F59E0B' : 'none'}
                    color={s <= t.rating ? '#F59E0B' : 'var(--text-muted)'}
                  />
                ))}
              </div>

              <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginBottom: '1rem', lineHeight: 1.6, fontStyle: 'italic' }}>
                &ldquo;{t.message}&rdquo;
              </p>

              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                <div style={{
                  width: '34px', height: '34px',
                  borderRadius: '50%',
                  overflow: 'hidden',
                  background: 'var(--gradient-primary)',
                  position: 'relative',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  flexShrink: 0,
                }}>
                  {t.photo_url ? (
                    <Image src={t.photo_url} alt={t.name} fill style={{ objectFit: 'cover' }} />
                  ) : (
                    <span style={{ color: 'white', fontWeight: 700, fontSize: '0.9rem' }}>
                      {t.name.charAt(0).toUpperCase()}
                    </span>
                  )}
                </div>
                <span style={{ fontWeight: 700, fontSize: '0.875rem' }}>{t.name}</span>
              </div>
              
              {t.admin_reply && (
                <div style={{ marginTop: '1rem', padding: '0.8rem', background: 'rgba(124,58,237,0.1)', borderRadius: '12px', border: '1px solid rgba(124,58,237,0.2)' }}>
                  <p style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--primary-light)', marginBottom: '0.3rem', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                    <MessageSquare size={12} /> Tanggapan Admin:
                  </p>
                  <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>{t.admin_reply}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Delete confirm */}
      {deleteConfirm && (
        <div style={{
          position: 'fixed', inset: 0, zIndex: 100,
          background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(6px)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem',
        }}>
          <div className="glass" style={{ borderRadius: '16px', padding: '2rem', maxWidth: '360px', width: '100%', textAlign: 'center' }}>
            <div style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>🗑️</div>
            <h3 style={{ fontWeight: 700, marginBottom: '0.5rem' }}>Hapus Testimoni?</h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', marginBottom: '1.5rem' }}>Tindakan ini tidak bisa dibatalkan.</p>
            <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center' }}>
              <button onClick={() => setDeleteConfirm(null)} className="btn-secondary" style={{ fontSize: '0.875rem', padding: '0.6rem 1.25rem' }}>Batal</button>
              <button
                onClick={() => deleteMutation.mutate(deleteConfirm)}
                style={{
                  padding: '0.6rem 1.25rem',
                  background: '#EF4444', color: 'white',
                  border: 'none', borderRadius: '10px',
                  fontSize: '0.875rem', fontWeight: 600,
                  cursor: 'pointer', fontFamily: 'inherit',
                }}
              >
                Ya, Hapus
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add/Edit Modal */}
      {modal.open && (
        <div style={{
          position: 'fixed', inset: 0, zIndex: 100,
          background: 'rgba(0,0,0,0.75)', backdropFilter: 'blur(6px)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          padding: '1rem', overflowY: 'auto',
        }}>
          <div className="glass" style={{ borderRadius: '20px', padding: '2rem', maxWidth: '480px', width: '100%', position: 'relative' }}>
            <button
              onClick={closeModal}
              style={{
                position: 'absolute', top: '1.25rem', right: '1.25rem',
                background: 'var(--bg-elevated)', border: '1px solid var(--border-subtle)',
                borderRadius: '8px', color: 'var(--text-muted)', cursor: 'pointer', padding: '0.35rem',
              }}
            >
              <X size={16} />
            </button>

            <h2 style={{ fontWeight: 800, fontSize: '1.25rem', marginBottom: '1.5rem' }}>
              {modal.item ? '✏️ Edit Testimoni' : '➕ Tambah Testimoni'}
            </h2>

            <form onSubmit={handleSubmit(onSubmit)} style={{ display: 'flex', flexDirection: 'column', gap: '1.1rem' }}>
              {/* Photo upload */}
              <div>
                <label className="form-label">Foto Klien (Opsional)</label>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  <div style={{
                    width: '60px', height: '60px', borderRadius: '50%',
                    background: 'var(--bg-elevated)',
                    border: '2px solid var(--border)',
                    overflow: 'hidden', position: 'relative',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                  }}>
                    {photoPreview ? (
                      <Image src={photoPreview} alt="Preview" fill style={{ objectFit: 'cover' }} />
                    ) : (
                      <span style={{ fontSize: '1.5rem', color: 'var(--text-muted)' }}>👤</span>
                    )}
                  </div>
                  <label
                    htmlFor="testimonial-photo-upload"
                    onDragOver={handlePhotoDragOver}
                    onDragEnter={handlePhotoDragOver}
                    onDragLeave={handlePhotoDragLeave}
                    onDrop={handlePhotoDrop}
                    style={{
                      display: 'flex', alignItems: 'center', gap: '0.4rem',
                      padding: '0.5rem 1rem',
                      border: `1px dashed ${isDraggingPhoto ? 'rgba(124,58,237,0.8)' : 'var(--border)'}`,
                      borderRadius: '8px',
                      cursor: 'pointer',
                      fontSize: '0.8rem', color: 'var(--text-secondary)',
                      transition: 'border-color 0.2s',
                    }}
                  >
                    <Upload size={14} />
                    {isDraggingPhoto ? 'Lepaskan foto di sini' : 'Seret & lepas foto atau klik untuk pilih'}
                  </label>
                  <input id="testimonial-photo-upload" type="file" accept="image/*" onChange={handlePhotoChange} style={{ display: 'none' }} />
                </div>
              </div>

              <div>
                <label className="form-label" htmlFor="testimonial-name">Nama Klien</label>
                <input id="testimonial-name" className="form-input" placeholder="Nama klien..." {...register('name')} />
                {errors.name && <p style={{ color: '#EF4444', fontSize: '0.78rem', marginTop: '0.3rem' }}>{errors.name.message}</p>}
              </div>

              <div>
                <label className="form-label" htmlFor="testimonial-message">Pesan / Ulasan</label>
                <textarea
                  id="testimonial-message"
                  className="form-input"
                  placeholder="Tulis ulasan klien..."
                  rows={4}
                  style={{ resize: 'vertical' }}
                  {...register('message')}
                />
                {errors.message && <p style={{ color: '#EF4444', fontSize: '0.78rem', marginTop: '0.3rem' }}>{errors.message.message}</p>}
              </div>

              {/* Admin Reply */}
              <div>
                <label className="form-label" htmlFor="testimonial-admin-reply">Tanggapan Admin (Opsional)</label>
                <textarea
                  id="testimonial-admin-reply"
                  className="form-input"
                  placeholder="Balasan dari Visualdy..."
                  rows={3}
                  style={{ resize: 'vertical', borderColor: 'rgba(124,58,237,0.4)', background: 'rgba(124,58,237,0.05)' }}
                  {...register('admin_reply')}
                />
              </div>

              {/* Star rating selector */}
              <div>
                <label className="form-label">Rating</label>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  {[1, 2, 3, 4, 5].map(s => (
                    <button
                      key={s}
                      type="button"
                      onClick={() => setValue('rating', s)}
                      onMouseEnter={() => setHoverRating(s)}
                      onMouseLeave={() => setHoverRating(0)}
                      style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '0.1rem', transition: 'transform 0.1s ease' }}
                    >
                      <Star
                        size={26}
                        fill={(hoverRating || currentRating) >= s ? '#F59E0B' : 'none'}
                        color={(hoverRating || currentRating) >= s ? '#F59E0B' : 'var(--text-muted)'}
                        style={{ transition: 'all 0.15s ease' }}
                      />
                    </button>
                  ))}
                </div>
                <input type="hidden" {...register('rating')} />
              </div>

              <div style={{ display: 'flex', gap: '0.75rem', marginTop: '0.5rem' }}>
                <button type="button" onClick={closeModal} className="btn-secondary" style={{ flex: 1, justifyContent: 'center', fontSize: '0.875rem' }}>Batal</button>
                <button
                  type="submit"
                  disabled={isSubmitting || uploading}
                  className="btn-primary"
                  style={{ flex: 1, justifyContent: 'center', fontSize: '0.875rem', opacity: (isSubmitting || uploading) ? 0.7 : 1 }}
                >
                  {(isSubmitting || uploading) && <Loader2 size={15} style={{ animation: 'spin 0.7s linear infinite' }} />}
                  {uploading ? 'Uploading...' : isSubmitting ? 'Menyimpan...' : 'Simpan'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.4; } }
      `}</style>
    </div>
  )
}
