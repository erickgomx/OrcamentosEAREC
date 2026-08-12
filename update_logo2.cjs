const fs = require('fs');
let code = fs.readFileSync('src/components/ui/Logo.tsx', 'utf8');

code = code.replace(
`className="absolute -bottom-4 left-0 right-0 z-30 flex justify-center pointer-events-none"`,
`className="absolute bottom-1 left-0 right-0 z-30 flex justify-center pointer-events-none"`
);

fs.writeFileSync('src/components/ui/Logo.tsx', code);
