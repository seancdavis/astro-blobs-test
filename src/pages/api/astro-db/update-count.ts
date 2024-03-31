import { getStore } from "@netlify/blobs";
import type { APIRoute } from "astro";
import { Count, db, eq } from "astro:db";

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

  // Get the count from Astro DB
  const countRecords = await db
    .select()
    .from(Count)
    .where(eq(Count.id, "count"));
  const currentCount = countRecords.length ? countRecords[0].value : 0;

  // Increment the count
  const newCount =
    body.action === "increment" ? currentCount + 1 : currentCount - 1;

  // Save the new count
  if (countRecords.length) {
    await db
      .update(Count)
      .set({ value: newCount })
      .where(eq(Count.id, "count"));
  } else {
    await db.insert(Count).values({ id: "count", value: newCount });
  }

  // Return the count
  return new Response(JSON.stringify({ count: newCount }), {
    headers: { "Content-Type": "application/json" },
  });
};
