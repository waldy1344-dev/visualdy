'use client'

import { useState, useEffect } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { MessageCircle, ExternalLink, Trash2, Plus, Save, Loader2, Link2, Camera, Video } from 'lucide-react'
import { getSocialLinks, upsertSocialLink, deleteSocialLink } from '@/services/socialService'

const PLATFORMS = [
  { name: 'Instagram', icon: <Camera size={18} />, placeholder: 'https://instagram.com/username', color: '#E1306C' },
  { name: 'TikTok', icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1V9.01a6.27 6.27 0 00-.79-.05 6.34 6.34 0 00-6.34 6.34 6.34 6.34 0 006.34 6.34 6.34 6.34 0 006.33-6.34V9.19a8.19 8.19 0 004.79 1.54V7.28a4.85 4.85 0 01-1.02-.59z"/></svg>, placeholder: 'https://tiktok.com/@username', color: '#69C9D0' },
  { name: 'WhatsApp', icon: <MessageCircle size={18} />, placeholder: 'https://wa.me/6281234567890', color: '#25D366' },
  { name: 'YouTube', icon: <Video size={18} />, placeholder: 'https://youtube.com/@channel', color: '#FF0000' },
  { name: 'Lainnya', icon: <ExternalLink size={18} />, placeholder: 'https://...', color: '#7C3AED' },
]

export default function AdminSocialPage() {
  const qc = useQueryClient()
  const [formData, setFormData] = useState<Record<string, string>>({})
  const [toast, setToast] = useState<{ msg: string; type: 'success' | 'error' } | null>(null)
  const [saving, setSaving] = useState<string | null>(null)

  const { data: socialLinks = [], isLoading } = useQuery({
    queryKey: ['socialLinks'],
    queryFn: getSocialLinks,
  })

  useEffect(() => {
    const map: Record<string, string> = {}
    socialLinks.forEach(s => { map[s.platform] = s.url })
    setFormData(map)
  }, [socialLinks])

  const showToast = (msg: string, type: 'success' | 'error' = 'success') => {
    setToast({ msg, type })
    setTimeout(() => setToast(null), 3000)
  }

  const upsertMutation = useMutation({
    mutationFn: upsertSocialLink,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['socialLinks'] })
      setSaving(null)
      showToast('Link berhasil disimpan')
    },
    onError: () => {
      setSaving(null)
      showToast('Gagal menyimpan link', 'error')
    },
  })

  const deleteMutation = useMutation({
    mutationFn: (id: string) => deleteSocialLink(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['socialLinks'] })
      showToast('Link berhasil dihapus')
    },
    onError: () => showToast('Gagal menghapus link', 'error'),
  })

  const handleSave = async (platform: string) => {
    const url = formData[platform]?.trim()
    if (!url) return showToast('URL tidak boleh kosong', 'error')
    setSaving(platform)
    upsertMutation.mutate({ platform, url })
  }

  const handleDelete = (platform: string) => {
    const existing = socialLinks.find(s => s.platform === platform)
    if (existing) {
      deleteMutation.mutate(existing.id)
      setFormData(prev => { const d = { ...prev }; delete d[platform]; return d })
    }
  }

  return (
    <div style={{ maxWidth: '680px' }}>
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
      <div style={{ marginBottom: '2rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.4rem' }}>
          <div style={{
            width: '36px', height: '36px', background: 'var(--gradient-primary)',
            borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <Link2 size={18} color="white" />
          </div>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 800 }}>Sosial Media</h1>
        </div>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>
          Kelola link sosial media yang tampil di footer website kamu.
        </p>
      </div>

      {/* Platform cards */}
      {isLoading ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {[...Array(4)].map((_, i) => (
            <div key={i} style={{ height: '80px', background: 'var(--bg-card)', borderRadius: '14px', animation: 'pulse 1.5s infinite' }} />
          ))}
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {PLATFORMS.map(platform => {
            const existing = socialLinks.find(s => s.platform === platform.name)
            const hasValue = !!formData[platform.name]?.trim()
            const isSaving = saving === platform.name

            return (
              <div
                key={platform.name}
                style={{
                  background: 'var(--bg-card)',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: '14px',
                  padding: '1.25rem',
                  transition: 'border-color 0.2s ease',
                }}
              >
                {/* Platform header */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                    <div style={{
                      width: '32px', height: '32px',
                      background: `${platform.color}18`,
                      borderRadius: '8px',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      color: platform.color,
                    }}>
                      {platform.icon}
                    </div>
                    <span style={{ fontWeight: 700, fontSize: '0.95rem' }}>{platform.name}</span>
                    {existing && (
                      <span style={{
                        padding: '0.15rem 0.55rem',
                        background: 'rgba(16, 185, 129, 0.1)',
                        border: '1px solid rgba(16, 185, 129, 0.25)',
                        borderRadius: '100px',
                        fontSize: '0.7rem', fontWeight: 600, color: '#10B981',
                      }}>
                        Aktif
                      </span>
                    )}
                  </div>
                  {existing && (
                    <button
                      onClick={() => handleDelete(platform.name)}
                      style={{
                        padding: '0.35rem',
                        background: 'rgba(239, 68, 68, 0.1)',
                        border: '1px solid rgba(239, 68, 68, 0.2)',
                        borderRadius: '7px', color: '#EF4444', cursor: 'pointer',
                      }}
                      title="Hapus link"
                    >
                      <Trash2 size={13} />
                    </button>
                  )}
                </div>

                {/* Input row */}
                <div style={{ display: 'flex', gap: '0.6rem' }}>
                  <input
                    id={`social-${platform.name.toLowerCase()}`}
                    className="form-input"
                    type="url"
                    placeholder={platform.placeholder}
                    value={formData[platform.name] || ''}
                    onChange={e => setFormData(prev => ({ ...prev, [platform.name]: e.target.value }))}
                    style={{ flex: 1 }}
                  />
                  <button
                    onClick={() => handleSave(platform.name)}
                    disabled={isSaving || !hasValue}
                    style={{
                      padding: '0.7rem 1rem',
                      background: hasValue ? `${platform.color}CC` : 'var(--bg-elevated)',
                      border: 'none',
                      borderRadius: '10px',
                      color: hasValue ? 'white' : 'var(--text-muted)',
                      cursor: hasValue ? 'pointer' : 'not-allowed',
                      fontFamily: 'inherit',
                      fontSize: '0.8rem',
                      fontWeight: 600,
                      display: 'flex', alignItems: 'center', gap: '0.4rem',
                      transition: 'all 0.2s ease',
                      whiteSpace: 'nowrap',
                      flexShrink: 0,
                    }}
                  >
                    {isSaving ? (
                      <Loader2 size={14} style={{ animation: 'spin 0.7s linear infinite' }} />
                    ) : existing ? (
                      <Save size={14} />
                    ) : (
                      <Plus size={14} />
                    )}
                    {existing ? 'Update' : 'Simpan'}
                  </button>
                </div>

                {/* Preview link */}
                {existing && (
                  <a
                    href={existing.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      display: 'inline-flex', alignItems: 'center', gap: '0.3rem',
                      marginTop: '0.5rem',
                      color: platform.color, fontSize: '0.75rem',
                      textDecoration: 'none', opacity: 0.8,
                    }}
                  >
                    <ExternalLink size={11} />
                    {existing.url.length > 50 ? existing.url.slice(0, 50) + '...' : existing.url}
                  </a>
                )}
              </div>
            )
          })}
        </div>
      )}

      <div style={{
        marginTop: '1.5rem',
        padding: '1rem 1.25rem',
        background: 'rgba(124, 58, 237, 0.06)',
        border: '1px solid rgba(124, 58, 237, 0.15)',
        borderRadius: '12px',
        fontSize: '0.82rem',
        color: 'var(--text-secondary)',
      }}>
        💡 Link yang disimpan akan otomatis tampil di footer website publik Visualdy.
      </div>

      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.4; } }
      `}</style>
    </div>
  )
}
