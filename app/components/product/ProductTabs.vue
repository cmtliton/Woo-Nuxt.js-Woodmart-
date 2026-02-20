<script setup lang="ts">
const props = defineProps<{
  description: string;
  reviews: any[]; // WooCommerce রিভিউ অবজেক্ট
  attributes?: any[]; // ফার্নিচারের স্পেসিফিকেশন (যেমন: Material, Color)
}>();

const tab = ref("description");
</script>

<template>
  <v-card flat class="mt-12 border-t pt-8">
    <v-tabs
      v-model="tab"
      color="primary"
      align-tabs="center"
      class="text-uppercase font-weight-bold"
    >
      <v-tab value="description">Description</v-tab>
      <v-tab value="specifications" v-if="attributes?.length"
        >Specifications</v-tab
      >
      <v-tab value="reviews">Reviews ({{ reviews?.length || 0 }})</v-tab>
    </v-tabs>

    <v-window v-model="tab" class="mt-8 pl-6 pr-2" touch>
      <!-- Description Tab -->
      <v-window-item value="description">
        <div class="description-content text-body-1" v-html="description"></div>
      </v-window-item>

      <!-- Specifications Tab -->
      <v-window-item value="specifications">
        <v-table class="border rounded">
          <tbody>
            <tr v-for="attr in attributes" :key="attr.id">
              <td class="font-weight-bold bg-grey-lighten-4 w-33">
                {{ attr.name }}
              </td>
              <td>{{ attr.options.join(", ") }}</td>
            </tr>
          </tbody>
        </v-table>
      </v-window-item>

      <!-- Reviews Tab -->
      <v-window-item value="reviews">
        <div v-if="reviews?.length">
          <v-list lines="three">
            <v-list-item
              v-for="review in reviews"
              :key="review.id"
              :title="review.reviewer"
              :subtitle="new Date(review.date_created).toLocaleDateString()"
            >
              <template v-slot:prepend>
                <v-avatar color="grey-lighten-2">
                  <v-icon icon="mdi-account"></v-icon>
                </v-avatar>
              </template>
              <v-rating
                :model-value="review.rating"
                readonly
                density="compact"
                size="x-small"
                color="orange-darken-2"
              ></v-rating>
              <div class="mt-2" v-html="review.review"></div>
            </v-list-item>
          </v-list>
        </div>
        <div v-else class="text-center py-10">
          <p class="text-secondary italic">
            No reviews yet for this furniture.
          </p>
        </div>
      </v-window-item>
    </v-window>
  </v-card>
</template>

<style scoped>
.description-content :deep(p) {
  margin-bottom: 1.5rem;
  color: #444;
}
.w-33 {
  width: 33%;
}
</style>
