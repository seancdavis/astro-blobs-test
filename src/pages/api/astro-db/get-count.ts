import type { APIRoute } from "astro";

import { Count, db, eq } from "astro:db";

export const GET: APIRoute = async ({ request, url, redirect }) => {
  // Authenticate request with API key
  const apiKey = request.headers.get("x-api-key");
  if (!process.env.API_KEY?.length || apiKey !== process.env.API_KEY) {
    console.error("Unauthorized request");
    return new Response("Unauthorized", { status: 401 });
  }

  // Get the count from Astro DB
  const countRecords = await db
    .select()
    .from(Count)
    .where(eq(Count.id, "count"));
  const count = countRecords.length ? countRecords[0].value : 0;

  // Return the count
  return new Response(JSON.stringify({ count }), {
    headers: { "Content-Type": "application/json" },
  });
};
