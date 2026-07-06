'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Menu, X, Zap } from 'lucide-react'

const navLinks = [
  { href: '/', label: 'Home' },
  { href: '/portfolio', label: 'Portfolio' },
  { href: '/testimonial', label: 'Testimoni' },
]

const WA_NUMBER = '6281392158503'
const WA_MESSAGE = encodeURIComponent('Halo Visualdy! Saya tertarik dengan jasa desain grafis kamu. Bisa minta info lebih lanjut?')

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <nav
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 100,
        transition: 'all 0.3s ease',
        background: scrolled ? 'rgba(10, 10, 15, 0.92)' : 'transparent',
        backdropFilter: scrolled ? 'blur(20px)' : 'none',
        borderBottom: scrolled ? '1px solid rgba(124, 58, 237, 0.12)' : 'none',
      }}
    >
      <div className="container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: '72px' }}>
        {/* Logo */}
        <Link href="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <div style={{
            width: '36px', height: '36px',
            background: 'var(--gradient-primary)',
            borderRadius: '10px',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: '0 4px 12px rgba(124, 58, 237, 0.5)',
          }}>
            <Zap size={18} color="white" fill="white" />
          </div>
          <span style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-primary)' }}>
            Visual<span className="gradient-text">dy</span>
          </span>
        </Link>

        {/* Desktop Nav */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '2.5rem' }} className="desktop-nav">
          {navLinks.map(link => (
            <Link
              key={link.href}
              href={link.href}
              style={{
                color: 'var(--text-secondary)',
                textDecoration: 'none',
                fontSize: '0.95rem',
                fontWeight: 500,
                transition: 'color 0.2s ease',
              }}
              onMouseEnter={e => (e.currentTarget.style.color = 'var(--text-primary)')}
              onMouseLeave={e => (e.currentTarget.style.color = 'var(--text-secondary)')}
            >
              {link.label}
            </Link>
          ))}
          <a
            href={`https://wa.me/${WA_NUMBER}?text=${WA_MESSAGE}`}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-primary"
            style={{ padding: '0.6rem 1.4rem', fontSize: '0.875rem' }}
          >
            Order Sekarang
          </a>
        </div>

        {/* Mobile hamburger */}
        <button
          id="navbar-mobile-toggle"
          onClick={() => setIsOpen(!isOpen)}
          style={{
            background: 'none',
            border: 'none',
            color: 'var(--text-primary)',
            cursor: 'pointer',
            display: 'none',
            padding: '0.25rem',
          }}
          className="mobile-menu-btn"
          aria-label="Toggle menu"
        >
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile menu */}
      {isOpen && (
        <div style={{
          background: 'rgba(17, 17, 24, 0.98)',
          backdropFilter: 'blur(20px)',
          borderTop: '1px solid var(--border-subtle)',
          padding: '1rem 1.5rem 1.5rem',
        }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {navLinks.map(link => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setIsOpen(false)}
                style={{ color: 'var(--text-secondary)', textDecoration: 'none', fontSize: '1rem', fontWeight: 500, padding: '0.5rem 0' }}
              >
                {link.label}
              </Link>
            ))}
            <a
              href={`https://wa.me/${WA_NUMBER}?text=${WA_MESSAGE}`}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-primary"
              style={{ justifyContent: 'center', marginTop: '0.5rem' }}
            >
              Order Sekarang
            </a>
          </div>
        </div>
      )}

      <style>{`
        @media (max-width: 768px) {
          .desktop-nav { display: none !important; }
          .mobile-menu-btn { display: flex !important; }
        }
      `}</style>
    </nav>
  )
}
