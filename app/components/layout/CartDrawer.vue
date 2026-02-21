<script setup lang="ts">
const cartStore = useCartStore();
</script>

<template>
  <v-navigation-drawer
    v-model="cartStore.isDrawerOpen"
    location="right"
    temporary
    width="400"
    class="cart-drawer shadow-xl"
  >
    <!-- Header -->
    <div class="pa-5 d-flex justify-space-between align-center border-b">
      <span class="text-h6 font-weight-bold text-uppercase">Shopping Cart</span>
      <v-btn
        icon="mdi-close"
        variant="text"
        @click="cartStore.toggleDrawer(false)"
      />
    </div>

    <!-- Cart Items -->
    <template v-if="cartStore.items.length > 0">
      <div class="d-flex flex-column h-100">
        <v-list class="flex-grow-1 overflow-y-auto pa-4">
          <v-list-item
            v-for="item in cartStore.items"
            :key="item.id"
            class="px-0 mb-4"
          >
            <template v-slot:prepend>
              <v-avatar
                rounded="lg"
                size="80"
                class="mr-3 border bg-grey-lighten-4"
              >
                <v-img :src="item.image" cover />
              </v-avatar>
            </template>
            <v-list-item-title
              class="font-weight-bold text-wrap line-height-1"
              >{{ item.name }}</v-list-item-title
            >
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

        <!-- Footer -->
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
            class="mb-3 rounded-0"
            to="/cart"
            @click="cartStore.toggleDrawer(false)"
            >VIEW CART</v-btn
          >
          <v-btn
            block
            variant="outlined"
            height="50"
            class="rounded-0"
            to="/checkout"
            @click="cartStore.toggleDrawer(false)"
            >CHECKOUT</v-btn
          >
        </div>
      </div>
    </template>

    <!-- Empty Cart -->
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
        class="mt-6 rounded-0 px-8"
        to="/shop"
        @click="cartStore.toggleDrawer(false)"
        >RETURN TO SHOP</v-btn
      >
    </div>
  </v-navigation-drawer>
</template>
