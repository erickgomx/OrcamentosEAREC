const fs = require('fs');
let code = fs.readFileSync('src/components/quote/UpsellList.tsx', 'utf8');

code = code.replace(
    "import { AnimatedNumber } from '../ui/AnimatedNumber';",
    "import AnimatedNumber from '../ui/AnimatedNumber';"
);

fs.writeFileSync('src/components/quote/UpsellList.tsx', code);
