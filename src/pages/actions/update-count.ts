import { getStore } from "@netlify/blobs";
import type { APIRoute } from "astro";

const countTypeUrlMap = {
  function: "/api/function/update-count",
  edgeFunction: "/api/edge-function/update-count",
  astroRoute: "/api/astro-route/update-count",
};

export const POST: APIRoute = async ({ request, url, redirect }) => {
  // Get the type and action from the request body
  const formData = await request.formData();
  const type = formData.get("countType");
  const action = formData.get("action");

  if (!type || !action) {
    return new Response("Bad request", { status: 400 });
  }

  const apiRequestPath = countTypeUrlMap[type as keyof typeof countTypeUrlMap];

  await fetch(new URL(apiRequestPath, url.origin), {
    headers: {
      "Content-Type": "application/json",
      "x-api-key": process.env.API_KEY!,
    },
    method: "POST",
    body: JSON.stringify({ action }),
  });

  // Get function count from the store
  // const store = getStore("Counter");
  // const countBlob = await store.get("functions/count");
  // const count = parseInt(countBlob || "0");
  // console.log("[action update-count] Fetch page count:", count);

  return redirect("/");
};
