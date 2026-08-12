const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');
code = code.replace(/from '\.\/src\//g, "from './");
fs.writeFileSync('src/App.tsx', code);
