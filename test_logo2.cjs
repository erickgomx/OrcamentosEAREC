const fs = require('fs');
let code = fs.readFileSync('src/components/ui/Logo.tsx', 'utf8');
code = code.replace(
`className={cn("relative select-none cursor-pointer overflow-hidden rounded-xl group px-4 py-3 pb-6 flex items-center justify-center", className)}`,
`className={cn("relative select-none cursor-pointer overflow-visible rounded-xl group px-2 py-1 flex items-center justify-center", className)}`
);
code = code.replace(
`className="absolute bottom-2 left-0 right-0 z-30 flex justify-center pointer-events-none"`,
`className="absolute -bottom-4 left-0 right-0 z-30 flex justify-center pointer-events-none"`
);

// We need to mask the light sweep so it doesn't look weird when overflow is visible.
// We can wrap the sweep and glow in a `div` with `absolute inset-0 overflow-hidden rounded-xl`!
code = code.replace(
`      <AnimatePresence>
        {isShining && (
            <>
              {/* Radial glow expansion */}
              <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: [0, 1, 0], scale: [0.8, 1.2, 1.4] }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 1.8, ease: "easeOut" }}
                  className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10 w-full h-[300%] bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-brand-DEFAULT/30 via-white/5 to-transparent blur-2xl pointer-events-none"
              />
              {/* Sharp elegant light sweep */}
              <motion.div
                  initial={{ x: '-150%', skewX: -20, opacity: 0 }}
                  animate={{ x: '150%', skewX: -20, opacity: [0, 1, 0] }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 1.2, ease: [0.25, 1, 0.5, 1] }}
                  className="absolute top-0 bottom-0 z-20 w-[80%] bg-gradient-to-r from-transparent via-white/50 to-transparent blur-sm pointer-events-none"
                  style={{ mixBlendMode: 'overlay' }}
              />
              
              {/* Revelando seu melhor text */}
              <motion.div`,
`      <AnimatePresence>
        {isShining && (
            <>
              <div className="absolute inset-0 overflow-hidden rounded-xl pointer-events-none z-10">
                {/* Radial glow expansion */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: [0, 1, 0], scale: [0.8, 1.2, 1.4] }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 1.8, ease: "easeOut" }}
                    className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-[300%] bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-brand-DEFAULT/30 via-white/5 to-transparent blur-2xl pointer-events-none"
                />
                {/* Sharp elegant light sweep */}
                <motion.div
                    initial={{ x: '-150%', skewX: -20, opacity: 0 }}
                    animate={{ x: '150%', skewX: -20, opacity: [0, 1, 0] }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 1.2, ease: [0.25, 1, 0.5, 1] }}
                    className="absolute top-0 bottom-0 w-[80%] bg-gradient-to-r from-transparent via-white/50 to-transparent blur-sm pointer-events-none"
                    style={{ mixBlendMode: 'overlay' }}
                />
              </div>
              
              {/* Revelando seu melhor text */}
              <motion.div`
);

fs.writeFileSync('src/components/ui/Logo.tsx', code);
