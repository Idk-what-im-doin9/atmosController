# Contributing to Atmos Controller

Thank you for your interest in contributing to Atmos Controller! This document provides guidelines and instructions for contributing to the project.

## 📋 Table of Contents

- [Code of Conduct](#code-of-conduct)
- [Getting Started](#getting-started)
- [Development Workflow](#development-workflow)
- [Coding Standards](#coding-standards)
- [Commit Guidelines](#commit-guidelines)
- [Pull Request Process](#pull-request-process)
- [Testing](#testing)
- [Platform-Specific Guidelines](#platform-specific-guidelines)

---

## 🤝 Code of Conduct

### Our Pledge

We are committed to providing a welcoming and inspiring community for all. Please be respectful, constructive, and kind in all interactions.

### Expected Behavior

- Use welcoming and inclusive language
- Be respectful of differing viewpoints and experiences
- Gracefully accept constructive criticism
- Focus on what is best for the community
- Show empathy towards other community members

### Unacceptable Behavior

- Trolling, insulting/derogatory comments, and personal attacks
- Public or private harassment
- Publishing others' private information without permission
- Other conduct which could reasonably be considered inappropriate

---

## 🚀 Getting Started

### Prerequisites

Ensure you have the required tools installed for your platform (see [README.md](README.md#prerequisites)).

### Fork and Clone

```bash
# Fork the repository on GitHub first, then:
git clone https://github.com/YOUR_USERNAME/atmosController.git
cd atmosController

# Add upstream remote
git remote add upstream https://github.com/Idk-what-im-doin9/atmosController.git
```

### Install Dependencies

```bash
npm install
```

The postinstall script will check for platform-specific dependencies.

### Run Development Server

```bash
npm run dev
```

---

## 🔄 Development Workflow

### 1. Create a Feature Branch

```bash
# Update your fork
git checkout main
git pull upstream main

# Create a new branch
git checkout -b feature/your-feature-name
```

### Branch Naming Conventions

- `feature/` - New features
- `fix/` - Bug fixes
- `docs/` - Documentation changes
- `refactor/` - Code refactoring
- `test/` - Adding or updating tests
- `chore/` - Maintenance tasks

Examples:
- `feature/add-audio-visualization`
- `fix/linux-transparency-issue`
- `docs/update-installation-guide`

### 2. Make Your Changes

- Write clean, readable code
- Follow the project's coding standards
- Add tests if applicable
- Update documentation as needed

### 3. Test Your Changes

```bash
# Run the app in development mode
npm run dev

# Build and test production build
npm run build:linux  # or build:win for Windows

# Test the built application
```

### 4. Commit Your Changes

Follow the [commit guidelines](#commit-guidelines) below.

### 5. Push and Create PR

```bash
git push origin feature/your-feature-name
```

Then create a Pull Request on GitHub.

---

## 💻 Coding Standards

### TypeScript Style Guide

- Use TypeScript for all new code
- Prefer `const` over `let`, avoid `var`
- Use descriptive variable and function names
- Add type annotations where types aren't obvious
- Use interfaces for object shapes

```typescript
// Good
interface AudioSession {
  id: string
  name: string
  volume: number
  isMuted: boolean
}

const updateVolume = async (sessionId: string, volume: number): Promise<boolean> => {
  // Implementation
}

// Avoid
let x = 50  // Unclear variable name
function doStuff(a, b) { }  // No types
```

### React/JSX Guidelines

- Use functional components with hooks
- Keep components small and focused
- Extract reusable logic into custom hooks
- Use meaningful component names

```tsx
// Good
export function VolumeSlider({ value, onChange }: VolumeSliderProps) {
  return (
    <input
      type="range"
      value={value}
      onChange={(e) => onChange(parseInt(e.target.value))}
    />
  )
}

// Avoid
export function Comp1(props: any) { }
```

### File Organization

```
src/
├── main/               # Electron main process
│   ├── main.ts        # Entry point
│   ├── services/      # Business logic
│   └── ipc/           # IPC handlers
└── renderer/          # React application
    ├── components/    # Reusable components
    ├── services/      # Frontend services
    ├── stores/        # State management
    └── styles/        # CSS files
```

### Formatting

- Use 2 spaces for indentation
- Max line length: 100 characters
- Use single quotes for strings (except in JSX)
- Add trailing commas in multi-line structures

```typescript
// Good
const config = {
  name: 'Atmos Controller',
  version: '0.1.0',
  platforms: ['linux', 'windows'],
}

// Avoid
const config = {
    name: "Atmos Controller",
    version: "0.1.0",
    platforms: ["linux", "windows"]
};
```

---

## 📝 Commit Guidelines

### Commit Message Format

```
<type>(<scope>): <subject>

<body>

<footer>
```

### Types

- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style changes (formatting, no logic change)
- `refactor`: Code refactoring
- `test`: Adding or updating tests
- `chore`: Maintenance tasks
- `perf`: Performance improvements

### Examples

```bash
# Feature
feat(linux): add PipeWire audio system detection

Implement automatic detection of PipeWire vs PulseAudio
on Linux systems. Falls back to PulseAudio if detection fails.

Closes #42

# Bug fix
fix(ui): correct volume slider not updating on mute

The volume slider was not visually updating when the mute
button was pressed. Added proper state synchronization.

Fixes #38

# Documentation
docs: add Linux installation instructions to README

# Refactoring
refactor(audio): extract common audio manager interface

# Chore
chore: update dependencies to latest versions
```

### Commit Best Practices

- Write clear, concise commit messages
- Keep commits atomic (one logical change per commit)
- Reference issues and PRs where applicable
- Use present tense ("add feature" not "added feature")
- Don't end the subject line with a period

---

## 🔀 Pull Request Process

### Before Submitting

- [ ] Code follows the project's style guidelines
- [ ] Self-review of your code is complete
- [ ] Comments added for complex logic
- [ ] Documentation updated (README, comments, etc.)
- [ ] No new warnings or errors introduced
- [ ] Tested on target platform(s)

### PR Title Format

Use the same format as commit messages:

```
feat(linux): add audio visualization support
```

### PR Description Template

```markdown
## Description
Brief description of the changes.

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Breaking change
- [ ] Documentation update

## Testing
Describe how you tested the changes.

## Screenshots (if applicable)
Add screenshots for UI changes.

## Checklist
- [ ] Code follows style guidelines
- [ ] Self-reviewed the code
- [ ] Added comments for complex logic
- [ ] Updated documentation
- [ ] Tested on: [Platform(s)]
- [ ] No breaking changes (or documented)

## Related Issues
Closes #(issue number)
```

### Review Process

1. Maintainers will review your PR
2. Address any requested changes
3. Once approved, a maintainer will merge your PR
4. Your contribution will be credited in release notes

---

## 🧪 Testing

### Manual Testing

```bash
# Development mode
npm run dev

# Test scenarios:
# 1. Launch the app
# 2. Play audio in multiple applications
# 3. Verify all controls work (volume, mute, master)
# 4. Test hotkey (Alt+Shift+D on Linux, Alt+Shift+D on Windows)
# 5. Test window dragging and closing
```

### Platform-Specific Testing

**Linux:**
```bash
# Test with different audio systems
systemctl --user status pulseaudio
systemctl --user status pipewire

# Test with multiple apps
firefox &
spotify &
discord &
```

**Windows:**
```powershell
# Test with different applications
# Open: Browser, Spotify, Discord, etc.
# Verify volume mixer detects all audio sessions
```

### Build Testing

```bash
# Build for your platform
npm run build:linux  # or build:win

# Install and test the package
# Debian/Ubuntu:
sudo dpkg -i release/atmos-controller_*_amd64.deb

# Fedora/RHEL:
sudo dnf install release/atmos-controller-*.rpm

# AppImage:
chmod +x release/Atmos-Controller-*.AppImage
./release/Atmos-Controller-*.AppImage
```

---

## 🖥️ Platform-Specific Guidelines

### Linux Development

#### Audio System Integration

- Use `pactl` commands for PulseAudio/PipeWire interaction
- Handle both PulseAudio and PipeWire gracefully
- Test on multiple distributions (Ubuntu, Fedora, Arch)

#### Key Files
- `src/main/services/audioSessionManager.linux.ts` - Linux audio implementation
- `build/linux/postinst.sh` - Post-install script
- `scripts/check-platform.js` - Dependency checker

#### Testing Checklist
- [ ] Works with PulseAudio
- [ ] Works with PipeWire
- [ ] Hotkey functions correctly
- [ ] Transparency works (with compositor)
- [ ] AppImage runs on different distros
- [ ] .deb installs correctly on Ubuntu/Debian
- [ ] .rpm installs correctly on Fedora

### Windows Development

#### Audio System Integration

- Windows WASAPI implementation (in progress)
- Test with Windows 10 and Windows 11
- Handle different audio devices

#### Key Files
- `src/main/services/audioSessionManager.windows.ts` - Windows audio implementation

#### Testing Checklist
- [ ] Detects all audio sessions
- [ ] Volume control works smoothly
- [ ] Mute/unmute functions correctly
- [ ] Transparency works properly
- [ ] Installer includes all dependencies

---

## 🛠️ Adding New Features

### Audio Features

When adding audio-related features:

1. Update the appropriate platform manager:
   - `audioSessionManager.linux.ts` for Linux
   - `audioSessionManager.windows.ts` for Windows
2. Update the interface in `audioSessionManager.ts`
3. Add IPC handlers in `ipc/audioHandlers.ts`
4. Update the renderer service in `renderer/services/audioService.ts`
5. Add UI components if needed
6. Test on all supported platforms

### UI Features

When adding UI features:

1. Create component in `src/renderer/components/`
2. Use Tailwind CSS for styling
3. Use Framer Motion for animations
4. Ensure accessibility (keyboard navigation, ARIA labels)
5. Test with different window sizes
6. Ensure transparency works correctly

---

## 📚 Documentation

### Code Comments

- Add JSDoc comments for functions and classes
- Explain "why" not "what" (code should be self-explanatory)
- Document complex algorithms

```typescript
/**
 * Parse PulseAudio sink-input list output
 *
 * Extracts audio session information from pactl output, including
 * session ID, application name, volume level, and mute status.
 *
 * @param output - Raw output from 'pactl list sink-inputs'
 * @returns Array of parsed audio sessions
 */
private parsePulseAudioSinkInputs(output: string): AudioSession[] {
  // Implementation
}
```

### Documentation Updates

When making changes, update:
- README.md (if user-facing changes)
- CONTRIBUTING.md (if process changes)
- Code comments (for maintainability)
- Inline documentation (TSDoc/JSDoc)

---

## ❓ Questions?

If you have questions:

1. Check existing [Issues](https://github.com/Idk-what-im-doin9/atmosController/issues)
2. Search [Discussions](https://github.com/Idk-what-im-doin9/atmosController/discussions)
3. Open a new Discussion for general questions
4. Open an Issue for bugs or feature requests

---

## 🏆 Recognition

Contributors will be:
- Listed in release notes
- Credited in the project
- Appreciated by the community!

Thank you for contributing to Atmos Controller! 🎉
