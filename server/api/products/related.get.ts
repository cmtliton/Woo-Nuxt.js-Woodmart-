// server/api/products/related.get.ts
export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig(event);
  const query = getQuery(event);
  const ids = query.ids as string; // Comma separated IDs
  console.log("Related product IDs:", ids);
  if (!ids) return [];

  const auth = Buffer.from(`${config.wcKey}:${config.wcSecret}`).toString(
    "base64",
  );

  try {
    return await $fetch(`${config.public.wcUrl}/products`, {
      headers: { Authorization: `Basic ${auth}` },
      query: {
        include: ids,
        status: "publish",
      },
    });
  } catch (error) {
    return [];
  }
});
