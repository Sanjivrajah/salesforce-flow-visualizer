import { XMLParser } from 'fast-xml-parser';
import { FlowDiagramData, FlowNode, FlowEdge } from './types';

interface FlowMetadata {
  Flow?: {
    start?: {
      locationX?: number;
      locationY?: number;
      connector?: { targetReference?: string };
    };
    decisions?: Array<any> | any;
    actionCalls?: Array<any> | any;
    recordLookups?: Array<any> | any;
    recordUpdates?: Array<any> | any;
    recordCreates?: Array<any> | any;
    screens?: Array<any> | any;
    assignments?: Array<any> | any;
    loops?: Array<any> | any;
    subflows?: Array<any> | any;
  };
}

/**
 * Parses a Salesforce Flow XML document and converts it to React Flow compatible format
 * @param xmlContent The raw XML content from the .flow-meta.xml file
 * @returns FlowDiagramData containing nodes and edges for visualization
 */
export function parseFlowXML(xmlContent: string): FlowDiagramData {
  const parser = new XMLParser({
    ignoreAttributes: false,
    attributeNamePrefix: '@_'
  });

  const result: FlowMetadata = parser.parse(xmlContent);
  const nodes: FlowNode[] = [];
  const edges: FlowEdge[] = [];

  if (!result.Flow) {
    throw new Error('Invalid Flow XML: No Flow element found');
  }

  const flow = result.Flow;

  // Add Start node
  if (flow.start) {
    nodes.push({
      id: 'START',
      type: 'start',
      label: 'Start',
      data: flow.start
    });

    // Add edge from start to first element
    if (flow.start.connector?.targetReference) {
      edges.push({
        id: 'edge-start',
        source: 'START',
        target: flow.start.connector.targetReference
      });
    }
  }

  // Process Decisions
  processElements(flow.decisions, 'decision', nodes, edges, (element) => {
    // Process decision rules and outcomes
    const rules = element.rules ? (Array.isArray(element.rules) ? element.rules : [element.rules]) : [];
    
    rules.forEach((rule: any, index: number) => {
      if (rule?.connector?.targetReference) {
        edges.push({
          id: `edge-${element.name}-rule-${index}`,
          source: element.name,
          target: rule.connector.targetReference,
          label: rule.label || element.defaultConnectorLabel || ''
        });
      }
    });

    // Process default connector
    if (element.defaultConnector?.targetReference) {
      edges.push({
        id: `edge-${element.name}-default`,
        source: element.name,
        target: element.defaultConnector.targetReference,
        label: element.defaultConnectorLabel || 'Default'
      });
    }
  });

  // Process Action Calls
  processElements(flow.actionCalls, 'actionCall', nodes, edges, (element) => {
    addSimpleConnector(element, edges);
  });

  // Process Record Lookups
  processElements(flow.recordLookups, 'recordLookup', nodes, edges, (element) => {
    addSimpleConnector(element, edges);
  });

  // Process Record Updates
  processElements(flow.recordUpdates, 'recordUpdate', nodes, edges, (element) => {
    addSimpleConnector(element, edges);
  });

  // Process Record Creates
  processElements(flow.recordCreates, 'recordCreate', nodes, edges, (element) => {
    addSimpleConnector(element, edges);
  });

  // Process Screens
  processElements(flow.screens, 'screen', nodes, edges, (element) => {
    addSimpleConnector(element, edges);
  });

  // Process Assignments
  processElements(flow.assignments, 'assignment', nodes, edges, (element) => {
    addSimpleConnector(element, edges);
  });

  // Process Loops
  processElements(flow.loops, 'loop', nodes, edges, (element) => {
    // Loops have both nextValueConnector and noMoreValuesConnector
    if (element.nextValueConnector?.targetReference) {
      edges.push({
        id: `edge-${element.name}-next`,
        source: element.name,
        target: element.nextValueConnector.targetReference,
        label: 'For Each Item'
      });
    }
    if (element.noMoreValuesConnector?.targetReference) {
      edges.push({
        id: `edge-${element.name}-done`,
        source: element.name,
        target: element.noMoreValuesConnector.targetReference,
        label: 'After Last Item'
      });
    }
  });

  // Process Subflows
  processElements(flow.subflows, 'subflow', nodes, edges, (element) => {
    addSimpleConnector(element, edges);
  });

  return { nodes, edges };
}

/**
 * Helper function to extract detailed info from flow elements
 */
function extractElementDetails(element: any, type: FlowNode['type']): any {
  const details: any = {
    label: element.label || element.name,
    name: element.name,
    description: element.description || ''
  };

  // Extract type-specific details
  switch (type) {
    case 'recordLookup':
    case 'recordUpdate':
    case 'recordCreate':
      details.object = element.object;
      details.filterLogic = element.filterLogic;
      details.queriedFields = Array.isArray(element.queriedFields) 
        ? element.queriedFields : (element.queriedFields ? [element.queriedFields] : []);
      break;
    
    case 'decision':
      const rules = Array.isArray(element.rules) ? element.rules : [element.rules].filter(Boolean);
      details.rulesCount = rules.length;
      details.rules = rules.map((r: any) => ({
        label: r?.label || 'Rule',
        conditions: r?.conditions?.length || 0
      }));
      break;
    
    case 'actionCall':
      details.actionType = element.actionType;
      details.actionName = element.actionName;
      break;
    
    case 'assignment':
      const assignments = Array.isArray(element.assignmentItems) 
        ? element.assignmentItems : [element.assignmentItems].filter(Boolean);
      details.assignmentsCount = assignments.length;
      break;
    
    case 'loop':
      details.collectionReference = element.collectionReference;
      details.iterationOrder = element.iterationOrder;
      break;
    
    case 'screen':
      const fields = Array.isArray(element.fields) 
        ? element.fields : [element.fields].filter(Boolean);
      details.fieldsCount = fields.length;
      break;
  }

  return details;
}

/**
 * Helper function to process flow elements and create nodes
 */
function processElements(
  elements: any,
  type: FlowNode['type'],
  nodes: FlowNode[],
  edges: FlowEdge[],
  edgeProcessor?: (element: any) => void
) {
  if (!elements) {
    return;
  }

  const elementArray = Array.isArray(elements) ? elements : [elements];

  elementArray.forEach((element: any) => {
    if (element?.name) {
      const details = extractElementDetails(element, type);
      
      nodes.push({
        id: element.name,
        type: type,
        label: element.label || element.name,
        data: {
          ...details,
          rawData: element
        }
      });

      if (edgeProcessor) {
        edgeProcessor(element);
      }
    }
  });
}

/**
 * Helper function to add a simple connector edge
 */
function addSimpleConnector(element: any, edges: FlowEdge[]) {
  if (element.connector?.targetReference) {
    edges.push({
      id: `edge-${element.name}`,
      source: element.name,
      target: element.connector.targetReference
    });
  }
}
