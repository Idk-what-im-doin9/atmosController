# Testing Guide for Atmos Controller

This document outlines the testing procedures for Atmos Controller across different platforms.

## Table of Contents

- [Development Testing](#development-testing)
- [Linux Testing](#linux-testing)
- [Windows Testing](#windows-testing)
- [UI/UX Testing](#uiux-testing)
- [Build Testing](#build-testing)
- [Performance Testing](#performance-testing)

---

## Development Testing

### Prerequisites

Ensure all dependencies are installed:
```bash
npm install
```

### Running in Development Mode

```bash
npm run dev
```

This will:
1. Start the Vite development server
2. Launch the Electron application
3. Enable hot reload for code changes
4. Open DevTools automatically

### Development Checklist

- [ ] App launches without errors
- [ ] Console shows no unexpected errors or warnings
- [ ] Hot reload works for renderer changes
- [ ] Main process restarts correctly on changes

---

## Linux Testing

### Audio System Testing

#### PulseAudio

1. **Verify PulseAudio is running:**
   ```bash
   systemctl --user status pulseaudio
   pactl info
   ```

2. **Start test applications:**
   ```bash
   # Browser
   firefox https://www.youtube.com &

   # Music player
   spotify &
   # or
   rhythmbox &

   # Other apps
   discord &
   ```

3. **Verify audio session detection:**
   - Open Atmos Controller
   - Each playing application should appear as a session
   - Volume levels should match system values

4. **Test controls:**
   ```bash
   # While app is running, compare with pactl:
   pactl list sink-inputs

   # Verify volume changes reflect in pactl output
   ```

#### PipeWire

1. **Verify PipeWire is running:**
   ```bash
   systemctl --user status pipewire pipewire-pulse
   pw-cli info 0
   ```

2. **Test with PipeWire apps:**
   - Run the same tests as PulseAudio
   - PipeWire provides PulseAudio compatibility, so pactl commands work

3. **Check for conflicts:**
   ```bash
   # Ensure only one audio system is active
   systemctl --user status pulseaudio pipewire
   ```

### Distribution-Specific Testing

#### Ubuntu/Debian

1. **Install the .deb package:**
   ```bash
   sudo dpkg -i release/atmos-controller_*_amd64.deb
   sudo apt-get install -f  # Fix dependencies if needed
   ```

2. **Verify installation:**
   ```bash
   which atmos-controller
   dpkg -L atmos-controller  # List installed files
   ```

3. **Test package removal:**
   ```bash
   sudo apt remove atmos-controller
   # Verify clean removal (no leftover files)
   ```

#### Fedora/RHEL

1. **Install the RPM package:**
   ```bash
   sudo dnf install release/atmos-controller-*.rpm
   ```

2. **Verify installation:**
   ```bash
   rpm -qa | grep atmos
   rpm -ql atmos-controller  # List installed files
   ```

3. **Test package removal:**
   ```bash
   sudo dnf remove atmos-controller
   ```

#### Arch Linux

1. **Test AppImage:**
   ```bash
   chmod +x release/Atmos-Controller-*.AppImage
   ./release/Atmos-Controller-*.AppImage
   ```

2. **Build from source:**
   ```bash
   npm install
   npm run build:linux
   ```

### Desktop Environment Testing

Test on multiple DEs to ensure compatibility:

- [ ] **GNOME** - Default Ubuntu DE
- [ ] **KDE Plasma** - Feature-rich DE
- [ ] **XFCE** - Lightweight DE
- [ ] **i3/Sway** - Tiling window managers
- [ ] **Cinnamon** - Linux Mint default

#### Transparency Testing

1. **Check compositor:**
   ```bash
   # X11
   ps aux | grep -i compton
   ps aux | grep -i picom

   # Wayland (usually built-in)
   echo $XDG_SESSION_TYPE
   ```

2. **Visual verification:**
   - Window should have transparent background
   - Glass morphism effect should be visible
   - No black/opaque borders

#### Hotkey Testing

1. **Test default hotkey:**
   - Press `Alt+Shift+D`
   - Window should toggle visibility

2. **Check for conflicts:**
   ```bash
   # GNOME
   gsettings list-recursively | grep -i "shift+d"

   # KDE
   # Check System Settings > Shortcuts
   ```

### Wayland vs X11 Testing

1. **Verify session type:**
   ```bash
   echo $XDG_SESSION_TYPE  # Should show "wayland" or "x11"
   ```

2. **X11 testing:**
   - Full global hotkey support expected
   - Transparency should work with compositor

3. **Wayland testing:**
   - App runs through XWayland
   - Some hotkey limitations possible (depends on compositor)
   - Transparency should work natively

---

## Windows Testing

### Audio System Testing

1. **Verify Windows Audio Service:**
   ```powershell
   Get-Service | Where-Object {$_.Name -like "*audio*"}
   ```

2. **Start test applications:**
   - Google Chrome (YouTube)
   - Spotify
   - Discord
   - Games
   - VLC Media Player

3. **Test controls:**
   - Open Windows Volume Mixer (Win + R → sndvol)
   - Compare volumes with Atmos Controller
   - Verify changes sync

### Installation Testing

1. **Install via NSIS installer:**
   - Double-click the .exe
   - Follow installation wizard
   - Verify desktop shortcut created
   - Verify Start Menu entry

2. **Verify installation:**
   ```powershell
   Get-ItemProperty "HKLM:\SOFTWARE\Microsoft\Windows\CurrentVersion\Uninstall\*" |
     Where-Object {$_.DisplayName -like "*Atmos*"}
   ```

3. **Test uninstallation:**
   - Use Windows Settings > Apps
   - Or run uninstaller
   - Verify clean removal

### Windows Version Testing

Test on multiple Windows versions:
- [ ] Windows 10 (21H2 or later)
- [ ] Windows 11 (22H2 or later)
- [ ] Windows Server (if applicable)

---

## UI/UX Testing

### Visual Testing

1. **Glass Morphism Effect:**
   - [ ] Background is semi-transparent
   - [ ] Blur effect applied correctly
   - [ ] Border glow animation works
   - [ ] No visual artifacts

2. **Animations:**
   - [ ] Window fades in smoothly on open
   - [ ] Sliders animate smoothly
   - [ ] Session list items animate on add/remove
   - [ ] Mute button transitions smoothly

3. **Responsiveness:**
   - [ ] Layout adapts to different window sizes
   - [ ] Sliders respond immediately to input
   - [ ] No lag in UI updates
   - [ ] Scrolling is smooth

### Interaction Testing

1. **Window Controls:**
   - [ ] Draggable header works
   - [ ] Close button hides window
   - [ ] Window stays on top of other windows
   - [ ] Doesn't steal focus inappropriately

2. **Volume Controls:**
   - [ ] Master volume slider works
   - [ ] Per-app volume sliders work
   - [ ] Mute buttons toggle correctly
   - [ ] Visual feedback is immediate

3. **Keyboard Navigation:**
   - [ ] Tab key navigates controls
   - [ ] Enter key activates buttons
   - [ ] Arrow keys control sliders
   - [ ] Esc key closes window

### Accessibility

- [ ] All controls are keyboard accessible
- [ ] ARIA labels present for screen readers
- [ ] Sufficient color contrast
- [ ] Focus indicators visible
- [ ] Text is readable at all sizes

---

## Build Testing

### Development Build

```bash
npm run dev
```

**Verify:**
- [ ] App launches quickly (<5 seconds)
- [ ] DevTools available
- [ ] Hot reload works
- [ ] Source maps load correctly

### Production Build

```bash
# Linux
npm run build:linux

# Windows
npm run build:win

# All platforms
npm run build:all
```

**Verify:**
- [ ] Build completes without errors
- [ ] All files present in `release/` directory
- [ ] File sizes are reasonable
- [ ] No source maps in production build

### Package Integrity

1. **AppImage (Linux):**
   ```bash
   # Extract and inspect
   ./Atmos-Controller-*.AppImage --appimage-extract
   ls squashfs-root/

   # Verify all dependencies bundled
   ldd squashfs-root/atmos-controller
   ```

2. **Debian Package:**
   ```bash
   # Inspect contents
   dpkg-deb -c atmos-controller_*_amd64.deb

   # Check control file
   dpkg-deb -I atmos-controller_*_amd64.deb
   ```

3. **RPM Package:**
   ```bash
   # Inspect contents
   rpm -qlp atmos-controller-*.rpm

   # Check metadata
   rpm -qip atmos-controller-*.rpm
   ```

4. **Windows Installer:**
   - Run in Windows Sandbox
   - Verify all files installed
   - Check Start Menu shortcuts
   - Test uninstaller

---

## Performance Testing

### Resource Usage

1. **Memory Usage:**
   ```bash
   # Linux
   ps aux | grep atmos-controller
   top -p $(pgrep atmos-controller)

   # Expected: <100MB RAM
   ```

2. **CPU Usage:**
   - **Idle:** <1%
   - **Active (UI open):** <5%
   - **During volume changes:** <10%

3. **Startup Time:**
   - **Cold start:** <5 seconds
   - **Hot start:** <2 seconds

### Audio Latency

1. **Volume Change Latency:**
   ```bash
   # Measure time from slider input to actual volume change
   # Expected: <100ms for pactl commands
   # Expected: <50ms for native bindings (future)
   ```

2. **Session Detection:**
   - New audio sessions should appear within 2 seconds
   - Closed sessions should disappear within 2 seconds

### Stress Testing

1. **Multiple Sessions:**
   - Open 10+ applications playing audio
   - Verify all sessions detected
   - Test responsiveness with many sliders

2. **Rapid Changes:**
   - Rapidly move multiple sliders
   - Toggle mute repeatedly
   - Verify no crashes or hangs

3. **Extended Runtime:**
   - Leave app running for 24+ hours
   - Monitor for memory leaks
   - Verify continued responsiveness

---

## Automated Testing (Future)

### Unit Tests
```bash
# To be implemented
npm run test:unit
```

### Integration Tests
```bash
# To be implemented
npm run test:integration
```

### E2E Tests
```bash
# To be implemented
npm run test:e2e
```

---

## Bug Reporting

When reporting bugs, include:

1. **Platform Information:**
   - OS and version
   - Desktop environment (Linux)
   - Audio system (PulseAudio/PipeWire)

2. **Steps to Reproduce:**
   - Detailed steps
   - Expected behavior
   - Actual behavior

3. **Logs:**
   ```bash
   # Linux
   journalctl --user -u atmos-controller

   # Or console output
   atmos-controller 2>&1 | tee atmos-error.log
   ```

4. **Screenshots/Videos:**
   - Visual bugs require screenshots
   - Complex issues benefit from screen recordings

---

## Continuous Testing

Before every commit:
- [ ] App builds successfully
- [ ] No console errors in dev mode
- [ ] Basic functionality works

Before every PR:
- [ ] All existing features still work
- [ ] New features have been tested
- [ ] Tested on target platform(s)
- [ ] Documentation updated if needed

Before every release:
- [ ] Full testing checklist completed
- [ ] Tested on multiple distributions (Linux)
- [ ] Tested on multiple Windows versions
- [ ] Performance benchmarks meet targets
- [ ] No known critical bugs

---

## Test Environment Setup

### Linux Test VMs

Recommended test environments:
- Ubuntu 22.04 LTS (GNOME)
- Fedora 39 (GNOME/KDE)
- Arch Linux (various DEs)
- Pop!_OS 22.04 (GNOME)

### Windows Test VMs

- Windows 10 Pro (latest)
- Windows 11 Pro (latest)

### VM Tools

- VirtualBox
- GNOME Boxes (Linux)
- Hyper-V (Windows)
- Windows Sandbox (for quick Windows tests)

---

## Questions?

If you encounter issues during testing, please:
1. Check existing [Issues](https://github.com/Idk-what-im-doin9/atmosController/issues)
2. Open a new issue with detailed information
3. Include all relevant logs and screenshots
