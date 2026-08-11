const fs = require('fs');
let content = fs.readFileSync('src/pages/WelcomeView.tsx', 'utf8');

// Use regex to replace
content = content.replace(/<Loader2 size=\{20\} className="animate-spin text-neutral-500" \/>\s+\)}/g, '<Loader2 size={20} className="animate-spin text-neutral-500" />\n              </motion.div>\n            )}');

content = content.replace(/<CheckCircle2 size=\{22\} className="text-emerald-500" \/>\s+\)}/g, '<CheckCircle2 size={22} className="text-emerald-500" />\n              </motion.div>\n            )}');

content = content.replace(/<XCircle size=\{22\} className="text-red-500" \/>\s+\)}/g, '<XCircle size={22} className="text-red-500" />\n               </motion.div>\n            )}');

fs.writeFileSync('src/pages/WelcomeView.tsx', content);
