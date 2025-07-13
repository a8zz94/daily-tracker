'use client'
import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import { CalendarViewProps } from '../lib/types'

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
const DAYS_IN_MONTH = [31, 29, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31]

export default function CalendarView({ user, metricName, onBack }: CalendarViewProps) {
  const [entries, setEntries] = useState<{ [key: string]: 'yes' | 'no' | 'nd' }>({})
  const [loading, setLoading] = useState(true)
  const [isLandscape, setIsLandscape] = useState(false)
  const currentYear = new Date().getFullYear()

  useEffect(() => {
    loadYearData()
    
    const checkOrientation = () => {
      setIsLandscape(window.innerWidth > window.innerHeight)
    }
    
    checkOrientation()
    window.addEventListener('resize', checkOrientation)
    
    return () => window.removeEventListener('resize', checkOrientation)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const loadYearData = async () => {
    setLoading(true)
    
    const { data, error } = await supabase
      .from('daily_entries')
      .select('date, status')
      .eq('user_id', user.id)
      .eq('metric_name', metricName)
      .gte('date', `${currentYear}-01-01`)
      .lte('date', `${currentYear}-12-31`)

    if (error) {
      console.error('Error loading data:', error)
      setLoading(false)
      return
    }

    const entriesMap: { [key: string]: 'yes' | 'no' | 'nd' } = {}
    data?.forEach(entry => {
      entriesMap[entry.date] = entry.status
    })

    setEntries(entriesMap)
    setLoading(false)
  }

  const updateStatus = async (date: string, currentStatus: 'yes' | 'no' | 'nd') => {
    let newStatus: 'yes' | 'no' | 'nd'
    
    if (currentStatus === 'nd') {
      newStatus = 'yes'
    } else if (currentStatus === 'yes') {
      newStatus = 'no'
    } else {
      newStatus = 'nd'
    }

    const { error } = await supabase
      .from('daily_entries')
      .upsert({
        user_id: user.id,
        date: date,
        metric_name: metricName,
        status: newStatus
      }, {
        onConflict: 'user_id,date,metric_name'
      })

    if (error) {
      console.error('Error updating status:', error)
      return
    }

    setEntries(prev => ({
      ...prev,
      [date]: newStatus
    }))
  }

  const getCircleStyle = (status: 'yes' | 'no' | 'nd', isMobile: boolean) => {
    const size = isMobile ? '20px' : '24px'
    const baseStyle = {
      width: size,
      height: size,
      borderRadius: '50%',
      border: '1px solid #ddd',
      cursor: 'pointer',
      transition: 'all 0.2s',
      flexShrink: 0
    }

    switch (status) {
      case 'yes':
        return { ...baseStyle, background: '#4CAF50', borderColor: '#4CAF50' }
      case 'no':
        return { ...baseStyle, background: '#f44336', borderColor: '#f44336' }
      default:
        return { ...baseStyle, background: '#9E9E9E', borderColor: '#9E9E9E' }
    }
  }

  const renderDaysForMonth = (monthIndex: number, isMobile: boolean) => {
    const daysInMonth = DAYS_IN_MONTH[monthIndex]
    const maxDays = 31 // Use 31 as the template for spacing
    const days = []
    
    for (let day = 1; day <= maxDays; day++) {
      if (day <= daysInMonth) {
        // Actual day exists
        const date = `${currentYear}-${String(monthIndex + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`
        const status = entries[date] || 'nd'
        
        // Add gap every 5 days, but not after day 30
        const needsGap = day % 5 === 0 && day !== 30 && day < maxDays
        
        days.push(
          <div key={day} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <div
              onClick={() => updateStatus(date, status)}
              style={{
                ...getCircleStyle(status, isMobile)
              }}
              title={`${MONTHS[monthIndex]} ${day}: ${status}`}
            />
            {needsGap && <div style={{ height: isMobile ? '6px' : '8px' }} />}
          </div>
        )
      } else {
        // Empty placeholder to maintain alignment
        const needsGap = day % 5 === 0 && day !== 30 && day < maxDays
        
        days.push(
          <div key={day} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <div style={{ 
              width: isMobile ? '20px' : '24px',
              height: isMobile ? '20px' : '24px',
              visibility: 'hidden' // Invisible but takes up space
            }} />
            {needsGap && <div style={{ height: isMobile ? '6px' : '8px' }} />}
          </div>
        )
      }
    }
    
    return days
  }

  if (loading) {
    return <div style={{ padding: '10px', textAlign: 'center', fontSize: '14px' }}>Loading...</div>
  }

  const isMobile = !isLandscape && window.innerWidth <= 768

  // Mobile Portrait Layout
  if (isMobile) {
    return (
      <div style={{ 
        padding: '8px', 
        height: '100vh', 
        display: 'flex', 
        flexDirection: 'column',
        overflow: 'hidden'
      }}>
        {/* Header */}
        <div style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center', 
          marginBottom: '8px',
          minHeight: '40px'
        }}>
          <button
            onClick={onBack}
            style={{
              background: '#2196F3',
              color: 'white',
              border: 'none',
              padding: '6px 10px',
              borderRadius: '4px',
              cursor: 'pointer',
              fontSize: '12px'
            }}
          >
            ← Back
          </button>
          <h1 style={{ 
            margin: 0, 
            fontSize: '16px', 
            textAlign: 'center',
            flex: 1,
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap'
          }}>
            {metricName}
          </h1>
          <div style={{ width: '50px' }}></div>
        </div>

        {/* Calendar Grid */}
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(12, 1fr)', 
          gap: '4px',
          flex: 1,
          overflow: 'hidden',
          alignContent: 'stretch'
        }}>
          {MONTHS.map((month, monthIndex) => (
            <div key={month} style={{ 
              display: 'flex', 
              flexDirection: 'column',
              alignItems: 'center',
              minHeight: 0,
              height: '100%'
            }}>
              <div style={{ 
                fontSize: '10px', 
                fontWeight: 'bold', 
                marginBottom: '4px',
                height: '12px',
                flexShrink: 0
              }}>
                {month}
              </div>
              <div style={{ 
                display: 'flex', 
                flexDirection: 'column',
                justifyContent: 'space-evenly',
                alignItems: 'center',
                flex: 1,
                height: '100%',
                overflow: 'hidden'
              }}>
                {renderDaysForMonth(monthIndex, true)}
              </div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  // Landscape/Desktop Layout - Months as rows, days as columns
  return (
    <div style={{ 
      padding: '10px', 
      height: '100vh', 
      display: 'flex', 
      flexDirection: 'column',
      overflow: 'hidden'
    }}>
      {/* Header */}
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        marginBottom: '15px' 
      }}>
        <button
          onClick={onBack}
          style={{
            background: '#2196F3',
            color: 'white',
            border: 'none',
            padding: '8px 12px',
            borderRadius: '5px',
            cursor: 'pointer',
            fontSize: '14px'
          }}
        >
          ← Back to Metrics
        </button>
        <h1 style={{ margin: 0, fontSize: '20px' }}>{metricName} - {currentYear}</h1>
        <div></div>
      </div>

      {/* Calendar Grid - Horizontal layout */}
      <div style={{ 
        flex: 1,
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column'
      }}>
        {MONTHS.map((month, monthIndex) => (
          <div key={month} style={{ 
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            height: `${100/12}%`,
            minHeight: '40px'
          }}>
            <div style={{ 
              fontSize: '14px', 
              fontWeight: 'bold',
              minWidth: '35px',
              textAlign: 'right'
            }}>
              {month}
            </div>
            <div style={{ 
              display: 'flex',
              justifyContent: 'space-evenly',
              alignItems: 'center',
              flex: 1,
              height: '100%'
            }}>
              {renderDaysForMonth(monthIndex, false)}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}