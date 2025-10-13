"use client";

type Category = {
  id: string | number;
  name: string;
  slug: string;
};

type Props = {
  categories: Category[];
  value: string;
  onChange: (slug: string) => void;
  className?: string;
};

export default function CategoryScroller({
  categories,
  value,
  onChange,
  className = "",
}: Props) {
  return (
    <div className={`overflow-x-auto no-scrollbar ${className}`}>
      <div className="flex min-w-full gap-2 whitespace-nowrap">
        <button
          type="button"
          onClick={() => onChange("all")}
          className={`inline-flex items-center rounded-full border px-3 py-1 text-sm transition ${
            value === "all"
              ? "border-amber-600 bg-amber-600 text-white"
              : "border-gray-200 bg-white text-gray-700 hover:bg-gray-50"
          }`}
        >
          Todas
        </button>
        {categories.map((cat) => (
          <button
            type="button"
            key={cat.slug}
            onClick={() => onChange(cat.slug)}
            className={`inline-flex items-center rounded-full border px-3 py-1 text-sm transition ${
              value === cat.slug
                ? "border-amber-600 bg-amber-600 text-white"
                : "border-gray-200 bg-white text-gray-700 hover:bg-gray-50"
            }`}
          >
            {cat.name}
          </button>
        ))}
      </div>
    </div>
  );
}
