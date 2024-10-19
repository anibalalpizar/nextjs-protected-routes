import type { UserPayload } from "@/types/types";
import { verify } from "jsonwebtoken";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  // plain text cookie header
  const cookieHeader = req.headers.get("cookie");

  if (!cookieHeader)
    return NextResponse.json(
      { message: "No cookies present" },
      { status: 401 }
    );

  // convert plain text cookie header to object
  const cookies = Object.fromEntries(
    cookieHeader.split(";").map((cookie) => cookie.trim().split("="))
  );

  const token = cookies["token-auth"];

  if (!token)
    return NextResponse.json({ message: "Token not found" }, { status: 401 });

  try {
    const user = verify(token, "secret") as UserPayload;
    return NextResponse.json({ email: user.email }, { status: 200 });
  } catch (e) {
    if (e instanceof Error)
      return NextResponse.json(
        { message: `Invalid token: ${e.message}` },
        { status: 401 }
      );
    else
      return NextResponse.json(
        { message: "Unknown error occurred" },
        { status: 500 }
      );
  }
}
