'use client'
import { useState, useEffect } from 'react'
import { User } from '@supabase/supabase-js'
import { supabase } from '../lib/supabase'
import AuthForm from '../components/AuthForm'
import MetricList from '../components/MetricList'
import CalendarView from '../components/CalendarView'

type View = 'auth' | 'metrics' | 'calendar'

export default function Home() {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [currentView, setCurrentView] = useState<View>('auth')
  const [selectedMetric, setSelectedMetric] = useState<string>('')

  useEffect(() => {
    // Check if user is already logged in
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null)
      setCurrentView(session?.user ? 'metrics' : 'auth')
      setLoading(false)
    })

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
      setCurrentView(session?.user ? 'metrics' : 'auth')
    })

    return () => subscription.unsubscribe()
  }, [])

  const handleAuthSuccess = (user: User) => {
    setUser(user)
    setCurrentView('metrics')
  }

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    setUser(null)
    setCurrentView('auth')
    setSelectedMetric('')
  }

  const handleSelectMetric = (metric: string) => {
    setSelectedMetric(metric)
    setCurrentView('calendar')
  }

  const handleBackToMetrics = () => {
    setCurrentView('metrics')
    setSelectedMetric('')
  }

  if (loading) {
    return <div style={{ padding: '20px', textAlign: 'center' }}>Loading...</div>
  }

  if (currentView === 'auth' || !user) {
    return <AuthForm onAuthSuccess={handleAuthSuccess} />
  }

  if (currentView === 'calendar' && selectedMetric) {
    return (
      <CalendarView 
        user={user} 
        metricName={selectedMetric}
        onBack={handleBackToMetrics}
      />
    )
  }

  return (
    <MetricList 
      user={user} 
      onSignOut={handleSignOut}
      onSelectMetric={handleSelectMetric}
    />
  )
}