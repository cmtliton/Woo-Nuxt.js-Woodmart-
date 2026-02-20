// https://nuxt.com/docs/api/configuration/nuxt-config

import vuetify, { transformAssetUrls } from "vite-plugin-vuetify";
export default defineNuxtConfig({
  compatibilityDate: "2025-07-15",
  devtools: { enabled: true },
  build: {
    transpile: ["vuetify"],
  },

  modules: [(_options, nuxt) => {
    nuxt.hooks.hook("vite:extendConfig", (config) => {
      // @ts-expect-error
      config.plugins.push(vuetify({ autoImport: true }));
    });
  }, "@pinia/nuxt", "@nuxt/image"],

  vite: {
    vue: {
      template: {
        transformAssetUrls,
      },
    },
  },
  runtimeConfig: {
    wcKey: "",
    wcSecret: "",
    public: {
      wcUrl: "",
    },
  },
  image: {
    domains: ["api.emcfurniture.com"],
    format: ["webp"],
    quality: 80,
    provider: "ipx",
    screens: {
      mobile: 320,
      tablet: 768,
      desktop: 1024,
      wide: 1440,
    },
  },
});