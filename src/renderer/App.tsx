import { motion } from 'framer-motion'

function App() {
  return (
    <div className="w-screen h-screen flex items-center justify-center p-8">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3, ease: 'easeOut' }}
        className="relative"
      >
        {/* Main glass window with animated glow */}
        <div className="glass-window glow-border rounded-lg p-6 min-w-[540px]">
          {/* Header bar (draggable) */}
          <div className="drag-region mb-8 flex items-center justify-between">
            <h1 className="text-lg font-light text-white/90 tracking-wide">
              ETHEREAL MIXER
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

          {/* Feature cards */}
          <div className="grid grid-cols-3 gap-3 mb-6 no-drag-region">
            <div className="glass-dark rounded-md p-4 hover:bg-white/3 transition-all duration-150 cursor-pointer border border-white/5 hover:border-white/10">
              <div className="text-white/40 text-xs font-light mb-1">MIXER</div>
              <div className="text-white/20 text-[10px]">Phase 2</div>
            </div>

            <div className="glass-dark rounded-md p-4 hover:bg-white/3 transition-all duration-150 cursor-pointer border border-white/5 hover:border-white/10">
              <div className="text-white/40 text-xs font-light mb-1">VISUALIZER</div>
              <div className="text-white/20 text-[10px]">Phase 3</div>
            </div>

            <div className="glass-dark rounded-md p-4 hover:bg-white/3 transition-all duration-150 cursor-pointer border border-white/5 hover:border-white/10">
              <div className="text-white/40 text-xs font-light mb-1">SETTINGS</div>
              <div className="text-white/20 text-[10px]">Phase 4</div>
            </div>
          </div>

          {/* Minimal info bar */}
          <div className="glass rounded-md px-3 py-2 no-drag-region flex items-center justify-between">
            <div className="text-[10px] text-white/30 font-light tracking-wider">
              PHASE 1 COMPLETE
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
