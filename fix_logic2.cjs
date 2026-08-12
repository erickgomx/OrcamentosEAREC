const fs = require('fs');
let code = fs.readFileSync('src/hooks/useQuoteLogic.ts', 'utf8');

code = code.replace(
  `        if (category === 'video_production') {
            actions.setQty(0);
            actions.setVideoQty(0);
        }`,
  `        if (category === 'video_production') {
            actions.setQty(1);
        }`
);

fs.writeFileSync('src/hooks/useQuoteLogic.ts', code);
