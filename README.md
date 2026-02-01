# Salesforce Flow Visualizer

A Visual Studio Code extension that renders Salesforce Flow metadata files (.flow-meta.xml) as interactive, detailed diagrams.

![Extension Icon](icon.png)

## ✨ Features

- 🎨 **Interactive Visualization**: Renders Flow elements as an interactive diagram with detailed information
- 📋 **Comprehensive Details**: Shows object names, field references, conditions, and more for each element
- 🔄 **Automatic Layout**: Uses Dagre algorithm for optimal node positioning
- 🎯 **Type-Specific Styling**: Different colors for different Flow element types
- 📊 **Minimap & Controls**: Built-in navigation controls for complex flows
- ⚡ **Fast Parsing**: Uses fast-xml-parser for efficient XML processing

## 🚀 Usage

1. Open a Salesforce Flow file (`.flow-meta.xml`)
2. Click the **"Visualize Flow"** icon in the editor title bar (top-right corner)
   - Or use Command Palette (`Cmd+Shift+P`) and type "Visualize Flow"
3. The flow diagram will open in a new panel beside your editor

## 📊 Flow Element Information Displayed

### Decisions
- Condition logic (AND/OR)
- Field references
- Operators and values
- Number of rules
- Default connector paths

### Record Actions (Create/Update/Lookup)
- Object type
- Field assignments
- Filter criteria
- Number of records

### Screens
- Field components
- Input/output parameters

### Assignments
- Variable assignments
- Formula expressions

### Loops
- Collection variables
- Iteration logic

### Subflows
- Referenced flow names
- Input/output variables

## 🎨 Flow Element Colors

- **Start**: Green
- **Decision**: Orange  
- **Record Lookups**: Blue
- **Record Updates**: Pink
- **Record Creates**: Blue
- **Screen**: Purple
- **Assignment**: Purple
- **Loop**: Yellow
- **Subflow**: Cyan
- **Action Calls**: Blue

## 📦 Installation

### From VSIX File
1. Download the latest `.vsix` file
2. In VS Code, press `Cmd+Shift+P`
3. Type "Extensions: Install from VSIX"
4. Select the downloaded file

### From VS Code Marketplace
Search for "Salesforce Flow Visualizer" in the Extensions view

## 🛠️ Technology Stack

- **Language**: TypeScript
- **UI Framework**: React
- **Diagram Library**: React Flow
- **XML Parser**: fast-xml-parser
- **Layout Engine**: Dagre
- **Build Tool**: Webpack

## 📝 Requirements

- Visual Studio Code version 1.85.0 or higher
- Salesforce Flow metadata files (.flow-meta.xml)

## 🐛 Known Issues

- Very large flows (100+ elements) may take a few seconds to render
- Some complex loop connectors may overlap

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License


## 👤 Author

**Sanjivrajah**

## 🙏 Acknowledgments

- Built with ❤️ for the Salesforce developer community
- Uses React Flow for diagram rendering
---

**Enjoy visualizing your Salesforce Flows!** 🎉
