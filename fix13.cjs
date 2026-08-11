const fs = require('fs');
let content = fs.readFileSync('src/pages/WelcomeView.tsx', 'utf8');

// I notice two `<div className="relative z-10 w-full max-w-lg flex flex-col items-center">`
// Let's remove the second one and keep them in the same div.
content = content.replace(
    '        </motion.div>\n      </div>\n      <div className="relative z-10 w-full max-w-lg flex flex-col items-center">\n        {/* STEP CONTENT (WIZARD) */}',
    '        </motion.div>\n\n        {/* STEP CONTENT (WIZARD) */}'
);

fs.writeFileSync('src/pages/WelcomeView.tsx', content);
