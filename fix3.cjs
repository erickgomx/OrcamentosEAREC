const fs = require('fs');
let content = fs.readFileSync('src/pages/WelcomeView.tsx', 'utf8');

// Replace these
content = content.replace(/<AlertCircle size=\{12\} \/> \{errorMessage\}<\/p>\s+\)}/g, '<AlertCircle size={12} /> {errorMessage}</p>\n            </motion.div>\n        )}');

fs.writeFileSync('src/pages/WelcomeView.tsx', content);
