const fs = require('fs');
let code = fs.readFileSync('src/components/quote/UpsellList.tsx', 'utf8');

code = code.replace(
  `            {(category === 'wedding' || category === 'social' || category === 'commercial' || (category === 'video_production' && !isCustomBundle)) && (`,
  `            {(category === 'wedding' || category === 'social' || category === 'commercial' || category === 'video_production') && (
`
);

code = code.replace(
  `const showDroneAddon = !['studio'].includes(category) && !['custom_bundle', 'edit_only'].includes(serviceId);`,
  `const showDroneAddon = !['studio'].includes(category) && !['custom_bundle', 'edit_only', 'drone'].includes(serviceId);`
);

fs.writeFileSync('src/components/quote/UpsellList.tsx', code);
