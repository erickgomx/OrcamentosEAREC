const fs = require('fs');

let code = fs.readFileSync('src/components/quote/UpsellList.tsx', 'utf8');

// The string ends with:
//                    </motion.div>
//                 )}
//             </motion.div>
//         </motion.div>
//       )}

const badEnding = /<\/motion\.div>\s*\)\}\s*<\/motion\.div>\s*<\/motion\.div>\s*\)\}/;
const goodEnding = `                   </motion.div>\n                )}\n        </motion.div>\n      )}`;

if (badEnding.test(code)) {
    code = code.replace(badEnding, goodEnding);
    fs.writeFileSync('src/components/quote/UpsellList.tsx', code);
    console.log('Fixed ending!');
} else {
    console.log('Not found!');
}
