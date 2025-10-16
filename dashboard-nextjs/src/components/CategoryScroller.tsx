"use client";

type CategoryOption = {
  name: string;
  slug: string;
};

type CategoryScrollerProps = {
  categories: CategoryOption[];
  selected: string;
  onSelect: (slug: string) => void;
  className?: string;
};

const baseClass =
  "whitespace-nowrap rounded-full border px-3 py-1 text-sm transition";

const selectedClass = "border-amber-600 bg-amber-600 text-white";
const idleClass = "border-gray-200 bg-white text-gray-700 hover:bg-gray-50";

export default function CategoryScroller({
  categories,
  selected,
  onSelect,
  className = "",
}: CategoryScrollerProps) {
  return (
    <div
      className={`no-scrollbar flex gap-2 overflow-x-auto py-2 ${className}`}
    >
      <button
        type="button"
        onClick={() => onSelect("all")}
        className={`${baseClass} ${
          selected === "all" ? selectedClass : idleClass
        }`}
      >
        Todas
      </button>
      {categories.map((category) => (
        <button
          type="button"
          key={category.slug}
          onClick={() => onSelect(category.slug)}
          className={`${baseClass} ${
            selected === category.slug ? selectedClass : idleClass
          }`}
        >
          {category.name}
        </button>
      ))}
    </div>
  );
}
