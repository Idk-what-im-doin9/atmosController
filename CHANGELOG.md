# Changelog

All notable changes to Atmos Controller will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added
- Linux support with PulseAudio and PipeWire compatibility
- Platform-specific audio manager implementations
- Automatic audio system detection (PulseAudio/PipeWire)
- Linux packaging (AppImage, .deb, .rpm, .tar.gz)
- Comprehensive README with installation instructions
- Contributing guidelines (CONTRIBUTING.md)
- Linux setup guide (docs/LINUX_SETUP.md)
- Testing documentation (docs/TESTING.md)
- GitHub Actions workflow for automated releases
- Post-install and post-removal scripts for Linux packages
- Platform dependency checker script
- MIT License
- Floating window support for tiling window managers (Hyprland, i3, Sway, etc.)

### Changed
- Renamed project from "Ethereal Mixer" to "Atmos Controller"
- Refactored audio manager to support multiple platforms
- Updated main process to handle async audio manager initialization
- Updated IPC handlers for platform abstraction
- Improved error handling and logging
- **Unified global hotkey**: Now uses `Alt+Shift+D` on all platforms (Linux and Windows)
- Window now floats properly in tiling window managers (no borders)
- Made window non-resizable for consistent UI experience
- Window now skips taskbar for overlay-like behavior

### Technical
- Created `audioSessionManager.ts` as platform abstraction layer
- Implemented `audioSessionManager.linux.ts` using pactl commands
- Separated Windows implementation into `audioSessionManager.windows.ts`
- Added TypeScript interfaces for cross-platform compatibility
- Build configuration for Linux (electron-builder)

## [0.1.0] - TBD

### Initial Release

**Features:**
- Per-application volume control
- Glass morphism UI with transparency
- Master volume control
- Mute/unmute individual applications
- Global hotkey toggle
- Minimal resource usage (<100MB RAM)
- Support for multiple audio sessions

**Platforms:**
- Linux (PulseAudio/PipeWire)
- Windows (WASAPI - in progress)

---

## Version History

### Version Numbering

- **Major** (X.0.0): Breaking changes, major new features
- **Minor** (0.X.0): New features, non-breaking changes
- **Patch** (0.0.X): Bug fixes, minor improvements

### Release Schedule

- **Stable releases**: Tagged as vX.Y.Z
- **Pre-releases**: Tagged as vX.Y.Z-beta.N or vX.Y.Z-rc.N
- **Development**: main branch (unstable)

---

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md) for information on how to contribute to this changelog and the project.

When adding entries:
1. Add to [Unreleased] section
2. Follow the format: `- Description [#PR]` or `- Description (@contributor)`
3. Categorize under Added/Changed/Deprecated/Removed/Fixed/Security
4. Be concise but descriptive

---

## Links

- [Repository](https://github.com/Idk-what-im-doin9/atmosController)
- [Issue Tracker](https://github.com/Idk-what-im-doin9/atmosController/issues)
- [Releases](https://github.com/Idk-what-im-doin9/atmosController/releases)
