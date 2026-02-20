<script setup lang="ts">
interface Props {
  products: any[];
  loading?: boolean;
}

defineProps<Props>();
defineEmits(["open-quick-view"]);
</script>

<template>
  <div class="product-grid-wrapper">
    <v-row>
      <!-- Skeleton Loaders -->
      <template v-if="loading">
        <v-col v-for="n in 8" :key="n" cols="12" sm="6" md="4" lg="3">
          <v-skeleton-loader type="image, article" class="bg-transparent" />
        </v-col>
      </template>

      <!-- Actual Product Cards -->
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
  </div>
</template>
