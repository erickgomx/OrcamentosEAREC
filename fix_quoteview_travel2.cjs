const fs = require('fs');
let code = fs.readFileSync('src/pages/QuoteView.tsx', 'utf8');

code = code.replace(
  `const travelCost = state.distance > 0 ? (state.distance * 2 * state.quoteData.pricePerKm) : 0;`,
  `const travelCost = state.distance > 0 ? (state.distance * state.quoteData.pricePerKm) : 0;`
);

fs.writeFileSync('src/pages/QuoteView.tsx', code);
