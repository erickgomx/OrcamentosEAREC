const fs = require('fs');
let code = fs.readFileSync('src/components/ui/Logo.tsx', 'utf8');

code = code.replace(
`              {/* Sharp elegant light sweep */}
              <motion.div
                  initial={{ x: '-150%', skewX: -20, opacity: 0 }}
                  animate={{ x: '150%', skewX: -20, opacity: [0, 1, 0] }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 1.2, ease: [0.25, 1, 0.5, 1] }}
                  className="absolute top-0 bottom-0 z-20 w-[80%] bg-gradient-to-r from-transparent via-white/50 to-transparent blur-sm pointer-events-none"
                  style={{ mixBlendMode: 'overlay' }}
              />
            </>`,
`              {/* Sharp elegant light sweep */}
              <motion.div
                  initial={{ x: '-150%', skewX: -20, opacity: 0 }}
                  animate={{ x: '150%', skewX: -20, opacity: [0, 1, 0] }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 1.2, ease: [0.25, 1, 0.5, 1] }}
                  className="absolute top-0 bottom-0 z-20 w-[80%] bg-gradient-to-r from-transparent via-white/50 to-transparent blur-sm pointer-events-none"
                  style={{ mixBlendMode: 'overlay' }}
              />
              
              {/* Revelando seu melhor text */}
              <motion.div
                  initial={{ opacity: 0, y: 10, filter: 'blur(4px)', scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, filter: 'blur(0px)', scale: 1 }}
                  exit={{ opacity: 0, y: -5, filter: 'blur(4px)', scale: 0.98 }}
                  transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1], delay: 0.1 }}
                  className="absolute -bottom-4 left-0 right-0 z-30 flex justify-center pointer-events-none"
              >
                  <span className="text-[9px] uppercase tracking-[0.4em] text-white/80 font-medium whitespace-nowrap">
                      Revelando seu melhor
                  </span>
              </motion.div>
            </>`
);

fs.writeFileSync('src/components/ui/Logo.tsx', code);
