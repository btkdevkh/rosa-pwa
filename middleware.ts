import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import { MenuUrlPath } from "./app/models/enums/MenuUrlPathEnum";

export default async function middleware(
  request: NextRequest
  // response: NextResponse
) {
  console.log("Middleware Activated!");

  // Browsers send a preflight request (OPTIONS method)
  // before making certain cross-origin requests.
  // Since your middleware only handles GET, POST, etc.,
  // and doesn't respond to OPTIONS,
  // the browser may block requests.
  // Handle CORS for preflight (OPTIONS) requests
  if (request.method === "OPTIONS") {
    return new NextResponse(null, {
      headers: {
        "Access-Control-Allow-Credentials": "true",
        "Access-Control-Allow-Origin":
          process.env.NEXT_PUBLIC_ACCESS_CONTROL_ALLOW_ORIGIN_URL!,
        "Access-Control-Allow-Methods": "GET,DELETE,PATCH,POST,PUT,OPTIONS",
        "Access-Control-Allow-Headers":
          "X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version",
      },
    });
  }

  // retrieve the current response
  const responseNext = NextResponse.next();

  // add the CORS headers to the response
  responseNext.headers.append("Access-Control-Allow-Credentials", "true");
  responseNext.headers.append(
    "Access-Control-Allow-Origin",
    process.env.NEXT_PUBLIC_ACCESS_CONTROL_ALLOW_ORIGIN_URL! // replace this your actual origin
  );
  responseNext.headers.append(
    "Access-Control-Allow-Methods",
    "GET,DELETE,PATCH,POST,PUT"
  );
  responseNext.headers.append(
    "Access-Control-Allow-Headers",
    "X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version"
  );

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
    "/settings",
    "/observations",
    "/analyses",
    "/analyses/widgets/reorderWidget",
  ],
};
