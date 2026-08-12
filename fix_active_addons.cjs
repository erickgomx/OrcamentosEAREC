const fs = require('fs');
let code = fs.readFileSync('src/hooks/useQuoteLogic.ts', 'utf8');

code = code.replace(
`  const activeAddons = [];
  if (addDrone && (['wedding','social','commercial'].includes(category || ''))) activeAddons.push('Drone (Aéreo)');
  if (addRealTime) activeAddons.push('Fotos em Tempo Real');`,
`  const activeAddons = [];
  if (addDrone && (['wedding','social','commercial'].includes(category || ''))) activeAddons.push('Drone (Aéreo)');
  if (quoteState.droneQty && quoteState.droneQty > 0) activeAddons.push(\`Drone (\${quoteState.droneQty} Baterias)\`);
  if (addRealTime) activeAddons.push('Fotos em Tempo Real');`
);

fs.writeFileSync('src/hooks/useQuoteLogic.ts', code);
