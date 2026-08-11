const fs = require('fs');
let content = fs.readFileSync('src/pages/WelcomeView.tsx', 'utf8');

// Just inject it exactly before </AnimatePresence>
content = content.replace('                    </div>\n                            </AnimatePresence>', '                    </div>\n                </motion.div>\n            </AnimatePresence>');
content = content.replace('                    </div>\n                  \n            </AnimatePresence>', '                    </div>\n                </motion.div>\n            </AnimatePresence>');

fs.writeFileSync('src/pages/WelcomeView.tsx', content);
