import { useMemo, useCallback } from 'react'
import ReactFlow, {
  Background,
  Controls,
  MiniMap,
  type Edge,
  type Node,
  MarkerType,
  ReactFlowProvider
} from 'reactflow'
import dagre from 'dagre'
import 'reactflow/dist/style.css'
import WalletNode, { type WalletNodeData } from './WalletNode'
import type { Finding, TraceGraph, TraceGraphEdge } from '../../lib/api/cases.api'

const nodeTypes = { walletNode: WalletNode }

interface TraceGraphViewProps {
  graph: TraceGraph
  findings: Finding[]
  onSelectNode: (address: string) => void
  onSelectEdge: (edge: TraceGraphEdge) => void
}

function layout(nodes: Node<WalletNodeData>[], edges: Edge[]) {
  const g = new dagre.graphlib.Graph()
  g.setDefaultEdgeLabel(() => ({}))
  g.setGraph({ rankdir: 'LR', nodesep: 50, ranksep: 130 })

  nodes.forEach((n) => g.setNode(n.id, { width: 200, height: 80 }))
  edges.forEach((e) => g.setEdge(e.source, e.target))

  dagre.layout(g)

  return nodes.map((n) => {
    const pos = g.node(n.id)
    return {
      ...n,
      position: { x: pos ? pos.x - 100 : 0, y: pos ? pos.y - 40 : 0 }
    }
  })
}

function TraceGraphViewInner({ graph, findings, onSelectNode, onSelectEdge }: TraceGraphViewProps) {
  const findingsByAddress = useMemo(() => {
    const map = new Map<string, Finding>()
    findings.forEach((f) => map.set(f.address, f))
    return map
  }, [findings])

  const breakpointsByAddress = useMemo(() => {
    const map = new Map<string, TraceGraph['breakpoints'][number]>()
    graph.breakpoints.forEach((b) => map.set(b.address, b))
    return map
  }, [graph.breakpoints])

  const { flowNodes, flowEdges } = useMemo(() => {
    const rawNodes: Node<WalletNodeData>[] = graph.nodes.map((n) => {
      const f = findingsByAddress.get(n.address)
      const bp = breakpointsByAddress.get(n.address)
      return {
        id: n.address,
        type: 'walletNode',
        position: { x: 0, y: 0 },
        data: {
          address: n.address,
          hop_distance: n.hop_distance,
          isOrigin: n.hop_distance === 0,
          category: n.label ?? f?.category ?? null,
          evidenceLevel: f?.evidence_level ?? null,
          breakpointReason: bp?.reason ?? null
        }
      }
    })

    const rawEdges: Edge[] = graph.edges.map((e) => ({
      id: e.hash,
      source: e.from_address,
      target: e.to_address,
      label: e.amount,
      animated: false,
      markerEnd: { type: MarkerType.ArrowClosed },
      style: { stroke: '#5E6C84' },
      labelStyle: { fontSize: 11, fill: '#172B4D', fontWeight: 600 },
      labelBgStyle: { fill: '#FFFFFF' }
    }))

    return { flowNodes: layout(rawNodes, rawEdges), flowEdges: rawEdges }
  }, [graph, findingsByAddress, breakpointsByAddress])

  const handleNodeClick = useCallback(
    (_: unknown, n: Node) => onSelectNode(n.id),
    [onSelectNode]
  )

  const handleEdgeClick = useCallback(
    (_: unknown, e: Edge) => {
      const original = graph.edges.find((ge) => ge.hash === e.id)
      if (original) onSelectEdge(original)
    },
    [graph.edges, onSelectEdge]
  )

  if (graph.nodes.length === 0) {
    return (
      <div className="inv-state">
        <div style={{ fontSize: 40 }}>🕸️</div>
        <h3 style={{ margin: 0 }}>No trace graph produced</h3>
        <p style={{ margin: 0, color: 'var(--text-secondary)' }}>
          The backend returned an empty graph for this case — no wallet nodes to display.
        </p>
      </div>
    )
  }

  return (
    <div className="inv-graph-shell">
      <ReactFlow
        nodes={flowNodes}
        edges={flowEdges}
        nodeTypes={nodeTypes}
        onNodeClick={handleNodeClick}
        onEdgeClick={handleEdgeClick}
        fitView
        fitViewOptions={{ padding: 0.2 }}
        minZoom={0.15}
        maxZoom={2}
        proOptions={{ hideAttribution: true }}
      >
        <Background gap={20} />
        <Controls />
        {flowNodes.length > 12 && <MiniMap pannable zoomable />}
      </ReactFlow>
    </div>
  )
}

// Wrapped in its own provider so this component can be dropped anywhere
// (e.g. inside CaseDetail's existing layout) without the parent needing
// to know about React Flow's context requirements.
export default function TraceGraphView(props: TraceGraphViewProps) {
  return (
    <ReactFlowProvider>
      <TraceGraphViewInner {...props} />
    </ReactFlowProvider>
  )
}
