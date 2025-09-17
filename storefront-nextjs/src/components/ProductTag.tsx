import React from 'react';

interface ProductTagProps {
  tag: string | null;
}

const getTagStyle = (tag: string): string => {
  const lowerCaseTag = tag.toLowerCase();

  if (lowerCaseTag.includes('%')) {
    return 'bg-red-500'; // Discount
  }
  if (lowerCaseTag.includes('nuevo')) {
    return 'bg-teal-500'; // New Product
  }
  if (lowerCaseTag.includes('medida')) {
    return 'bg-sky-500'; // Custom
  }
  // Add more cases as needed
  return 'bg-amber-500'; // Default color
};

const ProductTag: React.FC<ProductTagProps> = ({ tag }) => {
  if (!tag) {
    return null;
  }

  const bgColorClass = getTagStyle(tag);

  return (
    <div
      className={`absolute top-1 -right-4 flex items-center justify-center text-white font-bold transform rotate-6 px-3 py-1.5 rounded-md ${bgColorClass}`}
    >
      <span className="text-sm">{tag}</span>
    </div>
  );
};

export default ProductTag;
