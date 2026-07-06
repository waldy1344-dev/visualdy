import Image from 'next/image'
import { Star, MessageSquare } from 'lucide-react'
import { Testimonial } from '@/types/testimonial'

interface Props {
  testimonial: Testimonial
}

export default function TestimonialCard({ testimonial }: Props) {
  return (
    <div
      className="card-hover glass"
      style={{
        borderRadius: '16px',
        padding: '1.5rem',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Quote mark */}
      <div style={{
        position: 'absolute', top: '1rem', right: '1.25rem',
        fontSize: '4rem', lineHeight: 1,
        color: 'rgba(124, 58, 237, 0.12)',
        fontFamily: 'Georgia, serif',
        fontWeight: 900,
      }}>
        &ldquo;
      </div>

      {/* Stars */}
      <div style={{ display: 'flex', gap: '2px', marginBottom: '0.75rem' }}>
        {[1, 2, 3, 4, 5].map(star => (
          <Star
            key={star}
            size={15}
            fill={star <= testimonial.rating ? '#F59E0B' : 'none'}
            color={star <= testimonial.rating ? '#F59E0B' : 'var(--text-muted)'}
          />
        ))}
      </div>

      {/* Message */}
      <p style={{
        color: 'var(--text-secondary)',
        fontSize: '0.9rem',
        lineHeight: '1.7',
        marginBottom: '1.25rem',
        fontStyle: 'italic',
      }}>
        &ldquo;{testimonial.message}&rdquo;
      </p>

      {/* Author */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
        <div style={{
          width: '42px', height: '42px',
          borderRadius: '50%',
          overflow: 'hidden',
          border: '2px solid rgba(124, 58, 237, 0.3)',
          flexShrink: 0,
          position: 'relative',
          background: 'var(--bg-elevated)',
        }}>
          {testimonial.photo_url ? (
            <Image
              src={testimonial.photo_url}
              alt={testimonial.name}
              fill
              style={{ objectFit: 'cover' }}
            />
          ) : (
            <div style={{
              width: '100%', height: '100%',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              background: 'var(--gradient-primary)',
              color: 'white', fontSize: '1.1rem', fontWeight: 700,
            }}>
              {testimonial.name.charAt(0).toUpperCase()}
            </div>
          )}
        </div>
        <div>
          <p style={{ fontWeight: 700, fontSize: '0.9rem', color: 'var(--text-primary)' }}>
            {testimonial.name}
          </p>
          <p style={{ fontSize: '0.78rem', color: 'var(--primary-light)' }}>Klien Visualdy</p>
        </div>
      </div>

      {/* Admin Reply */}
      {testimonial.admin_reply && (
        <div style={{
          marginTop: '1.25rem',
          padding: '1rem',
          background: 'rgba(124, 58, 237, 0.08)',
          borderRadius: '12px',
          borderLeft: '3px solid var(--primary)',
        }}>
          <p style={{
            fontSize: '0.75rem',
            fontWeight: 800,
            color: 'var(--primary-light)',
            marginBottom: '0.4rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.4rem',
            textTransform: 'uppercase',
            letterSpacing: '0.5px'
          }}>
            <MessageSquare size={12} />
            Balasan dari Visualdy
          </p>
          <p style={{
            fontSize: '0.85rem',
            color: 'var(--text-secondary)',
            lineHeight: '1.6',
          }}>
            {testimonial.admin_reply}
          </p>
        </div>
      )}
    </div>
  )
}
