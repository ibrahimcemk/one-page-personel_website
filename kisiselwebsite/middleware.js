import { NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';

export async function middleware(request) {
  // Oturumu kontrol et
  const token = await getToken({ 
    req: request, 
    secret: process.env.NEXTAUTH_SECRET || 'portfoy-gizli-anahtar' 
  });
  const path = request.nextUrl.pathname;

  // /admin ile başlayan URL'ler için rol kontrolü
  if (path.startsWith('/admin')) {
    // Konsola debug bilgisi
    console.log('Admin sayfasına erişim isteği:', path);
    console.log('Token bilgisi:', token);
    
    // Oturum yoksa veya admin rolü yoksa giriş sayfasına yönlendir
    if (!token) {
      console.log('Token bulunamadı, giriş sayfasına yönlendiriliyor');
      const url = new URL('/auth/login', request.url);
      url.searchParams.set('callbackUrl', request.nextUrl.pathname);
      return NextResponse.redirect(url);
    }
    
    if (token.role !== 'admin') {
      console.log('Admin yetkisi yok, ana sayfaya yönlendiriliyor');
      return NextResponse.redirect(new URL('/', request.url));
    }
  }

  // /profile ile başlayan URL'ler için oturum kontrolü
  if (path.startsWith('/profile')) {
    // Oturum yoksa giriş sayfasına yönlendir
    if (!token) {
      const url = new URL('/auth/login', request.url);
      url.searchParams.set('callbackUrl', request.nextUrl.pathname);
      return NextResponse.redirect(url);
    }
  }
  
  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*', '/profile/:path*'],
};
