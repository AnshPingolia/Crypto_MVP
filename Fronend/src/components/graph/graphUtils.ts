import type { BreakpointReason, EvidenceLevel } from '../../lib/api/cases.api'

export function truncateAddress(address: string, head = 6, tail = 4): string {
  if (!address) return ''
  if (address.length <= head + tail + 3) return address
  return `${address.slice(0, head)}...${address.slice(-tail)}`
}

export function evidenceBadgeClass(level: EvidenceLevel | undefined | null): string {
  switch (level) {
    case 'Weak': return 'inv-badge weak'
    case 'Moderate': return 'inv-badge moderate'
    case 'Strong': return 'inv-badge strong'
    case 'Unresolved':
    default: return 'inv-badge unresolved'
  }
}

export function breakpointReasonText(reason: BreakpointReason): string {
  switch (reason) {
    case 'max_hops':
      return 'Tracing stopped — reached the maximum trace depth.'
    case 'no_outgoing':
      return 'Tracing stopped — no further outgoing transfers found.'
    case 'window_exceeded':
      return 'Tracing stopped — remaining transfers fall outside the trace window.'
    default:
      return 'Tracing stopped here.'
  }
}

export function formatIsoDate(iso: string | null | undefined): string {
  if (!iso) return 'Not provided'
  const date = new Date(iso)
  if (Number.isNaN(date.getTime())) return 'Not provided'
  return date.toLocaleString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}
