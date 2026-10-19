/* Source organization only: file bytes, IDs, annotations and backups stay in place. */
(function (root) {
  const categories = [
    'Instructional-Design Reasoning & Course Redesign',
    'Professional Learning, Feedback & Reflection',
    'Critical AI Collaboration & Educator Agency',
    'Scenario-Based Learning & Purposeful Creativity',
    'Background / Archive'
  ];
  const groups = [
    ['Instructional Design & OSCQR', 'Instructional Design, Canvas, Accessibility & OSCQR', 'Synchronous vs Asynchronous Design'],
    ['Professional Development Design', 'Educator Professional Development & Transfer to Practice', 'Metacognition & Online Learning', 'Metacognition, Reflection & Learning Transfer'],
    ['AI Literacy & Prompt Engineering', 'Educator AI Literacy & Critical Evaluation', 'AI Overreliance & Critical Evaluation', 'Professional Judgment, Agency & Human-AI Decision Making'],
    ['Game-Based & Simulation Learning', 'Authentic Scenario-Based & Game-Based Professional Learning'],
    ['Research Instrumentation, Process Data & Validity', 'Mixed Methods Action Research & Iterative Design', 'Research Methodology']
  ];
  const copy = value => JSON.parse(JSON.stringify(value));
  function authorInfo(value) {
    const raw = String(value || '').trim();
    const isEtAl = /\bet\s+al\.?/i.test(raw);
    const text = raw.replace(/\bet\s+al\.?,?/ig, '').replace(/\s*\((?:19|20)\d{2}[a-z]?\)\s*$/i, '').trim();
    const organization = /\b(university|college|institute|association|society|council|department|agency|foundation|commission|committee|ministry|government|digital promise|openai)\b/i;
    const surname = part => {
      const v = part.trim().replace(/^[,&\s]+|[,.\s]+$/g, '');
      if (organization.test(v)) return v;
      if (v.includes(',')) return v.split(',')[0].trim();
      const words = v.split(/\s+/).filter(Boolean);
      while (words.length > 1 && /^(jr\.?|sr\.?|ii|iii|iv)$/i.test(words.at(-1))) words.pop();
      let i = words.length - 1;
      while (i > 0 && /^(da|de|del|della|der|di|dos|du|la|le|van|von|den|ten|ter)$/i.test(words[i-1])) i--;
      return words.slice(i).join(' ');
    };
    const parts = text.split(/\s*(?:;|\||\r?\n)\s*|\s+(?:&|and)\s+/i).filter(Boolean);
    const names = [];
    for (const part of parts) {
      if (organization.test(part)) { names.push(part.trim()); continue; }
      const tokens = part.split(/\s*,\s*/).filter(Boolean);
      // Resolve every inverted-name pair, including a list preceding an ampersand.
      const initials = /^(?:[A-ZÀ-ÖØ-Þ]\.?\s*)+$/u;
      if (tokens.length > 1 && tokens.length % 2 === 0 && tokens.every((t, i) => i % 2 === 0 || initials.test(t))) {
        for (let i = 0; i < tokens.length; i += 2) names.push(tokens[i]);
      } else if (tokens.length === 2 && !/\s/.test(tokens[0].trim())) {
        names.push(tokens[0]);
      } else for (const token of tokens) { const name = surname(token); if (name) names.push(name); }
    }
    return { surnames: names, count: isEtAl ? Math.max(3, names.length) : names.length, isEtAl };
  }
  function category(value, source = {}) {
    if (/Examining Faculty Perceptions of Distance Course Quality Review Feedback/i.test(source.title || '')) return categories[1];
    if (/Developing Asynchronous Workshop/i.test(source.title || '')) return categories[1];
    if (categories.includes(value)) return value;
    const index = groups.findIndex(list => list.includes(value));
    return categories[index < 0 ? 4 : index];
  }
  function unionArchives(...lists) {
    const seen = new Set();
    return lists.flat().filter(item => {
      const key = JSON.stringify(item);
      if (seen.has(key)) return false;
      seen.add(key); return true;
    }).map(copy);
  }
  function migrate(input) {
    const x = copy(input || {});
    x.meta = x.meta || {};
    x.researchArchives = x.researchArchives || [];
    const firstCleanup = !x.meta.libraryCleanupVersion;
    const lateLegacySources = !firstCleanup && (x.sources || []).some(s => !s.libraryCleanupVersion);
    if (firstCleanup || lateLegacySources) {
      const snapshot = copy(x);
      delete snapshot.researchArchives;
      x.researchArchives = unionArchives(x.researchArchives, [{
        reason: firstCleanup ? 'Before instructional-design research cleanup' : 'Additional original sources before cleanup', version: 1, state: snapshot
      }]);
      if (firstCleanup) x.paperUses = [];
      x.meta.libraryCleanupVersion = 1;
    }
    for (const s of x.sources || []) {
      if (s.libraryCleanupVersion) continue;
      s.previousTheme = s.theme || '';
      s.theme = category(s.theme, s);
      for (const key of ['title', 'publisher']) if (typeof s[key] === 'string') s[key] = s[key].replace(/\s+/g, ' ').trim();
      if (typeof s.authors === 'string') s.authors = s.authors.replace(/,?\s*\r?\n\s*/g, '; ').trim();
      if (s.url) s.url = String(s.url).trim().replace(/^(?:doi:\s*|https?:\/\/dx\.doi\.org\/)?(10\.\d{4,9}\/.*)$/i, 'https://doi.org/$1');
      const tags = Array.isArray(s.tags) ? s.tags : String(s.tags || '').split(/[,;]/);
      s.tags = [...new Set(tags.filter(t => !groups.flat().includes(t)).map(t => String(t).trim()).filter(Boolean))];
      s.paperSection = '';
      if (s.status === 'Cited') s.status = 'Read';
      for (const a of s.annotations || []) {
        if (a.paperUse) a.previousPaperUse = a.paperUse;
        a.paperUse = '';
      }
      const warnings = [];
      if (/AI Literacy: A Framework|Developing Asynchronous Workshop|Applications and Learning Outcomes/i.test(s.title || '')) warnings.push('Author order differs between imported authors and the stored reference. Verify against the publication.');
      if (/Risks of Human Overreliance/i.test(s.title || '')) warnings.push('Imported authors and reference disagree on authorship and title. Verify the original publication and source type.');
      if (/Introduction to Game-Based Learning/i.test(s.title || '')) warnings.push('The reference names the book rather than this chapter. Verify chapter authors, editors, pages and DOI.');
      if (!s.apa) warnings.push('Full reference needs review.');
      s.citationReview = warnings;
      s.libraryCleanupVersion = 1;
    }
    return x;
  }
  root.PromptCraftLibrary = { categories, category, migrate, unionArchives, authorInfo };
})(globalThis);
