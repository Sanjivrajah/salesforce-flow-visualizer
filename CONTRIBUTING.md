# Contributing to Salesforce Flow Visualizer

Thank you for your interest in contributing to the Salesforce Flow Visualizer! This document provides guidelines and instructions for contributing.

## 🌟 How to Contribute

### Reporting Bugs

If you find a bug, please create an issue using the [Bug Report template](.github/ISSUE_TEMPLATE/bug_report.md). Include:

- A clear description of the bug
- Steps to reproduce
- Expected vs. actual behavior
- Screenshots (if applicable)
- Your environment details (VS Code version, OS, etc.)
- A sample `.flow-meta.xml` file (sanitized if needed)

### Suggesting Features

Have an idea for a new feature? Create an issue using the [Feature Request template](.github/ISSUE_TEMPLATE/feature_request.md). Include:

- A clear description of the feature
- The problem it solves
- Your proposed solution
- Any alternatives you've considered
- Use cases and who would benefit

### Submitting Pull Requests

1. **Fork the repository** and create a new branch from `main`:
   ```bash
   git checkout -b feature/my-new-feature
   ```

2. **Make your changes** following the code style and conventions

3. **Test your changes locally**:
   ```bash
   npm install
   npm run lint
   npm run compile
   npm run package
   npm test
   ```

4. **Commit your changes** with clear, descriptive commit messages:
   ```bash
   git commit -m "Add feature: description of what you added"
   ```

5. **Push to your fork**:
   ```bash
   git push origin feature/my-new-feature
   ```

6. **Open a Pull Request** using the [PR template](.github/pull_request_template.md)

## 📋 Development Setup

### Prerequisites

- Node.js 18.x or 20.x
- VS Code 1.85.0 or higher
- Git

### Getting Started

1. **Clone the repository**:
   ```bash
   git clone https://github.com/sanjivrajah/salesforce-flow-visualizer.git
   cd salesforce-flow-visualizer
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Open in VS Code**:
   ```bash
   code .
   ```

4. **Start development**:
   - Press `F5` to open a new VS Code window with the extension loaded
   - Open a `.flow-meta.xml` file and test the "Visualize Flow" command

### Project Structure

```
salesforce-flow-visualizer/
├── .github/              # GitHub configuration
│   ├── workflows/        # CI/CD workflows
│   └── ISSUE_TEMPLATE/   # Issue templates
├── src/                  # Source code
│   ├── extension.ts      # Extension entry point
│   ├── parser.ts         # Flow XML parser
│   ├── types.ts          # TypeScript type definitions
│   └── webview/          # React components for visualization
├── sample/               # Sample flow files for testing
├── package.json          # Project configuration
├── tsconfig.json         # TypeScript configuration
├── webpack.config.js     # Webpack build configuration
└── .eslintrc.json        # ESLint configuration
```

## 🎨 Code Style

### TypeScript

- Use TypeScript for all new code
- Follow the existing code style
- Run `npm run lint` to check for style issues
- Use meaningful variable and function names
- Add JSDoc comments for public APIs

### React Components

- Use functional components with hooks
- Keep components small and focused
- Use descriptive prop names
- Follow React best practices

### Formatting

- Use 2 spaces for indentation
- Use semicolons
- Use single quotes for strings
- Add trailing commas in multi-line structures

## ✅ Testing

### Running Tests

```bash
npm test
```

### Manual Testing

1. Open VS Code Extension Development Host (`F5`)
2. Open sample flow files from the `sample/` directory
3. Test the "Visualize Flow" command
4. Verify the visualization renders correctly
5. Test edge cases and error handling

### Adding Tests

When adding new features:
1. Add unit tests for new functions
2. Test edge cases and error conditions
3. Update existing tests if behavior changes

## 🔍 Code Review Process

All pull requests require:

1. ✅ All CI/CD checks passing
2. ✅ Code review approval from a maintainer
3. ✅ No merge conflicts
4. ✅ Updated documentation (if applicable)
5. ✅ Tests added/updated (if applicable)

### CI/CD Checks

Every PR automatically runs:

- **Linting**: ESLint checks for code quality
- **TypeScript Compilation**: Ensures no type errors
- **Build**: Verifies the extension builds successfully
- **Security Scan**: CodeQL analyzes for vulnerabilities
- **Dependency Review**: Checks for vulnerable dependencies

See [CICD.md](CICD.md) for details on the CI/CD pipeline.

## 📦 Building and Packaging

### Development Build

```bash
npm run compile
```

### Production Build

```bash
npm run package
```

### Creating a VSIX Package

```bash
npm install -g @vscode/vsce
vsce package
```

## 🚀 Release Process

Releases are automated:

1. Update version in `package.json`
2. Commit: `git commit -am "Bump version to X.Y.Z"`
3. Tag: `git tag vX.Y.Z`
4. Push: `git push origin vX.Y.Z`
5. GitHub Actions automatically creates a release with the `.vsix` file

## 💡 Tips for Contributors

- **Start small**: Begin with small bug fixes or documentation improvements
- **Ask questions**: Don't hesitate to ask for help in issues or discussions
- **Be patient**: Code reviews may take time
- **Stay updated**: Pull the latest changes before starting new work
- **Test thoroughly**: Manual testing is crucial for UI extensions
- **Document changes**: Update README and docs for new features

## 📝 Commit Message Guidelines

Follow conventional commits format:

- `feat: add new visualization for subflows`
- `fix: resolve parsing error for complex decisions`
- `docs: update installation instructions`
- `refactor: simplify node positioning logic`
- `test: add tests for assignment parser`
- `chore: update dependencies`

## 🐛 Debugging

### Extension Debugging

1. Set breakpoints in VS Code
2. Press `F5` to start debugging
3. The extension runs in a new window
4. Use the Debug Console to inspect variables

### Webpack Build Issues

```bash
# Clean build
rm -rf dist node_modules
npm install
npm run package
```

### TypeScript Errors

```bash
# Check for type errors
npx tsc --noEmit
```

## 📚 Resources

- [VS Code Extension API](https://code.visualstudio.com/api)
- [React Flow Documentation](https://reactflow.dev/)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [GitHub Actions Documentation](https://docs.github.com/en/actions)

## 🤝 Code of Conduct

Be respectful and inclusive. We're all here to build something great together!

## 📄 License

By contributing, you agree that your contributions will be licensed under the same license as the project (MIT).

## ❓ Questions?

- Open an issue for questions about contributing
- Tag maintainers in PRs if you need help
- Check existing issues and PRs for similar work

---

Thank you for contributing to Salesforce Flow Visualizer! 🎉
