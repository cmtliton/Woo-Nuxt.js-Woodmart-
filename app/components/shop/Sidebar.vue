<script setup lang="ts">
const categoryStore = useCategoryStore();
const priceRange = ref([0, 5000]);

const emit = defineEmits(["filter-change"]);

// Debounce price updates for performance
watch(priceRange, (val) => {
  emit("filter-change", { min: val[0], max: val[1] });
});
</script>

<template>
  <aside class="shop-sidebar pr-md-6">
    <!-- Categories -->
    <div class="filter-section mb-10">
      <h4 class="text-overline font-weight-bold mb-4 letter-spacing-1">
        Product Categories
      </h4>
      <v-list density="compact" class="bg-transparent">
        <v-list-item
          v-for="cat in categoryStore.parentCategories"
          :key="cat.id"
          :to="`/category/${cat.slug}`"
          class="px-0 py-1 min-height-0"
          link
        >
          <template v-slot:title>
            <span class="text-body-2 text-secondary hover-accent">{{
              cat.name
            }}</span>
          </template>
          <template v-slot:append>
            <span class="text-caption text-disabled">({{ cat.count }})</span>
          </template>
        </v-list-item>
      </v-list>
    </div>

    <!-- Price Filter -->
    <div class="filter-section mb-10">
      <h4 class="text-overline font-weight-bold mb-6 letter-spacing-1">
        Filter by Price
      </h4>
      <v-range-slider
        v-model="priceRange"
        :max="5000"
        :step="10"
        hide-details
        color="accent"
        class="align-center"
      />
      <div
        class="d-flex justify-space-between mt-2 text-caption font-weight-bold"
      >
        <span>${{ priceRange[0] }}</span>
        <span>${{ priceRange[1] }}</span>
      </div>
    </div>

    <!-- Attributes (Color/Material) -->
    <div class="filter-section">
      <h4 class="text-overline font-weight-bold mb-4 letter-spacing-1">
        Material
      </h4>
      <v-checkbox label="Solid Wood" density="compact" hide-details />
      <v-checkbox label="Velvet" density="compact" hide-details />
      <v-checkbox label="Leather" density="compact" hide-details />
    </div>
  </aside>
</template>

<style scoped>
.hover-accent:hover {
  color: var(--v-theme-accent);
}
.min-height-0 {
  min-height: 32px !important;
}
</style>
