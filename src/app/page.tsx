export const revalidate = 0;
import { MessageCircle, ArrowRight, Sparkles, Star, Layers, Zap } from 'lucide-react'
import Link from 'next/link'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import PortfolioCard from '@/components/PortfolioCard'
import TestimonialCard from '@/components/TestimonialCard'
import { getPortfolios } from '@/services/portfolioService'
import { getTestimonials } from '@/services/testimonialService'

const WA_NUMBER = '6281392158503'
const WA_MESSAGE = encodeURIComponent('Halo Visualdy! Saya tertarik dengan jasa desain grafis kamu. Bisa minta info lebih lanjut?')

const stats = [
  { value: '100+', label: 'Project Selesai', icon: <Layers size={20} /> },
  { value: '50+', label: 'Klien Puas', icon: <Star size={20} /> },
  { value: '3+', label: 'Tahun Pengalaman', icon: <Zap size={20} /> },
  { value: '5★', label: 'Rating Rata-rata', icon: <Sparkles size={20} /> },
]

export default async function HomePage() {
  const [portfolios, testimonials] = await Promise.all([
    getPortfolios(),
    getTestimonials(),
  ])

  const featuredPortfolios = portfolios.slice(0, 6)
  const featuredTestimonials = testimonials.slice(0, 3)

  return (
    <>
      <Navbar />
      <main>
        {/* Hero Section */}
        <section style={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          position: 'relative',
          overflow: 'hidden',
          background: 'var(--gradient-hero)',
          paddingTop: '80px',
        }}>
          {/* Orbs */}
          <div className="orb orb-primary" style={{ width: '600px', height: '600px', top: '-200px', right: '-200px' }} />
          <div className="orb orb-accent" style={{ width: '400px', height: '400px', bottom: '-100px', left: '-100px' }} />

          <div className="container" style={{ position: 'relative', zIndex: 1, padding: '4rem 1.5rem' }}>
            <div style={{ maxWidth: '720px', margin: '0 auto', textAlign: 'center' }}>
              <div className="badge animate-fade-in" style={{ marginBottom: '1.5rem' }}>
                <Sparkles size={12} />
                Jasa Desain Grafis Profesional
              </div>

              <h1
                className="animate-fade-in-up"
                style={{
                  fontSize: 'clamp(2.5rem, 7vw, 4.5rem)',
                  fontWeight: 900,
                  lineHeight: 1.1,
                  marginBottom: '1.5rem',
                  animationDelay: '0.1s',
                }}
              >
                Simple.{' '}
                <span className="gradient-text">Creative.</span>{' '}
                <br />Impactful.
              </h1>

              <p
                className="animate-fade-in-up"
                style={{
                  fontSize: 'clamp(1rem, 2.5vw, 1.2rem)',
                  color: 'var(--text-secondary)',
                  marginBottom: '2.5rem',
                  lineHeight: 1.7,
                  animationDelay: '0.2s',
                }}
              >
                Kami hadir untuk mewujudkan identitas visual brand kamu — dari logo yang berkesan
                hingga konten yang bikin scroll jadi stop.
              </p>

              <div
                className="animate-fade-in-up"
                style={{
                  display: 'flex',
                  gap: '1rem',
                  justifyContent: 'center',
                  flexWrap: 'wrap',
                  animationDelay: '0.3s',
                }}
              >
                <Link href="/portfolio" className="btn-primary" id="hero-portfolio-btn">
                  Lihat Portfolio
                  <ArrowRight size={16} />
                </Link>
                <a
                  href={`https://wa.me/${WA_NUMBER}?text=${WA_MESSAGE}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-whatsapp"
                  id="hero-whatsapp-btn"
                >
                  <MessageCircle size={16} />
                  Order via WhatsApp
                </a>
              </div>
            </div>
          </div>

          {/* Wave divider */}
          <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0 }}>
            <svg viewBox="0 0 1440 80" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M0 80L1440 80L1440 40C1200 80 960 0 720 20C480 40 240 80 0 40L0 80Z" fill="var(--bg-base)" />
            </svg>
          </div>
        </section>

        {/* Stats */}
        <section style={{ padding: '4rem 0', background: 'var(--bg-base)' }}>
          <div className="container">
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))',
              gap: '1.5rem',
            }}>
              {stats.map((stat, i) => (
                <div
                  key={i}
                  className="glass card-hover"
                  style={{
                    borderRadius: '16px',
                    padding: '1.5rem',
                    textAlign: 'center',
                  }}
                >
                  <div style={{
                    width: '48px', height: '48px',
                    background: 'rgba(124, 58, 237, 0.15)',
                    borderRadius: '12px',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    margin: '0 auto 0.75rem',
                    color: 'var(--primary-light)',
                  }}>
                    {stat.icon}
                  </div>
                  <div style={{ fontSize: '2rem', fontWeight: 900, color: 'var(--text-primary)', lineHeight: 1 }}>
                    {stat.value}
                  </div>
                  <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginTop: '0.4rem' }}>
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Portfolio Preview */}
        <section style={{ padding: '5rem 0', background: 'var(--bg-surface)' }}>
          <div className="container">
            <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
              <div className="badge" style={{ marginBottom: '1rem' }}>
                <Layers size={12} />
                Portfolio
              </div>
              <h2 className="section-title">Karya Terbaik Kami</h2>
              <p className="section-subtitle">
                Setiap desain dibuat dengan penuh perhatian terhadap detail dan tujuan brand kamu.
              </p>
            </div>

            {featuredPortfolios.length > 0 ? (
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
                gap: '1.5rem',
                marginBottom: '2.5rem',
              }}>
                {featuredPortfolios.map(p => (
                  <PortfolioCard key={p.id} portfolio={p} />
                ))}
              </div>
            ) : (
              <div style={{
                textAlign: 'center',
                padding: '4rem',
                color: 'var(--text-muted)',
                background: 'var(--bg-card)',
                borderRadius: '16px',
                marginBottom: '2.5rem',
              }}>
                <p style={{ fontSize: '3rem', marginBottom: '1rem' }}>🎨</p>
                <p>Portfolio akan segera hadir. Tambahkan lewat admin dashboard!</p>
              </div>
            )}

            <div style={{ textAlign: 'center' }}>
              <Link href="/portfolio" className="btn-secondary" id="see-all-portfolio-btn">
                Lihat Semua Portfolio
                <ArrowRight size={16} />
              </Link>
            </div>
          </div>
        </section>

        {/* Testimonials Preview */}
        <section style={{ padding: '5rem 0', background: 'var(--bg-base)' }}>
          <div className="container">
            <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
              <div className="badge" style={{ marginBottom: '1rem' }}>
                <Star size={12} />
                Testimoni
              </div>
              <h2 className="section-title">Apa Kata Klien Kami</h2>
              <p className="section-subtitle">
                Kepercayaan klien adalah aset terbesar kami.
              </p>
            </div>

            {featuredTestimonials.length > 0 ? (
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
                gap: '1.5rem',
                marginBottom: '2.5rem',
              }}>
                {featuredTestimonials.map(t => (
                  <TestimonialCard key={t.id} testimonial={t} />
                ))}
              </div>
            ) : (
              <div style={{
                textAlign: 'center', padding: '4rem',
                color: 'var(--text-muted)', background: 'var(--bg-card)', borderRadius: '16px',
                marginBottom: '2.5rem',
              }}>
                <p style={{ fontSize: '3rem', marginBottom: '1rem' }}>💬</p>
                <p>Belum ada testimoni. Tambahkan lewat admin dashboard!</p>
              </div>
            )}

            <div style={{ textAlign: 'center' }}>
              <Link href="/testimonial" className="btn-secondary" id="see-all-testimonial-btn">
                Lihat Semua Testimoni
                <ArrowRight size={16} />
              </Link>
            </div>
          </div>
        </section>

        {/* Final CTA */}
        <section style={{
          padding: '6rem 0',
          background: 'var(--bg-surface)',
          position: 'relative',
          overflow: 'hidden',
          textAlign: 'center',
        }}>
          <div className="orb orb-primary" style={{ width: '500px', height: '500px', top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }} />
          <div className="container" style={{ position: 'relative', zIndex: 1 }}>
            <div className="badge" style={{ marginBottom: '1.5rem' }}>
              <Sparkles size={12} />
              Siap Mulai?
            </div>
            <h2 style={{ fontSize: 'clamp(2rem, 5vw, 3rem)', fontWeight: 900, marginBottom: '1rem' }}>
              Wujudkan Desain<br />
              <span className="gradient-text">Impian Kamu</span>
            </h2>
            <p style={{ color: 'var(--text-secondary)', maxWidth: '500px', margin: '0 auto 2.5rem', fontSize: '1.05rem', lineHeight: 1.7 }}>
              Hubungi kami sekarang dan dapatkan konsultasi gratis. Kami siap membantu brand kamu tampil lebih profesional.
            </p>
            <a
              href={`https://wa.me/${WA_NUMBER}?text=${WA_MESSAGE}`}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-whatsapp"
              id="cta-whatsapp-btn"
              style={{ fontSize: '1.05rem', padding: '0.9rem 2rem' }}
            >
              <MessageCircle size={20} />
              Mulai Chat Sekarang
            </a>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
