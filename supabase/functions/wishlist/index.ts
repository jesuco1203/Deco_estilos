// deno.json: { "imports": { "@supabase/supabase-js": "npm:@supabase/supabase-js@2" } }
import { serve } from "https://deno.land/std@0.224.0/http/server.ts";
import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = Deno.env.get("SB_URL")!;
const SERVICE_ROLE_KEY = Deno.env.get("SB_SERVICE_ROLE_KEY")!;
const COOKIE_NAME = "anon_id";

function getCookie(req: Request, name: string) {
  const cookie = req.headers.get("cookie") || "";
  const m = cookie.match(new RegExp(`${name}=([^;]+)`));
  return m ? decodeURIComponent(m[1]) : null;
}
function setCookie(headers: Headers, name: string, value: string) {
  headers.append("Set-Cookie", `${name}=${encodeURIComponent(value)}; Path=/; Max-Age=15552000; HttpOnly; SameSite=Lax; Secure`);
}

serve(async (req) => {
  const url = new URL(req.url);
  const path = url.pathname;

  // CORS básico (ajusta origin si quieres restringir)
  const headers = new Headers({
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET,POST,OPTIONS",
    "Access-Control-Allow-Headers": "content-type",
  });
  if (req.method === "OPTIONS") return new Response("ok", { headers });

  // Importante: Service role salta RLS
  const supa = createClient(SUPABASE_URL, SERVICE_ROLE_KEY);

  // Gestiona anon_id
  let anonId = getCookie(req, COOKIE_NAME);
  if (!anonId) {
    anonId = crypto.randomUUID();
    setCookie(headers, COOKIE_NAME, anonId);
  }

  try {
    if (path === "/toggle" && req.method === "POST") {
      const { productId } = await req.json();
      if (!productId) return new Response(JSON.stringify({ error: "productId requerido" }), { status: 400, headers });

      // Lee o crea wishlist
      const { data: wl } = await supa.from("wishlists").select("id, items").eq("anon_id", anonId).maybeSingle();
      if (!wl) {
        const items = [productId];
        await supa.from("wishlists").insert({ anon_id: anonId, items });
        return new Response(JSON.stringify({ status: "added", items }), { headers });
      } else {
        const set = new Set<string>(Array.isArray(wl.items) ? wl.items : []);
        if (set.has(productId)) set.delete(productId); else set.add(productId);
        const items = Array.from(set);
        await supa.from("wishlists").update({ items }).eq("id", wl.id);
        return new Response(JSON.stringify({ status: set.has(productId) ? "added" : "removed", items }), { headers });
      }
    }

    if (path === "/list" && req.method === "GET") {
      const { data: wl } = await supa.from("wishlists").select("items").eq("anon_id", anonId).maybeSingle();
      const items = wl?.items ?? [];
      return new Response(JSON.stringify({ items }), { headers });
    }

    return new Response(JSON.stringify({ error: "Not found" }), { status: 404, headers });
  } catch (e) {
    console.error(e);
    return new Response(JSON.stringify({ error: "Server error" }), { status: 500, headers });
  }
});