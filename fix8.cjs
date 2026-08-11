const fs = require('fs');
let content = fs.readFileSync('src/pages/WelcomeView.tsx', 'utf8');

// The error says line 324 is `        </div>`
let lines = content.split('\n');
for (let i = 0; i < lines.length; i++) {
    if (lines[i].includes('Passo {currentStep + 1} de {steps.length}')) {
        // i+1 is </p>
        // i+2 is empty
        // i+3 is </div>
        lines[i+3] = '        </motion.div>\n      </div>';
        break;
    }
}

content = lines.join('\n');
fs.writeFileSync('src/pages/WelcomeView.tsx', content);
