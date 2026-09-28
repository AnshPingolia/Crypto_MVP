import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import Header from '../components/Header'
import Footer from '../components/Footer'
import { fetchCases } from '../lib/mock/cases.mock'

export default function Dashboard() {
  const navigate = useNavigate()
  const [cases, setCases] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    loadCases()
  }, [])

  const loadCases = async () => {
    setLoading(true)
    setError(null)
    try {
      const data = await fetchCases()
      setCases(data)
    } catch (err) {
      setError('Failed to load cases. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'In Progress':
        return {
          backgroundColor: '#E3F2FD',
          color: '#1565C0',
          border: '1px solid #1565C0',
          icon: '⏳'
        }
      case 'Resolved':
        return {
          backgroundColor: '#E8F5E9',
          color: '#2E7D32',
          border: '1px solid #2E7D32',
          icon: '✓'
        }
      case 'Breakpoint':
        return {
          backgroundColor: '#FEF3C7',
          color: '#92400E',
          border: '1px solid #92400E',
          icon: '⚠'
        }
      default:
        return {
          backgroundColor: '#F5F5F5',
          color: '#616161',
          border: '1px solid #616161',
          icon: '?'
        }
    }
  }

  const truncateAddress = (address) => {
    if (address.length <= 20) return address
    return `${address.slice(0, 10)}...${address.slice(-8)}`
  }

  const formatDate = (isoString) => {
    if (!isoString) return 'Not provided'
    const date = new Date(isoString)
    if (Number.isNaN(date.getTime())) return 'Not provided'
    return date.toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    })
  }

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#F5F7FA' }}>
      <a 
        href="#main-content" 
        style={{
          position: 'absolute',
          top: '-40px',
          left: 0,
          background: '#1677FF',
          color: 'white',
          padding: '8px',
          zIndex: 100,
          textDecoration: 'none'
        }}
        onFocus={(e) => e.target.style.top = '0'}
        onBlur={(e) => e.target.style.top = '-40px'}
      >
        Skip to main content
      </a>
      <Header />
      
      {/* Page Header Section */}
      <section 
        id="main-content"
        style={{
          backgroundColor: '#FFFFFF',
          padding: '48px 24px',
          borderBottom: '1px solid #E5E7EB'
        }}
      >
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <div style={{ marginBottom: '16px' }}>
            <p style={{ 
              fontSize: '12px', 
              fontWeight: 600, 
              textTransform: 'uppercase',
              letterSpacing: '1px',
              color: '#1677FF',
              marginBottom: '8px'
            }}>
              Case Management
            </p>
            <h1 style={{ 
              fontSize: '36px', 
              fontWeight: 700, 
              marginBottom: '8px',
              color: '#172B4D',
              margin: '0 0 8px 0'
            }}>
              Case Dashboard
            </h1>
            <p style={{ 
              fontSize: '16px', 
              color: '#5E6C84',
              lineHeight: '1.5',
              margin: 0
            }}>
              View and manage all submitted fraud cases and their investigation status
            </p>
          </div>
          
          <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
            <button
              onClick={() => navigate('/')}
              style={{
                padding: '12px 24px',
                fontSize: '15px',
                fontWeight: 600,
                backgroundColor: '#1677FF',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                cursor: 'pointer',
                transition: 'background-color 0.2s, transform 0.1s',
                boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)'
              }}
              onMouseEnter={(e) => {
                e.target.style.backgroundColor = '#0D5FD8'
                e.target.style.transform = 'translateY(-1px)'
              }}
              onMouseLeave={(e) => {
                e.target.style.backgroundColor = '#1677FF'
                e.target.style.transform = 'translateY(0)'
              }}
            >
              + New Case
            </button>
            <button
              onClick={loadCases}
              style={{
                padding: '12px 24px',
                fontSize: '15px',
                fontWeight: 600,
                backgroundColor: '#FFFFFF',
                color: '#172B4D',
                border: '1px solid #D1D5DB',
                borderRadius: '8px',
                cursor: 'pointer',
                transition: 'background-color 0.2s, transform 0.1s'
              }}
              onMouseEnter={(e) => {
                e.target.style.backgroundColor = '#F8F9FA'
                e.target.style.transform = 'translateY(-1px)'
              }}
              onMouseLeave={(e) => {
                e.target.style.backgroundColor = '#FFFFFF'
                e.target.style.transform = 'translateY(0)'
              }}
            >
              ↻ Refresh
            </button>
          </div>
        </div>
      </section>

      {/* Table Section */}
      <section style={{
        backgroundColor: '#F8F9FA',
        padding: '48px 24px'
      }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          {error && (
            <div 
              role="alert" 
              aria-live="assertive"
              style={{
                backgroundColor: '#FEE2E2',
                color: '#991B1B',
                padding: '16px',
                borderRadius: '8px',
                marginBottom: '24px',
                border: '1px solid #991B1B',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
              }}
            >
              <span style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <span style={{ fontSize: '20px' }}>⚠</span>
                {error}
              </span>
              <button
                onClick={loadCases}
                style={{
                  padding: '8px 16px',
                  fontSize: '14px',
                  fontWeight: 600,
                  backgroundColor: '#991B1B',
                  color: 'white',
                  border: 'none',
                  borderRadius: '6px',
                  cursor: 'pointer'
                }}
              >
                Retry
              </button>
            </div>
          )}

          {loading ? (
            <div style={{ textAlign: 'center', padding: '48px 24px' }}>
              <div 
                style={{
                  width: '40px',
                  height: '40px',
                  border: '4px solid #E5E7EB',
                  borderTop: '4px solid #1677FF',
                  borderRadius: '50%',
                  animation: 'spin 1s linear infinite',
                  margin: '0 auto 16px'
                }}
              />
              <p style={{ color: '#5E6C84' }}>Loading cases...</p>
            </div>
          ) : cases.length === 0 ? (
            <div 
              style={{
                textAlign: 'center',
                padding: '64px 24px',
                backgroundColor: '#FFFFFF',
                borderRadius: '8px',
                border: '1px solid #E5E7EB'
              }}
            >
              <div style={{ fontSize: '48px', marginBottom: '16px' }}>📋</div>
              <h3 style={{ fontSize: '20px', fontWeight: 600, marginBottom: '8px', color: '#172B4D' }}>
                No cases yet
              </h3>
              <p style={{ fontSize: '16px', color: '#5E6C84', marginBottom: '24px' }}>
                Submit your first fraud case to get started
              </p>
              <button
                onClick={() => navigate('/')}
                style={{
                  padding: '12px 24px',
                  fontSize: '15px',
                  fontWeight: 600,
                  backgroundColor: '#1677FF',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  transition: 'background-color 0.2s'
                }}
                onMouseEnter={(e) => e.target.style.backgroundColor = '#0D5FD8'}
                onMouseLeave={(e) => e.target.style.backgroundColor = '#1677FF'}
              >
                Submit First Case
              </button>
            </div>
          ) : (
            <div style={{
              backgroundColor: '#FFFFFF',
              borderRadius: '8px',
              border: '1px solid #E5E7EB',
              overflow: 'hidden',
              boxShadow: '0 1px 3px rgba(0, 0, 0, 0.05)'
            }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ 
                    backgroundColor: '#F8F9FA',
                    borderBottom: '2px solid #E5E7EB'
                  }}>
                    <th style={{ 
                      padding: '16px 24px', 
                      textAlign: 'left', 
                      fontSize: '12px', 
                      fontWeight: 700, 
                      textTransform: 'uppercase',
                      letterSpacing: '0.5px',
                      color: '#172B4D',
                      width: '15%'
                    }}>
                      Case ID
                    </th>
                    <th style={{ 
                      padding: '16px 24px', 
                      textAlign: 'left', 
                      fontSize: '12px', 
                      fontWeight: 700, 
                      textTransform: 'uppercase',
                      letterSpacing: '0.5px',
                      color: '#172B4D',
                      width: '30%'
                    }}>
                      Wallet Address
                    </th>
                    <th style={{ 
                      padding: '16px 24px', 
                      textAlign: 'left', 
                      fontSize: '12px', 
                      fontWeight: 700, 
                      textTransform: 'uppercase',
                      letterSpacing: '0.5px',
                      color: '#172B4D',
                      width: '10%'
                    }}>
                      Chain
                    </th>
                    <th style={{ 
                      padding: '16px 24px', 
                      textAlign: 'left', 
                      fontSize: '12px', 
                      fontWeight: 700, 
                      textTransform: 'uppercase',
                      letterSpacing: '0.5px',
                      color: '#172B4D',
                      width: '15%'
                    }}>
                      Status
                    </th>
                    <th style={{ 
                      padding: '16px 24px', 
                      textAlign: 'left', 
                      fontSize: '12px', 
                      fontWeight: 700, 
                      textTransform: 'uppercase',
                      letterSpacing: '0.5px',
                      color: '#172B4D',
                      width: '15%'
                    }}>
                      Submitted
                    </th>
                    <th style={{ 
                      padding: '16px 24px', 
                      textAlign: 'left', 
                      fontSize: '12px', 
                      fontWeight: 700, 
                      textTransform: 'uppercase',
                      letterSpacing: '0.5px',
                      color: '#172B4D',
                      width: '15%'
                    }}>
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {cases.map((caseItem) => (
                    <tr 
                      key={caseItem.case_id}
                      onClick={() => navigate(`/case/${caseItem.case_id}`)}
                      style={{ 
                        borderBottom: '1px solid #E5E7EB',
                        cursor: 'pointer',
                        transition: 'background-color 0.2s'
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor = '#F8F9FA'
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = '#FFFFFF'
                      }}
                    >
                      <td style={{ 
                        padding: '16px 24px', 
                        fontSize: '14px', 
                        fontWeight: 600, 
                        color: '#172B4D',
                        fontFamily: 'monospace'
                      }}>
                        {caseItem.case_id}
                      </td>
                      <td style={{ 
                        padding: '16px 24px', 
                        fontSize: '14px', 
                        color: '#172B4D',
                        fontFamily: 'monospace'
                      }}>
                        {truncateAddress(caseItem.address)}
                      </td>
                      <td style={{ 
                        padding: '16px 24px', 
                        fontSize: '14px', 
                        color: '#5E6C84',
                        fontWeight: 500
                      }}>
                        {caseItem.chain}
                      </td>
                      <td style={{ padding: '16px 24px' }}>
                        <span 
                          style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '4px',
                            padding: '4px 12px',
                            fontSize: '12px',
                            fontWeight: 600,
                            borderRadius: '12px',
                            ...getStatusColor(caseItem.status)
                          }}
                        >
                          <span>{getStatusColor(caseItem.status).icon}</span>
                          {caseItem.status}
                        </span>
                      </td>
                      <td style={{ 
                        padding: '16px 24px', 
                        fontSize: '14px', 
                        color: '#5E6C84'
                      }}>
                        {formatDate(caseItem.submitted_at)}
                      </td>
                      <td style={{ padding: '16px 24px' }}>
                        <button
                          onClick={(e) => {
                            e.stopPropagation()
                            navigate(`/case/${caseItem.case_id}`)
                          }}
                          style={{
                            padding: '8px 16px',
                            fontSize: '13px',
                            fontWeight: 600,
                            backgroundColor: '#1677FF',
                            color: 'white',
                            border: 'none',
                            borderRadius: '6px',
                            cursor: 'pointer',
                            transition: 'background-color 0.2s'
                          }}
                          onMouseEnter={(e) => e.target.style.backgroundColor = '#0D5FD8'}
                          onMouseLeave={(e) => e.target.style.backgroundColor = '#1677FF'}
                        >
                          View
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </section>

      <Footer />

      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  )
}
