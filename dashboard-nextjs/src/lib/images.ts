type ProductLike = {
  storage_key?: string | null;
  storageKey?: string | null;
  image_url?: string | null;
  imageUrl?: string | null;
};

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;

export function getSupabasePublicUrl(key: string) {
  if (!SUPABASE_URL) return null;
  const trimmed = key.replace(/^products\//, "");
  const encoded = trimmed
    .split("/")
    .map((segment) => encodeURIComponent(segment))
    .join("/");
  return `${SUPABASE_URL}/storage/v1/object/public/products/${encoded}`;
}

export function getProductImageSrc(p: ProductLike) {
  const key = p.storage_key ?? p.storageKey ?? null;
  const legacy = p.image_url ?? p.imageUrl ?? null;

  if (legacy && legacy.trim().length > 0) return legacy;
  if (key && key.trim().length > 0) {
    const publicUrl = getSupabasePublicUrl(key.trim());
    if (publicUrl) return publicUrl;
  }
  return "/placeholder-600x600.svg";
}
