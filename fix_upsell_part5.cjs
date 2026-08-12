const fs = require('fs');
let code = fs.readFileSync('src/components/quote/UpsellList.tsx', 'utf8');

// Remove my ControlBtn
code = code.replace(/const ControlBtn = \(\{[^\}]*\}\) => \([\s\S]*?<\/button>\n\);/, '');

// Remove my ServiceCard
code = code.replace(/const ServiceCard = \(\{[^\}]*\}\) => \([\s\S]*?<\/div>\n\);/, '');

// Change the return div back to section
code = code.replace('return (\n    <div className="w-full">', 'return (\n    <section className="w-full">');

fs.writeFileSync('src/components/quote/UpsellList.tsx', code);
