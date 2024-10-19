import { serialize } from "cookie";
import { verify } from "jsonwebtoken";
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const token = req.cookies.get("token-auth");

  if (!token)
    return NextResponse.json({ message: "No token present" }, { status: 401 });

  try {
    verify(token.value, "secret");
    const serializedToken = serialize("token-auth", "", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict", // same domain -> strict, any domain -> none
      maxAge: 0,
      path: "/",
    });

    const response = NextResponse.json(
      { message: "Logged out" },
      { status: 200 }
    );

    response.headers.append("Set-Cookie", serializedToken);

    return response;
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
