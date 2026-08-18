import { getStore } from "@netlify/blobs";

function authorized(req) {
  const expected = process.env.PROMPTCRAFT_ADMIN_KEY;
  const supplied = req.headers.get("x-promptcraft-key") || "";
  return expected && supplied && supplied === expected;
}

export default async (req) => {
  const store = getStore({ name: "promptcraft-hub", consistency: "strong" });

  // Read access is intentionally public so every browser/device that can open
  // the Hub sees the same current cloud state without storing an admin key.
  if (req.method === "GET") {
    const state = await store.get("state", { type: "json", consistency: "strong" });
    return Response.json({ initialized: !!state, state: state || null });
  }

  // Mutating the shared state remains protected.
  if (req.method === "POST") {
    if (!process.env.PROMPTCRAFT_ADMIN_KEY) {
      return Response.json({ error: "PROMPTCRAFT_ADMIN_KEY is not configured in Netlify." }, { status: 503 });
    }
    if (!authorized(req)) return Response.json({ error: "Invalid admin key." }, { status: 401 });
    const body = await req.json();
    if (!body.state || typeof body.state !== "object") return Response.json({ error: "Missing state." }, { status: 400 });
    await store.setJSON("state", body.state);
    return Response.json({ ok: true });
  }

  return new Response("Method not allowed", { status: 405 });
};
