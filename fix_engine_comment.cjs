const fs = require('fs');
let code = fs.readFileSync('src/core/PricingEngine.ts', 'utf8');

code = code.replace(
  `// O valor de 1.5 já considera a viagem de ida e volta por km de distância`,
  `// O valor do pricePerKm já considera a viagem de ida e volta por km de distância (R$ 3.75)`
);

fs.writeFileSync('src/core/PricingEngine.ts', code);
