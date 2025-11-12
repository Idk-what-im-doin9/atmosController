import { motion } from 'framer-motion'
import { VolumeMixer } from './components/VolumeMixer'

function App() {
  return (
    <div className="w-screen h-screen flex items-center justify-center p-8" style={{ background: 'transparent' }}>
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3, ease: 'easeOut' }}
        className="relative"
        style={{ background: 'transparent' }}
      >
        {/* Main glass window with animated glow */}
        <div className="glass-window glow-border rounded-lg p-6 min-w-[420px] max-w-[500px]">
          {/* Header bar (draggable) */}
          <div className="drag-region mb-6 flex items-center justify-between">
            <h1 className="text-lg font-light text-white/90 tracking-wide">
              ATMOS CONTROLLER
            </h1>
            <div className="no-drag-region flex gap-1.5">
              <button
                onClick={() => window.close()}
                className="w-6 h-6 rounded-full bg-white/5 hover:bg-white/10
                          transition-all duration-200 flex items-center justify-center
                          text-white/60 hover:text-white/90 text-xs border border-white/5"
              >
                ×
              </button>
            </div>
          </div>

          {/* Volume Mixer */}
          <div className="no-drag-region">
            <VolumeMixer />
          </div>

          {/* Minimal info bar */}
          <div className="glass rounded-md px-3 py-1.5 mt-4 no-drag-region flex items-center justify-between">
            <div className="text-[10px] text-white/30 font-light tracking-wider">
              {typeof process !== 'undefined' && process.platform === 'linux' ? 'LINUX BUILD' : 'PHASE 2 COMPLETE'}
            </div>
            <kbd className="px-2 py-0.5 bg-white/5 rounded text-[10px] text-white/40 border border-white/10 font-mono">
              Alt+Shift+D
            </kbd>
          </div>
        </div>
      </motion.div>
    </div>
  )
}

export default App
