# CI/CD Pipeline Documentation

This repository includes comprehensive CI/CD pipelines using GitHub Actions to ensure code quality, security, and reliability.

## 📋 Overview

The following automated workflows run on every pull request:

### 1. CI Workflow (`ci.yml`)
**Triggers:** Pull requests and pushes to main/master branches

**What it does:**
- Runs on multiple Node.js versions (18.x and 20.x) to ensure compatibility
- Installs dependencies with caching for faster builds
- Runs ESLint to check code quality and style
- Compiles TypeScript to catch type errors
- Builds the production package with webpack
- Runs tests (when available)
- Uploads build artifacts for review

**Status:** [![CI](https://github.com/Sanjivrajah/salesforce-flow-visualizer/workflows/CI/badge.svg)](https://github.com/Sanjivrajah/salesforce-flow-visualizer/actions/workflows/ci.yml)

### 2. CodeQL Security Scan (`codeql.yml`)
**Triggers:** Pull requests, pushes to main/master, and weekly on Mondays

**What it does:**
- Performs deep security analysis of JavaScript/TypeScript code
- Detects common security vulnerabilities
- Scans for code quality issues
- Reports findings in the Security tab

**Status:** [![CodeQL](https://github.com/Sanjivrajah/salesforce-flow-visualizer/workflows/CodeQL%20Security%20Scan/badge.svg)](https://github.com/Sanjivrajah/salesforce-flow-visualizer/actions/workflows/codeql.yml)

### 3. Dependency Review (`dependency-review.yml`)
**Triggers:** Pull requests only

**What it does:**
- Reviews all dependency changes in the pull request
- Checks for known security vulnerabilities
- Blocks PRs with moderate or higher severity vulnerabilities
- Checks for GPL license violations
- Comments on the PR with findings

### 4. Code Quality (`code-quality.yml`)
**Triggers:** Pull requests and pushes to main/master branches

**What it does:**
- Checks for TypeScript compilation errors
- Analyzes bundle size
- Optionally runs Prettier formatting checks
- Scans for TODO/FIXME comments

**Status:** [![Code Quality](https://github.com/Sanjivrajah/salesforce-flow-visualizer/workflows/Code%20Quality/badge.svg)](https://github.com/Sanjivrajah/salesforce-flow-visualizer/actions/workflows/code-quality.yml)

### 5. Release Workflow (`release.yml`)
**Triggers:** When a version tag is pushed (e.g., `v1.0.0`)

**What it does:**
- Builds and packages the VS Code extension
- Creates a `.vsix` file
- Automatically creates a GitHub release
- Attaches the `.vsix` file to the release
- Generates release notes from commits

## 🚀 Using the Pipelines

### For Contributors

When you create a pull request:
1. All applicable workflows will run automatically
2. You can see the status of checks at the bottom of your PR
3. Click on "Details" next to any check to see detailed logs
4. Address any failures before requesting review
5. All checks must pass before the PR can be merged

### For Maintainers

#### Running Workflows Manually
1. Go to the "Actions" tab in GitHub
2. Select the workflow you want to run
3. Click "Run workflow" and select the branch

#### Creating a Release
1. Update the version in `package.json`
2. Commit the change: `git commit -am "Bump version to X.Y.Z"`
3. Create and push a tag: 
   ```bash
   git tag v1.0.0
   git push origin v1.0.0
   ```
4. The Release workflow will automatically create a GitHub release with the `.vsix` file

## 🛠️ Local Development

### Running Checks Locally

Before pushing your changes, run these commands locally:

```bash
# Install dependencies
npm install

# Run linting
npm run lint

# Compile TypeScript
npm run compile

# Build production package
npm run package

# Run tests (if available)
npm test
```

### Fixing Common Issues

**ESLint errors:**
```bash
npm run lint -- --fix
```

**TypeScript errors:**
Check the output of `npm run compile` and fix type errors in your code.

**Build failures:**
Ensure all dependencies are installed with `npm install` and check webpack configuration.

## 📊 Monitoring Pipeline Status

- **Actions Tab:** View all workflow runs at `https://github.com/Sanjivrajah/salesforce-flow-visualizer/actions`
- **Security Tab:** View security alerts at `https://github.com/Sanjivrajah/salesforce-flow-visualizer/security`
- **Pull Requests:** Status checks appear at the bottom of each PR

## 🔧 Customizing Workflows

### Adjusting Node.js Versions
Edit `.github/workflows/ci.yml` and modify the `matrix.node-version` array:
```yaml
strategy:
  matrix:
    node-version: [18.x, 20.x, 22.x]  # Add or remove versions
```

### Modifying ESLint Rules
Edit `.eslintrc.json` to adjust linting rules:
```json
{
  "rules": {
    "rule-name": "off"  // Disable a rule
  }
}
```

### Changing Dependency Review Settings
Edit `.github/workflows/dependency-review.yml` to adjust vulnerability thresholds:
```yaml
fail-on-severity: high  # Change from 'moderate' to 'high' or 'critical'
```

## 📝 Best Practices

1. **Always run tests locally before pushing**
2. **Keep dependencies up to date** to avoid security vulnerabilities
3. **Review workflow logs** when checks fail to understand the issue
4. **Don't bypass failed checks** - fix the underlying issue instead
5. **Use semantic versioning** for releases (MAJOR.MINOR.PATCH)

## 🆘 Troubleshooting

### Workflow Fails on "Install Dependencies"
- Delete `node_modules` and `package-lock.json` locally
- Run `npm install` to regenerate
- Commit the updated `package-lock.json`

### CodeQL Analysis Fails
- Usually resolves on retry
- Check if there are syntax errors in the code
- Review CodeQL logs for specific issues

### Dependency Review Blocks PR
- Check which dependency has the vulnerability
- Update to a patched version
- If no patch exists, consider alternatives or request an exception

## 📚 Additional Resources

- [GitHub Actions Documentation](https://docs.github.com/en/actions)
- [CodeQL Documentation](https://codeql.github.com/docs/)
- [ESLint Rules Reference](https://eslint.org/docs/rules/)
- [VS Code Extension Publishing](https://code.visualstudio.com/api/working-with-extensions/publishing-extension)
