const fs = require('fs');
let code = fs.readFileSync('src/components/quote/UpsellList.tsx', 'utf8');

code = code.replace(/TABLE\.social\.event/g, "TABLE.social.social_party");
code = code.replace(/TABLE\.social\.party/g, "TABLE.social.social_party");

// Replace 'getIncrementPrice' with nothing or formatCurrency?
// wait, where is getIncrementPrice called?
