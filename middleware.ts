import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  // Protection du dashboard - côté client via AuthContext
  // Le middleware Next.js ne peut pas facilement vérifier les sessions Supabase
  // car elles sont stockées dans les cookies HttpOnly
  
  // Pour une protection simple, on laisse le client gérer la redirection
  // via le useEffect dans dashboard/page.tsx
  
  return NextResponse.next()
}

export const config = {
  matcher: ['/dashboard/:path*', '/api/generate', '/api/projects/:path*'],
}
