import { getStore } from "@netlify/blobs";

function authorized(req) {
  const expected = process.env.PROMPTCRAFT_ADMIN_KEY;
  const supplied = req.headers.get("x-promptcraft-key") || "";
  return expected && supplied && supplied === expected;
}

const keyFor = (id, index) => `development-image/${id}/chunk-${String(index).padStart(6, "0")}`;

export default async (req) => {
  const store = getStore({ name: "promptcraft-development-images", consistency: "strong" });

  if (req.method === "GET") {
    const u = new URL(req.url);
    const id = u.searchParams.get("imageId");
    const index = Number(u.searchParams.get("index"));
    if (!id || !Number.isInteger(index)) {
      return Response.json({ error: "Missing imageId or index." }, { status: 400 });
    }
    const data = await store.get(keyFor(id, index), { consistency: "strong" });
    if (data == null) return Response.json({ error: "Image chunk not found." }, { status: 404 });
    return Response.json({ data });
  }

  if (req.method === "POST") {
    if (!process.env.PROMPTCRAFT_ADMIN_KEY) {
      return Response.json({ error: "PROMPTCRAFT_ADMIN_KEY is not configured in Netlify." }, { status: 503 });
    }
    if (!authorized(req)) return Response.json({ error: "Invalid admin key." }, { status: 401 });

    const body = await req.json();
    if (body.action === "put") {
      if (!body.imageId || !Number.isInteger(body.index) || typeof body.data !== "string") {
        return Response.json({ error: "Invalid image chunk." }, { status: 400 });
      }
      await store.set(keyFor(body.imageId, body.index), body.data);
      return Response.json({ ok: true });
    }

    if (body.action === "delete") {
      if (!body.imageId || !Number.isInteger(body.chunkCount)) {
        return Response.json({ error: "Invalid delete request." }, { status: 400 });
      }
      for (let i = 0; i < body.chunkCount; i++) await store.delete(keyFor(body.imageId, i));
      return Response.json({ ok: true });
    }

    return Response.json({ error: "Unknown action." }, { status: 400 });
  }

  return new Response("Method not allowed", { status: 405 });
};
