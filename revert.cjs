const fs = require('fs');
let content = fs.readFileSync('src/pages/WelcomeView.tsx', 'utf8');

// Undo the absolute positioning of the logo
content = content.replace(
    '<div className="absolute top-12 left-0 right-0 z-20 flex flex-col items-center w-full px-6 pointer-events-none">\n        {/* LOGO & PROGRESS */}\n        <motion.div \n            initial={{ opacity: 0, y: -20 }} \n            animate={{ opacity: 1, y: 0 }} \n            className="text-center w-full max-w-lg mx-auto pointer-events-auto"\n        >',
    '<div className="relative z-10 w-full max-w-lg flex flex-col items-center">\n        {/* LOGO & PROGRESS */}\n        <motion.div \n            initial={{ opacity: 0, y: -20 }} \n            animate={{ opacity: 1, y: 0 }} \n            className="mb-12 text-center w-full"\n        >'
);

content = content.replace(
    '                Passo {currentStep + 1} de {steps.length}\n            </p>\n        </motion.div>\n      </div>\n\n      <div className="relative z-10 w-full max-w-lg flex flex-col items-center">',
    '                Passo {currentStep + 1} de {steps.length}\n            </p>\n        </motion.div>'
);

content = content.replace(
    '<div className="flex justify-center mb-6 md:mb-8">',
    '<div className="flex justify-center mb-8">'
);

content = content.replace(
    '<p className="text-[10px] text-neutral-500 font-mono mt-3 uppercase tracking-widest text-center">',
    '<p className="text-[10px] text-neutral-500 font-mono mt-3 uppercase tracking-widest">'
);

fs.writeFileSync('src/pages/WelcomeView.tsx', content);
