import type { ReportResponse } from '../../lib/api/cases.api'
import { truncateAddress, evidenceBadgeClass, formatIsoDate } from './graphUtils'

interface ReportSummaryProps {
  report: ReportResponse
}

export default function ReportSummary({ report }: ReportSummaryProps) {
  const { graph, findings } = report

  return (
    <div className="inv-card">
      <h3>Investigation report</h3>

      <div className="inv-summary-grid">
        <div className="inv-summary-stat">
          <div className="num">{graph.nodes.length}</div>
          <div className="label">Wallets</div>
        </div>
        <div className="inv-summary-stat">
          <div className="num">{graph.edges.length}</div>
          <div className="label">Transfers</div>
        </div>
        <div className="inv-summary-stat">
          <div className="num">{graph.breakpoints.length}</div>
          <div className="label">Breakpoints</div>
        </div>
      </div>

      <div className="inv-field">
        <div className="inv-field-label">Case ID</div>
        <div className="inv-field-value mono">{report.case_id}</div>
      </div>

      <div className="inv-field">
        <div className="inv-field-label">Overall evidence level</div>
        <span className={evidenceBadgeClass(report.overall_evidence_level)}>{report.overall_evidence_level}</span>
      </div>

      <div className="inv-field">
        <div className="inv-field-label">Primary conclusion</div>
        <div className="inv-field-value">{report.primary_conclusion}</div>
      </div>

      <div className="inv-field">
        <div className="inv-field-label">Sealed at</div>
        <div className="inv-field-value">{formatIsoDate(report.sealed_at)}</div>
      </div>

      <div className="inv-field">
        <div className="inv-field-label">Report hash (SHA256)</div>
        <div className="inv-hash">{report.report_hash}</div>
      </div>

      <div className="inv-field" style={{ marginTop: 16 }}>
        <div className="inv-field-label">Findings ({findings.length})</div>
        <div className="inv-findings-list">
          {findings.map((f) => (
            <div key={f.address} className="inv-finding-row">
              <span className="mono">{truncateAddress(f.address)} — {f.category}</span>
              <span className={evidenceBadgeClass(f.evidence_level)}>{f.evidence_level}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
