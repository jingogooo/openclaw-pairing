# Contributing to OpenClaw Pairing Plugin

Thank you for your interest in contributing!

## Development Setup

```bash
# Clone the repository
git clone https://github.com/jingogooo/openclaw-pairing.git
cd openclaw-pairing

# Install dependencies
npm install

# Build
npm run build

# Run tests
npm test
```

## Project Structure

```
src/
├── commands/       # CLI commands (pair-android, pair-harmony, etc.)
├── api/           # HTTP API endpoints
├── utils/         # Utility functions
└── index.ts       # Plugin entry point
```

## Adding a New Platform

1. Create a new command file in `src/commands/pair-<platform>.ts`
2. Register the command in `src/index.ts`
3. Add tests in `src/utils/pairing-handler.test.ts`
4. Update README.md with usage instructions

## Testing

```bash
# Run all tests
npm test

# Run tests in watch mode
npm test:watch

# Run specific test file
npm test -- pairing-handler.test.ts
```

## Release Process

1. Update version in `package.json`
2. Create a git tag: `git tag v1.0.0`
3. Push the tag: `git push origin v1.0.0`
4. GitHub Actions will automatically create a release

## Code Style

- Use TypeScript strict mode
- Follow existing code patterns
- Add tests for new features
- Update documentation

## Submitting Changes

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests
5. Submit a pull request

## Questions?

Open an issue on GitHub.
