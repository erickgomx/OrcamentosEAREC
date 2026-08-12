const fs = require('fs');
let code = fs.readFileSync('src/core/PricingEngine.ts', 'utf8');

code = code.replace(
  `const freight = (distance * 2 * pricePerKm);`,
  `// O valor de 1.5 já considera a viagem de ida e volta por km de distância
        const freight = (distance * pricePerKm);`
);

fs.writeFileSync('src/core/PricingEngine.ts', code);
