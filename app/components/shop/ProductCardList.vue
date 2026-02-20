<script setup lang="ts">
const props = defineProps<{
  product: any;
}>();

const emit = defineEmits(["open-quick-view"]);

const formatPrice = (value: string | number) => {
  return parseFloat(value as string).toFixed(2);
};

const goToProduct = () => {
  navigateTo(`/products/${props.product.slug}`);
};
</script>

<template>
  <div
    class="product-list-item d-flex flex-column flex-sm-row ga-4 ga-md-6 pa-3 pa-sm-4 mb-5 border rounded-lg align-center align-sm-start"
  >
    <!-- Image Section -->
    <v-hover v-slot="{ isHovering, props: hoverProps }">
      <div
        v-bind="hoverProps"
        class="product-image-wrapper flex-shrink-0 cursor-pointer rounded-lg overflow-hidden position-relative"
        @click="goToProduct"
      >
        <NuxtImg
          :src="product.image || '/images/placeholder.jpg'"
          :alt="product.name"
          width="250"
          height="250"
          fit="cover"
          loading="lazy"
          class="product-image w-100 h-100"
          :class="{ 'zoom-effect': isHovering }"
          format="webp"
        />
        <!-- Sale Tag -->
        <div v-if="product.on_sale" class="sale-badge">SALE</div>
      </div>
    </v-hover>

    <!-- Details Section -->
    <div class="product-details flex-grow-1 d-flex flex-column w-100 py-1">
      <div
        class="d-flex flex-column flex-md-row justify-space-between align-start"
      >
        <div class="w-100">
          <p
            class="text-overline text-accent mb-1 letter-spacing-1 font-weight-bold"
          >
            {{ product.category }}
          </p>
          <h3
            class="text-h6 text-md-h5 font-weight-bold mb-1 product-title"
            @click="goToProduct"
          >
            {{ product.name }}
          </h3>

          <div class="d-flex align-center mb-2 mb-md-4">
            <v-rating
              v-if="product.rating"
              :model-value="parseFloat(product.rating)"
              readonly
              density="compact"
              size="x-small"
              color="amber-darken-2"
            />
            <span class="text-caption text-grey ml-2">(4.5 Reviews)</span>
          </div>
        </div>

        <!-- Price Section (Mobile-এ টাইটেলের নিচে, Desktop-এ ডানপাশে) -->
        <div class="price-container text-left text-md-right mb-3 mb-md-0">
          <div class="product-price">
            <span
              v-if="product.on_sale"
              class="text-h5 font-weight-bold text-primary"
            >
              ${{ formatPrice(product.price) }}
            </span>
            <span v-else class="text-h5 font-weight-bold">
              ${{ formatPrice(product.price) }}
            </span>
            <div
              v-if="product.on_sale"
              class="text-body-2 text-grey text-decoration-line-through"
            >
              ${{ formatPrice(product.regular_price) }}
            </div>
          </div>
        </div>
      </div>

      <!-- Description: মোবাইলে হাইড রাখা হয়েছে ক্লিন লুকের জন্য, ট্যাবলেট/ডেস্কটপে দৃশ্যমান -->
      <p
        class="text-body-2 text-secondary mb-6 d-none d-sm-flex line-clamp-2"
        v-if="product.short_description"
        v-html="product.short_description"
      ></p>

      <!-- Actions Section: মোবাইলে ফুল উইডথ বাটন -->
      <div
        class="product-actions d-flex flex-wrap align-center ga-2 ga-md-3 mt-auto"
      >
        <v-btn
          color="primary"
          elevation="0"
          rounded="0"
          class="flex-grow-1 flex-md-grow-0 px-md-8 font-weight-bold"
          height="45"
        >
          Add to Cart
        </v-btn>

        <v-btn
          variant="outlined"
          rounded="0"
          height="45"
          class="flex-grow-1 flex-md-grow-0 px-md-4"
          prepend-icon="mdi-eye-outline"
          @click="emit('open-quick-view', product)"
        >
          Quick View
        </v-btn>

        <v-btn
          variant="tonal"
          icon="mdi-heart-outline"
          color="secondary"
          rounded="0"
          class="d-none d-sm-flex"
        />
      </div>
    </div>
  </div>
</template>

<style scoped>
.product-list-item {
  border-color: rgba(0, 0, 0, 0.08) !important;
  transition: all 0.4s cubic-bezier(0.165, 0.84, 0.44, 1);
  background: #fff;
}

.product-list-item:hover {
  border-color: var(--v-theme-primary) !important;
  box-shadow: 0 15px 45px rgba(0, 0, 0, 0.08);
  transform: translateY(-2px);
}

/* Image Responsive Size */
.product-image-wrapper {
  width: 100%; /* Mobile: Full width */
  max-width: 100%;
  aspect-ratio: 1/1;
  background: #fdfdfd;
}

@media (min-width: 600px) {
  .product-image-wrapper {
    width: 180px; /* Tablet */
    height: 180px;
  }
}

@media (min-width: 960px) {
  .product-image-wrapper {
    width: 240px; /* Desktop */
    height: 240px;
  }
}

.product-image {
  transition: transform 1.5s cubic-bezier(0, 0, 0.2, 1);
  object-fit: cover;
}

.zoom-effect {
  transform: scale(1.1);
}

.sale-badge {
  position: absolute;
  top: 10px;
  left: 10px;
  background: #a68b67;
  color: white;
  padding: 4px 12px;
  font-size: 10px;
  font-weight: bold;
  letter-spacing: 1px;
  z-index: 1;
}

.product-title {
  cursor: pointer;
  transition: color 0.3s ease;
  font-family: "Playfair Display", serif !important;
  line-height: 1.2;
}

.product-title:hover {
  color: var(--v-theme-primary);
}

.letter-spacing-1 {
  letter-spacing: 1.5px !important;
}

/* Line Clamp logic for cleaner UI */
.line-clamp-2 {
  display: -webkit-box;
  line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  line-height: 1.6;
}

/* Woodmart specific Primary Color (Gold/Oak) */
.text-primary {
  color: #a68b67 !important;
}
</style>
