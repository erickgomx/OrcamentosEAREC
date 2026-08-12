const fs = require('fs');
let code = fs.readFileSync('src/components/quote/UpsellList.tsx', 'utf8');

// move formatCurrency to top
code = code.replace(
`  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(val);
  };`,
``
);

code = code.replace(
`const UpsellList: React.FC<UpsellListProps> = (props) => {`,
`export const formatCurrency = (val: number) => {
  return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(val);
};

const UpsellList: React.FC<UpsellListProps> = (props) => {`
);

fs.writeFileSync('src/components/quote/UpsellList.tsx', code);
