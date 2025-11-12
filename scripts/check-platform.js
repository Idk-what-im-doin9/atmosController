#!/usr/bin/env node

/**
 * Platform dependency checker for Atmos Controller
 * Runs after npm/yarn install to verify platform requirements
 */

const { platform } = require('os')
const { execSync } = require('child_process')

const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  red: '\x1b[31m',
  cyan: '\x1b[36m'
}

function log(message, color = colors.reset) {
  console.log(`${color}${message}${colors.reset}`)
}

function checkCommand(command) {
  try {
    execSync(`which ${command}`, { stdio: 'ignore' })
    return true
  } catch {
    return false
  }
}

function checkLinuxDependencies() {
  log('\n🔍 Checking Linux audio dependencies...', colors.cyan)

  let hasIssues = false

  // Check for PulseAudio or PipeWire
  if (!checkCommand('pactl')) {
    log('❌ PulseAudio/PipeWire not found', colors.red)
    log('   Atmos Controller requires PulseAudio or PipeWire', colors.yellow)
    log('   Install with:', colors.yellow)
    log('   • Ubuntu/Debian: sudo apt install pulseaudio', colors.yellow)
    log('   • Fedora: sudo dnf install pulseaudio', colors.yellow)
    log('   • Arch: sudo pacman -S pulseaudio', colors.yellow)
    hasIssues = true
  } else {
    log('✅ Audio system detected (PulseAudio/PipeWire)', colors.green)
  }

  // Check for systemd (optional but recommended)
  if (checkCommand('systemctl')) {
    log('✅ systemd detected', colors.green)
  } else {
    log('⚠️  systemd not found (optional)', colors.yellow)
  }

  if (!hasIssues) {
    log('\n✨ All Linux dependencies satisfied!', colors.green)
  } else {
    log('\n⚠️  Some dependencies are missing. The app may not function correctly.', colors.yellow)
  }
}

function checkWindowsDependencies() {
  log('\n🔍 Checking Windows dependencies...', colors.cyan)
  log('✅ Windows Audio Session API (WASAPI) is built into Windows', colors.green)
  log('✨ All Windows dependencies satisfied!', colors.green)
}

function main() {
  const currentPlatform = platform()

  log('═══════════════════════════════════════════', colors.cyan)
  log('  Atmos Controller - Platform Check', colors.cyan)
  log('═══════════════════════════════════════════', colors.cyan)
  log(`\n📦 Platform: ${currentPlatform}`)

  switch (currentPlatform) {
    case 'linux':
      checkLinuxDependencies()
      break
    case 'win32':
      checkWindowsDependencies()
      break
    case 'darwin':
      log('\n⚠️  macOS is not yet supported', colors.yellow)
      log('   Support is planned for future releases', colors.yellow)
      break
    default:
      log(`\n⚠️  Unsupported platform: ${currentPlatform}`, colors.yellow)
  }

  log('\n═══════════════════════════════════════════\n', colors.cyan)
}

// Only run if not being imported
if (require.main === module) {
  main()
}

module.exports = { checkCommand, checkLinuxDependencies }
