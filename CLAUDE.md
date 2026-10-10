# PR Explainers — guidance for Claude

Dan's personal project, independent of any repo. Goal: help developers **truly understand** a feature or PR series that an AI agent built for them, at concept level, as if studying it. Read `VISION.md` first: it holds the organised vision plus Dan's verbatim words, which are the source of truth.

## State (2026-10-09)
- Reference example, always: the agent-marketplace **read-aloud** session (PRs #1882–#1884). Dan wants every format iteration tested on it.
- `2026-10-09-read-aloud/index.html` is **v3**: a modular course with a sidebar (one module per "page"), covering both halves of voice: July dictation (#933/#936/#937, STT) and read-aloud (#1882–#1884, TTS). v1/v2 were single long pages (v1 in git history). Served with `python3 -m http.server 8765` from this folder.
- Shared components in `assets/` (markup contract in each file's header comment): `explainer.css`, `course.js` (sidebar, hash routing, prev/next, tabs), `stepper.js` (animated step diagrams, scenarios, reveal mode), `video.js` (click-to-load YouTube embeds), `quiz.js` (per-option explanations, per-module filter).
- Facts come from the PR branches (`git show origin/feat/read-aloud-*:<path>` in `~/Work/vechain/agent-marketplace`); the *why* comes from the session.
- **Skill `/explain`** (source in `skill/explain/`, symlinked into `~/.claude/skills/explain`): the process, `template.html`, `scripts/quiz.py` (quiz.json → HTML, enforces equal word counts) and `scripts/check.py` (links, oEmbed, anchors, quiz). When the format changes, update the skill too.
- Based on the `teach` skill at `~/.claude/skills/teach` (Tufte look, cited sources, retrieval quiz, "ask the agent" reminder).

## Dan's requirements for an explainer (decided)
- **Concept-level understanding**: what was built, why, how it works, which alternatives existed and why this one won. **Not** a code review, **not** a line-by-line diff, **no** risk/merge-checklist section.
- **No time limit**: 30–60 minutes including the linked material is fine. Offer an additional **"3 minutes" mode**.
- **Audience**: mid-level developers. Skip trivia, but explain **domain concepts** properly (e.g. what TTS/STT are, how neural voices work).
- **Animated, step-by-step diagrams** (e.g. click "next" and a request moves through the system, with the matching snippet).
- **Code snippets** where they clarify the concept.
- **Quiz**: tests understanding ("what if…", reasoning), not recall. **Never blocking.** A wrong answer explains why and points to the specific video or article that clarifies it. Options have equal word counts and are shuffled.
- **Sources**: quality and authority first (official docs, recognised authors and channels). Verify every YouTube video via oEmbed and every link returns 200. Say why each one is worth it.
- **Modules, not a wall of text**: sidebar navigation, one module at a time, tiles/tabs/key boxes; quiz and glossary on their own pages.
- **Sources inline** (next to the concept or at the end of the module), **videos embedded** in the page.
- Explain **architecture**: how the feature joins the rest of the system, why each piece is needed, **how one could arrive at it** (derivation from a naive design).
- Quiz questions test **transferable concepts**, not specifics of the codebase.
- Prose in Italian, code in English.

## Product direction (from VISION.md)
- Two targets: the developer who built with an agent, and the reviewers.
- App, not just a skill:
  - **desktop** (Mac/Windows): pick a Claude/Codex session and "explain this session";
  - **GitHub App**: a label or a link in the PR → an external page with the explanation and the test. Optional merge check: "N of M people read it and passed".
- **Third use case: repo onboarding** for newcomers: analyse a whole repo and generate a set of explainers (modules per part of the project, plus its concepts) to bootstrap learning.
- **App onboarding**: ask the user's level first (from beginner vibecoder to senior) and adapt the depth of explanations. Remember this when building the app.
- **Ask-an-LLM**: an LLM inside the explainer that answers the reader's questions on the topic. Remember this when building the app.
- Later: personalisation to what the user knows, and a learning history linked to their own PRs ("study this tomorrow").

## Rules
- Whenever Dan adds an idea, **append it verbatim** to VISION.md Part 2 and update Part 1.
- Keep everything inside this folder; nothing goes into the agent-marketplace repo.
