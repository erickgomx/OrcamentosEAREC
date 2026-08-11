const fs = require('fs');
let content = fs.readFileSync('src/pages/WelcomeView.tsx', 'utf8');

// Replace these
content = content.replace('Passo {currentStep + 1} de {steps.length}\n            </p>\n          \n        </div>', 'Passo {currentStep + 1} de {steps.length}\n            </p>\n        </motion.div>\n      </div>');

content = content.replace('                        </div>\n                    </div>\n                            </AnimatePresence>', '                        </div>\n                    </div>\n                </motion.div>\n            </AnimatePresence>');

fs.writeFileSync('src/pages/WelcomeView.tsx', content);
