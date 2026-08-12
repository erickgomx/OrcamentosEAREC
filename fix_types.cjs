const fs = require('fs');
let code = fs.readFileSync('src/types/index.ts', 'utf8');

code = code.replace(
  `commercialMode?: 'on_location' | 'studio'; // Novo: Define local para categoria Comercial`,
  `commercialMode?: 'on_location' | 'studio'; // Novo: Define local para categoria Comercial
  camCapHours?: number;
  mobileCapHours?: number;
  editQty?: number;`
);

fs.writeFileSync('src/types/index.ts', code);
