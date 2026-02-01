import { CSSProperties } from 'react';

/**
 * Get Salesforce-style styling for flow nodes based on their type
 */
export function getNodeStyle(
  nodeType: string,
  colors: Record<string, string>
): CSSProperties {
  const baseStyle: CSSProperties = {
    padding: '10px 16px',
    borderRadius: '4px',
    border: '1px solid rgba(0, 0, 0, 0.1)',
    backgroundColor: colors[nodeType] || colors.default,
    color: '#ffffff',
    fontWeight: 600,
    fontSize: '13px',
    minWidth: '160px',
    maxWidth: '220px',
    textAlign: 'center',
    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.15)',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
  };

  // Start node - circular
  if (nodeType === 'start') {
    return {
      ...baseStyle,
      borderRadius: '50%',
      width: '80px',
      height: '80px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '0',
      minWidth: 'unset',
      fontSize: '12px',
      fontWeight: 700
    };
  }

  // Decision nodes - diamond shape (approximated with rotation)
  if (nodeType === 'decision') {
    return {
      ...baseStyle,
      borderRadius: '4px',
      padding: '12px 20px',
      minWidth: '140px',
      minHeight: '60px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontSize: '12px'
    };
  }

  // Action nodes (recordCreate, recordUpdate, etc.)
  if (nodeType === 'actionCall' || nodeType.startsWith('record')) {
    return {
      ...baseStyle,
      backgroundColor: colors[nodeType],
      borderLeft: `4px solid ${colors[nodeType]}`,
      filter: 'brightness(1.1)',
    };
  }

  return baseStyle;
}
