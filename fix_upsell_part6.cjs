const fs = require('fs');
let code = fs.readFileSync('src/components/quote/UpsellList.tsx', 'utf8');

// I will just substring it!
const startCB = code.indexOf('const ControlBtn = ({ onClick, icon: Icon, active }');
if (startCB !== -1) {
    const endCB = code.indexOf('</button>\n);', startCB) + '</button>\n);'.length;
    code = code.substring(0, startCB) + code.substring(endCB);
}

const startSC = code.indexOf('const ServiceCard = ({ active, onClick');
if (startSC !== -1) {
    const endSC = code.indexOf('</div>\n);', startSC) + '</div>\n);'.length;
    code = code.substring(0, startSC) + code.substring(endSC);
}

fs.writeFileSync('src/components/quote/UpsellList.tsx', code);
