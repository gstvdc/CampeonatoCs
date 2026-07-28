import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { checkRateLimit, getClientIp } from '@/lib/rateLimit';

export function withApiAuth(handler: (request: Request, ip: string) => Promise<NextResponse>) {
  return async (request: Request) => {
    try {
      if (!supabase) {
        return NextResponse.json({ success: false, error: 'Banco de dados não configurado.' }, { status: 500 });
      }

      const ip = getClientIp(request);
      const rateLimit = checkRateLimit(ip);
      if (!rateLimit.success) {
        return NextResponse.json({ success: false, error: rateLimit.error }, { status: 429 });
      }

      return await handler(request, ip);
    } catch (err: unknown) {
      console.error('API Error:', err);
      return NextResponse.json({ success: false, error: 'Erro interno no servidor.' }, { status: 500 });
    }
  };
}
