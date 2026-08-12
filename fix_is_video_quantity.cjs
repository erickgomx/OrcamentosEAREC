const fs = require('fs');
let code = fs.readFileSync('src/components/quote/UpsellList.tsx', 'utf8');

code = code.replace(
  `const isVideoQuantity = serviceId === 'comm_video';`,
  `const isVideoQuantity = serviceId === 'comm_video' || serviceId === 'edit_only';`
);

fs.writeFileSync('src/components/quote/UpsellList.tsx', code);
