#!/usr/bin/env python3
"""Pre-delivery checks for an explainer page.

  check.py <explainer-dir>/index.html [--offline]

Checks:
  - no leftover {{placeholders}};
  - every in-page href="#id" (also "#id/param") points to an existing id;
  - every quiz question's options have the same number of words;
  - every external link answers 200 (private GitHub PR links are reported, not failed);
  - every YouTube video (data-id="…") passes oEmbed (exists, embeddable) and has a thumbnail.
Exit code 1 if anything fails.
"""
import html
import json
import re
import sys
import urllib.error
import urllib.request

UA = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 14_0) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/129 Safari/537.36'


def fetch(url: str, timeout: int = 20) -> tuple[int, bytes]:
    req = urllib.request.Request(url, headers={'User-Agent': UA})
    try:
        with urllib.request.urlopen(req, timeout=timeout) as r:
            return r.status, r.read(200_000)
    except urllib.error.HTTPError as e:
        return e.code, b''
    except Exception:
        return 0, b''


def main() -> None:
    if len(sys.argv) < 2:
        sys.exit(__doc__)
    path = sys.argv[1]
    offline = '--offline' in sys.argv
    s = open(path).read()
    failures = []

    left = re.findall(r'\{\{[^}]*\}\}', s)
    if left:
        failures.append(f'placeholders left: {left}')

    ids = set(re.findall(r'id="([^"]+)"', s))
    broken = sorted({a for a in re.findall(r'href="#([^"/]*)', s) if a and a not in ids})
    if broken:
        failures.append(f'broken in-page anchors: {broken}')

    questions = re.findall(r'<div class="q"[^>]*>(.*?)<div class="learn">', s, re.S)
    for i, q in enumerate(questions, 1):
        counts = [len(html.unescape(re.sub(r'<[^>]+>', '', b)).split())
                  for b in re.findall(r'<button type="button">(.*?)</button>', q, re.S)]
        if len(set(counts)) != 1:
            failures.append(f'quiz Q{i}: unequal word counts {counts}')
    print(f'{len(questions)} quiz questions, {len(ids)} ids')

    if not offline:
        for url in sorted({html.unescape(u) for u in re.findall(r'href="(https?://[^"]+)"', s)}):
            code, _ = fetch(url.split('#')[0])
            private = re.match(r'https://github\.com/[^/]+/[^/]+/pull/\d+', url)
            status = 'ok' if code == 200 else ('private? (needs login)' if private and code == 404 else 'FAIL')
            print(f'{code} {status:>8}  {url}')
            if status == 'FAIL':
                failures.append(f'link {code}: {url}')
        for vid in sorted(set(re.findall(r'data-id="([^"]+)"', s))):
            code, body = fetch(f'https://www.youtube.com/oembed?url=https://www.youtube.com/watch?v={vid}&format=json')
            thumb, _ = fetch(f'https://i.ytimg.com/vi/{vid}/hqdefault.jpg')
            title = json.loads(body)['title'][:60] if code == 200 else '-'
            print(f'video {vid}: oEmbed {code}, thumb {thumb}  {title}')
            if code != 200 or thumb != 200:
                failures.append(f'video {vid}: oEmbed {code}, thumb {thumb}')

    if failures:
        print('\nFAILED:\n- ' + '\n- '.join(failures))
        sys.exit(1)
    print('\nAll checks passed.')


if __name__ == '__main__':
    main()
