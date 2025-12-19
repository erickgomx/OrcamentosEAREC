
/**
 * LocationService
 * ---------------
 * Encapsula a lógica de interação com APIs de mapas (OpenStreetMap/Nominatim).
 */
export class LocationService {
  
  // Coordenadas fixas da Origem (Goianinha - RN)
  private static readonly ORIGIN_COORDS = {
    lat: -6.2662,
    lon: -35.2227
  };

  /**
   * Calcula a distância de condução estimada (com fator de tortuosidade)
   */
  static async calculateDistance(destination: string): Promise<number> {
    const cleanDest = destination.trim();
    if (!cleanDest || cleanDest.length < 3) return 0;

    try {
        const query = cleanDest.toLowerCase().includes('brasil') ? cleanDest : `${cleanDest}, Brasil`;
        
        const response = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&limit=1`);
        
        if (!response.ok) return 0;
        
        const data = await response.json();
        
        if (data && data.length > 0) {
            const destLat = parseFloat(data[0].lat);
            const destLon = parseFloat(data[0].lon);
            
            const straightDistance = this.getHaversineDistance(
                this.ORIGIN_COORDS.lat, 
                this.ORIGIN_COORDS.lon, 
                destLat, 
                destLon
            );

            // Fator de correção para estradas (1.35x a linha reta)
            const drivingFactor = 1.35;
            
            return Math.round(straightDistance * drivingFactor);
        }
    } catch (error) {
        console.error("LocationService Error:", error);
        return 0; 
    }

    return 0;
  }

  // Fórmula de Haversine (Privada, detalhe de implementação)
  private static getHaversineDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
    const R = 6371; // Raio da Terra em km
    const dLat = this.toRad(lat2 - lat1);
    const dLon = this.toRad(lon2 - lon1);
    const a = 
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(this.toRad(lat1)) * Math.cos(this.toRad(lat2)) * 
        Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  }

  private static toRad(value: number): number {
    return value * Math.PI / 180;
  }
}
