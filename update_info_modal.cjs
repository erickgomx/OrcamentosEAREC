const fs = require('fs');
let code = fs.readFileSync('src/components/quote/UpsellList.tsx', 'utf8');

const newVariants = `
const infoModalVariants = {
    hidden: { opacity: 0, scale: 0.85, y: 30, filter: 'blur(12px)' },
    visible: { 
        opacity: 1, 
        scale: 1, 
        y: 0, 
        filter: 'blur(0px)',
        transition: { type: "spring", stiffness: 300, damping: 24, mass: 0.8 } 
    },
    exit: { 
        opacity: 0, 
        scale: 0.9, 
        y: 15, 
        filter: 'blur(8px)',
        transition: { duration: 0.2, ease: [0.22, 1, 0.36, 1] } 
    }
};
`;

// Insert the variants right before the UpsellList component, or inside it.
// UpsellList is declared with `const UpsellList: React.FC<UpsellListProps> = (props) => {`
code = code.replace(
`const UpsellList: React.FC<UpsellListProps> = (props) => {`,
newVariants + `\nconst UpsellList: React.FC<UpsellListProps> = (props) => {`
);

// Replace modalVariants with infoModalVariants in the info modal
code = code.replace(
`                  variants={modalVariants} initial="hidden" animate="visible" exit="exit"`,
`                  variants={infoModalVariants} initial="hidden" animate="visible" exit="exit"`
);

// Optional: improve the backdrop transition as well
code = code.replace(
`                  initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                  className="absolute inset-0 bg-black/80 backdrop-blur-lg"`,
`                  initial={{ opacity: 0, backdropFilter: 'blur(0px)' }} 
                  animate={{ opacity: 1, backdropFilter: 'blur(16px)' }} 
                  exit={{ opacity: 0, backdropFilter: 'blur(0px)' }}
                  transition={{ duration: 0.4, ease: "easeOut" }}
                  className="absolute inset-0 bg-black/60"`
);

fs.writeFileSync('src/components/quote/UpsellList.tsx', code);
