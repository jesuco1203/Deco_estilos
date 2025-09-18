'use client';

interface ProductTagProps {
  tag: string;
}

export default function ProductTag({ tag }: ProductTagProps) {
  const getTagColor = (tagName: string) => {
    switch (tagName.toLowerCase()) {
      case 'a medida':
        return 'bg-sky-500';
      case '15% dcto':
        return 'bg-emerald-500';
      case 'nuevo':
        return 'bg-amber-500';
      default:
        return 'bg-red-500';
    }
  };

  const colorClass = getTagColor(tag);

  return (
    <div className={`absolute top-2 right-2 text-white text-xs font-bold px-2 py-1 rounded-full ${colorClass}`}>
      {tag}
    </div>
  );
}
