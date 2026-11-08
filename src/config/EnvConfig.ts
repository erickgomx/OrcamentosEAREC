// ============================================================================
// EAREC AUDIOVISUAL - CONFIGURAÇÕES DE AMBIENTE (EnvConfig.ts)
// ============================================================================
// Olá, dev! 👋
// Este arquivo é uma ponte segura entre a aplicação React (Vite) e as variáveis
// de ambiente (.env). Ele evita que o app quebre caso alguma variável não esteja
// definida e provê métodos 'get' tipados e com fallback amigável.
//
// Variáveis suportadas no arquivo `.env`:
// - VITE_GOOGLE_API_KEY: Chave da Google Cloud (Maps/Calendar)
// - VITE_GOOGLE_CALENDAR_ID: ID da agenda Google para verificação de disponibilidade
// ============================================================================

/**
 * EnvConfig
 * ---------
 * Singleton para acesso seguro e tipado a variáveis de ambiente.
 * Centraliza a leitura de import.meta.env para facilitar manutenção e testes.
 */
export class EnvConfig {
  /**
   * Helper privado para leitura resiliente de variáveis Vite (`import.meta.env`).
   * Se a chave não existir ou houver restrição de contexto, retorna string vazia em vez de lançar erro.
   */
  private static getEnv(key: string): string {
    try {
      // @ts-ignore - Vite uses import.meta.env
      const env = (import.meta as any).env || {};
      return env[key] || "";
    } catch (e) {
      console.warn("EnvConfig: Erro ao acessar variáveis de ambiente", e);
      return "";
    }
  }

  /**
   * Chave de API Google (utilizada opcionalmente para Maps ou Calendar).
   */
  static get GOOGLE_API_KEY(): string {
    return this.getEnv("VITE_GOOGLE_API_KEY");
  }

  /**
   * ID do Google Calendar para checagem em tempo real de datas ocupadas.
   */
  static get GOOGLE_CALENDAR_ID(): string {
    return this.getEnv("VITE_GOOGLE_CALENDAR_ID");
  }

  /**
   * Verifica se estamos rodando em modo de produção
   */
  static get IS_PROD(): boolean {
    return this.getEnv("MODE") === "production";
  }

  /**
   * Verifica se as integrações externas estão configuradas
   */
  static get HAS_CALENDAR_INTEGRATION(): boolean {
    return !!this.GOOGLE_API_KEY && !!this.GOOGLE_CALENDAR_ID;
  }
}
