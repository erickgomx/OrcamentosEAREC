const fs = require('fs');
let code = fs.readFileSync('src/pages/QuoteView.tsx', 'utf8');

const regex = /<User size=\{36\} strokeWidth=\{1\.5\} \/>\s*<\/div>\s*<h3/;
code = code.replace(regex, `<User size={36} strokeWidth={1.5} />\n                        </div>\n                    </div>\n                    <h3`);

fs.writeFileSync('src/pages/QuoteView.tsx', code);
