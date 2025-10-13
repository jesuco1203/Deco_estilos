import { NextResponse } from "next/server";

const EDGE_URL =
  "https://qehmrxrrtestgxvqjjze.functions.supabase.co/wishlist/list";

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

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const anonId = searchParams.get("anonId");
  const contactId =
    searchParams.get("contactId") ?? req.headers.get("x-contact-id");
  const incomingCookie = req.headers.get("cookie");
  const mergedCookie = mergeCookies(incomingCookie, anonId);

  try {
    const res = await fetch(EDGE_URL, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        ...(mergedCookie ? { Cookie: mergedCookie } : {}),
        ...(contactId ? { "X-Contact-ID": contactId } : {}),
      },
    });

    const text = await res.text();
    const contentType = res.headers.get("Content-Type") ?? "application/json";
    const body =
      contentType.includes("application/json") && text
        ? JSON.parse(text)
        : text || undefined;

    if (!res.ok) {
      console.error("Wishlist list proxy non-OK response:", {
        status: res.status,
        body,
      });
    }

    return typeof body === "string"
      ? new NextResponse(body, {
          status: res.status,
          headers: { "Content-Type": contentType },
        })
      : NextResponse.json(body ?? {}, { status: res.status });
  } catch (error) {
    console.error("Wishlist list proxy error:", error);
    return NextResponse.json(
      { error: "Failed to reach wishlist service" },
      { status: 500 },
    );
  }
}
