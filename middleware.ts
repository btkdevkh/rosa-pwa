import { NextRequest, NextResponse } from "next/server";
import { MenuUrlPath } from "./app/models/enums/MenuUrlPathEnum";
import { cookies } from "next/headers";

export default async function middleware(
  request: NextRequest,
  response: NextResponse
) {
  console.log("Middleware activated!");

  // @todo: auth staffs in this middleware
  const cookie = (await cookies()).get("");

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

  return responseNext;
}

// specify the path regex to apply the middleware to
export const config = {
  matcher: [
    MenuUrlPath.SETTINGS,
    MenuUrlPath.OBSERVATIONS,
    MenuUrlPath.ANALYSES,
  ],
};
