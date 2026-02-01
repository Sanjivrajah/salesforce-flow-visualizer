export interface FlowNode {
  id: string;
  type: 'start' | 'decision' | 'actionCall' | 'recordLookup' | 'recordUpdate' | 'recordCreate' | 'screen' | 'assignment' | 'loop' | 'subflow' | 'default';
  label: string;
  data: any;
}

export interface FlowEdge {
  id: string;
  source: string;
  target: string;
  label?: string;
}

export interface FlowDiagramData {
  nodes: FlowNode[];
  edges: FlowEdge[];
}
