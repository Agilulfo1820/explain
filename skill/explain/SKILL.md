---
name: explain
description: Build a "PR explainer": a modular, illustrated mini-course (HTML, Italian prose) that makes a developer truly understand a feature an AI agent built for them — domain concepts, how the solution is reached, how it joins the rest of the system, the request flow with code, alternatives, embedded videos and a concept quiz. Use when the user asks to explain or study a PR, a stack of PRs, or a Claude/Codex session ("spiegami queste PR", "fammi capire cosa ha fatto Claude", "explain this session", "/explain 1882 1883").
argument-hint: "PR numbers, a branch, or 'this session' — e.g. 1882 1883 1884"
---

# explain

Produce an explainer that makes the reader **understand** what was built: what it is, why it exists, how it works, which alternatives existed and why this one won. It is **not a code review**: no line-by-line diff, no risk or merge checklist.

The project lives in `~/Work/pr-explainers/`. Read its `VISION.md` (the user's own words are the source of truth) and `CLAUDE.md` before starting. The reference example, kept up to date with every decision, is `~/Work/pr-explainers/2026-10-09-read-aloud/index.html`: open it and copy its patterns.

## Output

- One folder per explainer: `~/Work/pr-explainers/YYYY-MM-DD-<topic>/` with `index.html` and `quiz.json`.
- Start from [template.html](template.html). It links the shared components in `~/Work/pr-explainers/assets/` (`explainer.css`, `course.js`, `stepper.js`, `video.js`, `quiz.js`). Each JS file documents its markup contract in its header comment. Reuse them; when you need something new and reusable, add it there, not inline.
- Serve with `python3 -m http.server 8765` from `~/Work/pr-explainers/`, then open `http://localhost:8765/<folder>/`. Every module has its own address (`#stt`, `#quiz`, `#quiz/<module>`).
- Nothing goes into the repo being explained.

## Audience and language

- **Mid-level developers**: skip trivia, but explain **domain concepts** properly (things even a senior may not know, e.g. TTS, PCM, speech-to-speech).
- **Prose in Italian, code in English.** Short sentences, one idea each.
- No time limit: 30–60 minutes including the linked material is fine. The "In 3 minuti" module is the short version.

## Workflow

### 1. Scope and material
- Identify the PRs (`gh pr view <n> --json ...`), their stack order and state. **Also look for older related PRs** (`gh pr list --state all --search "<topic>"`): if they are the other half of the same concepts (e.g. speech-to-text for a text-to-speech feature), include them as context.
- **Facts come from the code**, read on the PR branches: `git show "origin/<branch>:<path>"` (quote the ref: in zsh `$VAR:a` is a modifier). Read the repo `docs/` the PRs touch: they often state the rules (budgets, fail-open vs fail-closed) better than the code.
- **The "why" comes from the session and the PR bodies.** Sessions live in `~/.claude/projects/<path-with-dashes>/*.jsonl` (Codex: `~/.codex/sessions/`). They can be huge: grep for the decisions, don't read them whole.
- Never present as a team decision something the team did not consider. A pedagogical step ("why not the browser's speechSynthesis?") is phrased as "la prima idea che verrebbe a chiunque".

### 2. Sources, in parallel
Launch one background agent to find and verify sources while you write. Brief it with:
- Topics: each domain concept and each pattern the feature uses.
- **Authority first**: official docs (MDN, web.dev, vendor docs, Hugging Face, Microsoft Learn, OWASP, RFCs), recognised authors (Martin Fowler/Pete Hodgson…), recognised channels (Computerphile, Two Minute Papers, Hussein Nasser, conference talks, official vendor channels). No content farms.
- Verification: every YouTube video through oEmbed (`https://www.youtube.com/oembed?url=…&format=json`, which also proves it is embeddable), title and channel copied from it, duration from the watch page; every URL answers 200. Use a `?t=`/`start` offset only when the chapter is visible in the video description, never guessed.
- Return per item: kind, exact title, author, URL, verification, duration, **one sentence on why it is worth it**.

### 3. Structure: modules, not a wall of text
One `<section class="module">` per page; the sidebar is built from them. Usual order:

| Group | Module | Content |
|---|---|---|
| Inizia qui | **In 3 minuti** | the pieces (tiles), three key ideas, links into the two groups |
| I concetti | 2–3 concept modules | the domain, explained from zero for a mid-level dev |
| Questa feature | **Come ci si arriva** | reveal-mode stepper: start from the naive design, add one piece per concrete problem ("Problema: … ✅ serve …") until the real architecture appears |
| | **Come si unisce al resto** | which existing platform pieces it reuses, the family of similar features it belongs to, who pays, the rules it follows |
| | **Il viaggio di una richiesta** | stepper with scenarios (happy path, cache hit, a denial…), the code snippet of each step, `<mark>` on the key line |
| | **Scelte e alternative** | tabs, one per decision: alternative, why not, the numbers |
| | cross-cutting concepts | e.g. client concerns, each as "il concetto" that also applies elsewhere |
| | **Cosa resta fuori** | tiles; boundaries, not defects |
| Strumenti | **Quiz**, **Glossario** | separate pages (`data-tool`) |

Inside a module, prefer building blocks to paragraphs: `.tile` grids, `.flow` numbered steps, `.key` takeaway, `.tabs`, `<details>` for optional depth, figures and steppers. A paragraph is at most 3–4 sentences.

### 4. Sources inline, videos embedded
- Put each source **next to the concept it explains** (`.yt.inline-video`, or an inline link), and the rest in the module's `.further` box ("Per approfondire questo modulo"). No list of sources at the bottom of the page.
- Videos are embedded with `video.js` (thumbnail, loads on click, youtube-nocookie, `data-start` for chapter offsets). Give each one an `id="v-…"` so the quiz can point to it.
- Every source says **why** it is worth the reader's time.

### 5. Quiz (`quiz.json` → `scripts/quiz.py`)
- Questions test **transferable concepts**, not the codebase ("could this question appear unchanged in another team's explainer?"). A couple of design-principle questions are fine; "this endpoint returns 401" is not.
- "What if…" and reasoning, never recall. **Never blocking.**
- Every option has its own `why`. A wrong answer explains the mistake and `learn` points to the **in-page** section or video (`#module`, `#v-…`) plus, if useful, one external source.
- All options of a question have the **same number of words** (the script refuses otherwise); `quiz.js` shuffles them.
- Each question has a `module`: the module footer links to "its" questions (`#quiz/<module>`).
- Write `quiz.json` (format in the script's docstring), then run `python3 ~/.claude/skills/explain/scripts/quiz.py <folder>`.

### 6. Verify before handing over
1. `python3 ~/.claude/skills/explain/scripts/check.py <folder>/index.html`: placeholders, in-page anchors, word counts, every link 200, every video oEmbed + thumbnail. Private-repo PR links show 404 without login: expected.
2. In Chrome (load the claude-in-chrome tools first): read the console for errors; visit every module through the hash; walk every stepper scenario; answer quiz questions right and wrong and check the summary; play one embedded video; check phone width (375 px, no horizontal scroll) and dark mode.
3. Bump `?v=N` on the asset links whenever assets changed, and tell the user to hard-reload (Cmd+Shift+R).

## When the user gives feedback

- Append their words **verbatim** to `VISION.md` Part 2 and update Part 1; update `CLAUDE.md` when a rule changes.
- Changes to the format go into this skill and the shared assets too, so the next explainer starts from the improved version.

## Open questions (do not decide alone)

- How to present the PRs (current vs older context, state, stack order): a first attempt was rejected; ask before redesigning it.
- One page with a sidebar vs one HTML file per module.
