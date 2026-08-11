const fs = require('fs');
let content = fs.readFileSync('src/pages/WelcomeView.tsx', 'utf8');

content = content.replace(/<\/motion.div>\n            <\/AnimatePresence>/g, '</AnimatePresence>');
content = content.replace(/<\/motion.div>\n              <\/AnimatePresence>/g, '</AnimatePresence>');
content = content.replace(/<\/motion.div>\n        <\/AnimatePresence>/g, '</AnimatePresence>');

// Now add it ONLY at the end of the wizard
content = content.replace('                    </div>\n                            </AnimatePresence>', '                    </div>\n                </motion.div>\n            </AnimatePresence>');

fs.writeFileSync('src/pages/WelcomeView.tsx', content);
