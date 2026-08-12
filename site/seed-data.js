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
      "theme": "AI Literacy & Prompt Engineering",
      "authors": "Laura Kristen Allen, Panayiota Kendeou",
      "date": "2024-03-01",
      "title": "ED-AI Lit: An Interdisciplinary Framework for AI Literacy in Education",
      "publisher": "Sage Journals",
      "apa": "Allen, L. K., & Kendeou, P. (2023). Ed-Ai Lit: An interdisciplinary framework for AI literacy in Education. Policy Insights from the Behavioral and Brain Sciences, 11(1), 3–10. https://doi.org/10.1177/23727322231220339 ",
      "keyArgument": "AI literacy should be a multidimensional skillset including knowledge, evaluation, collaboration, context, autonomy, and ethics.",
      "connection": "Frames prompting as human-AI collaboration, evaluation, and decision-making. Useful for defining prompting as a literacy/competency, not just a technique.",
      "methodology": "Conceptual / theoretical framework. Literature-informed. No experimental data.",
      "status": "Not Started",
      "priority": "Medium",
      "notes": "“AI literacy… encompasses a set of competencies that enables students to understand how AI works, critically evaluate them, and use them effectively to communicate and collaborate in various contexts.” (p.2)\n\n“AI literacy… focuses on how to communicate and collaborate with AI in productive ways.” (p.2)",
      "archiveFile": "AI Literacy & Prompt Engineering/allen-kendeou-2023-ed-ai-lit-an-interdisciplinary-framework-for-ai-literacy-in-education.pdf"
    },
    {
      "theme": "AI Literacy & Prompt Engineering",
      "authors": "Viktoriya Olari, \nRalf Romeike",
      "date": "October 18–20, 2021",
      "title": "Addressing AI and Data Literacy in Teacher Education: A Review of Existing Educational Frameworks",
      "publisher": "Proceedings of the 16th Workshop in Primary and Secondary Computing Education",
      "apa": "Olari, V., & Romeike, R. (2021). Addressing AI and Data Literacy in teacher education: A review of existing educational frameworks. The 16th Workshop in Primary and Secondary Computing Education, 1–2. https://doi.org/10.1145/3481312.3481351 ",
      "keyArgument": "Current frameworks overemphasize data collection & evaluation, while ignoring stages like cleaning, implementation, and optimization.\n\nTeachers need training that includes working with datasets, training models, and evaluating outputs.",
      "connection": "Mirrors a gap in prompt craft research, where people focus on prompts but ignore preprocessing, iteration, and system design.",
      "methodology": "Framework comparison",
      "status": "Not Started",
      "priority": "Medium",
      "notes": "“AI… cannot be appropriately grasped without data literacy.” (p.1)\n\n“AI-related competencies at… cleansing, implementation, optimization… are not covered at all…” (p.2)\n\nPrompting research has the same problem\n\nPeople focus on:\n  -Input (prompt)\n  -Output (response)\nBut ignore:\n  -transformation\n  -iteration\n  -system-level design",
      "archiveFile": "AI Literacy & Prompt Engineering/Addressing_AI_Data_Literacy.pdf"
    },
    {
      "theme": "AI Literacy & Prompt Engineering",
      "authors": "Thomas K.F. Chiu,\nZubair Ahmad,  \nMurod Ismailov,\nIsmaila Temitayo Sanusi",
      "date": "2024-06-01",
      "title": "What are artificial intelligence literacy and competency? A comprehensive framework to support them",
      "publisher": "Computers and Education Open",
      "apa": "Chiu, T. K. F., Ahmad, Z., Ismailov, M., & Sanusi, I. T. (2024). What are Artificial Intelligence Literacy and competency? A comprehensive framework to support them. Computers and Education Open, 6, 100171. https://doi.org/10.1016/j.caeo.2024.100171 ",
      "keyArgument": "Students must learn how to prompt effectively when using tools like ChatGPT.\n\nPrompt engineering is identified as a future research direction.",
      "connection": "Explicitly names prompting as a skill.\n\nResearch area in prompting as emerging and underdeveloped.",
      "methodology": "Practitioner-informed (teacher observations and recommendations).\n\nLiterature + practitioner synthesis identifying research gaps.",
      "status": "Not Started",
      "priority": "High",
      "notes": "“The students need to learn how to prompt effectively when using ChatGPT.” (p.6)\n\n“Prompt engineering… [is] the technique of structuring text so that a generative AI model can comprehend and understand it.” (p.6)\n\n“AI competency… includes… the ability to effectively communicate and collaborate with AI technologies.” (p.4)\n\n“Prompt engineering… rephrase a query, select a style, provide context, or assign a role…” (p.7)",
      "archiveFile": "AI Literacy & Prompt Engineering/AI_Literacy_Competency.pdf"
    },
    {
      "theme": "AI Literacy & Prompt Engineering",
      "authors": "Davy Tsz Kit Ng, \nJac Ka Lok Leung, \nMaggie Jiahong Su, \nIris Heung Yue Yim, \nMaggie Shen Qiao,\nSamuel Kai Wah Chu ",
      "date": "2022-12-08",
      "title": "AI Literacy from Educators’ Perspectives",
      "publisher": "AI Literacy in K-16 Classrooms",
      "apa": "Ng, D. T., Leung, J. K., Su, M. J., Yim, I. H., Qiao, M. S., & Chu, S. K. (2022). Ai literacy from educators’ perspectives. AI Literacy in K-16 Classrooms, 131–139. https://doi.org/10.1007/978-3-031-18880-0_10 ",
      "keyArgument": "Educators must develop AI digital competencies to effectively teach and integrate AI into learning environments.\n\nAI tools enhance learning but introduce risks like plagiarism, overreliance, and misuse.\n\nTeachers must help students understand AI limitations, bias, and ethical implications.",
      "connection": "Strong conceptual support. Reinforces PromptCraft as more than prompting mechanics—includes judgment, decision-making, and mindset.\n\nDirectly supports evaluation, skepticism, and responsible prompting behaviors.\n\nThis is core to prompt evaluation and hallucination detection skills.",
      "methodology": "Conceptual + prior research synthesis.\n\nLiterature-supported discussion of AI in education.",
      "status": "Not Started",
      "priority": "Medium",
      "notes": "“AI literacy can be conceptualized as the knowledge, skills, and attitudes necessary to be competitive in the twenty-first-century workforce.” (p.131)\n\n“Teachers should not view AI literacy as an independent domain but an avenue to develop other important skill sets such as… critical thinking, collaboration, and communication.” (p.132)",
      "archiveFile": "AI Literacy & Prompt Engineering/AI Literacy from Educators’ Perspectives.pdf"
    },
    {
      "theme": "AI Literacy & Prompt Engineering",
      "authors": "Liat Eyal",
      "date": "2025-12-25",
      "title": "Rethinking artificial-intelligence literacy through the lens of teacher educators: The adaptive AI model",
      "publisher": "Computers and Education Open",
      "apa": "Eyal, L. (2025). Rethinking artificial-intelligence literacy through the lens of teacher educators: The adaptive AI model. Computers and Education Open, 9, 100291. https://doi.org/10.1016/j.caeo.2025.100291 ",
      "keyArgument": "Existing AI literacy models fail because they ignore context (infrastructure, culture, role differences).\n\nAI literacy should be evaluated across three axes: Context Fit, Professional Needs, Dynamic Development.\n\nEffective AI literacy includes reflection, adaptation, and contextual decision-making.",
      "connection": "Supports PromptCraft as a flexible, adaptive skill system, not a linear “learn prompts → mastery” progression.\n\nThese map cleanly to prompt usage context, task-specific prompting, and iterative refinement over time.\n\nThis is essentially metacognitive prompting and evaluation.",
      "methodology": "Iterative model development grounded in participant feedback and case analysis.\n\nThis is essentially metacognitive prompting and evaluation.",
      "status": "Not Started",
      "priority": "High",
      "notes": "“AI literacy being a continuum rather than a binary state.” (p.1)\n\n“AI literacy is a continuous process… shaped by technological innovation, changing roles, and professional growth.” (p.8)\n\n“Assessment tools… often overlook socio-cultural factors and infrastructure limitations…” (p.6)",
      "archiveFile": "AI Literacy & Prompt Engineering/Rethinking AI Literacy.pdf"
    },
    {
      "theme": "AI Literacy & Prompt Engineering",
      "authors": "Kelly Mills, \nPati Ruiz, \nKeun-woo Lee, \nMerijke Coenraad, \nJudi Fusco, \nJeremy Roschelle,\nJosh Weisgrau",
      "date": "2024-06-01",
      "title": "AI Literacy: A Framework to  Understand, Evaluate, and Use Emerging Technology ",
      "publisher": "Digital Promise",
      "apa": "Ruiz, P., Mills, K., Lee, K., Coenraad, M., Fusco, J., Roschelle, J., & Weisgrau, J. (2024). Ai Literacy: A Framework to Understand, Evaluate, and Use Emerging Technology. https://doi.org/10.51388/20.500.12265/218 ",
      "keyArgument": "AI literacy consists of three interconnected modes: Understand, Evaluate, Use\n\nPrompting is explicitly identified as a skill within “Creating with AI”\n\nAI literacy includes six core practices (data, ethics, communication, etc.)",
      "connection": "This is basically a core gameplay loop for PromptCraft.\n\nPrompting is a teachable competency.\n\nSupports multiple PromptCraft scenarios and domains.",
      "methodology": "Framework synthesis (research + practitioner input + existing models)\n\nApplied examples and skill mapping\n\nEducational design perspective",
      "status": "Not Started",
      "priority": "High",
      "notes": "“AI literacy includes the knowledge and skills that enable people to critically understand, evaluate, and use AI systems…” (p.4)\n\n“The skill of GenAI prompting involves creating good questions or commands…” (p.20)\n\n“Effectively prompting… requires clarity, specificity, experimentation, and patience.” (p.20)",
      "archiveFile": "AI Literacy & Prompt Engineering/AI Literacy_ A Framework to Understand, Evaluate, and Use Emerging Technology.pdf"
    },
    {
      "theme": "AI Literacy & Prompt Engineering",
      "authors": "Krishna Chaitanya Rao Kathala,\nShashank Palakurthi",
      "date": "2024-09-01",
      "title": "Article Review AI Literacy Framework and Strategies for Implementation in Developing Nations",
      "publisher": "Proceedings of the 2024 the 16th International Conference on Education Technology and Computers",
      "apa": "Kathala, K. C., & Palakurthi, S. (2024). Ai Literacy Framework and strategies for implementation in developing nations. Proceedings of the 2024 16th International Conference on Education Technology and Computers, 418–422. https://doi.org/10.1145/3702163.3702449 ",
      "keyArgument": "AI literacy is a foundational 21st-century skill (like reading/writing)\n\nAI literacy includes understand, evaluate, and use AI\n\nAI literacy must be contextualized and accessible",
      "connection": "Direct alignment with your gameplay loop\n\nStrong for game-based learning approach",
      "methodology": "Synthesized from prior research\n\nImplementation strategies",
      "status": "Not Started",
      "priority": "High",
      "notes": "“AI literacy encompasses the knowledge, skills, and attitudes necessary to understand, critically evaluate, and engage with AI technologies.” (p. 1)\n\n“AI literacy is becoming as fundamental as traditional literacy and numeracy skills.” (p.1)\n\n“AI literacy enables individuals to critically evaluate AI technologies… and use AI as a tool…” (p.2)",
      "archiveFile": "AI Literacy & Prompt Engineering/Article Review AI Literacy Implementation in Developing Nations.pdf"
    },
    {
      "theme": "AI Overreliance & Critical Evaluation",
      "authors": "Tom Duenas, \nDiana Ruiz",
      "date": "2024-11-12",
      "title": "The Risks of Human Overreliance on Large Language Models for Critical Thinking",
      "publisher": "Research Gate",
      "apa": "Duenas, T. (2024). Assessing the Risks of Human Overreliance on Large Language Models for Critical Thinking. Research Gate. https://doi.org/10.13140/RG.2.2.26002.06082",
      "keyArgument": "Increasing reliance on LLMs for cognitive tasks introduces ethical, educational, and cognitive risks.\n\nOverreliance may lead to cognitive atrophy, particularly in critical thinking and reasoning skills.\n\nLLMs are effective at data retrieval and pattern recognlition, but weaker in ethical reasoning, contextual interpretation, and nuanced judgement.\n\nHuman-AI interaction should be framed as cognitive symbiosis, not replacement.\n\nMaintaining human agency and critical evaluation is essential in AI-augmented environments.\n\nEducation must shift to explicitly teach: evaluation of AI outputs, prompt engineering, and AI literacy and ethical reasoning.",
      "connection": "Directly supports PromptCraft's core problem space: AI overreliance \n\nReinforces need for evaluation mechanics (not just prompting), hallucination detection scenarios, and decision-making under amibuity.\n\nSupports framing AI as a cognitive partner, not an authority\n\nStrong justification for forcing players to question AI outputs and designing confidently wrong AI responses\n\nAligns with the goal of teaching metacognition, judgement, and responsible AI use ",
      "methodology": "Theoretical + interdisciplinary synthesis\n\nCognitive science, AI research, ethics, and education literature\n\nIncludes conceptual models and applied frameworks",
      "status": "Not Started",
      "priority": "High",
      "notes": "“The increasing dependence on LLMs for critical thinking poses significant ethical and educational challenges…” (p.2)\n\n“There is a risk of cognitive atrophy… especially in areas requiring critical thinking.” (p.1)\n\n“The ability to critically evaluate the outputs of… LLMs… will be crucial skills in the coming years.” (p.3)",
      "archiveFile": "AI Overreliance & Critical Evaluation/Assessing_the_Risks_of_Human_Overrelianc.pdf"
    },
    {
      "theme": "AI Overreliance & Critical Evaluation",
      "authors": "Chunpeng Zhai, \nSantoso Wibowo,\nLily D. Li ",
      "date": "2024-06-18",
      "title": "The effects of over-reliance on AI dialogue systems on students' cognitive abilities: a systematic review",
      "publisher": "Smart Learning Environments",
      "apa": "Zhai, C., Wibowo, S., & Li, L. D. (2024). The effects of over-reliance on AI dialogue systems on students’ cognitive abilities: A systematic review. Smart Learning Environments, 11(1). https://doi.org/10.1186/s40561-024-00316-7 ",
      "keyArgument": "Users tend to overtrust AI outputs, even when incorrect\n\nOverreliance reduces critical thinking and verification behaviors\n\nUsers often fail to detect AI errors without prompting or training\n\nTraining improves users’ ability to critically evaluate AI outputs",
      "connection": "Justifies building friction and evaluation mechanics\n\nYour scenarios can simulate this failure safely\n\nDangerous. Also extremely gameable in simulation",
      "methodology": "Empirical + experimental studies\n\nBehavioral research\n\nExperimental tasks with AI outputs",
      "status": "Not Started",
      "priority": "High",
      "notes": "\"It requires the acumen to scrutinize AI outputs and make judicious decisions about their educational implementation.” (p. 2)\n\n“The potential pitfalls of AI—such as unreliable recommendations and algorithmic biases—highlight the need for educators to develop a nuanced understanding of AI’s limitations…” (p. 5)\n\n“Developing educators’ digital competencies in AI literacy is essential to enabling them to critically assess, interact with, and effectively apply AI tools…” (p. 5)\n\n“The effects of over-reliance on AI dialogue systems on students’ cognitive abilities…” (p. 17-18)",
      "archiveFile": "AI Overreliance & Critical Evaluation/reliance on AI dialogue systems.pdf"
    },
    {
      "theme": "Synchronous vs Asynchronous Design",
      "authors": "Imari Cheyne Tetu, \nJun Fu, \nCaitlin K. Kirby, \nStephen Thomas, \nShannon Kelly, \nScott Schopieray",
      "date": "2024-03-15",
      "title": "Developing Asynchronous Workshop Models for Professional Development ",
      "publisher": "Communication Design Quarterly",
      "apa": "Tetu, I. C., Kelly, S., Fu, J., Kirby, C. K., Schopieray, S., & Thomas, S. (2024). Developing asynchronous workshop models for professional development. Communication Design Quarterly, 12(3), 37–43. https://doi.org/10.1145/3563890.3713036 ",
      "keyArgument": "Asynchronous professional development workshops can provide flexibility, accessibility, and broader participation opportunities compared to purely synchronous formats.\n\nSimply recording synchronous workshops is insufficient for meaningful asynchronous learning. Effective asynchronous design requires intentional engagement structures, multimodal interaction, accessibility planning, and deliberate instructional design.\n\nParticipant engagement was highest with embedded workshop materials, reflective activities, and familiar communication spaces.\n\nEngagement in asynchronous collaborative activities declined when deadlines were unclear, expectations were ambiguous, or interaction occurred in unfamiliar platforms.\n\n\n\n\n\n",
      "connection": "Reinforces PromptCraft's likely strengths self-paced iteration, multimodal interaction, reflection, scaffolded activities, and replayability.",
      "methodology": "Experience report and evaluative mixed-methods approach.",
      "status": "Not Started",
      "priority": "High",
      "notes": "“Accessibility in learning requires multiple means of engagement, of representation, and of action and expression.” (p. 37–38)",
      "archiveFile": "Synchronous vs Asynchronous Design/Developing Asynchronous Workshop.pdf"
    },
    {
      "theme": "Synchronous vs Asynchronous Design",
      "authors": "Alejandra Álvarez-Chaves, \nSilvia Saborío-Taylor",
      "date": "2025-06-08",
      "title": "Hybrid Learning in Higher Education: Considerations for Its Implementation in Course Design",
      "publisher": "Journal of Digital Educational Technology",
      "apa": "Álvarez-Chaves, A., & Saborío-Taylor, S. (2025). Hybrid learning in Higher Education: Considerations for its implementation in course design. Journal of Digital Educational Technology, 5(1). https://doi.org/10.30935/jdet/15859",
      "keyArgument": "Successful hybrid implementation depends on balancing synchronous and asychronous activities, aligning learning objectives, and designing coherent learning sequences.\n\nThe article frames hybrid learning not simply as technology integration but as a restructuring of learning environments around flexibility and learner-centered engagement.",
      "connection": "Extremely strong connection to PromptCraft's potential as a hybrid, multimodal, student-centered AI literacy environment.\n\n",
      "methodology": "Conceptualization of hybrid learning",
      "status": "Not Started",
      "priority": "High",
      "notes": "“Hybrid learning models are emerging as an innovation that combines student engagement with sustainability and overcomes the limitations of the traditional classroom.” (p. 1)\n\n“Digital devices become flexible tools for learning, reducing boundaries between physical and virtual environments…” (p. 2)",
      "archiveFile": "Synchronous vs Asynchronous Design/hybrid-learning-in-higher-education.pdf"
    },
    {
      "theme": "Instructional Design & OSCQR",
      "authors": "Jingrong Xie, \nYuna Ferguson, \nGulinna A, Mary Rice, \nMark Nichols",
      "date": "2024-07-17",
      "title": "Modification and evaluation of an open-source rubric guiding inclusive design",
      "publisher": "Distance Education",
      "apa": "Xie, J., Ferguson, Y., A, G., Rice, M., & Nichols, M. (2024). Modification and evaluation of an open-source rubric guiding inclusive design. Distance Education, 46(3), 452–476. https://doi.org/10.1080/01587919.2024.2383227 ",
      "keyArgument": "Existing online course quality assurance frameworks, including OSCQR, require modification to better support inclusive design, equity, accessibility, and diverse learner needs in higher education.\n\nThe study argues that online review should move beyond compliance and technical structure toward meaningul inclusion, authentic angagement, and equitable learner support.",
      "connection": "Reinforces the importance of scaffolding, learner agency, feedback lops, authentic assessment, and reflective learning environments.\n\nReinforces the importance of scaffolding, learner agency, feedback loops, authentic assessment, and reflective learning environments.\n\nSupports simulation/game-based systems where learners choose pathways, reflect on outcomes, and interact with adaptive supports.\n\nSupports simulation/game-based systems where learners choose pathways, reflect on outcomes, and interact with adaptive supports.\n\nThe revised OSCQR elements align surprisingly well with good game design clear onboarding, progression systems, scaffolded mechanics, player autonomy, feedback systems, and inclusive participation.\n\nCould help frame PromptCraft's emphasis on multiple pathways, iterative learning, small-stakes experimentation, and reducing cognitive barriers.\n\nCould help frame PromptCraft not marely as \"AI training,\" but as an inclusive instructional design environment for AI literacy development.",
      "methodology": "Descriptive mixed-methods evaluation study\n\nRevised OSCQR rubric development process\n\nSurvey evaluation",
      "status": "Not Started",
      "priority": "High",
      "notes": "“Many quality assurance frameworks are in need of modification and evaluation before they can support the alignment of inclusive course design and pedagogies…” (p. 452)\n\n“Online education holds promise for being inclusive when it is designed flexibly and with accessibility as a top priority.” (p. 453)\n",
      "archiveFile": "Instructional Design & OSCQR/Modification and evaluation of an open-source rubric guiding inclusive design.pdf"
    },
    {
      "theme": "Instructional Design & OSCQR",
      "authors": "Kristy Plander, \nRenee Hathaway, \nDeb Maeder",
      "date": "2025-04-23",
      "title": "Examining Faculty Perceptions of Distance Course Quality Review Feedback ",
      "publisher": "Online Learning",
      "apa": "Plander, K., Hathaway, R., & Maeder, D. (2025). Examining faculty perceptions of distance course quality review feedback. Online Learning, 29(2). https://doi.org/10.24059/olj.v29i2.4436 ",
      "keyArgument": "Faculty perceptions of course quality review feedback significantly influence whether they accept, process, and implement course improvement recommendations.\n\nWhile feedback improved courses, participants also described it as overwhelming, emotionally difficult, and stressful when overly critical or excessively detailed.",
      "connection": "Strong connection to PromptCraft's emphasis on reflection, scaffolding, iterative improvement, and emotionally safe learning environments.\n\nThe findings directly support PromptCraft mechanics involving guided reflection, feedback prioritization, iterative revision, and adaptive support systems.",
      "methodology": "Quantitative surveys and interviews",
      "status": "Not Started",
      "priority": "High",
      "notes": "“Employing a relational approach shifted the focus from an isolated course review, which can seem like surveillance, to a long-term collaboration…” (p. 83)\n\n“There’s so much feedback you’re getting…there’s times when it’s just we’re in survival mode as faculty…” (p. 89)\n\n“Participants noted that reviewers can support course changes by providing clarification of how criteria can be met and indicating priority improvement areas.” (p. 91)",
      "archiveFile": "Instructional Design & OSCQR/Faculty Perceptions of Distance Courses.pdf"
    },
    {
      "theme": "Game-Based & Simulation Learning",
      "authors": "Katerina Tzafilkou,\nNicolaos Protogeros,\nParaskevi Mikrouli",
      "date": "2026-04-24",
      "title": "Applications and Learning Outcomes of Game Based Learning in Education ",
      "publisher": "International Educational Review",
      "apa": "Mikrouli, P., Tzafilkou, K., & Protogeros, N. (2024). Applications and learning outcomes of game based learning in Education. International Educational Review, 25–54. https://doi.org/10.58693/ier.212",
      "keyArgument": "GBL enhances critical thinking, problem-solving, and real-world application\n\nSimulation games allow learners to practice real-world decision-making safely\n\nEffective GBL requires alignment with learning objectives and careful design\n\nImmediate feedback and iterative learning are core to GBL effectiveness\n\nNot all GBL is effective; outcomes vary based on design, context, and implementation\n\n",
      "connection": "Direct overlap with prompting as a cognitive skill\n\nDirect justification for PromptCraft as a simulation environment\n\nPrevents your game from becoming “fun but useless”\n\nPerfect match with prompt → output → refine loop",
      "methodology": "Meta-level synthesis of empirical studies\n\nComparative analysis of game types\n\nCross-study evaluation of effectiveness",
      "status": "Not Started",
      "priority": "Medium",
      "notes": "“GBL demonstrates a positive impact on learning outcomes and engagement… enhancing students’ understanding of complex concepts and fostering real-world application.” (p.1)\n\n“Games often require players to think critically, problem-solve, and make decisions… leading to deeper understanding.” (p.14)\n\n“Simulation games… allow learners to practice key concepts, procedures, and decision-making skills in a hands-on, interactive way.” (p.11)",
      "archiveFile": "Game-Based & Simulation Learning/applications-and-learning-outcomes-of-game-based-learning-in-education-14327.pdf"
    },
    {
      "theme": "Game-Based & Simulation Learning",
      "authors": "Sara Rye, \nMicael Sousa, \nCarla Sousa ",
      "date": "2025-02-01",
      "title": "Introduction to Game-Based Learning",
      "publisher": "Transformative Learning Through Play",
      "apa": "Rye, S., Sousa, M., & Sousa, C. (2025). Transformative Learning through Play. https://doi.org/10.1007/978-3-031-78523-8 ",
      "keyArgument": "GBL combines pedagogy, game mechanics, and interaction to improve learning outcomes.\n\nGames promote active, experiential, and constructivists learning.\n\nEffective GBL requires alignment between mechanics and learning outcomes.\n\nGames inherently support feedback, iteration, and problem-solving.\n\nSimulation and role-based games enable real-world skill practice.\n\nGBL supports meacognition, critical thinking, and reflection.",
      "connection": "Supports PromptCraft being designed as a learning system, not just a tool.\n\nBuild on learning by doing.\n\nValidates need for intentional scenario design.",
      "methodology": "Theoretical + literature synthesis\n\nMulti-theory integration (constructivism, experiential, sociocultural)\n\nLearning theory integration",
      "status": "Not Started",
      "priority": "Medium",
      "notes": "“Games use intrinsic motivational aspects to enable active engagement, skill development, collaborative learning and problem-solving.” (p.31)\n\n“Games are structured activities governed by rules, goals and challenges that promote problem-solving and decision-making.” (p.36)\n\n“GBL promotes experiential learning… allowing students to apply knowledge in simulated or real worlds.” (p.48)\n\n“Learning occurs through active participation, reflection, and interaction.” (p.56–57)",
      "archiveFile": "Game-Based & Simulation Learning/Introduction to Game-Based Learning.pdf"
    },
    {
      "theme": "Game-Based & Simulation Learning",
      "authors": "Matthew Daniels, \nEamonn Kelly, \nSandra Flynn, \nJohn Kelly",
      "date": "2025-12-01",
      "title": "AI-Enhanced Game-Based Learning for Project Leadership",
      "publisher": "Project Leadership and Society",
      "apa": "Daniels, M., Kelly, É., Flynn, S., & Kelly, J. (2025). Advancing Project Leadership Education through AI-enhanced game-based learning. Project Leadership and Society, 6, 100189. https://doi.org/10.1016/j.plas.2025.100189 ",
      "keyArgument": "AI-GBL bridges the theory -practice gap by placing learners in realistic, complex simulations\n\nGenerative AI can act as a pedagogical co-orchestrator not just a tool.\n\nLearning improves through adaptive decision-making, reflection and ethical reasoning.\n\nAI-GBL supports development of adaptive expertise (handling ambiguity, uncertainty)\n\nProductive failure and ambiguity are essential for deep learning.\n\nEthical AI literacy requires critical evaluation of AI outputs and decision-making",
      "connection": "AI as an interactive partner in learning, not just output generator.\n\nPrompting is inherently ambiguous and iterative",
      "methodology": "Design-based, mixed-methods study.\n\nQuantitative gains + qualitative evidence\n\nTheory integration + observed learner behavior",
      "status": "Not Started",
      "priority": "Medium",
      "notes": "“AI-GBL… enables students to rehearse complex project challenges… within psychologically safe yet realistic simulations.” (p.1)\n\n“AI… [acts] as a reflective partner capable of scaffolding adaptive expertise.” (p.2)\n\n“Some students admitted to an over-reliance on the AI’s first suggestion…” (p.4)",
      "archiveFile": "Game-Based & Simulation Learning/AI-enhanced game-based learning.pdf"
    }
  ],
  "themes": [
    {
      "theme": "AI Literacy & Prompt Engineering",
      "question": "What does it mean to be AI literate? Is prompting a teachable skill? Where is the structured training gap for educators?",
      "searchTerms": "Search: AI literacy framework educators, prompt engineering teachable skill",
      "chapters": "Chapter 1 (problem statement)\nChapter 2 (core literature)",
      "scenarios": "S1, S2, S3 (all prompting scenarios)",
      "sourcesFound": 7,
      "status": "In Progress"
    },
    {
      "theme": "AI Overreliance & Critical Evaluation",
      "question": "What does research say about uncritical acceptance of AI output? How prevalent is hallucination and bias acceptance among educators?",
      "searchTerms": "Search: AI overreliance higher education, hallucination acceptance educators, critical AI evaluation faculty",
      "chapters": "Chapter 1 (problem statement)\nChapter 2 (core literature)",
      "scenarios": "S4 (Hallucination), S6 (Sync Bias), S7 (Overreliance)",
      "sourcesFound": 2,
      "status": "Not Started"
    },
    {
      "theme": "Online Higher Education & Faculty PD",
      "question": "What are documented gaps in AI training for online faculty? What makes online faculty PD effective and sustained?",
      "searchTerms": "Search: online faculty AI professional development gap, higher education instructor AI training",
      "chapters": "Chapter 1 (context)\nChapter 2\nChapter 3 (intervention rationale)",
      "scenarios": "S1 (Engagement), S4 (Hallucination workshop scenario)",
      "sourcesFound": 1,
      "status": "Not Started"
    },
    {
      "theme": "Metacognition & Online Learning",
      "question": "What role does metacognitive awareness play in online learning success? How can AI prompting activities build self-regulation?",
      "searchTerms": "Search: metacognitive monitoring online learning, self-regulated learning async courses",
      "chapters": "Chapter 2\nChapter 3 (S2 scenario rationale)",
      "scenarios": "S2 (Metacognition)",
      "sourcesFound": 1,
      "status": "Not Started"
    },
    {
      "theme": "Synchronous vs Asynchronous Design",
      "question": "What does research say about synchronous assumption bias in online course design? How does AI replicate and reinforce these assumptions?",
      "searchTerms": "Search: synchronous assumption bias asynchronous online design, async equity higher education",
      "chapters": "Chapter 2\nChapter 3 (S6 scenario rationale)",
      "scenarios": "S6 (Synchronous Assumption Bias)",
      "sourcesFound": 2,
      "status": "Not Started"
    },
    {
      "theme": "Instructional Design & OSCQR",
      "question": "How does TPACK frame educator AI integration? Has OSCQR been used as a research instrument? What is the measurement gap?",
      "searchTerms": "Search: OSCQR research instrument, TPACK AI integration educator",
      "chapters": "Chapter 2\nChapter 3 (measurement instrument)",
      "scenarios": "All scenarios (OSCQR scoring underpins S1–S3)",
      "sourcesFound": 2,
      "status": "Not Started"
    },
    {
      "theme": "Game-Based & Simulation Learning",
      "question": "Does game-based learning work for adult professional development? Why is a game the right format for AI prompting training?",
      "searchTerms": "Search: game-based learning adult professional development, serious games higher education",
      "chapters": "Chapter 2\nChapter 3 (methodology rationale)",
      "scenarios": "All scenarios (game format justification)",
      "sourcesFound": 4,
      "status": "Not Started"
    },
    {
      "theme": "Professional Development Design",
      "question": "What characteristics define effective professional development? What does research say about online and asynchronous PD models for faculty?",
      "searchTerms": "Search: effective professional development online faculty, asynchronous PD higher education",
      "chapters": "Chapter 2\nChapter 3 (intervention design rationale)",
      "scenarios": "PromptCraft as intervention (all scenarios)",
      "sourcesFound": 1,
      "status": "Not Started"
    },
    {
      "theme": "Online Equity & Access",
      "question": "Who lacks quality AI training in online higher education? How does context (access, schedule, role) create inequity in faculty PD?",
      "searchTerms": "Search: online faculty AI access equity, higher education digital divide adjunct",
      "chapters": "Chapter 1 (significance)\nChapter 2",
      "scenarios": "S6 (Bias/Context), S7 (Overreliance — whose judgment matters)",
      "sourcesFound": 1,
      "status": "Not Started"
    },
    {
      "theme": "Research Methodology",
      "question": "How will you measure whether PromptCraft works? What study design supports a small-population pre/post intervention at GFCMSU?",
      "searchTerms": "Search: mixed methods pre/post intervention small sample, single institution study design",
      "chapters": "Chapter 3 (entire chapter)",
      "scenarios": "Research design (not a scenario — informs measurement)",
      "sourcesFound": 1,
      "status": "Not Started"
    }
  ],
  "outline": [
    {
      "chapter": "Chapter 1: Introduction",
      "section": "Problem Statement",
      "questions": "Why do online higher education faculty lack effective, structured AI prompting training? What is the real-world cost of that gap for course quality and student outcomes?",
      "themes": "AI Literacy & Prompt Engineering\nOnline Higher Education & Faculty PD",
      "status": "Not Started"
    },
    {
      "chapter": "Chapter 1: Introduction",
      "section": "Purpose of the Study",
      "questions": "What is PromptCraft, who is it for, and what does it aim to do? How does a game-based approach address the faculty AI training gap?",
      "themes": "All themes",
      "status": "Not Started"
    },
    {
      "chapter": "Chapter 1: Introduction",
      "section": "Research Questions",
      "questions": "Draft 2-3 measurable research questions. Example: Does PromptCraft improve AI prompt quality scores among online faculty? Does it improve self-efficacy for AI integration?",
      "themes": "",
      "status": "In Progress"
    },
    {
      "chapter": "Chapter 1: Introduction",
      "section": "Significance",
      "questions": "Why does this matter for online faculty, instructional designers, and the field of AI literacy in higher education? What happens if this gap is not addressed?",
      "themes": "AI Literacy & Prompt Engineering\nOnline Equity & Access",
      "status": "Not Started"
    },
    {
      "chapter": "Chapter 2: Literature Review",
      "section": "AI Literacy in Education",
      "questions": "What frameworks exist for AI literacy? Where is the structured training gap for educators specifically? What does 'AI literate' mean for a faculty member?",
      "themes": "AI Literacy & Prompt Engineering",
      "status": "Not Started"
    },
    {
      "chapter": "Chapter 2: Literature Review",
      "section": "AI Overreliance & Critical Evaluation",
      "questions": "What does research say about uncritical acceptance of AI output? How prevalent is hallucination acceptance? What interventions address this?",
      "themes": "AI Overreliance & Critical Evaluation",
      "status": "Not Started"
    },
    {
      "chapter": "Chapter 2: Literature Review",
      "section": "Online Higher Education Faculty PD",
      "questions": "What are documented gaps in AI-specific training for online faculty? What makes faculty PD for online teaching effective vs. ineffective?",
      "themes": "Online Higher Education & Faculty PD",
      "status": "Not Started"
    },
    {
      "chapter": "Chapter 2: Literature Review",
      "section": "Metacognition in Online Learning",
      "questions": "How does metacognitive awareness affect online learning outcomes? What instructional activities build self-regulation in asynchronous courses?",
      "themes": "Metacognition & Online Learning",
      "status": "Not Started"
    },
    {
      "chapter": "Chapter 2: Literature Review",
      "section": "Effective PD Design",
      "questions": "What characteristics define effective professional development? What works specifically in online and asynchronous models for adult learners?",
      "themes": "Professional Development Design",
      "status": "Not Started"
    },
    {
      "chapter": "Chapter 2: Literature Review",
      "section": "Game-Based Learning for Adults",
      "questions": "Does game-based learning work for professional development? What evidence exists for serious games in higher education and adult learning contexts?",
      "themes": "Game-Based & Simulation Learning",
      "status": "Not Started"
    },
    {
      "chapter": "Chapter 2: Literature Review",
      "section": "TPACK and OSCQR as Frameworks",
      "questions": "How does TPACK frame educator AI integration? Has OSCQR been used as a research instrument? What is the measurement gap this study addresses?",
      "themes": "Instructional Design & OSCQR",
      "status": "Not Started"
    },
    {
      "chapter": "Chapter 2: Literature Review",
      "section": "Online Equity & Access",
      "questions": "Who lacks quality AI training in online higher education? How does synchronous-assumption bias in AI course design create inequity?",
      "themes": "Online Equity & Access",
      "status": "Not Started"
    },
    {
      "chapter": "Chapter 3: Methodology",
      "section": "Research Design",
      "questions": "Why mixed methods? How does a pre/post design with qualitative reflection data fit the research questions? What are the limitations?",
      "themes": "Research Methodology",
      "status": "Not Started"
    },
    {
      "chapter": "Chapter 3: Methodology",
      "section": "Participants",
      "questions": "Who are your participants at GFCMSU? How many? What are the inclusion criteria? Online faculty? IDs? Both?",
      "themes": "Research Methodology",
      "status": "In Progress"
    },
    {
      "chapter": "Chapter 3: Methodology",
      "section": "The Intervention: PromptCraft",
      "questions": "Describe the game in full: 7 scenarios (Engagement, Metacognition, Assessment, Hallucination Hunt, Predict the Output, Synchronous Bias, Overreliance), Professor Pixel coaching, OSCQR scoring, scaffolded input system, Ideas Wall, Google Sheets behavioral data pipeline.",
      "themes": "Game-Based & Simulation Learning\nInstructional Design & OSCQR",
      "status": "In Progress"
    },
    {
      "chapter": "Chapter 3: Methodology",
      "section": "Data Collection",
      "questions": "Pre/post AI self-efficacy survey + prompt quality scores against OSCQR rubric + qualitative reflection room responses. What instruments? How validated?",
      "themes": "Research Methodology\nInstructional Design & OSCQR",
      "status": "In Progress"
    },
    {
      "chapter": "Chapter 3: Methodology",
      "section": "Analysis Plan",
      "questions": "How will you analyze quantitative change in prompt scores and self-efficacy? How will you code qualitative themes from reflection responses?",
      "themes": "Research Methodology",
      "status": "Not Started"
    },
    {
      "chapter": "Chapter 4: Results",
      "section": "Quantitative Findings",
      "questions": "Did prompt quality and self-efficacy scores improve? By how much? Was change statistically or practically significant given sample size?",
      "themes": "",
      "status": "Not Started"
    },
    {
      "chapter": "Chapter 4: Results",
      "section": "Qualitative Findings",
      "questions": "What themes emerged from participant reflections? What did educators say about the experience, the AI feedback, and their sense of readiness?",
      "themes": "",
      "status": "Not Started"
    },
    {
      "chapter": "Chapter 5: Discussion",
      "section": "Interpretation",
      "questions": "What do the results mean? Do they support your research questions? How do they connect to the literature on AI literacy and faculty PD?",
      "themes": "All themes",
      "status": "Not Started"
    },
    {
      "chapter": "Chapter 5: Discussion",
      "section": "Implications for Practice",
      "questions": "What should instructional designers, faculty developers, and online program administrators do with these findings?",
      "themes": "AI Literacy & Prompt Engineering\nProfessional Development Design",
      "status": "Not Started"
    },
    {
      "chapter": "Chapter 5: Discussion",
      "section": "Limitations",
      "questions": "Small sample, single institution, self-report data, researcher-designed instrument — acknowledge honestly and specifically.",
      "themes": "",
      "status": "Not Started"
    },
    {
      "chapter": "Chapter 5: Discussion",
      "section": "Future Research",
      "questions": "What questions does this study open? What would a larger, longitudinal, or multi-institution study look like? Where does the Full Loop scenario go?",
      "themes": "",
      "status": "Not Started"
    }
  ],
  "reading": [
    {
      "phase": "Phase 1: Before EdS",
      "theme": "AI Literacy & Prompt Engineering",
      "reading": "Google Scholar: AI literacy framework educators",
      "goal": "Map what AI literacy means — find the 3-5 most cited definitions and frameworks",
      "target": "Before fall enrollment",
      "done": false
    },
    {
      "phase": "Phase 1: Before EdS",
      "theme": "AI Literacy & Prompt Engineering",
      "reading": "Google Scholar: prompt engineering training teachable skill higher education faculty",
      "goal": "Confirm the gap — is anyone training online faculty specifically to prompt AI well?",
      "target": "Before fall enrollment",
      "done": false
    },
    {
      "phase": "Phase 1: Before EdS",
      "theme": "AI Overreliance & Critical Evaluation",
      "reading": "Search: AI overreliance hallucination higher education, uncritical acceptance AI output educators",
      "goal": "Find 2-3 empirical studies documenting the problem — this is the core rationale for S4, S6, S7",
      "target": "Before fall enrollment",
      "done": false
    },
    {
      "phase": "Phase 1: Before EdS",
      "theme": "Online Higher Education & Faculty PD",
      "reading": "Meyer (2014) An Analysis of the Research on Faculty Development for Online Teaching — full article",
      "goal": "Understand documented gaps in online faculty PD — anchors PromptCraft's intervention rationale",
      "target": "Before fall enrollment",
      "done": false
    },
    {
      "phase": "Phase 1: Before EdS",
      "theme": "Game-Based & Simulation Learning",
      "reading": "Kolb (1984) Experiential Learning — Chapters 1-3",
      "goal": "Understand the theoretical backbone of PromptCraft's prompt-evaluate-reflect loop",
      "target": "Before fall enrollment",
      "done": false
    },
    {
      "phase": "Phase 1: Before EdS",
      "theme": "Research Methodology",
      "reading": "Creswell & Creswell (2018) Research Design — Chapters 1-4",
      "goal": "Get comfortable with mixed methods before coursework begins",
      "target": "Before fall enrollment",
      "done": false
    },
    {
      "phase": "Phase 2: Year 1",
      "theme": "Instructional Design & OSCQR",
      "reading": "Mishra & Koehler (2006) TPACK — Teachers College Record",
      "goal": "Understand the dominant framework for technology integration in education",
      "target": "Fall semester",
      "done": false
    },
    {
      "phase": "Phase 2: Year 1",
      "theme": "Instructional Design & OSCQR",
      "reading": "Search for peer-reviewed studies citing or using OSCQR as a research instrument",
      "goal": "Find the gap — has anyone operationalised OSCQR to measure AI output quality?",
      "target": "Fall semester",
      "done": false
    },
    {
      "phase": "Phase 2: Year 1",
      "theme": "Metacognition & Online Learning",
      "reading": "Azevedo (2015) metacognitive monitoring in online learning; Zimmerman on self-regulation",
      "goal": "Build theoretical grounding for S2 (Metacognition) scenario and its learning outcome",
      "target": "Fall semester",
      "done": false
    },
    {
      "phase": "Phase 2: Year 1",
      "theme": "Synchronous vs Asynchronous Design",
      "reading": "Dennen & Burner on async discussion quality; Quality Matters research base",
      "goal": "Ground the synchronous-assumption bias problem (S6) in documented online course design research",
      "target": "Fall semester",
      "done": false
    },
    {
      "phase": "Phase 2: Year 1",
      "theme": "Professional Development Design",
      "reading": "Bandura (1997) Self-Efficacy — chapters on professional and educational contexts",
      "goal": "Identify or build a validated self-efficacy scale for your pre/post measure",
      "target": "Spring semester",
      "done": false
    },
    {
      "phase": "Phase 2: Year 1",
      "theme": "Online Equity & Access",
      "reading": "EDUCAUSE digital equity reports; first-generation online learner research; adjunct faculty AI access studies",
      "goal": "Build the equity argument — who lacks quality AI training in online higher education and why",
      "target": "Spring semester",
      "done": false
    },
    {
      "phase": "Phase 2: Year 1",
      "theme": "Online Higher Education & Faculty PD",
      "reading": "Meyer (2014); Parnell (2018); search EDUCAUSE Horizon Report faculty AI adoption sections",
      "goal": "Build the online faculty PD case — what is documented, what is missing, where PromptCraft fits",
      "target": "Spring semester",
      "done": false
    },
    {
      "phase": "Phase 2: Year 1",
      "theme": "Game-Based & Simulation Learning",
      "reading": "Whitton (2014) Digital Games and Learning — adult and HE chapters",
      "goal": "Ground game-based PD in adult learning literature specifically",
      "target": "Spring semester",
      "done": false
    },
    {
      "phase": "Phase 3: Dissertation",
      "theme": "All themes",
      "reading": "Systematic literature review — target 40-60 sources for Chapter 2",
      "goal": "Build the full literature review — this is where the Source Tracker becomes essential",
      "target": "Summer before writing",
      "done": false
    },
    {
      "phase": "Phase 3: Dissertation",
      "theme": "AI Overreliance & Critical Evaluation",
      "reading": "Full systematic search: hallucination acceptance, overreliance studies in higher education (2021-2025)",
      "goal": "Anchor the critical evaluation chapters (S4, S6, S7) in current empirical literature",
      "target": "Summer before writing",
      "done": false
    },
    {
      "phase": "Phase 3: Dissertation",
      "theme": "Research Methodology",
      "reading": "MSU IRB training modules and application documentation",
      "goal": "Complete IRB approval before any data collection begins",
      "target": "Semester before data collection",
      "done": false
    }
  ],
  "backups": [],
  "meta": {
    "version": 1,
    "generated": "2026-08-12",
    "project": "PromptCraft"
  }
};
