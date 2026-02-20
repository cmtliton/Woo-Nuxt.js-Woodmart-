<script setup lang="ts">
const categoryStore = useCategoryStore();
const priceRange = ref([600, 200000]);
const selectedCategory = ref<number | null>(null);
const selectedMaterials = ref<string[]>([]);

const emit = defineEmits<{
  filterChange: [
    filters: {
      category?: string;
      min?: number;
      max?: number;
      materials?: string[];
    },
  ];
}>();

// Debounce price updates for performance
watch(priceRange, (val) => {
  emitFilterChange({ min: val[0], max: val[1] });
});

const selectCategory = (catId: number) => {
  selectedCategory.value = selectedCategory.value === catId ? null : catId;
  emitFilterChange({
    category: selectedCategory.value?.toString() || undefined,
  });
};

const toggleMaterial = (material: string) => {
  const index = selectedMaterials.value.indexOf(material);
  if (index > -1) {
    selectedMaterials.value.splice(index, 1);
  } else {
    selectedMaterials.value.push(material);
  }
  emitFilterChange({ materials: selectedMaterials.value });
};

const emitFilterChange = (
  updates: Partial<{
    category: string;
    min: number;
    max: number;
    materials: string[];
  }>,
) => {
  emit("filterChange", {
    category: selectedCategory.value?.toString() || undefined,
    min: priceRange.value[0],
    max: priceRange.value[1],
    materials: selectedMaterials.value,
    ...updates,
  });
};
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
          class="px-0 py-1 min-height-0"
          link
          @click="selectCategory(cat.id)"
          :class="{ 'selected-category': selectedCategory === cat.id }"
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
        :max="200000"
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
      <v-checkbox
        v-for="material in ['Solid Wood', 'Velvet', 'Leather']"
        :key="material"
        :label="material"
        :model-value="selectedMaterials.includes(material)"
        density="compact"
        hide-details
        @update:model-value="toggleMaterial(material)"
      />
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
.selected-category {
  background-color: rgba(var(--v-theme-accent), 0.1);
}
.selected-category .text-secondary {
  color: var(--v-theme-accent) !important;
}
</style>
