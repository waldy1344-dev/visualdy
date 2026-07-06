'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  LayoutDashboard, Image, MessageSquare, Link2, LogOut, Zap, X
} from 'lucide-react'
import { useAuth } from '@/hooks/useAuth'

const menuItems = [
  { href: '/admin/dashboard', label: 'Dashboard', icon: <LayoutDashboard size={18} /> },
  { href: '/admin/portfolio', label: 'Portfolio', icon: <Image size={18} /> },
  { href: '/admin/testimonial', label: 'Testimoni', icon: <MessageSquare size={18} /> },
  { href: '/admin/social', label: 'Sosial Media', icon: <Link2 size={18} /> },
]

interface Props {
  isOpen?: boolean
  onClose?: () => void
}

export default function AdminSidebar({ isOpen, onClose }: Props) {
  const pathname = usePathname()
  const { signOut, user } = useAuth()

  return (
    <aside style={{
      width: '240px',
      minHeight: '100vh',
      background: 'var(--bg-surface)',
      borderRight: '1px solid var(--border-subtle)',
      display: 'flex',
      flexDirection: 'column',
      padding: '1.5rem 0',
      flexShrink: 0,
      position: 'relative',
    }}>
      {/* Close button mobile */}
      {onClose && (
        <button
          onClick={onClose}
          style={{
            position: 'absolute', top: '1rem', right: '1rem',
            background: 'none', border: 'none', color: 'var(--text-muted)',
            cursor: 'pointer', display: 'none',
          }}
          className="sidebar-close-btn"
        >
          <X size={20} />
        </button>
      )}

      {/* Logo */}
      <div style={{ padding: '0 1.25rem 1.5rem', borderBottom: '1px solid var(--border-subtle)' }}>
        <Link href="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <div style={{
            width: '32px', height: '32px',
            background: 'var(--gradient-primary)',
            borderRadius: '8px',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <Zap size={15} color="white" fill="white" />
          </div>
          <span style={{ fontWeight: 800, color: 'var(--text-primary)', fontSize: '1.05rem' }}>
            Visual<span className="gradient-text">dy</span>
          </span>
        </Link>
        <div style={{ marginTop: '0.6rem' }}>
          <span style={{ fontSize: '0.7rem', color: 'var(--primary-light)', fontWeight: 600, background: 'rgba(124,58,237,0.12)', padding: '0.2rem 0.6rem', borderRadius: '100px' }}>
            Admin Panel
          </span>
        </div>
      </div>

      {/* Nav items */}
      <nav style={{ flex: 1, padding: '1rem 0.75rem', display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
        {menuItems.map(item => {
          const isActive = pathname === item.href
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onClose}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.75rem',
                padding: '0.7rem 1rem',
                borderRadius: '10px',
                textDecoration: 'none',
                fontSize: '0.9rem',
                fontWeight: isActive ? 600 : 500,
                color: isActive ? 'var(--primary-light)' : 'var(--text-secondary)',
                background: isActive ? 'rgba(124, 58, 237, 0.12)' : 'transparent',
                border: isActive ? '1px solid rgba(124, 58, 237, 0.2)' : '1px solid transparent',
                transition: 'all 0.2s ease',
              }}
              onMouseEnter={e => {
                if (!isActive) {
                  e.currentTarget.style.background = 'rgba(124, 58, 237, 0.07)'
                  e.currentTarget.style.color = 'var(--text-primary)'
                }
              }}
              onMouseLeave={e => {
                if (!isActive) {
                  e.currentTarget.style.background = 'transparent'
                  e.currentTarget.style.color = 'var(--text-secondary)'
                }
              }}
            >
              {item.icon}
              {item.label}
            </Link>
          )
        })}
      </nav>

      {/* User & Logout */}
      <div style={{ padding: '0.75rem', borderTop: '1px solid var(--border-subtle)' }}>
        {user && (
          <div style={{
            padding: '0.5rem 0.75rem',
            marginBottom: '0.5rem',
            fontSize: '0.78rem',
            color: 'var(--text-muted)',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
          }}>
            {user.email.startsWith('vd.') && user.email.endsWith('@gmail.com') ? user.email.substring(3, user.email.indexOf('@')) : user.email}
          </div>
        )}
        <button
          id="admin-logout-btn"
          onClick={signOut}
          style={{
            width: '100%',
            display: 'flex',
            alignItems: 'center',
            gap: '0.75rem',
            padding: '0.7rem 1rem',
            borderRadius: '10px',
            background: 'transparent',
            border: '1px solid transparent',
            color: '#EF4444',
            fontSize: '0.875rem',
            fontWeight: 500,
            cursor: 'pointer',
            fontFamily: 'inherit',
            transition: 'all 0.2s ease',
          }}
          onMouseEnter={e => {
            e.currentTarget.style.background = 'rgba(239, 68, 68, 0.08)'
            e.currentTarget.style.borderColor = 'rgba(239, 68, 68, 0.2)'
          }}
          onMouseLeave={e => {
            e.currentTarget.style.background = 'transparent'
            e.currentTarget.style.borderColor = 'transparent'
          }}
        >
          <LogOut size={16} />
          Logout
        </button>
      </div>
    </aside>
  )
}
