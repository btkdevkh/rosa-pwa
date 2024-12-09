import { NextApiRequest, NextApiResponse } from "next";
import { db } from "@/app/lib/db";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export async function GET(request: NextApiRequest, response: NextApiResponse) {
  const res = await db.exploitations.findMany();
  console.log("res :", res);

  return new Response(JSON.stringify({ message: "" }), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
}
