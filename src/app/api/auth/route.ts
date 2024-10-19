import { verify, sign } from "jsonwebtoken";
import { NextResponse } from "next/server";
import { serialize } from "cookie";
import type { UserPayload } from "@/types/types";

export async function POST(req: Request) {
  const { email, password } = await req.json();

  if (email === "admin@admin.com" && password === "admin") {
    const token = sign(
      {
        exp: Math.floor(Date.now() / 1000) + 60 * 60,
        email,
      },
      "secret"
    );
    const serializedToken = serialize("token-auth", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict", // same domain -> strict, any domain -> none
      maxAge: 60 * 60,
      path: "/",
    });

    const response = NextResponse.json(
      { message: "Logged in" },
      { status: 200 }
    );

    response.headers.append("Set-Cookie", serializedToken);

    return response;
  } else {
    return NextResponse.json("Invalid credentials", { status: 401 });
  }
}

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
