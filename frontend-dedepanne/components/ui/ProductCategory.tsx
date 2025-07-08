import React from 'react';
import { cn } from '@/lib/utils';

interface ProductCategoryProps {
  /**
   * The category name to display.
   */
  category: string | null | undefined;
  /**
   * Optional additional class names.
   */
  className?: string;
}

/**
 * A component to display a product category with consistent styling.
 * It handles null or undefined categories by rendering nothing.
 */
const ProductCategory: React.FC<ProductCategoryProps> = ({ category, className }) => {
  // Do not render anything if the category is missing to avoid an empty element with margin.
  if (!category) {
    return null;
  }

  // Using <p> tag for better semantics.
  return (
    <p
      className={cn(
        'text-xs text-gray-500 font-helvetica uppercase tracking-widest mb-1',
        className
      )}
    >
      {category}
    </p>
  );
};

export default ProductCategory;