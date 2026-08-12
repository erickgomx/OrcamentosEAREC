const fs = require('fs');
let code = fs.readFileSync('src/components/quote/UpsellList.tsx', 'utf8');

code = code.replace(/TABLE\.social\.event/g, "TABLE.social.social_party");
code = code.replace(/TABLE\.social\.party/g, "TABLE.social.social_party");
code = code.replace(/icon=\{Timer\}/g, "icon={Clock}");
code = code.replace(/onOpenMap\(\)/g, "setIsMapOpen(true)");

fs.writeFileSync('src/components/quote/UpsellList.tsx', code);
