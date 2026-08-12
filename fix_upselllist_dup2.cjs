const fs = require('fs');
let code = fs.readFileSync('src/components/quote/UpsellList.tsx', 'utf8');

code = code.replace(
  `                    </motion.div>
                  )}
)}
{category !== 'video_production' && showDuration && (`,
  `                    </motion.div>
                  )}
{category !== 'video_production' && showDuration && (`
);

fs.writeFileSync('src/components/quote/UpsellList.tsx', code);
