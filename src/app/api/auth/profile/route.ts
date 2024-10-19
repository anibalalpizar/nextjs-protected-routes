import type { UserPayload } from "@/types/types";
import { verify } from "jsonwebtoken";
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const token = req.cookies.get("token-auth");

  if (!token)
    return NextResponse.json({ message: "No token present" }, { status: 401 });

  try {
    const { email } = verify(token.value, "secret") as UserPayload;

    return NextResponse.json({ email }, { status: 200 });
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
