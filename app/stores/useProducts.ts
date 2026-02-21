import { defineStore } from "pinia";
import { ref, shallowRef } from "vue";

export const useProductStore = defineStore("products", () => {
  // State
  const products = shallowRef<any[]>([]);
  const loading = ref(false);
  const error = ref<string | null>(null);
  const totalCount = ref(0);

  // Keep track of categories we have already fetched to prevent redundant API calls
  const loadedCategories = ref<string[]>([]);

  /**
   * Fetch products from the Nuxt server route.
   * If a category is provided, it merges the result into the existing product pool.
   */
  async function fetchProducts(
    params: { page?: number; per_page?: number; category?: string } = {},
  ) {
    // Optimization: If category is already loaded and we aren't forcing a refresh, skip
    if (
      params.category &&
      loadedCategories.value.includes(params.category) &&
      !params.page
    ) {
      return;
    }

    loading.value = true;
    error.value = null;

    try {
      const response: any = await $fetch("/api/products", {
        params: {
          page: params.page || 1,
          per_page: params.per_page || 20,
          category: params.category || "",
        },
      });

      if (response && response.products) {
        if (params.category) {
          // 1. Logic for Bestsellers Tab: Merge data
          // We combine new products with existing ones, removing duplicates by ID
          const existingIds = new Set(products.value.map((p) => p.id));
          const uniqueNewProducts = response.products.filter(
            (p: any) => !existingIds.has(p.id),
          );

          products.value = [...products.value, ...uniqueNewProducts];

          // Mark this category as loaded
          if (!loadedCategories.value.includes(params.category)) {
            loadedCategories.value.push(params.category);
          }
        } else {
          // 2. Logic for "All" or Shop Page: Replace data
          products.value = response.products;
        }

        totalCount.value = response.pagination?.total || 0;
      }

      return response; // Return for useAsyncData compatibility
    } catch (err: any) {
      error.value = err.message || "Failed to load products";
      console.error("Pinia Fetch Error:", err);
      throw err;
    } finally {
      loading.value = false;
    }
  }

  /**
   * Filter products locally based on category slug.
   * Used by the Bestsellers.vue component for instant switching.
   */
  function getProductsByCategory(categorySlug: string) {
    if (!categorySlug || categorySlug.toLowerCase() === "all") {
      return products.value.slice(0, 10); // Return first 10 for "All" tab
    }

    return products.value.filter((product) =>
      product.categories?.some(
        (cat: any) => cat.slug.toLowerCase() === categorySlug.toLowerCase(),
      ),
    );
  }

  return {
    products,
    loading,
    error,
    totalCount,
    loadedCategories,
    fetchProducts,
    getProductsByCategory,
  };
});
