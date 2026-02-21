<script setup lang="ts">
const categoryStore = useCategoryStore();
</script>

<template>
  <nav class="d-flex align-center ga-8 main-nav">
    <NuxtLink to="/" class="nav-link">HOME</NuxtLink>

    <!-- Shop Mega Menu -->
    <v-menu open-on-hover open-delay="0" close-delay="100">
      <template v-slot:activator="{ props }">
        <NuxtLink to="/shop" v-bind="props" class="nav-link">
          SHOP <v-icon size="14">mdi-chevron-down</v-icon>
        </NuxtLink>
      </template>
      <v-card width="250" class="mt-2 py-2 shadow-lg">
        <v-list nav>
          <v-list-item
            v-for="cat in categoryStore.parentCategories"
            :key="cat.id"
            :to="`/category/${cat.slug}`"
            active-color="accent"
          >
            <v-list-item-title>{{ cat.name }}</v-list-item-title>
          </v-list-item>
        </v-list>
      </v-card>
    </v-menu>

    <NuxtLink to="/blog" class="nav-link">BLOG</NuxtLink>
    <NuxtLink to="/about" class="nav-link">ABOUT</NuxtLink>
  </nav>
</template>

<style scoped lang="scss">
.nav-link {
  text-decoration: none;
  color: #1a1a1a;
  font-size: 13px;
  font-weight: 700;
  letter-spacing: 1.2px;
  position: relative;
  padding: 10px 0;

  &::after {
    content: "";
    position: absolute;
    bottom: 0;
    left: 0;
    width: 0;
    height: 2px;
    background: #a68b67;
    transition: width 0.3s ease;
  }

  &:hover::after,
  &.router-link-active::after {
    width: 100%;
  }
}
</style>
