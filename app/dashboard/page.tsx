'use client'
import { useState, useEffect } from 'react'
import { User } from '@supabase/supabase-js'
import { supabase } from '../../lib/supabase'
import { useRouter } from 'next/navigation'
import MetricList from '../../components/MetricList'
import CalendarView from '../../components/CalendarView'

type View = 'metrics' | 'calendar'

export default function Dashboard() {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [currentView, setCurrentView] = useState<View>('metrics')
  const [selectedMetric, setSelectedMetric] = useState<string>('')
  const router = useRouter()

  useEffect(() => {
    // Check if user is logged in
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        setUser(session.user)
      } else {
        router.push('/auth/signin')
      }
      setLoading(false)
    })

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        setUser(session.user)
      } else {
        router.push('/auth/signin')
      }
    })

    return () => subscription.unsubscribe()
  }, [router])

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    router.push('/')
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
    return (
      <div style={{ 
        height: '100vh', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center',
        fontSize: '18px'
      }}>
        Loading...
      </div>
    )
  }

  if (!user) {
    return null // Will redirect to signin
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