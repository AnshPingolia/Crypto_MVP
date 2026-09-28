import type {
  Breakpoint,
  EvidenceLevel,
  Finding,
  ReportResponse,
  TraceGraph,
  TraceGraphEdge,
  TraceGraphNode
} from '../api/cases.api'

/**
 * TRACE / INVESTIGATION MOCK DATA
 *
 * Every object here follows the exact same shape as the real backend
 * Report (see models.py: Case, TraceGraph, TraceGraphNode, TraceGraphEdge,
 * Breakpoint, Finding, Report). Field names are not renamed anywhere --
 * the graph UI consumes mock and backend data through one identical path.
 *
 * Each mock case_id below maps to a different test scenario so the
 * investigation flow can be exercised without a real backend:
 *   CASE-2024-001  normal multi-hop branching trace
 *   CASE-2024-002  resolved, single strong match, short trace
 *   CASE-2024-003  breakpoint-heavy trace (max_hops / no_outgoing / window_exceeded)
 *   CASE-2024-004  one-node graph (origin has no outgoing transfers at all)
 *   CASE-2024-005  large graph (stress-tests layout + performance)
 *   (fallback)     unresolved finding, contradicting evidence present
 */

function node(address: string, hop_distance: number, label: string | null = null): TraceGraphNode {
  return { address, label, hop_distance }
}

function edge(from_address: string, to_address: string, amount: string, hash: string): TraceGraphEdge {
  return { from_address, to_address, amount, hash }
}

function bp(address: string, reason: Breakpoint['reason']): Breakpoint {
  return { address, reason }
}

function finding(
  address: string,
  category: string,
  evidence_level: EvidenceLevel,
  reasoning: string,
  contradicting_evidence: string | null = null
): Finding {
  return { address, category, evidence_level, reasoning, contradicting_evidence }
}

function sealedReport(graph: TraceGraph, findings: Finding[], primary_conclusion: string, overall_evidence_level: EvidenceLevel): ReportResponse {
  return {
    case_id: graph.case_id,
    graph,
    findings,
    primary_conclusion,
    overall_evidence_level,
    sealed_at: new Date().toISOString(),
    // Mock hash — visually identical in shape to a real SHA256 hex digest,
    // clearly not a real cryptographic seal (this is mock data, not a real report).
    report_hash: 'mock' + Array.from({ length: 58 }, () => Math.floor(Math.random() * 16).toString(16)).join('')
  }
}

const ORIGIN = 'T9yD14Nj9j7xAB4dbGeiX9hjkepx6BVviT'

function branchingScenario(): ReportResponse {
  const a = 'TAbc1D2ef3Gh4Ij5Kl6Mn7Op8Qr9St0Uv1'
  const b = 'TBcd2E3fg4Hi5Jk6Lm7No8Pq9Rs0Tu1Vw2'
  const c = 'TCde3F4gh5Ij6Kl7Mn8Op9Qr0St1Uv2Wx3'
  const d = 'TDef4G5hi6Jk7Lm8No9Pq0Rs1Tu2Vw3Xy4'
  const exchange = 'TEXCHANGEbinanceHOTWALLET0000001'
  const mixer = 'TMIXERunknownPOOLcontract00000002'

  const nodes = [
    node(ORIGIN, 0),
    node(a, 1),
    node(b, 1),
    node(c, 2),
    node(d, 2),
    node(exchange, 3, 'Binance hot wallet'),
    node(mixer, 3, 'Known mixer contract')
  ]
  const edges = [
    edge(ORIGIN, a, '4200.50', '0xhash001'),
    edge(ORIGIN, b, '1800.00', '0xhash002'),
    edge(a, c, '2100.25', '0xhash003'),
    edge(a, d, '2000.00', '0xhash004'),
    edge(b, exchange, '1800.00', '0xhash005'),
    edge(c, mixer, '2100.25', '0xhash006')
  ]
  const breakpoints = [bp(d, 'no_outgoing'), bp(mixer, 'max_hops')]
  const graph: TraceGraph = { case_id: 'CASE-2024-001', nodes, edges, breakpoints }
  const findings = [
    finding(ORIGIN, 'victim wallet', 'Strong', 'Submitted origin address, confirmed by incident report.'),
    finding(a, 'unrecognized wallet', 'Unresolved', 'No known label; behaves as a simple pass-through.'),
    finding(b, 'unrecognized wallet', 'Unresolved', 'No known label; single outgoing transfer.'),
    finding(c, 'unrecognized wallet', 'Weak', 'Fan-out pattern to one known-mixer-adjacent address.'),
    finding(d, 'unrecognized wallet', 'Unresolved', 'Trail ends here; no further outgoing transfers found.'),
    finding(exchange, 'known exchange', 'Strong', 'Matches Binance hot wallet in seed label dataset.'),
    finding(
      mixer,
      'known mixer',
      'Moderate',
      'Matches a known mixer contract; consolidation pattern also observed.',
      'One direct transfer only — consolidation evidence is based on a single hop, not a repeated pattern.'
    )
  ]
  return sealedReport(
    graph,
    findings,
    'Funds split across two paths; one path traced to a known exchange (Binance), the other to a known mixer contract.',
    'Strong'
  )
}

function shortResolvedScenario(): ReportResponse {
  const exchange = 'TEXCHANGEokxHOTWALLET000000000003'
  const nodes = [node(ORIGIN, 0), node(exchange, 1, 'OKX hot wallet')]
  const edges = [edge(ORIGIN, exchange, '9800.00', '0xhash101')]
  const graph: TraceGraph = { case_id: 'CASE-2024-002', nodes, edges, breakpoints: [] }
  const findings = [
    finding(ORIGIN, 'victim wallet', 'Strong', 'Submitted origin address.'),
    finding(exchange, 'known exchange', 'Strong', 'Direct match against OKX hot wallet in seed label dataset.')
  ]
  return sealedReport(graph, findings, 'Funds moved directly to a known exchange in a single hop.', 'Strong')
}

function breakpointHeavyScenario(): ReportResponse {
  const a = 'TBreak1AAAAAAAAAAAAAAAAAAAAAAAAAAA1'
  const b = 'TBreak2BBBBBBBBBBBBBBBBBBBBBBBBBBB2'
  const c = 'TBreak3CCCCCCCCCCCCCCCCCCCCCCCCCCC3'
  const nodes = [node(ORIGIN, 0), node(a, 1), node(b, 1), node(c, 2)]
  const edges = [
    edge(ORIGIN, a, '500.00', '0xhash201'),
    edge(ORIGIN, b, '300.00', '0xhash202'),
    edge(a, c, '500.00', '0xhash203')
  ]
  const breakpoints = [
    bp(b, 'no_outgoing'),
    bp(c, 'window_exceeded')
  ]
  const graph: TraceGraph = { case_id: 'CASE-2024-003', nodes, edges, breakpoints }
  const findings = [
    finding(ORIGIN, 'victim wallet', 'Strong', 'Submitted origin address.'),
    finding(a, 'unrecognized wallet', 'Unresolved', 'No known label.'),
    finding(b, 'unrecognized wallet', 'Unresolved', 'Trail ends here; no further outgoing transfers found.'),
    finding(c, 'unrecognized wallet', 'Unresolved', 'Remaining transfers fall outside the 90-day trace window.')
  ]
  return sealedReport(
    graph,
    findings,
    'Trail stopped on both branches — one wallet has no further outgoing activity, the other only has transfers outside the trace window.',
    'Unresolved'
  )
}

function oneNodeScenario(): ReportResponse {
  const nodes = [node(ORIGIN, 0)]
  const graph: TraceGraph = { case_id: 'CASE-2024-004', nodes, edges: [], breakpoints: [bp(ORIGIN, 'no_outgoing')] }
  const findings = [
    finding(ORIGIN, 'victim wallet', 'Unresolved', 'No outgoing transfers found for this address at all.')
  ]
  return sealedReport(graph, findings, 'No outgoing transfers were found for this wallet — the trail could not begin.', 'Unresolved')
}

function largeGraphScenario(): ReportResponse {
  const nodes: TraceGraphNode[] = [node(ORIGIN, 0)]
  const edges: TraceGraphEdge[] = []
  const breakpoints: Breakpoint[] = []
  const findings: Finding[] = [finding(ORIGIN, 'victim wallet', 'Strong', 'Submitted origin address.')]

  let prevLayer = [ORIGIN]
  for (let hop = 1; hop <= 4; hop++) {
    const nextLayer: string[] = []
    for (const parent of prevLayer) {
      const branchCount = hop <= 2 ? 3 : 2
      for (let i = 0; i < branchCount; i++) {
        const addr = `TLarge${hop}_${parent.slice(-4)}_${i}`.padEnd(34, '0')
        nodes.push(node(addr, hop))
        edges.push(edge(parent, addr, (Math.random() * 1000).toFixed(2), `0xhash${hop}${parent.slice(-3)}${i}`))
        nextLayer.push(addr)
        if (hop === 4) {
          breakpoints.push(bp(addr, 'max_hops'))
          findings.push(finding(addr, 'unrecognized wallet', 'Unresolved', 'Maximum trace depth reached.'))
        } else {
          findings.push(finding(addr, 'unrecognized wallet', 'Weak', 'Behavioral pattern only, no direct label match.'))
        }
      }
    }
    prevLayer = nextLayer
  }

  const graph: TraceGraph = { case_id: 'CASE-2024-005', nodes, edges, breakpoints }
  return sealedReport(graph, findings, `Funds fanned out across ${nodes.length - 1} wallets over 4 hops before the trace boundary was reached.`, 'Weak')
}

const scenarios: Record<string, () => ReportResponse> = {
  'CASE-2024-001': branchingScenario,
  'CASE-2024-002': shortResolvedScenario,
  'CASE-2024-003': breakpointHeavyScenario,
  'CASE-2024-004': oneNodeScenario,
  'CASE-2024-005': largeGraphScenario
}

/**
 * Returns a mock Report for a given case_id, matching the real backend's
 * POST /cases/{case_id}/trace response shape exactly. Simulates network
 * latency so loading states are actually visible and testable.
 */
export async function getMockReport(caseId: string): Promise<ReportResponse> {
  await new Promise((resolve) => setTimeout(resolve, 700))
  const scenario = scenarios[caseId]
  if (scenario) return scenario()
  // Any other case id (e.g. a freshly submitted one) falls back to the
  // branching scenario so every new case still has something to show.
  return branchingScenario()
}
