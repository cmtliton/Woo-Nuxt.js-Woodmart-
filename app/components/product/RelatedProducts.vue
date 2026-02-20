<script setup lang="ts">
const props = defineProps<{
  relatedIds: number[];
}>();

// Fetch related products only when the component is mounted/visible
const { data: products, pending } = await useFetch<any[]>(
  "/api/products/related",
  {
    query: { ids: props.relatedIds.join(",") },
    lazy: true,
    server: false, // Fetch on client to speed up initial LCP of the main product
    immediate: props.relatedIds.length > 0,
  },
);
</script>

<template>
  <v-container class="mt-16 pt-10 border-t">
    <div class="d-flex align-center justify-space-between mb-8">
      <div>
        <h2 class="text-h4 font-weight-bold text-uppercase letter-spacing-1">
          Related Products
        </h2>
        <div class="text-subtitle-2 text-secondary">
          Customers also viewed these pieces
        </div>
      </div>
      <v-btn variant="text" to="/shop" append-icon="mdi-arrow-right"
        >View All</v-btn
      >
    </div>

    <v-row>
      <!-- Skeleton Loading State -->
      <template v-if="pending">
        <v-col v-for="n in 4" :key="n" cols="12" sm="6" md="3">
          <v-skeleton-loader type="image, heading, subtitle" />
        </v-col>
      </template>

      <!-- Related Product Grid -->
      <template v-else-if="products?.length">
        <v-col
          v-for="product in products"
          :key="product.id"
          cols="12"
          sm="6"
          md="3"
        >
          <!-- Reusing our existing ShopProductCard for consistency -->
          <ShopProductCard
            :product="{
              id: product.id,
              name: product.name,
              slug: product.slug,
              price: product.price,
              image: product.images[0]?.src,
              category: product.categories[0]?.name,
            }"
          />
        </v-col>
      </template>

      <v-col v-else cols="12" class="text-center py-10">
        <p class="text-grey italic">No related furniture found.</p>
      </v-col>
    </v-row>
  </v-container>
</template>

<style scoped>
.letter-spacing-1 {
  letter-spacing: 2px !important;
  font-family: "Playfair Display", serif !important;
}
</style>
