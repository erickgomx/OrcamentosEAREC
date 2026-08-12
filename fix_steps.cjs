const fs = require('fs');
let code = fs.readFileSync('src/hooks/useQuoteLogic.ts', 'utf8');

code = code.replace(
  `      if (currentStep < steps.length - 1) {
          setDirection(1);
          setCurrentStep(prev => prev + 1);
          window.scrollTo({ top: 0, behavior: 'smooth' });
      } else {`,
  `      if (currentStep < steps.length - 1) {
          setDirection(1);
          setCurrentStep(prev => {
             if (prev === 0 && category === 'video_production') return 2;
             return prev + 1;
          });
          window.scrollTo({ top: 0, behavior: 'smooth' });
      } else {`
);

code = code.replace(
  `  const handlePrevStep = () => {
      if (currentStep > 0) {
          setDirection(-1);
          setCurrentStep(prev => prev - 1);
          window.scrollTo({ top: 0, behavior: 'smooth' });
      } else {`,
  `  const handlePrevStep = () => {
      if (currentStep > 0) {
          setDirection(-1);
          setCurrentStep(prev => {
             if (prev === 2 && category === 'video_production') return 0;
             return prev - 1;
          });
          window.scrollTo({ top: 0, behavior: 'smooth' });
      } else {`
);

fs.writeFileSync('src/hooks/useQuoteLogic.ts', code);
