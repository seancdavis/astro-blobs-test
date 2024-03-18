import { getStore } from "@netlify/blobs";
import type { APIRoute } from "astro";

export const POST: APIRoute = async ({ request, url, redirect }) => {
  // Authenticate request with API key
  const apiKey = request.headers.get("x-api-key");
  if (!process.env.API_KEY?.length || apiKey !== process.env.API_KEY) {
    return new Response("Unauthorized", { status: 401 });
  }

  // Determine action from the request body
  const body = await request.json();
  if (!body.action) {
    return new Response("Bad request", { status: 400 });
  }
  if (!["increment", "decrement"].includes(body.action)) {
    return new Response("Bad request", { status: 400 });
  }

  // Get the count from the store
  const store = getStore({ name: "Counter", consistency: "strong" });
  const countBlob = await store.get("astro-route/count");
  const currentCount = parseInt(countBlob || "0");

  // Increment the count
  const newCount =
    body.action === "increment" ? currentCount + 1 : currentCount - 1;

  // Save the new count
  await store.set("astro-route/count", newCount.toString());

  // Return the count
  return new Response(JSON.stringify({ count: newCount }), {
    headers: { "Content-Type": "application/json" },
  });
};
