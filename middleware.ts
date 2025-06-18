import { NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";

export async function middleware(req) {
  const { pathname } = req.nextUrl;
  const token = await getToken({ req });

  const isAuthPage = ["/auth/login", "/auth/register"].includes(pathname);

  // ✅ Permitir rutas públicas
  if (["/about", "/contact"].some((p) => pathname.startsWith(p))) {
    return NextResponse.next();
  }

  // ✅ Si el usuario está logueado y quiere ir al login o register, lo rediriges al home o dashboard
  if (token && isAuthPage) {
    return NextResponse.redirect(new URL("/", req.url)); // o "/admin/dashboard" si quieres
  }

  // ✅ Si NO está autenticado y accede a rutas protegidas
  if (!token && !isAuthPage) {
    return NextResponse.redirect(new URL("/auth/login", req.url));
  }

  // ✅ Si intenta acceder a /admin pero no es admin
  if (pathname.startsWith("/admin") && token?.role !== "admin") {
    return NextResponse.redirect(new URL("/", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
