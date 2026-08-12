const fs = require('fs');
let code = fs.readFileSync('src/components/quote/UpsellList.tsx', 'utf8');

code = code.replace(
    "import { AppConfig } from '../../AppConfig';",
    "import { AppConfig } from '../../config/AppConfig';"
);

fs.writeFileSync('src/components/quote/UpsellList.tsx', code);
