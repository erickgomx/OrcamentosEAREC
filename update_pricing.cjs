const fs = require('fs');
let code = fs.readFileSync('src/config/AppConfig.ts', 'utf8');
code = code.replace(
`    video_production: {
        edit_only: { 
            unit: 250, 
            label: "Apenas Edição",
            composition: "Edição Profissional (até 1min)",
            description: "Você grava, nós editamos. Pós-produção avançada para vídeos de até 1 minuto. Inclui: Color grading, sound design e legendas." 
        },
        cam_cap: { 
            fixed: 350, 
            label: "Captação Câmera",
            composition: "Operador + Câmera Profissional",
            description: "Contrate apenas a mão de obra especializada. Operador de câmera experiente com equipamento 4K incluso (Linha Sony Alpha)." 
        },
        mobile_cap: { 
            fixed: 250, 
            label: "Captação Celular",
            composition: "Filmmaker Mobile + iPhone 13 Pro Max",
            description: "Captação ágil e discreta com iPhone 13 Pro Max. Perfeito para cobrir bastidores, eventos corporativos rápidos e conteúdo 'real-time' para stories." 
        },
        drone: { 
            fixed: 250, 
            label: "Drone (Por Bateria)",
            composition: "1 Bateria (Aprox. 20min)",
            description: "Imagens aéreas que valorizam a locação. Cada bateria oferece aprox. 20 minutos de voo. Inclui piloto certificado e Drone DJI." 
        }
    },`,
`    video_production: {
        custom_bundle: {
            base: 0,
            label: "Monte seu Pacote",
            composition: "Personalize fotos, vídeos e adicionais",
            description: "Escolha exatamente o que precisa para a sua cobertura. Selecione a quantidade de fotos, vídeos, baterias de drone e cobertura em tempo real."
        },
        drone: { fixed: 250, label: "Drone (Por Bateria)", composition: "1 Bateria (Aprox. 20min)", description: "Imagens aéreas." },
        realtime: { fixed: 600, label: "Fotos em Tempo Real" }
    },`
);
fs.writeFileSync('src/config/AppConfig.ts', code);
