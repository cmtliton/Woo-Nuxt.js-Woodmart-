<script setup lang="ts">
defineProps<{ product: any }>();
defineEmits(["click:quick-view"]);
</script>

<template>
  <v-hover v-slot="{ isHovering, props }">
    <v-card
      v-bind="props"
      class="product-card mb-6"
      flat
      :ripple="false"
      :to="`/products/${product.slug}`"
    >
      <!-- Image Container -->
      <div
        class="product-image-container position-relative overflow-hidden rounded-lg bg-grey-lighten-4"
      >
        <!-- FIX: Changed fit="cover" to fit="contain" to show full product -->
        <NuxtImg
          :src="product.image || '/images/placeholder.jpg'"
          :alt="product.name"
          fit="contain"
          loading="lazy"
          class="product-image w-100 h-100"
          :class="{ 'zoom-effect': isHovering }"
          placeholder
          format="webp"
        />

        <!-- Action Overlay -->
        <v-fade-transition>
          <div
            v-if="isHovering"
            class="product-actions d-flex flex-column gap-2"
          >
            <v-btn
              icon="mdi-magnify"
              size="small"
              color="white"
              elevation="2"
              @click.prevent.stop="$emit('click:quick-view')"
            />
            <v-btn
              icon="mdi-heart-outline"
              size="small"
              color="white"
              elevation="2"
            />
          </div>
        </v-fade-transition>

        <!-- Quick Add to Cart -->
        <v-slide-y-reverse-transition>
          <div v-if="isHovering" class="quick-add-container">
            <v-btn
              block
              color="primary"
              height="45"
              class="font-weight-bold rounded-0"
              @click.prevent.stop=""
            >
              ADD TO CART
            </v-btn>
          </div>
        </v-slide-y-reverse-transition>
      </div>

      <!-- Details -->
      <div class="product-info mt-4 text-center">
        <div
          class="text-caption text-secondary text-uppercase letter-spacing-1 mb-1"
        >
          {{ product.category }}
        </div>
        <h3 class="text-subtitle-1 product-title mb-1 font-weight-medium">
          {{ product.name }}
        </h3>
        <div class="product-price">
          <span
            v-if="product.on_sale"
            class="text-decoration-line-through text-secondary text-caption mr-2"
          >
            ${{ product.regular_price }}
          </span>
          <span class="text-accent font-weight-bold">
            ${{ product.price }}
          </span>
        </div>
      </div>
    </v-card>
  </v-hover>
</template>

<style scoped>
.product-card {
  background: white !important;
  border: 1px solid #f0f0f0;
  transition: all 0.3s ease;
}

.product-card:hover {
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.05) !important;
}
.product-image-container {
  /* This ensures all containers in the grid are the exact same height */
  aspect-ratio: 1 / 1;

  background-color: #ffffff; /* #f9f9f9 Soft grey background like Woodmart */
}

.product-image {
  /* This ensures the image stays inside and doesn't cut off */

  object-fit: cover;
  transition: transform 1.2s cubic-bezier(0.15, 0, 0.15, 1);
  display: block;
}

.zoom-effect {
  transform: scale(1.1);
}

.product-actions {
  position: absolute;
  top: 10px;
  right: 10px;
  z-index: 2;
}

.quick-add-container {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  z-index: 2;
}

.product-title {
  font-family: "Playfair Display", serif !important;
  font-size: 1.1rem !important;
  line-height: 1.4;
  color: #242424;
  /* Prevent title misalignment */
  display: -webkit-box;
  line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  height: 2.8em;
}

.text-accent {
  color: #a68b67 !important; /* Woodmart Gold/Wood color */
  font-size: 1.1rem;
}
</style>
