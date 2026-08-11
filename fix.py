with open("src/pages/WelcomeView.tsx", "r") as f:
    lines = f.readlines()

for i, line in enumerate(lines):
    if 'className="animate-spin text-neutral-500"' in line:
        lines[i] = line + '              </motion.div>\n'
    elif 'className="text-emerald-500"' in line:
        lines[i] = line + '              </motion.div>\n'
    elif 'className="text-red-500"' in line:
        lines[i] = line + '               </motion.div>\n'
    elif '<AlertCircle size={12} /> {errorMessage}</p>' in line:
        lines[i] = line + '            </motion.div>\n'
    elif 'Passo {currentStep + 1} de {steps.length}' in line:
        lines[i] = line + '            </p>\n        </motion.div>\n'
        # Also, need to remove the extra </p> on the next line
        lines[i+1] = ''

with open("src/pages/WelcomeView.tsx", "w") as f:
    f.writelines(lines)
