import { Case } from '../../types/case'
import {
  createBackendCase,
  fetchBackendTransfers,
  listBackendCases,
  traceBackendCase,
  toFrontendStatus,
  NormalizedTransaction,
  ReportResponse
} from '../api/cases.api'

/**
 * CASE DATA LAYER
 *
 * One interface is used by the pages whether the app is running with mock data
 * or the real backend.
 *
 * Set VITE_DATA_SOURCE=backend to use the FastAPI backend.
 * Leave it unset (or set it to mock) to keep the local demo data.
 */

const useBackend = import.meta.env.VITE_DATA_SOURCE === 'backend'
const submittedAtStorageKey = 'crypto-fraud-tracer-submitted-at'

export const mockCases: Case[] = [
  {
    case_id: 'CASE-2024-001',
    address: 'T9yD14Nj9j7xAB4dbGeiX9hjkepx6BVviT',
    chain: 'TRON',
    status: 'In Progress',
    submitted_at: '2024-01-15T09:30:00Z'
  },
  {
    case_id: 'CASE-2024-002',
    address: 'TD7XgV9F8fK4B2j3A5n6m8p1q2r4s6t8u0w2x4y6z8',
    chain: 'TRON',
    status: 'Resolved',
    submitted_at: '2024-01-14T14:22:00Z'
  },
  {
    case_id: 'CASE-2024-003',
    address: 'TYh3z4K6f8m2n5p9q1r3s5t7u9w0x2y4z6a8b0c2d4',
    chain: 'TRON',
    status: 'Breakpoint',
    submitted_at: '2024-01-13T11:45:00Z'
  },
  {
    case_id: 'CASE-2024-004',
    address: 'TG9s2d4f6g8h0j2k4l6m8n0p2q4r6s8t0u2v4w6x8',
    chain: 'TRON',
    status: 'In Progress',
    submitted_at: '2024-01-12T16:10:00Z'
  },
  {
    case_id: 'CASE-2024-005',
    address: 'TX7b1c3d5e7f9g1h3j5k7l9m1n3o5p7q9r1s3t5u7',
    chain: 'TRON',
    status: 'Resolved',
    submitted_at: '2024-01-11T08:55:00Z'
  }
]

function readSubmittedAtMap(): Record<string, string> {
  try {
    return JSON.parse(localStorage.getItem(submittedAtStorageKey) || '{}') as Record<string, string>
  } catch {
    return {}
  }
}

function rememberSubmittedAt(caseId: string, submittedAt: string): void {
  const map = readSubmittedAtMap()
  map[caseId] = submittedAt
  localStorage.setItem(submittedAtStorageKey, JSON.stringify(map))
}

function getRememberedSubmittedAt(caseId: string): string {
  return readSubmittedAtMap()[caseId] || ''
}

function mapBackendCase(item: { case_id: string; wallet_address: string; chain: string; status: string }): Case {
  return {
    case_id: item.case_id,
    address: item.wallet_address,
    chain: item.chain,
    status: toFrontendStatus(item.status),
    submitted_at: getRememberedSubmittedAt(item.case_id)
  }
}

const generateCaseId = (): string => {
  const currentYear = new Date().getFullYear()
  const nextNumber = mockCases.length + 1
  return `CASE-${currentYear}-${String(nextNumber).padStart(3, '0')}`
}

export const fetchCases = async (): Promise<Case[]> => {
  if (useBackend) {
    const backendCases = await listBackendCases()
    return backendCases.map(mapBackendCase)
  }

  return new Promise((resolve) => {
    setTimeout(() => resolve([...mockCases]), 500)
  })
}

export const submitCase = async (address: string, chain: string, _notes?: string): Promise<Case> => {
  if (useBackend) {
    const submittedAt = new Date().toISOString()
    const backendCase = await createBackendCase(address, chain)
    rememberSubmittedAt(backendCase.case_id, submittedAt)
    return {
      case_id: backendCase.case_id,
      address: backendCase.wallet_address,
      chain: backendCase.chain,
      status: toFrontendStatus(backendCase.status),
      submitted_at: submittedAt
    }
  }

  return new Promise((resolve) => {
    setTimeout(() => {
      const newCase: Case = {
        case_id: generateCaseId(),
        address,
        chain,
        status: 'In Progress',
        submitted_at: new Date().toISOString()
      }
      mockCases.unshift(newCase)
      resolve(newCase)
    }, 800)
  })
}

export const getCaseById = async (caseId: string): Promise<Case | null> => {
  if (useBackend) {
    // The current backend does not have GET /cases/{case_id}.
    // Fetch the case list and select the requested case instead.
    const backendCases = await listBackendCases()
    const found = backendCases.find((item) => item.case_id === caseId)
    return found ? mapBackendCase(found) : null
  }

  return new Promise((resolve) => {
    setTimeout(() => {
      const foundCase = mockCases.find((c) => c.case_id === caseId)
      resolve(foundCase || null)
    }, 400)
  })
}

export const fetchCaseTransfers = async (caseId: string): Promise<NormalizedTransaction[]> => {
  if (!useBackend) {
    return []
  }
  return fetchBackendTransfers(caseId)
}

export const runCaseTrace = async (caseId: string): Promise<ReportResponse | null> => {
  if (!useBackend) {
    return null
  }
  return traceBackendCase(caseId)
}
