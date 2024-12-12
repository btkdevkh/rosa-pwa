import { NextResponse } from "next/server";

export function middleware() {
  console.log("Je suis le middleware qui gère le CORS!");

  // retrieve the current response
  const res = NextResponse.next();

  // add the CORS headers to the response
  res.headers.append("Access-Control-Allow-Credentials", "true");
  // replace this your actual origin
  // res.headers.append("Access-Control-Allow-Origin", "*");
  res.headers.append("Access-Control-Allow-Origin", "http://localhost:3000");
  res.headers.append(
    "Access-Control-Allow-Methods",
    "GET,DELETE,PATCH,POST,PUT"
  );
  res.headers.append(
    "Access-Control-Allow-Headers",
    "X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version"
  );

  return res;
}

// specify the path regex to apply the middleware to
// export const config = {
//   matcher: "/api/:path*",
// };
