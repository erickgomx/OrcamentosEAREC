const fs = require('fs');
let code = fs.readFileSync('src/components/ui/Logo.tsx', 'utf8');

code = code.replace(
  `x="140"`,
  `x="180"`
);

fs.writeFileSync('src/components/ui/Logo.tsx', code);
