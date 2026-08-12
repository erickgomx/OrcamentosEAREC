const fs = require('fs');
let code = fs.readFileSync('src/hooks/useQuoteLogic.ts', 'utf8');

code = code.replace(
  `          if (currentStep > 0) {
              setCurrentStep(1);
              window.scrollTo({ top: 0, behavior: 'smooth' });
          }`,
  `          if (currentStep > 0) {
              if (c === 'video_production') {
                  setCurrentStep(2);
              } else {
                  setCurrentStep(1);
              }
              window.scrollTo({ top: 0, behavior: 'smooth' });
          }`
);

fs.writeFileSync('src/hooks/useQuoteLogic.ts', code);
