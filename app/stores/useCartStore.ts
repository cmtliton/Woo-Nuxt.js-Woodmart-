import { defineStore } from "pinia";

// 1. Types for Cart Management
export interface CartItem {
  id: number;
  databaseId: number; // WooCommerce Product ID
  name: string;
  slug: string;
  price: number;
  regularPrice?: number;
  image: string;
  quantity: number;
  variation?: Record<string, string>;
}

export const useCartStore = defineStore("cart", () => {
  // 2. State
  const items = ref<CartItem[]>([]);
  const isDrawerOpen = ref(false);

  // 3. Getters (Computed)
  const count = computed(() =>
    items.value.reduce((acc, item) => acc + item.quantity, 0),
  );

  const subtotal = computed(() =>
    items.value.reduce((acc, item) => acc + item.price * item.quantity, 0),
  );
  const total = computed(() => {
    const taxRate = 0.1; // 10% tax
    const taxAmount = subtotal.value * taxRate;
    return subtotal.value + taxAmount;
  });
  const formattedTotal = computed(() =>
    new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(subtotal.value),
  );

  // 4. Actions

  /**
   * Adds an item to the cart.
   * If item exists, increments quantity.
   */
  function addItem(product: any) {
    const existingItem = items.value.find((item) => item.id === product.id);

    if (existingItem) {
      existingItem.quantity++;
    } else {
      items.value.push({
        id: product.id,
        databaseId: product.id,
        name: product.name,
        slug: product.slug,
        price: parseFloat(product.price),
        regularPrice: parseFloat(product.regular_price),
        image: product.image || product.images?.[0]?.src,
        quantity: 1,
        variation: product.variation || null,
      });
    }

    // Woodmart UX: Open the side drawer automatically when adding
    isDrawerOpen.value = true;
    saveToLocalStorage();
  }

  function removeItem(id: number) {
    items.value = items.value.filter((item) => item.id !== id);
    saveToLocalStorage();
  }

  function updateQuantity(id: number, quantity: number) {
    const item = items.value.find((item) => item.id === id);
    if (item) {
      item.quantity = Math.max(1, quantity);
      saveToLocalStorage();
    }
  }

  function clearCart() {
    items.value = [];
    saveToLocalStorage();
  }

  function toggleDrawer(val?: boolean) {
    isDrawerOpen.value = val !== undefined ? val : !isDrawerOpen.value;
  }

  // 5. Persistence Logic (Client-side only)
  function saveToLocalStorage() {
    if (process.client) {
      localStorage.setItem("woodmart_cart", JSON.stringify(items.value));
    }
  }

  function loadFromLocalStorage() {
    if (process.client) {
      const saved = localStorage.getItem("woodmart_cart");
      if (saved) {
        try {
          items.value = JSON.parse(saved);
        } catch (e) {
          console.error("Failed to parse cart data", e);
        }
      }
    }
  }

  // Initialize cart on store creation
  if (process.client) {
    loadFromLocalStorage();
  }

  return {
    items,
    isDrawerOpen,
    count,
    total,
    subtotal,
    formattedTotal,
    addItem,
    removeItem,
    updateQuantity,
    clearCart,
    toggleDrawer,
  };
});
