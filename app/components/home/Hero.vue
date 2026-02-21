<script setup lang="ts">
const slides = [
  {
    tag: "New Collection 2026",
    title: "Minimalist Living <br/> Room Concept",
    desc: "Discover our new hand-crafted oak collection designed for modern spaces.",
    image:
      "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?q=80&w=2070&auto=format&fit=crop",
    link: "/shop",
    color: "primary",
  },
  {
    tag: "Exclusive Offer",
    title: "Artistic Comfort <br/> In Every Detail",
    desc: "Upgrade your office with ergonomically designed chairs starting from $199.",
    image:
      "https://images.unsplash.com/photo-1524758631624-e2822e304c36?q=80&w=2070&auto=format&fit=crop",
    link: "/category/office",
    color: "accent",
  },
];
</script>

<template>
  <section class="hero-wrapper">
    <v-carousel
      cycle
      height="85vh"
      hide-delimiter-background
      show-arrows="hover"
      class="hero-slider"
      :interval="6000"
    >
      <v-carousel-item v-for="(slide, i) in slides" :key="i">
        <div class="hero-slide-content position-relative h-100">
          <!-- Optimized Image Background -->
          <NuxtImg
            :src="slide.image"
            class="hero-image"
            alt="Hero Furniture"
            sizes="sm:100vw md:100vw lg:100vw"
            fetchpriority="high"
            :loading="i === 0 ? 'eager' : 'lazy'"
            format="webp"
          />

          <!-- Overlay for Text Readability -->
          <div class="hero-overlay"></div>

          <!-- Content Container -->
          <v-container class="h-100 d-flex align-center">
            <v-row>
              <v-col cols="12" md="7" lg="6">
                <v-fade-transition appear>
                  <div class="content-box">
                    <p
                      class="text-overline text-accent font-weight-bold letter-spacing-2 mb-4"
                    >
                      {{ slide.tag }}
                    </p>
                    <h1
                      class="text-h3 text-md-h2 font-weight-bold mb-6 hero-title"
                      v-html="slide.title"
                    ></h1>
                    <p class="text-body-1 text-secondary mb-10 hero-desc">
                      {{ slide.desc }}
                    </p>
                    <div class="d-flex ga-4">
                      <v-btn
                        color="primary"
                        size="x-large"
                        rounded="0"
                        class="px-10 font-weight-bold elevation-0"
                        :to="slide.link"
                      >
                        SHOP NOW
                      </v-btn>
                      <v-btn
                        variant="outlined"
                        size="x-large"
                        rounded="0"
                        class="px-10 font-weight-bold"
                        to="/about"
                      >
                        EXPLORE
                      </v-btn>
                    </div>
                  </div>
                </v-fade-transition>
              </v-col>
            </v-row>
          </v-container>
        </div>
      </v-carousel-item>
    </v-carousel>
  </section>
</template>

<style scoped lang="scss">
.hero-wrapper {
  background-color: #f9f9f9;
}

.hero-slider {
  /* Woodmart Style Customization */
  :deep(.v-window__controls) {
    padding: 0 40px;
  }

  :deep(.v-btn--icon.v-btn--density-default) {
    width: 50px;
    height: 50px;
    background: rgba(255, 255, 255, 0.8);
    color: #1a1a1a;
    &:hover {
      background: #1a1a1a;
      color: white;
    }
  }
}

.hero-image {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  z-index: 0;
}

.hero-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(
    90deg,
    rgba(255, 255, 255, 0.8) 0%,
    rgba(255, 255, 255, 0.2) 100%
  );
  z-index: 1;
}

.content-box {
  position: relative;
  z-index: 2;

  .hero-title {
    font-family: "Playfair Display", serif !important;
    line-height: 1.1;
    color: #1a1a1a;
  }

  .hero-desc {
    max-width: 450px;
    line-height: 1.8;
  }
}

.letter-spacing-2 {
  letter-spacing: 3px !important;
}

/* Animations for Slide Changes */
.v-window-item--active .content-box {
  animation: slideUpFade 1s ease-out forwards;
}

@keyframes slideUpFade {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Mobile Adjustments */
@media (max-width: 960px) {
  .hero-slider {
    height: 70vh !important;
  }
  .hero-overlay {
    background: rgba(255, 255, 255, 0.6);
  }
  .hero-title {
    font-size: 2.5rem !important;
  }
}
</style>
