const fs = require('fs');

let code = fs.readFileSync('src/components/quote/UpsellList.tsx', 'utf8');

// Replace the extra `</motion.div>`
code = code.replace(
`                   </motion.div>
                )}
            </motion.div>
        </motion.div>
      )}`,
`                   </motion.div>
                )}
        </motion.div>
      )}`
);

fs.writeFileSync('src/components/quote/UpsellList.tsx', code);
