const fs = require('fs');
let code = fs.readFileSync('src/config/AppConfig.ts', 'utf8');

code = code.replace(
`    video_production: {
        custom_bundle: {
            base: 0,
            label: "Monte seu Pacote",
            composition: "Personalize fotos, vídeos e adicionais",
            description: "Escolha exatamente o que precisa para a sua cobertura. Selecione a quantidade de fotos, vídeos, baterias de drone e cobertura em tempo real."
        },
        drone: { fixed: 250, label: "Drone (Por Bateria)", composition: "1 Bateria (Aprox. 20min)", description: "Imagens aéreas." },
        realtime: { fixed: 600, label: "Fotos em Tempo Real" }
    },`,
`    video_production: {
        cam_cap: { fixed: 350, label: "Vídeo (Câmera)", composition: "Câmera Profissional", description: "Captação de vídeo de alta qualidade com equipamento profissional." },
        mobile_cap: { fixed: 200, label: "Vídeo (Mobile)", composition: "iPhone/Smartphone", description: "Captação dinâmica focada em redes sociais." },
        drone: { fixed: 250, label: "Drone (Aéreo)", composition: "1 Bateria (Aprox. 20min)", description: "Imagens aéreas." },
        edit_only: { unit: 150, label: "Apenas Edição", composition: "Edição de material", description: "Envie seus arquivos e nós editamos." },
        realtime: { fixed: 600, label: "Fotos em Tempo Real" }
    },`
);

fs.writeFileSync('src/config/AppConfig.ts', code);
