import React, { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, MapPin, Check, Loader2, Info, Search, ArrowRight } from 'lucide-react';
import Button from './Button';
import { modalVariants } from '../../lib/animations';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

interface LocationMapModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectLocation: (address: string) => void;
  initialAddress?: string;
}

const LocationMapModal: React.FC<LocationMapModalProps> = ({ isOpen, onClose, onSelectLocation, initialAddress }) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const markerRef = useRef<L.Marker | null>(null);
  
  const [currentAddress, setCurrentAddress] = useState(initialAddress || "Carregando posição...");
  const [isLoading, setIsLoading] = useState(true);

  // Lógica de Busca Automática (Debounce de 4s)
  useEffect(() => {
    if (!isOpen || !currentAddress || currentAddress.length < 3) return;

    // Se o endereço for "Carregando posição...", ignora
    if (currentAddress === "Carregando posição...") return;

    const timer = setTimeout(() => {
        handleSearch(currentAddress);
    }, 4000); // 4 segundos de espera após parar de digitar

    return () => clearTimeout(timer);
  }, [currentAddress, isOpen]);

  // Inicialização do Mapa
  useEffect(() => {
    if (!isOpen) return;

    if (initialAddress) {
        setCurrentAddress(initialAddress);
    }

    // Pequeno delay para garantir que o DOM renderizou o container
    const timer = setTimeout(() => {
        if (mapContainerRef.current) {
            // Evita erro 'Map container is already initialized' no Leaflet
            // @ts-ignore
            if (mapContainerRef.current._leaflet_id) {
                // @ts-ignore
                delete mapContainerRef.current._leaflet_id;
            }

            if (!mapInstanceRef.current) {
                // 1. Cria o mapa
                // Coordenadas iniciais: Goianinha/RN (Fallback)
                const initialLat = -6.2662; 
                const initialLng = -35.2227;

                const map = L.map(mapContainerRef.current, {
                    zoomControl: true,
                    attributionControl: false
                }).setView([initialLat, initialLng], 14);
                
                // 2. TileLayer: Google Maps Roadmap (100% gratuito, sem necessidade de chave paga, ultrarrápido)
                const googleRoadmap = L.tileLayer('https://{s}.google.com/vt/lyrs=m&x={x}&y={y}&z={z}', {
                    maxZoom: 20,
                    subdomains: ['mt0', 'mt1', 'mt2', 'mt3'],
                    attribution: '&copy; Google Maps'
                });

                // Fallback: OpenStreetMap oficial caso Google Maps esteja indisponível
                const osmFallback = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                    maxZoom: 19,
                    attribution: '&copy; OpenStreetMap'
                });

                googleRoadmap.on('tileerror', () => {
                    if (!map.hasLayer(osmFallback)) {
                        osmFallback.addTo(map);
                    }
                });

                googleRoadmap.addTo(map);

                // Força redimensionamento correto do container
                map.invalidateSize();
                setTimeout(() => map.invalidateSize(), 150);
                setTimeout(() => map.invalidateSize(), 400);

                // 3. Ícone Personalizado Cinematográfico
                const customIcon = L.divIcon({
                    className: 'bg-transparent',
                    html: `<svg xmlns="http://www.w3.org/2000/svg" width="36" height="36" viewBox="0 0 24 24" fill="#DC2626" stroke="#ffffff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-map-pin drop-shadow-lg"><path d="M20 10c0 6-9 13-9 13s-9-7-9-13a9 9 0 0 1 18 0Z"/><circle cx="12" cy="10" r="3" fill="white"/></svg>`,
                    iconSize: [36, 36],
                    iconAnchor: [18, 36],
                });

                // 4. Cria o Marcador Arrastável
                const marker = L.marker([initialLat, initialLng], { 
                    draggable: true,
                    icon: customIcon 
                }).addTo(map);

                markerRef.current = marker;
                mapInstanceRef.current = map;

                // 5. Tenta pegar geolocalização do usuário se não tiver endereço inicial
                if (!initialAddress && navigator.geolocation) {
                    navigator.geolocation.getCurrentPosition(
                        (pos) => {
                            const { latitude, longitude } = pos.coords;
                            map.setView([latitude, longitude], 15);
                            marker.setLatLng([latitude, longitude]);
                            map.invalidateSize();
                            fetchAddress(latitude, longitude); 
                        },
                        () => {
                            fetchAddress(initialLat, initialLng); 
                        },
                        { timeout: 5000 }
                    );
                } else if (initialAddress) {
                    handleSearch(initialAddress, map, marker);
                } else {
                    fetchAddress(initialLat, initialLng);
                }

                // 6. Event Listener: Arrastar Marcador
                marker.on('dragend', async (e) => {
                    const { lat, lng } = e.target.getLatLng();
                    await fetchAddress(lat, lng);
                });

                // 7. Event Listener: Clicar no Mapa
                map.on('click', async (e) => {
                    const { lat, lng } = e.latlng;
                    marker.setLatLng([lat, lng]);
                    await fetchAddress(lat, lng);
                });
            }
        }
    }, 150);

    return () => {
        clearTimeout(timer);
        if (mapInstanceRef.current) {
            try {
                mapInstanceRef.current.off();
                mapInstanceRef.current.remove();
            } catch (err) {
                console.warn("Leaflet cleanup error:", err);
            }
            mapInstanceRef.current = null;
        }
    };
  }, [isOpen]);

  // Função para buscar endereço por coordenadas (Reverse Geocoding)
  const fetchAddress = async (lat: number, lng: number) => {
      setIsLoading(true);
      try {
          const response = await fetch(
              `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=18&addressdetails=1`,
              { headers: { 'Accept-Language': 'pt-BR' } }
          );
          if (!response.ok) throw new Error(`Nominatim error: ${response.status}`);
          const data = await response.json();
          
          if (data && data.address) {
              const street = data.address.road || data.address.pedestrian || "";
              const number = data.address.house_number || "";
              const district = data.address.suburb || data.address.neighbourhood || "";
              const city = data.address.city || data.address.town || data.address.village || "";
              const state = data.address.state || "";

              const fullAddress = [street, number, district, city, state]
                .filter(part => part && part.trim() !== "")
                .join(", ");

              setCurrentAddress(fullAddress || `${lat.toFixed(5)}, ${lng.toFixed(5)}`);
          } else {
              setCurrentAddress(`${lat.toFixed(5)}, ${lng.toFixed(5)}`);
          }
      } catch (error) {
          setCurrentAddress(`${lat.toFixed(5)}, ${lng.toFixed(5)}`);
      } finally {
          setIsLoading(false);
      }
  };

  // Função para buscar coordenadas por texto (Forward Geocoding)
  const handleSearch = async (queryAddress?: string, mapInstance?: L.Map, markerInstance?: L.Marker) => {
    const term = queryAddress || currentAddress;
    if (!term || term.length < 3) return;

    setIsLoading(true);
    try {
        // Adiciona "Brasil" para contexto se não houver
        const query = term.toLowerCase().includes('brasil') ? term : `${term}, Brasil`;
        
        const response = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&limit=1`);
        const data = await response.json();

        if (data && data.length > 0) {
            const lat = parseFloat(data[0].lat);
            const lon = parseFloat(data[0].lon);
            
            const targetMap = mapInstance || mapInstanceRef.current;
            const targetMarker = markerInstance || markerRef.current;

            if (targetMap && targetMarker) {
                targetMap.setView([lat, lon], 16);
                targetMarker.setLatLng([lat, lon]);
                // Atualiza o texto com o display_name retornado pela API para ficar formatado
                // Mas mantemos o que o usuário digitou se preferir, aqui opto por manter a sincronia
            }
        }
    } catch (e) {
        console.error("Erro na busca:", e);
    } finally {
        setIsLoading(false);
    }
  };

  const handleConfirm = () => {
      onSelectLocation(currentAddress);
      onClose();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
      if (e.key === 'Enter') {
          handleSearch();
      }
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-neutral-950/90 backdrop-blur-sm"
            onClick={onClose}
          />

          <motion.div
            variants={modalVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="relative bg-neutral-900 border border-white/10 rounded-xl shadow-2xl w-full max-w-2xl overflow-hidden flex flex-col max-h-[90vh]"
          >
            {/* Header */}
            <div className="p-4 border-b border-white/10 flex justify-between items-center bg-neutral-900 z-10">
                <div>
                    <h3 className="text-white font-medium flex items-center gap-2">
                        <MapPin size={18} className="text-brand-DEFAULT" />
                        Local do Serviço
                    </h3>
                    <p className="text-xs text-neutral-500 flex items-center gap-1 mt-1">
                       <Info size={12} />
                       Digite apenas Cidade ou Bairro para maior precisão.
                    </p>
                </div>
                <button onClick={onClose} className="text-neutral-400 hover:text-white p-2">
                    <X size={20} />
                </button>
            </div>

            {/* Mapa */}
            <div className="relative flex-1 min-h-[400px] w-full bg-neutral-950 group">
                <div ref={mapContainerRef} className="absolute inset-0 z-0" />
                
                {/* Barra de Busca Flutuante (Input Editável) */}
                <div className="absolute top-4 left-4 right-4 z-[400] bg-neutral-900/90 backdrop-blur-md border border-white/10 p-2 rounded-lg shadow-xl flex items-center gap-2 transition-all focus-within:border-brand-DEFAULT/50 focus-within:bg-neutral-900">
                    <div className="p-2 text-neutral-400">
                        {isLoading ? (
                            <Loader2 size={18} className="text-brand-DEFAULT animate-spin" />
                        ) : (
                            <Search size={18} />
                        )}
                    </div>
                    
                    <input 
                        type="text"
                        value={currentAddress}
                        onChange={(e) => setCurrentAddress(e.target.value)}
                        onKeyDown={handleKeyDown}
                        placeholder="Ex: Ponta Negra, Natal (Pesquisa auto em 4s...)"
                        className="w-full bg-transparent text-sm text-white placeholder:text-neutral-500 outline-none h-full py-1"
                    />

                    <button 
                        onClick={() => handleSearch()}
                        className="p-2 bg-white/5 hover:bg-brand-DEFAULT text-neutral-400 hover:text-white rounded-md transition-colors"
                        title="Buscar Agora"
                    >
                        <ArrowRight size={16} />
                    </button>
                </div>
            </div>

            {/* Footer */}
            <div className="p-4 border-t border-white/10 bg-neutral-900 z-10 flex justify-end gap-3">
                <Button variant="secondary" onClick={onClose} size="sm">Cancelar</Button>
                <Button 
                    variant="primary" 
                    onClick={handleConfirm} 
                    size="sm"
                    className="shadow-[0_0_15px_rgba(220,38,38,0.4)]"
                    disabled={isLoading}
                >
                    <Check size={16} className="mr-2" />
                    Confirmar Local
                </Button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default LocationMapModal;