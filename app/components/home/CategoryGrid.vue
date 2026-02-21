<script setup lang="ts">
// 1. Access the store
const categoryStore = useCategoryStore();

// 2. Fetch parent categories if not already loaded
// In a real Woodmart theme, we only show top-level categories on home
const topCategories = computed(() =>
  categoryStore.categories.filter((cat) => cat.parent === 0).slice(0, 6),
);
</script>

<template>
  <section class="category-section py-16 bg-white">
    <v-container>
      <!-- Section Header -->
      <div class="text-center mb-12">
        <p
          class="text-overline text-accent font-weight-bold letter-spacing-2 mb-2"
        >
          Find Your Style
        </p>
        <h2 class="text-h3 font-weight-bold section-title">Shop by Category</h2>
        <v-divider
          class="mx-auto mt-4"
          width="60"
          thickness="3"
          color="primary"
        />
      </div>

      <!-- Categories Grid -->
      <v-row class="ga-y-6">
        <v-col
          v-for="(cat, i) in topCategories"
          :key="cat.id"
          cols="12"
          sm="6"
          md="4"
        >
          <v-hover v-slot="{ isHovering, props }">
            <v-card
              v-bind="props"
              :to="`/category/${cat.slug}`"
              flat
              class="category-card overflow-hidden rounded-lg"
              height="350"
            >
              <!-- Optimized Image -->
              <!-- Woodmart trick: Use a placeholder if category image is missing -->
              <NuxtImg
                :src="cat.image?.src || '/images/category-placeholder.jpg'"
                :alt="cat.name"
                class="category-img w-100 h-100"
                :class="{ 'zoom-effect': isHovering }"
                width="400"
                height="500"
                fit="cover"
                format="webp"
                loading="lazy"
              />

              <!-- Content Overlay -->
              <div
                class="category-overlay d-flex flex-column align-center justify-end pa-8"
              >
                <div
                  class="category-info-box white text-center pa-6 w-100"
                  :class="{ 'info-box-active': isHovering }"
                >
                  <h3
                    class="text-h5 font-weight-bold text-uppercase letter-spacing-1 mb-1"
                  >
                    {{ cat.name }}
                  </h3>
                  <div class="product-count text-caption text-secondary">
                    {{ cat.count }} PRODUCTS
                  </div>

                  <v-expand-transition>
                    <div v-if="isHovering" class="mt-4">
                      <v-btn
                        variant="text"
                        color="primary"
                        append-icon="mdi-arrow-right"
                        class="px-0"
                      >
                        BROWSE
                      </v-btn>
                    </div>
                  </v-expand-transition>
                </div>
              </div>
            </v-card>
          </v-hover>
        </v-col>
      </v-row>
    </v-container>
  </section>
</template>

<style scoped lang="scss">
.section-title {
  font-family: "Playfair Display", serif !important;
  color: #1a1a1a;
}

.category-card {
  position: relative;
  cursor: pointer;

  .category-img {
    transition: transform 1.5s cubic-bezier(0.15, 0, 0.15, 1);
    object-fit: cover;
    &.zoom-effect {
      transform: scale(1.1);
    }
  }
}

.category-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(
    to bottom,
    rgba(0, 0, 0, 0) 50%,
    rgba(0, 0, 0, 0.3) 100%
  );
  z-index: 2;

  .category-info-box {
    background: white;
    transition: transform 0.4s cubic-bezier(0.165, 0.84, 0.44, 1);
    transform: translateY(20px);
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.05);

    &.info-box-active {
      transform: translateY(0);
    }
  }
}

.letter-spacing-1 {
  letter-spacing: 1.5px !important;
}
.letter-spacing-2 {
  letter-spacing: 3px !important;
}

.product-count {
  position: relative;
  &::before,
  &::after {
    content: "";
    display: inline-block;
    width: 20px;
    height: 1px;
    background: #e0e0e0;
    vertical-align: middle;
    margin: 0 10px;
  }
}

/* Mobile optimizations */
@media (max-width: 600px) {
  .category-card {
    height: 280px !important;
  }
  .category-info-box {
    transform: translateY(0) !important;
    padding: 15px !important;
  }
}
</style>
