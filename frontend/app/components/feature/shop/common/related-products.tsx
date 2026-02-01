import type { ReactNode } from "react";

interface RelatedProductsProps<T> {
  products: T[] | undefined | null;
  currentProductId: number;
  renderItem: (item: T) => ReactNode;
  title?: string;
  limit?: number;
}

export function RelatedProducts<T extends { id: number }>({
  products,
  currentProductId,
  renderItem,
  title = "Sản phẩm liên quan",
  limit = 4,
}: RelatedProductsProps<T>) {
  if (!products || products.length === 0) {
    return null;
  }

  // Filter out the current product and limit the number of items
  const filteredProducts = products
    .filter((product) => product.id !== currentProductId)
    .slice(0, limit);

  if (filteredProducts.length === 0) {
    return null;
  }

  return (
    <div className="mt-12">
      <h2 className="text-2xl font-bold mb-6">{title}</h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
        {filteredProducts.map((product) => renderItem(product))}
      </div>
    </div>
  );
}
