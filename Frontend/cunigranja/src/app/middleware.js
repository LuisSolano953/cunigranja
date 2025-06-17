import { NextResponse } from "next/server"
import { jwtDecode } from "jwt-decode"

export function middleware(request) {
  const path = request.nextUrl.pathname

  // Rutas públicas que no requieren autenticación
  const publicRoutes = [
    "/",
    "/user/login",
    "/user/register",
    "/user/password",
    "/quienes-somos",
    "/contactanos",
    "/documentacion",
    "/unauthorized",
    "/admin/settings",
    "/resetpassword",
  ]

  // Rutas que requieren rol de administrador
  const adminRoutes = ["/admin", "/admin/users"]

  // Rutas que requieren autenticación (cualquier usuario)
  const protectedRoutes = ["/Dashboar"]

  // Verificar si la ruta actual es pública
  const isPublicRoute = publicRoutes.some((route) => path === route || path.startsWith(route + "/"))

  // Si es una ruta pública, permitir acceso
  if (isPublicRoute) {
    return NextResponse.next()
  }

  // Verificar si es una ruta protegida o de administrador
  const isProtectedRoute = protectedRoutes.some((route) => path === route || path.startsWith(route + "/"))
  const isAdminRoute = adminRoutes.some((route) => path === route || path.startsWith(route + "/"))

  // Si no es una ruta pública ni protegida ni de administrador, permitir acceso
  if (!isProtectedRoute && !isAdminRoute) {
    return NextResponse.next()
  }

  // Obtener el token de las cookies
  const token = request.cookies.get("token")?.value

  // Si no hay token, redirigir al login
  if (!token) {
    console.log(`Acceso denegado a ${path}: No hay token`)
    const response = NextResponse.redirect(new URL("/user/login", request.url))
    // Limpiar cualquier cookie de token corrupta
    response.cookies.delete("token")
    return response
  }

  try {
    // Decodificar el token
    const decoded = jwtDecode(token)

    // Verificar si el token ha expirado
    if (decoded.exp * 1000 < Date.now()) {
      console.log(`Acceso denegado a ${path}: Token expirado`)
      const response = NextResponse.redirect(new URL("/user/login", request.url))
      // Limpiar cookie expirada
      response.cookies.delete("token")
      return response
    }

    // Si es una ruta de administrador, verificar el rol
    if (isAdminRoute) {
      if (decoded.tipo_user !== "administrador") {
        console.log(`Acceso denegado a ${path}: No es administrador`)
        return NextResponse.redirect(new URL("/unauthorized", request.url))
      }
    }

    // Si todo está bien, permitir acceso
    return NextResponse.next()
  } catch (error) {
    // Error al decodificar el token, redirigir al login
    console.error("Error en middleware:", error)
    const response = NextResponse.redirect(new URL("/user/login", request.url))
    // Limpiar cookie corrupta
    response.cookies.delete("token")
    return response
  }
}

export const config = {
  matcher: ["/((?!api|_next|static|.*\\..*|_vercel).*)"],
}
