const fs = require('fs');
let code = fs.readFileSync('src/components/ui/Logo.tsx', 'utf8');

code = code.replace(
  `viewBox="60 -5 240 70"`,
  `viewBox="60 -5 240 85"`
);

fs.writeFileSync('src/components/ui/Logo.tsx', code);
