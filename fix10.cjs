const fs = require('fs');
let content = fs.readFileSync('src/pages/WelcomeView.tsx', 'utf8');

// Replace these
let lines = content.split('\n');
for(let i=0; i<lines.length; i++) {
    if(lines[i].includes('</AnimatePresence>') && lines[i-1] && lines[i-1].includes('</div>')) {
        if(!lines[i-1].includes('</motion.div>')) {
           lines.splice(i, 0, '                </motion.div>');
           break;
        }
    }
}
content = lines.join('\n');
fs.writeFileSync('src/pages/WelcomeView.tsx', content);
