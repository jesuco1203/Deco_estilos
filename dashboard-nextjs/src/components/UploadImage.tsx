"use client";

import React from "react";
import { createClient } from "@/lib/supabase/client";
import { getSupabasePublicUrl } from "@/lib/images";

type UploadImageProps = {
  initialUrl?: string | null;
  onUploaded: (res: {
    publicUrl: string;
    storage_key: string;
    fileName: string;
    fileSize: number;
  }) => void;
  onUploadingChange?: (state: boolean) => void;
};

const ACCEPTED_MIME = /image\/(jpe?g|png|webp|avif)/i;
const MAX_MB = 5;

function formatBytes(bytes: number) {
  if (bytes === 0) return "0 B";
  const k = 1024;
  const sizes = ["B", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  const value = bytes / Math.pow(k, i);
  return `${value.toFixed(value >= 10 ? 0 : 1)} ${sizes[i]}`;
}

export default function UploadImage({
  initialUrl,
  onUploaded,
  onUploadingChange,
}: UploadImageProps) {
  const supabase = React.useMemo(() => createClient(), []);
  const inputId = React.useId();
  const [preview, setPreview] = React.useState<string | null>(
    initialUrl ?? null,
  );
  const [fileMeta, setFileMeta] = React.useState<{
    name: string;
    size: number;
  } | null>(null);
  const [busy, setBusy] = React.useState(false);

  React.useEffect(() => {
    setPreview(initialUrl ?? null);
    if (!initialUrl) {
      setFileMeta(null);
    }
  }, [initialUrl]);

  React.useEffect(() => {
    return () => {
      if (preview?.startsWith("blob:")) {
        URL.revokeObjectURL(preview);
      }
    };
  }, [preview]);

  async function handleFile(file: File) {
    if (!file || busy) return;
    if (!ACCEPTED_MIME.test(file.type)) {
      alert("Formato inválido. Usa JPG, PNG, WEBP o AVIF.");
      return;
    }
    if (file.size > MAX_MB * 1024 * 1024) {
      alert(`Máximo ${MAX_MB} MB.`);
      return;
    }

    if (preview?.startsWith("blob:")) {
      URL.revokeObjectURL(preview);
    }

    const objectUrl = URL.createObjectURL(file);
    setPreview(objectUrl);
    setFileMeta({ name: file.name, size: file.size });
    setBusy(true);
    onUploadingChange?.(true);

    try {
      const timestamp = Date.now();
      const sanitizedName = file.name.replace(/\s+/g, "_");
      const objectKey = `${timestamp}-${sanitizedName}`;

      const { data, error } = await supabase.storage
        .from("products")
        .upload(objectKey, file, {
          contentType: file.type,
          upsert: true,
          cacheControl: "3600",
        });

      if (error) throw error;

      const storageKey = data?.path ?? objectKey;
      const publicUrl = getSupabasePublicUrl(storageKey) ?? objectUrl;

      onUploaded({
        publicUrl,
        storage_key: storageKey,
        fileName: file.name,
        fileSize: file.size,
      });
    } catch (error) {
      console.error("UPLOAD ERROR", error);
      const message =
        error instanceof Error ? error.message : "Error al subir la imagen";
      alert(message);
    } finally {
      setBusy(false);
      onUploadingChange?.(false);
    }
  }

  return (
    <div className="space-y-3">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
        <label
          htmlFor={inputId}
          aria-label="Subir foto del producto"
          aria-disabled={busy}
          className={`inline-flex w-full items-center justify-center rounded-xl px-4 py-2 text-sm font-medium text-white shadow-sm transition focus:outline-none focus-visible:ring focus-visible:ring-amber-500 active:scale-[0.99] sm:w-auto whitespace-nowrap min-w-[128px] ${
            busy
              ? "cursor-default bg-amber-400"
              : "cursor-pointer bg-amber-600 hover:bg-amber-700"
          }`}
        >
          {busy ? "Subiendo…" : "Subir foto"}
        </label>
        <span className="hidden text-xs text-gray-500 sm:ml-2 sm:inline">
          o arrastra y suelta en el recuadro
        </span>
        <input
          id={inputId}
          type="file"
          accept="image/png,image/jpeg,image/webp,image/avif"
          className="sr-only"
          onChange={(event) => {
            const file = event.target.files?.[0];
            if (file) void handleFile(file);
          }}
        />
      </div>

      <div
        role="button"
        tabIndex={0}
        onKeyDown={(event) => {
          if (event.key === "Enter" || event.key === " ") {
            event.preventDefault();
            const element = document.getElementById(
              inputId,
            ) as HTMLInputElement | null;
            element?.click();
          }
        }}
        onDragOver={(event) => event.preventDefault()}
        onDrop={(event) => {
          event.preventDefault();
          const file = event.dataTransfer.files?.[0];
          if (file) void handleFile(file);
        }}
        className="mt-3 rounded-2xl border border-dashed p-4 text-center text-sm text-gray-500 focus:outline-none focus-visible:ring focus-visible:ring-amber-500"
      >
        Arrastra una imagen aquí
      </div>

      {fileMeta && (
        <div className="text-xs text-gray-600">
          {fileMeta.name} · {formatBytes(fileMeta.size)}
        </div>
      )}

      {preview && (
        /* eslint-disable-next-line @next/next/no-img-element */
        <img
          src={preview}
          alt="Vista previa"
          className="mt-3 max-h-56 w-auto rounded-xl border object-contain"
        />
      )}
    </div>
  );
}
