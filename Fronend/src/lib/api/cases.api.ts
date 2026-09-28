import type { CaseStatus } from '../../types/case'

export interface BackendCase {
  case_id: string
  wallet_address: string
  chain: string
  status: string
}

export interface NormalizedTransaction {
  hash: string
  from_address: string
  to_address: string
  amount: string
  asset: string
  asset_contract: string | null
  time: string
  raw_value: string
  decimals: number
}

// ---------- Trace graph / investigation types ----------
// Mirrors models.py exactly (Parth's tracer.py output, read-only reference).
// Do not rename these fields -- they must match the backend response verbatim.

export type BreakpointReason = 'max_hops' | 'no_outgoing' | 'window_exceeded'

export interface TraceGraphNode {
  address: string
  label: string | null
  hop_distance: number
}

export interface TraceGraphEdge {
  from_address: string
  to_address: string
  amount: string
  hash: string
}

export interface Breakpoint {
  address: string
  reason: BreakpointReason
}

export interface TraceGraph {
  case_id: string
  nodes: TraceGraphNode[]
  edges: TraceGraphEdge[]
  breakpoints: Breakpoint[]
}

export type EvidenceLevel = 'Weak' | 'Moderate' | 'Strong' | 'Unresolved'

export interface Finding {
  address: string
  category: string
  evidence_level: EvidenceLevel
  reasoning: string
  contradicting_evidence: string | null
}

export interface ReportResponse {
  case_id: string
  graph: TraceGraph
  findings: Finding[]
  primary_conclusion: string
  overall_evidence_level: EvidenceLevel
  sealed_at: string
  report_hash: string
}

const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000').replace(/\/$/, '')

async function request<T>(path: string, options?: RequestInit): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    headers: {
      'Content-Type': 'application/json',
      ...(options?.headers || {})
    },
    ...options
  })

  if (!response.ok) {
    let message = `Request failed (${response.status})`
    try {
      const body = await response.json() as { detail?: string | Array<{ msg?: string }> }
      if (typeof body.detail === 'string') {
        message = body.detail
      } else if (Array.isArray(body.detail) && body.detail[0]?.msg) {
        message = body.detail[0].msg
      }
    } catch {
      // Keep the generic message when the backend does not return JSON.
    }
    throw new Error(message)
  }

  if (response.status === 204) {
    return undefined as T
  }

  return response.json() as Promise<T>
}

export function createCaseId(): string {
  const year = new Date().getFullYear()
  const random = Math.random().toString(36).slice(2, 8).toUpperCase()
  return `CASE-${year}-${random}`
}

export async function createBackendCase(address: string, chain: string): Promise<BackendCase> {
  return request<BackendCase>('/cases', {
    method: 'POST',
    body: JSON.stringify({
      case_id: createCaseId(),
      wallet_address: address,
      chain,
      status: 'In Progress'
    })
  })
}

export async function listBackendCases(): Promise<BackendCase[]> {
  return request<BackendCase[]>('/cases')
}

export async function fetchBackendTransfers(caseId: string): Promise<NormalizedTransaction[]> {
  return request<NormalizedTransaction[]>(`/cases/${encodeURIComponent(caseId)}/transfers`)
}

export async function traceBackendCase(caseId: string): Promise<ReportResponse> {
  return request<ReportResponse>(`/cases/${encodeURIComponent(caseId)}/trace`, {
    method: 'POST'
  })
}

export function toFrontendStatus(status: string): CaseStatus {
  return status as CaseStatus
}
