import { getStore } from "@netlify/blobs";
import type { Config } from "@netlify/functions";

export default async (request: Request) => {
  // Only allow GET requests
  if (request.method !== "GET") {
    console.error("Did not receive a GET request");
    return new Response("Not found", { status: 404 });
  }

  // Authenticate request with API key
  const apiKey = request.headers.get("x-api-key");
  if (!process.env.API_KEY?.length || apiKey !== process.env.API_KEY) {
    console.error("Unauthorized request");
    return new Response("Unauthorized", { status: 401 });
  }

  // Get the count from the store
  const store = getStore("Counter");
  const countBlob = await store.get("functions/count");
  const count = parseInt(countBlob || "0");

  // Return the count
  return new Response(JSON.stringify({ count }), {
    headers: { "Content-Type": "application/json" },
  });
};

export const config: Config = {
  path: "/api/function/get-count",
};
