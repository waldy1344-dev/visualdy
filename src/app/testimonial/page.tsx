'use client'

import { useQuery } from '@tanstack/react-query'
import { Star, MessageCircle, Edit3 } from 'lucide-react'
import Link from 'next/link'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import TestimonialCard from '@/components/TestimonialCard'
import { getTestimonials } from '@/services/testimonialService'

const WA_NUMBER = '6281392158503'
const WA_MESSAGE = encodeURIComponent('Halo Visualdy! Saya mau order desain grafis. Bisa bantu saya?')

export default function TestimonialPage() {
  const { data: testimonials = [], isLoading } = useQuery({
    queryKey: ['testimonials'],
    queryFn: getTestimonials,
  })

  const avgRating = testimonials.length
    ? (testimonials.reduce((acc, t) => acc + t.rating, 0) / testimonials.length).toFixed(1)
    : '5.0'

  return (
    <>
      <Navbar />
      <main style={{ minHeight: '100vh', background: 'var(--bg-base)', paddingTop: '72px' }}>
        {/* Header */}
        <section style={{
          padding: '4rem 0 3rem',
          background: 'var(--gradient-hero)',
          textAlign: 'center',
          position: 'relative',
          overflow: 'hidden',
        }}>
          <div className="orb orb-primary" style={{ width: '400px', height: '400px', top: '-150px', left: '-100px' }} />
          <div className="container" style={{ position: 'relative', zIndex: 1 }}>
            <div className="badge" style={{ marginBottom: '1rem' }}>
              <Star size={12} />
              Testimoni
            </div>
            <h1 className="section-title">Apa Kata Klien Kami</h1>
            <p className="section-subtitle">
              Kepercayaan dan kepuasan klien adalah prioritas utama Visualdy.
            </p>

            {/* Rating summary */}
            <div style={{
              display: 'inline-flex', alignItems: 'center', gap: '0.75rem',
              marginTop: '1.5rem',
              padding: '0.75rem 1.5rem',
              background: 'rgba(124, 58, 237, 0.1)',
              border: '1px solid rgba(124, 58, 237, 0.2)',
              borderRadius: '100px',
            }}>
              <div style={{ display: 'flex', gap: '2px' }}>
                {[1,2,3,4,5].map(s => (
                  <Star key={s} size={14} fill="#F59E0B" color="#F59E0B" />
                ))}
              </div>
              <span style={{ fontWeight: 700, color: 'var(--text-primary)' }}>{avgRating}</span>
              <span style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>
                dari {testimonials.length} ulasan
              </span>
            </div>
          </div>
        </section>

        {/* Grid */}
        <section style={{ padding: '4rem 0 5rem' }}>
          <div className="container">
            {isLoading ? (
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
                gap: '1.5rem',
              }}>
                {[...Array(6)].map((_, i) => (
                  <div key={i} style={{
                    height: '200px',
                    background: 'var(--bg-card)',
                    borderRadius: '16px',
                    animation: 'pulse 1.5s infinite',
                  }} />
                ))}
              </div>
            ) : testimonials.length > 0 ? (
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
                gap: '1.5rem',
              }}>
                {testimonials.map(t => (
                  <TestimonialCard key={t.id} testimonial={t} />
                ))}
              </div>
            ) : (
              <div style={{ textAlign: 'center', padding: '5rem 0', color: 'var(--text-muted)' }}>
                <p style={{ fontSize: '3rem', marginBottom: '1rem' }}>💬</p>
                <p style={{ fontSize: '1.1rem' }}>Belum ada testimoni.</p>
              </div>
            )}
          </div>
        </section>

        {/* Bottom CTA */}
        <section style={{ padding: '4rem 0', background: 'var(--bg-surface)', textAlign: 'center' }}>
          <div className="container">
            <h2 style={{ fontSize: 'clamp(1.5rem, 4vw, 2rem)', fontWeight: 800, marginBottom: '1rem' }}>
              Giliran Kamu Jadi Klien Kami!
            </h2>
            <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>
              Bergabung bersama puluhan klien yang sudah puas dengan hasil kerja Visualdy.
            </p>
            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
              <a
                href={`https://wa.me/${WA_NUMBER}?text=${WA_MESSAGE}`}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-whatsapp"
                id="testimonial-order-btn"
              >
                <MessageCircle size={18} />
                Order Sekarang via WhatsApp
              </a>
              <Link href="/review" className="btn-secondary" style={{ padding: '0.8rem 1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.95rem' }}>
                <Edit3 size={18} />
                Beri Ulasan Anda
              </Link>
            </div>
          </div>
        </section>
      </main>
      <Footer />
      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.4; }
        }
      `}</style>
    </>
  )
}
