import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const token = await getToken({ req });

  const isAuthPage = ["/auth/login", "/auth/register"].includes(pathname);
  const isPublicPage = ["/about", "/contact", "/", "/shop"].some(p => pathname.startsWith(p));
  const isProtectedPage = !isPublicPage && !isAuthPage;

  // 1. Redirigir usuarios autenticados que intentan acceder a páginas de auth
  if (token && isAuthPage) {
    return NextResponse.redirect(new URL("/", req.url));
  }

  // 2. Redirigir usuarios no autenticados que intentan acceder a páginas protegidas
  if (!token && isProtectedPage) {
    // Guardar la URL a la que intentaban acceder para redirigir después del login
    const callbackUrl = encodeURIComponent(pathname);
    return NextResponse.redirect(new URL(`/auth/login?callbackUrl=${callbackUrl}`, req.url));
  }

  // 3. Verificar permisos de admin para rutas /admin
  if (pathname.startsWith("/admin") && token?.role !== "admin") {
    return NextResponse.redirect(new URL("/", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};