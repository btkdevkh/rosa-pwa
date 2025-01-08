import { NextResponse } from "next/server";

export async function middleware() {
  console.log("Middleware activated!");

  // retrieve the current response
  const response = NextResponse.next();

  // add the CORS headers to the response
  response.headers.append("Access-Control-Allow-Credentials", "true");
  response.headers.append(
    "Access-Control-Allow-Origin",
    process.env.NEXT_PUBLIC_ACCESS_CONTROL_ALLOW_ORIGIN_URL! // replace this your actual origin
  );
  response.headers.append(
    "Access-Control-Allow-Methods",
    "GET,DELETE,PATCH,POST,PUT"
  );
  response.headers.append(
    "Access-Control-Allow-Headers",
    "X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version"
  );

  return response;
}

// specify the path regex to apply the middleware to
export const config = {
  matcher: "/api/:path*",
};
