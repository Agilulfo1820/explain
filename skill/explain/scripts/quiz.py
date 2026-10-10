#!/usr/bin/env python3
"""Build the quiz HTML fragment from a quiz.json and splice it into index.html.

quiz.json is a list of questions:
  {
    "module": "stt",                       # id of the module the question belongs to
    "question": "Mentre detti, ...?",
    "options": [                           # the FIRST option is the correct one
      {"text": "...", "why": "Giusto. ..."},
      {"text": "...", "why": "..."}
    ],
    "learn": "Rivedi <a href=\"#stt\">...</a> e guarda <a href=\"#v-hf-asr\">...</a>."
  }

Fails (exit 1) when the options of a question do not all have the same number
of words, so the length of an answer never gives it away. quiz.js shuffles the
options at load time.

Usage:
  quiz.py <explainer-dir>            # rewrites the block between the QUIZ markers
  quiz.py <explainer-dir> --print    # prints the fragment only
"""
import html
import json
import re
import sys
from pathlib import Path

START = '<!-- QUIZ:START -->'
END = '<!-- QUIZ:END -->'


def words(text: str) -> int:
    return len(html.unescape(re.sub(r'<[^>]+>', '', text)).split())


def build(questions: list) -> str:
    errors = []
    for i, q in enumerate(questions, 1):
        counts = [words(o['text']) for o in q['options']]
        if len(set(counts)) != 1:
            errors.append(f'Q{i} word counts {counts}: ' + ' | '.join(o['text'] for o in q['options']))
    if errors:
        sys.exit('Options must have equal word counts:\n' + '\n'.join(errors))

    out = []
    for i, q in enumerate(questions, 1):
        opts = '\n'.join(
            f'    <div class="opt"{" data-correct" if k == 0 else ""}>'
            f'<button type="button">{o["text"]}</button><div class="why">{o["why"]}</div></div>'
            for k, o in enumerate(q['options'])
        )
        out.append(
            f'<div class="q" data-module="{q["module"]}">\n'
            f'  <h4>{i}. {q["question"]}</h4>\n'
            f'  <div class="opts">\n{opts}\n  </div>\n'
            f'  <div class="learn"><strong>Forse questo non era chiaro.</strong> {q["learn"]}</div>\n'
            f'</div>'
        )
    return '\n\n'.join(out)


def main() -> None:
    if len(sys.argv) < 2:
        sys.exit(__doc__)
    folder = Path(sys.argv[1])
    questions = json.loads((folder / 'quiz.json').read_text())
    fragment = build(questions)
    if '--print' in sys.argv:
        print(fragment)
        return
    page = folder / 'index.html'
    text = page.read_text()
    if START not in text or END not in text:
        sys.exit(f'{page}: add {START} and {END} inside <div class="quiz" data-quiz>')
    head, rest = text.split(START, 1)
    _, tail = rest.split(END, 1)
    page.write_text(f'{head}{START}\n{fragment}\n{END}{tail}')
    print(f'{page}: {len(questions)} questions written')


if __name__ == '__main__':
    main()
