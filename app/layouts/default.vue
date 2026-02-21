<script setup lang="ts">
import { useDisplay } from "vuetify";

const cartStore = useCartStore();
const categoryStore = useCategoryStore();
const mobileMenuDrawer = ref(false);
const { mdAndUp } = useDisplay();

// Fetch Global Categories
await useAsyncData("global-categories", () => categoryStore.fetchCategories());
</script>

<template>
  <v-app>
    <!-- 1. Drawers -->
    <LayoutMobileDrawer v-model="mobileMenuDrawer" />
    <LayoutCartDrawer v-if="cartStore.isDrawerOpen === true" />

    <!-- 2. Main Header -->
    <v-app-bar flat height="85" border="b" class="main-header sticky-header">
      <v-container class="d-flex align-center">
        <!-- Burger Icon for Mobile -->
        <v-app-bar-nav-icon v-if="!mdAndUp" @click="mobileMenuDrawer = true" />

        <LayoutAppLogo />

        <LayoutDesktopNav v-if="mdAndUp" />

        <v-spacer />

        <!-- Header Actions -->
        <div class="d-flex align-center ga-1 ga-sm-3">
          <v-btn icon="mdi-magnify" variant="text" class="d-none d-sm-flex" />
          <v-btn icon="mdi-account-outline" variant="text" to="/my-account" />
          <v-btn
            icon="mdi-heart-outline"
            variant="text"
            class="d-none d-sm-flex"
          />

          <!-- Cart Trigger -->
          <v-btn
            variant="text"
            class="cart-btn pl-2"
            @click="cartStore.toggleDrawer(true)"
          >
            <v-badge
              :content="cartStore.count"
              color="accent"
              :model-value="cartStore.count > 0"
              offset-x="-2"
              offset-y="-2"
            >
              <v-icon icon="mdi-cart-outline" />
            </v-badge>
            <div
              v-if="mdAndUp"
              class="d-flex flex-column align-start ml-3"
              style="line-height: 1"
            >
              <span class="text-caption text-grey">Cart</span>
              <span class="text-subtitle-2 font-weight-bold">{{
                cartStore.formattedTotal
              }}</span>
            </div>
          </v-btn>
        </div>
      </v-container>
    </v-app-bar>

    <!-- 3. Main Content Area -->
    <v-main class="page-wrapper">
      <slot />
      <AppFooter />
    </v-main>

    <!-- 4. Mobile UX Tools -->
    <LayoutMobileBottomNav v-if="!mdAndUp" />
  </v-app>
</template>

<style lang="scss">
.main-header {
  background: rgba(255, 255, 255, 0.95) !important;
  backdrop-filter: blur(10px);
  z-index: 1000 !important;
}

.page-wrapper {
  background-color: #fcfcfc;
  min-height: 100vh;
}

.text-accent {
  color: #a68b67 !important;
}
</style>
