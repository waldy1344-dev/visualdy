'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { MessageCircle, Zap, ExternalLink, Camera, Video } from 'lucide-react'
import { getSocialLinks } from '@/services/socialService'
import { SocialLink } from '@/types/social'

const platformIcons: Record<string, React.ReactNode> = {
  instagram: <Camera size={18} />,
  tiktok: <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1V9.01a6.27 6.27 0 00-.79-.05 6.34 6.34 0 00-6.34 6.34 6.34 6.34 0 006.34 6.34 6.34 6.34 0 006.33-6.34V9.19a8.19 8.19 0 004.79 1.54V7.28a4.85 4.85 0 01-1.02-.59z"/></svg>,
  whatsapp: <MessageCircle size={18} />,
  youtube: <Video size={18} />,
}

const WA_NUMBER = '6281392158503'
const WA_MESSAGE = encodeURIComponent('Halo Visualdy! Saya tertarik dengan jasa desain grafis kamu.')

export default function Footer() {
  const [socials, setSocials] = useState<SocialLink[]>([])

  useEffect(() => {
    getSocialLinks().then(setSocials).catch(() => {})
  }, [])

  const year = new Date().getFullYear()

  return (
    <footer style={{
      background: 'var(--bg-surface)',
      borderTop: '1px solid var(--border-subtle)',
      padding: '3rem 0 1.5rem',
    }}>
      <div className="container">
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: '2.5rem',
          marginBottom: '2.5rem',
        }}>
          {/* Brand */}
          <div>
            <Link href="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
              <div style={{
                width: '32px', height: '32px',
                background: 'var(--gradient-primary)',
                borderRadius: '8px',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <Zap size={16} color="white" fill="white" />
              </div>
              <span style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--text-primary)' }}>
                Visual<span className="gradient-text">dy</span>
              </span>
            </Link>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', lineHeight: '1.7' }}>
              Simple. Creative. Impactful.<br />
              Jasa desain grafis profesional untuk brand kamu.
            </p>
          </div>

          {/* Links */}
          <div>
            <h4 style={{ fontWeight: 700, marginBottom: '1rem', fontSize: '0.95rem', color: 'var(--text-primary)' }}>Navigasi</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
              {[
                { href: '/', label: 'Home' },
                { href: '/portfolio', label: 'Portfolio' },
                { href: '/testimonial', label: 'Testimoni' },
              ].map(link => (
                <Link key={link.href} href={link.href} style={{
                  color: 'var(--text-secondary)',
                  textDecoration: 'none',
                  fontSize: '0.9rem',
                  transition: 'color 0.2s ease',
                }}
                  onMouseEnter={e => (e.currentTarget.style.color = 'var(--primary-light)')}
                  onMouseLeave={e => (e.currentTarget.style.color = 'var(--text-secondary)')}
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>

          {/* Social */}
          <div>
            <h4 style={{ fontWeight: 700, marginBottom: '1rem', fontSize: '0.95rem', color: 'var(--text-primary)' }}>Sosial Media</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
              {socials.length > 0 ? socials.map(s => (
                <a
                  key={s.id}
                  href={s.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    display: 'flex', alignItems: 'center', gap: '0.5rem',
                    color: 'var(--text-secondary)',
                    textDecoration: 'none',
                    fontSize: '0.9rem',
                    transition: 'color 0.2s ease',
                  }}
                  onMouseEnter={e => (e.currentTarget.style.color = 'var(--primary-light)')}
                  onMouseLeave={e => (e.currentTarget.style.color = 'var(--text-secondary)')}
                >
                  {platformIcons[s.platform.toLowerCase()] || <ExternalLink size={18} />}
                  <span style={{ textTransform: 'capitalize' }}>{s.platform}</span>
                </a>
              )) : (
                <>
                  <a
                    href="https://www.instagram.com/visualdy_?igsh=eDBxdno1eXJpMjls"
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      display: 'flex', alignItems: 'center', gap: '0.5rem',
                      color: 'var(--text-secondary)',
                      textDecoration: 'none',
                      fontSize: '0.9rem',
                      transition: 'color 0.2s ease',
                    }}
                    onMouseEnter={e => (e.currentTarget.style.color = 'var(--primary-light)')}
                    onMouseLeave={e => (e.currentTarget.style.color = 'var(--text-secondary)')}
                  >
                    <Camera size={18} />
                    Instagram
                  </a>
                  <a
                    href={`https://wa.me/${WA_NUMBER}?text=${WA_MESSAGE}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      display: 'flex', alignItems: 'center', gap: '0.5rem',
                      color: 'var(--text-secondary)',
                      textDecoration: 'none',
                      fontSize: '0.9rem',
                      transition: 'color 0.2s ease',
                    }}
                    onMouseEnter={e => (e.currentTarget.style.color = 'var(--primary-light)')}
                    onMouseLeave={e => (e.currentTarget.style.color = 'var(--text-secondary)')}
                  >
                    <MessageCircle size={18} />
                    WhatsApp
                  </a>
                </>
              )}
            </div>
          </div>

          {/* CTA */}
          <div>
            <h4 style={{ fontWeight: 700, marginBottom: '1rem', fontSize: '0.95rem', color: 'var(--text-primary)' }}>Order Sekarang</h4>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', marginBottom: '1rem' }}>
              Siap mewujudkan ide desain kamu?
            </p>
            <a
              href={`https://wa.me/${WA_NUMBER}?text=${WA_MESSAGE}`}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-whatsapp"
              style={{ fontSize: '0.875rem', padding: '0.6rem 1.25rem' }}
            >
              <MessageCircle size={16} />
              Chat WhatsApp
            </a>
          </div>
        </div>

        <hr className="divider" />

        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '0.5rem',
        }}>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>
            © {year} Visualdy. All rights reserved.
          </p>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>
            Made with ❤️ for creative professionals
          </p>
        </div>
      </div>
    </footer>
  )
}
