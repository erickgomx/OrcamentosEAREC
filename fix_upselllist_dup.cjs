const fs = require('fs');
let code = fs.readFileSync('src/components/quote/UpsellList.tsx', 'utf8');

code = code.replace(
  `{category === 'video_production' && (
                  {category === 'video_production' && (`,
  `{category === 'video_production' && (`
);

fs.writeFileSync('src/components/quote/UpsellList.tsx', code);
