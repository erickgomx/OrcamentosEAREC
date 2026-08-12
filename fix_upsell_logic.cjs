const fs = require('fs');
let code = fs.readFileSync('src/components/quote/UpsellList.tsx', 'utf8');

code = code.replace(
`  const showQuantity = ((category === 'commercial' && serviceId !== 'comm_combo') || 
                       (category === 'social' && serviceId !== 'graduation' && selectionMode === 'quantity') ||
                       (category === 'studio' && selectionMode === 'quantity') ||
                       (category === 'video_production' && (serviceId === 'edit_only' || serviceId === 'drone'))) && !isCombo;`,
`  const showQuantity = ((category === 'commercial' && serviceId !== 'comm_combo') || 
                       (category === 'social' && serviceId !== 'graduation' && selectionMode === 'quantity') ||
                       (category === 'studio' && selectionMode === 'quantity') ||
                       (category === 'video_production' && (serviceId === 'edit_only' || serviceId === 'drone'))) && !isCombo && !isCustomBundle;`
);

code = code.replace(
`  const showDroneAddon = !isCommercialStudio && (category === 'wedding' || category === 'social' || category === 'commercial');`,
`  const showDroneAddon = !isCommercialStudio && (category === 'wedding' || category === 'social' || category === 'commercial' || (category === 'video_production' && !isCustomBundle));`
);

code = code.replace(
`            {(category === 'wedding' || category === 'social' || category === 'commercial') && (`,
`            {(category === 'wedding' || category === 'social' || category === 'commercial' || (category === 'video_production' && !isCustomBundle)) && (`
);

fs.writeFileSync('src/components/quote/UpsellList.tsx', code);
