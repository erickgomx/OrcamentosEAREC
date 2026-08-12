const fs = require('fs');
let code = fs.readFileSync('src/components/ui/Logo.tsx', 'utf8');
code = code.replace(
`className="absolute bottom-1 left-0 right-0 z-30 flex justify-center pointer-events-none"`,
`className="absolute bottom-2 left-0 right-0 z-30 flex justify-center pointer-events-none"`
);
// Also increase the height of the Logo by slightly increasing the SVG padding so there is room for the text without overlapping the REC.
// The svg viewBox is "60 -5 240 70", height is basically 75. 
// We can add pb-4 to the motion.div wrapper!
code = code.replace(
`className={cn("relative select-none cursor-pointer overflow-hidden rounded-xl group px-2 py-1 flex items-center justify-center", className)}`,
`className={cn("relative select-none cursor-pointer overflow-hidden rounded-xl group px-4 py-3 pb-6 flex items-center justify-center", className)}`
);

fs.writeFileSync('src/components/ui/Logo.tsx', code);
