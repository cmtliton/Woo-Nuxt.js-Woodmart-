// app/pages/products/[slug].vue
<script setup lang="ts">
// ... আগের script logic ...
const route = useRoute();
const singleProduct = useSingleProductStore();

const { pending, error } = await useAsyncData(
  `product-${route.params.slug}`,
  async () => {
    await singleProduct.fetchProductBySlug(route.params.slug as string);
    return singleProduct.product;
  },
  { watch: [() => route.params.slug] },
);
</script>

<template>
  <v-container class="py-10">
    <v-fade-transition mode="out-in">
      <v-row v-if="pending || singleProduct.loading">
        <!-- Skeleton logic remains same -->
      </v-row>

      <div v-else-if="singleProduct.product">
        <v-row>
          <!-- Optimized Image Gallery -->
          <v-col cols="12" md="6">
            <v-carousel
              hide-delimiters
              height="600"
              class="rounded-lg bg-grey-lighten-4"
              show-arrows="hover"
            >
              <v-carousel-item
                v-for="(img, i) in singleProduct.product.images"
                :key="i"
              >
                <!-- NuxtImg Optimization -->
                <NuxtImg
                  :src="img"
                  :alt="singleProduct.product.name"
                  width="800"
                  height="800"
                  fit="contain"
                  format="webp"
                  quality="85"
                  :loading="i === 0 ? 'eager' : 'lazy'"
                  :fetchpriority="i === 0 ? 'high' : 'auto'"
                  class="w-100 h-100"
                />
              </v-carousel-item>
            </v-carousel>
          </v-col>

          <!-- Product Summary -->
          <v-col cols="12" md="6" class="ps-md-10">
            <!-- Title, Price, Short Description, Cart Button ... (আগের কোড) -->
            <nav class="mb-4">
              <NuxtLink
                to="/shop"
                class="text-caption text-decoration-none text-secondary"
              >
                ← BACK TO SHOP
              </NuxtLink>
            </nav>
            <h1 class="text-h5 font-weight-bold mb-4">
              {{ singleProduct.product.name }}
            </h1>
            <div class="text-h4 text-primary mb-6">
              ${{ singleProduct.product.price }}
            </div>
            <v-divider class="mb-6"></v-divider>
            <div
              class="mb-8 text-body-1"
              v-html="singleProduct.product.short_description"
            ></div>

            <v-btn color="primary" size="x-large" block rounded="0"
              >ADD TO CART</v-btn
            >
            <v-btn
              variant="outlined"
              size="large"
              block
              rounded="0"
              icon="mdi-heart-outline"
              elevation="0"
              class="mt-2"
            />
            <!-- ... -->
          </v-col>
        </v-row>

        <!-- Product Tabs Section (নতুন যুক্ত করা হয়েছে) -->
        <ProductTabs
          :description="singleProduct.product.description"
          :reviews="singleProduct.product.reviews || []"
          :attributes="singleProduct.product.attributes"
        />
        <!-- Related Products Section (NEW) -->
        <ProductRelatedProducts
          v-if="singleProduct.product.related_ids?.length"
          :related-ids="singleProduct.product.related_ids"
        />
      </div>
    </v-fade-transition>
  </v-container>
</template>

<style scoped>
.description-box :deep(p) {
  margin-bottom: 1rem;
  line-height: 1.6;
}

/* Custom Woodmart-style spacing */
.gap-2 {
  gap: 8px;
}

.text-primary {
  color: #a68b67 !important; /* Premium Furniture Gold/Oak */
}
</style>
