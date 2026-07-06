'use client'

import { useState } from 'react'
import { usePathname } from 'next/navigation'
import { Menu } from 'lucide-react'
import AdminSidebar from '@/components/AdminSidebar'

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const pathname = usePathname()
  const isLoginPage = pathname === '/admin/login'

  if (isLoginPage) {
    return <>{children}</>
  }

  return (
    <div style={{
      display: 'flex',
      minHeight: '100vh',
      background: 'var(--bg-base)',
    }}>
      {/* Desktop sidebar */}
      <div className="admin-sidebar-desktop">
        <AdminSidebar />
      </div>

      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          onClick={() => setSidebarOpen(false)}
          style={{
            position: 'fixed', inset: 0, zIndex: 40,
            background: 'rgba(0,0,0,0.6)',
            backdropFilter: 'blur(4px)',
          }}
        />
      )}

      {/* Mobile sidebar */}
      <div
        className="admin-sidebar-mobile"
        style={{
          position: 'fixed', top: 0, left: 0, zIndex: 50,
          transform: sidebarOpen ? 'translateX(0)' : 'translateX(-100%)',
          transition: 'transform 0.3s ease',
        }}
      >
        <AdminSidebar onClose={() => setSidebarOpen(false)} />
      </div>

      {/* Main content */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minHeight: '100vh', overflow: 'hidden' }}>
        {/* Mobile topbar */}
        <div className="admin-topbar" style={{
          display: 'none',
          alignItems: 'center',
          padding: '1rem 1.25rem',
          background: 'var(--bg-surface)',
          borderBottom: '1px solid var(--border-subtle)',
        }}>
          <button
            id="admin-menu-toggle"
            onClick={() => setSidebarOpen(true)}
            style={{
              background: 'none', border: 'none', color: 'var(--text-primary)',
              cursor: 'pointer', padding: '0.25rem',
            }}
          >
            <Menu size={22} />
          </button>
          <span style={{ marginLeft: '1rem', fontWeight: 700, fontSize: '1rem' }}>Admin Panel</span>
        </div>

        <main style={{ flex: 1, padding: '2rem', overflowY: 'auto' }}>
          {children}
        </main>
      </div>

      <style>{`
        @media (max-width: 768px) {
          .admin-sidebar-desktop { display: none !important; }
          .admin-sidebar-mobile { display: block !important; }
          .admin-topbar { display: flex !important; }
        }
        @media (min-width: 769px) {
          .admin-sidebar-mobile { display: none !important; }
        }
      `}</style>
    </div>
  )
}
