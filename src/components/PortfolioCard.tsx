'use client'

import Image from 'next/image'
import { Play } from 'lucide-react'
import { Portfolio } from '@/types/portfolio'
import { useState } from 'react'

interface Props {
  portfolio: Portfolio
  onClick?: () => void
}

const categoryColors: Record<string, { bg: string; border: string; text: string; dot: string }> = {
  'Logo':          { bg: 'rgba(124,58,237,0.15)',  border: 'rgba(124,58,237,0.35)',  text: '#A78BFA', dot: '#7C3AED' },
  'Poster':        { bg: 'rgba(59,130,246,0.15)',  border: 'rgba(59,130,246,0.35)',  text: '#60A5FA', dot: '#3B82F6' },
  'Banner':        { bg: 'rgba(245,158,11,0.15)',  border: 'rgba(245,158,11,0.35)',  text: '#FCD34D', dot: '#F59E0B' },
}

const defaultColor = { bg: 'rgba(124,58,237,0.15)', border: 'rgba(124,58,237,0.35)', text: '#A78BFA', dot: '#7C3AED' }

export default function PortfolioCard({ portfolio, onClick }: Props) {
  const isVideo = portfolio.media_type === 'video' || !!portfolio.video_url
  const color = categoryColors[portfolio.category] || defaultColor
  const [playing, setPlaying] = useState(false)

  return (
    <div
      className="portfolio-card"
      onClick={onClick}
      style={{
        background: 'var(--bg-card)',
        border: '1px solid var(--border-subtle)',
        borderRadius: '20px',
        overflow: 'hidden',
        position: 'relative',
        cursor: 'pointer',
        transition: 'transform 0.3s ease, box-shadow 0.3s ease, border-color 0.3s ease',
      }}
      onMouseEnter={e => {
        (e.currentTarget as HTMLDivElement).style.transform = 'translateY(-6px)'
        ;(e.currentTarget as HTMLDivElement).style.boxShadow = `0 20px 60px rgba(0,0,0,0.4), 0 0 0 1px ${color.dot}40`
        ;(e.currentTarget as HTMLDivElement).style.borderColor = color.border
      }}
      onMouseLeave={e => {
        (e.currentTarget as HTMLDivElement).style.transform = 'translateY(0)'
        ;(e.currentTarget as HTMLDivElement).style.boxShadow = 'none'
        ;(e.currentTarget as HTMLDivElement).style.borderColor = 'var(--border-subtle)'
      }}
    >
      {/* Media Area */}
      <div style={{ position: 'relative', width: '100%', paddingBottom: '66.67%', background: 'var(--bg-elevated)' }}>
        {isVideo ? (
          <>
            {/* Video thumbnail / player */}
            {playing && portfolio.video_url ? (
              <video
                src={portfolio.video_url}
                autoPlay
                controls
                loop
                style={{
                  position: 'absolute', inset: 0,
                  width: '100%', height: '100%',
                  objectFit: 'cover',
                }}
              />
            ) : (
              <>
                {/* Thumbnail fallback */}
                {portfolio.image_url ? (
                  <Image
                    src={portfolio.image_url}
                    alt={portfolio.title}
                    fill
                    style={{ objectFit: 'cover' }}
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  />
                ) : (
                  <div style={{
                    position: 'absolute', inset: 0,
                    background: 'linear-gradient(135deg, #1a0a2e 0%, #2d1b4e 100%)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}>
                    <span style={{ fontSize: '3rem' }}>🎬</span>
                  </div>
                )}

                {/* Video overlay gradient */}
                <div style={{
                  position: 'absolute', inset: 0,
                  background: 'linear-gradient(135deg, rgba(239,68,68,0.3) 0%, rgba(0,0,0,0.5) 100%)',
                }} />

                {/* Play button */}
                <button
                  onClick={() => setPlaying(true)}
                  style={{
                    position: 'absolute', inset: 0,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    background: 'transparent', border: 'none', cursor: 'pointer',
                  }}
                >
                  <div style={{
                    width: '56px', height: '56px',
                    borderRadius: '50%',
                    background: 'rgba(255,255,255,0.15)',
                    backdropFilter: 'blur(12px)',
                    border: '2px solid rgba(255,255,255,0.4)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    transition: 'all 0.2s ease',
                  }}>
                    <Play size={22} fill="white" color="white" style={{ marginLeft: '3px' }} />
                  </div>
                </button>
              </>
            )}

            {/* VJ Badge */}
            <div style={{
              position: 'absolute', top: '0.75rem', left: '0.75rem',
              display: 'flex', alignItems: 'center', gap: '0.3rem',
              padding: '0.2rem 0.55rem',
              background: 'rgba(0,0,0,0.6)',
              backdropFilter: 'blur(8px)',
              borderRadius: '100px',
              border: '1px solid rgba(239,68,68,0.5)',
              fontSize: '0.68rem', fontWeight: 700,
              color: '#F87171', letterSpacing: '0.03em',
            }}>
              <span style={{ width: '5px', height: '5px', borderRadius: '50%', background: '#EF4444', display: 'inline-block' }} />
              VIDEO
            </div>
          </>
        ) : (
          <>
            {portfolio.image_url ? (
              <Image
                src={portfolio.image_url}
                alt={portfolio.title}
                fill
                style={{ objectFit: 'cover' }}
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              />
            ) : (
              <div style={{
                position: 'absolute', inset: 0,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                background: 'var(--gradient-card)',
              }}>
                <span style={{ fontSize: '2.5rem' }}>🎨</span>
              </div>
            )}

            {/* Hover overlay */}
            <div className="portfolio-overlay" style={{
              position: 'absolute', inset: 0,
              background: 'linear-gradient(to top, rgba(10,10,15,0.92) 0%, rgba(10,10,15,0.3) 60%, transparent 100%)',
              opacity: 0,
              transition: 'opacity 0.35s ease',
              display: 'flex', alignItems: 'flex-end',
              padding: '1.25rem',
            }}>
              <p style={{ color: 'rgba(255,255,255,0.9)', fontSize: '0.875rem', lineHeight: '1.5' }}>
                {portfolio.description || 'Klik untuk lihat detail'}
              </p>
            </div>
          </>
        )}
      </div>

      {/* Content */}
      <div style={{ padding: '1rem 1.25rem 1.25rem' }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '0.5rem' }}>
          <h3 style={{
            fontSize: '0.975rem', fontWeight: 700,
            color: 'var(--text-primary)', lineHeight: '1.3',
            flex: 1,
          }}>
            {portfolio.title}
          </h3>
          <span style={{
            flexShrink: 0,
            padding: '0.2rem 0.65rem',
            background: color.bg,
            border: `1px solid ${color.border}`,
            borderRadius: '100px',
            fontSize: '0.7rem', fontWeight: 700,
            color: color.text,
            whiteSpace: 'nowrap',
            letterSpacing: '0.03em',
          }}>
            {portfolio.category}
          </span>
        </div>
        {portfolio.description && !isVideo && (
          <p style={{
            marginTop: '0.4rem',
            fontSize: '0.8rem',
            color: 'var(--text-muted)',
            lineHeight: '1.5',
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
          }}>
            {portfolio.description}
          </p>
        )}
      </div>

      <style>{`
        .portfolio-card:hover .portfolio-overlay {
          opacity: 1 !important;
        }
      `}</style>
    </div>
  )
}
