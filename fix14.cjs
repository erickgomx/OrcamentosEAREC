const fs = require('fs');
let content = fs.readFileSync('src/pages/WelcomeView.tsx', 'utf8');

content = content.replace(
    '<div className="w-full relative">\n            <AnimatePresence initial={false} custom={direction} mode="wait">\n                <motion.div \n                    key={currentStep}\n                    custom={direction}\n                    variants={stepVariants}\n                    initial="enter"\n                    animate="center"\n                    exit="exit"\n                    className="absolute inset-0 w-full"\n                >',
    '<div className="w-full">\n            <AnimatePresence initial={false} custom={direction} mode="wait">\n                <motion.div \n                    key={currentStep}\n                    custom={direction}\n                    variants={stepVariants}\n                    initial="enter"\n                    animate="center"\n                    exit="exit"\n                    className="w-full"\n                >'
);

fs.writeFileSync('src/pages/WelcomeView.tsx', content);
