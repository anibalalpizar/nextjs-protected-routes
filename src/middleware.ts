import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { jwtVerify } from "jose";

/*
 * Read more: https://nextjs.org/docs/app/building-your-application/routing/middleware
 */

export async function middleware(request: NextRequest) {
  const cookie = request.cookies.get("token-auth");

  if (cookie == undefined)
    return NextResponse.redirect(new URL("/login", request.url));

  try {
    await jwtVerify(cookie.value, new TextEncoder().encode("secret"));
    return NextResponse.next();
  } catch (error) {
    console.log("Error verifying token", error);
    return NextResponse.redirect(new URL("/login", request.url));
  }
}

export const config = {
  matcher: ["/dashboard", "/"],
};
