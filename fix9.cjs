const fs = require('fs');
let content = fs.readFileSync('src/pages/WelcomeView.tsx', 'utf8');

// Replace these
content = content.replace('                    </div>\n                            </AnimatePresence>', '                    </div>\n                </motion.div>\n            </AnimatePresence>');

fs.writeFileSync('src/pages/WelcomeView.tsx', content);
