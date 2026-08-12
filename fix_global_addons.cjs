const fs = require('fs');
let code = fs.readFileSync('src/core/PricingEngine.ts', 'utf8');

code = code.replace(
`    if (addDrone && !isCommercialStudio && (category === 'wedding' || category === 'social' || category === 'commercial' || category === 'video_production')) {`,
`    if (addDrone && !isCommercialStudio && (category === 'wedding' || category === 'social' || category === 'commercial' || (category === 'video_production' && state.serviceId !== 'custom_bundle'))) {`
);

code = code.replace(
`    if (addRealTime && (category === 'wedding' || category === 'social' || category === 'commercial' || category === 'video_production')) {`,
`    if (addRealTime && (category === 'wedding' || category === 'social' || category === 'commercial' || (category === 'video_production'))) {`
); // Realtime IS used in custom_bundle via addRealTime

fs.writeFileSync('src/core/PricingEngine.ts', code);
