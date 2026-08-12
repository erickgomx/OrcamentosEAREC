const fs = require('fs');
let code = fs.readFileSync('src/components/ui/Logo.tsx', 'utf8');

code = code.replace(
`                  transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1], delay: 0.1 }}
                  className="absolute -bottom-4 left-0 right-0 z-30 flex justify-center pointer-events-none"
              >
                  <span className="text-[9px] uppercase tracking-[0.4em] text-white/80 font-medium whitespace-nowrap">
                      Revelando seu melhor
                  </span>`,
`                  transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
                  className="absolute -bottom-3 left-0 right-0 z-30 flex justify-center pointer-events-none"
              >
                  <span className="text-[9px] uppercase tracking-[0.4em] text-white/90 font-bold whitespace-nowrap drop-shadow-[0_0_8px_rgba(255,255,255,0.4)]">
                      Revelando seu melhor
                  </span>`
);

fs.writeFileSync('src/components/ui/Logo.tsx', code);
