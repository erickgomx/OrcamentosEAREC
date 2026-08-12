const fs = require('fs');
let code = fs.readFileSync('src/hooks/useQuoteLogic.ts', 'utf8');

code = code.replace(
  `setDroneQty: (d: number) => setQuoteState(prev => ({ ...prev, droneQty: d })),`,
  `setDroneQty: (d: number) => setQuoteState(prev => ({ ...prev, droneQty: d })),\n      setCamCapHours: (h: number) => setQuoteState(prev => ({ ...prev, camCapHours: h })),\n      setMobileCapHours: (h: number) => setQuoteState(prev => ({ ...prev, mobileCapHours: h })),\n      setEditQty: (q: number) => setQuoteState(prev => ({ ...prev, editQty: q })),`
);

code = code.replace(
  `actions.setServiceId('cam_cap');`,
  `actions.setServiceId('custom_bundle');`
);

code = code.replace(
  `actions.setAddRealTime(false);`,
  `actions.setAddRealTime(false);\n        actions.setCamCapHours(0);\n        actions.setMobileCapHours(0);\n        actions.setEditQty(0);`
);

fs.writeFileSync('src/hooks/useQuoteLogic.ts', code);
