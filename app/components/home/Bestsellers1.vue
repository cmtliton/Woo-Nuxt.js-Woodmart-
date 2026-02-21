<script setup lang="ts">
const productStore = useProductStore();
const categoryStore = useCategoryStore();

const activeTab = ref("All");
const loading = ref(false);

// ক্যাটাগরি অনুযায়ী ফিল্টার করা প্রোডাক্টস
const filteredProducts = computed(() => {
  if (activeTab.value === "All") return productStore.products.slice(0, 10);
  return productStore.getProductsByCategory(activeTab.value.toLowerCase());
});

const tabs = ["All", "Chairs", "Sofas", "Armchairs", "Tables"];

const handleTabChange = async (tab: string) => {
  activeTab.value = tab;
  // যদি স্টোরে ডাটা না থাকে তবে ফেচ করা হবে
  if (tab !== "All") {
    loading.value = true;
    await productStore.fetchProducts({
      category: tab.toLowerCase(),
      per_page: 10,
    });
    loading.value = false;
  }
};
</script>

<template>
  <section class="weekly-bestsellers py-16 bg-grey-lighten-4">
    <v-container>
      <!-- Section Header with Tabs -->
      <div
        class="d-flex flex-column flex-md-row justify-space-between align-center mb-10 ga-4"
      >
        <h2 class="text-h4 font-weight-bold section-title">
          Weekly bestsellers
        </h2>

        <div class="filter-tabs d-flex ga-6">
          <button
            v-for="tab in tabs"
            :key="tab"
            class="tab-item text-uppercase font-weight-bold"
            :class="{ 'tab-active': activeTab === tab }"
            @click="handleTabChange(tab)"
          >
            {{ tab }}
          </button>
        </div>
      </div>

      <!-- Products Grid -->
      <v-fade-transition mode="out-in">
        <div :key="activeTab">
          <v-row class="ga-y-6">
            <!-- Skeleton Loading -->
            <template v-if="loading || productStore.loading">
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
            </template>

            <!-- Product Cards -->
            <template v-else>
              <v-col
                v-for="product in filteredProducts"
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
                    class="bestseller-card rounded-0 overflow-hidden"
                  >
                    <!-- Image Wrapper -->
                    <div class="image-wrapper position-relative bg-white">
                      <NuxtImg
                        :src="product.image || '/images/placeholder.jpg'"
                        :alt="product.name"
                        width="300"
                        height="350"
                        fit="contain"
                        class="product-img pa-4"
                        :class="{ 'zoom-effect': isHovering }"
                      />

                      <!-- Top Left Badges -->
                      <div class="badges-container">
                        <div v-if="product.is_new" class="badge-new">NEW</div>
                        <div v-if="product.on_sale" class="badge-sale">
                          -10%
                        </div>
                      </div>

                      <!-- Top Right Wishlist -->
                      <v-btn
                        icon="mdi-heart-outline"
                        variant="text"
                        size="small"
                        class="wishlist-btn"
                        :class="{ 'wishlist-active': isHovering }"
                      />
                    </div>

                    <!-- Content Section -->
                    <v-card-text class="px-0 pt-4 bg-transparent">
                      <div
                        class="d-flex justify-space-between align-start mb-1"
                      >
                        <h3 class="product-name font-weight-bold">
                          {{ product.name }}
                        </h3>
                        <div class="rating d-flex align-center">
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

                      <div class="text-caption text-grey mb-2">
                        {{ product.category }}
                      </div>

                      <div class="d-flex justify-space-between align-center">
                        <div class="price font-weight-bold text-primary">
                          ${{ product.price }}
                        </div>

                        <!-- Color Swatches (Sample) -->
                        <div
                          v-if="product.id % 2 === 0"
                          class="swatches d-flex ga-1"
                        >
                          <div class="swatch-circle bg-grey-lighten-2"></div>
                          <div class="swatch-circle bg-brown"></div>
                          <div class="swatch-circle bg-black"></div>
                        </div>
                      </div>
                    </v-card-text>
                  </v-card>
                </v-hover>
              </v-col>
            </template>
          </v-row>
        </div>
      </v-fade-transition>
    </v-container>
  </section>
</template>

<style scoped lang="scss">
.section-title {
  font-family: "Inter", sans-serif !important;
  color: #1a1a1a;
}

/* 5 Column Grid for Desktop */
@media (min-width: 1264px) {
  .custom-5-col {
    flex: 0 0 20%;
    max-width: 20%;
  }
}

/* Tabs Styling */
.tab-item {
  font-size: 13px;
  color: #777;
  letter-spacing: 1px;
  position: relative;
  transition: color 0.3s ease;

  &::after {
    content: "";
    position: absolute;
    bottom: -4px;
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

/* Card Styling */
.bestseller-card {
  background: transparent !important;
  transition: transform 0.3s ease;
}

.image-wrapper {
  aspect-ratio: 1/1.2;
  overflow: hidden;

  .product-img {
    width: 100%;
    height: 100%;
    transition: transform 1.2s cubic-bezier(0, 0, 0.2, 1);
  }

  .zoom-effect {
    transform: scale(1.08);
  }
}

.badges-container {
  position: absolute;
  top: 12px;
  left: 12px;
  z-index: 2;
  display: flex;
  flex-direction: column;
  gap: 5px;

  .badge-new {
    background: #43a047;
    color: white;
    font-size: 10px;
    font-weight: bold;
    padding: 3px 10px;
    border-radius: 50px;
  }
  .badge-sale {
    background: #f48251;
    color: white;
    font-size: 10px;
    font-weight: bold;
    padding: 3px 10px;
    border-radius: 50px;
  }
}

.wishlist-btn {
  position: absolute;
  top: 12px;
  right: 12px;
  z-index: 2;
  background: transparent;
  opacity: 0.5;
  transition: all 0.3s ease;

  &:hover,
  &.wishlist-active {
    opacity: 1;
    transform: scale(1.1);
  }
}

.product-name {
  font-size: 15px;
  color: #1a1a1a;
  cursor: pointer;
  &:hover {
    color: #a68b67;
  }
}

.price {
  font-size: 16px;
  color: #a68b67 !important;
}

.swatch-circle {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  border: 1px solid rgba(0, 0, 0, 0.1);
  cursor: pointer;
  &:hover {
    outline: 1px solid #777;
  }
}
</style>
