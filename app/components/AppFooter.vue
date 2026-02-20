<template>
  <v-footer class="bg-primary text-white pt-16 pb-8 border-t">
    <v-container>
      <v-row>
        <v-col cols="12" md="4" class="pr-md-16">
          <h4 class="text-h5 mb-6">WOODMART</h4>
          <p class="text-secondary-lighten-2 mb-4 leading-relaxed">
            Premium furniture store providing high-quality minimalist home decor
            and sustainable wood products since 2026.
          </p>
          <div class="d-flex ga-4">
            <v-btn icon="mdi-facebook" variant="plain" size="small" />
            <v-btn icon="mdi-instagram" variant="plain" size="small" />
            <v-btn icon="mdi-pinterest" variant="plain" size="small" />
          </div>
        </v-col>

        <v-col cols="6" md="2">
          <h5 class="text-subtitle-1 font-weight-bold mb-4">SHOP</h5>
          <div class="footer-links">
            <NuxtLink to="/shop">New Arrivals</NuxtLink>
            <NuxtLink to="/shop">Best Sellers</NuxtLink>
            <NuxtLink to="/shop">Sale</NuxtLink>
          </div>
        </v-col>

        <v-col cols="6" md="2">
          <h5 class="text-subtitle-1 font-weight-bold mb-4">SUPPORT</h5>
          <div class="footer-links">
            <NuxtLink to="/">Shipping</NuxtLink>
            <NuxtLink to="/">Returns</NuxtLink>
            <NuxtLink to="/">Privacy Policy</NuxtLink>
          </div>
        </v-col>

        <v-col cols="12" md="4">
          <h5 class="text-subtitle-1 font-weight-bold mb-4">NEWSLETTER</h5>
          <p class="text-caption mb-4">
            Subscribe to get special offers and once-in-a-lifetime deals.
          </p>
          <v-text-field
            variant="outlined"
            label="Your email address"
            density="comfortable"
            append-inner-icon="mdi-arrow-right"
            bg-color="rgba(255,255,255,0.05)"
          />
        </v-col>
      </v-row>

      <v-divider class="my-8" color="rgba(255,255,255,0.1)" />
      <div class="text-center text-caption text-secondary">
        © 2026 Woodmart Furniture. Built with Nuxt 4 & Vuetify.
      </div>
    </v-container>
  </v-footer>
</template>
<script setup lang="ts"></script>
<style lang="scss">
.footer-links {
  display: flex;
  flex-direction: column;
  gap: 12px;

  a {
    color: #999;
    text-decoration: none;
    font-size: 14px;
    transition: color 0.3s;
    &:hover {
      color: white;
    }
  }
}
</style>
