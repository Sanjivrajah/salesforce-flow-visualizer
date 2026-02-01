import React from 'react';
import ReactDOM from 'react-dom/client';
import { FlowDiagram } from './FlowDiagram';

// Get the root element
const rootElement = document.getElementById('root');

if (rootElement) {
  const root = ReactDOM.createRoot(rootElement);
  root.render(
    <React.StrictMode>
      <FlowDiagram />
    </React.StrictMode>
  );
}
