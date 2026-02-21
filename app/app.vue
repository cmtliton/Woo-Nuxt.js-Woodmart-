<template>
  <v-app>
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
  </v-app>
</template>
<script setup lang="ts">
const { categories } = useCategoryStore();
const { products } = useProductStore();
onMounted(() => {
  categories.length > 0 ? null : useCategoryStore().fetchCategories();
  products.length > 0
    ? null
    : useProductStore().fetchProducts({ per_page: 20 });
});
</script>
<style lang="scss">
@use "~/assets/scss/main.scss";
</style>
