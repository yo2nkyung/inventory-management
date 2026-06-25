import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

const backendBaseUrl = process.env.BACKEND_API_BASE_URL ?? process.env.NEXT_PUBLIC_API_BASE_URL;

const proxyRequest = async (
  request: NextRequest,
  context: { params: Promise<{ path: string[] }> },
) => {
  if (!backendBaseUrl) {
    return NextResponse.json(
      { message: "Missing backend API base URL" },
      { status: 500 },
    );
  }

  const { path } = await context.params;
  const targetUrl = new URL(`${backendBaseUrl.replace(/\/$/, "")}/${path.join("/")}`);
  targetUrl.search = request.nextUrl.search;

  const headers = new Headers(request.headers);
  headers.delete("host");
  headers.delete("content-length");

  const init: RequestInit = {
    method: request.method,
    headers,
    cache: "no-store",
  };

  if (request.method !== "GET" && request.method !== "HEAD") {
    init.body = await request.text();
  }

  const response = await fetch(targetUrl, init);
  const responseHeaders = new Headers(response.headers);
  responseHeaders.delete("content-encoding");
  responseHeaders.delete("content-length");

  return new NextResponse(response.body, {
    status: response.status,
    statusText: response.statusText,
    headers: responseHeaders,
  });
};

export const GET = proxyRequest;
export const POST = proxyRequest;
export const PUT = proxyRequest;
export const PATCH = proxyRequest;
export const DELETE = proxyRequest;
export const OPTIONS = proxyRequest;
