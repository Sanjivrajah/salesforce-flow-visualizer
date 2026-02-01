import { Node, Edge } from 'reactflow';
import dagre from 'dagre';

/**
 * Automatically layout nodes using Dagre algorithm
 * @param nodes React Flow nodes
 * @param edges React Flow edges
 * @param direction Layout direction ('TB' = top-to-bottom, 'LR' = left-to-right)
 */
export function getLayoutedElements(
  nodes: Node[],
  edges: Edge[],
  direction: 'TB' | 'LR' = 'TB'
): { nodes: Node[]; edges: Edge[] } {
  const dagreGraph = new dagre.graphlib.Graph();
  dagreGraph.setDefaultEdgeLabel(() => ({}));

  const nodeWidth = 280;
  const nodeHeight = 120;

  dagreGraph.setGraph({ 
    rankdir: direction,
    nodesep: 80,
    ranksep: 120,
    marginx: 50,
    marginy: 50,
    align: 'UL'
  });

  // Add nodes to dagre graph
  nodes.forEach((node) => {
    dagreGraph.setNode(node.id, { width: nodeWidth, height: nodeHeight });
  });

  // Add edges to dagre graph
  edges.forEach((edge) => {
    dagreGraph.setEdge(edge.source, edge.target);
  });

  // Calculate layout
  dagre.layout(dagreGraph);

  // Apply calculated positions to nodes
  const layoutedNodes = nodes.map((node) => {
    const nodeWithPosition = dagreGraph.node(node.id);
    
    return {
      ...node,
      position: {
        x: nodeWithPosition.x - nodeWidth / 2,
        y: nodeWithPosition.y - nodeHeight / 2,
      },
    };
  });

  return { nodes: layoutedNodes, edges };
}
