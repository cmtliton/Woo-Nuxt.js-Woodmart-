<script setup lang="ts">
const cartStore = useCartStore();
</script>

<template>
  <v-bottom-navigation
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
</template>
