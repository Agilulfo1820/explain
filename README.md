# explain

A Claude Code skill that turns a PR, a stack of PRs or an agent session into an **explainer**: a small, illustrated course that makes you *understand* a feature an AI agent built for you. Not a code review: the concepts, how the solution is reached, how it fits into the rest of the system, and why it beat the alternatives.

Each explainer has:
- the **domain concepts**, explained for a mid-level developer;
- **how you get there** (from the naive design to the real one) and **how it fits in** with the rest of the system;
- **animated step-by-step diagrams**, with the code snippet of each step;
- **embedded videos** and verified sources inside the modules, each with a reason to read or watch it;
- an **"In 3 minutes"** module;
- a non-blocking **quiz** on transferable concepts, on its own page, that explains every wrong answer and points to what to review.

## Install

```sh
git clone https://github.com/Agilulfo1820/explain.git ~/explain
ln -s ~/explain/skill/explain ~/.claude/skills/explain
```

Then, in Claude Code, inside the repository you want explained: `/explain 1882 1883 1884` (PR numbers), or ask "explain this session".

## View an explainer

```sh
cd ~/explain && python3 -m http.server 8765
```

Open `http://localhost:8765/<YYYY-MM-DD-topic>/`. Every module has its own address (e.g. `#quiz`).

## Layout

- `skill/explain/` — the skill: the process (`SKILL.md`), `template.html`, and two scripts: `quiz.py` builds the quiz from `quiz.json`, `check.py` checks links, videos, anchors and quiz before delivery.
- `assets/` — shared components (each file documents its markup in its header comment):
  - `explainer.css` — styles, light and dark;
  - `i18n.js` — UI strings by `<html lang>` (English, Italian);
  - `course.js` — sidebar, one module at a time, prev/next, tabs;
  - `stepper.js` — step-by-step SVG diagrams, with scenarios and a "build-up" mode;
  - `video.js` — YouTube embeds that load on click;
  - `quiz.js` — quiz with an explanation per option, per-module filter and a summary of what to review.
- `YYYY-MM-DD-<topic>/` — the generated explainers. **Git-ignored**: they usually describe private code. To publish one that is safe to share, `git add -f` it.
- `VISION.md` — where the product is heading (a desktop app and a GitHub App), with the author's notes.
