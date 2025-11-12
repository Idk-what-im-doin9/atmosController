# Linux Setup Guide for Atmos Controller

Complete guide for installing, configuring, and troubleshooting Atmos Controller on Linux.

## Quick Start

### 1. Install

Choose your preferred installation method:

**AppImage (Universal)**
```bash
chmod +x Atmos-Controller-*.AppImage
./Atmos-Controller-*.AppImage
```

**Debian/Ubuntu**
```bash
sudo dpkg -i atmos-controller_*_amd64.deb
```

**Fedora/RHEL**
```bash
sudo dnf install atmos-controller-*.rpm
```

### 2. Verify Audio System

```bash
# Check if audio system is running
systemctl --user status pulseaudio
# or
systemctl --user status pipewire pipewire-pulse

# Test pactl command
pactl info
```

### 3. Launch

```bash
# From application menu
# Search for "Atmos Controller"

# Or from terminal
atmos-controller

# Toggle with hotkey
# Press: Alt+Shift+D (Windows key + Shift + D)
```

---

## System Requirements

### Minimum Requirements

- **OS:** Any modern Linux distribution (kernel 4.15+)
- **Audio:** PulseAudio 12.0+ or PipeWire 0.3+
- **Display:** X11 or Wayland with compositor
- **RAM:** 512MB available
- **Disk:** 150MB free space

### Recommended Requirements

- **OS:** Ubuntu 22.04+, Fedora 38+, or Arch Linux
- **Audio:** PipeWire 0.3.65+ (better performance)
- **Display:** Wayland with native transparency
- **RAM:** 1GB available
- **Disk:** 250MB free space

---

## Detailed Installation

### Pre-Installation Checks

1. **Check your distribution:**
   ```bash
   cat /etc/os-release
   ```

2. **Verify audio system:**
   ```bash
   # Check for PulseAudio
   pulseaudio --check
   pactl info

   # Or check for PipeWire
   systemctl --user is-active pipewire
   pw-cli info
   ```

3. **Verify compositor (for transparency):**
   ```bash
   # X11
   ps aux | grep -E 'picom|compton|compiz'

   # Wayland
   echo $WAYLAND_DISPLAY  # Should show wayland-0 or similar
   ```

### Installation Methods

#### AppImage

**Advantages:**
- Works on all distributions
- No installation required
- Portable
- No dependency conflicts

**Installation:**
```bash
# Download
wget https://github.com/Idk-what-im-doin9/atmosController/releases/latest/download/Atmos-Controller-*.AppImage

# Make executable
chmod +x Atmos-Controller-*.AppImage

# Run
./Atmos-Controller-*.AppImage

# Optional: Integrate with desktop
# Install appimagelauncher for automatic integration
```

**Create desktop entry manually:**
```bash
mkdir -p ~/.local/share/applications
cat > ~/.local/share/applications/atmos-controller.desktop <<EOL
[Desktop Entry]
Name=Atmos Controller
Comment=Audio volume mixer
Exec=/path/to/Atmos-Controller-*.AppImage
Icon=audio-volume-high
Type=Application
Categories=AudioVideo;Audio;Mixer;
EOL
```

#### Debian/Ubuntu (.deb)

**Installation:**
```bash
# Method 1: Using dpkg
sudo dpkg -i atmos-controller_*_amd64.deb
sudo apt-get install -f  # Fix dependencies

# Method 2: Using apt (if in local directory)
sudo apt install ./atmos-controller_*_amd64.deb
```

**Verify installation:**
```bash
dpkg -l | grep atmos
which atmos-controller
```

**Uninstallation:**
```bash
sudo apt remove atmos-controller
# or
sudo dpkg -r atmos-controller
```

#### Fedora/RHEL (.rpm)

**Installation:**
```bash
# Method 1: Using dnf
sudo dnf install atmos-controller-*.rpm

# Method 2: Using rpm
sudo rpm -i atmos-controller-*.rpm
```

**Verify installation:**
```bash
rpm -qa | grep atmos
which atmos-controller
```

**Uninstallation:**
```bash
sudo dnf remove atmos-controller
# or
sudo rpm -e atmos-controller
```

#### Arch Linux

**From AUR:**
```bash
# Using yay
yay -S atmos-controller

# Using paru
paru -S atmos-controller

# Manual from AUR
git clone https://aur.archlinux.org/atmos-controller.git
cd atmos-controller
makepkg -si
```

**From tarball:**
```bash
tar -xzf atmos-controller-*.tar.gz
cd atmos-controller
sudo cp -r * /usr/local/
```

---

## Configuration

### Config File Location

```
~/.config/atmoscontroller/config.json
```

### Default Configuration

```json
{
  "hotkey": "Alt+Shift+D",
  "transparency": 0.85,
  "alwaysOnTop": true,
  "startMinimized": false,
  "theme": "dark"
}
```

### Customization

**Change hotkey:**
```json
{
  "hotkey": "Super+A"
}
```

**Adjust transparency:**
```json
{
  "transparency": 0.9
}
```

---

## Audio System Setup

### PulseAudio

**Installation:**
```bash
# Ubuntu/Debian
sudo apt install pulseaudio pulseaudio-utils

# Fedora
sudo dnf install pulseaudio pulseaudio-utils

# Arch
sudo pacman -S pulseaudio pulseaudio-alsa
```

**Start PulseAudio:**
```bash
systemctl --user start pulseaudio
systemctl --user enable pulseaudio
```

**Verify:**
```bash
pactl info
pactl list sinks
pactl list sink-inputs
```

### PipeWire (Recommended)

**Installation:**
```bash
# Ubuntu 22.04+
sudo apt install pipewire pipewire-pulse wireplumber

# Fedora 34+
sudo dnf install pipewire pipewire-pulseaudio wireplumber

# Arch
sudo pacman -S pipewire pipewire-pulse wireplumber
```

**Enable PipeWire:**
```bash
systemctl --user enable --now pipewire pipewire-pulse wireplumber
```

**Verify:**
```bash
pw-cli info
pw-cli ls Node
pactl info  # Should show PipeWire
```

**Switch from PulseAudio to PipeWire:**
```bash
# Stop PulseAudio
systemctl --user stop pulseaudio
systemctl --user disable pulseaudio
systemctl --user mask pulseaudio

# Start PipeWire
systemctl --user enable --now pipewire pipewire-pulse
```

---

## Desktop Environment Specific Setup

### GNOME

**Extensions (optional):**
- Top Bar Transparency
- Compiz alike magic lamp effect

**Settings:**
```bash
# Allow apps to stay on top
gsettings set org.gnome.desktop.wm.preferences raise-on-click false
```

### KDE Plasma

**Window Rules:**
1. Right-click title bar of Atmos Controller
2. More Actions → Special Window Settings
3. Add rules:
   - "Keep above others" → Force → Yes
   - "Skip taskbar" → Force → Yes (optional)

### XFCE

**Compositor Settings:**
1. Settings → Window Manager Tweaks
2. Compositor tab
3. Enable "Show shadows under dock windows"
4. Enable "Show shadows under regular windows"

### i3/Sway

**Config:**
```
# ~/.config/i3/config or ~/.config/sway/config

# Float Atmos Controller
for_window [class="Atmos Controller"] floating enable
for_window [class="Atmos Controller"] sticky enable

# Hotkey
bindsym $mod+Shift+d exec atmos-controller
```

---

## Troubleshooting

### App Won't Launch

**Check dependencies:**
```bash
# Run the app from terminal to see errors
atmos-controller

# Check for missing libraries
ldd $(which atmos-controller) | grep "not found"
```

**Common issues:**
```bash
# Missing libnotify
sudo apt install libnotify4       # Ubuntu/Debian
sudo dnf install libnotify        # Fedora
sudo pacman -S libnotify          # Arch

# Missing libappindicator
sudo apt install libappindicator1 # Ubuntu/Debian
sudo dnf install libappindicator  # Fedora
sudo pacman -S libappindicator-gtk3  # Arch
```

### No Audio Sessions Detected

**Check audio system:**
```bash
# PulseAudio
pactl list sink-inputs

# Should show running audio sources
# If empty, no apps are playing audio
```

**Verify pactl works:**
```bash
# Play audio in another app (browser, music player)
# Then check:
pactl list sink-inputs | grep "application.name"
```

**Restart audio system:**
```bash
# PulseAudio
systemctl --user restart pulseaudio

# PipeWire
systemctl --user restart pipewire pipewire-pulse
```

### Transparency Not Working

**Check compositor:**
```bash
# X11 - Install a compositor
sudo apt install picom
picom &

# Or compton
sudo apt install compton
compton &

# Start compositor on boot
# Add to ~/.xinitrc or autostart
```

**Check window manager:**
```bash
# Some window managers need explicit transparency support
# For i3, use picom with:
picom --backend glx &
```

### Hotkey Not Working

**Check for conflicts:**
```bash
# GNOME
gsettings list-recursively | grep -i "super.*shift.*d"

# List all keybindings
gsettings list-recursively org.gnome.desktop.wm.keybindings
gsettings list-recursively org.gnome.settings-daemon.plugins.media-keys
```

**Change hotkey in config:**
```json
{
  "hotkey": "Super+A"
}
```

**Manual workaround:**
Create a custom keyboard shortcut in your DE settings pointing to:
```bash
atmos-controller --toggle
```

### High CPU/Memory Usage

**Check resource usage:**
```bash
top -p $(pgrep atmos-controller)
```

**Expected values:**
- Memory: <100MB
- CPU (idle): <1%
- CPU (active): <5%

**If higher:**
1. Check for audio system issues
2. Verify no infinite loops in logs
3. Report as bug with details

### Permission Issues

**Check audio group:**
```bash
# Add user to audio group
sudo usermod -aG audio $USER

# Log out and back in for changes to take effect
```

**Check PulseAudio socket:**
```bash
ls -la /run/user/$(id -u)/pulse/
# Should show native socket
```

---

## Advanced Configuration

### Autostart

**System-wide:**
```bash
sudo cp /usr/share/applications/atmos-controller.desktop /etc/xdg/autostart/
```

**User-specific:**
```bash
mkdir -p ~/.config/autostart
cp /usr/share/applications/atmos-controller.desktop ~/.config/autostart/
```

**For i3/Sway:**
```
# ~/.config/i3/config
exec --no-startup-id atmos-controller --minimized
```

### System Tray Integration

**For systems without system tray:**
```bash
# Install system tray
sudo apt install gnome-shell-extension-appindicator  # GNOME
# or
sudo pacman -S plasma-systray-latte                  # KDE
```

### Audio Latency Tuning

**PulseAudio:**
```bash
# Edit ~/.config/pulse/daemon.conf
default-fragments = 4
default-fragment-size-msec = 5
```

**PipeWire:**
```bash
# Edit ~/.config/pipewire/pipewire.conf
default.clock.rate = 48000
default.clock.quantum = 1024
default.clock.min-quantum = 512
default.clock.max-quantum = 2048
```

---

## Building from Source

See [README.md](../README.md#building-from-source) for detailed build instructions.

**Quick build:**
```bash
git clone https://github.com/Idk-what-im-doin9/atmosController.git
cd atmosController
npm install
npm run build:linux
```

---

## Getting Help

1. **Check logs:**
   ```bash
   journalctl --user -xe | grep atmos
   ```

2. **Run with debug output:**
   ```bash
   DEBUG=* atmos-controller
   ```

3. **Community support:**
   - GitHub Issues: [Report bugs](https://github.com/Idk-what-im-doin9/atmosController/issues)
   - GitHub Discussions: [Ask questions](https://github.com/Idk-what-im-doin9/atmosController/discussions)

---

## Uninstallation

### Complete Removal

```bash
# Remove application
sudo apt remove atmos-controller     # Ubuntu/Debian
sudo dnf remove atmos-controller     # Fedora
sudo pacman -R atmos-controller      # Arch

# Remove config files
rm -rf ~/.config/atmoscontroller
rm -rf ~/.local/share/atmoscontroller
rm -rf ~/.cache/atmoscontroller

# Remove desktop entry
rm ~/.local/share/applications/atmos-controller.desktop
```

---

## Additional Resources

- [Main README](../README.md)
- [Contributing Guide](../CONTRIBUTING.md)
- [Testing Guide](TESTING.md)
- [GitHub Repository](https://github.com/Idk-what-im-doin9/atmosController)
