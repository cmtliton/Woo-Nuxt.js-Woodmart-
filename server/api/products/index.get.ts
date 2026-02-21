export default defineCachedEventHandler(
  async (event) => {
    const config = useRuntimeConfig(event);
    const query = getQuery(event);

    // 1. Extract and sanitize query params
    const page = query.page || 1;
    const per_page = query.per_page || 16;
    let category = query.category || "";
    const search = query.search || "";
    const sort = query.sort || "menu_order";
    const min_price = query.min_price || "";
    const max_price = query.max_price || "";

    // Map sort to WooCommerce orderby and order
    let orderby = "menu_order";
    let order = "asc";
    switch (sort) {
      case "date":
        orderby = "date";
        order = "desc";
        break;
      case "price_asc":
        orderby = "price";
        order = "asc";
        break;
      case "price_desc":
        orderby = "price";
        order = "desc";
        break;
      case "menu_order":
      default:
        orderby = "menu_order";
        order = "asc";
        break;
    }

    // 2. Setup WooCommerce Authentication (Basic Auth via Header)
    const auth = Buffer.from(`${config.wcKey}:${config.wcSecret}`).toString(
      "base64",
    );
    //*********************************Getting category id************************************
    if (category && isNaN(Number(category))) {
      try {
        const catResponse = await $fetch<any[]>(
          `${config.public.wcUrl}/products/categories`,
          {
            headers: { Authorization: `Basic ${auth}` },
            query: { slug: category },
          },
        );
        if (catResponse && catResponse.length > 0) {
          category = catResponse[0].id;
        }
      } catch (error) {
        throw createError({
          statusCode: 404,
          statusMessage: "Category not found",
        });
      }
    }
    //.......................................................................................
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
          orderby,
          order,
          min_price: min_price || undefined,
          max_price: max_price || undefined,
        },
      });
      // 4. Extract Pagination Headers
      // WooCommerce provides total count and total pages in response headers
      const totalItems = response.headers.get("x-wp-total");
      const totalPages = response.headers.get("x-wp-totalpages");

      // 5. Clean & Transform JSON (Performance: Reduce payload size)
      // WooCommerce returns ~100+ fields per product. We only send what the UI needs.
      let products = (response._data as any[]).map((p) => ({
        id: p.id,
        name: p.name,
        slug: p.slug,
        price: p.price,
        regular_price: p.regular_price,
        on_sale: p.on_sale,
        image: p.images?.[0]?.src || "/placeholder.jpg",
        categories: p.categories || [],
        rating: p.average_rating,
        date_created: p.date_created,
        menu_order: p.menu_order,
      }));

      // Sort products based on sort parameter
      products.sort((a, b) => {
        switch (sort) {
          case "date":
            return (
              new Date(b.date_created || 0).getTime() -
              new Date(a.date_created || 0).getTime()
            );
          case "price_asc":
            return parseFloat(a.price || 0) - parseFloat(b.price || 0);
          case "price_desc":
            return parseFloat(b.price || 0) - parseFloat(a.price || 0);
          case "menu_order":
          default:
            return (a.menu_order || 0) - (b.menu_order || 0);
        }
      });

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
    swr: true, // Enable Stale-While-Revalidate for better UX
    name: "products-list",
    getKey: (event) => {
      // Create a unique cache key based on query parameters
      const query = getQuery(event);
      return `products-${query.category || "all"}-p${query.page || 1}-s${query.search || ""}-sort${query.sort || "menu_order"}-min${query.min_price || 0}-max${query.max_price || 200000}`;
    },
  },
);
