<script setup lang="ts">
interface Props {
  products: any[];
  loading?: boolean;
  view?: "grid" | "list";
}

defineProps<Props>();
defineEmits(["open-quick-view"]);
function SinglePage(slug: any) {
  navigateTo(`/products/${slug}`);
}
</script>

<template>
  <div class="product-grid-wrapper">
    <!-- Grid View -->
    <v-row v-if="view === 'grid'">
      <!-- Skeleton Loaders -->
      <template v-if="loading">
        <v-col v-for="n in 8" :key="n" cols="12" sm="6" md="4" lg="3">
          <v-skeleton-loader type="image, article" class="bg-transparent" />
        </v-col>
      </template>

      <!-- Actual Product Cards (Grid) -->
      <template v-else>
        <v-col
          v-for="product in products"
          :key="product.id"
          cols="12"
          sm="6"
          md="4"
          lg="3"
        >
          <ShopProductCard
            :product="product"
            @click:quick-view="$emit('open-quick-view', product)"
          />
        </v-col>
      </template>
    </v-row>

    <!-- List View -->
    <div v-else class="product-list-wrapper">
      <!-- Skeleton Loaders -->
      <template v-if="loading">
        <v-skeleton-loader
          v-for="n in 4"
          :key="n"
          type="image, article"
          class="bg-transparent mb-6"
        />
      </template>

      <!-- Actual Product List Items -->
      <template v-else>
        <div v-for="product in products">
          <ShopProductCardList
            :product="product"
            @open-quick-view="$emit('open-quick-view', product)"
          />
        </div>
      </template>
    </div>
  </div>
</template>

<style scoped>
.product-list-wrapper {
  display: flex;
  flex-direction: column;
}

.product-list-item {
  border-color: rgba(0, 0, 0, 0.12);
  transition: box-shadow 0.3s ease;
}

.product-list-item:hover {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.product-image {
  transition: transform 0.3s ease;
}

.product-list-item:hover .product-image {
  transform: scale(1.05);
}
.zoom-effect {
  transform: scale(1.1);
}
</style>
