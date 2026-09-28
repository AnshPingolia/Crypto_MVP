import { useState, useCallback } from 'react'
import TraceGraphView from './TraceGraphView'
import EvidencePanel, { type Selection } from './EvidencePanel'
import ReportSummary from './ReportSummary'
import { traceBackendCase, type ReportResponse, type TraceGraphEdge } from '../../lib/api/cases.api'
import { getMockReport } from '../../lib/mock/trace.mock'
import './graph.css'

const useBackend = import.meta.env.VITE_DATA_SOURCE === 'backend'

type Status = 'idle' | 'loading' | 'error' | 'success'

interface InvestigationPanelProps {
  caseId: string
}

export default function InvestigationPanel({ caseId }: InvestigationPanelProps) {
  const [status, setStatus] = useState<Status>('idle')
  const [report, setReport] = useState<ReportResponse | null>(null)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [selection, setSelection] = useState<Selection>(null)

  const runInvestigation = useCallback(async () => {
    setStatus('loading')
    setErrorMessage(null)
    setSelection(null)
    try {
      const result = useBackend ? await traceBackendCase(caseId) : await getMockReport(caseId)
      setReport(result)
      setStatus('success')
    } catch (err) {
      // Never let a failure here produce a blank screen -- fall into the
      // explicit error state so the investigator always sees what happened.
      setErrorMessage(err instanceof Error ? err.message : 'The investigation could not be completed.')
      setStatus('error')
    }
  }, [caseId])

  const handleSelectNode = useCallback((address: string) => {
    setSelection({ type: 'node', address })
  }, [])

  const handleSelectEdge = useCallback((edge: TraceGraphEdge) => {
    setSelection({ type: 'edge', edge })
  }, [])

  return (
    <div className="inv-panel">
      <div className="inv-run-bar">
        <div>
          <h2 style={{ margin: 0, fontSize: 20, fontWeight: 700, color: 'var(--text-primary)' }}>
            Fund trace investigation
          </h2>
          <p style={{ margin: '4px 0 0', color: 'var(--text-secondary)', fontSize: 14 }}>
            {useBackend
              ? 'Runs the real backend pipeline: fetch → BFS trace → classify → sealed report.'
              : 'Demo mode — showing a mock investigation with the same structure as a real report.'}
          </p>
        </div>
        <button
          className="inv-run-btn"
          onClick={runInvestigation}
          disabled={status === 'loading'}
        >
          {status === 'loading' ? 'Running investigation…' : status === 'success' ? 'Re-run investigation' : 'Run investigation'}
        </button>
      </div>

      {status === 'idle' && (
        <div className="inv-state">
          <div style={{ fontSize: 40 }}>🔍</div>
          <h3 style={{ margin: 0 }}>No investigation run yet</h3>
          <p style={{ margin: 0, color: 'var(--text-secondary)' }}>
            Press "Run investigation" to trace this wallet and build the fund-flow graph.
          </p>
        </div>
      )}

      {status === 'loading' && (
        <div className="inv-state">
          <div className="inv-spinner" />
          <p style={{ margin: 0, color: 'var(--text-secondary)' }}>
            Tracing fund movement — this can take a moment on a real backend.
          </p>
        </div>
      )}

      {status === 'error' && (
        <div className="inv-state error">
          <div style={{ fontSize: 40 }}>❌</div>
          <h3 style={{ margin: 0 }}>Investigation failed</h3>
          <p style={{ margin: 0 }}>{errorMessage}</p>
          <button className="inv-run-btn" onClick={runInvestigation}>Try again</button>
        </div>
      )}

      {status === 'success' && report && (
        <>
          <TraceGraphView
            graph={report.graph}
            findings={report.findings}
            onSelectNode={handleSelectNode}
            onSelectEdge={handleSelectEdge}
          />
          <div className="inv-panel-grid">
            <EvidencePanel graph={report.graph} findings={report.findings} selection={selection} />
            <ReportSummary report={report} />
          </div>
        </>
      )}
    </div>
  )
}
