import React, { useEffect, useState, useCallback, memo } from 'react';
import ReactFlow, {
  Node,
  Edge,
  Controls,
  Background,
  MiniMap,
  useNodesState,
  useEdgesState,
  MarkerType,
  Position,
  Handle
} from 'reactflow';
import 'reactflow/dist/style.css';
import { FlowDiagramData } from '../types';
import { getLayoutedElements } from './layoutUtils';
import './styles.css';

// Custom Node Component
const FlowNodeComponent = memo(({ data }: any) => {
  const getNodeColor = (type: string) => {
    const colors: Record<string, string> = {
      start: '#2e844a',
      decision: '#f59e0b',
      actionCall: '#0070d2',
      recordLookup: '#0070d2',
      recordUpdate: '#0070d2',
      recordCreate: '#0070d2',
      screen: '#e83e8c',
      assignment: '#8b5cf6',
      loop: '#f59e0b',
      subflow: '#06b6d4',
      default: '#6b7280'
    };
    return colors[type] || colors.default;
  };

  const getIcon = (type: string) => {
    const icons: Record<string, string> = {
      decision: '\u25c6',
      recordLookup: '\ud83d\udd0d',
      recordUpdate: '\u270f\ufe0f',
      recordCreate: '\u2795',
      assignment: '=',
      loop: '\u21bb',
      screen: '\ud83d\udccb',
      actionCall: '\u26a1',
      start: '\u25b6'
    };
    return icons[type] || '\u2022';
  };

  const bgColor = getNodeColor(data.flowType);
  const isStart = data.flowType === 'start';

  return (
    <div style={{
      backgroundColor: '#fff',
      border: `2px solid ${bgColor}`,
      borderRadius: isStart ? '50%' : '8px',
      minWidth: isStart ? '80px' : '200px',
      maxWidth: '280px',
      padding: isStart ? '0' : '0',
      boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
      fontSize: '12px'
    }}>
      <Handle type="target" position={Position.Top} style={{ background: bgColor }} />
      
      <div style={{
        backgroundColor: bgColor,
        color: '#fff',
        padding: isStart ? '20px 0' : '8px 12px',
        fontWeight: 600,
        borderRadius: isStart ? '50%' : '6px 6px 0 0',
        textAlign: 'center',
        fontSize: isStart ? '14px' : '12px',
        minHeight: isStart ? '80px' : 'auto',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: isStart ? 'column' : 'row',
        gap: '4px'
      }}>
        <span style={{ fontSize: '14px' }}>{getIcon(data.flowType)}</span>
        <span style={{ wordBreak: 'break-word' }}>{data.label}</span>
      </div>
      
      {!isStart && (
        <div style={{ padding: '8px 12px', fontSize: '11px', color: '#333' }}>
          {data.object && (
            <div style={{ marginBottom: '4px' }}>
              <strong>Object:</strong> {data.object}
            </div>
          )}
          {data.actionType && (
            <div style={{ marginBottom: '4px' }}>
              <strong>Action:</strong> {data.actionType}
            </div>
          )}
          {data.queriedFields && data.queriedFields.length > 0 && (
            <div style={{ marginBottom: '4px' }}>
              <strong>Fields:</strong> {data.queriedFields.length} field(s)
            </div>
          )}
          {data.rulesCount > 0 && (
            <div style={{ marginBottom: '4px' }}>
              <strong>Rules:</strong> {data.rulesCount}
            </div>
          )}
          {data.assignmentsCount > 0 && (
            <div style={{ marginBottom: '4px' }}>
              <strong>Assignments:</strong> {data.assignmentsCount}
            </div>
          )}
          {data.fieldsCount > 0 && (
            <div style={{ marginBottom: '4px' }}>
              <strong>Screen Fields:</strong> {data.fieldsCount}
            </div>
          )}
          {data.description && (
            <div style={{ marginTop: '6px', fontSize: '10px', color: '#666', fontStyle: 'italic' }}>
              {data.description}
            </div>
          )}
        </div>
      )}
      
      <Handle type="source" position={Position.Bottom} style={{ background: bgColor }} />
    </div>
  );
});

FlowNodeComponent.displayName = 'FlowNodeComponent';

const nodeTypes = {
  flowNode: FlowNodeComponent
};

export const FlowDiagram: React.FC = () => {
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    console.log('FlowDiagram mounted, setting up message listener');
    
    const messageHandler = (event: MessageEvent) => {
      console.log('Received message:', event.data);
      const message = event.data;

      if (message.command === 'renderFlow') {
        console.log('Processing flow data:', message.data);
        const flowData: FlowDiagramData = message.data;
        processFlowData(flowData);
      }
    };

    window.addEventListener('message', messageHandler);
    console.log('Webview ready, requesting data');

    return () => {
      window.removeEventListener('message', messageHandler);
    };
  }, []);

  const processFlowData = useCallback((flowData: FlowDiagramData) => {
    try {
      console.log('Processing flow data with', flowData.nodes.length, 'nodes');
      
      const reactFlowNodes: Node[] = flowData.nodes.map((node) => ({
        id: node.id,
        type: 'flowNode',
        data: { 
          ...node.data,
          flowType: node.type
        },
        position: { x: 0, y: 0 },
        sourcePosition: Position.Bottom,
        targetPosition: Position.Top
      }));

      console.log('Created', reactFlowNodes.length, 'React Flow nodes');

      const reactFlowEdges: Edge[] = flowData.edges.map((edge) => ({
        id: edge.id,
        source: edge.source,
        target: edge.target,
        label: edge.label,
        type: 'default',
        animated: false,
        markerEnd: {
          type: MarkerType.ArrowClosed,
          width: 20,
          height: 20,
          color: '#94a3b8'
        },
        style: { 
          stroke: '#94a3b8', 
          strokeWidth: 2,
          strokeDasharray: '0'
        },
        labelStyle: { 
          fontSize: 11, 
          fill: '#1e293b', 
          fontWeight: 600 
        },
        labelBgStyle: { 
          fill: '#ffffff', 
          fillOpacity: 1,
          rx: 4,
          ry: 4
        },
        labelBgPadding: [6, 8] as [number, number],
        labelBgBorderRadius: 4
      }));

      console.log('Created', reactFlowEdges.length, 'React Flow edges');

      const { nodes: layoutedNodes, edges: layoutedEdges } = getLayoutedElements(
        reactFlowNodes,
        reactFlowEdges,
        'TB'
      );

      setNodes(layoutedNodes);
      setEdges(layoutedEdges);
      setIsLoading(false);
      
      console.log('Flow diagram updated successfully');
    } catch (error) {
      console.error('Error processing flow data:', error);
      setIsLoading(false);
    }
  }, [setNodes, setEdges]);

  if (isLoading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Waiting for flow data...</p>
      </div>
    );
  }

  return (
    <div style={{ width: '100%', height: '100%', backgroundColor: '#f8fafc' }}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        nodeTypes={nodeTypes}
        fitView
        fitViewOptions={{ padding: 0.2 }}
        attributionPosition="bottom-left"
      >
        <Controls />
        <MiniMap 
          nodeColor={(node) => {
            const colors: Record<string, string> = {
              start: '#2e844a',
              decision: '#f59e0b',
              actionCall: '#0070d2',
              recordLookup: '#0070d2',
              recordUpdate: '#0070d2',
              recordCreate: '#0070d2',
              screen: '#e83e8c',
              assignment: '#8b5cf6',
              loop: '#f59e0b',
              subflow: '#06b6d4',
              default: '#6b7280'
            };
            const flowType = node.data?.flowType || 'default';
            return colors[flowType] || colors.default;
          }}
          maskColor="rgba(0, 0, 0, 0.1)"
        />
        <Background gap={16} size={1} color="#e2e8f0" />
      </ReactFlow>
    </div>
  );
};
