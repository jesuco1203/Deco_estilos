"use client";

interface ProductTagProps {
  tag: string;
}

export default function ProductTag({ tag }: ProductTagProps) {
  const getTagInfo = (tagName: string) => {
    const lowerCaseTag = tagName.toLowerCase();
    switch (lowerCaseTag) {
      case "a medida":
        return { color: "bg-black", text: "A medida" };
      case "15% dcto":
        return { color: "bg-blue-500", text: tagName };
      case "producto nuevo":
        return { color: "bg-blue-500", text: "Producto Nuevo" };
      default:
        return { color: "bg-red-500", text: tagName };
    }
  };

  const { color: colorClass, text: displayText } = getTagInfo(tag);

  return (
    <div
      className={`absolute top-2 right-2 text-white text-xs font-bold px-2 py-1 rounded-full ${colorClass}`}
    >
      {displayText}
    </div>
  );
}
