const fs = require('fs');
let code = fs.readFileSync('src/data/mock.ts', 'utf8');

code = code.replace(
  `pricePerKm: 1.50,      // Logística: Valor alterado para R$ 1,50/km`,
  `pricePerKm: 3.75,      // Logística: Valor alterado para R$ 3,75/km (ex: Goianinha a Espirito Santo = ~R$ 120 ida e volta)`
);

fs.writeFileSync('src/data/mock.ts', code);
