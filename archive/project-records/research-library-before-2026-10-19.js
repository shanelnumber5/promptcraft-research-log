window.PROMPTCRAFT_SEED = {
  "logs": [
    {
      "phase": "Conceptualization",
      "date": "April 24, 2026",
      "title": "PromptCraft concept originated",
      "what": "Workshopped the core dissertation idea: a game-based professional learning environment (PromptCraft) designed to train rural and distance educators in effective AI use through iterative prompting practice. Identified OSCQR rubric alignment as the central measurement framework. Mapped the full dissertation arc, target population, and research methodology direction.",
      "why": "The problem space emerged from my dual position as an instructional designer at GFCMSU and an educator with K-12 rural Montana experience — I saw firsthand that rural and distance educators lack structured AI training. OSCQR was the natural measurement anchor because it is already embedded in my daily instructional design work.",
      "tags": [
        "OSCQR",
        "rural educators",
        "game-based learning",
        "dissertation concept",
        "AI literacy"
      ]
    },
    {
      "phase": "Conceptualization",
      "date": "April 24, 2026",
      "title": "Dissertation arc and Canvas implementation strategy mapped",
      "what": "Determined that PromptCraft would be implemented via Canvas LMS with Claude API integration, enabling it to function as a Canvas-embeddable module. Mapped the full research study design: mixed methods, pre/post intervention, small population at GFCMSU, with qualitative reflection data alongside quantitative OSCQR-aligned scoring.",
      "why": "Canvas LMS was the obvious platform choice because GFCMSU already runs Canvas, lowering the barrier to deployment and IRB approval. The Claude API integration was critical — it allows real-time, scored prompting practice rather than static scenario walkthroughs.",
      "tags": [
        "Canvas LMS",
        "Claude API",
        "mixed methods",
        "GFCMSU",
        "IRB",
        "research design"
      ]
    },
    {
      "phase": "Prototype",
      "date": "April 24, 2026",
      "title": "First HTML prototype built — dark-mode gaming aesthetic (v1)",
      "what": "Built the first functional HTML prototype of PromptCraft with a dark-mode gaming aesthetic. Featured three instructional scenarios (Engagement, Differentiation, Assessment), real-time prompt scoring, OSCQR alignment indicators, XP progression system, and embedded live Claude API calls. Confirmed technical feasibility of the intervention.",
      "why": "Starting with a working prototype rather than wireframes let us test the Claude API integration, the scoring rubric logic, and the scenario system simultaneously. The dark-mode gaming aesthetic was the first design direction tried.",
      "tags": [
        "prototype",
        "dark mode",
        "Claude API",
        "XP",
        "OSCQR scoring",
        "HTML"
      ]
    },
    {
      "phase": "Iteration",
      "date": "April 24, 2026",
      "title": "Second prototype built — lighter educational aesthetic (v2, preferred)",
      "what": "Built a second prototype with a lighter, friendlier educational aesthetic. This version (v2) was selected as the preferred design direction. All core features carried forward: three scenarios, real-time prompt scoring, OSCQR alignment indicators, XP progression, and Claude API integration.",
      "why": "The v1 dark-mode aesthetic, while technically sound, felt more like a game than a professional learning tool. The lighter v2 aesthetic better fit the faculty professional development context and reduced cognitive distance between the tool and its intended use.",
      "tags": [
        "prototype v2",
        "design iteration",
        "educational aesthetic",
        "faculty PD"
      ]
    },
    {
      "phase": "Design",
      "date": "April 24, 2026",
      "title": "Scenario system established — Engagement, Differentiation, Assessment",
      "what": "Defined the initial three core scenarios: S1 Engagement, S2 Differentiation, S3 Assessment — with a fourth scenario locked as a progression milestone. Each scenario uses a distinct system prompt that shapes how Claude responds, so faculty experience different AI behaviors based on scenario context.",
      "why": "The three scenarios were selected because they map directly to common instructional design challenges in online courses and align to OSCQR standards. The locked fourth scenario introduced game-based progression logic to motivate continued engagement.",
      "tags": [
        "scenarios",
        "S1",
        "S2",
        "S3",
        "progression",
        "OSCQR alignment"
      ]
    },
    {
      "phase": "Design",
      "date": "April 24, 2026",
      "title": "Prompt scoring rubric logic designed",
      "what": "Designed the real-time prompt analysis system that scores faculty input across five dimensions: learner context, clear goal, course context, constraints, and specificity. Scores light up the OSCQR alignment strip as the AI response addresses different standards. This rubric is the embryonic form of the dissertation measurement instrument.",
      "why": "The scoring rubric needed to be dual-purpose: functional enough to give faculty immediate feedback during the learning activity, and rigorous enough to serve as a defensible measurement instrument for the research study. OSCQR standards anchored each dimension.",
      "tags": [
        "rubric",
        "prompt scoring",
        "OSCQR",
        "measurement instrument",
        "real-time feedback"
      ]
    },
    {
      "phase": "Problem",
      "date": "May 13, 2026",
      "title": "CORS error discovered — direct browser-to-API calls blocked",
      "what": "Encountered a CORS policy error when attempting to call the Anthropic API directly from the GitHub Pages-hosted prototype. The browser blocked the fetch request with: \"Access to fetch at https://api.anthropic.com/v1/messages has been blocked by CORS policy.\" This rendered the prototype non-functional in its hosted state.",
      "why": "Anthropic's API intentionally does not allow direct browser-to-API calls for security reasons — the API key would be exposed in client-side code. This was a fundamental architectural problem that required a server-side proxy solution before any further development or testing could proceed.",
      "tags": [
        "CORS",
        "API",
        "GitHub Pages",
        "security",
        "architecture",
        "bug"
      ]
    },
    {
      "phase": "Problem",
      "date": "May 13, 2026",
      "title": "API key security incident — key exposed publicly on GitHub",
      "what": "Discovered that the Anthropic API key had been accidentally committed to the public GitHub repository README.md, making it visible to anyone who visited the repo. Immediate remediation: the exposed key was revoked via the Anthropic console, a new key was generated, and the README was scrubbed. Key was moved to a secure private location.",
      "why": "A publicly exposed API key is a critical security failure — any person or automated scraper could have used the credit. This incident reinforced the architectural requirement for a server-side proxy where the API key is stored as an environment variable and never touches client-side code.",
      "tags": [
        "security",
        "API key",
        "GitHub",
        "incident",
        "remediation",
        "environment variables"
      ]
    },
    {
      "phase": "Decision",
      "date": "May 13, 2026",
      "title": "Hosting migrated from GitHub Pages to Netlify with serverless proxy",
      "what": "Migrated PromptCraft hosting from GitHub Pages to Netlify. Created a netlify/functions/claude.js serverless function to act as a secure proxy between the frontend and the Anthropic API. The API key was stored as a Netlify environment variable (ANTHROPIC_API_KEY). Frontend fetch calls were updated to target /.netlify/functions/claude instead of the Anthropic API directly.",
      "why": "GitHub Pages cannot run server-side code, making it impossible to securely proxy API calls. Netlify's serverless functions provide a free, low-friction solution that keeps the API key out of the browser entirely. This migration also set up the infrastructure for Netlify Forms and later Google Apps Script data logging.",
      "tags": [
        "Netlify",
        "hosting migration",
        "serverless",
        "proxy",
        "security",
        "infrastructure",
        "GitHub Pages"
      ]
    },
    {
      "phase": "Iteration",
      "date": "May 13, 2026",
      "title": "Scenario system expanded to S1–S8",
      "what": "Expanded from three scenarios to eight (S1–S8), covering a broader range of instructional design challenges. Added: Google Sheets data logging via Apps Script, an Ideas Wall for faculty to save strong AI outputs, Professor Pixel (AI mascot/guide), scaffolded prompt input fields, and a Reflection Room.",
      "why": "Eight scenarios allow the intervention to address a more comprehensive set of OSCQR-aligned competencies, strengthening the measurement instrument. Google Sheets logging was added specifically to support data collection — every prompt and response becomes a data point.",
      "tags": [
        "S1-S8",
        "Google Sheets",
        "Apps Script",
        "Ideas Wall",
        "Professor Pixel",
        "Reflection Room",
        "data logging"
      ]
    },
    {
      "phase": "Design",
      "date": "May 13, 2026",
      "title": "PromptCraft data spreadsheet built — PromptCraft_Data_v5.xlsx",
      "what": "Built a structured Google Sheets-compatible spreadsheet with three tabs: PromptCraft Responses (full session data, color-coded by scenario), Incremental Saves (Apps Script autosave), and Ideas Wall (approved strong AI responses).",
      "why": "The spreadsheet is the research data collection backbone. Each row represents one faculty session. This structure supports mixed-methods analysis — quantitative scoring plus qualitative reflection data.",
      "tags": [
        "data collection",
        "Google Sheets",
        "Apps Script",
        "research instrument",
        "mixed methods"
      ]
    },
    {
      "phase": "Design",
      "date": "May 13, 2026",
      "title": "Visual novel scene layout designed — cinematic composition",
      "what": "Designed and implemented the cinematic visual novel (VN) scene layout: smartboard positioned left, Pixel character right, with a large gradient dialogue box overlaying the scene. The VN engine drives Pixel's instructional dialogue sequences between scenario phases. Accessibility and mobile responsiveness were identified as next priorities following the layout work.",
      "why": "The VN scene is the primary instructional delivery mechanism — it is how Pixel coaches faculty through each scenario. A cinematic, visually coherent layout is important for engagement and also signals to faculty that this is a designed learning experience, not a generic chatbot. The composition follows visual novel conventions that faculty may recognize from game-based contexts.",
      "tags": [
        "visual novel",
        "VN engine",
        "Pixel",
        "UI design",
        "cinematic",
        "dialogue",
        "accessibility"
      ]
    },
    {
      "phase": "Iteration",
      "date": "May 13, 2026",
      "title": "Howler.js audio integrated — assets added to repository",
      "what": "Integrated Howler.js for audio playback within PromptCraft. Audio assets were uploaded to the repository. The audioReady flag was implemented to gate audio initialization, preventing Howler errors when audio files are not yet present in a given build.",
      "why": "Audio is a game design element that increases immersion and signals scenario transitions — consistent with Gee's principle that good games use multiple modalities to engage learners. The audioReady flag was a defensive pattern to prevent runtime errors during iterative development when assets may be incomplete.",
      "tags": [
        "Howler.js",
        "audio",
        "game design",
        "assets",
        "audioReady flag",
        "Gee"
      ]
    },
    {
      "phase": "Design",
      "date": "May 13, 2026",
      "title": "Literature review themes defined for dissertation",
      "what": "Defined six core literature review themes: (1) AI Literacy & Prompt Engineering, (2) Rural & Distance Educator Access, (3) Professional Development Design, (4) Game-Based & Simulation Learning, (5) Instructional Design & OSCQR, (6) Research Methodology. Built a corresponding research tracker spreadsheet with source tracking and dissertation chapter alignment.",
      "why": "The six themes were deliberately PromptCraft-specific, not carried over from the ChallengED literature review. This delineation matters for the dissertation committee — PromptCraft needs its own theoretical grounding separate from the MFA work.",
      "tags": [
        "literature review",
        "AI literacy",
        "rural education",
        "game-based learning",
        "TPACK",
        "OSCQR",
        "research tracker"
      ]
    },
    {
      "phase": "Design",
      "date": "May 13, 2026",
      "title": "Key scholars identified for dissertation literature base",
      "what": "Identified the core scholarly foundation: Gee (games and learning), Arnab et al. (serious games), Kolb (experiential learning), Whitton (game-based learning in higher ed), Bandura (self-efficacy), Darling-Hammond and Desimone (effective PD), Mishra & Koehler (TPACK), Creswell (mixed methods). Also flagged Nick Lux at MSU as a key local scholar to engage.",
      "why": "Identifying the scholarly foundation early gives the dissertation a defensible theoretical framework before the program begins and positions me to demonstrate scholarly readiness in the PhD application and early coursework.",
      "tags": [
        "Gee",
        "Arnab",
        "Kolb",
        "Bandura",
        "TPACK",
        "Creswell",
        "literature base"
      ]
    },
    {
      "phase": "Iteration",
      "date": "May 15, 2026",
      "title": "UI redesign — simplifying the interface",
      "what": "Opened a dedicated session to address visual complexity. Identified four structural problems: too many competing nav elements (dev bar, scenario tabs, OSCQR strip), disconnected content zones, unclear entry point for new users, and Professor Pixel floating unanchored. Redesigned toward radical simplification: one primary action zone, progressive disclosure, single clear visual hierarchy.",
      "why": "Even as the designer/researcher, the interface was confusing to navigate — a clear signal that faculty participants would struggle. Simplifying before any user testing was the right call; complexity introduced too early undermines the validity of any usability data collected.",
      "tags": [
        "UI redesign",
        "usability",
        "progressive disclosure",
        "visual hierarchy",
        "iteration"
      ]
    },
    {
      "phase": "Design",
      "date": "May 15, 2026",
      "title": "Research log created to document PromptCraft development",
      "what": "Created a persistent, structured research log to document the full PromptCraft development arc for use in the dissertation paper. Log captures: date, phase, entry title, what happened, rationale/reflection, and tags. Export function outputs a chronological .txt file.",
      "why": "A development log is essential for the research paper — it provides a first-person, timestamped record of design decisions, iteration cycles, and reflective practice. This mirrors the reflective practitioner stance required in a design-based research methodology.",
      "tags": [
        "research log",
        "documentation",
        "reflective practice",
        "design-based research",
        "dissertation"
      ]
    },
    {
      "phase": "Problem",
      "date": "July 29, 2026",
      "title": "Technical debt audit — monolithic codebase identified as critical risk",
      "what": "Conducted a systematic audit of the PromptCraft codebase and identified significant accumulated technical debt across all files (index.html, style.css, app.js, dialogue.js). Hundreds of !important rules across CSS sprint layers were creating specificity conflicts that made targeted fixes increasingly risky. The monolithic file structure was identified as the root cause of cascading regression risk.",
      "why": "Every sprint iteration had layered new CSS and JS on top of prior work without architectural cleanup. This is a natural consequence of rapid iterative prototyping, but it had reached a point where fixing one element broke another. Addressing the debt was necessary before any further feature development.",
      "tags": [
        "technical debt",
        "CSS specificity",
        "!important",
        "audit",
        "monolithic codebase"
      ]
    },
    {
      "phase": "Decision",
      "date": "July 29, 2026",
      "title": "S1-to-S2 navigation bug identified and fixed",
      "what": "Diagnosed and fixed a bug where the Visual Novel (VN) overlay was not being dismissed when switching from Scenario 1 to Scenario 2. The fix involved properly handling VN overlay state on scenario switch within the scenario navigation logic.",
      "why": "The S1-to-S2 transition is the first critical progression gate in PromptCraft — if it fails, participants cannot advance through the intervention. Fixing this was prerequisite to any usability testing or research deployment.",
      "tags": [
        "bug fix",
        "S1",
        "S2",
        "VN overlay",
        "scenario navigation"
      ]
    },
    {
      "phase": "Decision",
      "date": "July 29, 2026",
      "title": "S1 result card scroll position bug fixed",
      "what": "Fixed an issue where the S1 result card was not scrolling to the correct position after the Pixel VN sequence completed. Root cause identified as controls.scrollIntoView() firing after Pixel's VN sequence rather than before, causing the scroll to target the wrong element state.",
      "why": "Scroll position issues break the perceived flow of the learning experience — if faculty cannot see the scoring feedback clearly after submitting a prompt, the formative feedback loop that is central to the intervention design is disrupted.",
      "tags": [
        "bug fix",
        "scroll position",
        "S1",
        "result card",
        "VN sequence",
        "UX"
      ]
    },
    {
      "phase": "Iteration",
      "date": "July 29, 2026",
      "title": "S2 metacognition workbench wired into renderInputMode",
      "what": "Integrated the S2 metacognition workbench UI into the renderInputMode function, enabling the workbench to render correctly based on scenario state. This completes the functional implementation of the S2 scenario experience.",
      "why": "S2 is the metacognition scenario — it asks faculty to reflect on their prompting decisions, which is a key qualitative data collection point for the dissertation. Having it wired to renderInputMode ensures the workbench appears at the right moment in the scenario flow.",
      "tags": [
        "S2",
        "metacognition",
        "workbench",
        "renderInputMode",
        "feature implementation"
      ]
    },
    {
      "phase": "Problem",
      "date": "July 29, 2026",
      "title": "Claude Terminal diagnostic panel layout broken at intermediate viewports",
      "what": "Identified a layout failure in the Claude Terminal diagnostic panel at viewport widths between 820px and 1510px. At these widths the panel geometry collapsed or overlapped other UI elements. Multiple CSS-based fix attempts failed due to specificity conflicts from accumulated !important rules.",
      "why": "The Claude Terminal is the primary feedback mechanism in PromptCraft — it displays the AI's diagnostic analysis of each prompt. A broken layout at common laptop screen widths would make the tool unusable for a significant portion of faculty participants.",
      "tags": [
        "Claude Terminal",
        "layout bug",
        "viewport",
        "responsive design",
        "CSS specificity"
      ]
    },
    {
      "phase": "Decision",
      "date": "July 29, 2026",
      "title": "JavaScript inline-style solution adopted for Terminal layout (pcSetAnalysisGreenPanelMode)",
      "what": "After CSS-based approaches failed due to specificity wars, implemented a JavaScript function (pcSetAnalysisGreenPanelMode) that applies inline styles directly to the Terminal panel element. This bypasses the CSS cascade entirely and resolves the layout issue at all viewport widths.",
      "why": "When CSS specificity conflicts are too deeply entangled to fix cleanly without risking regressions, applying layout-critical styles via JavaScript inline is the correct architectural escape hatch. Inline styles have the highest specificity and are not subject to cascade conflicts. This decision was documented explicitly as a pattern for future reference.",
      "tags": [
        "JavaScript",
        "inline styles",
        "pcSetAnalysisGreenPanelMode",
        "CSS escape hatch",
        "Terminal",
        "architectural decision"
      ]
    },
    {
      "phase": "Problem",
      "date": "July 29, 2026",
      "title": "Automated CSS reorg caused critical regressions — approach rejected",
      "what": "An automated CSS reorganization attempt moved and removed 115 rule blocks, introducing malformed selectors and causing multiple regressions: body text color, tab height, terminal geometry, and cascade order were all broken. The regressions were identified via a detailed audit document and the global reorg approach was explicitly rejected.",
      "why": "Bulk automated restructuring of CSS that has accumulated over many sprint iterations is unsafe. The correct method is per-section changes, one breakpoint at a time, with before/after comparison at each step. This was formally established as a firm constraint for all future CSS work on PromptCraft.",
      "tags": [
        "CSS regression",
        "automated reorg",
        "audit",
        "constraint established",
        "lessons learned"
      ]
    },
    {
      "phase": "Iteration",
      "date": "July 29, 2026",
      "title": "Codebase modularized — CSS split into 11 files, JS into 4 domain files",
      "what": "Restructured the PromptCraft codebase from monolithic files into a modular architecture. CSS split into 11 numbered files (00-foundation.css through 100-s1-workbench-owner.css). JavaScript split into 4 domain files: app.js, app-scenarios.js, app-vn.js, and app-workbench.js.",
      "why": "Modular file architecture makes targeted, safe changes possible — each file has a clear domain boundary, reducing the risk that a change in one area causes regressions in another. This is the structural foundation needed for the codebase to scale through the remaining scenarios (S3–S8) and research deployment.",
      "tags": [
        "modularization",
        "CSS architecture",
        "JS architecture",
        "app.js",
        "app-scenarios.js",
        "app-vn.js",
        "app-workbench.js"
      ]
    },
    {
      "phase": "Iteration",
      "date": "July 29, 2026",
      "title": "Safe cleanup — sprint comments removed, inline script extracted to app-ui.js",
      "what": "Performed a conservative, safe cleanup pass: removed sprint block header comments from 10-vn-core.css and 20-terminal-core.css only; extracted an inline script block from index.html into a new functions/app-ui.js file. No CSS rules were moved, removed, or reordered.",
      "why": "Cleanup was scoped narrowly to changes with zero regression risk. Removing sprint comments reduces cognitive load when reading the files; extracting the inline script to its own file maintains the modular architecture principle without touching any functional logic.",
      "tags": [
        "cleanup",
        "sprint comments",
        "app-ui.js",
        "index.html",
        "safe refactor"
      ]
    }
  ],
  "sources": [
    {
        "id": "tracker-2026-06-what-are-artificial-intelligence-lit",
        "theme": "Educator AI Literacy & Critical Evaluation",
        "legacyTheme": "AI Literacy & Prompt Engineering",
        "priority": "High",
        "sourceType": "Article / PDF",
        "title": "What are artificial intelligence literacy and competency? A comprehensive framework to support them",
        "authors": "Thomas K.F. Chiu,\nZubair Ahmad,  \nMurod Ismailov,\nIsmaila Temitayo Sanusi",
        "date": "2024",
        "publisher": "Computers and Education Open",
        "apa": "Chiu, T. K. F., Ahmad, Z., Ismailov, M., & Sanusi, I. T. (2024). What are Artificial Intelligence Literacy and competency? A comprehensive framework to support them. Computers and Education Open, 6, 100171. https://doi.org/10.1016/j.caeo.2024.100171",
        "keyArgument": "Students must learn how to prompt effectively when using tools like ChatGPT.\n\nPrompt engineering is identified as a future research direction.",
        "connection": "Explicitly names prompting as a skill.\n\nResearch area in prompting as emerging and underdeveloped.",
        "methodology": "Practitioner-informed (teacher observations and recommendations).\n\nLiterature + practitioner synthesis identifying research gaps.",
        "status": "Not Started",
        "paperSection": "",
        "url": "https://doi.org/10.1016/j.caeo.2024.100171",
        "tags": [
            "Educator AI Literacy & Critical Evaluation"
        ],
        "annotations": [
            {
                "id": "tracker-note-1",
                "location": "p.6",
                "type": "Direct quote",
                "text": "“The students need to learn how to prompt effectively when using ChatGPT.” (p.6)",
                "interpretation": "",
                "paperUse": "",
                "tags": [],
                "created": "2026-09-29T00:00:00.000Z",
                "updatedAt": "2026-09-29T00:00:00.000Z"
            },
            {
                "id": "tracker-note-2",
                "location": "p.6",
                "type": "Direct quote",
                "text": "“Prompt engineering… [is] the technique of structuring text so that a generative AI model can comprehend and understand it.” (p.6)",
                "interpretation": "",
                "paperUse": "",
                "tags": [],
                "created": "2026-09-29T00:00:00.000Z",
                "updatedAt": "2026-09-29T00:00:00.000Z"
            },
            {
                "id": "tracker-note-3",
                "location": "p.4",
                "type": "Direct quote",
                "text": "“AI competency… includes… the ability to effectively communicate and collaborate with AI technologies.” (p.4)",
                "interpretation": "",
                "paperUse": "",
                "tags": [],
                "created": "2026-09-29T00:00:00.000Z",
                "updatedAt": "2026-09-29T00:00:00.000Z"
            },
            {
                "id": "tracker-note-4",
                "location": "p.7",
                "type": "Direct quote",
                "text": "“Prompt engineering… rephrase a query, select a style, provide context, or assign a role…” (p.7)",
                "interpretation": "",
                "paperUse": "",
                "tags": [],
                "created": "2026-09-29T00:00:00.000Z",
                "updatedAt": "2026-09-29T00:00:00.000Z"
            }
        ],
        "archiveFile": "",
        "trackerImported": true,
        "updatedAt": "2026-09-29T00:00:00.000Z"
    },
    {
        "id": "tracker-2026-08-rethinking-artificial-intelligence-l",
        "theme": "Educator AI Literacy & Critical Evaluation",
        "legacyTheme": "AI Literacy & Prompt Engineering",
        "priority": "High",
        "sourceType": "Article / PDF",
        "title": "Rethinking artificial-intelligence literacy through the lens of teacher educators: The adaptive AI model",
        "authors": "Liat Eyal",
        "date": "2025",
        "publisher": "Computers and Education Open",
        "apa": "Eyal, L. (2025). Rethinking artificial-intelligence literacy through the lens of teacher educators: The adaptive AI model. Computers and Education Open, 9, 100291. https://doi.org/10.1016/j.caeo.2025.100291",
        "keyArgument": "Existing AI literacy models fail because they ignore context (infrastructure, culture, role differences).\n\nAI literacy should be evaluated across three axes: Context Fit, Professional Needs, Dynamic Development.\n\nEffective AI literacy includes reflection, adaptation, and contextual decision-making.",
        "connection": "Supports PromptCraft as a flexible, adaptive skill system, not a linear “learn prompts → mastery” progression.\n\nThese map cleanly to prompt usage context, task-specific prompting, and iterative refinement over time.\n\nThis is essentially metacognitive prompting and evaluation.",
        "methodology": "Iterative model development grounded in participant feedback and case analysis.\n\nThis is essentially metacognitive prompting and evaluation.",
        "status": "Not Started",
        "paperSection": "",
        "url": "https://doi.org/10.1016/j.caeo.2025.100291",
        "tags": [
            "Educator AI Literacy & Critical Evaluation"
        ],
        "annotations": [
            {
                "id": "tracker-note-1",
                "location": "p.1",
                "type": "Direct quote",
                "text": "“AI literacy being a continuum rather than a binary state.” (p.1)",
                "interpretation": "",
                "paperUse": "",
                "tags": [],
                "created": "2026-09-29T00:00:00.000Z",
                "updatedAt": "2026-09-29T00:00:00.000Z"
            },
            {
                "id": "tracker-note-2",
                "location": "p.8",
                "type": "Direct quote",
                "text": "“AI literacy is a continuous process… shaped by technological innovation, changing roles, and professional growth.” (p.8)",
                "interpretation": "",
                "paperUse": "",
                "tags": [],
                "created": "2026-09-29T00:00:00.000Z",
                "updatedAt": "2026-09-29T00:00:00.000Z"
            },
            {
                "id": "tracker-note-3",
                "location": "p.6",
                "type": "Direct quote",
                "text": "“Assessment tools… often overlook socio-cultural factors and infrastructure limitations…” (p.6)",
                "interpretation": "",
                "paperUse": "",
                "tags": [],
                "created": "2026-09-29T00:00:00.000Z",
                "updatedAt": "2026-09-29T00:00:00.000Z"
            }
        ],
        "archiveFile": "",
        "trackerImported": true,
        "updatedAt": "2026-09-29T00:00:00.000Z"
    },
    {
        "id": "tracker-2026-09-ai-literacy-a-framework-to-understan",
        "theme": "Educator AI Literacy & Critical Evaluation",
        "legacyTheme": "AI Literacy & Prompt Engineering",
        "priority": "High",
        "sourceType": "Report / Policy",
        "title": "AI Literacy: A Framework to  Understand, Evaluate, and Use Emerging Technology",
        "authors": "Kelly Mills, \nPati Ruiz, \nKeun-woo Lee, \nMerijke Coenraad, \nJudi Fusco, \nJeremy Roschelle,\nJosh Weisgrau",
        "date": "2024",
        "publisher": "Digital Promise",
        "apa": "Ruiz, P., Mills, K., Lee, K., Coenraad, M., Fusco, J., Roschelle, J., & Weisgrau, J. (2024). Ai Literacy: A Framework to Understand, Evaluate, and Use Emerging Technology. https://doi.org/10.51388/20.500.12265/218",
        "keyArgument": "AI literacy consists of three interconnected modes: Understand, Evaluate, Use\n\nPrompting is explicitly identified as a skill within “Creating with AI”\n\nAI literacy includes six core practices (data, ethics, communication, etc.)",
        "connection": "This is basically a core gameplay loop for PromptCraft.\n\nPrompting is a teachable competency.\n\nSupports multiple PromptCraft scenarios and domains.",
        "methodology": "Framework synthesis (research + practitioner input + existing models)\n\nApplied examples and skill mapping\n\nEducational design perspective",
        "status": "Not Started",
        "paperSection": "",
        "url": "https://doi.org/10.51388/20.500.12265/218",
        "tags": [
            "Educator AI Literacy & Critical Evaluation"
        ],
        "annotations": [
            {
                "id": "tracker-note-1",
                "location": "p.4",
                "type": "Direct quote",
                "text": "“AI literacy includes the knowledge and skills that enable people to critically understand, evaluate, and use AI systems…” (p.4)",
                "interpretation": "",
                "paperUse": "",
                "tags": [],
                "created": "2026-09-29T00:00:00.000Z",
                "updatedAt": "2026-09-29T00:00:00.000Z"
            },
            {
                "id": "tracker-note-2",
                "location": "p.20",
                "type": "Direct quote",
                "text": "“The skill of GenAI prompting involves creating good questions or commands…” (p.20)",
                "interpretation": "",
                "paperUse": "",
                "tags": [],
                "created": "2026-09-29T00:00:00.000Z",
                "updatedAt": "2026-09-29T00:00:00.000Z"
            },
            {
                "id": "tracker-note-3",
                "location": "p.20",
                "type": "Direct quote",
                "text": "“Effectively prompting… requires clarity, specificity, experimentation, and patience.” (p.20)",
                "interpretation": "",
                "paperUse": "",
                "tags": [],
                "created": "2026-09-29T00:00:00.000Z",
                "updatedAt": "2026-09-29T00:00:00.000Z"
            }
        ],
        "archiveFile": "",
        "trackerImported": true,
        "updatedAt": "2026-09-29T00:00:00.000Z"
    },
    {
        "id": "tracker-2026-10-article-review-ai-literacy-framework",
        "theme": "Educator AI Literacy & Critical Evaluation",
        "legacyTheme": "AI Literacy & Prompt Engineering",
        "priority": "High",
        "sourceType": "Article / PDF",
        "title": "Article Review AI Literacy Framework and Strategies for Implementation in Developing Nations",
        "authors": "Krishna Chaitanya Rao Kathala,\nShashank Palakurthi",
        "date": "2024",
        "publisher": "Proceedings of the 2024 the 16th International Conference on Education Technology and Computers",
        "apa": "Kathala, K. C., & Palakurthi, S. (2024). Ai Literacy Framework and strategies for implementation in developing nations. Proceedings of the 2024 16th International Conference on Education Technology and Computers, 418–422. https://doi.org/10.1145/3702163.3702449",
        "keyArgument": "AI literacy is a foundational 21st-century skill (like reading/writing)\n\nAI literacy includes understand, evaluate, and use AI\n\nAI literacy must be contextualized and accessible",
        "connection": "Direct alignment with your gameplay loop\n\nStrong for game-based learning approach",
        "methodology": "Synthesized from prior research\n\nImplementation strategies",
        "status": "Not Started",
        "paperSection": "",
        "url": "https://doi.org/10.1145/3702163.3702449",
        "tags": [
            "Educator AI Literacy & Critical Evaluation"
        ],
        "annotations": [
            {
                "id": "tracker-note-1",
                "location": "p. 1",
                "type": "Direct quote",
                "text": "“AI literacy encompasses the knowledge, skills, and attitudes necessary to understand, critically evaluate, and engage with AI technologies.” (p. 1)",
                "interpretation": "",
                "paperUse": "",
                "tags": [],
                "created": "2026-09-29T00:00:00.000Z",
                "updatedAt": "2026-09-29T00:00:00.000Z"
            },
            {
                "id": "tracker-note-2",
                "location": "p.1",
                "type": "Direct quote",
                "text": "“AI literacy is becoming as fundamental as traditional literacy and numeracy skills.” (p.1)",
                "interpretation": "",
                "paperUse": "",
                "tags": [],
                "created": "2026-09-29T00:00:00.000Z",
                "updatedAt": "2026-09-29T00:00:00.000Z"
            },
            {
                "id": "tracker-note-3",
                "location": "p.2",
                "type": "Direct quote",
                "text": "“AI literacy enables individuals to critically evaluate AI technologies… and use AI as a tool…” (p.2)",
                "interpretation": "",
                "paperUse": "",
                "tags": [],
                "created": "2026-09-29T00:00:00.000Z",
                "updatedAt": "2026-09-29T00:00:00.000Z"
            }
        ],
        "archiveFile": "",
        "trackerImported": true,
        "updatedAt": "2026-09-29T00:00:00.000Z"
    },
    {
        "id": "tracker-2026-11-the-risks-of-human-overreliance-on-l",
        "theme": "Professional Judgment, Agency & Human-AI Decision Making",
        "legacyTheme": "AI Overreliance & Critical Evaluation",
        "priority": "High",
        "sourceType": "Article / PDF",
        "title": "The Risks of Human Overreliance on Large Language Models for Critical Thinking",
        "authors": "Tom Duenas, \nDiana Ruiz",
        "date": "2024",
        "publisher": "Research Gate",
        "apa": "Duenas, T. (2024). Assessing the Risks of Human Overreliance on Large Language Models for Critical Thinking. Research Gate. https://doi.org/10.13140/RG.2.2.26002.06082",
        "keyArgument": "Increasing reliance on LLMs for cognitive tasks introduces ethical, educational, and cognitive risks.\n\nOverreliance may lead to cognitive atrophy, particularly in critical thinking and reasoning skills.\n\nLLMs are effective at data retrieval and pattern recognlition, but weaker in ethical reasoning, contextual interpretation, and nuanced judgement.\n\nHuman-AI interaction should be framed as cognitive symbiosis, not replacement.\n\nMaintaining human agency and critical evaluation is essential in AI-augmented environments.\n\nEducation must shift to explicitly teach: evaluation of AI outputs, prompt engineering, and AI literacy and ethical reasoning.",
        "connection": "Directly supports PromptCraft's core problem space: AI overreliance \n\nReinforces need for evaluation mechanics (not just prompting), hallucination detection scenarios, and decision-making under amibuity.\n\nSupports framing AI as a cognitive partner, not an authority\n\nStrong justification for forcing players to question AI outputs and designing confidently wrong AI responses\n\nAligns with the goal of teaching metacognition, judgement, and responsible AI use",
        "methodology": "Theoretical + interdisciplinary synthesis\n\nCognitive science, AI research, ethics, and education literature\n\nIncludes conceptual models and applied frameworks",
        "status": "Not Started",
        "paperSection": "",
        "url": "https://doi.org/10.13140/RG.2.2.26002.06082",
        "tags": [
            "Professional Judgment, Agency & Human-AI Decision Making"
        ],
        "annotations": [
            {
                "id": "tracker-note-1",
                "location": "p.2",
                "type": "Direct quote",
                "text": "“The increasing dependence on LLMs for critical thinking poses significant ethical and educational challenges…” (p.2)",
                "interpretation": "",
                "paperUse": "",
                "tags": [],
                "created": "2026-09-29T00:00:00.000Z",
                "updatedAt": "2026-09-29T00:00:00.000Z"
            },
            {
                "id": "tracker-note-2",
                "location": "p.1",
                "type": "Direct quote",
                "text": "“There is a risk of cognitive atrophy… especially in areas requiring critical thinking.” (p.1)",
                "interpretation": "",
                "paperUse": "",
                "tags": [],
                "created": "2026-09-29T00:00:00.000Z",
                "updatedAt": "2026-09-29T00:00:00.000Z"
            },
            {
                "id": "tracker-note-3",
                "location": "p.3",
                "type": "Direct quote",
                "text": "“The ability to critically evaluate the outputs of… LLMs… will be crucial skills in the coming years.” (p.3)",
                "interpretation": "",
                "paperUse": "",
                "tags": [],
                "created": "2026-09-29T00:00:00.000Z",
                "updatedAt": "2026-09-29T00:00:00.000Z"
            }
        ],
        "archiveFile": "",
        "trackerImported": true,
        "updatedAt": "2026-09-29T00:00:00.000Z"
    },
    {
        "id": "tracker-2026-12-the-effects-of-over-reliance-on-ai-d",
        "theme": "Professional Judgment, Agency & Human-AI Decision Making",
        "legacyTheme": "AI Overreliance & Critical Evaluation",
        "priority": "High",
        "sourceType": "Article / PDF",
        "title": "The effects of over-reliance on AI dialogue systems on students' cognitive abilities: a systematic review",
        "authors": "Chunpeng Zhai, \nSantoso Wibowo,\nLily D. Li",
        "date": "2024",
        "publisher": "Smart Learning Environments",
        "apa": "Zhai, C., Wibowo, S., & Li, L. D. (2024). The effects of over-reliance on AI dialogue systems on students’ cognitive abilities: A systematic review. Smart Learning Environments, 11(1). https://doi.org/10.1186/s40561-024-00316-7",
        "keyArgument": "Users tend to overtrust AI outputs, even when incorrect\n\nOverreliance reduces critical thinking and verification behaviors\n\nUsers often fail to detect AI errors without prompting or training\n\nTraining improves users’ ability to critically evaluate AI outputs",
        "connection": "Justifies building friction and evaluation mechanics\n\nYour scenarios can simulate this failure safely\n\nDangerous. Also extremely gameable in simulation",
        "methodology": "Empirical + experimental studies\n\nBehavioral research\n\nExperimental tasks with AI outputs",
        "status": "Not Started",
        "paperSection": "",
        "url": "https://doi.org/10.1186/s40561-024-00316-7",
        "tags": [
            "Professional Judgment, Agency & Human-AI Decision Making"
        ],
        "annotations": [
            {
                "id": "tracker-note-1",
                "location": "p. 2",
                "type": "Direct quote",
                "text": "\"It requires the acumen to scrutinize AI outputs and make judicious decisions about their educational implementation.” (p. 2)",
                "interpretation": "",
                "paperUse": "",
                "tags": [],
                "created": "2026-09-29T00:00:00.000Z",
                "updatedAt": "2026-09-29T00:00:00.000Z"
            },
            {
                "id": "tracker-note-2",
                "location": "p. 5",
                "type": "Direct quote",
                "text": "“The potential pitfalls of AI—such as unreliable recommendations and algorithmic biases—highlight the need for educators to develop a nuanced understanding of AI’s limitations…” (p. 5)",
                "interpretation": "",
                "paperUse": "",
                "tags": [],
                "created": "2026-09-29T00:00:00.000Z",
                "updatedAt": "2026-09-29T00:00:00.000Z"
            },
            {
                "id": "tracker-note-3",
                "location": "p. 5",
                "type": "Direct quote",
                "text": "“Developing educators’ digital competencies in AI literacy is essential to enabling them to critically assess, interact with, and effectively apply AI tools…” (p. 5)",
                "interpretation": "",
                "paperUse": "",
                "tags": [],
                "created": "2026-09-29T00:00:00.000Z",
                "updatedAt": "2026-09-29T00:00:00.000Z"
            },
            {
                "id": "tracker-note-4",
                "location": "p. 17-18",
                "type": "Direct quote",
                "text": "“The effects of over-reliance on AI dialogue systems on students’ cognitive abilities…” (p. 17-18)",
                "interpretation": "",
                "paperUse": "",
                "tags": [],
                "created": "2026-09-29T00:00:00.000Z",
                "updatedAt": "2026-09-29T00:00:00.000Z"
            }
        ],
        "archiveFile": "",
        "trackerImported": true,
        "updatedAt": "2026-09-29T00:00:00.000Z"
    },
    {
        "id": "tracker-2026-13-developing-asynchronous-workshop-mod",
        "theme": "Educator Professional Development & Transfer to Practice",
        "legacyTheme": "Synchronous vs Asynchronous Design",
        "priority": "High",
        "sourceType": "Article / PDF",
        "title": "Developing Asynchronous Workshop Models for Professional Development",
        "authors": "Imari Cheyne Tetu, \nJun Fu, \nCaitlin K. Kirby, \nStephen Thomas, \nShannon Kelly, \nScott Schopieray",
        "date": "2024",
        "publisher": "Communication Design Quarterly",
        "apa": "Tetu, I. C., Kelly, S., Fu, J., Kirby, C. K., Schopieray, S., & Thomas, S. (2024). Developing asynchronous workshop models for professional development. Communication Design Quarterly, 12(3), 37–43. https://doi.org/10.1145/3563890.3713036",
        "keyArgument": "Asynchronous professional development workshops can provide flexibility, accessibility, and broader participation opportunities compared to purely synchronous formats.\n\nSimply recording synchronous workshops is insufficient for meaningful asynchronous learning. Effective asynchronous design requires intentional engagement structures, multimodal interaction, accessibility planning, and deliberate instructional design.\n\nParticipant engagement was highest with embedded workshop materials, reflective activities, and familiar communication spaces.\n\nEngagement in asynchronous collaborative activities declined when deadlines were unclear, expectations were ambiguous, or interaction occurred in unfamiliar platforms.",
        "connection": "Reinforces PromptCraft's likely strengths self-paced iteration, multimodal interaction, reflection, scaffolded activities, and replayability.",
        "methodology": "Experience report and evaluative mixed-methods approach.",
        "status": "Not Started",
        "paperSection": "",
        "url": "https://doi.org/10.1145/3563890.3713036",
        "tags": [
            "Educator Professional Development & Transfer to Practice"
        ],
        "annotations": [
            {
                "id": "tracker-note-1",
                "location": "p. 37–38",
                "type": "Direct quote",
                "text": "“Accessibility in learning requires multiple means of engagement, of representation, and of action and expression.” (p. 37–38)",
                "interpretation": "",
                "paperUse": "",
                "tags": [],
                "created": "2026-09-29T00:00:00.000Z",
                "updatedAt": "2026-09-29T00:00:00.000Z"
            }
        ],
        "archiveFile": "",
        "trackerImported": true,
        "updatedAt": "2026-09-29T00:00:00.000Z"
    },
    {
        "id": "tracker-2026-14-hybrid-learning-in-higher-education-",
        "theme": "Instructional Design, Canvas, Accessibility & OSCQR",
        "legacyTheme": "Synchronous vs Asynchronous Design",
        "priority": "High",
        "sourceType": "Article / PDF",
        "title": "Hybrid Learning in Higher Education: Considerations for Its Implementation in Course Design",
        "authors": "Alejandra Álvarez-Chaves, \nSilvia Saborío-Taylor",
        "date": "2025",
        "publisher": "Journal of Digital Educational Technology",
        "apa": "Álvarez-Chaves, A., & Saborío-Taylor, S. (2025). Hybrid learning in Higher Education: Considerations for its implementation in course design. Journal of Digital Educational Technology, 5(1). https://doi.org/10.30935/jdet/15859",
        "keyArgument": "Successful hybrid implementation depends on balancing synchronous and asychronous activities, aligning learning objectives, and designing coherent learning sequences.\n\nThe article frames hybrid learning not simply as technology integration but as a restructuring of learning environments around flexibility and learner-centered engagement.",
        "connection": "Extremely strong connection to PromptCraft's potential as a hybrid, multimodal, student-centered AI literacy environment.",
        "methodology": "Conceptualization of hybrid learning",
        "status": "Not Started",
        "paperSection": "",
        "url": "https://doi.org/10.30935/jdet/15859",
        "tags": [
            "Instructional Design, Canvas, Accessibility & OSCQR"
        ],
        "annotations": [
            {
                "id": "tracker-note-1",
                "location": "p. 1",
                "type": "Direct quote",
                "text": "“Hybrid learning models are emerging as an innovation that combines student engagement with sustainability and overcomes the limitations of the traditional classroom.” (p. 1)",
                "interpretation": "",
                "paperUse": "",
                "tags": [],
                "created": "2026-09-29T00:00:00.000Z",
                "updatedAt": "2026-09-29T00:00:00.000Z"
            },
            {
                "id": "tracker-note-2",
                "location": "p. 2",
                "type": "Direct quote",
                "text": "“Digital devices become flexible tools for learning, reducing boundaries between physical and virtual environments…” (p. 2)",
                "interpretation": "",
                "paperUse": "",
                "tags": [],
                "created": "2026-09-29T00:00:00.000Z",
                "updatedAt": "2026-09-29T00:00:00.000Z"
            }
        ],
        "archiveFile": "",
        "trackerImported": true,
        "updatedAt": "2026-09-29T00:00:00.000Z"
    },
    {
        "id": "tracker-2026-15-modification-and-evaluation-of-an-op",
        "theme": "Instructional Design, Canvas, Accessibility & OSCQR",
        "legacyTheme": "Instructional Design & OSCQR",
        "priority": "High",
        "sourceType": "Article / PDF",
        "title": "Modification and evaluation of an open-source rubric guiding inclusive design",
        "authors": "Jingrong Xie, \nYuna Ferguson, \nGulinna A, Mary Rice, \nMark Nichols",
        "date": "2024",
        "publisher": "Distance Education",
        "apa": "Xie, J., Ferguson, Y., A, G., Rice, M., & Nichols, M. (2024). Modification and evaluation of an open-source rubric guiding inclusive design. Distance Education, 46(3), 452–476. https://doi.org/10.1080/01587919.2024.2383227",
        "keyArgument": "Existing online course quality assurance frameworks, including OSCQR, require modification to better support inclusive design, equity, accessibility, and diverse learner needs in higher education.\n\nThe study argues that online review should move beyond compliance and technical structure toward meaningul inclusion, authentic angagement, and equitable learner support.",
        "connection": "Reinforces the importance of scaffolding, learner agency, feedback lops, authentic assessment, and reflective learning environments.\n\nReinforces the importance of scaffolding, learner agency, feedback loops, authentic assessment, and reflective learning environments.\n\nSupports simulation/game-based systems where learners choose pathways, reflect on outcomes, and interact with adaptive supports.\n\nSupports simulation/game-based systems where learners choose pathways, reflect on outcomes, and interact with adaptive supports.\n\nThe revised OSCQR elements align surprisingly well with good game design clear onboarding, progression systems, scaffolded mechanics, player autonomy, feedback systems, and inclusive participation.\n\nCould help frame PromptCraft's emphasis on multiple pathways, iterative learning, small-stakes experimentation, and reducing cognitive barriers.\n\nCould help frame PromptCraft not marely as \"AI training,\" but as an inclusive instructional design environment for AI literacy development.",
        "methodology": "Descriptive mixed-methods evaluation study\n\nRevised OSCQR rubric development process\n\nSurvey evaluation",
        "status": "Not Started",
        "paperSection": "",
        "url": "https://doi.org/10.1080/01587919.2024.2383227",
        "tags": [
            "Instructional Design, Canvas, Accessibility & OSCQR"
        ],
        "annotations": [
            {
                "id": "tracker-note-1",
                "location": "p. 452",
                "type": "Direct quote",
                "text": "“Many quality assurance frameworks are in need of modification and evaluation before they can support the alignment of inclusive course design and pedagogies…” (p. 452)",
                "interpretation": "",
                "paperUse": "",
                "tags": [],
                "created": "2026-09-29T00:00:00.000Z",
                "updatedAt": "2026-09-29T00:00:00.000Z"
            },
            {
                "id": "tracker-note-2",
                "location": "p. 453",
                "type": "Direct quote",
                "text": "“Online education holds promise for being inclusive when it is designed flexibly and with accessibility as a top priority.” (p. 453)",
                "interpretation": "",
                "paperUse": "",
                "tags": [],
                "created": "2026-09-29T00:00:00.000Z",
                "updatedAt": "2026-09-29T00:00:00.000Z"
            }
        ],
        "archiveFile": "",
        "trackerImported": true,
        "updatedAt": "2026-09-29T00:00:00.000Z"
    },
    {
        "id": "tracker-2026-16-examining-faculty-perceptions-of-dis",
        "theme": "Instructional Design, Canvas, Accessibility & OSCQR",
        "legacyTheme": "Instructional Design & OSCQR",
        "priority": "High",
        "sourceType": "Article / PDF",
        "title": "Examining Faculty Perceptions of Distance Course Quality Review Feedback",
        "authors": "Kristy Plander, \nRenee Hathaway, \nDeb Maeder",
        "date": "2025",
        "publisher": "Online Learning",
        "apa": "Plander, K., Hathaway, R., & Maeder, D. (2025). Examining faculty perceptions of distance course quality review feedback. Online Learning, 29(2). https://doi.org/10.24059/olj.v29i2.4436",
        "keyArgument": "Faculty perceptions of course quality review feedback significantly influence whether they accept, process, and implement course improvement recommendations.\n\nWhile feedback improved courses, participants also described it as overwhelming, emotionally difficult, and stressful when overly critical or excessively detailed.",
        "connection": "Strong connection to PromptCraft's emphasis on reflection, scaffolding, iterative improvement, and emotionally safe learning environments.\n\nThe findings directly support PromptCraft mechanics involving guided reflection, feedback prioritization, iterative revision, and adaptive support systems.",
        "methodology": "Quantitative surveys and interviews",
        "status": "Not Started",
        "paperSection": "",
        "url": "https://doi.org/10.24059/olj.v29i2.4436",
        "tags": [
            "Instructional Design, Canvas, Accessibility & OSCQR"
        ],
        "annotations": [
            {
                "id": "tracker-note-1",
                "location": "p. 83",
                "type": "Direct quote",
                "text": "“Employing a relational approach shifted the focus from an isolated course review, which can seem like surveillance, to a long-term collaboration…” (p. 83)",
                "interpretation": "",
                "paperUse": "",
                "tags": [],
                "created": "2026-09-29T00:00:00.000Z",
                "updatedAt": "2026-09-29T00:00:00.000Z"
            },
            {
                "id": "tracker-note-2",
                "location": "p. 89",
                "type": "Direct quote",
                "text": "“There’s so much feedback you’re getting…there’s times when it’s just we’re in survival mode as faculty…” (p. 89)",
                "interpretation": "",
                "paperUse": "",
                "tags": [],
                "created": "2026-09-29T00:00:00.000Z",
                "updatedAt": "2026-09-29T00:00:00.000Z"
            },
            {
                "id": "tracker-note-3",
                "location": "p. 91",
                "type": "Direct quote",
                "text": "“Participants noted that reviewers can support course changes by providing clarification of how criteria can be met and indicating priority improvement areas.” (p. 91)",
                "interpretation": "",
                "paperUse": "",
                "tags": [],
                "created": "2026-09-29T00:00:00.000Z",
                "updatedAt": "2026-09-29T00:00:00.000Z"
            }
        ],
        "archiveFile": "",
        "trackerImported": true,
        "updatedAt": "2026-09-29T00:00:00.000Z"
    },
    {
        "id": "tracker-2026-19-applications-and-learning-outcomes-o",
        "theme": "Authentic Scenario-Based & Game-Based Professional Learning",
        "legacyTheme": "Game-Based & Simulation Learning",
        "priority": "Medium",
        "sourceType": "Article / PDF",
        "title": "Applications and Learning Outcomes of Game Based Learning in Education",
        "authors": "Katerina Tzafilkou,\nNicolaos Protogeros,\nParaskevi Mikrouli",
        "date": "2024",
        "publisher": "International Educational Review",
        "apa": "Mikrouli, P., Tzafilkou, K., & Protogeros, N. (2024). Applications and learning outcomes of game based learning in Education. International Educational Review, 25–54. https://doi.org/10.58693/ier.212",
        "keyArgument": "GBL enhances critical thinking, problem-solving, and real-world application\n\nSimulation games allow learners to practice real-world decision-making safely\n\nEffective GBL requires alignment with learning objectives and careful design\n\nImmediate feedback and iterative learning are core to GBL effectiveness\n\nNot all GBL is effective; outcomes vary based on design, context, and implementation",
        "connection": "Direct overlap with prompting as a cognitive skill\n\nDirect justification for PromptCraft as a simulation environment\n\nPrevents your game from becoming “fun but useless”\n\nPerfect match with prompt → output → refine loop",
        "methodology": "Meta-level synthesis of empirical studies\n\nComparative analysis of game types\n\nCross-study evaluation of effectiveness",
        "status": "Not Started",
        "paperSection": "",
        "url": "https://doi.org/10.58693/ier.212",
        "tags": [
            "Authentic Scenario-Based & Game-Based Professional Learning"
        ],
        "annotations": [
            {
                "id": "tracker-note-1",
                "location": "p.1",
                "type": "Direct quote",
                "text": "“GBL demonstrates a positive impact on learning outcomes and engagement… enhancing students’ understanding of complex concepts and fostering real-world application.” (p.1)",
                "interpretation": "",
                "paperUse": "",
                "tags": [],
                "created": "2026-09-29T00:00:00.000Z",
                "updatedAt": "2026-09-29T00:00:00.000Z"
            },
            {
                "id": "tracker-note-2",
                "location": "p.14",
                "type": "Direct quote",
                "text": "“Games often require players to think critically, problem-solve, and make decisions… leading to deeper understanding.” (p.14)",
                "interpretation": "",
                "paperUse": "",
                "tags": [],
                "created": "2026-09-29T00:00:00.000Z",
                "updatedAt": "2026-09-29T00:00:00.000Z"
            },
            {
                "id": "tracker-note-3",
                "location": "p.11",
                "type": "Direct quote",
                "text": "“Simulation games… allow learners to practice key concepts, procedures, and decision-making skills in a hands-on, interactive way.” (p.11)",
                "interpretation": "",
                "paperUse": "",
                "tags": [],
                "created": "2026-09-29T00:00:00.000Z",
                "updatedAt": "2026-09-29T00:00:00.000Z"
            }
        ],
        "archiveFile": "",
        "trackerImported": true,
        "updatedAt": "2026-09-29T00:00:00.000Z"
    },
    {
        "id": "tracker-2026-20-introduction-to-game-based-learning",
        "theme": "Authentic Scenario-Based & Game-Based Professional Learning",
        "legacyTheme": "Game-Based & Simulation Learning",
        "priority": "Medium",
        "sourceType": "Book / Chapter",
        "title": "Introduction to Game-Based Learning",
        "authors": "Sara Rye, \nMicael Sousa, \nCarla Sousa",
        "date": "2025",
        "publisher": "Transformative Learning Through Play",
        "apa": "Rye, S., Sousa, M., & Sousa, C. (2025). Transformative Learning through Play. https://doi.org/10.1007/978-3-031-78523-8",
        "keyArgument": "GBL combines pedagogy, game mechanics, and interaction to improve learning outcomes.\n\nGames promote active, experiential, and constructivists learning.\n\nEffective GBL requires alignment between mechanics and learning outcomes.\n\nGames inherently support feedback, iteration, and problem-solving.\n\nSimulation and role-based games enable real-world skill practice.\n\nGBL supports meacognition, critical thinking, and reflection.",
        "connection": "Supports PromptCraft being designed as a learning system, not just a tool.\n\nBuild on learning by doing.\n\nValidates need for intentional scenario design.",
        "methodology": "Theoretical + literature synthesis\n\nMulti-theory integration (constructivism, experiential, sociocultural)\n\nLearning theory integration",
        "status": "Not Started",
        "paperSection": "",
        "url": "https://doi.org/10.1007/978-3-031-78523-8",
        "tags": [
            "Authentic Scenario-Based & Game-Based Professional Learning"
        ],
        "annotations": [
            {
                "id": "tracker-note-1",
                "location": "p.31",
                "type": "Direct quote",
                "text": "“Games use intrinsic motivational aspects to enable active engagement, skill development, collaborative learning and problem-solving.” (p.31)",
                "interpretation": "",
                "paperUse": "",
                "tags": [],
                "created": "2026-09-29T00:00:00.000Z",
                "updatedAt": "2026-09-29T00:00:00.000Z"
            },
            {
                "id": "tracker-note-2",
                "location": "p.36",
                "type": "Direct quote",
                "text": "“Games are structured activities governed by rules, goals and challenges that promote problem-solving and decision-making.” (p.36)",
                "interpretation": "",
                "paperUse": "",
                "tags": [],
                "created": "2026-09-29T00:00:00.000Z",
                "updatedAt": "2026-09-29T00:00:00.000Z"
            },
            {
                "id": "tracker-note-3",
                "location": "p.48",
                "type": "Direct quote",
                "text": "“GBL promotes experiential learning… allowing students to apply knowledge in simulated or real worlds.” (p.48)",
                "interpretation": "",
                "paperUse": "",
                "tags": [],
                "created": "2026-09-29T00:00:00.000Z",
                "updatedAt": "2026-09-29T00:00:00.000Z"
            },
            {
                "id": "tracker-note-4",
                "location": "p.56–57",
                "type": "Direct quote",
                "text": "“Learning occurs through active participation, reflection, and interaction.” (p.56–57)",
                "interpretation": "",
                "paperUse": "",
                "tags": [],
                "created": "2026-09-29T00:00:00.000Z",
                "updatedAt": "2026-09-29T00:00:00.000Z"
            }
        ],
        "archiveFile": "",
        "trackerImported": true,
        "updatedAt": "2026-09-29T00:00:00.000Z"
    },
    {
        "id": "tracker-2026-21-ai-enhanced-game-based-learning-for-",
        "theme": "Authentic Scenario-Based & Game-Based Professional Learning",
        "legacyTheme": "Game-Based & Simulation Learning",
        "priority": "Medium",
        "sourceType": "Article / PDF",
        "title": "AI-Enhanced Game-Based Learning for Project Leadership",
        "authors": "Matthew Daniels, \nEamonn Kelly, \nSandra Flynn, \nJohn Kelly",
        "date": "2025",
        "publisher": "Project Leadership and Society",
        "apa": "Daniels, M., Kelly, É., Flynn, S., & Kelly, J. (2025). Advancing Project Leadership Education through AI-enhanced game-based learning. Project Leadership and Society, 6, 100189. https://doi.org/10.1016/j.plas.2025.100189",
        "keyArgument": "AI-GBL bridges the theory -practice gap by placing learners in realistic, complex simulations\n\nGenerative AI can act as a pedagogical co-orchestrator not just a tool.\n\nLearning improves through adaptive decision-making, reflection and ethical reasoning.\n\nAI-GBL supports development of adaptive expertise (handling ambiguity, uncertainty)\n\nProductive failure and ambiguity are essential for deep learning.\n\nEthical AI literacy requires critical evaluation of AI outputs and decision-making",
        "connection": "AI as an interactive partner in learning, not just output generator.\n\nPrompting is inherently ambiguous and iterative",
        "methodology": "Design-based, mixed-methods study.\n\nQuantitative gains + qualitative evidence\n\nTheory integration + observed learner behavior",
        "status": "Not Started",
        "paperSection": "",
        "url": "https://doi.org/10.1016/j.plas.2025.100189",
        "tags": [
            "Authentic Scenario-Based & Game-Based Professional Learning"
        ],
        "annotations": [
            {
                "id": "tracker-note-1",
                "location": "p.1",
                "type": "Direct quote",
                "text": "“AI-GBL… enables students to rehearse complex project challenges… within psychologically safe yet realistic simulations.” (p.1)",
                "interpretation": "",
                "paperUse": "",
                "tags": [],
                "created": "2026-09-29T00:00:00.000Z",
                "updatedAt": "2026-09-29T00:00:00.000Z"
            },
            {
                "id": "tracker-note-2",
                "location": "p.2",
                "type": "Direct quote",
                "text": "“AI… [acts] as a reflective partner capable of scaffolding adaptive expertise.” (p.2)",
                "interpretation": "",
                "paperUse": "",
                "tags": [],
                "created": "2026-09-29T00:00:00.000Z",
                "updatedAt": "2026-09-29T00:00:00.000Z"
            },
            {
                "id": "tracker-note-3",
                "location": "p.4",
                "type": "Direct quote",
                "text": "“Some students admitted to an over-reliance on the AI’s first suggestion…” (p.4)",
                "interpretation": "",
                "paperUse": "",
                "tags": [],
                "created": "2026-09-29T00:00:00.000Z",
                "updatedAt": "2026-09-29T00:00:00.000Z"
            }
        ],
        "archiveFile": "",
        "trackerImported": true,
        "updatedAt": "2026-09-29T00:00:00.000Z"
    }
],
  "researchMaterials": [
    {
        "id": "tracker-material-r10-1",
        "materialType": "Diagram / Figure",
        "status": "Captured",
        "title": "Imported tracker diagram / image 1",
        "creator": "",
        "date": "",
        "sourceId": "tracker-2026-10-article-review-ai-literacy-framework",
        "sourceTitle": "Article Review AI Literacy Framework and Strategies for Implementation in Developing Nations",
        "theme": "",
        "citation": "",
        "url": "",
        "paperSection": "",
        "tags": [
            "imported from PromptCraft Research Tracker v2"
        ],
        "annotations": [],
        "created": "2026-09-29T00:00:00.000Z",
        "updatedAt": "2026-09-29T00:00:00.000Z",
        "fileId": "tracker-static-r10-1",
        "fileName": "tracker-r10-image-1.png",
        "size": 907650,
        "type": "image/png",
        "sha256": "",
        "storage": "static",
        "chunkCount": 0,
        "staticPath": "research-assets/tracker-import/tracker-r10-image-1.png"
    },
    {
        "id": "tracker-material-r11-1",
        "materialType": "Diagram / Figure",
        "status": "Captured",
        "title": "Imported tracker diagram / image 1",
        "creator": "",
        "date": "",
        "sourceId": "tracker-2026-11-the-risks-of-human-overreliance-on-l",
        "sourceTitle": "The Risks of Human Overreliance on Large Language Models for Critical Thinking",
        "theme": "",
        "citation": "",
        "url": "",
        "paperSection": "",
        "tags": [
            "imported from PromptCraft Research Tracker v2"
        ],
        "annotations": [],
        "created": "2026-09-29T00:00:00.000Z",
        "updatedAt": "2026-09-29T00:00:00.000Z",
        "fileId": "tracker-static-r11-1",
        "fileName": "tracker-r11-image-1.png",
        "size": 58836,
        "type": "image/png",
        "sha256": "",
        "storage": "static",
        "chunkCount": 0,
        "staticPath": "research-assets/tracker-import/tracker-r11-image-1.png"
    },
    {
        "id": "tracker-material-r11-2",
        "materialType": "Diagram / Figure",
        "status": "Captured",
        "title": "Imported tracker diagram / image 2",
        "creator": "",
        "date": "",
        "sourceId": "tracker-2026-11-the-risks-of-human-overreliance-on-l",
        "sourceTitle": "The Risks of Human Overreliance on Large Language Models for Critical Thinking",
        "theme": "",
        "citation": "",
        "url": "",
        "paperSection": "",
        "tags": [
            "imported from PromptCraft Research Tracker v2"
        ],
        "annotations": [],
        "created": "2026-09-29T00:00:00.000Z",
        "updatedAt": "2026-09-29T00:00:00.000Z",
        "fileId": "tracker-static-r11-2",
        "fileName": "tracker-r11-image-2.png",
        "size": 92007,
        "type": "image/png",
        "sha256": "",
        "storage": "static",
        "chunkCount": 0,
        "staticPath": "research-assets/tracker-import/tracker-r11-image-2.png"
    },
    {
        "id": "tracker-material-r11-3",
        "materialType": "Diagram / Figure",
        "status": "Captured",
        "title": "Imported tracker diagram / image 3",
        "creator": "",
        "date": "",
        "sourceId": "tracker-2026-11-the-risks-of-human-overreliance-on-l",
        "sourceTitle": "The Risks of Human Overreliance on Large Language Models for Critical Thinking",
        "theme": "",
        "citation": "",
        "url": "",
        "paperSection": "",
        "tags": [
            "imported from PromptCraft Research Tracker v2"
        ],
        "annotations": [],
        "created": "2026-09-29T00:00:00.000Z",
        "updatedAt": "2026-09-29T00:00:00.000Z",
        "fileId": "tracker-static-r11-3",
        "fileName": "tracker-r11-image-3.png",
        "size": 80376,
        "type": "image/png",
        "sha256": "",
        "storage": "static",
        "chunkCount": 0,
        "staticPath": "research-assets/tracker-import/tracker-r11-image-3.png"
    },
    {
        "id": "tracker-material-r11-4",
        "materialType": "Diagram / Figure",
        "status": "Captured",
        "title": "Imported tracker diagram / image 4",
        "creator": "",
        "date": "",
        "sourceId": "tracker-2026-11-the-risks-of-human-overreliance-on-l",
        "sourceTitle": "The Risks of Human Overreliance on Large Language Models for Critical Thinking",
        "theme": "",
        "citation": "",
        "url": "",
        "paperSection": "",
        "tags": [
            "imported from PromptCraft Research Tracker v2"
        ],
        "annotations": [],
        "created": "2026-09-29T00:00:00.000Z",
        "updatedAt": "2026-09-29T00:00:00.000Z",
        "fileId": "tracker-static-r11-4",
        "fileName": "tracker-r11-image-4.png",
        "size": 72704,
        "type": "image/png",
        "sha256": "",
        "storage": "static",
        "chunkCount": 0,
        "staticPath": "research-assets/tracker-import/tracker-r11-image-4.png"
    },
    {
        "id": "tracker-material-r14-1",
        "materialType": "Diagram / Figure",
        "status": "Captured",
        "title": "Imported tracker diagram / image 1",
        "creator": "",
        "date": "",
        "sourceId": "tracker-2026-14-hybrid-learning-in-higher-education-",
        "sourceTitle": "Hybrid Learning in Higher Education: Considerations for Its Implementation in Course Design",
        "theme": "",
        "citation": "",
        "url": "",
        "paperSection": "",
        "tags": [
            "imported from PromptCraft Research Tracker v2"
        ],
        "annotations": [],
        "created": "2026-09-29T00:00:00.000Z",
        "updatedAt": "2026-09-29T00:00:00.000Z",
        "fileId": "tracker-static-r14-1",
        "fileName": "tracker-r14-image-1.png",
        "size": 47841,
        "type": "image/png",
        "sha256": "",
        "storage": "static",
        "chunkCount": 0,
        "staticPath": "research-assets/tracker-import/tracker-r14-image-1.png"
    },
    {
        "id": "tracker-material-r6-1",
        "materialType": "Diagram / Figure",
        "status": "Captured",
        "title": "Imported tracker diagram / image 1",
        "creator": "",
        "date": "",
        "sourceId": "tracker-2026-06-what-are-artificial-intelligence-lit",
        "sourceTitle": "What are artificial intelligence literacy and competency? A comprehensive framework to support them",
        "theme": "",
        "citation": "",
        "url": "",
        "paperSection": "",
        "tags": [
            "imported from PromptCraft Research Tracker v2"
        ],
        "annotations": [],
        "created": "2026-09-29T00:00:00.000Z",
        "updatedAt": "2026-09-29T00:00:00.000Z",
        "fileId": "tracker-static-r6-1",
        "fileName": "tracker-r6-image-1.png",
        "size": 162972,
        "type": "image/png",
        "sha256": "",
        "storage": "static",
        "chunkCount": 0,
        "staticPath": "research-assets/tracker-import/tracker-r6-image-1.png"
    },
    {
        "id": "tracker-material-r6-2",
        "materialType": "Diagram / Figure",
        "status": "Captured",
        "title": "Imported tracker diagram / image 2",
        "creator": "",
        "date": "",
        "sourceId": "tracker-2026-06-what-are-artificial-intelligence-lit",
        "sourceTitle": "What are artificial intelligence literacy and competency? A comprehensive framework to support them",
        "theme": "",
        "citation": "",
        "url": "",
        "paperSection": "",
        "tags": [
            "imported from PromptCraft Research Tracker v2"
        ],
        "annotations": [],
        "created": "2026-09-29T00:00:00.000Z",
        "updatedAt": "2026-09-29T00:00:00.000Z",
        "fileId": "tracker-static-r6-2",
        "fileName": "tracker-r6-image-2.png",
        "size": 112031,
        "type": "image/png",
        "sha256": "",
        "storage": "static",
        "chunkCount": 0,
        "staticPath": "research-assets/tracker-import/tracker-r6-image-2.png"
    },
    {
        "id": "tracker-material-r6-3",
        "materialType": "Diagram / Figure",
        "status": "Captured",
        "title": "Imported tracker diagram / image 3",
        "creator": "",
        "date": "",
        "sourceId": "tracker-2026-06-what-are-artificial-intelligence-lit",
        "sourceTitle": "What are artificial intelligence literacy and competency? A comprehensive framework to support them",
        "theme": "",
        "citation": "",
        "url": "",
        "paperSection": "",
        "tags": [
            "imported from PromptCraft Research Tracker v2"
        ],
        "annotations": [],
        "created": "2026-09-29T00:00:00.000Z",
        "updatedAt": "2026-09-29T00:00:00.000Z",
        "fileId": "tracker-static-r6-3",
        "fileName": "tracker-r6-image-3.png",
        "size": 371762,
        "type": "image/png",
        "sha256": "",
        "storage": "static",
        "chunkCount": 0,
        "staticPath": "research-assets/tracker-import/tracker-r6-image-3.png"
    },
    {
        "id": "tracker-material-r8-1",
        "materialType": "Diagram / Figure",
        "status": "Captured",
        "title": "Imported tracker diagram / image 1",
        "creator": "",
        "date": "",
        "sourceId": "tracker-2026-08-rethinking-artificial-intelligence-l",
        "sourceTitle": "Rethinking artificial-intelligence literacy through the lens of teacher educators: The adaptive AI model",
        "theme": "",
        "citation": "",
        "url": "",
        "paperSection": "",
        "tags": [
            "imported from PromptCraft Research Tracker v2"
        ],
        "annotations": [],
        "created": "2026-09-29T00:00:00.000Z",
        "updatedAt": "2026-09-29T00:00:00.000Z",
        "fileId": "tracker-static-r8-1",
        "fileName": "tracker-r8-image-1.png",
        "size": 71512,
        "type": "image/png",
        "sha256": "",
        "storage": "static",
        "chunkCount": 0,
        "staticPath": "research-assets/tracker-import/tracker-r8-image-1.png"
    },
    {
        "id": "tracker-material-r9-1",
        "materialType": "Diagram / Figure",
        "status": "Captured",
        "title": "Imported tracker diagram / image 1",
        "creator": "",
        "date": "",
        "sourceId": "tracker-2026-09-ai-literacy-a-framework-to-understan",
        "sourceTitle": "AI Literacy: A Framework to  Understand, Evaluate, and Use Emerging Technology",
        "theme": "",
        "citation": "",
        "url": "",
        "paperSection": "",
        "tags": [
            "imported from PromptCraft Research Tracker v2"
        ],
        "annotations": [],
        "created": "2026-09-29T00:00:00.000Z",
        "updatedAt": "2026-09-29T00:00:00.000Z",
        "fileId": "tracker-static-r9-1",
        "fileName": "tracker-r9-image-1.png",
        "size": 84103,
        "type": "image/png",
        "sha256": "",
        "storage": "static",
        "chunkCount": 0,
        "staticPath": "research-assets/tracker-import/tracker-r9-image-1.png"
    }
],
  "themes": [
    {
      "id": "plan-v2-theme-01",
      "theme": "Educator AI Literacy & Critical Evaluation",
      "question": "What knowledge and evaluative practices do educators need to use generative AI responsibly in instructional work, and how can professional learning move beyond prompt construction toward critical evaluation of AI output?",
      "searchTerms": "educator AI literacy framework; generative AI literacy higher education faculty; critical evaluation AI output educators; AI hallucination overreliance education; responsible generative AI teaching",
      "chapters": "Chapter 1: Introduction and Context\nChapter 2: Review of Literature\nChapter 3: Intervention rationale",
      "scenarios": "Across PromptCraft; especially evidence inspection, prediction, Babbage analysis, revision, and evaluation activities",
      "sourcesFound": 4,
      "status": "In Progress"
    },
    {
      "id": "plan-v2-theme-02",
      "theme": "Professional Judgment, Agency & Human-AI Decision Making",
      "question": "How can educators use AI as a source of support or evidence without surrendering responsibility for instructional decisions, and what design features help preserve professional judgment?",
      "searchTerms": "teacher agency generative AI; educator professional judgment AI; human AI decision making education; automation bias educators; human oversight generative AI teaching",
      "chapters": "Chapter 1: Problem and significance\nChapter 2: Professional judgment and educator agency\nChapter 3: PromptCraft design framework",
      "scenarios": "S1 reference implementation; human diagnosis before AI consultation; Babbage as analytical support; instructor verification and final responsibility",
      "sourcesFound": 2,
      "status": "In Progress"
    },
    {
      "id": "plan-v2-theme-03",
      "theme": "Authentic Scenario-Based & Game-Based Professional Learning",
      "question": "What evidence supports realistic scenarios, simulations, serious games, and experiential learning for adult professional learning, and which game mechanics support decision-making rather than distract from it?",
      "searchTerms": "scenario based learning professional development; serious games adult learning higher education; simulation faculty development; experiential learning educators; game based professional learning",
      "chapters": "Chapter 2: Scenario-based and game-based learning\nChapter 3: Intervention development and design",
      "scenarios": "Visual-novel framing, Canvas evidence cases, staged decisions, consequences, Babbage analysis, transfer tasks, Teaching Progress",
      "sourcesFound": 3,
      "status": "In Progress"
    },
    {
      "id": "plan-v2-theme-04",
      "theme": "Instructional Design, Canvas, Accessibility & OSCQR",
      "question": "How do established online-course design principles, accessibility practices, and OSCQR inform the authentic instructional problems used in PromptCraft without turning OSCQR into an unsupported outcome measure?",
      "searchTerms": "OSCQR online course design research; accessibility online course design higher education; Canvas course organization student navigation; alignment online learning design; OSCQR validity research",
      "chapters": "Chapter 1: Professional context\nChapter 2: Instructional design and accessibility\nChapter 3: Intervention design and content validity",
      "scenarios": "S1 Start With the Learning; Canvas evidence; Course Guide; future course-design scenarios; accessibility and responsive interaction requirements",
      "sourcesFound": 3,
      "status": "In Progress"
    },
    {
      "id": "plan-v2-theme-05",
      "theme": "Educator Professional Development & Transfer to Practice",
      "question": "What makes professional development useful, relevant, sustained, and transferable for educators, and how can PromptCraft connect low-risk practice to decisions participants make in their own courses?",
      "searchTerms": "effective faculty professional development higher education; professional learning transfer educators; online asynchronous faculty development; adult learning professional development faculty; job embedded professional learning higher education",
      "chapters": "Chapter 1: Significance and audience\nChapter 2: Professional development\nChapter 3: Intervention rationale",
      "scenarios": "My Course/private transfer activities; Course Guide; optional scenario relevance; authentic Canvas problems; printable participant artifacts",
      "sourcesFound": 1,
      "status": "In Progress"
    },
    {
      "id": "plan-v2-theme-06",
      "theme": "Metacognition, Reflection & Learning Transfer",
      "question": "How do prediction, explanation, reflection, revision, and transfer activities make educator reasoning visible and support learning from AI-supported instructional decisions?",
      "searchTerms": "metacognition professional learning educators; reflection transfer adult learning; prediction explanation learning; self regulated learning professional development; metacognitive prompting AI education",
      "chapters": "Chapter 2: Metacognition, reflection, and transfer\nChapter 3: PromptCraft learning loop and qualitative evidence",
      "scenarios": "Prediction before AI consultation; explanation of evidence; reflection and revision; My Course transfer; Course Guide accumulation",
      "sourcesFound": 0,
      "status": "In Progress"
    },
    {
      "id": "plan-v2-theme-07",
      "theme": "Research Instrumentation, Process Data & Validity",
      "question": "Which PromptCraft interactions provide defensible evidence of participant reasoning, and how can researcher-developed measures, process data, versioning, and scoring be made reliable and interpretable?",
      "searchTerms": "researcher developed instrument validity education; process data learning analytics validity; performance assessment scoring reliability; content validity expert review educational intervention; process tracing educational research",
      "chapters": "Chapter 3: Data sources, measures, reliability and validity\nChapter 4: Data analysis plan\nAppendix C-D",
      "scenarios": "Research schema V121; scenario checkpoints; diagnosis and transfer responses; Babbage feedback provenance; fixed study build; intervention map",
      "sourcesFound": 0,
      "status": "In Progress"
    },
    {
      "id": "plan-v2-theme-08",
      "theme": "Mixed Methods Action Research & Iterative Design",
      "question": "How can mixed methods action research examine both participant outcomes and the experience of using PromptCraft while the development log documents the iterative design process and researcher positionality?",
      "searchTerms": "mixed methods action research education intervention; practitioner action research mixed methods; iterative design action research; design log audit trail qualitative research; mixed methods integration intervention study",
      "chapters": "Chapter 2: Iterative design and action research\nChapter 3: Research design\nChapter 4: Integration of evidence\nChapter 5: Limitations",
      "scenarios": "Development Log and Visual History; fixed intervention version during data collection; participant performance plus qualitative reflection and researcher documentation",
      "sourcesFound": 0,
      "status": "In Progress"
    }
  ],
  "outline": [
    {
      "id": "plan-v2-outline-01",
      "chapter": "Chapter 1: Introduction and Context",
      "section": "Introduction and Problem Context",
      "questions": "Why does educator use of generative AI require more than access to tools or prompt-writing tips? What instructional risks and responsibilities make critical evaluation, accessibility, alignment, privacy, and professional judgment necessary?",
      "themes": "Educator AI Literacy & Critical Evaluation\nProfessional Judgment, Agency & Human-AI Decision Making",
      "status": "Drafted"
    },
    {
      "id": "plan-v2-outline-02",
      "chapter": "Chapter 1: Introduction and Context",
      "section": "Motivation for the Study",
      "questions": "How does the researcher’s instructional-design work motivate a low-risk, practice-based professional learning environment for educators using AI?",
      "themes": "Educator Professional Development & Transfer to Practice\nInstructional Design, Canvas, Accessibility & OSCQR",
      "status": "Drafted"
    },
    {
      "id": "plan-v2-outline-03",
      "chapter": "Chapter 1: Introduction and Context",
      "section": "Positionality and Professional Context",
      "questions": "How do the researcher’s roles as instructional designer, educator, game designer, developer, and proposed researcher shape the intervention and create both expertise and potential bias? How will the research log and multiple evidence sources make that position visible?",
      "themes": "Mixed Methods Action Research & Iterative Design",
      "status": "Drafted"
    },
    {
      "id": "plan-v2-outline-04",
      "chapter": "Chapter 1: Introduction and Context",
      "section": "Description and Design Logic of PromptCraft",
      "questions": "What has PromptCraft become after iterative development? How does the current learning loop move from authentic evidence and human judgment to AI-supported analysis, reflection, revision, and transfer rather than treating prompt construction as the end goal?",
      "themes": "Professional Judgment, Agency & Human-AI Decision Making\nAuthentic Scenario-Based & Game-Based Professional Learning\nEducator Professional Development & Transfer to Practice",
      "status": "In Progress"
    },
    {
      "id": "plan-v2-outline-05",
      "chapter": "Chapter 1: Introduction and Context",
      "section": "Purpose of the Study",
      "questions": "What will the study examine about educators’ demonstrated evaluation and instructional decision-making, their experience of PromptCraft, and the use of evidence to refine the intervention?",
      "themes": "Educator AI Literacy & Critical Evaluation\nMixed Methods Action Research & Iterative Design",
      "status": "Drafted"
    },
    {
      "id": "plan-v2-outline-06",
      "chapter": "Chapter 1: Introduction and Context",
      "section": "Research Questions",
      "questions": "Finalize research questions that match the fixed intervention and actual measures. Preserve the current emphasis on demonstrated evaluation/instructional decisions, participant perceptions of relevance/usability/value, and how combined evidence informs revision.",
      "themes": "Research Instrumentation, Process Data & Validity\nMixed Methods Action Research & Iterative Design",
      "status": "In Progress"
    },
    {
      "id": "plan-v2-outline-07",
      "chapter": "Chapter 1: Introduction and Context",
      "section": "Significance and Intended Audience",
      "questions": "What can a small pilot reasonably contribute to faculty development, instructional design, school/college leadership, and teacher-development programs without overgeneralizing to statewide policy?",
      "themes": "Educator Professional Development & Transfer to Practice\nEducator AI Literacy & Critical Evaluation",
      "status": "Drafted"
    },
    {
      "id": "plan-v2-outline-08",
      "chapter": "Chapter 2: Review of Literature",
      "section": "Generative AI in Education",
      "questions": "How is generative AI currently being used in teaching, assessment, feedback, and course development, and what risks or uncertainties matter for educator decision-making?",
      "themes": "Educator AI Literacy & Critical Evaluation",
      "status": "Not Started"
    },
    {
      "id": "plan-v2-outline-09",
      "chapter": "Chapter 2: Review of Literature",
      "section": "Educator AI Literacy and Critical Evaluation",
      "questions": "What does AI literacy mean for educators? Which frameworks include evaluation, bias, accuracy, privacy, accessibility, attribution, and responsible use? Where does PromptCraft fit within that literature?",
      "themes": "Educator AI Literacy & Critical Evaluation",
      "status": "In Progress"
    },
    {
      "id": "plan-v2-outline-10",
      "chapter": "Chapter 2: Review of Literature",
      "section": "Professional Judgment, Agency, and Human-AI Decision Making",
      "questions": "What does the literature say about educator agency, automation bias, overreliance, human oversight, and retaining responsibility when AI contributes to instructional decisions?",
      "themes": "Professional Judgment, Agency & Human-AI Decision Making",
      "status": "In Progress"
    },
    {
      "id": "plan-v2-outline-11",
      "chapter": "Chapter 2: Review of Literature",
      "section": "Educator Professional Development and Adult Learning",
      "questions": "What characteristics make professional learning relevant, active, sustained, job-embedded, and transferable for educators? What evidence exists for online or asynchronous faculty development?",
      "themes": "Educator Professional Development & Transfer to Practice",
      "status": "Not Started"
    },
    {
      "id": "plan-v2-outline-12",
      "chapter": "Chapter 2: Review of Literature",
      "section": "Scenario-Based, Experiential, and Game-Based Learning",
      "questions": "Why use authentic cases, simulations, visual-novel framing, and staged decisions for professional learning? Which game elements support learning, and which risk becoming decorative or distracting?",
      "themes": "Authentic Scenario-Based & Game-Based Professional Learning",
      "status": "In Progress"
    },
    {
      "id": "plan-v2-outline-13",
      "chapter": "Chapter 2: Review of Literature",
      "section": "Metacognition, Reflection, and Transfer",
      "questions": "How do prediction, explanation, reflection, revision, and transfer support learning and make reasoning visible, particularly when learners interact with AI-generated feedback?",
      "themes": "Metacognition, Reflection & Learning Transfer",
      "status": "Not Started"
    },
    {
      "id": "plan-v2-outline-14",
      "chapter": "Chapter 2: Review of Literature",
      "section": "Instructional Design, Accessibility, and OSCQR",
      "questions": "Which online-course design principles support PromptCraft’s Canvas-centered cases? How should OSCQR inform design and content validity without being described as a validated AI-performance instrument unless evidence supports that use?",
      "themes": "Instructional Design, Canvas, Accessibility & OSCQR",
      "status": "Not Started"
    },
    {
      "id": "plan-v2-outline-15",
      "chapter": "Chapter 2: Review of Literature",
      "section": "Iterative Design and Action Research",
      "questions": "How do iterative game/design cycles connect to action research and reflective practice? How can the PromptCraft development log function as an audit trail without being confused with participant outcome data?",
      "themes": "Mixed Methods Action Research & Iterative Design",
      "status": "Drafted"
    },
    {
      "id": "plan-v2-outline-16",
      "chapter": "Chapter 2: Review of Literature",
      "section": "Synthesis and Research Gap",
      "questions": "What is missing when AI professional development focuses on tools and prompting rather than authentic instructional judgment? What evidence does this study add about a scenario-based intervention centered on evaluation and decision-making?",
      "themes": "All themes",
      "status": "Not Started"
    },
    {
      "id": "plan-v2-outline-17",
      "chapter": "Chapter 3: Methodology",
      "section": "Research Design",
      "questions": "What specific mixed methods action-research design will be used? When will quantitative and qualitative data be collected, and how will the strands be integrated?",
      "themes": "Mixed Methods Action Research & Iterative Design",
      "status": "In Progress"
    },
    {
      "id": "plan-v2-outline-18",
      "chapter": "Chapter 3: Methodology",
      "section": "Development of the Intervention and Design Framework",
      "questions": "Which major development decisions led to the current PromptCraft model? Which design principles emerged from the R&D log, including human reasoning before AI, authentic Canvas evidence, one objective per page, private transfer, and instructor responsibility?",
      "themes": "Authentic Scenario-Based & Game-Based Professional Learning\nProfessional Judgment, Agency & Human-AI Decision Making\nInstructional Design, Canvas, Accessibility & OSCQR",
      "status": "In Progress"
    },
    {
      "id": "plan-v2-outline-19",
      "chapter": "Chapter 3: Methodology",
      "section": "Participants, Recruitment, and Study Setting",
      "questions": "Who is the target population? What are inclusion criteria, recruitment goal, usable sample, study setting, recruitment method, incentives, and protections against professional power relationships?",
      "themes": "Mixed Methods Action Research & Iterative Design",
      "status": "Not Started"
    },
    {
      "id": "plan-v2-outline-20",
      "chapter": "Chapter 3: Methodology",
      "section": "Intervention and Duration",
      "questions": "Which fixed PromptCraft build and scenarios constitute the study intervention? What must every participant complete, what is optional, how long should completion take, and how will treatment fidelity/version control be preserved?",
      "themes": "Research Instrumentation, Process Data & Validity\nEducator Professional Development & Transfer to Practice",
      "status": "In Progress"
    },
    {
      "id": "plan-v2-outline-21",
      "chapter": "Chapter 3: Methodology",
      "section": "Data Sources and Measures",
      "questions": "Which quantitative and qualitative measures map directly to each research question? Which PromptCraft checkpoints capture participant decisions or reasoning, and which technical events should remain outside the analytic dataset?",
      "themes": "Research Instrumentation, Process Data & Validity",
      "status": "In Progress"
    },
    {
      "id": "plan-v2-outline-22",
      "chapter": "Chapter 3: Methodology",
      "section": "Application Data and Research Log",
      "questions": "How will Apps Script data, participant codes, timestamps, responses, completion events, version identifiers, and the researcher development log be stored and kept conceptually separate?",
      "themes": "Research Instrumentation, Process Data & Validity\nMixed Methods Action Research & Iterative Design",
      "status": "Drafted"
    },
    {
      "id": "plan-v2-outline-23",
      "chapter": "Chapter 3: Methodology",
      "section": "Reliability, Validity, and Measurement Evidence",
      "questions": "How will researcher-developed measures be aligned to intended outcomes, expert-reviewed, piloted, scored consistently, and revised? What evidence is needed before using terms such as validated or reliable?",
      "themes": "Research Instrumentation, Process Data & Validity",
      "status": "In Progress"
    },
    {
      "id": "plan-v2-outline-24",
      "chapter": "Chapter 3: Methodology",
      "section": "Ethical Considerations and Data Management",
      "questions": "How will informed consent, privacy, minimal collection of identifiers, withdrawal, access restrictions, retention/deletion, and separation of research data from private My Course work be handled?",
      "themes": "Research Instrumentation, Process Data & Validity\nMixed Methods Action Research & Iterative Design",
      "status": "Drafted"
    },
    {
      "id": "plan-v2-outline-25",
      "chapter": "Chapter 4: Data Analysis Plan",
      "section": "Quantitative Analysis",
      "questions": "Which descriptive statistics and, if justified by final sample size and design, inferential analyses match the finalized variables and measurement levels?",
      "themes": "Research Instrumentation, Process Data & Validity",
      "status": "Not Started"
    },
    {
      "id": "plan-v2-outline-26",
      "chapter": "Chapter 4: Data Analysis Plan",
      "section": "Qualitative Analysis",
      "questions": "How will participant explanations, reflections, feedback, and relevant researcher-log entries be organized and coded? How will negative or contradictory cases be retained?",
      "themes": "Mixed Methods Action Research & Iterative Design\nMetacognition, Reflection & Learning Transfer",
      "status": "Not Started"
    },
    {
      "id": "plan-v2-outline-27",
      "chapter": "Chapter 4: Data Analysis Plan",
      "section": "Integration of Quantitative and Qualitative Evidence",
      "questions": "How will quantitative performance patterns be compared with participant explanations and researcher observations to identify agreement, expansion, and contradiction by research question?",
      "themes": "Mixed Methods Action Research & Iterative Design",
      "status": "Drafted"
    },
    {
      "id": "plan-v2-outline-28",
      "chapter": "Chapter 5: Anticipated Significance, Limitations, and Dissemination",
      "section": "Anticipated Significance and Implications",
      "questions": "What can the study reasonably show about interactive AI-related professional learning, educator judgment, and useful design features for local practice?",
      "themes": "Educator Professional Development & Transfer to Practice\nEducator AI Literacy & Critical Evaluation",
      "status": "Drafted"
    },
    {
      "id": "plan-v2-outline-29",
      "chapter": "Chapter 5: Anticipated Significance, Limitations, and Dissemination",
      "section": "Limitations",
      "questions": "How will the paper address a potentially small/self-selected sample, varied prior AI experience, the researcher’s dual role, researcher-developed measures, novelty effects, and limits on generalization?",
      "themes": "Research Instrumentation, Process Data & Validity\nMixed Methods Action Research & Iterative Design",
      "status": "Drafted"
    },
    {
      "id": "plan-v2-outline-30",
      "chapter": "Chapter 5: Anticipated Significance, Limitations, and Dissemination",
      "section": "Dissemination",
      "questions": "How will findings be shared with faculty, educational leaders, professional audiences, and the Montana Legislature while clearly distinguishing pilot evidence from broader policy claims?",
      "themes": "Educator Professional Development & Transfer to Practice",
      "status": "Drafted"
    },
    {
      "id": "plan-v2-outline-31",
      "chapter": "Appendices",
      "section": "Intervention Map, Instruments, Consent, Recruitment, and Data Management",
      "questions": "Build the fixed-version intervention map linking scenario interactions to learning objectives and measures. Add final recruitment materials, informed consent, data-collection instruments, and data-management procedures after approval.",
      "themes": "Research Instrumentation, Process Data & Validity\nAll themes",
      "status": "In Progress"
    }
  ],
  "reading": [
    {
      "id": "plan-v2-reading-01",
      "phase": "Phase 1: Literature Foundation",
      "theme": "Educator AI Literacy & Critical Evaluation",
      "reading": "Current review of educator AI-literacy frameworks and empirical studies (2023-2026)",
      "goal": "Identify 3-5 strong definitions/frameworks that include evaluation and responsible use, not only tool operation or prompting. Record which constructs PromptCraft actually addresses.",
      "target": "Early October 2026",
      "done": false
    },
    {
      "id": "plan-v2-reading-02",
      "phase": "Phase 1: Literature Foundation",
      "theme": "Professional Judgment, Agency & Human-AI Decision Making",
      "reading": "Search: educator agency, automation bias, overreliance, and human oversight in generative-AI use",
      "goal": "Build the literature base for PromptCraft’s central design principle that AI can analyze or advise while the educator retains responsibility for the instructional decision.",
      "target": "October 2026",
      "done": false
    },
    {
      "id": "plan-v2-reading-03",
      "phase": "Phase 1: Literature Foundation",
      "theme": "Authentic Scenario-Based & Game-Based Professional Learning",
      "reading": "Review serious games, scenario-based learning, simulation, and experiential learning for adult/professional education",
      "goal": "Separate evidence for authentic decision practice from generic claims that gamification increases engagement. Identify literature that fits PromptCraft’s actual mechanics.",
      "target": "October 2026",
      "done": false
    },
    {
      "id": "plan-v2-reading-04",
      "phase": "Phase 1: Literature Foundation",
      "theme": "Educator Professional Development & Transfer to Practice",
      "reading": "Review effective faculty/educator professional development and transfer-to-practice literature",
      "goal": "Identify characteristics of useful professional learning such as relevance, active practice, job-embedded transfer, sustained support, and applicability to educators’ own courses.",
      "target": "October 2026",
      "done": false
    },
    {
      "id": "plan-v2-reading-05",
      "phase": "Phase 1: Literature Foundation",
      "theme": "Instructional Design, Canvas, Accessibility & OSCQR",
      "reading": "Search peer-reviewed literature on OSCQR, online-course organization, accessibility, alignment, and learner navigation",
      "goal": "Ground the Canvas-centered instructional problems in research and determine what claims can legitimately be made about OSCQR as a design framework or measurement source.",
      "target": "October 2026",
      "done": false
    },
    {
      "id": "plan-v2-reading-06",
      "phase": "Phase 1: Literature Foundation",
      "theme": "Metacognition, Reflection & Learning Transfer",
      "reading": "Review prediction, reflection, explanation, metacognition, and transfer in adult or professional learning",
      "goal": "Support the PromptCraft loop in which participants predict, explain, review evidence, revise, and apply principles to their own course context.",
      "target": "Late October 2026",
      "done": false
    },
    {
      "id": "plan-v2-reading-07",
      "phase": "Phase 1: Literature Foundation",
      "theme": "Mixed Methods Action Research & Iterative Design",
      "reading": "Macklin & Sharp plus current action-research and iterative-design methodology sources",
      "goal": "Strengthen the conceptual connection among prototyping, playtesting, reflective practice, intervention revision, and the development log without collapsing design evidence into participant outcome evidence.",
      "target": "Late October 2026",
      "done": false
    },
    {
      "id": "plan-v2-reading-08",
      "phase": "Phase 2: Study Design",
      "theme": "Research Instrumentation, Process Data & Validity",
      "reading": "Researcher-developed measures: content validity, expert review, pilot testing, scoring criteria, reliability, and inter-rater agreement",
      "goal": "Create a defensible validation plan for PromptCraft measures and identify established measures that could be adapted instead of inventing everything from scratch.",
      "target": "Before instruments are finalized",
      "done": false
    },
    {
      "id": "plan-v2-reading-09",
      "phase": "Phase 2: Study Design",
      "theme": "Research Instrumentation, Process Data & Validity",
      "reading": "Process data and learning analytics validity, event-log interpretation, and data minimization",
      "goal": "Determine which in-app actions can be treated as meaningful evidence of reasoning and which should remain technical telemetry. Support privacy-conscious collection decisions.",
      "target": "Before data collection",
      "done": false
    },
    {
      "id": "plan-v2-reading-10",
      "phase": "Phase 2: Study Design",
      "theme": "Mixed Methods Action Research & Iterative Design",
      "reading": "Mixed methods design and integration: convergent, explanatory, exploratory, and embedded approaches",
      "goal": "Select and justify the specific mixed methods design; define collection sequence, priority, and integration by research question.",
      "target": "Before Chapter 3 is finalized",
      "done": false
    },
    {
      "id": "plan-v2-reading-11",
      "phase": "Phase 2: Study Design",
      "theme": "Mixed Methods Action Research & Iterative Design",
      "reading": "Action research in practitioner-developed educational interventions",
      "goal": "Clarify how action research fits the study, researcher positionality, iterative improvement, and the boundary between development documentation and participant research data.",
      "target": "Before Chapter 3 is finalized",
      "done": false
    },
    {
      "id": "plan-v2-reading-12",
      "phase": "Phase 2: Study Design",
      "theme": "Research Instrumentation, Process Data & Validity",
      "reading": "MSU IRB/TOPAZ requirements, informed consent, recruitment, privacy, and data-management guidance",
      "goal": "Translate the proposed data flow into approved recruitment, consent, participant coding, storage, retention, withdrawal, and deletion procedures.",
      "target": "Before IRB submission",
      "done": false
    },
    {
      "id": "plan-v2-reading-13",
      "phase": "Phase 2: Study Design",
      "theme": "Educator Professional Development & Transfer to Practice",
      "reading": "Pilot-study and small-sample intervention design literature",
      "goal": "Determine a feasible comparison/pre-post approach and claims appropriate to the likely sample size, setting, and intervention duration.",
      "target": "Before study design is fixed",
      "done": false
    },
    {
      "id": "plan-v2-reading-14",
      "phase": "Phase 3: Paper Synthesis",
      "theme": "All themes",
      "reading": "Chapter-by-chapter literature gap audit against the current professional paper",
      "goal": "For each section, mark claims that already have support, claims still needing sources, obsolete literature targets, and places where the PromptCraft development record supplies design evidence rather than scholarly evidence.",
      "target": "November 2026",
      "done": false
    },
    {
      "id": "plan-v2-reading-15",
      "phase": "Phase 3: Paper Synthesis",
      "theme": "All themes",
      "reading": "Final current-literature update and citation verification",
      "goal": "Refresh fast-moving AI literature, verify publication details and source quality, and make sure every substantive claim in the final paper is supported by the right type of evidence.",
      "target": "Before final paper submission",
      "done": false
    }
  ],
  "backups": [],
  "meta": {
    "version": 1,
    "generated": "2026-09-29",
    "project": "PromptCraft",
    "researchPlanVersion": 2,
    "researchPlanUpdated": "2026-09-29"
  }
};
