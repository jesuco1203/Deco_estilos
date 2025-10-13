"use client";

import { useRouter } from "next/navigation";
import { ChangeEvent, FormEvent, useMemo, useState } from "react";
import { getProductImageSrc } from "@/lib/images";
import { createClient } from "@/lib/supabase/client";
import UploadImage from "@/components/UploadImage";

interface VariantFormState {
  id?: number;
  size: string | null;
  color: string | null;
  price: string;
  stock_quantity: number;
  image_url: string | null;
}

interface ProductFormState {
  id?: number;
  name: string;
  description: string;
  category: string;
  image_url: string;
  storage_key: string | null;
  tag: string;
  variants: VariantFormState[];
}

interface SupabaseVariant {
  id: number;
  size: string | null;
  color: string | null;
  price: number | null;
  stock_quantity: number | null;
  image_url: string | null;
}

interface SupabaseProduct {
  id: number;
  name: string;
  description: string | null;
  category: string;
  image_url: string | null;
  storage_key: string | null;
  tag: string | null;
  variants: SupabaseVariant[];
}

const categories = [
  "Espejos con marco de metal",
  "Espejos sin marco",
  "Espejos con marco MDF",
  "Espejos corporativos",
  "Mamparas",
  "Estructuras decorativas",
];

const colors = ["Negro", "Plateado", "Dorado"];

const defaultVariant: VariantFormState = {
  size: "",
  color: colors[0],
  price: "",
  stock_quantity: 0,
  image_url: "",
};

export default function ProductForm({
  product: initialProduct,
}: {
  product?: SupabaseProduct;
}) {
  const supabase = createClient();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  const initialProductState: ProductFormState = useMemo(() => {
    if (!initialProduct) {
      return {
        name: "",
        description: "",
        category: categories[0],
        image_url: "",
        storage_key: null,
        tag: "Ninguna",
        variants: [],
      };
    }

    return {
      id: initialProduct.id,
      name: initialProduct.name ?? "",
      description: initialProduct.description ?? "",
      category: initialProduct.category ?? categories[0],
      image_url: initialProduct.image_url ?? "",
      storage_key: initialProduct.storage_key ?? null,
      tag: initialProduct.tag ?? "Ninguna",
      variants:
        initialProduct.variants?.map((variant) => ({
          id: variant.id,
          size: variant.size ?? "",
          color: variant.color ?? colors[0],
          price:
            variant.price !== null && !Number.isNaN(variant.price)
              ? String(variant.price)
              : "",
          stock_quantity: variant.stock_quantity ?? 0,
          image_url: variant.image_url ?? "",
        })) ?? [],
    };
  }, [initialProduct]);

  const [product, setProduct] = useState<ProductFormState>(initialProductState);

  const initialVariants = initialProductState.variants.length
    ? initialProductState.variants
    : [{ ...defaultVariant }];

  const [variants, setVariants] = useState<VariantFormState[]>(initialVariants);

  const [hasVariants, setHasVariants] = useState(
    initialProduct ? (initialProduct.variants?.length ?? 0) > 1 : false,
  );

  const [previewUrl, setPreviewUrl] = useState<string | null>(() => {
    if (initialProductState.storage_key || initialProductState.image_url) {
      return getProductImageSrc(initialProductState);
    }
    return null;
  });

  const handleProductChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;
    setProduct((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleUrlChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setProduct((prev) => ({
      ...prev,
      image_url: value,
      storage_key: null,
    }));
    setPreviewUrl(value.trim() ? value.trim() : null);
  };

  const handleVariantChange = (
    index: number,
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;
    setVariants((prev) =>
      prev.map((variant, i) => {
        if (i !== index) return variant;

        if (name === "stock_quantity") {
          return { ...variant, stock_quantity: Number(value) };
        }

        if (name === "price") {
          return { ...variant, price: value };
        }

        return { ...variant, [name]: value };
      }),
    );
  };

  const handleHasVariantsChange = (checked: boolean) => {
    setHasVariants(checked);
    setVariants((prev) => {
      if (checked) {
        if (prev.length === 0)
          return [{ ...defaultVariant }, { ...defaultVariant }];
        if (prev.length === 1) return [prev[0], { ...defaultVariant }];
        return prev;
      }
      return [prev[0] ?? { ...defaultVariant }];
    });
  };

  const addVariant = () => {
    setVariants((prev) => [...prev, { ...defaultVariant }]);
  };

  const removeVariant = (index: number) => {
    setVariants((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (isUploading) {
      alert("Espera a que termine la subida de la imagen.");
      return;
    }

    const hasImage =
      Boolean(product.storage_key) || Boolean(product.image_url?.trim());
    if (!hasImage) {
      alert("La imagen principal es requerida.");
      return;
    }

    const payload = {
      name: product.name,
      description: product.description,
      category: product.category,
      image_url: product.image_url?.trim() || null,
      storage_key: product.storage_key ?? null,
      tag: product.tag === "Ninguna" ? null : product.tag,
    };

    setLoading(true);

    try {
      let currentProductId = initialProduct?.id;

      if (currentProductId) {
        const { error } = await supabase
          .from("products")
          .update(payload)
          .eq("id", currentProductId);
        if (error) throw new Error(error.message);
      } else {
        const { data, error } = await supabase
          .from("products")
          .insert([payload])
          .select("id")
          .single();

        if (error) throw new Error(error.message);
        currentProductId = data?.id;
      }

      if (!currentProductId) {
        throw new Error(
          "No se pudo obtener el ID del producto para guardar las variantes.",
        );
      }

      const sourceVariants = hasVariants ? variants : variants.slice(0, 1);

      if (sourceVariants.length === 0) {
        throw new Error("Debes definir al menos una variante.");
      }

      const normalizedVariants = sourceVariants.map((variant) => {
        const priceValue = parseFloat(variant.price);
        if (Number.isNaN(priceValue)) {
          throw new Error("Ingresa un precio válido para cada variante.");
        }

        return {
          id: variant.id,
          product_id: currentProductId,
          size: variant.size?.trim() === "" ? null : variant.size,
          color: variant.color?.trim() === "" ? null : variant.color,
          price: priceValue,
          stock_quantity: Number.isFinite(variant.stock_quantity)
            ? variant.stock_quantity
            : 0,
          image_url:
            variant.image_url?.trim() === "" ? null : variant.image_url,
        };
      });

      if (initialProduct) {
        const initialVariantIds =
          initialProduct.variants?.map((variant) => variant.id) ?? [];
        const finalVariantIds = normalizedVariants
          .map((variant) => variant.id)
          .filter(Boolean) as number[];
        const variantIdsToDelete = initialVariantIds.filter(
          (id) => !finalVariantIds.includes(id),
        );

        if (variantIdsToDelete.length > 0) {
          const { error: deleteError } = await supabase
            .from("variants")
            .delete()
            .in("id", variantIdsToDelete);
          if (deleteError) throw new Error(deleteError.message);
        }
      }

      const newVariantsToInsert = normalizedVariants
        .filter((variant) => !variant.id)
        .map((variant) => {
          const { id, ...rest } = variant;
          void id;
          return rest;
        });

      if (newVariantsToInsert.length > 0) {
        const { error: insertError } = await supabase
          .from("variants")
          .insert(newVariantsToInsert);
        if (insertError) throw new Error(insertError.message);
      }

      const existingVariantsToUpdate = normalizedVariants.filter(
        (variant) => variant.id,
      );

      if (existingVariantsToUpdate.length > 0) {
        for (const variant of existingVariantsToUpdate) {
          const { id: variantId, ...updateData } = variant;
          const { error: updateError } = await supabase
            .from("variants")
            .update(updateData)
            .eq("id", variantId!);

          if (updateError) throw new Error(updateError.message);
        }
      }

      alert(
        `¡Producto ${initialProduct ? "actualizado" : "creado"} exitosamente!`,
      );
      router.push("/");
    } catch (error) {
      if (error instanceof Error) {
        alert(`Error al guardar el producto: ${error.message}`);
      } else {
        alert("Error desconocido al guardar el producto.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">
        {product.id ? "Editar Producto" : "Crear Nuevo Producto"}
      </h1>
      <div className="bg-white p-8 rounded-lg shadow-md">
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label
              htmlFor="name"
              className="block text-gray-700 text-sm font-bold mb-2"
            >
              Nombre del Producto
            </label>
            <input
              type="text"
              name="name"
              id="name"
              value={product.name}
              onChange={handleProductChange}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700"
              required
            />
          </div>
          <div className="mb-4">
            <label
              htmlFor="description"
              className="block text-gray-700 text-sm font-bold mb-2"
            >
              Descripción
            </label>
            <textarea
              name="description"
              id="description"
              value={product.description}
              onChange={handleProductChange}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700"
              rows={4}
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label
                htmlFor="category"
                className="block text-gray-700 text-sm font-bold mb-2"
              >
                Categoría
              </label>
              <select
                name="category"
                id="category"
                value={product.category}
                onChange={handleProductChange}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700"
              >
                {categories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label
                htmlFor="tag"
                className="block text-gray-700 text-sm font-bold mb-2"
              >
                Etiqueta
              </label>
              <select
                name="tag"
                id="tag"
                value={product.tag || "Ninguna"}
                onChange={handleProductChange}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700"
              >
                {["Ninguna", "15% de dcto", "producto nuevo", "a medida"].map(
                  (tagOption) => (
                    <option key={tagOption} value={tagOption}>
                      {tagOption}
                    </option>
                  ),
                )}
              </select>
            </div>
          </div>
          <div className="mb-6">
            <div className="grid items-start gap-2 sm:grid-cols-[10rem_1fr]">
              <div className="text-sm font-bold text-gray-700">
                Imagen Principal
              </div>
              <div className="col-span-full sm:col-start-2 space-y-4">
                <UploadImage
                  initialUrl={previewUrl}
                  onUploadingChange={setIsUploading}
                  onUploaded={({ publicUrl, storage_key }) => {
                    setProduct((prev) => ({
                      ...prev,
                      storage_key,
                      image_url: publicUrl,
                    }));
                    setPreviewUrl(publicUrl);
                  }}
                />

                <div>
                  <label
                    htmlFor="image_url"
                    className="block text-gray-700 text-sm font-bold mb-2"
                  >
                    URL de Imagen (opcional)
                  </label>
                  <input
                    type="url"
                    name="image_url"
                    id="image_url"
                    value={product.storage_key ? "" : product.image_url}
                    onChange={handleUrlChange}
                    placeholder="https://ejemplo.com/imagen.jpg"
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700"
                  />
                </div>

                {process.env.NEXT_PUBLIC_SHOW_IMAGE_META === "1" && (
                  <div className="space-y-1 text-xs text-gray-500">
                    {product.storage_key && (
                      <p>
                        <span className="font-semibold">Storage key:</span>{" "}
                        <code>{product.storage_key}</code>
                      </p>
                    )}
                    {product.image_url && (
                      <p className="truncate">
                        <span className="font-semibold">URL pública:</span>{" "}
                        <a
                          href={product.image_url}
                          target="_blank"
                          rel="noreferrer"
                          className="text-amber-600 hover:underline"
                        >
                          {product.image_url}
                        </a>
                      </p>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="mt-8">
            <h2 className="text-2xl font-bold mb-4">
              Detalles del Producto y Variantes
            </h2>
            <div className="flex items-center mb-4">
              <input
                type="checkbox"
                id="has-variants"
                checked={hasVariants}
                onChange={(event) =>
                  handleHasVariantsChange(event.target.checked)
                }
                className="h-4 w-4 text-amber-600 border-gray-300 rounded focus:ring-amber-500"
              />
              <label
                htmlFor="has-variants"
                className="ml-2 block text-sm text-gray-900"
              >
                Este producto tiene múltiples variantes (por color, medida,
                etc.)
              </label>
            </div>

            {variants.map((variant, index) => (
              <div
                key={index}
                className="bg-gray-50 p-4 rounded-lg border border-gray-200 mb-4 relative"
              >
                <h3 className="font-semibold mb-2">
                  {hasVariants ? `Variante #${index + 1}` : "Producto Simple"}
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                  <div>
                    <label
                      htmlFor={`size-${index}`}
                      className="block text-gray-700 text-sm font-bold mb-2"
                    >
                      Medida
                    </label>
                    <input
                      type="text"
                      name="size"
                      id={`size-${index}`}
                      value={variant.size ?? ""}
                      onChange={(event) => handleVariantChange(index, event)}
                      className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700"
                      placeholder="Ej: 0.60 x 0.90 m"
                    />
                  </div>
                  <div>
                    <label
                      htmlFor={`color-${index}`}
                      className="block text-gray-700 text-sm font-bold mb-2"
                    >
                      Color
                    </label>
                    <select
                      name="color"
                      id={`color-${index}`}
                      value={variant.color ?? ""}
                      onChange={(event) => handleVariantChange(index, event)}
                      className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700"
                    >
                      {colors.map((color) => (
                        <option key={color} value={color}>
                          {color}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label
                      htmlFor={`price-${index}`}
                      className="block text-gray-700 text-sm font-bold mb-2"
                    >
                      Precio (S/)
                    </label>
                    <input
                      type="number"
                      name="price"
                      id={`price-${index}`}
                      value={variant.price}
                      onChange={(event) => handleVariantChange(index, event)}
                      className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700"
                      step="0.01"
                      required
                    />
                  </div>
                  <div className="col-span-1 md:col-span-3">
                    <label
                      htmlFor={`stock-${index}`}
                      className="block text-gray-700 text-sm font-bold mb-2"
                    >
                      Cantidad en Stock
                    </label>
                    <input
                      type="number"
                      name="stock_quantity"
                      id={`stock-${index}`}
                      value={variant.stock_quantity}
                      onChange={(event) => handleVariantChange(index, event)}
                      className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700"
                      min={0}
                    />
                  </div>
                  {hasVariants && (
                    <div className="col-span-1 md:col-span-3">
                      <label
                        htmlFor={`variant-image-${index}`}
                        className="block text-gray-700 text-sm font-bold mb-2"
                      >
                        URL de Imagen de Variante (Opcional)
                      </label>
                      <input
                        type="url"
                        name="image_url"
                        id={`variant-image-${index}`}
                        value={variant.image_url ?? ""}
                        onChange={(event) => handleVariantChange(index, event)}
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700"
                        placeholder="https://ejemplo.com/variante.jpg"
                      />
                    </div>
                  )}
                </div>
                {hasVariants && variants.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeVariant(index)}
                    className="absolute top-4 right-4 bg-red-500 hover:bg-red-600 text-white font-bold py-1 px-2 rounded text-xs"
                  >
                    Eliminar
                  </button>
                )}
              </div>
            ))}

            {hasVariants && (
              <button
                type="button"
                onClick={addVariant}
                className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded mb-6"
              >
                + Añadir Otra Variante
              </button>
            )}
          </div>

          <div className="flex items-center justify-end mt-8">
            <button
              type="button"
              onClick={() => router.push("/")}
              className="bg-gray-500 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded mr-2"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={loading || isUploading}
              className="bg-amber-500 hover:bg-amber-600 text-white font-bold py-2 px-4 rounded disabled:opacity-75"
            >
              {loading || isUploading ? "Guardando..." : "Guardar Producto"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
