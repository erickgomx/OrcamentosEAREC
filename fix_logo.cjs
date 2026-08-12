const fs = require('fs');
let code = fs.readFileSync('src/components/ui/Logo.tsx', 'utf8');

// Update SvgContent definition to include isShining
code = code.replace(
  `const SvgContent = React.memo(({ shouldAnimate }: { shouldAnimate: boolean }) => (`,
  `const SvgContent = React.memo(({ shouldAnimate, isShining }: { shouldAnimate: boolean; isShining?: boolean }) => (`
);

// Add the text element inside the SVG
const newSvgText = `
    <AnimatePresence>
      {isShining && (
        <motion.text
          fontFamily="sans-serif"
          fontWeight="700"
          fontSize="11"
          fill="#ffffff"
          opacity="0.9"
          className="drop-shadow-[0_0_8px_rgba(255,255,255,0.4)] uppercase"
          initial={{ opacity: 0, y: 70, filter: 'blur(4px)' }}
          animate={{ opacity: 1, y: 65, filter: 'blur(0px)' }}
          exit={{ opacity: 0, y: 60, filter: 'blur(4px)' }}
          transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
          x="140"
          textAnchor="middle"
          textLength="160"
          lengthAdjust="spacing"
        >
          Revelando seu melhor
        </motion.text>
      )}
    </AnimatePresence>
  </svg>`;

code = code.replace(`  </svg>`, newSvgText);

// Update Logo to pass isShining and remove the HTML text
code = code.replace(
  `<SvgContent shouldAnimate={animate} />`,
  `<SvgContent shouldAnimate={animate} isShining={isShining} />`
);

const htmlTextToRemove = `{/* Revelando seu melhor text */}
              <motion.div
                  initial={{ opacity: 0, y: 10, filter: 'blur(4px)', scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, filter: 'blur(0px)', scale: 1 }}
                  exit={{ opacity: 0, y: -5, filter: 'blur(4px)', scale: 0.98 }}
                  transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
                  className="absolute -bottom-3 left-0 right-0 z-30 flex justify-center pointer-events-none"
              >
                  <span className="text-[9px] uppercase tracking-[0.4em] text-white/90 font-bold whitespace-nowrap drop-shadow-[0_0_8px_rgba(255,255,255,0.4)]">
                      Revelando seu melhor
                  </span>
              </motion.div>`;

code = code.replace(htmlTextToRemove, ``);

fs.writeFileSync('src/components/ui/Logo.tsx', code);
