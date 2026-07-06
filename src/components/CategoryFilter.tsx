'use client'

interface Props {
  categories: string[]
  active: string
  onSelect: (cat: string) => void
}

export default function CategoryFilter({ categories, active, onSelect }: Props) {
  const all = ['Semua', ...categories]

  return (
    <div style={{
      display: 'flex',
      flexWrap: 'wrap',
      gap: '0.6rem',
      justifyContent: 'center',
    }}>
      {all.map(cat => {
        const isActive = cat === active
        return (
          <button
            key={cat}
            id={`filter-${cat.toLowerCase().replace(/\s+/g, '-')}`}
            onClick={() => onSelect(cat)}
            style={{
              padding: '0.5rem 1.25rem',
              borderRadius: '100px',
              border: isActive
                ? '1px solid rgba(124, 58, 237, 0.7)'
                : '1px solid var(--border-subtle)',
              background: isActive
                ? 'rgba(124, 58, 237, 0.18)'
                : 'transparent',
              color: isActive ? 'var(--primary-light)' : 'var(--text-secondary)',
              fontSize: '0.875rem',
              fontWeight: isActive ? 700 : 500,
              fontFamily: 'inherit',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
              transform: isActive ? 'scale(1.04)' : 'scale(1)',
            }}
            onMouseEnter={e => {
              if (!isActive) {
                e.currentTarget.style.borderColor = 'rgba(124, 58, 237, 0.4)'
                e.currentTarget.style.color = 'var(--text-primary)'
              }
            }}
            onMouseLeave={e => {
              if (!isActive) {
                e.currentTarget.style.borderColor = 'var(--border-subtle)'
                e.currentTarget.style.color = 'var(--text-secondary)'
              }
            }}
          >
            {cat}
          </button>
        )
      })}
    </div>
  )
}
