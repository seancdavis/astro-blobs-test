import { getStore } from "@netlify/blobs";
import type { APIRoute } from "astro";

export const GET: APIRoute = async ({ request, url, redirect }) => {
  // Authenticate request with API key
  const apiKey = request.headers.get("x-api-key");
  if (!process.env.API_KEY?.length || apiKey !== process.env.API_KEY) {
    console.error("Unauthorized request");
    return new Response("Unauthorized", { status: 401 });
  }

  // Get the count from the store
  const store = getStore({ name: "Counter", consistency: "strong" });
  const countBlob = await store.get("astro-route/count");
  const count = parseInt(countBlob || "0");

  // Return the count
  return new Response(JSON.stringify({ count }), {
    headers: { "Content-Type": "application/json" },
  });
};
