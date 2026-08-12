const fs = require('fs');
let code = fs.readFileSync('src/components/quote/UpsellList.tsx', 'utf8');

code = code.replace(/onClick=\{onOpenMap\}/g, "onClick={() => setIsMapOpen(true)}");

fs.writeFileSync('src/components/quote/UpsellList.tsx', code);
