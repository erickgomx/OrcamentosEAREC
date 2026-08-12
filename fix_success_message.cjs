const fs = require('fs');
let code = fs.readFileSync('src/pages/SuccessView.tsx', 'utf8');

code = code.replace(
`            } else if (serviceId === 'drone') { 
                escopo = \`\${photoQty} Bateria(s) de Voo\`;`,
`            } else if (serviceId === 'drone') { 
                escopo = \`\${photoQty} Bateria(s) de Voo\`;
            } else if (serviceId === 'custom_bundle') {
                const parts = [];
                if (photoQty > 0) parts.push(\`\${photoQty} Fotos\`);
                if (videoQty > 0) parts.push(\`\${videoQty} Vídeos\`);
                const droneBatteries = quoteDetails.addons ? quoteDetails.addons.filter(a => a.includes('Drone')).length : 0; // Or better, it's injected from context. Wait, droneQty isn't passed in quoteDetails!
                // Actually, let's just use the breakdown from breakdown array?
                // The prompt says we can select quantities. The 'addons' might contain drone if it was an addon, but we used base for custom_bundle.
                // Let's just say "Pacote Personalizado (Veja PDF)" but wait, we don't have PDF.
                // Let's rely on photoQty and videoQty.
                escopo = parts.length > 0 ? parts.join(' + ') : 'Pacote Base';`
);

fs.writeFileSync('src/pages/SuccessView.tsx', code);
