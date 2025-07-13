'use client'
import { useState } from 'react'
import { supabase } from '../lib/supabase'
import { AuthFormProps } from '../lib/types'

export default function AuthForm({ onAuthSuccess }: AuthFormProps) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)

  const signUp = async () => {
    setLoading(true)
    const { error } = await supabase.auth.signUp({ email, password })
    setLoading(false)
    
    if (error) {
      alert(error.message)
    } else {
      alert('Check your email for confirmation!')
    }
  }

  const signIn = async () => {
    setLoading(true)
    const { data, error } = await supabase.auth.signInWithPassword({ email, password })
    setLoading(false)
    
    if (error) {
      alert(error.message)
    } else if (data.user) {
      onAuthSuccess(data.user)
    }
  }

  return (
    <div style={{ padding: '20px', maxWidth: '400px', margin: '100px auto' }}>
      <h1>Daily Tracker</h1>
      <div style={{ marginBottom: '15px' }}>
        <input 
          type="email" 
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          disabled={loading}
          style={{ 
            width: '100%', 
            padding: '10px', 
            marginBottom: '10px', 
            borderRadius: '5px', 
            border: '1px solid #ddd',
            boxSizing: 'border-box'
          }}
        />
        <input 
          type="password" 
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          disabled={loading}
          style={{ 
            width: '100%', 
            padding: '10px', 
            borderRadius: '5px', 
            border: '1px solid #ddd',
            boxSizing: 'border-box'
          }}
        />
      </div>
      <div style={{ display: 'flex', gap: '10px' }}>
        <button 
          onClick={signIn} 
          disabled={loading}
          style={{ 
            flex: 1, 
            padding: '12px', 
            background: loading ? '#ccc' : '#4CAF50', 
            color: 'white', 
            border: 'none', 
            borderRadius: '5px',
            cursor: loading ? 'not-allowed' : 'pointer'
          }}
        >
          {loading ? 'Loading...' : 'Sign In'}
        </button>
        <button 
          onClick={signUp} 
          disabled={loading}
          style={{ 
            flex: 1, 
            padding: '12px', 
            background: loading ? '#ccc' : '#2196F3', 
            color: 'white', 
            border: 'none', 
            borderRadius: '5px',
            cursor: loading ? 'not-allowed' : 'pointer'
          }}
        >
          {loading ? 'Loading...' : 'Sign Up'}
        </button>
      </div>
    </div>
  )
}