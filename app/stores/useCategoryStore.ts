import { defineStore } from "pinia";

// 1. Types for WooCommerce Categories
export interface Category {
  id: number;
  name: string;
  slug: string;
  parent: number;
  description: string;
  image?: {
    src: string;
    alt: string;
  };
  count: number;
  children?: Category[]; // For the tree structure
}

export const useCategoryStore = defineStore("categories", () => {
  // 2. State
  const categories = shallowRef<Category[]>([]);
  const loading = ref(false);
  const error = ref<string | null>(null);

  // 3. Getters (Computed)

  /**
   * Transforms flat categories into a hierarchical tree
   * Essential for Woodmart-style Mega Menus
   */
  const categoryTree = computed(() => {
    const map = new Map<number, Category>();
    const tree: Category[] = [];

    // Initialize map with clones to avoid mutating original state
    categories.value.forEach((cat) => {
      map.set(cat.id, { ...cat, children: [] });
    });

    map.forEach((cat) => {
      if (cat.parent !== 0) {
        const parent = map.get(cat.parent);
        if (parent) {
          parent.children?.push(cat);
        }
      } else {
        tree.push(cat);
      }
    });

    return tree;
  });

  /**
   * Get only top-level categories for the main navbar
   */
  const parentCategories = computed(() =>
    categories.value.filter((cat) => cat.parent === 0),
  );

  // 4. Actions
  async function fetchCategories() {
    // Avoid re-fetching if we already have data (Optimization)
    if (categories.value.length > 0) return;

    loading.value = true;
    error.value = null;

    try {
      // Calls our Nuxt server route proxy
      const data = await $fetch<Category[]>("/api/categories", {
        query: {
          hide_empty: true, // Don't show categories with 0 products
          per_page: 100, // Usually furniture stores have < 100 categories
        },
      });

      categories.value = data;
    } catch (err: any) {
      error.value = err.message || "Failed to load categories";
      console.error("Category Store Error:", err);
    } finally {
      loading.value = false;
    }
  }

  /**
   * Find a specific category by slug (useful for Breadcrumbs)
   */
  function getCategoryBySlug(slug: string) {
    return categories.value.find((cat) => cat.slug === slug);
  }

  return {
    categories,
    loading,
    error,
    categoryTree,
    parentCategories,
    fetchCategories,
    getCategoryBySlug,
  };
});
