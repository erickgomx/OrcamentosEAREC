
/**
 * Biblioteca de Mapas e Geolocalização
 * ------------------------------------
 * Responsável por converter endereços em coordenadas (Geocoding) 
 * e calcular distâncias para precificação de frete.
 */

// Coordenadas fixas da Origem: EAREC Estúdio, Goianinha - RN
// Ponto zero para todos os cálculos de deslocamento.
const ORIGIN_COORDS = {
    lat: -6.2662, // Latitude aproximada de Goianinha
    lon: -35.2227 // Longitude aproximada de Goianinha
};

/**
 * Calcula a distância estimada de condução entre a origem (Goianinha) e o destino.
 * 
 * FLUXO:
 * 1. Recebe string de endereço.
 * 2. Faz request para API OpenStreetMap (Nominatim).
 * 3. Obtém Lat/Long do destino.
 * 4. Calcula distância linear (Haversine).
 * 5. Aplica fator de correção para estimar rota de carro.
 * 
 * @param destination String do endereço de destino (ex: "Natal, RN")
 * @returns Distância em KM (number)
 */
export async function calculateDistance(destination: string): Promise<number> {
    const cleanDest = destination.trim();
    if (!cleanDest || cleanDest.length < 3) return 0;

    try {
        // Otimização: Adicionamos ", Brasil" para enviesar a busca para o contexto local
        // caso o usuário digite apenas o nome da cidade, evitando cidades homônimas no exterior.
        const query = cleanDest.toLowerCase().includes('brasil') ? cleanDest : `${cleanDest}, Brasil`;
        
        // Requisição para API de Geocoding do OpenStreetMap (Gratuita e open-source)
        // Documentação: https://nominatim.org/release-docs/develop/api/Search/
        const response = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&limit=1`);
        
        if (!response.ok) return 0;
        
        const data = await response.json();
        
        if (data && data.length > 0) {
            const destLat = parseFloat(data[0].lat);
            const destLon = parseFloat(data[0].lon);
            
            // Passo 1: Distância "Voo de Pássaro" (Linha Reta)
            const straightDistance = getHaversineDistance(
                ORIGIN_COORDS.lat, 
                ORIGIN_COORDS.lon, 
                destLat, 
                destLon
            );

            // Passo 2: FATOR DE TORTUOSIDADE
            // Estradas não são linhas retas. Em média, a distância de condução
            // é cerca de 30% a 40% maior que a distância linear.
            // Usamos 1.35 como multiplicador de segurança.
            const drivingFactor = 1.35;
            
            return Math.round(straightDistance * drivingFactor);
        }
    } catch (error) {
        console.error("Erro ao calcular distância:", error);
        // Fail-safe: Retorna 0 para não quebrar a UI, o frete fica grátis ou a combinar.
        return 0; 
    }

    return 0;
}

/**
 * Fórmula de Haversine
 * --------------------
 * Algoritmo padrão para calcular a distância do círculo máximo entre dois pontos 
 * em uma esfera dado suas longitudes e latitudes.
 */
function getHaversineDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
    const R = 6371; // Raio da Terra em km
    const dLat = toRad(lat2 - lat1);
    const dLon = toRad(lon2 - lon1);
    const a = 
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * 
        Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
}

// Helper para converter graus em radianos
function toRad(value: number): number {
    return value * Math.PI / 180;
}
