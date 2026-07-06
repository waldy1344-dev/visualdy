'use client'

import { useState, useMemo } from 'react'
import { useQuery } from '@tanstack/react-query'
import { Layers, Search, Image as ImageIcon, LayoutGrid, X } from 'lucide-react'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import PortfolioCard from '@/components/PortfolioCard'
import { getPortfolios } from '@/services/portfolioService'
import { Portfolio } from '@/types/portfolio'
import Image from 'next/image'

const FIXED_CATEGORIES = ['Semua', 'Logo', 'Poster', 'Banner']

const categoryIcons: Record<string, React.ReactNode> = {
  'Semua':         <LayoutGrid size={15} />,
  'Logo':          <span style={{ fontSize: '13px' }}>✦</span>,
  'Poster':        <ImageIcon size={15} />,
  'Banner':        <span style={{ fontSize: '13px' }}>◈</span>,
}

const categoryAccents: Record<string, string> = {
  'Semua':         'var(--primary)',
  'Logo':          '#7C3AED',
  'Poster':        '#3B82F6',
  'Banner':        '#F59E0B',
}

export default function PortfolioPage() {
  const [activeCategory, setActiveCategory] = useState('Semua')
  const [search, setSearch] = useState('')
  const [selectedPortfolio, setSelectedPortfolio] = useState<Portfolio | null>(null)

  const { data: portfolios = [], isLoading } = useQuery({
    queryKey: ['portfolios'],
    queryFn: getPortfolios,
  })

  const filtered = useMemo(() => {
    return portfolios.filter(p => {
      const matchCat = activeCategory === 'Semua' || p.category === activeCategory
      const matchSearch = p.title.toLowerCase().includes(search.toLowerCase()) ||
        p.description?.toLowerCase().includes(search.toLowerCase())
      return matchCat && matchSearch
    })
  }, [portfolios, activeCategory, search])

  const counts = useMemo(() => {
    const c: Record<string, number> = { 'Semua': portfolios.length }
    FIXED_CATEGORIES.slice(1).forEach(cat => {
      c[cat] = portfolios.filter(p => p.category === cat).length
    })
    return c
  }, [portfolios])

  return (
    <>
      <Navbar />
      <main style={{ minHeight: '100vh', background: 'var(--bg-base)', paddingTop: '72px' }}>

        {/* ── Hero Section ── */}
        <section style={{
          padding: '5rem 0 4rem',
          background: 'var(--gradient-hero)',
          textAlign: 'center',
          position: 'relative',
          overflow: 'hidden',
        }}>
          <div className="orb orb-primary" style={{ width: '500px', height: '500px', top: '-200px', right: '-100px', opacity: 0.6 }} />
          <div className="orb" style={{
            width: '300px', height: '300px',
            bottom: '-150px', left: '-50px',
            background: 'radial-gradient(circle, rgba(59,130,246,0.3) 0%, transparent 70%)',
            position: 'absolute',
          }} />

          <div className="container" style={{ position: 'relative', zIndex: 1 }}>
            <div className="badge" style={{ marginBottom: '1.25rem' }}>
              <Layers size={12} />
              Portfolio
            </div>
            <h1 className="section-title" style={{ marginBottom: '1rem' }}>
              Semua Karya Kami
            </h1>
            <p className="section-subtitle" style={{ maxWidth: '520px', margin: '0 auto 2rem' }}>
              Jelajahi koleksi desain terbaik — Logo, Poster, dan Banner yang memukau.
            </p>

            {/* Search bar di hero */}
            <div style={{ position: 'relative', width: '100%', maxWidth: '440px', margin: '0 auto' }}>
              <Search size={16} style={{
                position: 'absolute', left: '1rem', top: '50%',
                transform: 'translateY(-50%)',
                color: 'var(--text-muted)',
                pointerEvents: 'none',
                zIndex: 1,
              }} />
              <input
                id="portfolio-search"
                type="text"
                placeholder="Cari portfolio..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                style={{
                  width: '100%',
                  padding: '0.85rem 1rem 0.85rem 2.75rem',
                  background: 'rgba(255,255,255,0.07)',
                  border: '1px solid rgba(255,255,255,0.12)',
                  borderRadius: '50px',
                  color: 'var(--text-primary)',
                  fontSize: '0.925rem',
                  outline: 'none',
                  backdropFilter: 'blur(10px)',
                  transition: 'border-color 0.2s, background 0.2s',
                  boxSizing: 'border-box',
                }}
                onFocus={e => {
                  e.target.style.borderColor = 'rgba(124,58,237,0.6)'
                  e.target.style.background = 'rgba(255,255,255,0.1)'
                }}
                onBlur={e => {
                  e.target.style.borderColor = 'rgba(255,255,255,0.12)'
                  e.target.style.background = 'rgba(255,255,255,0.07)'
                }}
              />
            </div>
          </div>
        </section>

        {/* ── Category Tabs ── */}
        <section style={{
          position: 'sticky', top: '72px', zIndex: 40,
          background: 'rgba(10,10,15,0.85)',
          backdropFilter: 'blur(20px)',
          borderBottom: '1px solid var(--border-subtle)',
          padding: '0',
        }}>
          <div className="container">
            <div style={{
              display: 'flex',
              gap: '0',
              overflowX: 'auto',
              scrollbarWidth: 'none',
            }}>
              {FIXED_CATEGORIES.map(cat => {
                const isActive = activeCategory === cat
                const accent = categoryAccents[cat]
                return (
                  <button
                    key={cat}
                    onClick={() => setActiveCategory(cat)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.4rem',
                      padding: '1.1rem 1.35rem',
                      background: 'transparent',
                      border: 'none',
                      borderBottom: isActive ? `2.5px solid ${accent}` : '2.5px solid transparent',
                      color: isActive ? accent : 'var(--text-muted)',
                      fontSize: '0.875rem',
                      fontWeight: isActive ? 700 : 500,
                      cursor: 'pointer',
                      whiteSpace: 'nowrap',
                      transition: 'all 0.2s ease',
                      fontFamily: 'inherit',
                      letterSpacing: isActive ? '0.01em' : '0',
                    }}
                  >
                    <span style={{ opacity: isActive ? 1 : 0.6, transition: 'opacity 0.2s' }}>
                      {categoryIcons[cat]}
                    </span>
                    {cat}
                    <span style={{
                      padding: '0.1rem 0.45rem',
                      background: isActive ? `${accent}25` : 'rgba(255,255,255,0.06)',
                      border: `1px solid ${isActive ? accent + '50' : 'transparent'}`,
                      borderRadius: '100px',
                      fontSize: '0.7rem',
                      fontWeight: 700,
                      color: isActive ? accent : 'var(--text-muted)',
                      transition: 'all 0.2s',
                      lineHeight: 1,
                    }}>
                      {counts[cat] ?? 0}
                    </span>
                  </button>
                )
              })}
            </div>
          </div>
        </section>

        {/* ── Grid Section ── */}
        <section style={{ padding: '3rem 0 6rem' }}>
          <div className="container">
            {isLoading ? (
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(290px, 1fr))',
                gap: '1.5rem',
              }}>
                {[...Array(8)].map((_, i) => (
                  <div key={i} style={{
                    height: '300px',
                    background: 'var(--bg-card)',
                    borderRadius: '20px',
                    animation: 'pulse 1.5s infinite',
                    animationDelay: `${i * 0.1}s`,
                  }} />
                ))}
              </div>
            ) : filtered.length > 0 ? (
              <>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  marginBottom: '1.75rem',
                  flexWrap: 'wrap',
                  gap: '0.5rem',
                }}>
                  <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>
                    Menampilkan <strong style={{ color: 'var(--text-secondary)' }}>{filtered.length}</strong> karya
                    {activeCategory !== 'Semua' && (
                      <> dalam kategori <strong style={{ color: categoryAccents[activeCategory] }}>{activeCategory}</strong></>
                    )}
                  </p>
                  {search && (
                    <button
                      onClick={() => setSearch('')}
                      style={{
                        fontSize: '0.78rem', color: 'var(--text-muted)',
                        background: 'none', border: 'none', cursor: 'pointer',
                        textDecoration: 'underline',
                      }}
                    >
                      Hapus pencarian
                    </button>
                  )}
                </div>

                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fill, minmax(290px, 1fr))',
                  gap: '1.5rem',
                }}>
                  {filtered.map((p, i) => (
                    <div
                      key={p.id}
                      style={{
                        animation: 'fadeInUp 0.4s ease both',
                        animationDelay: `${i * 0.06}s`,
                      }}
                    >
                      <PortfolioCard portfolio={p} onClick={() => setSelectedPortfolio(p)} />
                    </div>
                  ))}
                </div>
              </>
            ) : (
              <div style={{ textAlign: 'center', padding: '6rem 0', color: 'var(--text-muted)' }}>
                <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>
                  🔍
                </div>
                <p style={{ fontSize: '1.1rem', fontWeight: 600, marginBottom: '0.5rem' }}>
                  Tidak ada karya yang ditemukan
                </p>
                <p style={{ fontSize: '0.875rem', opacity: 0.7 }}>
                  Coba ubah filter atau kata kunci pencarian.
                </p>
              </div>
            )}
          </div>
        </section>
      </main>
      <Footer />

      {/* ── Modal Portfolio ── */}
      {selectedPortfolio && (
        <div style={{
          position: 'fixed', inset: 0, zIndex: 1000,
          background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(10px)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          padding: '2rem', animation: 'fadeIn 0.2s ease',
        }} onClick={() => setSelectedPortfolio(null)}>
          <div style={{
            background: 'var(--bg-card)',
            border: '1px solid var(--border)',
            borderRadius: '24px',
            maxWidth: '900px', width: '100%',
            overflow: 'hidden', position: 'relative',
            maxHeight: '90vh', display: 'flex', flexDirection: 'column',
          }} onClick={e => e.stopPropagation()}>
            <button
              onClick={() => setSelectedPortfolio(null)}
              style={{
                position: 'absolute', top: '1rem', right: '1rem', zIndex: 10,
                background: 'rgba(0,0,0,0.5)', border: 'none', color: 'white',
                borderRadius: '50%', padding: '0.5rem', cursor: 'pointer',
                backdropFilter: 'blur(4px)', transition: 'background 0.2s',
              }}
              onMouseEnter={e => e.currentTarget.style.background = 'rgba(0,0,0,0.8)'}
              onMouseLeave={e => e.currentTarget.style.background = 'rgba(0,0,0,0.5)'}
            >
              <X size={20} />
            </button>
            <div style={{
              position: 'relative', width: '100%',
              minHeight: '300px', flex: '1 1 auto',
              background: '#000', display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              {selectedPortfolio.media_type === 'video' || selectedPortfolio.video_url ? (
                <video
                  src={selectedPortfolio.video_url || ''}
                  controls autoPlay
                  style={{ width: '100%', maxHeight: '60vh', objectFit: 'contain' }}
                />
              ) : selectedPortfolio.image_url ? (
                <Image
                  src={selectedPortfolio.image_url}
                  alt={selectedPortfolio.title}
                  width={1200} height={800}
                  style={{ width: '100%', maxHeight: '60vh', objectFit: 'contain' }}
                />
              ) : null}
            </div>
            <div style={{ padding: '1.5rem', flexShrink: 0 }}>
              <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center', marginBottom: '0.5rem' }}>
                <span style={{
                  padding: '0.2rem 0.6rem',
                  background: 'var(--bg-elevated)',
                  border: '1px solid var(--border)',
                  borderRadius: '100px', fontSize: '0.75rem', fontWeight: 600,
                  color: 'var(--text-muted)'
                }}>
                  {selectedPortfolio.category}
                </span>
                <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                  {new Date(selectedPortfolio.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}
                </span>
              </div>
              <h2 style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: '0.75rem' }}>
                {selectedPortfolio.title}
              </h2>
              {selectedPortfolio.description && (
                <p style={{ color: 'var(--text-secondary)', lineHeight: 1.6, fontSize: '0.95rem' }}>
                  {selectedPortfolio.description}
                </p>
              )}
            </div>
          </div>
        </div>
      )}

      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.35; }
        }
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(16px); }
          to { opacity: 1; transform: translateY(0); }
        }
        #portfolio-search::placeholder { color: rgba(255,255,255,0.35); }
        ::-webkit-scrollbar { display: none; }
      `}</style>
    </>
  )
}
