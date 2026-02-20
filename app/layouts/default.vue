<script setup lang="ts">
import { useDisplay } from "vuetify";

// 1. Stores for State Management
const cartStore = useCartStore();
const categoryStore = useCategoryStore();

// 2. Local UI State
const mobileMenuDrawer = ref(false);
const searchActive = ref(false);
const { mdAndUp } = useDisplay();

// 3. SEO & Categories Initialization
// Fetch categories globally so the Mega Menu is always ready
await useAsyncData("global-categories", () => categoryStore.fetchCategories());
</script>

<template>
  <v-app>
    <!-- A. MOBILE NAVIGATION DRAWER (Left Side) -->
    <v-navigation-drawer
      v-model="mobileMenuDrawer"
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
        <v-btn
          icon="mdi-close"
          variant="text"
          @click="mobileMenuDrawer = false"
        />
      </div>

      <v-list nav>
        <v-list-item to="/" title="Home" prepend-icon="mdi-home-outline" />
        <v-list-item to="/shop" title="Shop" prepend-icon="mdi-store-outline" />

        <v-list-group value="Categories">
          <template v-slot:activator="{ props }">
            <v-list-item
              v-bind="props"
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

    <!-- B. WOODMART SIDE CART (Right Side) -->
    <!-- Managed globally via cartStore.isDrawerOpen -->
    <v-navigation-drawer
      v-model="cartStore.isDrawerOpen"
      location="right"
      temporary
      width="400"
      elevation="10"
      class="cart-drawer"
    >
      <div class="pa-5 d-flex justify-space-between align-center border-b">
        <span class="text-h6 font-weight-bold">SHOPPING CART</span>
        <v-btn
          icon="mdi-close"
          variant="text"
          @click="cartStore.isDrawerOpen = false"
        />
      </div>

      <div v-if="cartStore.items.length > 0" class="d-flex flex-column h-100">
        <v-list class="flex-grow-1 overflow-y-auto pa-4">
          <v-list-item
            v-for="item in cartStore.items"
            :key="item.id"
            class="px-0 mb-4"
          >
            <template v-slot:prepend>
              <v-avatar rounded="lg" size="80" class="mr-3 border">
                <v-img :src="item.image" cover />
              </v-avatar>
            </template>
            <v-list-item-title class="font-weight-bold text-wrap">{{
              item.name
            }}</v-list-item-title>
            <v-list-item-subtitle class="mt-1">
              {{ item.quantity }} ×
              <span class="text-accent font-weight-bold"
                >${{ item.price }}</span
              >
            </v-list-item-subtitle>
            <template v-slot:append>
              <v-btn
                icon="mdi-delete-outline"
                variant="text"
                color="grey"
                size="small"
                @click="cartStore.removeItem(item.id)"
              />
            </template>
          </v-list-item>
        </v-list>

        <div class="pa-6 border-t bg-white">
          <div
            class="d-flex justify-space-between text-h6 font-weight-bold mb-4"
          >
            <span>Subtotal:</span>
            <span class="text-accent">{{ cartStore.formattedTotal }}</span>
          </div>
          <v-btn
            block
            color="primary"
            height="50"
            class="mb-3 font-weight-bold"
            to="/cart"
            @click="cartStore.isDrawerOpen = false"
            >VIEW CART</v-btn
          >
          <v-btn
            block
            variant="outlined"
            height="50"
            class="font-weight-bold"
            to="/checkout"
            @click="cartStore.isDrawerOpen = false"
            >CHECKOUT</v-btn
          >
        </div>
      </div>

      <div
        v-else
        class="h-100 d-flex flex-column align-center justify-center pa-10 text-center"
      >
        <v-icon
          size="80"
          color="grey-lighten-3"
          icon="mdi-cart-off"
          class="mb-4"
        />
        <div class="text-h6 text-grey">Your cart is empty</div>
        <v-btn
          color="primary"
          class="mt-6"
          to="/shop"
          @click="cartStore.isDrawerOpen = false"
          >RETURN TO SHOP</v-btn
        >
      </div>
    </v-navigation-drawer>

    <!-- C. STICKY HEADER -->
    <v-app-bar flat height="85" border="b" class="main-header">
      <v-container class="d-flex align-center">
        <!-- Mobile Burger -->
        <v-app-bar-nav-icon v-if="!mdAndUp" @click="mobileMenuDrawer = true" />

        <!-- Logo -->
        <NuxtLink to="/" class="logo-link mr-8">
          <h1 class="text-h4 font-weight-bold mb-0">
            WOOD<span class="font-weight-light text-accent">MART</span>
          </h1>
        </NuxtLink>

        <!-- Desktop Menu -->
        <nav v-if="mdAndUp" class="d-flex align-center ga-8 main-nav">
          <NuxtLink to="/" class="nav-link">HOME</NuxtLink>

          <!-- Shop Mega Menu Trigger -->
          <v-menu open-on-hover open-delay="0" close-delay="100">
            <template v-slot:activator="{ props }">
              <NuxtLink to="/shop" v-bind="props" class="nav-link">
                SHOP <v-icon size="14">mdi-chevron-down</v-icon>
              </NuxtLink>
            </template>
            <v-card width="250" class="mt-2 py-2">
              <v-list>
                <v-list-item
                  v-for="cat in categoryStore.parentCategories"
                  :key="cat.id"
                  :to="`/category/${cat.slug}`"
                >
                  <v-list-item-title>{{ cat.name }}</v-list-item-title>
                </v-list-item>
              </v-list>
            </v-card>
          </v-menu>

          <NuxtLink to="/blog" class="nav-link">BLOG</NuxtLink>
          <NuxtLink to="/about" class="nav-link">ABOUT</NuxtLink>
        </nav>

        <v-spacer />

        <!-- Right Side Icons -->
        <div class="d-flex align-center ga-1 ga-sm-3">
          <v-btn icon="mdi-magnify" variant="text" class="d-none d-sm-flex" />
          <v-btn icon="mdi-account-outline" variant="text" to="/my-account" />
          <v-btn
            icon="mdi-heart-outline"
            variant="text"
            class="d-none d-sm-flex"
          />

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

    <!-- D. MAIN CONTENT -->
    <v-main class="page-wrapper">
      <slot />

      <!-- Moved Footer to a separate component -->
      <AppFooter />
    </v-main>

    <!-- E. MOBILE BOTTOM BAR (UX Optimization) -->
    <v-bottom-navigation
      v-if="!mdAndUp"
      grow
      height="65"
      color="accent"
      elevation="10"
      border="t"
    >
      <v-btn to="/">
        <v-icon>mdi-home-outline</v-icon>
        <span>Home</span>
      </v-btn>
      <v-btn to="/shop">
        <v-icon>mdi-view-grid-outline</v-icon>
        <span>Shop</span>
      </v-btn>
      <v-btn @click="cartStore.toggleDrawer(true)">
        <v-badge
          :content="cartStore.count"
          color="accent"
          :model-value="cartStore.count > 0"
        >
          <v-icon>mdi-cart-outline</v-icon>
        </v-badge>
        <span>Cart</span>
      </v-btn>
      <v-btn to="/my-account">
        <v-icon>mdi-account-outline</v-icon>
        <span>Account</span>
      </v-btn>
    </v-bottom-navigation>
  </v-app>
</template>

<style lang="scss">
.main-header {
  background: rgba(255, 255, 255, 0.95) !important;
  backdrop-filter: blur(10px);
}

.logo-link {
  text-decoration: none;
  color: var(--v-theme-primary);
  h1 {
    font-family: "Playfair Display", serif !important;
  }
}

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
    background: var(--v-theme-accent);
    transition: width 0.3s ease;
  }

  &:hover::after,
  &.router-link-active::after {
    width: 100%;
  }
}

.page-wrapper {
  background-color: #fcfcfc;
}

.cart-drawer {
  .v-navigation-drawer__content {
    display: flex;
    flex-direction: column;
  }
}

/* Woodmart Typography & Global refinements */
.text-accent {
  color: #a68b67 !important;
}
.v-btn {
  text-transform: uppercase;
  letter-spacing: 1px;
}
</style>
