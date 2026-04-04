import { auth } from "@/auth"
import { NextResponse } from "next/server"

// 認証不要のパス
const PUBLIC_PATHS = ["/login", "/id/"]

export default auth((req) => {
  const isLoggedIn = !!req.auth
  const { pathname } = req.nextUrl

  const isPublic = PUBLIC_PATHS.some((path) => pathname.startsWith(path))

  if (!isLoggedIn && !isPublic) {
    return NextResponse.redirect(new URL("/login", req.nextUrl))
  }

  return NextResponse.next()
})

export const config = {
  // api・_next・静的ファイル・faviconは除外
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico|.*\\..*).*)"],
}
