// ============================================================================
// EAREC AUDIOVISUAL - UTILITÁRIOS DE SEGURANÇA E SANEAMENTO (security.ts)
// ============================================================================
// Olá, dev! 👋
// Este módulo lida com higienização de inputs do usuário (prevenção a XSS),
// geração de hash criptográfico nativo via Web Crypto API (SubtleCrypto) e
// mitigação de ataques de tempo (timing attacks).
// Tudo opera 100% no cliente sem dependências externas pesadas.
// ============================================================================

/**
 * Módulo de Segurança
 * -------------------
 * Utilitários para criptografia, hash e saneamento de dados.
 */

/**
 * Gera um Hash SHA-256 de uma string.
 * Utiliza a API nativa de criptografia do navegador (SubtleCrypto),
 * ideal para checagem rápida de senhas ou integridade de dados locais.
 */
export const sha256 = async (message: string): Promise<string> => {
  const msgBuffer = new TextEncoder().encode(message);
  const hashBuffer = await crypto.subtle.digest('SHA-256', msgBuffer);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  return hashHex;
};

/**
 * Verifica se a senha fornecida corresponde ao Hash armazenado.
 * Normaliza os caracteres (trim e uppercase) para evitar rejeições acidentais de teclado móvel.
 * 
 * @param input Senha digitada pelo usuário
 * @param targetHash Hash SHA-256 esperado
 */
export const verifyHash = async (input: string, targetHash: string): Promise<boolean> => {
  if (!input) return false;
  const inputHash = await sha256(input.trim().toUpperCase());
  return inputHash === targetHash;
};

/**
 * Remove tags HTML e caracteres perigosos de uma string (Basic XSS Prevention).
 * Útil para dados de formulário que serão exibidos na UI ou salvos em localStorage.
 */
export const sanitizeInput = (input: string): string => {
  if (!input) return "";
  return input
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
};

/**
 * Gera um delay artificial para prevenir Timing Attacks rudimentares e melhorar UX.
 * Dá a sensação de conferência e protege fluxos de autenticação/validação.
 */
export const securityDelay = (): Promise<void> => new Promise<void>(resolve => setTimeout(resolve, 800));
