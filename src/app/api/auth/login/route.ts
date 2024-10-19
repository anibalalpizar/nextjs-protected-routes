import { serialize } from "cookie";
import { sign } from "jsonwebtoken";
import { NextResponse } from "next/server";

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
