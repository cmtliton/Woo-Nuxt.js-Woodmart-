<script setup lang="ts">
const props = defineProps<{
  product: any;
}>();

const emit = defineEmits(["open-quick-view"]);

// Format price helper
const formatPrice = (value: string | number) => {
  return parseFloat(value as string).toFixed(2);
};

const goToProduct = () => {
  navigateTo(`/products/${props.product.slug}`);
};
</script>

<template>
  <div
    class="product-list-item d-flex ga-6 pa-4 mb-4 border rounded-lg align-center"
  >
    <!-- Image Section -->
    <v-hover v-slot="{ isHovering, props: hoverProps }">
      <div
        v-bind="hoverProps"
        class="product-image-wrapper flex-shrink-0 cursor-pointer rounded overflow-hidden"
        @click="goToProduct"
      >
        <NuxtImg
          :src="product.image || '/images/placeholder.jpg'"
          :alt="product.name"
          width="220"
          height="220"
          fit="cover"
          loading="lazy"
          class="product-image"
          :class="{ 'zoom-effect': isHovering }"
          format="webp"
        />
      </div>
    </v-hover>

    <!-- Details Section -->
    <div class="product-details flex-grow-1 d-flex flex-column py-2">
      <div class="d-flex justify-space-between align-start">
        <div>
          <p class="text-overline text-accent mb-0 letter-spacing-1">
            {{ product.category }}
          </p>
          <h3
            class="text-h5 font-weight-bold mb-1 product-title"
            @click="goToProduct"
          >
            {{ product.name }}
          </h3>

          <v-rating
            v-if="product.rating"
            :model-value="parseFloat(product.rating)"
            readonly
            density="compact"
            size="x-small"
            color="amber-darken-2"
            class="mb-3"
          />
        </div>

        <!-- Price Section -->
        <div class="text-right">
          <div class="product-price">
            <span
              v-if="product.on_sale"
              class="text-h6 font-weight-bold text-primary"
            >
              ${{ formatPrice(product.price) }}
            </span>
            <span v-else class="text-h6 font-weight-bold">
              ${{ formatPrice(product.price) }}
            </span>
            <div
              v-if="product.on_sale"
              class="text-caption text-grey text-decoration-line-through"
            >
              ${{ formatPrice(product.regular_price) }}
            </div>
          </div>
        </div>
      </div>

      <!-- Woodmart Style: Short description in list view -->
      <p
        class="text-body-2 text-secondary mb-6 line-clamp-2"
        v-if="product.short_description"
        v-html="product.short_description"
      ></p>

      <!-- Actions -->
      <div class="product-actions d-flex ga-3 mt-auto">
        <v-btn color="primary" elevation="0" rounded="0" class="px-6">
          Add to Cart
        </v-btn>
        <v-btn
          variant="outlined"
          rounded="0"
          prepend-icon="mdi-eye-outline"
          @click="emit('open-quick-view', product)"
        >
          Quick View
        </v-btn>
        <v-btn variant="text" icon="mdi-heart-outline" color="secondary" />
      </div>
    </div>
  </div>
</template>

<style scoped>
.product-list-item {
  border-color: rgba(0, 0, 0, 0.08) !important;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  background: #fff;
}

.product-list-item:hover {
  border-color: var(--v-theme-primary) !important;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.05);
}

.product-image-wrapper {
  width: 220px;
  height: 220px;
  background: #f9f9f9;
}

.product-image {
  width: 100%;
  height: 100%;
  transition: transform 1.2s cubic-bezier(0, 0, 0.2, 1);
}

.zoom-effect {
  transform: scale(1.1);
}

.product-title {
  cursor: pointer;
  transition: color 0.3s ease;
}

.product-title:hover {
  color: var(--v-theme-primary);
}

.letter-spacing-1 {
  letter-spacing: 1px !important;
}

.line-clamp-2 {
  display: -webkit-box;
  line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>
