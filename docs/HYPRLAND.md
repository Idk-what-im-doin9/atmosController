# Hyprland Setup Guide for Atmos Controller

This guide provides specific instructions for running Atmos Controller on Hyprland.

## Quick Setup

### 1. Window Rules

Add these window rules to your `~/.config/hypr/hyprland.conf`:

```conf
# Atmos Controller window rules
windowrulev2 = float, class:^(atmos-controller)$
windowrulev2 = noblur, class:^(atmos-controller)$
windowrulev2 = noborder, class:^(atmos-controller)$
windowrulev2 = noshadow, class:^(atmos-controller)$
windowrulev2 = noanim, class:^(atmos-controller)$
windowrulev2 = pin, class:^(atmos-controller)$
```

### 2. Keybinding

Since Electron apps can't register global shortcuts in Wayland/Hyprland, add this keybinding to your Hyprland config:

```conf
# Toggle Atmos Controller
bind = ALT SHIFT, D, exec, pkill atmos-controller || atmos-controller
```

Or if running from the repository:

```conf
bind = ALT SHIFT, D, exec, ~/.config/hypr/scripts/toggle-atmos.sh
```

Create the toggle script (`~/.config/hypr/scripts/toggle-atmos.sh`):

```bash
#!/bin/bash
if pgrep -f "atmos-controller" > /dev/null; then
    pkill -f "atmos-controller"
else
    cd /path/to/atmosController
    ELECTRON_OZONE_PLATFORM_HINT=auto npm run dev &
fi
```

Make it executable:
```bash
chmod +x ~/.config/hypr/scripts/toggle-atmos.sh
```

### 3. Reload Hyprland Config

```bash
hyprctl reload
```

## Environment Variables

For best results with Wayland/Hyprland, set these environment variables:

```bash
export ELECTRON_OZONE_PLATFORM_HINT=auto
```

Add to your `~/.config/hypr/hyprland.conf`:

```conf
env = ELECTRON_OZONE_PLATFORM_HINT,auto
```

## Transparency Issues

If you still see a grey/translucent background:

1. **Check your blur settings** in Hyprland:
   ```conf
   decoration {
       blur {
           enabled = yes
           size = 3
           passes = 1
       }
   }
   ```

2. **Ensure window rules are applied**:
   ```bash
   hyprctl clients | grep atmos
   ```

3. **Try disabling blur for the window**:
   ```conf
   windowrulev2 = noblur, class:^(atmos-controller)$
   ```

## Common Issues

### Window Not Floating
- Make sure the window rule for `float` is active
- Check the class name: `hyprctl clients | grep -A 10 atmos`

### Keybind Not Working
- Electron apps cannot register global shortcuts in Wayland
- You **must** use Hyprland's built-in keybinding system (see above)
- Reload Hyprland config after adding the bind

### Window Has Decorations/Borders
- Ensure `noborder` window rule is applied
- Try adding `windowrulev2 = rounding 0, class:^(atmos-controller)$`

### Performance Issues
- Disable animations for this window:
  ```conf
  windowrulev2 = noanim, class:^(atmos-controller)$
  ```

## Advanced Configuration

### Custom Window Position

Position the window at specific screen location:

```conf
windowrulev2 = float, class:^(atmos-controller)$
windowrulev2 = move 100 100, class:^(atmos-controller)$
windowrulev2 = size 800 600, class:^(atmos-controller)$
```

### Workspace Rules

Keep Atmos Controller on all workspaces:

```conf
windowrulev2 = pin, class:^(atmos-controller)$
```

Or keep it on a specific workspace:

```conf
windowrulev2 = workspace 9 silent, class:^(atmos-controller)$
```

### Opacity Control

If you want to adjust the window opacity:

```conf
windowrulev2 = opacity 0.95, class:^(atmos-controller)$
```

## Testing Your Setup

1. **Launch the app**:
   ```bash
   cd /path/to/atmosController
   ELECTRON_OZONE_PLATFORM_HINT=auto npm run dev
   ```

2. **Check if window rules are applied**:
   ```bash
   hyprctl clients | grep -A 15 atmos-controller
   ```

   You should see your rules listed.

3. **Test the keybind**:
   - Press `Alt+Shift+D`
   - The app should toggle visibility

## Complete Hyprland Config Example

Add this section to your `~/.config/hypr/hyprland.conf`:

```conf
# ===== Atmos Controller =====

# Environment variables
env = ELECTRON_OZONE_PLATFORM_HINT,auto

# Window rules
windowrulev2 = float, class:^(atmos-controller)$
windowrulev2 = noblur, class:^(atmos-controller)$
windowrulev2 = noborder, class:^(atmos-controller)$
windowrulev2 = noshadow, class:^(atmos-controller)$
windowrulev2 = noanim, class:^(atmos-controller)$
windowrulev2 = pin, class:^(atmos-controller)$
windowrulev2 = stayfocused, class:^(atmos-controller)$

# Keybinding
bind = ALT SHIFT, D, exec, ~/.config/hypr/scripts/toggle-atmos.sh
```

## Troubleshooting

### Find the Window Class

If the window rules aren't working, find the actual window class:

```bash
hyprctl clients | grep -B 3 -A 10 "atmos\|Atmos"
```

Look for the `class:` field and update your window rules accordingly.

### Debug Mode

Run with debug output:

```bash
ELECTRON_OZONE_PLATFORM_HINT=auto ELECTRON_ENABLE_LOGGING=1 npm run dev
```

## Additional Resources

- [Hyprland Window Rules Documentation](https://wiki.hypr.land/Configuring/Window-Rules/)
- [Hyprland Binds Documentation](https://wiki.hypr.land/Configuring/Binds/)
- [Electron Wayland Support](https://www.electronjs.org/docs/latest/tutorial/wayland-support)

---

**Note**: Global keyboard shortcuts from within Electron do not work on Wayland/Hyprland. This is a limitation of the Wayland protocol, not a bug in Atmos Controller. You must use Hyprland's keybinding system.
