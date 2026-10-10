---
name: explain
description: Build a "PR explainer": a modular, illustrated mini-course (HTML) that makes a developer truly understand a feature an AI agent built for them — domain concepts, how the solution is reached, how it fits into the rest of the system, the request flow with code, alternatives, embedded videos and a concept quiz. Use when the user asks to explain or study a PR, a stack of PRs, or a Claude/Codex session ("explain these PRs", "help me understand what Claude did", "explain this session", "/explain 1882 1883").
argument-hint: "PR numbers, a branch, or 'this session', e.g. 1882 1883 1884"
---

# explain

Produce an explainer that makes the reader **understand** what was built: what it is, why it exists, how it works, which alternatives existed and why this one won. It is **not a code review**: no line-by-line diff, no risk or merge checklist.

## Where things live

- **Project root**: the repository this skill belongs to. Resolve it from the skill's real path: `ROOT="$(cd "$(dirname "$(realpath ~/.claude/skills/explain/SKILL.md)")/../.." && pwd)"`. Read `$ROOT/README.md` and, if present, `$ROOT/VISION.md`.
- **Output**: one folder per explainer, `$ROOT/YYYY-MM-DD-<topic>/`, with `index.html` and `quiz.json`. These folders are git-ignored: explainers usually describe private code. Nothing goes into the repository being explained.
- **Start from** [template.html](template.html). It links the shared components in `$ROOT/assets/`: `explainer.css`, `i18n.js`, `course.js`, `stepper.js`, `video.js`, `quiz.js`. Each JS file documents its markup contract in its header comment. Reuse them; when something new is reusable, add it to `assets/`, not inline.
- **If an earlier explainer exists** in `$ROOT`, open it and copy its patterns.
- **Serve** with `python3 -m http.server 8765` from `$ROOT`, then open `http://localhost:8765/<folder>/`. Every module has its own address (`#stt`, `#quiz`, `#quiz/<module>`).

## Language and audience

- **Everything in code is in English**: code, comments, file names, ids, script output.
- **The explainer's prose is in English** unless the user asks for another language. Set `<html lang="…">` to that language: `i18n.js` picks the UI strings from it (English and Italian exist; add a dictionary for others).
- **Mid-level developers**: skip trivia, but explain **domain concepts** properly (things even a senior may not know, e.g. TTS, PCM, speech-to-speech).
- Short sentences, one idea each. No time limit: 30–60 minutes including the linked material is fine; the "In 3 minutes" module is the short version.

## Workflow

### 1. Scope and material
- Identify the PRs (`gh pr view <n> --json ...`), their stack order and state. **Also look for older related PRs** (`gh pr list --state all --search "<topic>"`): if they are the other half of the same concepts (e.g. speech-to-text for a text-to-speech feature), include them as context.
- **Facts come from the code**, read on the PR branches: `git show "origin/<branch>:<path>"` (quote the ref: in zsh `$VAR:a` is a modifier). Read the repo `docs/` the PRs touch: they often state the rules (budgets, fail-open vs fail-closed) better than the code.
- **The "why" comes from the session and the PR bodies.** Claude Code sessions live in `~/.claude/projects/<path-with-dashes>/*.jsonl` (Codex: `~/.codex/sessions/`). They can be huge: grep for the decisions, don't read them whole.
- Never present as a team decision something the team did not consider. A teaching step ("why not the browser's speechSynthesis?") is phrased as "the first idea anyone would have".

### 2. Sources, in parallel
Launch one background agent to find and verify sources while you write. Brief it with:
- Topics: each domain concept and each pattern the feature uses.
- **Authority first**: official docs (MDN, web.dev, vendor docs, Hugging Face, Microsoft Learn, OWASP, RFCs), recognised authors (Martin Fowler, Pete Hodgson…), recognised channels (Computerphile, Two Minute Papers, Hussein Nasser, conference talks, official vendor channels). No content farms.
- Verification: every YouTube video through oEmbed (`https://www.youtube.com/oembed?url=…&format=json`, which also proves it can be embedded), title and channel copied from it, duration from the watch page; every URL answers 200. Use a `start` offset only when the chapter is visible in the video description, never guessed.
- Return per item: kind, exact title, author, URL, verification, duration, **one sentence on why it is worth it**.

### 3. Structure: modules, not a wall of text
One `<section class="module">` per page; the sidebar is built from them. Usual order:

| Group | Module | Content |
|---|---|---|
| Start here | **In 3 minutes** | the pieces (tiles), three key ideas, links into the two groups |
| Concepts | 2–3 concept modules | the domain, explained from zero for a mid-level developer |
| This feature | **How you get there** | reveal-mode stepper: start from the naive design, add one piece per concrete problem ("Problem: … ✅ needed: …") until the real architecture appears |
| | **How it fits in** | which existing pieces of the system it reuses, the family of similar features it belongs to, who pays, the rules it follows |
| | **A request's journey** | stepper with scenarios (happy path, cache hit, a denial…), the code snippet of each step, `<mark>` on the key line |
| | **Choices and alternatives** | tabs, one per decision: the alternative, why not, the numbers |
| | cross-cutting concepts | e.g. client concerns, each framed as "the concept" that also applies elsewhere |
| | **What's left out** | tiles: boundaries, not defects |
| Tools | **Quiz**, **Glossary** | separate pages (`data-tool`) |

Inside a module, prefer building blocks to paragraphs: `.tile` grids, `.flow` numbered steps, `.key` takeaway, `.tabs`, `<details>` for optional depth, figures and steppers. A paragraph is at most 3–4 sentences.

### 4. Sources inline, videos embedded
- Put each source **next to the concept it explains** (`.yt.inline-video`, or an inline link), and the rest in the module's `.further` box. No list of sources at the bottom of the page.
- Videos are embedded with `video.js` (thumbnail, loads on click, youtube-nocookie, `data-start` for chapter offsets). Give each one an `id="v-…"` so the quiz can point to it.
- Every source says **why** it is worth the reader's time.

### 5. Quiz (`quiz.json` → `scripts/quiz.py`)
- Questions test **transferable concepts**, not the codebase ("could this question appear unchanged in another team's explainer?"). A couple of design-principle questions are fine; "this endpoint returns 401" is not.
- "What if…" and reasoning, never recall. **Never blocking.**
- Every option has its own `why`. A wrong answer explains the mistake, and `learn` points to the **in-page** section or video (`#module`, `#v-…`) plus, if useful, one external source.
- All options of a question have the **same number of words** (the script refuses otherwise); `quiz.js` shuffles them.
- Each question has a `module`: the module footer links to its questions (`#quiz/<module>`).
- Write `quiz.json` (format in the script's docstring), then run `python3 ~/.claude/skills/explain/scripts/quiz.py <folder>`.

### 6. Verify before handing over
1. `python3 ~/.claude/skills/explain/scripts/check.py <folder>/index.html`: placeholders, in-page anchors, word counts, every link 200, every video oEmbed + thumbnail. Links to PRs in private repositories show 404 without login: expected.
2. In a browser: read the console for errors; visit every module through the hash; walk every stepper scenario; answer quiz questions right and wrong and check the summary; play one embedded video; check phone width (375 px, no horizontal scroll) and dark mode.
3. Bump `?v=N` on the asset links whenever assets changed, and tell the user to hard-reload.

## Open questions (ask the user, do not decide alone)

- How to present the PRs (current ones vs older context, state, stack order): a first attempt was rejected.
- One page with a sidebar vs one HTML file per module.
