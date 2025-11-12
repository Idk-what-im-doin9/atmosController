# Assets Directory

This directory should contain application icons for different platforms.

## Required Files

### For Linux Builds
- `icon.png` - Application icon (512x512 pixels recommended)
  - Used for .deb, .rpm, AppImage
  - Format: PNG with transparency
  - Should include the app logo/branding

### For Windows Builds
- `icon.ico` - Windows icon file
  - Should contain multiple sizes: 16x16, 32x32, 48x48, 256x256
  - Format: ICO (Windows icon format)

## Creating Icons

### From SVG (Recommended)

If you have an SVG source:

```bash
# Install imagemagick
sudo apt install imagemagick  # Ubuntu/Debian
sudo dnf install imagemagick  # Fedora
sudo pacman -S imagemagick    # Arch

# Create PNG
convert -background none -size 512x512 icon.svg icon.png

# Create ICO
convert icon.png -define icon:auto-resize=256,128,96,64,48,32,16 icon.ico
```

### From PNG

If you have a PNG:

```bash
# Ensure it's 512x512
convert icon.png -resize 512x512 icon.png

# Create ICO
convert icon.png -define icon:auto-resize=256,128,96,64,48,32,16 icon.ico
```

## Design Guidelines

- **Simple and Clear**: Icon should be recognizable at small sizes
- **Relevant**: Should represent audio/volume control
- **Professional**: Clean, modern design
- **Transparent Background**: Use transparency for non-square designs
- **Consistent**: Match the app's glass morphism aesthetic

## Suggestions

Consider these icon concepts:
- Volume/speaker symbol with modern design
- Waveform visualization
- Equalizer bars
- Audio mixing controls
- Atmospheric/cloud theme (matching "Atmos" name)

## Tools

- **Inkscape** - Free SVG editor (recommended)
- **GIMP** - Free raster image editor
- **Figma** - Free online design tool
- **ImageMagick** - Command-line image conversion

## Once Icons are Ready

1. Place `icon.png` and `icon.ico` in this directory
2. Verify they're referenced correctly in `package.json`
3. Test build process:
   ```bash
   npm run build:linux
   npm run build:win
   ```
4. Check that icons appear correctly in built packages
