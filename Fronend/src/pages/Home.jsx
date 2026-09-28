import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import TronWeb from 'tronweb'
import Header from '../components/Header'
import Footer from '../components/Footer'
import { submitCase, fetchCases } from '../lib/mock/cases.mock'

const schema = z.object({
  address: z.string()
    .min(1, 'Wallet address is required')
    .min(10, 'Wallet address must be at least 10 characters')
    .max(100, 'Wallet address must not exceed 100 characters')
    .refine((address) => {
      try {
        return TronWeb.utils.isAddress(address)
      } catch (e) {
        return false
      }
    }, 'Invalid TRON wallet address'),
  chain: z.literal('TRON', {
    errorMap: () => ({ message: 'TRON blockchain must be selected' })
  }),
  notes: z.string().max(500, 'Notes must not exceed 500 characters').optional()
})

export default function Home() {
  const navigate = useNavigate()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState(null)
  const [submitSuccess, setSubmitSuccess] = useState(false)
  const [recentCases, setRecentCases] = useState([])
  const [loadingCases, setLoadingCases] = useState(true)

  const {
    register,
    handleSubmit,
    formState: { errors, isDirty },
    reset
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      address: '',
      chain: '',
      notes: ''
    }
  })

  useEffect(() => {
    loadRecentCases()
  }, [])

  const loadRecentCases = async () => {
    setLoadingCases(true)
    try {
      const data = await fetchCases()
      setRecentCases(data.slice(0, 3)) // Show only 3 most recent
    } catch (err) {
      console.error('Failed to load recent cases')
    } finally {
      setLoadingCases(false)
    }
  }

  const onSubmit = async (data) => {
    setIsSubmitting(true)
    setSubmitError(null)
    setSubmitSuccess(false)

    try {
      const newCase = await submitCase(data.address, data.chain, data.notes)
      setSubmitSuccess(true)
      reset()
      
      // Reload recent cases
      await loadRecentCases()
      
      // Navigate to dashboard after success
      setTimeout(() => {
        navigate('/dashboard')
      }, 2000)
    } catch (error) {
      setSubmitError('Failed to submit case. Please try again.')
    } finally {
      setIsSubmitting(false)
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
      
      {/* Hero Section */}
      <section 
        id="main-content"
        style={{
          backgroundColor: '#0B2A4A',
          color: '#FFFFFF',
          padding: '80px 24px',
          minHeight: '400px',
          display: 'flex',
          alignItems: 'center'
        }}
      >
        <div style={{ maxWidth: '1200px', margin: '0 auto', width: '100%' }}>
          <div style={{ 
            maxWidth: '600px',
            marginBottom: '48px'
          }}>
            <h1 style={{ 
              fontSize: '48px', 
              fontWeight: 700, 
              marginBottom: '16px',
              color: '#FFFFFF',
              lineHeight: 1.2,
              letterSpacing: '-1px'
            }}>
              Track Cryptocurrency Fraud
            </h1>
            <p style={{ 
              fontSize: '18px', 
              lineHeight: '1.6',
              color: 'rgba(255, 255, 255, 0.8)',
              marginBottom: '24px'
            }}>
              Submit a wallet address and our investigation platform will trace the transaction flow to help identify where stolen funds went.
            </p>
            <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
              <div style={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: '8px',
                color: 'rgba(255, 255, 255, 0.7)',
                fontSize: '14px'
              }}>
                <span style={{ color: '#00A6A6' }}>✓</span> TRON Supported
              </div>
              <div style={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: '8px',
                color: 'rgba(255, 255, 255, 0.7)',
                fontSize: '14px'
              }}>
                <span style={{ color: '#00A6A6' }}>✓</span> Secure Analysis
              </div>
              <div style={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: '8px',
                color: 'rgba(255, 255, 255, 0.7)',
                fontSize: '14px'
              }}>
                <span style={{ color: '#00A6A6' }}>✓</span> Government Platform
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Submit Form Section */}
      <section style={{
        backgroundColor: '#FFFFFF',
        padding: '64px 24px',
        borderBottom: '1px solid #E5E7EB'
      }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <div style={{ 
            maxWidth: '600px',
            margin: '0 auto'
          }}>
            <div style={{ marginBottom: '32px', textAlign: 'center' }}>
              <h2 style={{ 
                fontSize: '28px', 
                fontWeight: 600, 
                marginBottom: '12px',
                color: '#172B4D'
              }}>
                Submit a New Case
              </h2>
              <p style={{ 
                fontSize: '16px', 
                color: '#5E6C84',
                lineHeight: '1.5'
              }}>
                Enter the wallet address involved in the fraud incident
              </p>
            </div>

            {submitSuccess && (
              <div 
                role="alert" 
                aria-live="polite"
                style={{
                  backgroundColor: '#DCFCE7',
                  color: '#166534',
                  padding: '16px',
                  borderRadius: '8px',
                  marginBottom: '24px',
                  border: '1px solid #166534',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px'
                }}
              >
                <span style={{ fontSize: '20px' }}>✓</span>
                <span>Case submitted successfully! Redirecting to dashboard...</span>
              </div>
            )}

            {submitError && (
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
                  alignItems: 'center',
                  gap: '12px'
                }}
              >
                <span style={{ fontSize: '20px' }}>✕</span>
                <span>{submitError}</span>
              </div>
            )}

            <form onSubmit={handleSubmit(onSubmit)} style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
              <div>
                <label 
                  htmlFor="address" 
                  style={{ 
                    display: 'block', 
                    fontSize: '14px', 
                    fontWeight: 600, 
                    marginBottom: '8px',
                    color: '#172B4D'
                  }}
                >
                  Wallet Address <span style={{ color: '#991B1B' }}>*</span>
                </label>
                <input
                  id="address"
                  type="text"
                  {...register('address')}
                  aria-invalid={!!errors.address}
                  aria-describedby={errors.address ? 'address-error' : undefined}
                  disabled={isSubmitting}
                  style={{
                    width: '100%',
                    padding: '14px 16px',
                    fontSize: '16px',
                    border: errors.address ? '2px solid #991B1B' : '1px solid #D1D5DB',
                    borderRadius: '8px',
                    backgroundColor: '#FFFFFF',
                    color: '#172B4D',
                    outline: 'none',
                    transition: 'border-color 0.2s, box-shadow 0.2s',
                    fontFamily: 'monospace'
                  }}
                  placeholder="Enter wallet address (e.g., T9yD14Nj9j7xAB4dbGeiX9hjkepx6BVviT)"
                  onFocus={(e) => {
                    if (!errors.address) {
                      e.target.style.borderColor = '#1677FF'
                      e.target.style.boxShadow = '0 0 0 3px rgba(22, 119, 255, 0.1)'
                    }
                  }}
                  onBlur={(e) => {
                    if (!errors.address) {
                      e.target.style.borderColor = '#D1D5DB'
                      e.target.style.boxShadow = 'none'
                    }
                  }}
                />
                {errors.address && (
                  <p 
                    id="address-error" 
                    role="alert"
                    style={{ 
                      marginTop: '8px', 
                      fontSize: '14px', 
                      color: '#991B1B',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px'
                    }}
                  >
                    <span>⚠</span>
                    {errors.address.message}
                  </p>
                )}
              </div>

              <div>
                <label 
                  htmlFor="chain" 
                  style={{ 
                    display: 'block', 
                    fontSize: '14px', 
                    fontWeight: 600, 
                    marginBottom: '8px',
                    color: '#172B4D'
                  }}
                >
                  Blockchain <span style={{ color: '#991B1B' }}>*</span>
                </label>
                <select
                  id="chain"
                  {...register('chain')}
                  aria-invalid={!!errors.chain}
                  aria-describedby={errors.chain ? 'chain-error' : undefined}
                  disabled={isSubmitting}
                  style={{
                    width: '100%',
                    padding: '14px 16px',
                    fontSize: '16px',
                    border: errors.chain ? '2px solid #991B1B' : '1px solid #D1D5DB',
                    borderRadius: '8px',
                    backgroundColor: '#FFFFFF',
                    color: '#172B4D',
                    outline: 'none',
                    transition: 'border-color 0.2s, box-shadow 0.2s',
                    cursor: 'pointer'
                  }}
                  onFocus={(e) => {
                    if (!errors.chain) {
                      e.target.style.borderColor = '#1677FF'
                      e.target.style.boxShadow = '0 0 0 3px rgba(22, 119, 255, 0.1)'
                    }
                  }}
                  onBlur={(e) => {
                    if (!errors.chain) {
                      e.target.style.borderColor = '#D1D5DB'
                      e.target.style.boxShadow = 'none'
                    }
                  }}
                >
                  <option value="">Select blockchain</option>
                  <option value="TRON">TRON</option>
                </select>
                {errors.chain && (
                  <p 
                    id="chain-error" 
                    role="alert"
                    style={{ 
                      marginTop: '8px', 
                      fontSize: '14px', 
                      color: '#991B1B',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px'
                    }}
                  >
                    <span>⚠</span>
                    {errors.chain.message}
                  </p>
                )}
              </div>

              <div>
                <label 
                  htmlFor="notes" 
                  style={{ 
                    display: 'block', 
                    fontSize: '14px', 
                    fontWeight: 600, 
                    marginBottom: '8px',
                    color: '#172B4D'
                  }}
                >
                  Incident Notes (Optional)
                </label>
                <textarea
                  id="notes"
                  {...register('notes')}
                  rows={4}
                  disabled={isSubmitting}
                  style={{
                    width: '100%',
                    padding: '14px 16px',
                    fontSize: '16px',
                    border: '1px solid #D1D5DB',
                    borderRadius: '8px',
                    backgroundColor: '#FFFFFF',
                    color: '#172B4D',
                    outline: 'none',
                    resize: 'vertical',
                    fontFamily: 'inherit',
                    transition: 'border-color 0.2s, box-shadow 0.2s'
                  }}
                  placeholder="Provide any additional context about the incident (e.g., amount lost, timeframe, related transactions)"
                  onFocus={(e) => {
                    e.target.style.borderColor = '#1677FF'
                    e.target.style.boxShadow = '0 0 0 3px rgba(22, 119, 255, 0.1)'
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = '#D1D5DB'
                    e.target.style.boxShadow = 'none'
                  }}
                />
                <p style={{ 
                  marginTop: '8px', 
                  fontSize: '13px', 
                  color: '#5E6C84' 
                }}>
                  Maximum 500 characters
                </p>
              </div>

              <button
                type="submit"
                disabled={isSubmitting || !isDirty}
                style={{
                  padding: '16px 32px',
                  fontSize: '16px',
                  fontWeight: 600,
                  backgroundColor: isSubmitting || !isDirty ? '#9CA3AF' : '#1677FF',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  cursor: isSubmitting || !isDirty ? 'not-allowed' : 'pointer',
                  opacity: isSubmitting || !isDirty ? 0.7 : 1,
                  transition: 'background-color 0.2s, transform 0.1s',
                  boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)'
                }}
                onMouseEnter={(e) => {
                  if (!isSubmitting && isDirty) {
                    e.target.style.backgroundColor = '#0D5FD8'
                    e.target.style.transform = 'translateY(-1px)'
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isSubmitting && isDirty) {
                    e.target.style.backgroundColor = '#1677FF'
                    e.target.style.transform = 'translateY(0)'
                  }
                }}
              >
                {isSubmitting ? 'Submitting...' : 'Submit Case'}
              </button>
            </form>
          </div>
        </div>
      </section>

      {/* Recent Cases Section */}
      <section style={{
        backgroundColor: '#F8F9FA',
        padding: '64px 24px'
      }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <div style={{ marginBottom: '32px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
            <div>
              <p style={{ 
                fontSize: '12px', 
                fontWeight: 600, 
                textTransform: 'uppercase',
                letterSpacing: '1px',
                color: '#1677FF',
                marginBottom: '8px'
              }}>
                Recent Activity
              </p>
              <h2 style={{ 
                fontSize: '28px', 
                fontWeight: 600, 
                color: '#172B4D',
                margin: 0
              }}>
                Recent Cases
              </h2>
            </div>
            <button
              onClick={() => navigate('/dashboard')}
              style={{
                padding: '12px 24px',
                fontSize: '14px',
                fontWeight: 600,
                backgroundColor: '#0B2A4A',
                color: 'white',
                border: 'none',
                borderRadius: '6px',
                cursor: 'pointer',
                transition: 'background-color 0.2s'
              }}
              onMouseEnter={(e) => e.target.style.backgroundColor = '#081E33'}
              onMouseLeave={(e) => e.target.style.backgroundColor = '#0B2A4A'}
            >
              View All Cases →
            </button>
          </div>

          {loadingCases ? (
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
              <p style={{ color: '#5E6C84' }}>Loading recent cases...</p>
            </div>
          ) : recentCases.length === 0 ? (
            <div 
              style={{
                textAlign: 'center',
                padding: '48px 24px',
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
            </div>
          ) : (
            <div style={{ 
              display: 'grid', 
              gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', 
              gap: '24px'
            }}>
              {recentCases.map((caseItem) => (
                <div 
                  key={caseItem.case_id}
                  onClick={() => navigate(`/case/${caseItem.case_id}`)}
                  style={{
                    backgroundColor: '#FFFFFF',
                    padding: '24px',
                    borderRadius: '8px',
                    border: '1px solid #E5E7EB',
                    cursor: 'pointer',
                    transition: 'transform 0.2s, box-shadow 0.2s',
                    boxShadow: '0 1px 3px rgba(0, 0, 0, 0.05)'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-2px)'
                    e.currentTarget.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.1)'
                    e.currentTarget.style.borderColor = '#1677FF'
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)'
                    e.currentTarget.style.boxShadow = '0 1px 3px rgba(0, 0, 0, 0.05)'
                    e.currentTarget.style.borderColor = '#E5E7EB'
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
                    <div>
                      <h3 style={{ 
                        fontSize: '16px', 
                        fontWeight: 600, 
                        marginBottom: '4px',
                        color: '#172B4D',
                        margin: 0
                      }}>
                        {caseItem.case_id}
                      </h3>
                      <p style={{ 
                        fontSize: '13px', 
                        color: '#5E6C84',
                        margin: 0
                      }}>
                        {formatDate(caseItem.submitted_at)}
                      </p>
                    </div>
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
                  </div>
                  
                  <div style={{ marginBottom: '12px' }}>
                    <p style={{ 
                      fontSize: '12px', 
                      fontWeight: 600, 
                      marginBottom: '4px',
                      color: '#5E6C84',
                      textTransform: 'uppercase',
                      letterSpacing: '0.5px',
                      margin: '0 0 4px 0'
                    }}>
                      Wallet Address
                    </p>
                    <p style={{ 
                      fontSize: '14px', 
                      color: '#172B4D',
                      fontFamily: 'monospace',
                      margin: 0,
                      wordBreak: 'break-all'
                    }}>
                      {truncateAddress(caseItem.address)}
                    </p>
                  </div>
                  
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <p style={{ 
                      fontSize: '13px', 
                      color: '#5E6C84',
                      margin: 0
                    }}>
                      {caseItem.chain}
                    </p>
                    <span style={{ 
                      fontSize: '14px', 
                      color: '#1677FF',
                      fontWeight: 500
                    }}>
                      View Details →
                    </span>
                  </div>
                </div>
              ))}
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
