// ============================================================================
// EAREC AUDIOVISUAL - SERVIÇO DE DISPONIBILIDADE DE AGENDA (CalendarService.ts)
// ============================================================================
// Olá, dev! 👋
// Esta classe fornece a camada de serviço desacoplada para verificar conflitos
// de datas na agenda da equipe de cinegrafistas e fotógrafos.
// 
// Ela utiliza o `EnvConfig` para obter as chaves com fallback seguro para simulação
// caso o ambiente de teste ainda não tenha as credenciais da Google configuradas.
// ============================================================================

import { EnvConfig } from "../config/EnvConfig";

/**
 * CalendarService
 * ---------------
 * Encapsula a lógica de verificação de disponibilidade no Google Calendar.
 */
export class CalendarService {

  /**
   * Consulta se determinada data já possui compromisso agendado na EAREC.
   * Retorna `{ available: true }` ou `{ available: false, message: string }`.
   */
  static async checkAvailability(dateString: string): Promise<{ available: boolean; message?: string }> {
    // Regra de Negócio: Data no passado não é permitida
    const selectedDate = new Date(`${dateString}T00:00:00`);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (selectedDate < today) {
      return { available: false, message: "A data não pode ser no passado." };
    }

    // Acesso seguro via EnvConfig
    const apiKey = EnvConfig.GOOGLE_API_KEY;
    const calendarId = EnvConfig.GOOGLE_CALENDAR_ID;
    
    // Modo Simulação (Mock)
    if (!EnvConfig.HAS_CALENDAR_INTEGRATION) {
      // Simula delay de rede para proporcionar uma transição de UI realista
      await new Promise(resolve => setTimeout(resolve, 1500));

      const day = new Date(dateString).getDate();
      // Lógica Mock para demonstração: dias 15 e 20 simulados como ocupados
      if (day === 15 || day === 20) {
          return { available: false, message: "Agenda lotada neste dia." };
      }
      return { available: true };
    }

    // Integração Real com API v3 do Google Calendar
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
      
      // Havendo eventos cadastrados no dia, consideramos a diária indisponível
      if (data.items && data.items.length > 0) {
          return { available: false, message: "Data indisponível (Já reservada)." };
      }

      return { available: true };

    } catch (error) {
      console.error("Connection Error:", error);
      // Em falha de conexão externa, priorizamos a continuidade do usuário (fail-open)
      return { available: true }; 
    }
  }
}
