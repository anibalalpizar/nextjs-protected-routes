import { serialize } from "cookie";
import { verify } from "jsonwebtoken";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  // plain text cookie header
  const cookieHeader = req.headers.get("cookie");

  console.log(cookieHeader);

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
    verify(token, "secret");
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
