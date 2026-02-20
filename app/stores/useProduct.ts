import { defineStore } from "pinia";
import { ref, shallowRef } from "vue";

export const useSingleProductStore = defineStore("Product", () => {
  // State
  const product = shallowRef<any>(null);
  const loading = ref(false);
  const error = ref(null);

  // Action to fetch by slug
  async function fetchProductBySlug(slug: string) {
    if (product.value?.slug === slug) return; // Optimization: don't refetch if already loaded

    loading.value = true;
    error.value = null;

    try {
      // Calling our Nuxt Server Route
      const data = await $fetch(`/api/products/${slug}`);

      if (data) {
        product.value = data;
      } else {
        throw new Error("Product not found");
      }
    } catch (err: any) {
      error.value = err.message || "Failed to load product";
      product.value = null;
    } finally {
      loading.value = false;
    }
  }

  return {
    product,
    loading,
    error,
    fetchProductBySlug,
  };
});
