

/**
 * Módulo de Segurança
 * -------------------
 * Utilitários para criptografia, hash e saneamento de dados.
 */

/**
 * Gera um Hash SHA-256 de uma string.
 * Utiliza a API nativa de criptografia do navegador (SubtleCrypto).
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
 * Útil para dados que serão exibidos na UI ou salvos em localStorage.
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
 */
export const securityDelay = (): Promise<void> => new Promise<void>(resolve => setTimeout(resolve, 800));
