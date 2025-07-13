'use client'
import Link from 'next/link'

export default function LandingPage() {
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
        padding: '60px',
        textAlign: 'center',
        boxShadow: '0 20px 40px rgba(0,0,0,0.1)',
        maxWidth: '600px',
        width: '100%'
      }}>
        {/* Logo */}
        <div style={{ marginBottom: '30px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '15px' }}>
            <div style={{ display: 'flex', gap: '8px', marginRight: '15px' }}>
              <div style={{
                width: '20px',
                height: '20px',
                borderRadius: '50%',
                background: '#4CAF50'
              }} />
              <div style={{
                width: '20px',
                height: '20px',
                borderRadius: '50%',
                background: '#f44336'
              }} />
              <div style={{
                width: '20px',
                height: '20px',
                borderRadius: '50%',
                background: '#9E9E9E'
              }} />
            </div>
            <h1 style={{
              fontSize: '36px',
              fontWeight: '700',
              color: '#2c3e50',
              margin: '0',
              letterSpacing: '-1px'
            }}>
              Habitly
            </h1>
          </div>
        </div>
           {/* CTA Buttons */}
        <div style={{ display: 'flex', gap: '15px', justifyContent: 'center', flexWrap: 'wrap' }}>
          <Link href="/auth/signup">
            <button style={{
              background: 'linear-gradient(135deg, #4CAF50, #45a049)',
              color: 'white',
              padding: '15px 30px',
              border: 'none',
              borderRadius: '8px',
              fontSize: '16px',
              fontWeight: '600',
              cursor: 'pointer',
              transition: 'transform 0.2s'
            }}>
              Get Started Free
            </button>
          </Link>
          <Link href="/auth/signin">
            <button style={{
              background: 'transparent',
              color: '#667eea',
              padding: '15px 30px',
              border: '2px solid #667eea',
              borderRadius: '8px',
              fontSize: '16px',
              fontWeight: '600',
              cursor: 'pointer',
              transition: 'all 0.2s'
            }}>
              Sign In
            </button>
          </Link>
        </div>
        {/* Tagline */}
        <p style={{
          fontSize: '18px',
          color: '#7f8c8d',
          margin: '15px 0 40px 0',
          fontWeight: '400'
        }}>
          Simple habits, lasting change
        </p>
        
        {/* Demo Grid */}
        <div style={{
          margin: '40px 0',
          padding: '20px',
          background: '#f8f9fa',
          borderRadius: '12px'
        }}>
          <h3 style={{ marginTop: '0', color: '#2c3e50', fontSize: '18px' }}>
            Your year at a glance
          </h3>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(7, 1fr)',
            gap: '4px',
            maxWidth: '200px',
            margin: '0 auto'
          }}>
            {Array.from({ length: 21 }, (_, i) => (
              <div
                key={i}
                style={{
                  width: '16px',
                  height: '16px',
                  borderRadius: '50%',
                  margin: '2px',
                  background: i % 3 === 0 ? '#4CAF50' : i % 4 === 0 ? '#f44336' : '#4CAF50'
                }}
              />
            ))}
          </div>
        </div>
        
        {/* Features */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
          gap: '20px',
          margin: '40px 0',
          fontSize: '14px'
        }}>
          <div style={{ padding: '15px', background: '#f8f9fa', borderRadius: '8px' }}>
            <div style={{ fontSize: '20px', marginBottom: '8px' }}>📊</div>
            <h4 style={{ margin: '5px 0', color: '#2c3e50' }}>Visual Progress</h4>
            <p style={{ margin: '0', color: '#7f8c8d', fontSize: '12px' }}>
              See your entire year of habits in one grid
            </p>
          </div>
          <div style={{ padding: '15px', background: '#f8f9fa', borderRadius: '8px' }}>
            <div style={{ fontSize: '20px', marginBottom: '8px' }}>⚡</div>
            <h4 style={{ margin: '5px 0', color: '#2c3e50' }}>Simple Tracking</h4>
            <p style={{ margin: '0', color: '#7f8c8d', fontSize: '12px' }}>
              Three clicks: Yes, No, or Not Done
            </p>
          </div>
          <div style={{ padding: '15px', background: '#f8f9fa', borderRadius: '8px' }}>
            <div style={{ fontSize: '20px', marginBottom: '8px' }}>🎯</div>
            <h4 style={{ margin: '5px 0', color: '#2c3e50' }}>Build Streaks</h4>
            <p style={{ margin: '0', color: '#7f8c8d', fontSize: '12px' }}>
              Spot patterns and stay consistent
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}