export default defineCachedEventHandler(
  async (event) => {
    const config = useRuntimeConfig(event);
    const query = getQuery(event);

    // 1. Setup WooCommerce Authentication
    const auth = Buffer.from(`${config.wcKey}:${config.wcSecret}`).toString(
      "base64",
    );

    try {
      // 2. Fetch Categories from WooCommerce
      const response = await $fetch<any[]>(
        `${config.public.wcUrl}/products/categories`,
        {
          method: "GET",
          headers: {
            Authorization: `Basic ${auth}`,
          },
          query: {
            per_page: query.per_page || 1,
            hide_empty: query.hide_empty || false,
            parent: query.parent || undefined,
          },
        },
      );

      // 3. Data Transformation (Clean-up)
      // WooCommerce returns 50+ fields per category.
      // We only send the frontend what it needs to keep the payload small.
      const cleanCategories = response.map((cat) => ({
        id: cat.id,
        name: cat.name,
        slug: cat.slug,
        parent: cat.parent,
        description: cat.description,
        count: cat.count,
        display: cat.display, // default, products, subcategories
        image: cat.image
          ? {
              src: cat.image.src,
              alt: cat.image.alt || cat.name,
            }
          : null,
        menu_order: cat.menu_order,
      }));

      // 4. Return the cleaned data
      return cleanCategories;
    } catch (error: any) {
      console.error("WooCommerce Category API Error:", error);

      throw createError({
        statusCode: error.response?.status || 500,
        statusMessage: "Failed to fetch categories from WooCommerce",
      });
    }
  },
  {
    // 5. Nitro Caching Strategy
    // Categories don't change often. Cache for 1 hour to save WP resources.
    maxAge: 60 * 60,
    swr: true, // Enable Stale-While-Revalidate for better UX
    name: "product-categories",
    getKey: (event) => {
      const query = getQuery(event);
      return `categories-${query.hide_empty || "all"}-${query.parent || "root"}`;
    },
  },
);
