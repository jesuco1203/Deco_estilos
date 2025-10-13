import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { randomUUID } from "crypto";

export const runtime = "nodejs"; // asegura ambiente Node, no Edge

export async function POST(req: NextRequest) {
  try {
    // TODO: validar sesión/rol según tu auth
    const { filename, contentType, productId } = await req.json();

    const MAX_BYTES = 15 * 1024 * 1024;
    if (Number(req.headers.get("x-file-size") || 0) > MAX_BYTES) {
      return NextResponse.json(
        { error: "Archivo demasiado grande" },
        { status: 400 },
      );
    }

    const allowed = [
      "image/jpeg",
      "image/png",
      "image/webp",
      "image/avif",
      "image/heic",
    ];
    if (!allowed.includes(contentType)) {
      return NextResponse.json(
        { error: "Tipo de archivo no permitido" },
        { status: 400 },
      );
    }

    const ext = (filename?.split(".").pop() || "jpg").toLowerCase();
    const key = `products/${productId || "general"}/${randomUUID()}.${ext}`;

    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!, // server-only
    );

    const { data, error } = await supabase.storage
      .from("products")
      .createSignedUploadUrl(key, { upsert: false });

    if (error)
      return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json({
      path: key,
      signedUrl: data.signedUrl,
      token: data.token,
    });
  } catch {
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}
