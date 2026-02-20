<script setup lang="ts">
import { useDisplay } from "vuetify";

const { mdAndUp } = useDisplay();
const route = useRoute();
const mobileFilterDrawer = ref(false);

// Data Fetching Logic (Nuxt 4 Server Route)
const currentPage = ref(Number(route.query.page) || 1);
const { data, pending, refresh } = await useFetch("/api/products", {
  query: {
    page: currentPage,
    per_page: 16,
    sort: () => route.query.sort,
  },
  watch: [currentPage, () => route.query.sort],
});

// SEO
useSeoMeta({
  title: "Luxury Furniture Shop | Woodmart",
  description: "Browse our exclusive collection of modern furniture.",
});
</script>

<template>
  <div class="shop-page pb-16">
    <!-- Header Section -->
    <v-container fluid class="bg-grey-lighten-4 py-10 mb-10 text-center">
      <h1 class="text-h3 font-weight-bold mb-2">Our Collection</h1>
      <v-breadcrumbs
        :items="['Home', 'Shop']"
        class="justify-center text-caption font-weight-bold p-0"
      />
    </v-container>

    <v-container>
      <v-row>
        <!-- Desktop Sidebar -->
        <v-col v-if="mdAndUp" cols="12" md="3">
          <ShopSidebar />
        </v-col>

        <!-- Product Content Area -->
        <v-col cols="12" :md="9">
          <!-- Mobile Filter Trigger -->
          <v-btn
            v-if="!mdAndUp"
            block
            variant="outlined"
            prepend-icon="mdi-tune"
            class="mb-4"
            @click="mobileFilterDrawer = true"
          >
            Filters
          </v-btn>

          <ShopToolbar :total-results="data?.pagination?.total || 0" />

          <!-- Reusing the Product Grid component designed earlier -->
          <ShopProductGrid
            :products="data?.products || []"
            :loading="pending"
          />

          <!-- Pagination -->
          <v-pagination
            v-model="currentPage"
            :length="data?.pagination?.totalPages || 1"
            class="mt-12"
            color="primary"
            rounded="0"
          />
        </v-col>
      </v-row>
    </v-container>

    <!-- Mobile Filter Drawer -->
    <v-navigation-drawer
      v-model="mobileFilterDrawer"
      temporary
      location="left"
      width="300"
    >
      <div class="pa-6">
        <div class="d-flex justify-space-between align-center mb-6">
          <span class="text-h6 font-weight-bold">FILTERS</span>
          <v-btn
            icon="mdi-close"
            variant="text"
            @click="mobileFilterDrawer = false"
          />
        </div>
        <ShopSidebar />
      </div>
    </v-navigation-drawer>
  </div>
</template>

<style scoped>
.shop-page {
  min-height: 100vh;
}
:deep(.v-pagination__item--active) {
  background-color: var(--v-theme-primary) !important;
  color: white !important;
}
</style>
