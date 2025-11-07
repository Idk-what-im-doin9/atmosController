# Known Issues & Improvements

This document outlines known problems and potential improvements for atmosController.

## Known Issues

### 1. Window Size on Startup
**Problem:** The application opens too small on startup. Users need to manually drag the window vertically to view the UI properly, even though the scroll bar works.

**Impact:** Poor initial user experience requiring manual adjustment every launch.

**Potential Solution:** Increase default window height or implement window size persistence to remember user's preferred dimensions.

---

### 2. Visualiser Bars Freeze When Disabled
**Problem:** When the visualiser is turned off, the bars freeze in their last position instead of disappearing or resetting.

**Impact:** Visual inconsistency - bars remain static on screen when visualiser is disabled.

**Potential Solution:** Clear the canvas or animate bars down to zero height when visualiser is toggled off.

---

### 3. Incorrect Process Name in Task Manager
**Problem:** The application still appears as "ethereal mixer" in Windows Task Manager instead of "atmosController".

**Impact:** Branding inconsistency and confusion for users trying to manage the application process.

**Potential Solution:** Update the product name in build configuration and executable metadata.

---

### 4. UI Layout - Toggle Button Placement
**Problem:** The text on the top left and the visualiser toggle are in separate areas. The visualiser section has empty space that could be better utilized.

**Impact:** Inefficient use of screen space and less cohesive visual design.

**Potential Solution:** Move the top-left text/branding into the same div as the visualiser, placing it where the empty space currently exists. This would create a more unified control panel appearance.

---

### 5. Toggle Should Control Overall App State
**Problem:** The ON/OFF toggle currently only controls the visualiser animation. It doesn't provide clear feedback about whether the entire application is actively working.

**Impact:** Users cannot easily tell if the app is functioning properly or if audio monitoring is active.

**Potential Solution:** Repurpose the toggle to represent the overall application state (audio monitoring + visualiser), making it clear that when ON, the app is actively monitoring and controlling audio, with the visualiser serving as a visual indicator of this active state.

---

## Priority

- **High:** Issue #1 (Window Size) - Affects every launch
- **High:** Issue #3 (Process Name) - Branding consistency
- **Medium:** Issue #5 (Toggle Behavior) - UX clarity improvement
- **Medium:** Issue #4 (UI Layout) - Visual polish
- **Low:** Issue #2 (Frozen Bars) - Minor visual quirk

---

**Last Updated:** 2025-11-08
