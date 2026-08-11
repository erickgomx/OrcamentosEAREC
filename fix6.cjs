const fs = require('fs');
let content = fs.readFileSync('src/pages/WelcomeView.tsx', 'utf8');

// Replace these
content = content.replace('            </p>\n          \n        </div>', '            </p>\n        </motion.div>\n      </div>');
content = content.replace('            </p>\n              </div>', '            </p>\n        </motion.div>\n      </div>');

fs.writeFileSync('src/pages/WelcomeView.tsx', content);
