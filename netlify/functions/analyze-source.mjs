import { getStore } from "@netlify/blobs";

function authorized(req) {
  const expected = process.env.PROMPTCRAFT_ADMIN_KEY;
  const supplied = req.headers.get("x-promptcraft-key") || "";
  return expected && supplied && supplied === expected;
}

function cleanText(value = "") {
  return String(value || "")
    .replace(/<script[\s\S]*?<\/script>/gi, " ")
    .replace(/<style[\s\S]*?<\/style>/gi, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/gi, " ")
    .replace(/&amp;/gi, "&")
    .replace(/&quot;/gi, '"')
    .replace(/&#39;/gi, "'")
    .replace(/\s+/g, " ")
    .trim();
}

function extractDoi(value = "") {
  const m = String(value || "").match(/10\.\d{4,9}\/[-._;()/:A-Z0-9]+/i);
  return m ? m[0].replace(/[).,;]+$/g, "") : "";
}

function first(v) { return Array.isArray(v) ? (v[0] || "") : (v || ""); }
function crossrefDate(m = {}) {
  const p = m.published?.["date-parts"]?.[0] || m.issued?.["date-parts"]?.[0] || m.created?.["date-parts"]?.[0];
  return Array.isArray(p) && p.length ? p.filter(Boolean).join("-") : "";
}
function crossrefAuthors(list = []) {
  return (list || []).map(a => [a.given, a.family].filter(Boolean).join(" ")).filter(Boolean).join(", ");
}

async function crossrefLookup(input) {
  const doi = extractDoi(input);
  if (!doi) return null;
  try {
    const r = await fetch(`https://api.crossref.org/works/${encodeURIComponent(doi)}`, {
      headers: { "User-Agent": "PromptCraftResearchHub/1.0" }
    });
    if (!r.ok) return { doi, url: `https://doi.org/${doi}` };
    const m = (await r.json())?.message || {};
    return {
      doi,
      title: first(m.title),
      authors: crossrefAuthors(m.author),
      date: crossrefDate(m),
      publisher: first(m["container-title"]) || m.publisher || "",
      url: `https://doi.org/${doi}`,
      abstract: cleanText(m.abstract || ""),
      sourceType: m.type === "book" || m.type === "book-chapter" ? "Book / Chapter" : "Article / PDF"
    };
  } catch {
    return { doi, url: `https://doi.org/${doi}` };
  }
}

function metaContent(html, names) {
  for (const name of names) {
    const safe = name.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const a = html.match(new RegExp(`<meta[^>]+(?:name|property)=["']${safe}["'][^>]+content=["']([^"']+)["'][^>]*>`, "i"));
    if (a) return cleanText(a[1]);
    const b = html.match(new RegExp(`<meta[^>]+content=["']([^"']+)["'][^>]+(?:name|property)=["']${safe}["'][^>]*>`, "i"));
    if (b) return cleanText(b[1]);
  }
  return "";
}

async function urlLookup(input) {
  if (!/^https?:\/\//i.test(String(input || "").trim())) return null;
  try {
    const r = await fetch(String(input).trim(), { headers: { "User-Agent": "Mozilla/5.0 PromptCraftResearchHub/1.0" }, redirect: "follow" });
    if (!r.ok) return { url: String(input).trim() };
    const type = r.headers.get("content-type") || "";
    if (!type.includes("text/html")) return { url: r.url || String(input).trim() };
    const html = await r.text();
    const authorMatches = [...html.matchAll(/<meta[^>]+name=["']citation_author["'][^>]+content=["']([^"']+)["'][^>]*>/gi)].map(m => cleanText(m[1])).filter(Boolean);
    const doi = metaContent(html, ["citation_doi", "dc.identifier"]);
    return {
      title: metaContent(html, ["citation_title", "og:title", "dc.title"]),
      authors: authorMatches.join(", ") || metaContent(html, ["author", "dc.creator"]),
      date: metaContent(html, ["citation_publication_date", "citation_date", "article:published_time", "dc.date"]),
      publisher: metaContent(html, ["citation_journal_title", "citation_publisher", "og:site_name", "dc.publisher"]),
      url: doi ? `https://doi.org/${doi}` : (r.url || String(input).trim()),
      doi: extractDoi(doi),
      abstract: metaContent(html, ["citation_abstract", "description", "og:description", "dc.description"]),
      pageText: cleanText(html).slice(0, 60000)
    };
  } catch {
    return { url: String(input).trim() };
  }
}

async function readCloudFile(file) {
  if (!file?.backupId || !Number.isInteger(file.chunkCount) || file.chunkCount < 1) return null;
  const store = getStore({ name: "promptcraft-backups", consistency: "strong" });
  const parts = [];
  for (let i = 0; i < file.chunkCount; i++) {
    const key = `backup/${file.backupId}/chunk-${String(i).padStart(6, "0")}`;
    const data = await store.get(key, { consistency: "strong" });
    if (data == null) throw new Error(`Temporary source chunk ${i + 1} was not found.`);
    parts.push(Buffer.from(data, "base64"));
  }
  return Buffer.concat(parts);
}

async function extractPdf(buffer) {
  // The package entry point runs a debug PDF read when bundled by esbuild.
  const mod = await import("pdf-parse/lib/pdf-parse.js");
  const pdf = mod.default || mod;
  let pageNo = 0;
  const pagerender = async pageData => {
    pageNo += 1;
    const tc = await pageData.getTextContent({ normalizeWhitespace: false, disableCombineTextItems: false });
    let lastY = null, text = "";
    for (const item of tc.items || []) {
      const y = item.transform?.[5];
      if (lastY === null || y === lastY) text += `${item.str || ""} `;
      else text += `\n${item.str || ""} `;
      lastY = y;
    }
    return `\n--- PAGE ${pageNo} ---\n${text.trim()}\n`;
  };
  const out = await pdf(buffer, { pagerender, max: 0 });
  return String(out.text || "").trim();
}

async function extractDocx(buffer) {
  const mammoth = await import("mammoth");
  const out = await (mammoth.default || mammoth).extractRawText({ buffer });
  return String(out.value || "").trim();
}

function stripRtf(text) {
  return String(text || "")
    .replace(/\\par[d]?/g, "\n")
    .replace(/\\'[0-9a-fA-F]{2}/g, " ")
    .replace(/\\[a-zA-Z]+-?\d* ?/g, "")
    .replace(/[{}]/g, "")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

async function extractFileText(buffer, fileName = "", mimeType = "") {
  const lower = String(fileName || "").toLowerCase();
  if (lower.endsWith(".pdf") || mimeType.includes("pdf")) return extractPdf(buffer);
  if (lower.endsWith(".docx") || mimeType.includes("wordprocessingml")) return extractDocx(buffer);
  if (lower.endsWith(".rtf") || mimeType.includes("rtf")) return stripRtf(buffer.toString("utf8"));
  if (lower.endsWith(".txt") || mimeType.startsWith("text/")) return buffer.toString("utf8");
  throw new Error("Automatic analysis currently supports PDF, DOCX, TXT, and RTF files.");
}

function apaFromMeta(m = {}) {
  if (!m.title) return "";
  const author = m.authors || "";
  const year = String(m.date || "").match(/\d{4}/)?.[0] || "n.d.";
  const pub = m.publisher ? ` ${m.publisher}.` : "";
  const url = m.url ? ` ${m.url}` : "";
  return `${author ? author + " " : ""}(${year}). ${m.title}.${pub}${url}`.replace(/\s+/g, " ").trim();
}

function mergeMeta(a = {}, b = {}) {
  const out = { ...a };
  for (const [k, v] of Object.entries(b || {})) if (v && (!out[k] || k === "pageText")) out[k] = v;
  return out;
}

function extractOutputText(data) {
  const parts = [];
  for (const item of data?.output || []) for (const c of item?.content || []) if (c?.type === "output_text" && c.text) parts.push(c.text);
  return parts.join("\n").trim();
}

function parseJsonLoose(text = "") {
  let t = String(text || "").trim().replace(/^```(?:json)?\s*/i, "").replace(/```$/i, "").trim();
  const start = t.indexOf("{"); const end = t.lastIndexOf("}");
  if (start >= 0 && end > start) t = t.slice(start, end + 1);
  return JSON.parse(t);
}

async function analyzeWithOpenAI({ metadata, documentText, themes, paperSections }) {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) return { analysisAvailable: false, warning: "OPENAI_API_KEY is not configured. Bibliographic fields were filled where possible; article analysis was skipped." };
  const model = process.env.PROMPTCRAFT_RESEARCH_MODEL || "gpt-6-luna";
  const source = String(documentText || metadata.pageText || metadata.abstract || "").slice(0, 140000);
  if (!source) return { analysisAvailable: false, warning: "No article text or abstract was available for AI analysis. Bibliographic fields were filled where possible." };
  const instructions = `You are assisting with a scholarly research library for PromptCraft, a scenario-based professional-learning environment for educators focused on AI-supported instructional decision-making, professional judgment, authentic Canvas course-design problems, accessibility, assessment, feedback, metacognition, critical evaluation, and human-AI collaboration.\n\nAnalyze only the supplied source text and metadata. Do not invent missing bibliographic facts, findings, methods, page numbers, quotations, or claims. If evidence is missing, return an empty string or empty array. Page numbers may be used only when the source text includes explicit markers like --- PAGE 12 ---. For DOCX/TXT/HTML without page markers, use a section/heading when clearly available or leave location blank. Keep notes concise and useful for writing a professional paper. Direct quotes must be exact and under 25 words; otherwise paraphrase. Return only valid JSON, no markdown.`;
  const input = `AVAILABLE RESEARCH THEMES:\n${(themes || []).join("\n")}\n\nAVAILABLE PAPER SECTIONS:\n${(paperSections || []).join("\n")}\n\nKNOWN METADATA:\n${JSON.stringify(metadata, null, 2)}\n\nSOURCE TEXT:\n${source}\n\nReturn this JSON shape exactly:\n{\n  "title":"", "authors":"", "date":"", "publisher":"", "apa":"", "url":"", "sourceType":"",\n  "theme":"", "priority":"High|Medium|Low", "keyArgument":"", "connection":"", "methodology":"", "paperSection":"",\n  "tags":[],\n  "notes":[{"location":"", "type":"Key finding|Direct quote|Paraphrase|Definition|Method / measure|Limitation|Figure / diagram|Table / data|Paper idea|Other", "text":"", "interpretation":"", "paperUse":"", "tags":[]}],\n  "figures":[{"location":"", "type":"Figure / diagram|Table / data", "title":"", "relevance":"", "paperUse":""}]\n}`;
  const r = await fetch("https://api.openai.com/v1/responses", {
    method: "POST",
    headers: { "Authorization": `Bearer ${apiKey}`, "Content-Type": "application/json" },
    body: JSON.stringify({ model, instructions, input, max_output_tokens: 4500, store: false })
  });
  const data = await r.json().catch(() => ({}));
  if (!r.ok) throw new Error(data?.error?.message || `OpenAI analysis failed (${r.status}).`);
  const text = extractOutputText(data);
  if (!text) throw new Error("OpenAI returned no source analysis.");
  const parsed = parseJsonLoose(text);
  return { analysisAvailable: true, model, ...parsed };
}

export default async (req) => {
  if (req.method !== "POST") return new Response("Method not allowed", { status: 405 });
  if (!process.env.PROMPTCRAFT_ADMIN_KEY) return Response.json({ error: "PROMPTCRAFT_ADMIN_KEY is not configured in Netlify." }, { status: 503 });
  if (!authorized(req)) return Response.json({ error: "Invalid admin key." }, { status: 401 });
  try {
    const body = await req.json();
    const input = String(body.lookup || "").trim();
    let metadata = {};
    if (input) {
      metadata = mergeMeta(metadata, await crossrefLookup(input));
      if (!metadata.title && /^https?:\/\//i.test(input)) metadata = mergeMeta(metadata, await urlLookup(input));
      if (!metadata.url) metadata.url = input;
    }
    let documentText = "";
    if (body.file?.backupId) {
      const buffer = await readCloudFile(body.file);
      documentText = await extractFileText(buffer, body.file.fileName, body.file.mimeType || "");
    }
    const ai = await analyzeWithOpenAI({ metadata, documentText, themes: body.themes || [], paperSections: body.paperSections || [] });
    const merged = { ...metadata, ...ai };
    if (!merged.apa) merged.apa = apaFromMeta(merged);
    return Response.json({ ok: true, result: merged, extractedCharacters: documentText.length });
  } catch (err) {
    console.error("analyze-source", err);
    return Response.json({ error: err?.message || "Could not analyze source." }, { status: 500 });
  }
};
