<script setup lang="ts">
const productStore = useProductStore();
const activeTab = ref("All");
const loading = ref(false);

// ক্যাটাগরি ট্যাব তালিকা
const tabs = [
  { name: "All", slug: "all" },
  { name: "Chairs", slug: "chairs" },
  { name: "Sofas", slug: "sofas" },
  { name: "Almirah", slug: "almirah" },
  { name: "Table", slug: "table" },
];

// ইনিশিয়াল ডাটা লোড
onMounted(async () => {
  if (productStore.products.length === 0) {
    loading.value = true;
    await productStore.fetchProducts({ per_page: 16 });
    loading.value = false;
  }
});

// ট্যাব পরিবর্তন হ্যান্ডলার
const handleTabChange = async (slug: string, name: string) => {
  activeTab.value = name;
  loading.value = true;
  await productStore.fetchProducts({
    category: slug === "all" ? "" : slug,
    per_page: 16,
  });
  loading.value = false;
};

// ফিল্টার করা প্রোডাক্টস
const displayProducts = computed(() => {
  if (activeTab.value === "All") return productStore.products.slice(0, 10);
  return productStore.getProductsByCategory(activeTab.value.toLowerCase());
});
</script>

<template>
  <section class="weekly-bestsellers py-16 bg-white position-relative">
    <v-container>
      <!-- Header: Title & Tabs -->
      <div
        class="d-flex flex-column flex-md-row justify-space-between align-end mb-8 border-b-sm pb-4 ga-4"
      >
        <h2 class="text-h4 font-weight-bold section-title">
          Weekly bestsellers
        </h2>

        <div class="filter-tabs d-flex ga-6">
          <button
            v-for="tab in tabs"
            :key="tab.slug"
            class="tab-item"
            :class="{ 'tab-active': activeTab === tab.name }"
            @click="handleTabChange(tab.slug, tab.name)"
          >
            {{ tab.name }}
          </button>
        </div>
      </div>

      <!-- Main Slider Wrapper (Screenshot layout) -->
      <div class="bestseller-slider-container position-relative">
        <!-- Navigation Arrows (Sides) -->
        <v-btn
          icon="mdi-chevron-left"
          variant="text"
          class="nav-arrow prev-arrow d-none d-lg-flex"
        />
        <v-btn
          icon="mdi-chevron-right"
          variant="text"
          class="nav-arrow next-arrow d-none d-lg-flex"
        />

        <v-fade-transition mode="out-in">
          <v-row v-if="loading || productStore.loading" key="loading">
            <v-col
              v-for="n in 5"
              :key="n"
              cols="12"
              sm="6"
              md="4"
              lg="2-4"
              class="custom-5-col"
            >
              <v-skeleton-loader type="image, article" />
            </v-col>
          </v-row>

          <v-row v-else key="data" class="ga-y-6">
            <v-col
              v-for="product in displayProducts"
              :key="product.id"
              cols="12"
              sm="6"
              md="4"
              lg="2-4"
              class="custom-5-col"
            >
              <v-hover v-slot="{ isHovering, props }">
                <v-card
                  v-bind="props"
                  flat
                  class="product-card-woodmart rounded-0"
                >
                  <!-- Image Section with Internal Arrows & Heart -->
                  <div class="image-box position-relative overflow-hidden">
                    <NuxtImg
                      :src="product.image || '/images/placeholder.jpg'"
                      :alt="product.name"
                      width="320"
                      height="380"
                      fit="contain"
                      class="main-img pa-4"
                    />

                    <!-- Badges -->
                    <div
                      class="badge-stack"
                      v-if="product.is_new || product.on_sale"
                    >
                      <span v-if="product.is_new" class="badge bg-success"
                        >NEW</span
                      >
                      <span v-if="product.on_sale" class="badge bg-orange"
                        >-10%</span
                      >
                    </div>

                    <!-- Heart Icon -->
                    <v-btn
                      icon="mdi-heart-outline"
                      variant="text"
                      size="small"
                      class="wishlist-icon"
                    />

                    <!-- Internal Slide Arrows (On Hover) -->
                    <v-fade-transition>
                      <div v-if="isHovering" class="internal-arrows">
                        <v-btn
                          icon="mdi-chevron-left"
                          density="compact"
                          variant="text"
                        />
                        <v-btn
                          icon="mdi-chevron-right"
                          density="compact"
                          variant="text"
                        />
                      </div>
                    </v-fade-transition>
                  </div>

                  <!-- Content Section -->
                  <v-card-text class="px-0 py-4">
                    <div class="d-flex justify-space-between align-center mb-1">
                      <span class="product-title font-weight-bold">{{
                        product.name
                      }}</span>
                      <div class="rating-box d-flex align-center">
                        <span class="text-caption text-grey mr-1">{{
                          product.rating || "4.5"
                        }}</span>
                        <v-icon
                          icon="mdi-star"
                          size="14"
                          color="amber-darken-2"
                        />
                      </div>
                    </div>

                    <div class="text-caption text-grey mb-3">
                      {{ product.category }}
                    </div>

                    <div class="d-flex justify-space-between align-center">
                      <span class="price font-weight-bold text-accent"
                        >${{ product.price }}</span
                      >

                      <!-- Color Swatches -->
                      <div class="swatches d-flex ga-1">
                        <span class="swatch bg-grey-lighten-3"></span>
                        <span class="swatch bg-brown"></span>
                        <span class="swatch bg-blue-grey"></span>
                      </div>
                    </div>

                    <!-- Hover Actions: Select Options & Icons (Hides Price on Hover to show button) -->
                    <v-expand-transition>
                      <div
                        v-if="isHovering"
                        class="hover-actions-overlay d-flex align-center mt-3 ga-2"
                      >
                        <v-btn
                          color="primary"
                          block
                          rounded="pill"
                          class="flex-grow-1 font-weight-bold"
                          height="40"
                          style="text-transform: none; font-size: 13px"
                        >
                          Select options
                        </v-btn>
                        <v-btn
                          icon="mdi-shuffle-variant"
                          variant="text"
                          size="small"
                        />
                        <v-btn icon="mdi-magnify" variant="text" size="small" />
                      </div>
                    </v-expand-transition>
                  </v-card-text>
                </v-card>
              </v-hover>
            </v-col>
          </v-row>
        </v-fade-transition>
      </div>
    </v-container>
  </section>
</template>

<style scoped lang="scss">
.section-title {
  font-family: "Inter", sans-serif !important;
  font-size: 28px !important;
}

/* Woodmart 5 Column Layout */
@media (min-width: 1264px) {
  .custom-5-col {
    flex: 0 0 20%;
    max-width: 20%;
  }
}

/* Tab Navigation */
.tab-item {
  font-size: 14px;
  font-weight: 600;
  color: #777;
  padding-bottom: 5px;
  position: relative;
  transition: all 0.3s ease;

  &::after {
    content: "";
    position: absolute;
    bottom: -15px;
    left: 0;
    width: 0;
    height: 2px;
    background: #1a1a1a;
    transition: width 0.3s ease;
  }

  &:hover,
  &.tab-active {
    color: #1a1a1a;
    &::after {
      width: 100%;
    }
  }
}

/* Product Card Styling */
.product-card-woodmart {
  background: transparent !important;
  .image-box {
    background: #fff;
    aspect-ratio: 1/1.2;
    .main-img {
      width: 100%;
      height: 100%;
    }
  }
}

.badge-stack {
  position: absolute;
  top: 15px;
  left: 15px;
  display: flex;
  flex-direction: column;
  gap: 5px;
  .badge {
    font-size: 10px;
    font-weight: 800;
    padding: 3px 12px;
    border-radius: 50px;
    color: white;
  }
}

.wishlist-icon {
  position: absolute;
  top: 10px;
  right: 10px;
  color: #bbb;
  &:hover {
    color: #1a1a1a;
  }
}

.internal-arrows {
  position: absolute;
  top: 50%;
  width: 100%;
  display: flex;
  justify-content: space-between;
  padding: 0 5px;
  transform: translateY(-50%);
  z-index: 2;
  .v-btn {
    color: #bbb;
  }
}

/* Navigation Arrows (Sides) */
.nav-arrow {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  z-index: 5;
  color: #bbb;
  &.prev-arrow {
    left: -60px;
  }
  &.next-arrow {
    right: -60px;
  }
  &:hover {
    color: #1a1a1a;
  }
}

.product-title {
  font-size: 15px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.text-accent {
  color: #f48251 !important; /* Woodmart Orange-Gold */
}

.swatch {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  border: 1px solid rgba(0, 0, 0, 0.1);
}

.hover-actions-overlay {
  background: white;
  transition: all 0.3s ease;
}
</style>
