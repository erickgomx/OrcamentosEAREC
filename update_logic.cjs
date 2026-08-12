const fs = require('fs');
let code = fs.readFileSync('src/hooks/useQuoteLogic.ts', 'utf8');
code = code.replace(
`        if (category === 'video_production') actions.setServiceId('edit_only');`,
`        if (category === 'video_production') actions.setServiceId('custom_bundle');`
);
code = code.replace(
`        } else if (category === 'video_production') {
            actions.setQty(1);
        } else {
            actions.setQty(10);
        }`,
`        } else if (category === 'video_production') {
            actions.setQty(0);
            actions.setVideoQty(0);
        } else {
            actions.setQty(10);
        }`
);
fs.writeFileSync('src/hooks/useQuoteLogic.ts', code);
