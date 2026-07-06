'use client'

import { useEffect, useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import Image from 'next/image'
import {
  Plus, Pencil, Trash2, X, Upload, Loader2, Save,
  Image as ImageIcon, Film, Video, LayoutGrid,
} from 'lucide-react'
import {
  getPortfolios, addPortfolio, updatePortfolio,
  deletePortfolio, uploadPortfolioImage, uploadPortfolioVideo,
  DUMMY_PORTFOLIOS,
} from '@/services/portfolioService'
import { Portfolio } from '@/types/portfolio'

const CATEGORIES = ['Logo', 'Poster', 'Banner']

const categoryColors: Record<string, string> = {
  'Logo': '#7C3AED',
  'Poster': '#3B82F6',
  'Banner': '#F59E0B',
}

type PortfolioDraft = {
  id: string
  title: string
  description: string
  category: string
  media_type: 'image' | 'video'
  image_url: string
  video_url: string
  created_at: string
}

const DRAFT_STORAGE_KEY = 'visualdy-portfolio-drafts'

const schema = z.object({
  title: z.string().min(2, 'Judul minimal 2 karakter'),
  description: z.string().optional(),
  category: z.string().min(1, 'Pilih kategori'),
  media_type: z.enum(['image', 'video']),
  image_url: z.string().optional(),
  video_url: z.string().optional(),
})

type FormData = z.infer<typeof schema>

export default function AdminPortfolioPage() {
  const qc = useQueryClient()
  const [modal, setModal] = useState<{ open: boolean; item?: Portfolio }>({ open: false })
  const [mediaFile, setMediaFile] = useState<File | null>(null)
  const [mediaPreview, setMediaPreview] = useState<string>('')
  const [uploading, setUploading] = useState(false)
  const [isDraggingMedia, setIsDraggingMedia] = useState(false)
  const [drafts, setDrafts] = useState<PortfolioDraft[]>([])
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null)
  const [toast, setToast] = useState<{ msg: string; type: 'success' | 'error' } | null>(null)
  const [filterCat, setFilterCat] = useState('Semua')

  const { data: portfolios = [], isLoading } = useQuery({
    queryKey: ['portfolios'],
    queryFn: getPortfolios,
  })

  useEffect(() => {
    if (typeof window === 'undefined') return
    try {
      const raw = window.localStorage.getItem(DRAFT_STORAGE_KEY)
      if (raw) {
        const parsed = JSON.parse(raw) as PortfolioDraft[]
        setDrafts(parsed)
      }
    } catch {
      setDrafts([])
    }
  }, [])

  // Pisahkan dummy vs real
  const realPortfolios = portfolios.filter(p => !p.id.startsWith('dummy-'))
  const isDummyMode = realPortfolios.length === 0

  const showToast = (msg: string, type: 'success' | 'error' = 'success') => {
    setToast({ msg, type })
    setTimeout(() => setToast(null), 3500)
  }

  const {
    register, handleSubmit, reset, setValue, watch,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { media_type: 'image' },
  })

  const mediaType = watch('media_type')
  const selectedCategory = watch('category')

  const openAdd = () => {
    reset({ title: '', description: '', category: '', media_type: 'image', image_url: '', video_url: '' })
    setMediaFile(null)
    setMediaPreview('')
    setIsDraggingMedia(false)
    setModal({ open: true })
  }

  const openEdit = (item: Portfolio) => {
    const isVideo = item.media_type === 'video' || !!item.video_url
    reset({
      title: item.title,
      description: item.description,
      category: item.category,
      media_type: isVideo ? 'video' : 'image',
      image_url: item.image_url,
      video_url: item.video_url || '',
    })
    setMediaPreview(isVideo ? (item.video_url || item.image_url || '') : (item.image_url || ''))
    setMediaFile(null)
    setIsDraggingMedia(false)
    setModal({ open: true, item })
  }

  const closeModal = () => {
    setModal({ open: false })
    setMediaFile(null)
    setMediaPreview('')
    setIsDraggingMedia(false)
  }

  const deleteMutation = useMutation({
    mutationFn: deletePortfolio,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['portfolios'] })
      setDeleteConfirm(null)
      showToast('Portfolio berhasil dihapus')
    },
    onError: () => showToast('Gagal menghapus portfolio', 'error'),
  })

  const handleMediaFileSelection = (file: File | null | undefined) => {
    if (!file) return

    const isVideo = mediaType === 'video'
    const isValid = isVideo
      ? file.type.startsWith('video/')
      : file.type.startsWith('image/')

    if (!isValid) {
      showToast(isVideo ? 'Silakan pilih file video yang valid.' : 'Silakan pilih file gambar yang valid.', 'error')
      return
    }

    setMediaFile(file)
    setMediaPreview(URL.createObjectURL(file))
  }

  const persistDrafts = (nextDrafts: PortfolioDraft[]) => {
    setDrafts(nextDrafts)
    if (typeof window !== 'undefined') {
      window.localStorage.setItem(DRAFT_STORAGE_KEY, JSON.stringify(nextDrafts))
    }
  }

  const handleSaveDraft = () => {
    const draftData = {
      id: `${Date.now()}`,
      title: watch('title')?.trim() || 'Draft tanpa judul',
      description: watch('description')?.trim() || '',
      category: watch('category')?.trim() || 'Logo',
      media_type: watch('media_type') || 'image',
      image_url: watch('image_url') || '',
      video_url: watch('video_url') || '',
      created_at: new Date().toISOString(),
    } satisfies PortfolioDraft

    const otherDrafts = drafts.filter(item => item.category !== draftData.category)
    const nextDrafts = [draftData, ...otherDrafts].slice(0, 8)
    persistDrafts(nextDrafts)
    showToast(`Draft ${draftData.category} berhasil disimpan`)
  }

  const handleLoadDraft = (draft: PortfolioDraft) => {
    reset({
      title: draft.title,
      description: draft.description,
      category: draft.category,
      media_type: draft.media_type,
      image_url: draft.image_url,
      video_url: draft.video_url,
    })
    setMediaFile(null)
    setMediaPreview(draft.media_type === 'video' ? (draft.video_url || draft.image_url || '') : (draft.image_url || ''))
    setIsDraggingMedia(false)
    setModal({ open: true })
  }

  const handleDeleteDraft = (draftId: string) => {
    const nextDrafts = drafts.filter(item => item.id !== draftId)
    persistDrafts(nextDrafts)
    showToast('Draft berhasil dihapus')
  }

  const handleMediaChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    handleMediaFileSelection(e.target.files?.[0])
    e.target.value = ''
  }

  const handleMediaDrop = (e: React.DragEvent<HTMLLabelElement>) => {
    e.preventDefault()
    setIsDraggingMedia(false)
    handleMediaFileSelection(e.dataTransfer.files?.[0])
  }

  const handleMediaDragOver = (e: React.DragEvent<HTMLLabelElement>) => {
    e.preventDefault()
    setIsDraggingMedia(true)
  }

  const handleMediaDragLeave = (e: React.DragEvent<HTMLLabelElement>) => {
    e.preventDefault()
    setIsDraggingMedia(false)
  }

  const onSubmit = async (data: FormData) => {
    try {
      let imageUrl = (data.image_url || '').trim()
      let videoUrl = (data.video_url || '').trim()

      if (mediaFile) {
        setUploading(true)
        if (data.media_type === 'video') {
          videoUrl = await uploadPortfolioVideo(mediaFile)
        } else {
          imageUrl = await uploadPortfolioImage(mediaFile)
        }
        setUploading(false)
      }

      const payload = {
        title: data.title.trim(),
        description: data.description?.trim() || null,
        category: data.category.trim() || 'Logo',
        media_type: data.media_type || 'image',
        image_url: imageUrl || null,
        video_url: data.media_type === 'video' ? (videoUrl || null) : null,
      }

      if (modal.item && !modal.item.id.startsWith('dummy-')) {
        await updatePortfolio(modal.item.id, payload)
        showToast('Portfolio berhasil diperbarui ✅')
      } else {
        await addPortfolio(payload as Parameters<typeof addPortfolio>[0])
        showToast('Portfolio berhasil ditambahkan ke Supabase ✅')
      }

      qc.invalidateQueries({ queryKey: ['portfolios'] })
      closeModal()
    } catch (err: unknown) {
      setUploading(false)
      const message = err instanceof Error ? err.message : 'Terjadi kesalahan. Coba lagi.'
      showToast(message, 'error')
    }
  }

  const allCats = ['Semua', ...CATEGORIES]
  const displayPortfolios = portfolios.filter(p =>
    filterCat === 'Semua' || p.category === filterCat
  )

  return (
    <div style={{ maxWidth: '1100px' }}>
      {/* Toast */}
      {toast && (
        <div style={{
          position: 'fixed', top: '1.5rem', right: '1.5rem', zIndex: 200,
          padding: '0.85rem 1.35rem',
          background: toast.type === 'success' ? 'rgba(16,185,129,0.12)' : 'rgba(239,68,68,0.12)',
          border: `1px solid ${toast.type === 'success' ? 'rgba(16,185,129,0.4)' : 'rgba(239,68,68,0.4)'}`,
          color: toast.type === 'success' ? '#10B981' : '#EF4444',
          borderRadius: '14px', fontSize: '0.9rem', fontWeight: 600,
          boxShadow: 'var(--shadow-lg)',
          animation: 'fadeInUp 0.3s ease',
          backdropFilter: 'blur(12px)',
        }}>
          {toast.msg}
        </div>
      )}

      {/* Header */}
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem',
      }}>
        <div>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: '0.25rem' }}>Portfolio</h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>
            {portfolios.length} karya tersimpan
            {isDummyMode && (
              <span style={{
                marginLeft: '0.5rem',
                padding: '0.1rem 0.5rem',
                background: 'rgba(245,158,11,0.15)',
                border: '1px solid rgba(245,158,11,0.3)',
                borderRadius: '100px',
                fontSize: '0.72rem',
                color: '#F59E0B',
                fontWeight: 600,
              }}>
                ⚡ Preview Mode (Dummy)
              </span>
            )}
          </p>
        </div>
        <button id="add-portfolio-btn" onClick={openAdd} className="btn-primary" style={{ fontSize: '0.875rem' }}>
          <Plus size={16} /> Tambah Portfolio
        </button>
      </div>

      {/* Draft Module */}
      <div style={{
        background: 'var(--bg-card)',
        border: '1px solid var(--border-subtle)',
        borderRadius: '16px',
        padding: '1rem 1.1rem',
        marginBottom: '1.25rem',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.8rem' }}>
          <div>
            <h3 style={{ fontSize: '0.95rem', fontWeight: 700, marginBottom: '0.2rem' }}>Draft Portofolio</h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.8rem' }}>Simpan ide karya per kategori dan lanjutkan nanti.</p>
          </div>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', background: 'var(--bg-elevated)', padding: '0.3rem 0.6rem', borderRadius: '999px' }}>
            {drafts.length} tersimpan
          </span>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '0.7rem' }}>
          {CATEGORIES.map(cat => {
            const draft = drafts.find(item => item.category === cat)
            return (
              <div key={cat} style={{ padding: '0.75rem', borderRadius: '12px', background: 'var(--bg-elevated)', border: '1px solid var(--border-subtle)' }}>
                <div style={{ fontSize: '0.8rem', fontWeight: 700, color: categoryColors[cat] || 'var(--primary)', marginBottom: '0.35rem' }}>{cat}</div>
                <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', minHeight: '2.2rem' }}>
                  {draft ? (draft.title || 'Draft tersimpan') : 'Belum ada draft'}
                </div>
                <div style={{ display: 'flex', gap: '0.4rem', marginTop: '0.6rem' }}>
                  <button type="button" onClick={() => draft && handleLoadDraft(draft)} disabled={!draft} style={{ flex: 1, padding: '0.4rem 0.6rem', borderRadius: '8px', border: '1px solid var(--border)', background: 'var(--bg-card)', color: 'var(--text-primary)', cursor: draft ? 'pointer' : 'not-allowed', opacity: draft ? 1 : 0.6, fontSize: '0.75rem' }}>
                    Buka
                  </button>
                  <button type="button" onClick={() => draft && handleDeleteDraft(draft.id)} disabled={!draft} style={{ padding: '0.4rem 0.6rem', borderRadius: '8px', border: '1px solid rgba(239,68,68,0.25)', background: 'rgba(239,68,68,0.08)', color: '#EF4444', cursor: draft ? 'pointer' : 'not-allowed', opacity: draft ? 1 : 0.6, fontSize: '0.75rem' }}>
                    Hapus
                  </button>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Category Filter Tabs */}
      <div style={{
        display: 'flex', gap: '0.5rem', marginBottom: '1.5rem',
        overflowX: 'auto', paddingBottom: '0.25rem',
        scrollbarWidth: 'none',
      }}>
        {allCats.map(cat => {
          const isActive = filterCat === cat
          const color = categoryColors[cat] || 'var(--primary)'
          return (
            <button
              key={cat}
              onClick={() => setFilterCat(cat)}
              style={{
                padding: '0.4rem 1rem',
                background: isActive ? `${color}20` : 'var(--bg-elevated)',
                border: `1px solid ${isActive ? color + '50' : 'var(--border)'}`,
                borderRadius: '100px',
                color: isActive ? color : 'var(--text-muted)',
                fontSize: '0.8rem',
                fontWeight: isActive ? 700 : 500,
                cursor: 'pointer',
                whiteSpace: 'nowrap',
                transition: 'all 0.2s',
                fontFamily: 'inherit',
              }}
            >
              {cat}
              <span style={{
                marginLeft: '0.35rem',
                opacity: 0.75,
                fontSize: '0.72rem',
              }}>
                ({cat === 'Semua' ? portfolios.length : portfolios.filter(p => p.category === cat).length})
              </span>
            </button>
          )
        })}
      </div>

      {/* Table */}
      <div style={{
        background: 'var(--bg-card)',
        border: '1px solid var(--border-subtle)',
        borderRadius: '16px',
        overflow: 'hidden',
      }}>
        {isLoading ? (
          <div style={{ padding: '4rem', textAlign: 'center', color: 'var(--text-muted)' }}>
            <Loader2 size={28} style={{ animation: 'spin 0.7s linear infinite', marginBottom: '0.75rem' }} />
            <p>Memuat data...</p>
          </div>
        ) : displayPortfolios.length === 0 ? (
          <div style={{ padding: '4rem', textAlign: 'center', color: 'var(--text-muted)' }}>
            <ImageIcon size={40} style={{ opacity: 0.3, margin: '0 auto 1rem' }} />
            <p style={{ marginBottom: '1rem' }}>Belum ada portfolio di kategori ini</p>
            <button onClick={openAdd} className="btn-primary" style={{ fontSize: '0.875rem' }}>
              <Plus size={15} /> Tambah Sekarang
            </button>
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: '650px' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid var(--border-subtle)' }}>
                  {['Preview', 'Judul', 'Kategori', 'Tipe', 'Tanggal', 'Aksi'].map(h => (
                    <th key={h} style={{
                      padding: '0.875rem 1rem',
                      textAlign: 'left',
                      fontSize: '0.72rem',
                      fontWeight: 700,
                      color: 'var(--text-muted)',
                      textTransform: 'uppercase',
                      letterSpacing: '0.06em',
                    }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {displayPortfolios.map((p, i) => {
                  const isVideo = p.media_type === 'video' || !!p.video_url
                  const catColor = categoryColors[p.category] || 'var(--primary)'
                  const isDummy = p.id.startsWith('dummy-')
                  return (
                    <tr
                      key={p.id}
                      style={{
                        borderBottom: i < displayPortfolios.length - 1 ? '1px solid var(--border-subtle)' : 'none',
                        transition: 'background 0.15s ease',
                        opacity: isDummy ? 0.75 : 1,
                      }}
                      onMouseEnter={e => (e.currentTarget.style.background = 'rgba(124,58,237,0.04)')}
                      onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
                    >
                      {/* Preview */}
                      <td style={{ padding: '0.875rem 1rem' }}>
                        <div style={{
                          width: '60px', height: '44px',
                          borderRadius: '8px', overflow: 'hidden',
                          background: 'var(--bg-elevated)',
                          position: 'relative', flexShrink: 0,
                          border: '1px solid var(--border)',
                        }}>
                          {p.image_url ? (
                            <Image src={p.image_url} alt={p.title} fill style={{ objectFit: 'cover' }} />
                          ) : (
                            <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                              {isVideo ? <Film size={16} color="var(--text-muted)" /> : <ImageIcon size={16} color="var(--text-muted)" />}
                            </div>
                          )}
                          {isVideo && (
                            <div style={{
                              position: 'absolute', bottom: '2px', right: '2px',
                              background: 'rgba(239,68,68,0.85)',
                              borderRadius: '3px', padding: '1px 3px',
                              fontSize: '7px', fontWeight: 800, color: 'white',
                            }}>VJ</div>
                          )}
                        </div>
                      </td>

                      {/* Judul */}
                      <td style={{ padding: '0.875rem 1rem' }}>
                        <div style={{ fontWeight: 600, fontSize: '0.9rem' }}>{p.title}</div>
                        {isDummy && (
                          <span style={{ fontSize: '0.7rem', color: '#F59E0B', opacity: 0.8 }}>dummy</span>
                        )}
                      </td>

                      {/* Kategori */}
                      <td style={{ padding: '0.875rem 1rem' }}>
                        <span style={{
                          padding: '0.2rem 0.65rem',
                          background: `${catColor}18`,
                          border: `1px solid ${catColor}35`,
                          borderRadius: '100px',
                          fontSize: '0.73rem', fontWeight: 700,
                          color: catColor,
                        }}>
                          {p.category}
                        </span>
                      </td>

                      {/* Tipe */}
                      <td style={{ padding: '0.875rem 1rem' }}>
                        <div style={{
                          display: 'flex', alignItems: 'center', gap: '0.3rem',
                          fontSize: '0.78rem', color: 'var(--text-muted)',
                        }}>
                          {isVideo ? <><Film size={13} color="#EF4444" /><span style={{ color: '#EF4444' }}>Video</span></> : <><ImageIcon size={13} /><span>Gambar</span></>}
                        </div>
                      </td>

                      {/* Tanggal */}
                      <td style={{ padding: '0.875rem 1rem', fontSize: '0.8rem', color: 'var(--text-muted)', whiteSpace: 'nowrap' }}>
                        {new Date(p.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}
                      </td>

                      {/* Aksi */}
                      <td style={{ padding: '0.875rem 1rem' }}>
                        <div style={{ display: 'flex', gap: '0.4rem' }}>
                          <button
                            onClick={() => openEdit(p)}
                            title={isDummy ? 'Edit (akan disimpan sebagai baru)' : 'Edit'}
                            style={{
                              padding: '0.4rem', background: 'rgba(124,58,237,0.1)',
                              border: '1px solid rgba(124,58,237,0.2)', borderRadius: '8px',
                              color: 'var(--primary-light)', cursor: 'pointer',
                              transition: 'all 0.2s ease',
                            }}
                          >
                            <Pencil size={14} />
                          </button>
                          {!isDummy && (
                            <button
                              onClick={() => setDeleteConfirm(p.id)}
                              title="Hapus"
                              style={{
                                padding: '0.4rem', background: 'rgba(239,68,68,0.1)',
                                border: '1px solid rgba(239,68,68,0.2)', borderRadius: '8px',
                                color: '#EF4444', cursor: 'pointer',
                                transition: 'all 0.2s ease',
                              }}
                            >
                              <Trash2 size={14} />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* ── Delete Confirm Modal ── */}
      {deleteConfirm && (
        <div style={{
          position: 'fixed', inset: 0, zIndex: 100,
          background: 'rgba(0,0,0,0.75)', backdropFilter: 'blur(6px)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem',
        }}>
          <div className="glass" style={{ borderRadius: '20px', padding: '2rem', maxWidth: '380px', width: '100%', textAlign: 'center' }}>
            <div style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>🗑️</div>
            <h3 style={{ fontWeight: 700, marginBottom: '0.5rem' }}>Hapus Portfolio?</h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', marginBottom: '1.5rem' }}>
              Tindakan ini tidak bisa dibatalkan.
            </p>
            <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center' }}>
              <button onClick={() => setDeleteConfirm(null)} className="btn-secondary"
                style={{ fontSize: '0.875rem', padding: '0.6rem 1.25rem' }}>Batal</button>
              <button
                onClick={() => deleteMutation.mutate(deleteConfirm)}
                style={{
                  padding: '0.6rem 1.25rem', background: '#EF4444',
                  color: 'white', border: 'none', borderRadius: '10px',
                  fontSize: '0.875rem', fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit',
                }}
              >
                Ya, Hapus
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Add/Edit Modal ── */}
      {modal.open && (
        <div style={{
          position: 'fixed', inset: 0, zIndex: 100,
          background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(8px)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          padding: '1rem', overflowY: 'auto',
        }}>
          <div className="glass" style={{
            borderRadius: '22px', padding: '2rem',
            maxWidth: '560px', width: '100%',
            position: 'relative', margin: 'auto',
          }}>
            <button onClick={closeModal} style={{
              position: 'absolute', top: '1.25rem', right: '1.25rem',
              background: 'var(--bg-elevated)', border: '1px solid var(--border-subtle)',
              borderRadius: '8px', color: 'var(--text-muted)', cursor: 'pointer', padding: '0.35rem',
            }}>
              <X size={16} />
            </button>

            <h2 style={{ fontWeight: 800, fontSize: '1.25rem', marginBottom: '1.5rem' }}>
              {modal.item ? '✏️ Edit Portfolio' : '➕ Tambah Portfolio'}
            </h2>

            <form onSubmit={handleSubmit(onSubmit)} style={{ display: 'flex', flexDirection: 'column', gap: '1.1rem' }}>

              {/* ── Media Type Toggle ── */}
              <div>
                <label className="form-label">Jenis Media</label>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  {(['image', 'video'] as const).map(type => {
                    const isActive = mediaType === type
                    return (
                      <button
                        key={type}
                        type="button"
                        onClick={() => {
                          setValue('media_type', type)
                          setMediaFile(null)
                          setMediaPreview('')
                        }}
                        style={{
                          flex: 1,
                          display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem',
                          padding: '0.65rem',
                          background: isActive
                            ? (type === 'video' ? 'rgba(239,68,68,0.15)' : 'rgba(124,58,237,0.15)')
                            : 'var(--bg-elevated)',
                          border: `1.5px solid ${isActive
                            ? (type === 'video' ? 'rgba(239,68,68,0.5)' : 'rgba(124,58,237,0.5)')
                            : 'var(--border)'}`,
                          borderRadius: '10px',
                          color: isActive
                            ? (type === 'video' ? '#F87171' : '#A78BFA')
                            : 'var(--text-muted)',
                          fontWeight: isActive ? 700 : 500,
                          fontSize: '0.875rem',
                          cursor: 'pointer',
                          transition: 'all 0.2s',
                          fontFamily: 'inherit',
                        }}
                      >
                        {type === 'image' ? <ImageIcon size={15} /> : <Film size={15} />}
                        {type === 'image' ? 'Gambar' : 'Video'}
                      </button>
                    )
                  })}
                </div>
              </div>

              {/* ── Media Upload Area ── */}
              <div>
                <label className="form-label">
                  {mediaType === 'video' ? 'Upload Video (MP4, max 50MB)' : 'Upload Gambar'}
                </label>
                <label
                  htmlFor="portfolio-media-upload"
                  onDragOver={handleMediaDragOver}
                  onDragEnter={handleMediaDragOver}
                  onDragLeave={handleMediaDragLeave}
                  onDrop={handleMediaDrop}
                  style={{
                    display: 'flex', flexDirection: 'column',
                    alignItems: 'center', justifyContent: 'center', gap: '0.5rem',
                    height: mediaType === 'video' && mediaPreview ? '200px' : '150px',
                    border: `2px dashed ${isDraggingMedia
                      ? (mediaType === 'video' ? 'rgba(239,68,68,0.85)' : 'rgba(124,58,237,0.85)')
                      : (mediaType === 'video' ? 'rgba(239,68,68,0.4)' : 'var(--border)')}`,
                    borderRadius: '12px',
                    background: mediaType === 'video' ? 'rgba(239,68,68,0.04)' : 'var(--bg-elevated)',
                    cursor: 'pointer', position: 'relative', overflow: 'hidden',
                    transition: 'border-color 0.2s ease',
                  }}
                >
                  {mediaPreview ? (
                    mediaType === 'video' ? (
                      <video
                        src={mediaPreview}
                        controls
                        style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }}
                      />
                    ) : (
                      <Image src={mediaPreview} alt="Preview" fill style={{ objectFit: 'cover' }} />
                    )
                  ) : (
                    <>
                      {mediaType === 'video'
                        ? <Video size={28} color="rgba(239,68,68,0.6)" />
                        : <Upload size={24} color="var(--text-muted)" />
                      }
                      <span style={{ color: 'var(--text-muted)', fontSize: '0.875rem', textAlign: 'center' }}>
                        {mediaType === 'video'
                          ? 'Seret & lepas video di sini atau klik untuk memilih'
                          : 'Seret & lepas gambar di sini atau klik untuk memilih'
                        }
                      </span>
                      {mediaType === 'video' && (
                        <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', opacity: 0.6 }}>
                          Ukuran maksimum: 50MB
                        </span>
                      )}
                    </>
                  )}
                </label>
                <input
                  id="portfolio-media-upload"
                  type="file"
                  accept={mediaType === 'video' ? 'video/mp4,video/webm,video/*' : 'image/*'}
                  onChange={handleMediaChange}
                  style={{ display: 'none' }}
                />
              </div>

              {/* Judul */}
              <div>
                <label className="form-label" htmlFor="portfolio-title">Judul Proyek</label>
                <input id="portfolio-title" className="form-input" placeholder="Nama karya..." {...register('title')} />
                {errors.title && <p style={{ color: '#EF4444', fontSize: '0.78rem', marginTop: '0.3rem' }}>{errors.title.message}</p>}
              </div>

              {/* Deskripsi */}
              <div>
                <label className="form-label" htmlFor="portfolio-desc">Deskripsi</label>
                <textarea
                  id="portfolio-desc"
                  className="form-input"
                  placeholder="Deskripsi singkat..."
                  rows={2}
                  style={{ resize: 'vertical' }}
                  {...register('description')}
                />
              </div>

              {/* Kategori */}
              <div>
                <label className="form-label" htmlFor="portfolio-category">Kategori</label>
                <select id="portfolio-category" className="form-input" {...register('category')}>
                  <option value="">Pilih kategori...</option>
                  {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
                {errors.category && <p style={{ color: '#EF4444', fontSize: '0.78rem', marginTop: '0.3rem' }}>{errors.category.message}</p>}
              </div>

              {/* Buttons */}
              <div style={{ display: 'flex', gap: '0.75rem', marginTop: '0.5rem' }}>
                <button type="button" onClick={handleSaveDraft} className="btn-secondary"
                  style={{ flex: 1, justifyContent: 'center', fontSize: '0.875rem', gap: '0.35rem' }}>
                  <Save size={15} /> Draft
                </button>
                <button type="button" onClick={closeModal} className="btn-secondary"
                  style={{ flex: 1, justifyContent: 'center', fontSize: '0.875rem' }}>
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting || uploading}
                  className="btn-primary"
                  style={{ flex: 1, justifyContent: 'center', fontSize: '0.875rem', opacity: (isSubmitting || uploading) ? 0.7 : 1 }}
                >
                  {(isSubmitting || uploading) && (
                    <Loader2 size={15} style={{ animation: 'spin 0.7s linear infinite' }} />
                  )}
                  {uploading ? 'Uploading...' : isSubmitting ? 'Menyimpan...' : 'Simpan'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes fadeInUp { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: translateY(0); } }
      `}</style>
    </div>
  )
}
