const fs = require('fs');
let content = fs.readFileSync('src/pages/WelcomeView.tsx', 'utf8');

// Replace these
content = content.replace(
    '<Loader2 size={20} className="animate-spin text-neutral-500" />\n                          )}',
    '<Loader2 size={20} className="animate-spin text-neutral-500" />\n              </motion.div>\n            )}'
);

content = content.replace(
    '<CheckCircle2 size={22} className="text-emerald-500" />\n                          )}',
    '<CheckCircle2 size={22} className="text-emerald-500" />\n              </motion.div>\n            )}'
);

content = content.replace(
    '<XCircle size={22} className="text-red-500" />\n                           )}',
    '<XCircle size={22} className="text-red-500" />\n               </motion.div>\n            )}'
);

content = content.replace(
    '<AlertCircle size={12} /> {errorMessage}</p>\n                    )}',
    '<AlertCircle size={12} /> {errorMessage}</p>\n            </motion.div>\n        )}'
);

content = content.replace(
    'Passo {currentStep + 1} de {steps.length}\n            </p>\n              </div>',
    'Passo {currentStep + 1} de {steps.length}\n            </p>\n        </motion.div>\n      </div>'
);

content = content.replace(
    '                        </div>\n                    </div>\n                            </AnimatePresence>',
    '                        </div>\n                    </div>\n                </motion.div>\n            </AnimatePresence>'
);

fs.writeFileSync('src/pages/WelcomeView.tsx', content);
