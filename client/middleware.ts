import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(req: NextRequest) {
  const url = req.nextUrl;
  const host = req.headers.get("host") || "";
  const subdomain = host.split(".")[0];

  url.pathname = `/${subdomain}${url.pathname}`;
  return NextResponse.rewrite(url);
}
