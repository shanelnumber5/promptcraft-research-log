PromptCraft Research & Development Hub — Consolidated Build
Date: 2026-10-01

Purpose
This build consolidates the current Hub after the recent Research Library, citation, source navigation, and paper-backup changes. It is intended to replace the patch-stacked deployed build.

Functional fixes in this consolidation
1. Source records save independently of document uploads.
   - A failed document upload no longer prevents a new source/citation record from being saved.
   - Existing primary document bytes are not deleted until a replacement upload has completed successfully.

2. File uploads have a local fallback.
   - When cloud file upload fails, the file is preserved in IndexedDB locally and marked for later cloud migration.
   - Applies to source documents/materials and paper/project backups that use the shared backup storage path.

3. Browser persistence is more defensive.
   - Local-storage failures no longer silently derail cloud-connected saves.
   - If neither local nor cloud persistence is available, the Hub shows an actionable error instead of pretending the save completed.

4. IndexedDB initialization is safer.
   - The local file store is upgraded defensively and only created when missing.

5. Paper backup handling reports missing files and fallback behavior clearly.

6. Cache version bumped to app.js?v=20261001-consolidated1.

Validation performed
- JavaScript syntax check passed with Node.
- Headless browser QA passed for:
  * add new source without a file
  * add new source with a primary document
  * edit/rename an existing source and update APA reference
  * add a page-level annotation
  * save a professional-paper backup
- No runtime errors occurred in the QA paths above.

Deployment
Deploy this project root, not only the site folder. Netlify needs the netlify/functions directory for cloud state and file storage.

Data safety
This build does not intentionally rewrite or delete existing Research Library sources, Development Log entries, Research Plan records, project backups, paper backups, or research source files. Existing cloud data remains authoritative when cloud sync is connected.
