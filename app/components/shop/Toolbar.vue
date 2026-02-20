<script setup lang="ts">
const props = defineProps<{ totalResults: number }>();
const sortOptions = [
  { title: "Default Sorting", value: "menu_order" },
  { title: "Latest Items", value: "date" },
  { title: "Price: Low to High", value: "price_asc" },
  { title: "Price: High to Low", value: "price_desc" },
];
const selectedSort = ref("menu_order");
</script>

<template>
  <div
    class="shop-toolbar d-flex align-center justify-space-between py-4 mb-6 border-b"
  >
    <div class="text-caption text-uppercase font-weight-bold">
      Showing <span class="text-primary">{{ totalResults }}</span> Products
    </div>

    <div class="d-flex align-center ga-4">
      <v-select
        v-model="selectedSort"
        :items="sortOptions"
        variant="plain"
        density="compact"
        hide-details
        class="sort-select text-caption"
        style="width: 180px"
      />
      <v-btn-toggle density="compact" variant="text" color="primary" mandatory>
        <v-btn icon="mdi-view-grid" size="small" />
        <v-btn icon="mdi-view-list" size="small" />
      </v-btn-toggle>
    </div>
  </div>
</template>
