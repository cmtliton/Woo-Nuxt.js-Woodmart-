<template>
  <v-app>
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
  </v-app>
</template>
<script setup lang="ts">
const { categories } = useCategoryStore();
onMounted(() => {
  categories.length > 0 ? null : useCategoryStore().fetchCategories();
});
</script>
<style lang="scss">
@use "~/assets/scss/main.scss";
</style>
