export default function Footer() {
  return (
    <footer 
      role="contentinfo"
      style={{
        backgroundColor: '#081E33',
        color: '#FFFFFF',
        padding: '48px 24px 24px',
        borderTop: '1px solid rgba(255, 255, 255, 0.1)'
      }}
    >
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', 
          gap: '40px',
          marginBottom: '40px'
        }}>
          <div>
            <h3 style={{ 
              fontSize: '16px', 
              fontWeight: 600, 
              marginBottom: '16px',
              color: '#FFFFFF',
              margin: '0 0 16px 0'
            }}>
              Crypto Fraud Tracer
            </h3>
            <p style={{ 
              fontSize: '14px', 
              lineHeight: '1.6',
              color: 'rgba(255, 255, 255, 0.7)',
              margin: 0
            }}>
              Government investigation platform for tracing cryptocurrency fraud and identifying fund flows.
            </p>
          </div>
          
          <div>
            <h3 style={{ 
              fontSize: '14px', 
              fontWeight: 600, 
              marginBottom: '16px',
              color: 'rgba(255, 255, 255, 0.9)',
              textTransform: 'uppercase',
              letterSpacing: '0.5px',
              margin: '0 0 16px 0'
            }}>
              Quick Links
            </h3>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
              <li style={{ marginBottom: '12px' }}>
                <a 
                  href="/" 
                  style={{ 
                    textDecoration: 'none', 
                    color: 'rgba(255, 255, 255, 0.7)',
                    fontSize: '14px',
                    transition: 'color 0.2s'
                  }}
                  onMouseEnter={(e) => e.target.style.color = '#1677FF'}
                  onMouseLeave={(e) => e.target.style.color = 'rgba(255, 255, 255, 0.7)'}
                >
                  Submit New Case
                </a>
              </li>
              <li style={{ marginBottom: '12px' }}>
                <a 
                  href="/dashboard" 
                  style={{ 
                    textDecoration: 'none', 
                    color: 'rgba(255, 255, 255, 0.7)',
                    fontSize: '14px',
                    transition: 'color 0.2s'
                  }}
                  onMouseEnter={(e) => e.target.style.color = '#1677FF'}
                  onMouseLeave={(e) => e.target.style.color = 'rgba(255, 255, 255, 0.7)'}
                >
                  View Dashboard
                </a>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 style={{ 
              fontSize: '14px', 
              fontWeight: 600, 
              marginBottom: '16px',
              color: 'rgba(255, 255, 255, 0.9)',
              textTransform: 'uppercase',
              letterSpacing: '0.5px',
              margin: '0 0 16px 0'
            }}>
              Resources
            </h3>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
              <li style={{ marginBottom: '12px' }}>
                <a 
                  href="#" 
                  style={{ 
                    textDecoration: 'none', 
                    color: 'rgba(255, 255, 255, 0.7)',
                    fontSize: '14px',
                    transition: 'color 0.2s'
                  }}
                  onMouseEnter={(e) => e.target.style.color = '#1677FF'}
                  onMouseLeave={(e) => e.target.style.color = 'rgba(255, 255, 255, 0.7)'}
                >
                  User Guide
                </a>
              </li>
              <li style={{ marginBottom: '12px' }}>
                <a 
                  href="#" 
                  style={{ 
                    textDecoration: 'none', 
                    color: 'rgba(255, 255, 255, 0.7)',
                    fontSize: '14px',
                    transition: 'color 0.2s'
                  }}
                  onMouseEnter={(e) => e.target.style.color = '#1677FF'}
                  onMouseLeave={(e) => e.target.style.color = 'rgba(255, 255, 255, 0.7)'}
                >
                  Privacy Policy
                </a>
              </li>
              <li style={{ marginBottom: '12px' }}>
                <a 
                  href="#" 
                  style={{ 
                    textDecoration: 'none', 
                    color: 'rgba(255, 255, 255, 0.7)',
                    fontSize: '14px',
                    transition: 'color 0.2s'
                  }}
                  onMouseEnter={(e) => e.target.style.color = '#1677FF'}
                  onMouseLeave={(e) => e.target.style.color = 'rgba(255, 255, 255, 0.7)'}
                >
                  Terms of Service
                </a>
              </li>
            </ul>
          </div>
        </div>
        
        <div style={{ 
          paddingTop: '24px', 
          borderTop: '1px solid rgba(255, 255, 255, 0.1)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '16px'
        }}>
          <p style={{ 
            fontSize: '13px', 
            color: 'rgba(255, 255, 255, 0.5)',
            margin: 0
          }}>
            © 2024 Government of India. All rights reserved.
          </p>
          <p style={{ 
            fontSize: '13px', 
            color: 'rgba(255, 255, 255, 0.5)',
            margin: 0
          }}>
            Built with UX4G Design System
          </p>
        </div>
      </div>
    </footer>
  )
}
