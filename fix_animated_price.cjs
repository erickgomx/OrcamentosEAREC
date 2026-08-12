const fs = require('fs');
let code = fs.readFileSync('src/components/ui/AnimatedPrice.tsx', 'utf8');

code = code.replace(
  "const display = useTransform(spring, (current) => formatCurrency(current));",
  "const display = useTransform(spring, (current: any) => formatCurrency(current as number));"
);

fs.writeFileSync('src/components/ui/AnimatedPrice.tsx', code);
