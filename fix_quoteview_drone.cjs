const fs = require('fs');
let code = fs.readFileSync('src/pages/QuoteView.tsx', 'utf8');

code = code.replace(
`                      setDroneQty={actions.setDroneQty}`,
`                      droneQty={quoteState.droneQty}
                      setDroneQty={actions.setDroneQty}`
);

fs.writeFileSync('src/pages/QuoteView.tsx', code);
