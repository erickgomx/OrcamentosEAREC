const fs = require('fs');
let code = fs.readFileSync('src/components/quote/UpsellList.tsx', 'utf8');

code = code.replace(
  `droneQty: number; setDroneQty: (n: number) => void;`,
  `droneQty: number; setDroneQty: (n: number) => void;
  camCapHours?: number; setCamCapHours?: (n: number) => void;
  mobileCapHours?: number; setMobileCapHours?: (n: number) => void;
  editQty?: number; setEditQty?: (n: number) => void;`
);

code = code.replace(
  `droneQty, setDroneQty,`,
  `droneQty, setDroneQty, camCapHours, setCamCapHours, mobileCapHours, setMobileCapHours, editQty, setEditQty,`
);

fs.writeFileSync('src/components/quote/UpsellList.tsx', code);
