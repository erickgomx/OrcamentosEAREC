
/**
 * EnvConfig
 * ---------
 * Singleton para acesso seguro e tipado a variáveis de ambiente.
 * Centraliza a leitura de import.meta.env para facilitar manutenção e testes.
 */
export class EnvConfig {
  private static getEnv(key: string): string {
    // @ts-ignore - Vite uses import.meta.env
    return import.meta.env[key] || "";
  }

  static get GOOGLE_API_KEY(): string {
    return this.getEnv("VITE_GOOGLE_API_KEY");
  }

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
