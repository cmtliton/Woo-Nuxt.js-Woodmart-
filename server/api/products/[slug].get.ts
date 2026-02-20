export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig(event);
  const slug = getRouterParam(event, "slug");

  const auth = Buffer.from(`${config.wcKey}:${config.wcSecret}`).toString(
    "base64",
  );

  try {
    // WooCommerce returns an array when searching by slug
    const response = await $fetch<any[]>(`${config.public.wcUrl}/products`, {
      headers: { Authorization: `Basic ${auth}` },
      query: { slug },
    });

    if (!response || response.length === 0) {
      throw createError({
        statusCode: 404,
        statusMessage: "Product not found",
      });
    }

    const p = response[0]; // Get the first matching product

    // Return only the fields needed for the Detail Page (Optimization)
    return {
      id: p.id,
      name: p.name,
      slug: p.slug,
      price: p.price,
      description: p.description,
      short_description: p.short_description,
      images: p.images.map((img: any) => img.src),
      attributes: p.attributes,
      stock_status: p.stock_status,
      categories: p.categories,
      reviews: p.reviews, // Assuming reviews are included in the product response
      related_ids: p.related_ids, // For fetching related products
    };
  } catch (error: any) {
    throw createError({
      statusCode: error.statusCode || 500,
      statusMessage: error.message || "WooCommerce Fetch Error",
    });
  }
});
