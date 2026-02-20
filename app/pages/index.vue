<template>
  <v-container>
    <ShopProductGrid
      :products="products"
      :loading="loading"
      @open-quick-view=""
    />
  </v-container>
</template>
<script setup lang="ts">
const { products, loading } = useProductStore();
onMounted(() => {
  products.length > 0 ? null : useProductStore().fetchProducts();
});
</script>
