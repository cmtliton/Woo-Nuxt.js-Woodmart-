export default defineCachedEventHandler(
  async (event) => {
    const config = useRuntimeConfig(event);
    const query = getQuery(event);

    // 1. Extract and sanitize query params
    const page = query.page || 1;
    const per_page = query.per_page || 16;
    const category = query.category || "";
    const search = query.search || "";

    // 2. Setup WooCommerce Authentication (Basic Auth via Header)
    const auth = Buffer.from(`${config.wcKey}:${config.wcSecret}`).toString(
      "base64",
    );

    try {
      // 3. Fetch from WooCommerce
      const response = await $fetch.raw(`${config.public.wcUrl}/products`, {
        method: "GET",
        headers: {
          Authorization: `Basic ${auth}`,
        },
        query: {
          page,
          per_page,
          category,
          search,
          status: "publish", // Security: Only fetch published items
        },
      });

      // 4. Extract Pagination Headers
      // WooCommerce provides total count and total pages in response headers
      const totalItems = response.headers.get("x-wp-total");
      const totalPages = response.headers.get("x-wp-totalpages");

      // 5. Clean & Transform JSON (Performance: Reduce payload size)
      // WooCommerce returns ~100+ fields per product. We only send what the UI needs.
      const products = (response._data as any[]).map((p) => ({
        id: p.id,
        name: p.name,
        slug: p.slug,
        price: p.price,
        regular_price: p.regular_price,
        on_sale: p.on_sale,
        image: p.images?.[0]?.src || "/placeholder.jpg",
        category: p.categories?.[0]?.name || "Uncategorized",
        rating: p.average_rating,
      }));

      // 6. Return Structured Response
      return {
        products,
        pagination: {
          total: Number(totalItems),
          totalPages: Number(totalPages),
          currentPage: Number(page),
        },
      };
    } catch (error: any) {
      throw createError({
        statusCode: error.response?.status || 500,
        statusMessage: "WooCommerce API Connection Failed",
      });
    }
  },
  {
    // 7. Caching Strategy (Performance)
    maxAge: 5 * 60, // Cache for 5 minutes
    name: "products-list",
    getKey: (event) => {
      // Create a unique cache key based on query parameters
      const query = getQuery(event);
      return `products-${query.category || "all"}-p${query.page || 1}-s${query.search || ""}`;
    },
  },
);
