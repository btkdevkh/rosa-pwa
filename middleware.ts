import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import { MenuUrlPath } from "./app/models/enums/MenuUrlPathEnum";

export default async function middleware(
  request: NextRequest
  // response: NextResponse
) {
  console.log("Middleware Activated!");

  // retrieve the current response
  const responseNext = NextResponse.next();

  // Get session and extract user infos
  const session = await getToken({
    req: request,
    secret: process.env.NEXTAUTH_SECRET,
  });

  // S'il n'y a pas de session
  // Redirection à "/login"
  if (!session) {
    const loginUrl = new URL(MenuUrlPath.LOGIN, request.url).toString();
    return NextResponse.redirect(loginUrl, 307);
  }

  return responseNext;
}

// Protected routes
// Specify the path regex to apply the middleware
export const config = {
  matcher: [
    "/",
    "/settings/:path*",
    "/observations/:path*",
    "/analyses/:path*",
  ],
};
