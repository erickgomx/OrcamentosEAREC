
/**
 * AuthService
 * -----------
 * Gerencia autenticação simples (Senha Mestre) e segurança básica.
 */
export class AuthService {
  
  private static readonly MASTER_PASS_HASH = "XINGU"; // Em prod, usar hash real

  static async verify(password: string): Promise<boolean> {
    if (!password) return false;
    return password.toUpperCase().trim() === this.MASTER_PASS_HASH;
  }

  /**
   * Delay artificial para evitar força bruta rápida
   */
  static async securityDelay(): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, 800));
  }
}
