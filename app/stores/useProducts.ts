import { defineStore } from "pinia";
import { ref, shallowRef } from "vue";

export const useProductStore = defineStore("products", () => {
  // State
  const products = shallowRef<any[]>([]); // Optimized for performance
  const loading = ref(false);
  const error = ref(null);
  const totalCount = ref(0);

  // Action: The Fix
  async function fetchProducts(
    params = { page: 1, per_page: 20, category: "" },
  ) {
    loading.value = true;
    error.value = null;

    try {
      // FIX 1: Use $fetch instead of useFetch inside actions
      // FIX 2: Ensure the URL matches your server route
      const response = await $fetch("/api/products", {
        params: {
          page: params.page || 1,
          category: params.category || "",
        },
      });

      // FIX 3: Map the data correctly based on our Server Route structure
      // Our server route returns { products: [], pagination: {} }
      if (response && response.products) {
        products.value = response.products;
        totalCount.value = response.pagination.total;
      } else {
        products.value = [];
      }
    } catch (err: any) {
      error.value = err.message || "Failed to load products";
      console.error("Pinia Fetch Error:", err);
    } finally {
      loading.value = false;
    }
  }
  function getProductsByCategory(categorySlug: string) {
    return products.value.filter((product) =>
      product.categories?.some((cat: any) => cat.slug === categorySlug),
    );
  }
  return {
    products,
    loading,
    error,
    totalCount,
    fetchProducts,
    getProductsByCategory,
  };
});
