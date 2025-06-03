import { type NextRequest } from 'next/server'
import { updateSession } from '@/utils/supabase/middleware'
import { NextResponse } from 'next/server'
import { createClient } from "@/utils/supabase/server";

const publicRoutes = ["/", "/login","/auth/callback"]


export async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname
  const supabase = await createClient()
  const { data } = await supabase.auth.getUser()

  const isPublicRoute = publicRoutes.includes(pathname)
  
  if (!isPublicRoute) {
    
    // Redirect to login if user is not authenticated
    if (data.user===null) {
      console.log("is this called?")
      return NextResponse.redirect(new URL("/login", request.url))
    }
  }
  return await updateSession(request)
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * Feel free to modify this pattern to include more paths.
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}