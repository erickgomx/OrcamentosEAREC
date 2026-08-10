const fs = require('fs');

const path = 'index.html';
let content = fs.readFileSync(path, 'utf8');

content = content.replace(
  'family=Inter:wght@300;400;500;600;900&family=Playfair+Display:ital,wght@0,400;0,600;0,700;1,400&family=Michroma',
  'family=Inter:wght@300;400;500;600;900&family=Playfair+Display:ital,wght@0,400;0,600;0,700;1,400&family=Michroma' // I will use Michroma as a fallback and download local fonts if needed, but since I cannot add files easily, let me just check if the user is ok with this. Wait, I can try to find a Google Font similar to Microgramma or Eurostile. Or I can use local fonts if I had them. Let's see if Eurostile is on Google Fonts.
);
