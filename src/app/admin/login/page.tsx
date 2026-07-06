'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Eye, EyeOff, Zap, Lock, UserPlus } from 'lucide-react'
import { signIn, signUp } from '@/lib/auth'

const schema = z.object({
  username: z.string()
    .min(3, 'Username minimal 3 karakter')
    .regex(/^[a-zA-Z0-9_]+$/, 'Username hanya boleh berisi huruf, angka, dan underscore'),
  password: z.string().min(6, 'Password minimal 6 karakter'),
})

type FormData = z.infer<typeof schema>

export default function AdminLoginPage() {
  const router = useRouter()
  const [showPass, setShowPass] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [isRegistering, setIsRegistering] = useState(false)

  const { register, handleSubmit, formState: { errors }, reset } = useForm<FormData>({
    resolver: zodResolver(schema),
  })

  const onSubmit = async (data: FormData) => {
    setIsLoading(true)
    setError('')
    setSuccess('')
    const email = `vd.${data.username.toLowerCase()}@gmail.com`

    if (isRegistering) {
      const { error: signUpError } = await signUp(email, data.password)
      if (signUpError) {
        setError(signUpError.message === 'email rate limit exceeded' 
          ? 'Batas pendaftaran tercapai. Silakan coba lagi beberapa saat lagi.' 
          : signUpError.message || 'Gagal mendaftarkan akun.')
      } else {
        setSuccess('Akun admin berhasil didaftarkan! Silakan masuk dengan akun baru Anda.')
        setIsRegistering(false)
        reset()
      }
      setIsLoading(false)
    } else {
      const { error: signInError } = await signIn(email, data.password)
      if (signInError) {
        setError('Username atau password salah. Silakan coba lagi.')
        setIsLoading(false)
      } else {
        router.push('/admin/dashboard')
        router.refresh()
      }
    }
  }

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'var(--gradient-hero)',
      padding: '1.5rem',
      position: 'relative',
      overflow: 'hidden',
    }}>
      <div className="orb orb-primary" style={{ width: '500px', height: '500px', top: '-200px', right: '-200px' }} />
      <div className="orb orb-accent" style={{ width: '300px', height: '300px', bottom: '-100px', left: '-100px' }} />

      <div style={{
        width: '100%',
        maxWidth: '420px',
        position: 'relative',
        zIndex: 1,
      }}>
        {/* Card */}
        <div className="glass" style={{ borderRadius: '20px', padding: '2.5rem' }}>
          {/* Header */}
          <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
            <div style={{
              width: '56px', height: '56px',
              background: 'var(--gradient-primary)',
              borderRadius: '16px',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              margin: '0 auto 1rem',
              boxShadow: '0 8px 24px rgba(124, 58, 237, 0.4)',
            }}>
              <Zap size={24} color="white" fill="white" />
            </div>
            <h1 style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: '0.4rem' }}>
              Admin <span className="gradient-text">Visualdy</span>
            </h1>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>
              {isRegistering ? 'Daftar akun admin baru' : 'Masuk ke dashboard admin kamu'}
            </p>
          </div>

          {/* Success alert */}
          {success && (
            <div style={{
              padding: '0.75rem 1rem',
              background: 'rgba(16, 185, 129, 0.1)',
              border: '1px solid rgba(16, 185, 129, 0.3)',
              borderRadius: '10px',
              color: '#10B981',
              fontSize: '0.875rem',
              marginBottom: '1.25rem',
              textAlign: 'center',
            }}>
              {success}
            </div>
          )}

          {/* Error alert */}
          {error && (
            <div style={{
              padding: '0.75rem 1rem',
              background: 'rgba(239, 68, 68, 0.1)',
              border: '1px solid rgba(239, 68, 68, 0.3)',
              borderRadius: '10px',
              color: '#EF4444',
              fontSize: '0.875rem',
              marginBottom: '1.25rem',
              textAlign: 'center',
            }}>
              {error}
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit(onSubmit)} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <div>
              <label className="form-label" htmlFor="admin-username">Username</label>
              <input
                id="admin-username"
                type="text"
                className="form-input"
                placeholder="Masukkan username"
                {...register('username')}
              />
              {errors.username && (
                <p style={{ color: '#EF4444', fontSize: '0.78rem', marginTop: '0.35rem' }}>
                  {errors.username.message}
                </p>
              )}
            </div>

            <div>
              <label className="form-label" htmlFor="admin-password">Password</label>
              <div style={{ position: 'relative' }}>
                <input
                  id="admin-password"
                  type={showPass ? 'text' : 'password'}
                  className="form-input"
                  placeholder="••••••••"
                  {...register('password')}
                  style={{ paddingRight: '3rem' }}
                />
                <button
                  type="button"
                  onClick={() => setShowPass(!showPass)}
                  style={{
                    position: 'absolute', right: '1rem', top: '50%',
                    transform: 'translateY(-50%)',
                    background: 'none', border: 'none',
                    color: 'var(--text-muted)', cursor: 'pointer',
                    padding: '0.1rem',
                  }}
                >
                  {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              {errors.password && (
                <p style={{ color: '#EF4444', fontSize: '0.78rem', marginTop: '0.35rem' }}>
                  {errors.password.message}
                </p>
              )}
            </div>

            <button
              id="admin-login-btn"
              type="submit"
              disabled={isLoading}
              className="btn-primary"
              style={{
                width: '100%',
                justifyContent: 'center',
                padding: '0.85rem',
                opacity: isLoading ? 0.7 : 1,
                cursor: isLoading ? 'not-allowed' : 'pointer',
              }}
            >
              {isLoading ? (
                <>
                  <span style={{
                    width: '16px', height: '16px',
                    border: '2px solid rgba(255,255,255,0.3)',
                    borderTopColor: 'white',
                    borderRadius: '50%',
                    display: 'inline-block',
                    animation: 'spin 0.7s linear infinite',
                  }} />
                  {isRegistering ? 'Mendaftarkan...' : 'Memproses...'}
                </>
              ) : (
                <>
                  {isRegistering ? <UserPlus size={16} /> : <Lock size={16} />}
                  {isRegistering ? 'Daftar' : 'Masuk'}
                </>
              )}
            </button>
          </form>

          {/* Toggle Mode */}
          <div style={{ textAlign: 'center', marginTop: '1.5rem' }}>
            <button
              onClick={() => {
                setIsRegistering(!isRegistering)
                setError('')
                setSuccess('')
              }}
              style={{
                background: 'none',
                border: 'none',
                color: 'var(--primary-light)',
                fontSize: '0.875rem',
                cursor: 'pointer',
                fontWeight: 600,
                textDecoration: 'underline',
              }}
            >
              {isRegistering ? 'Sudah punya akun? Masuk' : 'Belum punya akun? Daftar admin baru'}
            </button>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  )
}
