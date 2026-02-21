<script setup lang="ts">
const props = defineProps<{ modelValue: boolean }>();
const emit = defineEmits(["update:modelValue"]);
const categoryStore = useCategoryStore();

const isOpen = computed({
  get: () => props.modelValue,
  set: (val) => emit("update:modelValue", val),
});
</script>

<template>
  <v-navigation-drawer
    v-model="isOpen"
    temporary
    width="320"
    class="mobile-nav"
  >
    <div
      class="pa-5 d-flex justify-space-between align-center bg-grey-lighten-4"
    >
      <span class="text-subtitle-1 font-weight-bold text-uppercase"
        >Navigation</span
      >
      <v-btn icon="mdi-close" variant="text" @click="isOpen = false" />
    </div>

    <v-list nav>
      <v-list-item to="/" title="Home" prepend-icon="mdi-home-outline" />
      <v-list-item to="/shop" title="Shop" prepend-icon="mdi-store-outline" />

      <v-list-group value="Categories">
        <template v-slot:activator="{ props: groupProps }">
          <v-list-item
            v-bind="groupProps"
            prepend-icon="mdi-format-list-bulleted"
            title="Categories"
          />
        </template>
        <v-list-item
          v-for="cat in categoryStore.parentCategories"
          :key="cat.id"
          :title="cat.name"
          :to="`/category/${cat.slug}`"
          class="pl-8"
        />
      </v-list-group>

      <v-list-item
        to="/about"
        title="About Us"
        prepend-icon="mdi-information-outline"
      />
    </v-list>
  </v-navigation-drawer>
</template>
