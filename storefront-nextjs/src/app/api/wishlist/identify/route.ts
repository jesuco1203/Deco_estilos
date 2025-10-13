import { NextResponse } from "next/server";

const EDGE_URL =
  "https://qehmrxrrtestgxvqjjze.functions.supabase.co/wishlist/identify";

const mergeCookies = (
  existingCookieHeader: string | null,
  anonId?: string | null,
) => {
  const cookieMap = new Map<string, string>();

  if (existingCookieHeader) {
    existingCookieHeader.split(";").forEach((part) => {
      const trimmed = part.trim();
      if (!trimmed) return;
      const separatorIndex = trimmed.indexOf("=");
      if (separatorIndex === -1) return;
      const key = trimmed.slice(0, separatorIndex);
      const value = trimmed.slice(separatorIndex + 1);
      if (key) {
        cookieMap.set(key, value);
      }
    });
  }

  if (anonId) {
    cookieMap.set("anon_id", anonId);
  }

  if (cookieMap.size === 0) {
    return undefined;
  }

  return Array.from(cookieMap.entries())
    .map(([key, value]) => `${key}=${value}`)
    .join("; ");
};

export async function POST(req: Request) {
  const incomingCookie = req.headers.get("cookie");
  const anonIdHeader = req.headers.get("x-anon-id");
  const contactIdHeader = req.headers.get("x-contact-id");
  const bodyText = await req.text();

  const mergedCookie = mergeCookies(incomingCookie, anonIdHeader);

  const res = await fetch(EDGE_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...(mergedCookie ? { Cookie: mergedCookie } : {}),
      ...(anonIdHeader ? { "X-Anon-ID": anonIdHeader } : {}),
      ...(contactIdHeader ? { "X-Contact-ID": contactIdHeader } : {}),
    },
    body: bodyText,
  });

  const text = await res.text();
  const contentType = res.headers.get("Content-Type") ?? "application/json";
  const responseBody =
    contentType.includes("application/json") && text
      ? JSON.parse(text)
      : text || undefined;

  if (!res.ok) {
    console.error("Wishlist identify proxy non-OK response:", {
      status: res.status,
      body: responseBody,
    });
  }

  return typeof responseBody === "string"
    ? new NextResponse(responseBody, {
        status: res.status,
        headers: { "Content-Type": contentType },
      })
    : NextResponse.json(responseBody ?? {}, { status: res.status });
}
