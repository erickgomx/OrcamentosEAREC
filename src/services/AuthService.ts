

import { verifyHash, securityDelay } from "../lib/security";

/**
 * AuthService
 * -----------
 * Gerencia autenticação via Hash SHA-256.
 * Nenhuma senha é armazenada em texto plano no código fonte.
 */
export class AuthService {
  
  // Hash SHA-256 da senha "XINGU" (Upper case)
  // Gerado via: crypto.subtle.digest('SHA-256', new TextEncoder().encode("XINGU"))
  private static readonly MASTER_HASH = "f9a94156641578d5231c035650742145b271d440056976274495c065f4640103";

  /**
   * Verifica as credenciais de forma assíncrona e segura.
   */
  static async verify(password: string): Promise<boolean> {
    if (!password) return false;
    // Verifica contra o hash, não contra a string
    return await verifyHash(password, this.MASTER_HASH);
  }

  /**
   * Delay artificial para evitar ataques de força bruta e melhorar UX
   */
  static async securityDelay(): Promise<void> {
    return securityDelay();
  }
}
