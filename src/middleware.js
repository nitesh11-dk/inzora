
import { getUserFromToken } from "@/lib/auth";
import { NextResponse } from "next/server";
import { cookies } from "next/headers";
export async function middleware(req) {
  const cookiesList = await cookies();
const token = cookiesList.get('token')?.value;

  if (req.nextUrl.pathname.startsWith("/profile") || req.nextUrl.pathname.startsWith("/dashboard")) {
    if (!token) return NextResponse.redirect(new URL("/login", req.url));

    const payload = await getUserFromToken(token);
    if (!payload) return NextResponse.redirect(new URL("/login", req.url));

    const response = NextResponse.next();
    response.headers.set("x-user-id", payload.id);
    return response;
  }

  return NextResponse.next();
}
