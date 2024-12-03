import NextAuth from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import authOptions from "../authOptions";

const handler: (req: NextRequest) => Promise<NextResponse> =
  NextAuth(authOptions);

export { handler as GET, handler as POST };
