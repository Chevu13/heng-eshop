import { NextResponse, type NextRequest } from 'next/server';
import { updateSession } from '@/lib/supabase/middleware';
import { isSupabaseConfigured } from '@/lib/env';

/**
 * Zaštita /admin ruta. Sesija se osvežava pri svakom zahtevu; provera uloge
 * se dodatno radi u admin layout-u (server-side), tako da middleware ne može
 * biti jedina linija odbrane.
 */
export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (!pathname.startsWith('/admin')) return NextResponse.next();

  // Bez baze admin panel prikazuje uputstvo za povezivanje.
  if (!isSupabaseConfigured) return NextResponse.next();

  const { response, user } = await updateSession(request);
  const isLogin = pathname === '/admin/prijava' || pathname === '/admin/oporavak-lozinke';

  if (!user && !isLogin) {
    const url = request.nextUrl.clone();
    url.pathname = '/admin/prijava';
    url.searchParams.set('nastavi', pathname);
    return NextResponse.redirect(url);
  }

  if (user && isLogin) {
    const url = request.nextUrl.clone();
    url.pathname = '/admin';
    url.search = '';
    return NextResponse.redirect(url);
  }

  return response;
}

export const config = {
  matcher: ['/admin/:path*'],
};
