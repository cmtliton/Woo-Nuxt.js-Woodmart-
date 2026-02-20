<script setup lang="ts">
const props = defineProps<{ totalResults: number }>();
const emit = defineEmits<{
  sortChange: [value: string];
  viewChange: [value: "grid" | "list"];
}>();

const sortOptions = [
  { title: "Default Sorting", value: "menu_order" },
  { title: "Latest Items", value: "date" },
  { title: "Price: Low to High", value: "price_asc" },
  { title: "Price: High to Low", value: "price_desc" },
];

const route = useRoute();
const selectedSort = ref(route.query.sort || "menu_order");
const selectedView = ref<"grid" | "list">(
  (route.query.view as "grid" | "list") || "grid",
);

// Watch route query sort and update selectedSort
watch(
  () => route.query.sort,
  (newSort) => {
    selectedSort.value = newSort || "menu_order";
  },
);

// Watch route query view and update selectedView
watch(
  () => route.query.view,
  (newView) => {
    selectedView.value = (newView as "grid" | "list") || "grid";
  },
);

// Watch for sort changes and emit
watch(selectedSort, (newSort) => {
  if (newSort !== route.query.sort) {
    emit("sortChange", newSort as any);
  }
});

// Watch for view changes and emit
watch(selectedView, (newView) => {
  if (newView !== route.query.view) {
    emit("viewChange", newView);
  }
});
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
      <v-btn-toggle
        v-model="selectedView"
        density="compact"
        variant="text"
        color="primary"
        mandatory
      >
        <v-btn icon="mdi-view-grid" size="small" value="grid" />
        <v-btn icon="mdi-view-list" size="small" value="list" />
      </v-btn-toggle>
    </div>
  </div>
</template>
