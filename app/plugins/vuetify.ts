import { createVuetify } from "vuetify";
import * as components from "vuetify/components";
import * as directives from "vuetify/directives";
import "vuetify/styles"; // Vuetify এর ডিফল্ট স্টাইল ইম্পোর্ট
import "@mdi/font/css/materialdesignicons.css";

export default defineNuxtPlugin((nuxtApp) => {
  const vuetify = createVuetify({
    ssr: true, // Nuxt এর জন্য SSR অত্যন্ত গুরুত্বপূর্ণ
    components,
    directives,
    // এখানে আপনার থিম এবং অন্যান্য কনফিগারেশন যোগ করতে পারেন
    theme: {
      defaultTheme: "furnitureLight",
      themes: {
        furnitureLight: {
          dark: false,
          colors: {
            primary: "#1A1A1A", // Deep Charcoal (Woodmart text)
            secondary: "#757575", // Muted grey for captions
            accent: "#A68B67", // Antique Oak (Action items)
            background: "#F9F8F6", // Linen/Off-white
            surface: "#FFFFFF", // Pure white cards
            "on-surface": "#1A1A1A",
            error: "#B00020",
            info: "#2196F3",
            success: "#4CAF50",
            warning: "#FB8C00",
          },
          variables: {
            "border-color": "#EEEEEE",
            "border-opacity": 0.8,
            "high-emphasis-opacity": 0.9,
            "medium-emphasis-opacity": 0.6,
          },
        },
      },
    },
    defaults: {
      // Woodmart Style: Sharp but slightly rounded (4px - 6px)
      VCard: {
        flat: true,
        rounded: "lg",
        class: "soft-shadow",
      },
      VBtn: {
        rounded: "0", // Woodmart uses sharp buttons for a high-fashion look
        elevation: 0,
        class: "text-uppercase font-weight-bold letter-spacing-1",
        color: "primary",
      },
      VTextField: {
        variant: "outlined",
        density: "comfortable",
        color: "accent",
      },
    },
  });

  // Vue ইন্সট্যান্সে Vuetify যুক্ত করা
  nuxtApp.vueApp.use(vuetify);
});
