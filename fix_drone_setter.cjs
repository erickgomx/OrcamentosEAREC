const fs = require('fs');
let code = fs.readFileSync('src/hooks/useQuoteLogic.ts', 'utf8');

code = code.replace(
`      setVideoQty: (q: number) => setQuoteState(prev => ({ ...prev, videoQty: q })),`,
`      setVideoQty: (q: number) => setQuoteState(prev => ({ ...prev, videoQty: q })),
      setDroneQty: (d: number) => setQuoteState(prev => ({ ...prev, droneQty: d })),`
);

fs.writeFileSync('src/hooks/useQuoteLogic.ts', code);
