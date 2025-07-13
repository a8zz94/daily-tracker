'use client'
import { useState } from 'react'
import { supabase } from '../../../lib/supabase'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function SignIn() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const router = useRouter()

  const signIn = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    
    const { data, error } = await supabase.auth.signInWithPassword({ email, password })
    setLoading(false)
    
    if (error) {
      setError(error.message)
    } else if (data.user) {
      router.push('/dashboard')
    }
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px'
    }}>
      <div style={{
        background: 'white',
        borderRadius: '20px',
        padding: '40px',
        width: '100%',
        maxWidth: '400px',
        boxShadow: '0 20px 40px rgba(0,0,0,0.1)'
      }}>
        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: '30px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '10px' }}>
            <div style={{ display: 'flex', gap: '6px', marginRight: '10px' }}>
              <div style={{
                width: '16px',
                height: '16px',
                borderRadius: '50%',
                background: '#4CAF50'
              }} />
              <div style={{
                width: '16px',
                height: '16px',
                borderRadius: '50%',
                background: '#f44336'
              }} />
              <div style={{
                width: '16px',
                height: '16px',
                borderRadius: '50%',
                background: '#9E9E9E'
              }} />
            </div>
            <h1 style={{
              fontSize: '24px',
              fontWeight: '700',
              color: '#2c3e50',
              margin: '0'
            }}>
              Habitly
            </h1>
          </div>
          <p style={{ color: '#7f8c8d', margin: '0' }}>Welcome back</p>
        </div>

        <form onSubmit={signIn}>
          {error && (
            <div style={{
              background: '#fee',
              color: '#c33',
              padding: '10px',
              borderRadius: '5px',
              marginBottom: '15px',
              fontSize: '14px'
            }}>
              {error}
            </div>
          )}
          
          <div style={{ marginBottom: '20px' }}>
            <input 
              type="email" 
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={loading}
              style={{ 
                width: '100%', 
                padding: '12px', 
                borderRadius: '8px', 
                border: '1px solid #ddd',
                fontSize: '16px',
                boxSizing: 'border-box',
                color: '#2c3e50',
                background: '#f8f9fa'
              }}
            />
          </div>
          
          <div style={{ marginBottom: '20px' }}>
            <input 
              type="password" 
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              disabled={loading}
              style={{ 
                width: '100%', 
                padding: '12px', 
                borderRadius: '8px', 
                border: '1px solid #ddd',
                fontSize: '16px',
                boxSizing: 'border-box',
                color: '#2c3e50',
                background: '#f8f9fa'
              }}
            />
          </div>
          
          <button 
            type="submit"
            disabled={loading}
            style={{ 
              width: '100%',
              padding: '12px', 
              background: loading ? '#ccc' : '#4CAF50', 
              color: 'white', 
              border: 'none', 
              borderRadius: '8px',
              fontSize: '16px',
              fontWeight: '600',
              cursor: loading ? 'not-allowed' : 'pointer'
            }}
          >
            {loading ? 'Signing In...' : 'Sign In'}
          </button>
        </form>

        <div style={{ textAlign: 'center', marginTop: '20px' }}>
          <p style={{ color: '#7f8c8d', fontSize: '14px' }}>
            Don&apos;t have an account?{' '}
            <Link href="/auth/signup" style={{ color: '#667eea', textDecoration: 'none' }}>
              Sign up
            </Link>
          </p>
          <Link href="/" style={{ color: '#667eea', textDecoration: 'none', fontSize: '14px' }}>
            ← Back to home
          </Link>
        </div>
      </div>
    </div>
  )
}