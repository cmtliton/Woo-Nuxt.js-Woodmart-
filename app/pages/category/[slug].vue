<script setup lang="ts">
const route = useRoute();
const categorySlug = computed(() => route.params.slug as string);

const categoryStore = useCategoryStore();
const productStore = useProductStore();

// 1. Identify the current category info (for Header/SEO)
const categoryInfo: any = computed(() =>
  categoryStore.getCategoryBySlug(categorySlug.value),
);

// 2. Fetch data from API using useAsyncData
// This ensures the productStore.products array is populated

// 3. Reactive reference using your specific store function
const displayProducts = computed(() => {
  return productStore.getProductsByCategory(categorySlug.value);
});

// SEO Metadata
useSeoMeta({
  title: () => categoryInfo.value?.name || "Category",
  description: () =>
    categoryInfo.value?.description || "Premium Furniture Collection",
});
</script>

<template>
  <v-container fluid class="pa-0">
    <!-- Premium Category Header (Woodmart Style) -->
    <v-sheet
      height="300"
      color="background"
      class="d-flex align-center justify-center border-bottom mb-10"
    >
      <pre>{{ displayProducts }}</pre>
      <div class="text-center px-4">
        <h1
          class="text-h2 font-weight-bold mb-4 text-uppercase letter-spacing-2"
        >
          {{ categoryInfo?.name || "Collection" }}
        </h1>
        <v-breadcrumbs
          :items="['Home', 'Shop', categoryInfo?.name]"
          class="justify-center text-caption"
        />
      </div>
    </v-sheet>

    <v-container>
      <!-- Error State -->
      <v-alert
        v-if="productStore.error"
        type="error"
        variant="tonal"
        class="mb-5"
      >
        Failed to load products. Please try again.
      </v-alert>

      <!-- Grid Logic -->
      <v-fade-transition mode="out-in">
        <!-- Skeleton Loader while fetching -->
        <v-row v-if="productStore.loading">
          <v-col v-for="n in 8" :key="n" cols="12" sm="6" md="4" lg="3">
            <v-skeleton-loader type="image, heading, subtitle" />
          </v-col>
        </v-row>

        <!-- Product Display -->
        <v-row v-else-if="displayProducts.length > 0">
          <v-col
            v-for="product in displayProducts"
            :key="product.id"
            cols="12"
            sm="6"
            md="4"
            lg="3"
          >
            <!-- Woodmart Product Card Component -->
            <ShopProductCard :product="product" />
          </v-col>
        </v-row>

        <!-- Empty State -->
        <div v-else class="text-center py-16">
          <v-icon size="80" color="grey-lighten-2">mdi-package-variant</v-icon>
          <div class="text-h5 text-secondary mt-4">
            No furniture found in this category.
          </div>
          <v-btn color="primary" variant="flat" to="/shop" class="mt-6 px-10">
            Browse All Shop
          </v-btn>
        </div>
      </v-fade-transition>
    </v-container>
  </v-container>
</template>

<style scoped>
.letter-spacing-2 {
  letter-spacing: 4px !important;
}

.border-bottom {
  border-bottom: 1px solid rgba(0, 0, 0, 0.05) !important;
}

.text-h2 {
  font-family: "Playfair Display", serif !important;
}

/* Responsive adjustments */
@media (max-width: 600px) {
  .text-h2 {
    font-size: 2.5rem !important;
  }
}
</style>
