import { useState, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import Header from '../components/Header'
import Footer from '../components/Footer'
import { getCaseById } from '../lib/mock/cases.mock'
import InvestigationPanel from '../components/graph/InvestigationPanel'

export default function CaseDetail() {
  const { caseId } = useParams()
  const navigate = useNavigate()
  const [caseData, setCaseData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    loadCase()
  }, [caseId])

  const loadCase = async () => {
    setLoading(true)
    setError(null)
    try {
      const data = await getCaseById(caseId)
      if (!data) {
        setError('Case not found')
      } else {
        setCaseData(data)
      }
    } catch (err) {
      setError('Failed to load case details')
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

  const formatDate = (isoString) => {
    if (!isoString) return 'Not provided'
    const date = new Date(isoString)
    if (Number.isNaN(date.getTime())) return 'Not provided'
    return date.toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
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
      
      {/* Breadcrumb Section */}
      <section 
        id="main-content"
        style={{
          backgroundColor: '#FFFFFF',
          padding: '24px 24px',
          borderBottom: '1px solid #E5E7EB'
        }}
      >
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <nav aria-label="Breadcrumb">
            <Link 
              to="/dashboard" 
              style={{ 
                textDecoration: 'none', 
                color: '#1677FF',
                fontSize: '14px',
                fontWeight: 500,
                display: 'inline-flex',
                alignItems: 'center',
                gap: '4px'
              }}
            >
              ← Back to Dashboard
            </Link>
          </nav>
        </div>
      </section>

      {/* Case Header Section */}
      <section style={{
        backgroundColor: '#FFFFFF',
        padding: '48px 24px',
        borderBottom: '1px solid #E5E7EB'
      }}>
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
              Case Details
            </p>
            <h1 style={{ 
              fontSize: '36px', 
              fontWeight: 700, 
              marginBottom: '8px',
              color: '#172B4D',
              margin: '0 0 8px 0'
            }}>
              {loading ? 'Loading...' : error ? 'Error' : caseData?.case_id}
            </h1>
          </div>
        </div>
      </section>

      {/* Case Content Section */}
      <section style={{
        backgroundColor: '#F8F9FA',
        padding: '48px 24px'
      }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
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
              <p style={{ color: '#5E6C84' }}>Loading case details...</p>
            </div>
          ) : error ? (
            <div 
              style={{
                textAlign: 'center',
                padding: '64px 24px',
                backgroundColor: '#FFFFFF',
                borderRadius: '8px',
                border: '1px solid #E5E7EB'
              }}
            >
              <div style={{ fontSize: '48px', marginBottom: '16px' }}>❌</div>
              <h3 style={{ fontSize: '20px', fontWeight: 600, marginBottom: '8px', color: '#172B4D' }}>
                {error}
              </h3>
              <p style={{ fontSize: '16px', color: '#5E6C84', marginBottom: '24px' }}>
                The case you're looking for doesn't exist or may have been removed.
              </p>
              <button
                onClick={() => navigate('/dashboard')}
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
                Return to Dashboard
              </button>
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '24px' }}>
              {/* Case Information Card */}
              <div style={{
                backgroundColor: '#FFFFFF',
                padding: '32px',
                borderRadius: '8px',
                border: '1px solid #E5E7EB',
                boxShadow: '0 1px 3px rgba(0, 0, 0, 0.05)'
              }}>
                <h2 style={{ 
                  fontSize: '20px', 
                  fontWeight: 600, 
                  marginBottom: '24px',
                  color: '#172B4D',
                  paddingBottom: '16px',
                  borderBottom: '1px solid #E5E7EB'
                }}>
                  Case Information
                </h2>
                
                <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                  <div>
                    <p style={{ 
                      fontSize: '12px', 
                      fontWeight: 600, 
                      marginBottom: '6px',
                      color: '#5E6C84',
                      textTransform: 'uppercase',
                      letterSpacing: '0.5px'
                    }}>
                      Case ID
                    </p>
                    <p style={{ 
                      fontSize: '16px', 
                      color: '#172B4D',
                      fontFamily: 'monospace',
                      fontWeight: 600,
                      margin: 0
                    }}>
                      {caseData.case_id}
                    </p>
                  </div>

                  <div>
                    <p style={{ 
                      fontSize: '12px', 
                      fontWeight: 600, 
                      marginBottom: '6px',
                      color: '#5E6C84',
                      textTransform: 'uppercase',
                      letterSpacing: '0.5px'
                    }}>
                      Wallet Address
                    </p>
                    <p style={{ 
                      fontSize: '16px', 
                      color: '#172B4D',
                      fontFamily: 'monospace',
                      margin: 0,
                      wordBreak: 'break-all'
                    }}>
                      {caseData.address}
                    </p>
                  </div>

                  <div>
                    <p style={{ 
                      fontSize: '12px', 
                      fontWeight: 600, 
                      marginBottom: '6px',
                      color: '#5E6C84',
                      textTransform: 'uppercase',
                      letterSpacing: '0.5px'
                    }}>
                      Blockchain
                    </p>
                    <p style={{ 
                      fontSize: '16px', 
                      color: '#172B4D',
                      fontWeight: 500,
                      margin: 0
                    }}>
                      {caseData.chain}
                    </p>
                  </div>

                  <div>
                    <p style={{ 
                      fontSize: '12px', 
                      fontWeight: 600, 
                      marginBottom: '6px',
                      color: '#5E6C84',
                      textTransform: 'uppercase',
                      letterSpacing: '0.5px'
                    }}>
                      Status
                    </p>
                    <span 
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '4px',
                        padding: '6px 16px',
                        fontSize: '14px',
                        fontWeight: 600,
                        borderRadius: '12px',
                        ...getStatusColor(caseData.status)
                      }}
                    >
                      <span>{getStatusColor(caseData.status).icon}</span>
                      {caseData.status}
                    </span>
                  </div>

                  <div>
                    <p style={{ 
                      fontSize: '12px', 
                      fontWeight: 600, 
                      marginBottom: '6px',
                      color: '#5E6C84',
                      textTransform: 'uppercase',
                      letterSpacing: '0.5px'
                    }}>
                      Submitted At
                    </p>
                    <p style={{ 
                      fontSize: '16px', 
                      color: '#172B4D',
                      margin: 0
                    }}>
                      {formatDate(caseData.submitted_at)}
                    </p>
                  </div>
                </div>
              </div>

              {/* Fund trace investigation — graph, evidence panel, sealed report */}
              <div style={{
                backgroundColor: '#FFFFFF',
                padding: '32px',
                borderRadius: '8px',
                border: '1px solid #E5E7EB',
                boxShadow: '0 1px 3px rgba(0, 0, 0, 0.05)'
              }}>
                <InvestigationPanel caseId={caseData.case_id} />
              </div>
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
