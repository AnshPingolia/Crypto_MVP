import { Handle, Position, type NodeProps } from 'reactflow'
import { truncateAddress, evidenceBadgeClass, breakpointReasonText } from './graphUtils'
import type { BreakpointReason, EvidenceLevel } from '../../lib/api/cases.api'

export interface WalletNodeData {
  address: string
  hop_distance: number
  isOrigin: boolean
  category: string | null
  evidenceLevel: EvidenceLevel | null
  breakpointReason: BreakpointReason | null
}

export default function WalletNode({ data, selected }: NodeProps<WalletNodeData>) {
  const isBreakpoint = Boolean(data.breakpointReason)

  const classNames = [
    'inv-node',
    data.isOrigin ? 'origin' : '',
    isBreakpoint ? 'breakpoint' : '',
    selected ? 'selected' : ''
  ].filter(Boolean).join(' ')

  return (
    <div className={classNames}>
      <Handle type="target" position={Position.Left} style={{ opacity: 0 }} />
      <div className="inv-node-address">{truncateAddress(data.address)}</div>
      <div className="inv-node-row">
        <span className="inv-node-hop">{data.isOrigin ? 'Origin wallet' : `Hop ${data.hop_distance}`}</span>
        {data.evidenceLevel && (
          <span className={evidenceBadgeClass(data.evidenceLevel)}>{data.evidenceLevel}</span>
        )}
      </div>
      {data.category && (
        <div className="inv-node-row">
          <span className="inv-node-hop">{data.category}</span>
        </div>
      )}
      {isBreakpoint && data.breakpointReason && (
        <div className="inv-node-breakpoint-tag">⚠ {breakpointReasonText(data.breakpointReason).replace('Tracing stopped — ', '').replace('Tracing stopped here.', 'Trail stopped here')}</div>
      )}
      <Handle type="source" position={Position.Right} style={{ opacity: 0 }} />
    </div>
  )
}
