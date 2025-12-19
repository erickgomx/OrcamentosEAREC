
/**
 * CalendarService
 * ---------------
 * Encapsula a lógica de verificação de disponibilidade no Google Calendar.
 */
export class CalendarService {

  static async checkAvailability(dateString: string): Promise<{ available: boolean; message?: string }> {
    // Regra de Negócio: Data no passado
    const selectedDate = new Date(`${dateString}T00:00:00`);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (selectedDate < today) {
      return { available: false, message: "A data não pode ser no passado." };
    }

    const apiKey = (import.meta as any).env?.VITE_GOOGLE_API_KEY || "";
    const calendarId = (import.meta as any).env?.VITE_GOOGLE_CALENDAR_ID || "";
    
    // Modo Simulação (Mock)
    if (!apiKey || !calendarId) {
      // Simula delay de rede
      await new Promise(resolve => setTimeout(resolve, 1500));

      const day = new Date(dateString).getDate();
      if (day === 15 || day === 20) {
          return { available: false, message: "Agenda lotada neste dia." };
      }
      return { available: true };
    }

    // Integração Real
    try {
      const startDate = new Date(dateString);
      startDate.setHours(0, 0, 0, 0);
      
      const endDate = new Date(dateString);
      endDate.setHours(23, 59, 59, 999);

      const timeMin = startDate.toISOString();
      const timeMax = endDate.toISOString();

      const url = `https://www.googleapis.com/calendar/v3/calendars/${encodeURIComponent(calendarId)}/events?key=${apiKey}&timeMin=${timeMin}&timeMax=${timeMax}&singleEvents=true`;

      const response = await fetch(url);
      
      if (!response.ok) {
          console.error("Calendar API Error:", response.statusText);
          return { available: true, message: "Aviso: Não foi possível sincronizar agenda." }; 
      }

      const data = await response.json();
      
      if (data.items && data.items.length > 0) {
          return { available: false, message: "Data indisponível (Já reservada)." };
      }

      return { available: true };

    } catch (error) {
      console.error("Connection Error:", error);
      return { available: true }; 
    }
  }
}
