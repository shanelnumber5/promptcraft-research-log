# PromptCraft Research & Development Hub

This build combines the PromptCraft development log, research source tracker, research planning sheets, and milestone project backups into one browser-based hub.

## Included data

- 26 development log entries from `PromptCraft_Research_Log(1).docx`
- 16 populated research sources from `PromptCraft_Research_Tracker_v2.xlsx`
- Themes Map, Dissertation Outline, and Reading Schedule from the research tracker
- Original source PDFs and research files in `archive/source-files/` for offline safekeeping. **That archive folder is not published by Netlify.**

## Storage modes

### Local browser mode
The site works immediately by opening `site/index.html`. Text data is saved in localStorage and uploaded project snapshot files are saved in IndexedDB. This is convenient, but it is tied to that browser/device.

### Netlify cloud mode
The included Netlify Functions use Netlify Blobs for persistent site-wide storage. Netlify documents site-wide blob stores as persistent across new deploys. Project files are uploaded in 2.5 MB chunks to stay below ordinary Function request limits.

1. Create a new Netlify project from this folder/repository.
2. In Netlify, add an environment variable named `PROMPTCRAFT_ADMIN_KEY` and give it a strong private value.
3. Deploy. Netlify will install `@netlify/blobs` from `package.json`.
4. Open the deployed site, choose **Connect cloud**, and enter the same admin key.
5. On first connection the site initializes cloud storage from the built-in seed/local data.

## Security note

The admin key protects write/read API calls, but this is intentionally a lightweight private project tool, not a multi-user authentication system. Keep the site private or use Netlify access controls if the content should not be public. The PDFs in `archive/` are outside the publish directory and are not exposed by the website.

## Backup source control

The Project Backups tab stores milestone files and calculates a SHA-256 checksum. It can also automatically create a linked development-log entry. This is a second-copy archive, not a replacement for Git's line-by-line history, branches, or merge support.

## Research source folders

The offline research archive is organized to match the Research Library in the site:

- AI Literacy & Prompt Engineering
- AI Overreliance & Critical Evaluation
- Game-Based & Simulation Learning
- Instructional Design & OSCQR
- Synchronous vs Asynchronous Design

The development log and research tracker are stored separately under `archive/project-records/` so they are not mixed with scholarly source PDFs.

## Data repair and preservation

This build uses a non-destructive data merge. When the site opens, the complete built-in PromptCraft research/development dataset is merged with any existing browser or Netlify state. Missing base entries, detailed source summaries, PromptCraft connections, methodology notes, quotes, themes-map content, outline content, and reading-plan items are restored automatically. Existing user-created records and non-empty user edits are preserved. For the five base research-source folders, the canonical folder/category and archive path are refreshed so the organized library remains consistent.


## August 12 runtime repair
Fixed the missing `SOURCE_FOLDERS` JavaScript constant that stopped rendering after the source-folder reorganization. Added cache-busting script versions and an explicit seed-data load error. Verified in this build: 26 development entries and 16 research sources.


## Cloud-first synchronization update — August 18, 2026

This build treats the Netlify state store as the shared source of truth when a valid
`PROMPTCRAFT_ADMIN_KEY` is connected.

### What changed
- The admin key can be remembered on each trusted device.
- The site automatically syncs on startup and when the browser regains focus.
- Saving a log entry or research source writes locally first, then merges with the latest cloud state before updating Netlify.
- Local-only and cloud-only records are merged instead of one copy blindly overwriting the other.
- New edits receive timestamps so the newer edit wins during later syncs.
- Deletions use tombstones so a deleted record is not resurrected by an older computer.
- Locally stored project-backup files are automatically migrated to Netlify Blobs when that original browser reconnects to cloud storage.
- If Netlify is temporarily unavailable, work remains in local storage and is marked pending until the next successful sync.

### Important one-time migration
On the computer that currently contains your newest local Research Log entries:
1. Deploy this build to Netlify.
2. Open the deployed Hub on that computer.
3. Click **Connect cloud**, enter the same `PROMPTCRAFT_ADMIN_KEY`, leave **Remember key on this device** checked, and choose **Connect & merge**.
4. Wait until the badge reads **Cloud synced**.
5. Open the Hub on the second computer, connect with the same admin key once, and its copy will merge with the cloud state.

Do not clear browser storage on the original computer until the first cloud merge has completed.

## Automatic source intake — October 2, 2026

The Research Library can now build a draft source record directly from a PDF/DOCX/TXT/RTF file, a DOI, or an article URL.

### One-time setup

1. Keep `PROMPTCRAFT_ADMIN_KEY` configured as before.
2. Add a Netlify environment variable named `OPENAI_API_KEY` containing the API key used for research-source analysis.
3. Optional: set `PROMPTCRAFT_RESEARCH_MODEL` to choose a different model. If omitted, the analyzer uses `gpt-6-luna`.
4. Redeploy the full project root. Netlify must install the dependencies in `package.json`, including `pdf-parse` and `mammoth`.
5. Open the deployed Hub and connect with the admin key.

### Using it

1. Open **Research Library** and choose **Add source**.
2. In **Quick add source**, either choose a PDF/DOCX/TXT/RTF paper, paste a DOI/article URL, or provide both.
3. Click **Analyze & fill source** once. The button disables and reports progress while the paper is processed.
4. Review the filled citation fields, optional research fields, and the expandable extracted-notes preview.
5. Correct anything that needs human review, then click **Save source**. The selected paper is attached at that point.

The analyzer never saves the source automatically. It is instructed not to invent missing bibliographic facts, findings, page numbers, or methods. If `OPENAI_API_KEY` is not configured, DOI/URL metadata can still be filled where available, but article analysis is skipped.

### Privacy

For uploaded papers, the browser temporarily sends the file to the Hub's protected Netlify Blob storage so the server-side function can extract text. The temporary analysis copy is deleted after the analysis request. Extracted source text is then sent to the OpenAI Responses API configured for the Hub. The permanent Research Library copy is not created until **Save source** is clicked.
