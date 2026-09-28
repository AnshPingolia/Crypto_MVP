import type { Finding, TraceGraph, TraceGraphEdge } from '../../lib/api/cases.api'
import { truncateAddress, evidenceBadgeClass, breakpointReasonText } from './graphUtils'

export type Selection =
  | { type: 'node'; address: string }
  | { type: 'edge'; edge: TraceGraphEdge }
  | null

interface EvidencePanelProps {
  graph: TraceGraph
  findings: Finding[]
  selection: Selection
}

export default function EvidencePanel({ graph, findings, selection }: EvidencePanelProps) {
  if (!selection) {
    return (
      <div className="inv-card">
        <h3>Wallet / transfer details</h3>
        <p className="inv-empty-panel">Click a wallet or a transfer line in the graph to see its full details here.</p>
      </div>
    )
  }

  if (selection.type === 'edge') {
    const e = selection.edge
    return (
      <div className="inv-card">
        <h3>Transfer details</h3>
        <div className="inv-field">
          <div className="inv-field-label">Transaction hash</div>
          <div className="inv-field-value mono">{e.hash}</div>
        </div>
        <div className="inv-field">
          <div className="inv-field-label">From</div>
          <div className="inv-field-value mono">{e.from_address}</div>
        </div>
        <div className="inv-field">
          <div className="inv-field-label">To</div>
          <div className="inv-field-value mono">{e.to_address}</div>
        </div>
        <div className="inv-field">
          <div className="inv-field-label">Amount</div>
          <div className="inv-field-value">{e.amount}</div>
        </div>
      </div>
    )
  }

  const node = graph.nodes.find((n) => n.address === selection.address)
  const finding = findings.find((f) => f.address === selection.address)
  const breakpoint = graph.breakpoints.find((b) => b.address === selection.address)
  const incoming = graph.edges.filter((e) => e.to_address === selection.address)
  const outgoing = graph.edges.filter((e) => e.from_address === selection.address)

  if (!node) {
    return (
      <div className="inv-card">
        <h3>Wallet details</h3>
        <p className="inv-empty-panel">This address was selected but is not present in the trace graph.</p>
      </div>
    )
  }

  return (
    <div className="inv-card">
      <h3>Wallet details</h3>
      <div className="inv-field">
        <div className="inv-field-label">Address</div>
        <div className="inv-field-value mono">{node.address}</div>
      </div>
      <div className="inv-field">
        <div className="inv-field-label">Hop distance from origin</div>
        <div className="inv-field-value">{node.hop_distance === 0 ? 'Origin wallet' : `${node.hop_distance} hop(s)`}</div>
      </div>
      {(node.label || finding?.category) && (
        <div className="inv-field">
          <div className="inv-field-label">Category / label</div>
          <div className="inv-field-value">{node.label ?? finding?.category}</div>
        </div>
      )}
      {finding && (
        <>
          <div className="inv-field">
            <div className="inv-field-label">Evidence level</div>
            <span className={evidenceBadgeClass(finding.evidence_level)}>{finding.evidence_level}</span>
          </div>
          <div className="inv-field">
            <div className="inv-field-label">Reasoning</div>
            <div className="inv-field-value">{finding.reasoning}</div>
          </div>
          {finding.contradicting_evidence && (
            <div className="inv-contradicting">
              <strong>Contradicting evidence:</strong> {finding.contradicting_evidence}
            </div>
          )}
        </>
      )}
      {breakpoint && (
        <div className="inv-field" style={{ marginTop: 12 }}>
          <div className="inv-field-label">Breakpoint</div>
          <div className="inv-field-value" style={{ color: 'var(--feedback-warning)' }}>
            {breakpointReasonText(breakpoint.reason)}
          </div>
        </div>
      )}
      {(incoming.length > 0 || outgoing.length > 0) && (
        <div className="inv-field" style={{ marginTop: 12 }}>
          <div className="inv-field-label">Related transfers</div>
          <div className="inv-findings-list">
            {incoming.map((e) => (
              <div key={e.hash} className="inv-finding-row">
                <span>← from {truncateAddress(e.from_address)}</span>
                <span>{e.amount}</span>
              </div>
            ))}
            {outgoing.map((e) => (
              <div key={e.hash} className="inv-finding-row">
                <span>→ to {truncateAddress(e.to_address)}</span>
                <span>{e.amount}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
