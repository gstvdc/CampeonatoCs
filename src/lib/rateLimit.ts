interface RateLimitEntry {
  count: number;
  lastReset: number;
}

const rateLimitMap = new Map<string, RateLimitEntry>();
const WINDOW_MS = 60 * 1000; // 1 minuto
const MAX_REQUESTS = 5; // 5 requisições por minuto por IP

export function checkRateLimit(ip: string): { success: boolean; error?: string } {
  const now = Date.now();
  const entry = rateLimitMap.get(ip);

  // Limpa IPs antigos aleatoriamente para evitar vazamento de memória (rudimentar)
  if (rateLimitMap.size > 1000) {
    const firstKey = rateLimitMap.keys().next().value;
    if (firstKey) rateLimitMap.delete(firstKey);
  }

  if (!entry) {
    rateLimitMap.set(ip, { count: 1, lastReset: now });
    return { success: true };
  }

  // Se passou a janela de tempo, reseta
  if (now - entry.lastReset > WINDOW_MS) {
    entry.count = 1;
    entry.lastReset = now;
    return { success: true };
  }

  // Incrementa a contagem
  entry.count += 1;

  if (entry.count > MAX_REQUESTS) {
    return { success: false, error: 'Muitas requisições. Tente novamente em um minuto.' };
  }

  return { success: true };
}

export function getClientIp(request: Request): string {
  // Pega o IP de headers comuns ou fallback
  const forwardedFor = request.headers.get('x-forwarded-for');
  const realIp = request.headers.get('x-real-ip');
  
  if (forwardedFor) {
    return forwardedFor.split(',')[0].trim();
  }
  
  return realIp || 'unknown-ip';
}
