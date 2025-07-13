'use client'
import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import { MetricListProps } from '../lib/types'

export default function MetricList({ user, onSignOut, onSelectMetric }: MetricListProps & { onSelectMetric: (metric: string) => void }) {
  const [metrics, setMetrics] = useState<string[]>([])
  const [newMetric, setNewMetric] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadMetrics()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const loadMetrics = async () => {
    setLoading(true)
    
    // Get all unique metrics for this user
    const { data, error } = await supabase
      .from('daily_entries')
      .select('metric_name')
      .eq('user_id', user.id)
    
    if (error) {
      console.error('Error loading metrics:', error)
      setLoading(false)
      return
    }

    const userMetrics = [...new Set(data?.map(d => d.metric_name) || [])]
    // Since DEFAULT_METRICS is empty, just use userMetrics
    setMetrics(userMetrics)
    setLoading(false)
  }

  const addCustomMetric = async () => {
    if (!newMetric.trim() || metrics.includes(newMetric)) return

    // Add to local state immediately
    setMetrics(prev => [...prev, newMetric])
    setNewMetric('')
  }

  const deleteMetric = async (metricToDelete: string) => {
    if (!confirm(`Are you sure you want to delete "${metricToDelete}" and all its data?`)) {
      return
    }

    const { error } = await supabase
      .from('daily_entries')
      .delete()
      .eq('user_id', user.id)
      .eq('metric_name', metricToDelete)

    if (error) {
      console.error('Error deleting metric:', error)
      alert('Error deleting metric')
      return
    }

    // Remove from local state
    setMetrics(prev => prev.filter(m => m !== metricToDelete))
  }

  if (loading) {
    return <div style={{ padding: '20px', textAlign: 'center' }}>Loading...</div>
  }

  return (
    <div style={{ padding: '20px', maxWidth: '600px', margin: '0 auto' }}>
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        marginBottom: '30px' 
      }}>
        <h1>Daily Tracker</h1>
        <button 
          onClick={onSignOut} 
          style={{ 
            background: '#ccc', 
            color: 'black',
            border: 'none', 
            padding: '10px 15px', 
            borderRadius: '5px',
            cursor: 'pointer'
          }}
        >
          Sign Out
        </button>
      </div>

      <h2>Select a Metric to Track</h2>
      
      <div style={{ marginBottom: '30px' }}>
        {metrics.map((metric) => (
          <div 
            key={metric}
            style={{ 
              display: 'flex',
              alignItems: 'center',
              padding: '15px',
              margin: '10px 0',
              border: '2px solid #ddd',
              borderRadius: '8px',
              background: '#555555'
            }}
          >
            <div
              onClick={() => onSelectMetric(metric)}
              style={{ 
                flex: 1,
                cursor: 'pointer',
                fontSize: '18px',
                fontWeight: 'bold',
                color: 'white',
                padding: '5px',
                transition: 'color 0.2s'
              }}
            >
              {metric}
            </div>
            <button
              onClick={() => deleteMetric(metric)}
              style={{
                background: '#f44336',
                color: 'white',
                border: 'none',
                padding: '8px 12px',
                borderRadius: '5px',
                cursor: 'pointer',
                fontSize: '12px',
                minWidth: '70px'
              }}
              title={`Delete ${metric}`}
            >
              🗑️ Delete
            </button>
          </div>
        ))}
      </div>

      <div style={{ borderTop: '1px solid #ddd', paddingTop: '20px' }}>
        <h3>Add New Metric</h3>
        <div style={{ display: 'flex', gap: '10px' }}>
          <input
            type="text"
            placeholder="Enter metric name"
            value={newMetric}
            onChange={(e) => setNewMetric(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && addCustomMetric()}
            style={{ 
              flex: 1, 
              padding: '10px', 
              borderRadius: '5px', 
              border: '1px solid #ddd' 
            }}
          />
          <button
            onClick={addCustomMetric}
            style={{
              background: '#2196F3',
              color: 'white',
              border: 'none',
              padding: '10px 20px',
              borderRadius: '5px',
              cursor: 'pointer'
            }}
          >
            Add
          </button>
        </div>
      </div>
    </div>
  )
}