const fs = require('fs');
let code = fs.readFileSync('src/pages/QuoteView.tsx', 'utf8');

code = code.replace(
  `                      setDroneQty={actions.setDroneQty}`,
  `                      setDroneQty={actions.setDroneQty}
                      camCapHours={quoteState.camCapHours}
                      setCamCapHours={actions.setCamCapHours}
                      mobileCapHours={quoteState.mobileCapHours}
                      setMobileCapHours={actions.setMobileCapHours}
                      editQty={quoteState.editQty}
                      setEditQty={actions.setEditQty}`
);

fs.writeFileSync('src/pages/QuoteView.tsx', code);
