# Atmos Controller

<div align="center">

![Version](https://img.shields.io/badge/version-0.1.0-blue.svg)
![License](https://img.shields.io/badge/license-MIT-green.svg)
![Platform](https://img.shields.io/badge/platform-Linux%20%7C%20Windows-lightgrey.svg)

**A lightweight, transparent audio control overlay with system-wide volume mixing**

[Features](#features) • [Installation](#installation) • [Building from Source](#building-from-source) • [Usage](#usage) • [Contributing](#contributing)

</div>

---

## 📋 Overview

Atmos Controller is a modern audio mixer application that provides per-application volume control through an elegant, transparent overlay interface. Built with Electron, it offers a beautiful glass morphism UI with minimal resource consumption.

### Key Features

- 🎚️ **Per-Application Volume Control** - Control volume for each running application independently
- 🪟 **Transparent Overlay** - Beautiful glass morphism UI that floats above other windows
- ⌨️ **Global Hotkey** - Quick access with `Alt+Shift+D` on all platforms
- 🐧 **Linux Native** - Full support for PulseAudio and PipeWire
- 🎯 **Tiling WM Support** - Works perfectly with Hyprland, i3, Sway, and other tiling window managers
- 💾 **Lightweight** - Minimal resource footprint (<100MB RAM)
- 🎨 **Modern UI** - Smooth animations with Framer Motion

---

## 🚀 Installation

### Linux

#### AppImage (Universal)

The easiest way to run Atmos Controller on any Linux distribution:

```bash
# Download the AppImage from releases
chmod +x Atmos-Controller-*.AppImage
./Atmos-Controller-*.AppImage
```

#### Debian/Ubuntu (.deb)

```bash
# Download the .deb package from releases
sudo dpkg -i atmos-controller_*_amd64.deb

# If there are dependency issues, run:
sudo apt-get install -f
```

**Note:** On Hyprland, the installer automatically configures window rules and the `Alt+Shift+D` keybinding.

#### Fedora/RHEL (.rpm)

```bash
# Download the .rpm package from releases
sudo dnf install atmos-controller-*.rpm

# Or using rpm directly:
sudo rpm -i atmos-controller-*.rpm
```

**Note:** On Hyprland, the installer automatically configures window rules and the `Alt+Shift+D` keybinding.

#### Arch Linux (AUR)

```bash
# Using yay
yay -S atmos-controller

# Using paru
paru -S atmos-controller
```

### Windows

Download the `.exe` installer from the [releases page](https://github.com/Idk-what-im-doin9/atmosController/releases) and run it.

---

## 🛠️ Building from Source

### Prerequisites

#### Linux
- **Node.js** 18+ and npm/yarn
- **PulseAudio** or **PipeWire** (with PulseAudio compatibility layer)
- **Build tools**: `gcc`, `make`, `pkg-config`

```bash
# Ubuntu/Debian
sudo apt install nodejs npm pulseaudio build-essential

# Fedora
sudo dnf install nodejs npm pulseaudio gcc make

# Arch Linux
sudo pacman -S nodejs npm pulseaudio base-devel
```

#### Windows
- **Node.js** 18+
- **Visual Studio Build Tools** (for native modules)

### Clone and Install

```bash
# Clone the repository
git clone https://github.com/Idk-what-im-doin9/atmosController.git
cd atmosController

# Install dependencies
npm install

# The postinstall script will automatically check platform dependencies
```

### Development

```bash
# Start development server with hot reload
npm run dev

# The app will launch automatically
# Press Alt+Shift+D (Linux) or Alt+Shift+D (Windows) to toggle
```

### Build Production Binaries

#### Linux Only
```bash
npm run build:linux
```

This creates:
- `release/Atmos-Controller-*.AppImage` - Universal AppImage
- `release/atmos-controller_*_amd64.deb` - Debian/Ubuntu package
- `release/atmos-controller-*.rpm` - Fedora/RHEL package
- `release/atmos-controller-*.tar.gz` - Tarball

#### Windows Only
```bash
npm run build:win
```

#### All Platforms
```bash
npm run build:all
```

---

## 📖 Usage

### Launching the App

**Linux:**
```bash
# From application menu
Search for "Atmos Controller"

# From terminal
atmos-controller

# Or use the hotkey after launch
Alt+Shift+D
```

**Windows:**
```bash
# From Start Menu
Search for "Atmos Controller"

# Or use the hotkey
Alt+Shift+D
```

### Controls

- **Master Volume Slider** - Controls system-wide audio level
- **Per-App Sliders** - Individual volume control for each application
- **Mute Button (M)** - Mute/unmute individual applications
- **Close Button (×)** - Hide the overlay (doesn't quit the app)

### Configuration

Configuration files are stored in:
- **Linux**: `~/.config/atmoscontroller/`
- **Windows**: `%APPDATA%\atmoscontroller\`

---

## 🐧 Linux-Specific Information

### Audio System Requirements

Atmos Controller supports both PulseAudio and PipeWire:

**PulseAudio**
```bash
# Check if running
systemctl --user status pulseaudio

# Start if needed
systemctl --user start pulseaudio
```

**PipeWire** (with PulseAudio compatibility)
```bash
# Check if running
systemctl --user status pipewire pipewire-pulse

# Start if needed
systemctl --user start pipewire pipewire-pulse
```

### Hotkey Issues

If the global hotkey (`Alt+Shift+D`) doesn't work:

1. **Check for conflicts** with existing system shortcuts
2. **Wayland users**: Some compositors restrict global shortcuts
3. **Alternative**: Launch from terminal or menu, then use the window normally

### Transparency Issues

If the window appears opaque or has visual artifacts:

1. **Check compositor**: Transparency requires a compositor (picom, compton, etc.)
2. **X11 users**: Ensure compositing is enabled
3. **Wayland users**: Most compositors support transparency by default

### Running on Wayland

Atmos Controller works on Wayland through XWayland. For native Wayland support (experimental):

```bash
# Force Wayland backend (may have issues)
GDK_BACKEND=wayland atmos-controller
```

---

## 🏗️ Architecture

### Project Structure

```
atmosController/
├── src/
│   ├── main/                    # Electron main process
│   │   ├── main.ts             # Application entry point
│   │   ├── services/
│   │   │   ├── audioSessionManager.ts          # Platform abstraction
│   │   │   ├── audioSessionManager.linux.ts    # Linux implementation
│   │   │   └── audioSessionManager.windows.ts  # Windows implementation
│   │   └── ipc/
│   │       └── audioHandlers.ts # IPC communication
│   └── renderer/                # React UI
│       ├── App.tsx
│       ├── components/
│       └── services/
├── build/
│   └── linux/                   # Linux packaging scripts
│       ├── postinst.sh
│       └── postrm.sh
└── scripts/
    └── check-platform.js        # Dependency checker
```

### Platform Detection

The app automatically detects the platform and loads the appropriate audio manager:
- **Linux**: Uses `pactl` commands (PulseAudio/PipeWire)
- **Windows**: Uses WASAPI (Windows Audio Session API) - *coming soon*

---

## 🤝 Contributing

We welcome contributions! Please see [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines.

### Development Setup

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Make your changes
4. Test on your platform
5. Commit with clear messages: `git commit -m 'Add amazing feature'`
6. Push to your fork: `git push origin feature/amazing-feature`
7. Open a Pull Request

### Areas for Contribution

- 🐛 **Bug Fixes** - Report or fix issues
- 🎨 **UI/UX** - Design improvements and animations
- 🔊 **Audio Features** - New audio control features
- 🧪 **Testing** - Cross-platform testing and automation
- 📚 **Documentation** - Improve docs and add translations
- 🍎 **macOS Support** - Help add macOS compatibility

---

## 🧪 Testing

### Manual Testing

```bash
# Start in development mode
npm run dev

# Test audio controls
# Play audio in multiple applications (browser, music player, etc.)
# Verify volume sliders appear and work correctly
```

### Platform-Specific Tests

**Linux:**
```bash
# Test with PulseAudio
pactl list sink-inputs

# Test with different applications
firefox &
spotify &
```

---

## 📝 Roadmap

- [x] Linux support with PulseAudio/PipeWire
- [x] Per-application volume control
- [x] Glass morphism UI
- [ ] Windows WASAPI implementation
- [ ] Audio visualization
- [ ] Keyboard shortcuts customization
- [ ] Themes and color schemes
- [ ] macOS support
- [ ] Tray icon and system integration
- [ ] Application profiles and presets

---

## 🐛 Known Issues

### Linux
- Global hotkey may conflict with system shortcuts on some DEs
- Transparency requires a compositor (usually enabled by default)
- Wayland support is via XWayland (native Wayland in progress)

### Windows
- Native WASAPI implementation in progress (currently mock data)

See [Issues](https://github.com/Idk-what-im-doin9/atmosController/issues) for more details.

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 🙏 Acknowledgments

- Inspired by Windows GameBar and EarTrumpet
- Built with [Electron](https://www.electronjs.org/)
- UI powered by [React](https://react.dev/) and [Tailwind CSS](https://tailwindcss.com/)
- Animations by [Framer Motion](https://www.framer.com/motion/)

---

## 📧 Support

- **Issues**: [GitHub Issues](https://github.com/Idk-what-im-doin9/atmosController/issues)
- **Discussions**: [GitHub Discussions](https://github.com/Idk-what-im-doin9/atmosController/discussions)

---

<div align="center">

**Made with ❤️ by the Atmos Controller community**

</div>
