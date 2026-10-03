PromptCraft Research & Development Hub
Consolidated save/upload fix - 2026-10-02

This build is intended to replace the prior 2026-10-01 consolidated build as a whole.

What changed
------------
1. New research sources no longer depend on hidden browser validation.
   - Article/source name is no longer a native required field when a document is selected.
   - Selecting a document automatically fills the article/source name from the filename if the field is blank.
   - A source still needs either a title or a selected document, but the app now explains that with a visible message instead of the browser silently blocking submission.

2. DOI / URL entry no longer silently blocks Save Source.
   - The URL/DOI field is now a normal text field instead of HTML type=url.
   - Raw DOI values such as 10.1234/example are accepted and normalized to https://doi.org/10.1234/example on save.

3. Source metadata saves before document storage.
   - The citation/source record is persisted first.
   - A PDF/Word upload failure can no longer prevent the source record itself from being created.
   - If the file fails, the source editor remains open so the document can be retried without re-entering the citation.

4. Replacing a source document is safer.
   - The replacement file is stored first.
   - The previous file is deleted only after the replacement record has been saved.

5. Supporting attachment replacement uses the same safe order.

6. Paper backups are easier to add.
   - Paper version and milestone/title are no longer native required fields.
   - Choosing a paper file automatically fills a working-draft version and title when those fields are blank.
   - The filename becomes the default title.

7. Existing 2026-10-01 resilience fixes remain in place.
   - Source metadata/file separation
   - cloud upload -> IndexedDB local fallback
   - safer IndexedDB initialization
   - explicit browser-storage errors

Cache marker
------------
site/index.html now loads:
  app.js?v=20261002-saveflow2

Deployment
----------
Deploy the entire project root, not only /site, so the Netlify functions remain available.

No research records, seed data, Development Log entries, Research Plan content, or stored cloud data are intentionally migrated or deleted by this build.
