import * as vscode from 'vscode';
import { parseFlowXML } from './parser';
import { FlowDiagramData } from './types';

let currentPanel: vscode.WebviewPanel | undefined = undefined;

export function activate(context: vscode.ExtensionContext) {
  console.log('Salesforce Flow Visualizer is now active');

  // Register the visualize command
  const disposable = vscode.commands.registerCommand('sfdc-flow-viz.visualize', async () => {
    const editor = vscode.window.activeTextEditor;

    if (!editor) {
      vscode.window.showErrorMessage('No active editor found');
      return;
    }

    const document = editor.document;

    // Verify it's a flow-meta.xml file
    if (!document.fileName.endsWith('.flow-meta.xml')) {
      vscode.window.showWarningMessage('Please open a .flow-meta.xml file to visualize');
      return;
    }

    try {
      vscode.window.showInformationMessage('Parsing flow file...');
      
      // Parse the XML document
      const flowData = parseFlowXML(document.getText());
      
      vscode.window.showInformationMessage(`Found ${flowData.nodes.length} nodes and ${flowData.edges.length} edges`);

      // Create or reveal webview panel
      if (currentPanel) {
        currentPanel.reveal(vscode.ViewColumn.Beside);
      } else {
        currentPanel = createWebviewPanel(context);
      }

      // Send data to webview
      setTimeout(() => {
        currentPanel?.webview.postMessage({
          command: 'renderFlow',
          data: flowData
        });
        vscode.window.showInformationMessage('Data sent to webview');
      }, 500);

    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : String(error);
      vscode.window.showErrorMessage(`Failed to parse flow: ${errorMsg}`);
      console.error('Flow parsing error:', error);
    }
  });

  context.subscriptions.push(disposable);
}

function createWebviewPanel(context: vscode.ExtensionContext): vscode.WebviewPanel {
  const panel = vscode.window.createWebviewPanel(
    'flowVisualizer',
    'Flow Visualizer',
    vscode.ViewColumn.Beside,
    {
      enableScripts: true,
      retainContextWhenHidden: true,
      localResourceRoots: [vscode.Uri.joinPath(context.extensionUri, 'dist')]
    }
  );

  // Get URIs for webview resources
  const scriptUri = panel.webview.asWebviewUri(
    vscode.Uri.joinPath(context.extensionUri, 'dist', 'webview.js')
  );

  panel.webview.html = getWebviewContent(scriptUri);

  // Handle panel disposal
  panel.onDidDispose(() => {
    currentPanel = undefined;
  }, null, context.subscriptions);

  // Handle messages from the webview
  panel.webview.onDidReceiveMessage(
    message => {
      switch (message.command) {
        case 'alert':
          vscode.window.showInformationMessage(message.text);
          return;
        case 'error':
          vscode.window.showErrorMessage(message.text);
          return;
      }
    },
    undefined,
    context.subscriptions
  );

  return panel;
}

function getWebviewContent(scriptUri: vscode.Uri): string {
  const scriptUriString = scriptUri.toString();
  return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="Content-Security-Policy" content="default-src 'none'; style-src 'unsafe-inline'; script-src 'unsafe-inline' 'unsafe-eval' https://*.vscode-cdn.net https://file+.vscode-resource.vscode-cdn.net;">
    <title>Flow Visualizer</title>
    <style>
        body, html {
            margin: 0;
            padding: 0;
            width: 100%;
            height: 100vh;
            overflow: hidden;
            background-color: #1e1e1e;
            color: #fff;
        }
        #root {
            width: 100%;
            height: 100%;
        }
        #loading {
            display: flex;
            align-items: center;
            justify-content: center;
            height: 100%;
            font-size: 16px;
        }
    </style>
</head>
<body>
    <div id="root">
        <div id="loading">Loading Flow Visualizer...</div>
    </div>
    <script>
        console.log('Webview HTML loaded');
        console.log('Script URI:', '${scriptUriString}');
    </script>
    <script src="${scriptUriString}"></script>
</body>
</html>`;
}

export function deactivate() {
  if (currentPanel) {
    currentPanel.dispose();
  }
}
