const fs = require('fs');
let code = fs.readFileSync('src/hooks/useQuoteLogic.ts', 'utf8');

// Remove skipping logic for video_production
code = code.replace(
`        if (category === 'video_production') actions.setServiceId('custom_bundle');`,
`        if (category === 'video_production') actions.setServiceId('cam_cap');`
);

fs.writeFileSync('src/hooks/useQuoteLogic.ts', code);
