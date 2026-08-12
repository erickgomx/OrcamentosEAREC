const fs = require('fs');
let code = fs.readFileSync('src/components/quote/UpsellList.tsx', 'utf8');

code = code.replace(
    "import { PriceTooltip } from '../ui/PriceTooltip';",
    ""
);

const ptCode = `
const PriceTooltip = ({ value }: { value: number }) => (
    <div className="absolute -top-8 bg-neutral-800 text-white text-[10px] font-bold px-2 py-1 rounded-md opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none z-10 shadow-xl">
        + R$ {value}
        <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 border-4 border-transparent border-t-neutral-800" />
    </div>
);
`;

code = code.replace('const ControlBtn =', ptCode + '\nconst ControlBtn =');

fs.writeFileSync('src/components/quote/UpsellList.tsx', code);
