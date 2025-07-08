import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// This function can be marked `async` if using `await` inside
export async function middleware(request: NextRequest) {
  const cookie = request.cookies.get("next-auth.session-token")?.value;

  const isAuthenticated = cookie ? true : false;
  const pathSegments = request.nextUrl.pathname.split("/");

  if (
    !isAuthenticated &&
    (pathSegments[1] == "create-event" ||
      pathSegments[1] == "events" ||
      pathSegments[1] == "portfolio")
  ) {
    const loginUrl = "/auth/signin";
    const redirectUrl = new URL(loginUrl, request.nextUrl.origin);
    return NextResponse.redirect(redirectUrl.toString());
  }

  if (isAuthenticated && pathSegments[1] == "auth") {
    const homeUrl = "/";
    const redirectUrl = new URL(homeUrl, request.nextUrl.origin);
    return NextResponse.redirect(redirectUrl.toString());
  }

  return NextResponse.next();
}
