const fs = require('fs');
let content = fs.readFileSync('src/components/ui/Logo.tsx', 'utf8');
content = content.replace(
    '       fill="#E5E5E5" \n       letterSpacing="-3"\n      className="drop-shadow-sm"',
    '       fill="#E5E5E5" \n       stroke="#E5E5E5"\n       strokeWidth="1.5"\n       letterSpacing="-3"\n      className="drop-shadow-sm"'
);
fs.writeFileSync('src/components/ui/Logo.tsx', content);
