# explain — guidance for Claude

Dan's project. Goal: help developers **truly understand** a feature or PR series that an AI agent built for them, at concept level, as if studying it. Read `VISION.md` first: it holds the organised vision plus Dan's own words (translated), which are the source of truth.

## Language (very important)
- Dan talks to you in **Italian**: reply in Italian.
- **Everything written into the repository is in English**: code, comments, README, skill, VISION, CLAUDE.md, commit messages, UI strings. When logging Dan's words into VISION.md, translate them faithfully into English.
- Explainers are written in English unless the user asks for another language; `<html lang>` picks the UI strings (`assets/i18n.js`).

## State (2026-10-10)
- Public repo: https://github.com/Agilulfo1820/explain. Explainer folders (`YYYY-MM-DD-*/`) are git-ignored because they describe private code. The pre-publication history (with explainer v1) is on the local-only branch `local-history`.
- **Skill `/explain`**: source in `skill/explain/`, symlinked into `~/.claude/skills/explain`. It holds the process (`SKILL.md`), `template.html`, `scripts/quiz.py` (quiz.json → HTML, enforces equal word counts) and `scripts/check.py` (links, oEmbed, anchors, quiz). When the format changes, update the skill and the shared assets too.
- Shared components in `assets/` (markup contract in each file's header comment): `explainer.css`, `i18n.js`, `course.js`, `stepper.js`, `video.js`, `quiz.js`.
- Reference example (local only, in Italian): `2026-10-09-read-aloud/`, about a voice feature: the read-aloud PRs plus the earlier dictation PRs as context. Dan wants every format iteration tried on it.
- Started from the ideas of the `teach` skill (Tufte look, cited sources, retrieval quiz, "ask the agent" reminder).

## Dan's requirements for an explainer (decided)
- **Concept-level understanding**: what was built, why, how it works, which alternatives existed and why this one won. **Not** a code review, **not** a line-by-line diff, **no** risk/merge-checklist section.
- **No time limit**: 30–60 minutes including the linked material is fine, plus an "In 3 minutes" module.
- **Audience**: mid-level developers. Skip trivia, but explain **domain concepts** properly.
- **Modules, not a wall of text**: sidebar navigation, one module at a time, tiles/tabs/key boxes; quiz and glossary on their own pages.
- **Architecture**: how the feature fits into the rest of the system, why each piece is needed, **how one could arrive at it** (derivation from a naive design).
- **Animated, step-by-step diagrams** with the matching code snippet.
- **Sources inline** (next to the concept or at the end of the module), **videos embedded**. Quality and authority first; verify every video via oEmbed and every link returns 200; say why each one is worth it.
- **Quiz**: transferable concepts and reasoning, not recall and not codebase specifics. **Never blocking.** A wrong answer explains why and points to what to review. Options have equal word counts and are shuffled.

## Product direction (from VISION.md)
- Two targets: the developer who built with an agent, and the reviewers.
- App, not just a skill:
  - **desktop** (Mac/Windows): pick a Claude/Codex session and "explain this session";
  - **GitHub App**: a label or a link in the PR → an external page with the explanation and the test. Optional merge check: "N of M people read it and passed".
- **Third use case: repo onboarding** for newcomers: analyse a whole repo and generate a set of explainers (modules per part of the project, plus its concepts).
- **App onboarding**: ask the user's level first (from beginner vibecoder to senior) and adapt the depth of explanations.
- **Ask-an-LLM**: an LLM inside the explainer that answers the reader's questions on the topic.
- Later: personalisation to what the user knows, and a learning history linked to their own PRs ("study this tomorrow").

## Rules
- Whenever Dan adds an idea or gives feedback, **log it** in VISION.md Part 2 (faithful English translation) and update Part 1.
- Nothing goes into the repositories being explained.
- Open questions to ask Dan about, not decide alone: how to present the PRs (a first attempt was reverted), one page with a sidebar vs one file per module.
