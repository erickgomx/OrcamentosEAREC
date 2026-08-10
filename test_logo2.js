const fs = require('fs');
const content = `
<html>
<body style="background: black;">
  <svg viewBox="-20 -15 330 100" style="border: 1px solid red; width: 300px; height: 100px;">
    <text x="20" y="52" font-size="55" fill="#E5E5E5" font-family="Microgramma Extended">EA</text>
    <circle cx="145" cy="33" r="16" fill="#DC2626" />
    <text x="185" y="52" font-size="50" fill="#DC2626" font-family="Eurostile Extended">REC</text>
  </svg>
</body>
</html>
`;
fs.writeFileSync('test_logo2.html', content);
