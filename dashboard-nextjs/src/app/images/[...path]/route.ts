export const runtime = 'nodejs';

import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

function guessContentType(path: string) {
  const ext = path.split(".").pop()?.toLowerCase();
  switch (ext) {
    case "jpg":
    case "jpeg":
      return "image/jpeg";
    case "png":
      return "image/png";
    case "webp":
      return "image/webp";
    case "gif":
      return "image/gif";
    case "svg":
      return "image/svg+xml";
    default:
      return "application/octet-stream";
  }
}

export async function GET(
  _request: Request,
  context: { params: Promise<{ path:string[] }> },
) {
  const { path } = await context.params;
  const storagePath = path.join("/");

  const supabase = await createClient();
  const { data, error } = await supabase.storage
    .from("products")
    .download(storagePath);
  if (error || !data) {
    return NextResponse.json(
      { error: error?.message ?? "Not found" },
      { status: 404 },
    );
  }

  const ct = guessContentType(storagePath);
  const body: ArrayBuffer | Blob =
    "arrayBuffer" in data ? await data.arrayBuffer() : data;

  return new NextResponse(body, {
    headers: {
      "Content-Type": ct,
      "Cache-Control": "public, max-age=31536000, immutable",
    },
  });
}