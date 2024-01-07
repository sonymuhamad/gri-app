import { NextResponse } from "next/server";
import { NextRequest } from "next/server";
import { USER_DATA } from "./const/project";

const UN_PROTECTED_API = ["/api/healtz", "/api/login"];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (pathname.startsWith("/api")) {
    if (!UN_PROTECTED_API.includes(pathname)) {
      const authorization = request.headers.get("Authorization");
      if (!authorization) {
        return NextResponse.json(
          { message: "Access Token is Required" },
          { status: 401 }
        );
      }
    }
  }

  const session = request.cookies.get(USER_DATA);
  if (pathname.startsWith("/admin")) {
    if (!session) {
      return NextResponse.redirect(new URL("/", request.url));
    }
  }

  if (pathname === "/" && session) {
    return NextResponse.redirect(new URL("/admin/dashboard", request.url));
  }

  return NextResponse.next();
}

// See "Matching Paths" below to learn more
export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
