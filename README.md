# PR explainers (esperimento)

Pagine HTML che fanno *capire* una feature o una serie di PR costruita con un agente: cosa entra, come funziona, perché è fatta così, quali alternative c'erano. Non è una code review. Leggi `VISION.md` per l'idea completa.

Ogni spiegazione è un piccolo **corso a moduli** con una sidebar:
- i **concetti di dominio** spiegati per un developer mid-level;
- **come ci si arriva** (dalla soluzione ingenua a quella vera) e **come si unisce al resto** della piattaforma;
- **diagrammi animati passo per passo**, con lo snippet di codice di ogni passo;
- **video incorporati** e fonti verificate dentro i moduli, ognuna con il perché;
- un modulo **“In 3 minuti”**;
- un **quiz** non bloccante sui concetti, su una pagina a parte, che spiega ogni risposta sbagliata e indica cosa rivedere.

## Struttura
- `skill/explain/` — la skill `/explain`: il processo, il template e gli script (`quiz.py` genera il quiz da `quiz.json`, `check.py` controlla link, video, ancore e quiz). È collegata in `~/.claude/skills/explain` con un link simbolico.
- `assets/` — componenti condivisi (il contratto del markup è nel commento in testa a ogni file):
  - `explainer.css` — stile (chiaro e scuro);
  - `course.js` — sidebar, un modulo alla volta, link avanti/indietro, schede;
  - `stepper.js` — diagramma SVG passo per passo, con scenari e modalità “costruzione”;
  - `video.js` — video YouTube incorporati, caricati solo al clic;
  - `quiz.js` — quiz con spiegazione per ogni opzione, filtro per modulo e riepilogo di cosa rivedere.
- `AAAA-MM-GG-<tema>/index.html` — una spiegazione per serie di PR. **Restano in locale** (sono nel `.gitignore`): parlano quasi sempre di codice privato. Per pubblicarne una sicura, `git add -f`.

## Vederle
```
python3 -m http.server 8765
```
poi apri http://localhost:8765/AAAA-MM-GG-tema/ (ogni modulo ha il suo indirizzo, per esempio `#stt` o `#quiz`).
