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
