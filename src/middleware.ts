import { NextResponse } from "next/server";
import { NextRequest } from "next/server";
// import { USER_DATA } from "./const/project";

export function middleware(request: NextRequest) {
  // const session = request.cookies.get(USER_DATA);
  // if (request.nextUrl.pathname.startsWith("/admin")) {
  //   if (!session) {
  //     return NextResponse.redirect(new URL("/", request.url));
  //   }
  // }

  return NextResponse.next();
}

// See "Matching Paths" below to learn more
export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
