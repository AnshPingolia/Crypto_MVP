import { Link, useLocation } from 'react-router-dom'

export default function Header() {
  const location = useLocation()
  
  return (
    <header 
      role="banner" 
      style={{
        backgroundColor: '#0B2A4A',
        color: '#FFFFFF',
        borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
        position: 'sticky',
        top: 0,
        zIndex: 1000,
        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)'
      }}
    >
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 24px', height: '64px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Link to="/" style={{ textDecoration: 'none', color: 'inherit', display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{ 
            width: '32px', 
            height: '32px', 
            backgroundColor: '#1677FF', 
            borderRadius: '6px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '18px',
            fontWeight: 700
          }}>
            🔍
          </div>
          <h1 style={{ fontSize: '20px', fontWeight: 600, margin: 0, color: 'inherit', letterSpacing: '-0.5px' }}>
            Crypto Fraud Tracer
          </h1>
        </Link>
        
        <nav role="navigation" aria-label="Main navigation">
          <ul style={{ display: 'flex', gap: '32px', listStyle: 'none', margin: 0, padding: 0, alignItems: 'center' }}>
            <li>
              <Link 
                to="/" 
                style={{ 
                  textDecoration: 'none', 
                  color: location.pathname === '/' ? '#1677FF' : 'rgba(255, 255, 255, 0.8)',
                  fontSize: '15px',
                  fontWeight: 500,
                  transition: 'color 0.2s',
                  position: 'relative',
                  padding: '8px 12px',
                  borderRadius: '4px'
                }}
                onFocus={(e) => e.target.style.backgroundColor = 'rgba(255, 255, 255, 0.1)'}
                onBlur={(e) => e.target.style.backgroundColor = 'transparent'}
              >
                Home
                {location.pathname === '/' && (
                  <span style={{
                    position: 'absolute',
                    bottom: '-20px',
                    left: 0,
                    right: 0,
                    height: '2px',
                    backgroundColor: '#1677FF'
                  }} />
                )}
              </Link>
            </li>
            <li>
              <Link 
                to="/dashboard" 
                style={{ 
                  textDecoration: 'none', 
                  color: location.pathname === '/dashboard' ? '#1677FF' : 'rgba(255, 255, 255, 0.8)',
                  fontSize: '15px',
                  fontWeight: 500,
                  transition: 'color 0.2s',
                  position: 'relative',
                  padding: '8px 12px',
                  borderRadius: '4px'
                }}
                onFocus={(e) => e.target.style.backgroundColor = 'rgba(255, 255, 255, 0.1)'}
                onBlur={(e) => e.target.style.backgroundColor = 'transparent'}
              >
                Dashboard
                {location.pathname === '/dashboard' && (
                  <span style={{
                    position: 'absolute',
                    bottom: '-20px',
                    left: 0,
                    right: 0,
                    height: '2px',
                    backgroundColor: '#1677FF'
                  }} />
                )}
              </Link>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  )
}
