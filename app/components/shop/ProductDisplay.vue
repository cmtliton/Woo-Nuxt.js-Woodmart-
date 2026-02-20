<script setup lang="ts">
interface Props {
  products: any[];
  loading?: boolean;
  view?: "grid" | "list";
}

withDefaults(defineProps<Props>(), {
  view: "grid",
  loading: false,
});

defineEmits(["open-quick-view"]);
</script>

<template>
  <div class="product-display-wrapper">
    <v-fade-transition mode="out-in">
      <!-- GRID VIEW -->
      <v-row v-if="view === 'grid'" key="grid">
        <template v-if="loading">
          <v-col v-for="n in 8" :key="n" cols="12" sm="6" md="4" lg="3">
            <v-skeleton-loader type="image, article" />
          </v-col>
        </template>
        <template v-else>
          <v-col
            v-for="product in products"
            :key="product.id"
            cols="12"
            sm="6"
            md="4"
            lg="3"
          >
            <ShopProductCard
              :product="product"
              @click:quick-view="$emit('open-quick-view', product)"
            />
          </v-col>
        </template>
      </v-row>

      <!-- LIST VIEW -->
      <div v-else key="list" class="product-list-container">
        <template v-if="loading">
          <v-skeleton-loader
            v-for="n in 4"
            :key="n"
            type="image, article"
            class="mb-6 rounded-lg"
          />
        </template>
        <template v-else>
          <ShopProductCardList
            v-for="product in products"
            :key="product.id"
            :product="product"
            @open-quick-view="$emit('open-quick-view', product)"
          />
        </template>
      </div>
    </v-fade-transition>
  </div>
</template>
