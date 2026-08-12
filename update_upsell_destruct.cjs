const fs = require('fs');
let code = fs.readFileSync('src/components/quote/UpsellList.tsx', 'utf8');
code = code.replace(
`    hours, setHours, qty, setQty, videoQty = 1, setVideoQty, `,
`    hours, setHours, qty, setQty, videoQty = 1, setVideoQty, droneQty = 0, setDroneQty, `
);
fs.writeFileSync('src/components/quote/UpsellList.tsx', code);
