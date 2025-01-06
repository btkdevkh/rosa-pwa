import { getToken } from "next-auth/jwt";
import { NextRequest, NextResponse } from "next/server";

export async function middlewareAuth(req: NextRequest) {
  console.log("Middleware auth activated!");

  // Fetch the token using next-auth's getToken utility
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });

  if (!token) {
    return NextResponse.json({ message: "Not authorized" }, { status: 401 });
  }

  // If the user is authenticated, continue with the response
  return NextResponse.next();
}

export const config = {
  matcher: "/api/:path*", // Apply middleware to specific routes
};
