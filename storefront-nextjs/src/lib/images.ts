type KeyLike = string | null | undefined;

type ImageLike = {
  storage_key?: KeyLike;
  storageKey?: KeyLike;
  image_url?: string | null;
  imageUrl?: string | null;
};

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;

export const PLACEHOLDER = "/placeholder-600x600.svg";

export function isPlaceholder(src?: string | null) {
  if (!src) return true;
  return src.includes(PLACEHOLDER);
}

export function getPublicFromStorageKey(key?: KeyLike) {
  if (!key) return null;
  if (!SUPABASE_URL) return null;
  const trimmed = key.trim().replace(/^products\//, "");
  if (!trimmed) return null;
  const encoded = trimmed
    .split("/")
    .map((segment) => encodeURIComponent(segment))
    .join("/");
  return `${SUPABASE_URL}/storage/v1/object/public/products/${encoded}`;
}

export function resolveImageSrc(
  input: ImageLike,
  opts: { placeholder?: string } = {},
) {
  const placeholder = opts.placeholder ?? PLACEHOLDER;
  const candidate =
    getPublicFromStorageKey(input.storage_key ?? input.storageKey) ??
    input.image_url ??
    input.imageUrl ??
    null;

  if (!candidate || candidate.includes(placeholder)) return null;
  return candidate;
}

export function getProductImageSrc(input: ImageLike) {
  return resolveImageSrc(input) ?? PLACEHOLDER;
}
