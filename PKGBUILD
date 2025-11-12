# Maintainer: Idk-what-im-doin9 <your-email@example.com>
pkgname=atmos-controller
pkgver=0.1.0
pkgrel=1
pkgdesc="A lightweight, transparent audio control overlay with system-wide volume mixing"
arch=('x86_64')
url="https://github.com/Idk-what-im-doin9/atmosController"
license=('MIT')
depends=('electron28' 'pulseaudio' 'alsa-lib' 'libnotify' 'nss')
makedepends=('npm' 'nodejs' 'git')
optdepends=(
    'pipewire-pulse: PipeWire support'
    'hyprland: Auto-configuration for Hyprland WM'
)
source=("${pkgname}-${pkgver}.tar.gz::${url}/archive/v${pkgver}.tar.gz")
sha256sums=('SKIP')  # Update with actual checksum on release

prepare() {
    cd "${srcdir}/atmosController-${pkgver}"

    # Install npm dependencies
    npm install --cache "${srcdir}/npm-cache"
}

build() {
    cd "${srcdir}/atmosController-${pkgver}"

    # Build the application
    npm run build:linux
}

package() {
    cd "${srcdir}/atmosController-${pkgver}"

    # Install the application
    install -dm755 "${pkgdir}/usr/lib/${pkgname}"
    cp -r release/linux-unpacked/* "${pkgdir}/usr/lib/${pkgname}/"

    # Install binary wrapper
    install -dm755 "${pkgdir}/usr/bin"
    cat > "${pkgdir}/usr/bin/${pkgname}" <<EOF
#!/bin/bash
ELECTRON_OZONE_PLATFORM_HINT=auto exec /usr/bin/electron28 /usr/lib/${pkgname}/resources/app.asar "\$@"
EOF
    chmod +x "${pkgdir}/usr/bin/${pkgname}"

    # Install desktop file
    install -Dm644 "build/linux/${pkgname}.desktop" \
        "${pkgdir}/usr/share/applications/${pkgname}.desktop"

    # Install icon
    install -Dm644 "assets/icon.png" \
        "${pkgdir}/usr/share/pixmaps/${pkgname}.png"

    # Install license
    install -Dm644 LICENSE "${pkgdir}/usr/share/licenses/${pkgname}/LICENSE"

    # Auto-configure Hyprland if installed
    if command -v hyprctl &>/dev/null; then
        echo "Detected Hyprland - configuration will be added on first run"
    fi
}

post_install() {
    echo ""
    echo "==> Atmos Controller has been installed!"
    echo "==> Launch with: atmos-controller"
    echo "==> Or press: Alt+Shift+D (if configured)"
    echo ""

    if command -v hyprctl &>/dev/null; then
        echo "==> Detected Hyprland!"
        echo "==> Add this to your ~/.config/hypr/hyprland.conf:"
        echo ""
        echo "    # Atmos Controller"
        echo "    windowrulev2 = float, class:^(Atmos Controller)$"
        echo "    windowrulev2 = noblur, class:^(Atmos Controller)$"
        echo "    windowrulev2 = noborder, class:^(Atmos Controller)$"
        echo "    windowrulev2 = noshadow, class:^(Atmos Controller)$"
        echo "    windowrulev2 = pin, class:^(Atmos Controller)$"
        echo "    bind = ALT SHIFT, D, exec, pkill atmos-controller || atmos-controller"
        echo ""
    fi

    if ! command -v pactl &>/dev/null; then
        echo "==> WARNING: PulseAudio/PipeWire not detected"
        echo "==> Install with: sudo pacman -S pulseaudio or pipewire-pulse"
    fi
}

post_upgrade() {
    post_install
}
