<script setup lang="ts">
const categoryStore = useCategoryStore();

// শুধুমাত্র মেইন ক্যাটাগরিগুলো দেখানোর জন্য (প্রথম ১০টি)
const displayCategories = computed(() =>
  categoryStore.categories.filter((cat) => cat.parent === 0).slice(0, 10),
);
</script>

<template>
  <section class="category-circle-section py-16">
    <v-container>
      <!-- Section Header -->
      <div class="mb-10 text-left">
        <h2 class="text-h4 font-weight-bold mb-2 section-title">
          Our categories
        </h2>
        <p class="text-body-1 text-secondary font-weight-light">
          Lots of new products and product collections
        </p>
      </div>

      <!-- Categories Grid -->
      <div class="category-flex-container">
        <div
          v-for="cat in displayCategories"
          :key="cat.id"
          class="category-item-wrapper"
        >
          <NuxtLink :to="`/category/${cat.slug}`" class="category-circle-link">
            <v-hover v-slot="{ isHovering, props }">
              <div
                v-bind="props"
                class="category-circle rounded-circle overflow-hidden position-relative"
              >
                <!-- Optimized Image -->
                <NuxtImg
                  :src="cat.image?.src || '/images/placeholder-furniture.jpg'"
                  :alt="cat.name"
                  width="300"
                  height="300"
                  fit="cover"
                  class="circle-img"
                  :class="{ 'zoom-effect': isHovering }"
                  loading="lazy"
                  format="webp"
                />

                <!-- Overlay darkening on hover -->
                <div
                  class="circle-overlay"
                  :class="{ 'overlay-active': isHovering }"
                ></div>

                <!-- Label: White Pill -->
                <div class="category-label-pill shadow-sm">
                  <span class="cat-name">{{ cat.name }}</span>
                  <!-- Product Count (Only shows on hover to match premium look) -->
                  <v-expand-transition>
                    <div v-if="isHovering" class="cat-count text-caption mt-1">
                      {{ cat.count }} products
                    </div>
                  </v-expand-transition>
                </div>
              </div>
            </v-hover>
          </NuxtLink>
        </div>
      </div>
    </v-container>
  </section>
</template>

<style scoped lang="scss">
.category-circle-section {
  background-color: #f9f9f9; // স্ক্রিনশটের মতো হালকা অফ-হোয়াইট ব্যাকগ্রাউন্ড
}

.section-title {
  color: #1a1a1a;
  font-family: "Inter", sans-serif !important; // Woodmart clean style
}

/* Custom 5-column grid for desktop */
.category-flex-container {
  display: grid;
  grid-template-columns: repeat(2, 1fr); // Mobile: 2 columns
  gap: 20px;

  @media (min-width: 600px) {
    grid-template-columns: repeat(3, 1fr); // Tablet: 3 columns
  }

  @media (min-width: 1264px) {
    grid-template-columns: repeat(5, 1fr); // Desktop: 5 columns
    gap: 30px;
  }
}

.category-circle-link {
  text-decoration: none;
}

.category-circle {
  aspect-ratio: 1 / 1;
  width: 100%;
  border: 1px solid rgba(0, 0, 0, 0.05);
  background: #eee;

  .circle-img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: transform 1.2s cubic-bezier(0.15, 0, 0.15, 1);
  }

  .zoom-effect {
    transform: scale(1.1);
  }
}

.circle-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0);
  transition: background 0.4s ease;
  z-index: 1;

  &.overlay-active {
    background: rgba(0, 0, 0, 0.15); // হোভার করলে হালকা ডার্ক হবে
  }
}

/* Label Pill Style */
.category-label-pill {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background: white;
  padding: 8px 24px;
  border-radius: 50px; // Pill shape
  z-index: 2;
  text-align: center;
  min-width: 100px;
  transition: all 0.3s ease;

  .cat-name {
    color: #1a1a1a;
    font-weight: 700;
    font-size: 1rem;
    display: block;
    white-space: nowrap;
  }

  .cat-count {
    color: #777;
    font-weight: 400;
  }
}

// Hover করলে লেবেল পিল একটু বড় বা শ্যাডো বাড়বে
.category-circle:hover .category-label-pill {
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1) !important;
  padding: 12px 28px;
}
</style>
