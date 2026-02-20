<script setup lang="ts">
import { useDisplay } from "vuetify";

const { mdAndUp } = useDisplay();
const route = useRoute();
const mobileFilterDrawer = ref(false);
const categoryStore = useCategoryStore();

// Fetch categories on page load
await categoryStore.fetchCategories();

// Filter state
const filters = reactive({
  category: (route.query.category as string) || "",
  min: Number(route.query.min) || 0,
  max: Number(route.query.max) || 200000,
  materials: (route.query.materials as string)?.split(",") || [],
});

// Data Fetching Logic (Nuxt 4 Server Route)
const currentPage = ref(Number(route.query.page) || 1);
const sortQuery = computed(() => route.query.sort || "menu_order");

const { data, pending, refresh } = await useFetch("/api/products", {
  query: computed(() => ({
    page: currentPage.value,
    per_page: 16,
    sort: sortQuery.value,
    category: filters.category || undefined,
    min_price: filters.min || undefined,
    max_price: filters.max || undefined,
    // For materials, assuming it's an attribute, but for now, skip or handle later
  })),
  watch: [currentPage, sortQuery, filters],
  key: computed(
    () =>
      `products-${currentPage.value}-${sortQuery.value}-${filters.category}-${filters.min}-${filters.max}`,
  ),
});

// Handle sort change
const handleSortChange = (newSort: string) => {
  navigateTo({
    query: {
      ...route.query,
      sort: newSort,
      page: 1, // Reset to first page when sorting changes
    },
  });
};

// Handle view change
const handleViewChange = (newView: "grid" | "list") => {
  navigateTo({
    query: {
      ...route.query,
      view: newView,
    } as any,
  });
};

// Handle filter change
const handleFilterChange = (newFilters: {
  category?: string;
  min?: number;
  max?: number;
  materials?: string[];
}) => {
  const query = { ...route.query };
  if (newFilters.category !== undefined) {
    filters.category = newFilters.category || "";
    if (newFilters.category) {
      query.category = newFilters.category;
    } else {
      delete query.category;
    }
  }
  if (newFilters.min !== undefined) {
    filters.min = newFilters.min;
    if (newFilters.min > 0) {
      query.min_price = newFilters.min.toString();
    } else {
      delete query.min_price;
    }
  }
  if (newFilters.max !== undefined) {
    filters.max = newFilters.max;
    if (newFilters.max < 200000) {
      query.max_price = newFilters.max.toString();
    } else {
      delete query.max_price;
    }
  }
  if (newFilters.materials !== undefined) {
    filters.materials = newFilters.materials || [];
    if (newFilters.materials && newFilters.materials.length > 0) {
      query.materials = newFilters.materials.join(",");
    } else {
      delete query.materials;
    }
  }
  query.page = "1"; // Reset to first page when filters change
  navigateTo({ query });
};

// SEO
useSeoMeta({
  title: "Luxury Furniture Shop | Woodmart",
  description: "Browse our exclusive collection of modern furniture.",
});
</script>

<template>
  <div class="shop-page pb-16">
    <!-- Header Section -->
    <v-container fluid class="bg-grey-lighten-4 py-10 mb-10 text-center">
      <h1 class="text-h3 font-weight-bold mb-2">Our Collection</h1>
      <v-breadcrumbs
        :items="['Home', 'Shop']"
        class="justify-center text-caption font-weight-bold p-0"
      />
    </v-container>

    <v-container>
      <v-row>
        <!-- Desktop Sidebar -->
        <v-col v-if="mdAndUp" cols="12" md="3">
          <ShopSidebar @filter-change="handleFilterChange" />
        </v-col>

        <!-- Product Content Area -->
        <v-col cols="12" :md="9">
          <!-- Mobile Filter Trigger -->
          <v-btn
            v-if="!mdAndUp"
            block
            variant="outlined"
            prepend-icon="mdi-tune"
            class="mb-4"
            @click="mobileFilterDrawer = true"
          >
            Filters
          </v-btn>

          <ShopToolbar
            :total-results="data?.pagination?.total || 0"
            @sort-change="handleSortChange"
            @view-change="handleViewChange"
          />

          <!-- Reusing the Product Grid component designed earlier -->
          <ShopProductGrid
            :products="data?.products || []"
            :loading="pending"
            :view="(route.query.view as 'grid' | 'list') || 'grid'"
          />

          <!-- Pagination -->
          <v-pagination
            v-model="currentPage"
            :length="data?.pagination?.totalPages || 1"
            class="mt-12"
            color="primary"
            rounded="0"
          />
        </v-col>
      </v-row>
    </v-container>

    <!-- Mobile Filter Drawer -->
    <v-navigation-drawer
      v-model="mobileFilterDrawer"
      temporary
      location="left"
      width="300"
    >
      <div class="pa-6">
        <div class="d-flex justify-space-between align-center mb-6">
          <span class="text-h6 font-weight-bold">FILTERS</span>
          <v-btn
            icon="mdi-close"
            variant="text"
            @click="mobileFilterDrawer = false"
          />
        </div>
        <ShopSidebar @filter-change="handleFilterChange" />
      </div>
    </v-navigation-drawer>
  </div>
</template>

<style scoped>
.shop-page {
  min-height: 100vh;
}
:deep(.v-pagination__item--active) {
  background-color: var(--v-theme-primary) !important;
  color: white !important;
}
</style>
