'use client'

import { useQuery } from '@tanstack/react-query'
import Link from 'next/link'
import { Image as ImageIcon, MessageSquare, Plus, ArrowRight, TrendingUp, Zap } from 'lucide-react'
import { getPortfolios } from '@/services/portfolioService'
import { getTestimonials } from '@/services/testimonialService'
import { useAuth } from '@/hooks/useAuth'

export default function AdminDashboardPage() {
  const { user } = useAuth()
  const { data: portfolios = [] } = useQuery({ queryKey: ['portfolios'], queryFn: getPortfolios })
  const { data: testimonials = [] } = useQuery({ queryKey: ['testimonials'], queryFn: getTestimonials })

  const recentPortfolios = portfolios.slice(0, 5)

  const stats = [
    {
      label: 'Total Portfolio',
      value: portfolios.length,
      icon: <ImageIcon size={22} />,
      color: '#7C3AED',
      href: '/admin/portfolio',
    },
    {
      label: 'Total Testimoni',
      value: testimonials.length,
      icon: <MessageSquare size={22} />,
      color: '#10B981',
      href: '/admin/testimonial',
    },
    {
      label: 'Rating Rata-rata',
      value: testimonials.length
        ? `${(testimonials.reduce((a, t) => a + t.rating, 0) / testimonials.length).toFixed(1)}★`
        : '—',
      icon: <TrendingUp size={22} />,
      color: '#F59E0B',
      href: '/admin/testimonial',
    },
  ]

  return (
    <div style={{ maxWidth: '1000px' }}>
      {/* Welcome */}
      <div style={{ marginBottom: '2rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.4rem' }}>
          <div style={{
            width: '36px', height: '36px',
            background: 'var(--gradient-primary)',
            borderRadius: '10px',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <Zap size={18} color="white" fill="white" />
          </div>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 800 }}>Dashboard</h1>
        </div>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
          Selamat datang kembali{user?.email ? `, ${user.email.startsWith('vd.') && user.email.endsWith('@gmail.com') ? user.email.substring(3, user.email.indexOf('@')) : user.email}` : ''}! 👋
        </p>
      </div>

      {/* Stats */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: '1.25rem',
        marginBottom: '2.5rem',
      }}>
        {stats.map((stat) => (
          <Link
            key={stat.label}
            href={stat.href}
            style={{ textDecoration: 'none' }}
          >
            <div
              className="card-hover"
              style={{
                background: 'var(--bg-card)',
                border: '1px solid var(--border-subtle)',
                borderRadius: '16px',
                padding: '1.5rem',
                display: 'flex',
                flexDirection: 'column',
                gap: '0.75rem',
              }}
            >
              <div style={{
                width: '44px', height: '44px',
                background: `${stat.color}18`,
                borderRadius: '12px',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                color: stat.color,
              }}>
                {stat.icon}
              </div>
              <div>
                <div style={{ fontSize: '2rem', fontWeight: 900, color: stat.color, lineHeight: 1 }}>
                  {stat.value}
                </div>
                <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginTop: '0.25rem' }}>
                  {stat.label}
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>

      {/* Quick Actions */}
      <div style={{ marginBottom: '2.5rem' }}>
        <h2 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '1rem', color: 'var(--text-secondary)' }}>
          Quick Actions
        </h2>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem' }}>
          <Link href="/admin/portfolio" className="btn-primary" id="dash-add-portfolio-btn" style={{ fontSize: '0.875rem', padding: '0.6rem 1.25rem' }}>
            <Plus size={15} />
            Tambah Portfolio
          </Link>
          <Link href="/admin/testimonial" className="btn-secondary" id="dash-add-testimonial-btn" style={{ fontSize: '0.875rem', padding: '0.6rem 1.25rem' }}>
            <Plus size={15} />
            Tambah Testimoni
          </Link>
          <Link href="/admin/social" className="btn-secondary" id="dash-social-btn" style={{ fontSize: '0.875rem', padding: '0.6rem 1.25rem' }}>
            Kelola Sosial Media
          </Link>
        </div>
      </div>

      {/* Recent Portfolio */}
      <div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
          <h2 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--text-secondary)' }}>Portfolio Terbaru</h2>
          <Link href="/admin/portfolio" style={{
            display: 'flex', alignItems: 'center', gap: '0.4rem',
            color: 'var(--primary-light)', fontSize: '0.8rem', textDecoration: 'none',
          }}>
            Lihat semua <ArrowRight size={13} />
          </Link>
        </div>

        <div style={{
          background: 'var(--bg-card)',
          border: '1px solid var(--border-subtle)',
          borderRadius: '16px',
          overflow: 'hidden',
        }}>
          {recentPortfolios.length > 0 ? (
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid var(--border-subtle)' }}>
                  {['Judul', 'Kategori', 'Tanggal'].map(h => (
                    <th key={h} style={{
                      padding: '0.875rem 1.25rem',
                      textAlign: 'left',
                      fontSize: '0.78rem',
                      fontWeight: 600,
                      color: 'var(--text-muted)',
                      textTransform: 'uppercase',
                      letterSpacing: '0.05em',
                    }}>
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {recentPortfolios.map((p, i) => (
                  <tr
                    key={p.id}
                    style={{ borderBottom: i < recentPortfolios.length - 1 ? '1px solid var(--border-subtle)' : 'none' }}
                  >
                    <td style={{ padding: '0.875rem 1.25rem', fontSize: '0.9rem', fontWeight: 500 }}>{p.title}</td>
                    <td style={{ padding: '0.875rem 1.25rem' }}>
                      <span style={{
                        padding: '0.2rem 0.65rem',
                        background: 'rgba(124, 58, 237, 0.12)',
                        border: '1px solid rgba(124, 58, 237, 0.25)',
                        borderRadius: '100px',
                        fontSize: '0.75rem',
                        fontWeight: 600,
                        color: 'var(--primary-light)',
                      }}>
                        {p.category}
                      </span>
                    </td>
                    <td style={{ padding: '0.875rem 1.25rem', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                      {new Date(p.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-muted)' }}>
              <p style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>🎨</p>
              <p>Belum ada portfolio. Tambahkan sekarang!</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
