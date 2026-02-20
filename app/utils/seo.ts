export const getProductSchema = (product: any) => {
  return {
    "@context": "https://schema.org/",
    "@type": "Product",
    name: product.name,
    image: [product.image],
    description: product.short_description,
    sku: product.sku,
    brand: {
      "@type": "Brand",
      name: "Furniture Store",
    },
    offers: {
      "@type": "Offer",
      url: `https://yourstore.com/products/${product.slug}`,
      priceCurrency: "USD",
      price: product.price,
      availability:
        product.stock_status === "instock"
          ? "https://schema.org/InStock"
          : "https://schema.org/OutOfStock",
      itemCondition: "https://schema.org/NewCondition",
    },
  };
};
