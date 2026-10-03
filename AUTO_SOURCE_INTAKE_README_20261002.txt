PromptCraft Research Hub - Automatic Source Intake
October 2, 2026

WHAT CHANGED
- Added Quick add source to the Research Library.
- A source can be analyzed from PDF, DOCX, TXT, RTF, DOI, URL, or file + DOI/URL together.
- DOI metadata is looked up automatically.
- Uploaded papers are text-extracted server-side.
- AI fills a draft source record: citation metadata, research theme, key argument, methodology, PromptCraft connection, likely paper section, tags, page-level notes, and figure/table references when supported by the source.
- Results are staged for review. Nothing is saved until Save source is clicked.
- Selected source files still attach through the existing source-save flow.
- Analyze button locks while running and shows progress to prevent repeated submissions.
- Extracted notes are previewed in a collapsed Review extracted notes area before save.

NETLIFY SETUP
1. Keep PROMPTCRAFT_ADMIN_KEY configured.
2. Add OPENAI_API_KEY in Netlify environment variables.
3. Optional: add PROMPTCRAFT_RESEARCH_MODEL. Default is gpt-6-luna.
4. Redeploy the FULL project root so Netlify installs the new package dependencies.

FILES CHANGED
- package.json
- site/index.html
- site/app.js
- site/style.css

FILE ADDED
- netlify/functions/analyze-source.mjs

NEW NPM DEPENDENCIES
- pdf-parse 1.1.1
- mammoth 1.9.0

NOT CHANGED
- Existing Research Library data
- Development Log data
- Research Plan data
- Project backups
- Paper backups
- Netlify state/backup/image storage contracts

IMPORTANT
Automatic analysis is a drafting aid, not a citation authority. Review the generated fields and page notes against the source before using them in the paper.
