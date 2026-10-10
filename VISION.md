# PR Explainers: product vision and Dan's notes

> Living document. Collects **everything** Dan said about the "PR explainer" idea, so nothing gets lost.
> Part 1 is an organised summary. Part 2 is the **verbatim transcription** of his messages (source of truth).
> Started 2026-10-09.

---

## Part 1 — Organised summary

### The problem
- Big features get built with an AI agent (Claude, Codex…): prompt, plan, the agent proposes and implements. Meanwhile the developer multitasks: another task, another prompt, or the phone.
- Then the PR arrives and has to be reviewed and merged. Whoever **created** it often doesn't really know how it works.
- The same is true for many people, not just Dan.

### The goal
- Not "study it by rote", but **really understand** what was introduced: *what* it is, *how* it works, *why* it was done, *which alternatives* existed and *why this one was the best*.
- **This is not a code review.** There are other tools for that. Here the aim is to **understand the concept** behind the feature, as if studying it.
- The reader **doesn't want the line-by-line diff**. They want the concepts, the mechanisms, the reasons.

### Format of an explainer
- A presentation/article with:
  - text that explains;
  - **illustrations** that help understanding;
  - **code snippets** where they help clarify;
  - **links to quality videos and articles** to go deeper;
  - an optional **final quiz**.
- **Length: no time limit.** If understanding takes half an hour or an hour (reading, watching the recommended videos, etc.), that's fine. What matters is understanding.
- A **"3 minutes" mode** as an **additional** option, alongside the full version.
- **Animated, step-by-step diagrams** would be a nice touch.
- **Assumed baseline:** we're all **mid-level developers** (not juniors), so no need to explain trivial concepts. But **domain concepts** unknown even to a senior (e.g. TTS, STT, how voice-to-voice works) **must be explained well**.

### Quiz
- It has to **make you think**: test whether you've *understood*, not whether you've *read*.
- It's **not blocking**. It's a "put yourself to the test" moment, not a gate.
- When you get one wrong, it doesn't say "wrong, redo it, you failed". It says: **"here's why it's wrong, so maybe this thing wasn't clear"**, and points you to **the article or video that explains it well**.

### Sources (videos and articles)
- Recommending **quality** videos is a key point: "go watch this video, which covers exactly this and explains it well".
- Video quality could be judged by the **YouTuber's authority**, in some way still to be defined.
- The same goes for articles: "go read this article on this specific point, it covers it really well".

### Personalisation (later stage)
- It doesn't know who the user is. Adapting to what the user already knows would be better, but **that comes at a later stage**.
- **App onboarding (to remember when we build the app):** ask the user their level at the start. The audience is not only mid/senior developers: it can be a **beginner "vibecoder"** who has just started writing code and knows nothing. For them, concepts must be explained **in much more detail**; a senior needs far less. The explainer's depth adapts to the answer.

### Learning history
- Interesting: being able to **revisit** explanations, **linked to your own PRs**.
- E.g. "look at this one, I'll study it properly tomorrow".

### Feedback on v2 (2026-10-09)
- **Sources inline**, not in a list at the bottom: next to the concept they explain, or at the end of the chapter.
- **Embedded videos**, so the reader never has to leave the page.
- Explanations aimed at **concepts and architecture**: how the feature joins the rest of the system, **why** a given solution is needed, and **how one could arrive at it**.
- **Quiz** about transferable concepts, not about the specifics of "my code" (e.g. not "this endpoint returns 401 when unauthenticated").
- **No wall of text**: split into **modules**, with a **sidebar**; the quiz (and similar tools) on **separate pages** reachable from the sidebar.
- Content of v2: "exactly what I wanted to learn". Missing: the voice-to-text dictation from the earlier PRs (#933, #936, #937).

### A third use case: onboarding onto a whole repo
- Besides "explain this PR/session", a **newcomer** (just joined, just hired) points the app at a **whole repository**: "I want to understand this repo".
- The app analyses the repo and produces **many explainers**, each with its own modules, one per part of the project. They explain not only the code layout but also **the concepts** the repo relies on (domain, architecture, patterns).
- Goal: **bootstrap learning speed**. Today people already do this by starting Claude and asking questions; the app adds structure, concepts, diagrams, sources, quizzes and a learning path on top.

### Showing the PRs (feedback 2026-10-09)
- Bare PR numbers are not enough. The reader must see at a glance **which PRs are the subject** (open, to merge, in stack order) and **which are context** (older, already merged, included because the concepts belong together).
- Pulling in related older PRs is welcome ("è fatto giusto bene"): the concepts should be seen as a whole.
- For each PR: status, what it contains, where the explainer talks about it.
- **Open question.** A first attempt (two groups in the sidebar, a "Le PR" page with the stack and a card per PR, PR chips at the top of each module) did not convince Dan and was reverted the same day. He wants to think about it.

### Ask questions in the app (to remember when we build the app)
- The reader often has a question about a concept. The app should include an **LLM that answers questions on that topic**, inside the explainer (today the page only says "ask the agent").

### Product: two targets
1. **The developer** working locally or in the cloud with an agent: "OK, let me study what Claude did here, because I have no idea." They need to understand it.
2. **The reviewers.**

### Product: form
- A **skill** is fine as a first step, but the real goal is an **app**.
- **Desktop app (Mac/Windows):**
  - everything happens inside the app;
  - you **pick the Claude (or Codex) session** from inside the app (via API, if possible) and say "explain this session's work to me".
- **GitHub integration:**
  - a GitHub App you grant permissions to;
  - not every PR needs it, so it's triggered with a **label**, or with a **link in the description** that generates the content;
  - especially useful for **stacked PRs** (stacked PR tools);
  - the link opens an **external web page** (outside GitHub) with the explanation and the test.
- **Optional merge gate on GitHub:**
  - a team could decide that "this doesn't get merged until N people out of M have read the explanation and taken the test";
  - even stricter: "at least 2 out of 3 (or out of 5) have not only taken it, but **passed** it";
  - implemented as a **GitHub check** that verifies those conditions.

### Feedback on the first explainer (read-aloud, 2026-10-09)
Answering my critique, point by point:

| My critique | Dan's position |
|---|---|
| 1. Too long and linear | The 3-minute version is fine as an **extra mode**, but **no time limit** on the main one |
| 2. Written from the conversation, not the diff | **Fine like this**: the line-by-line diff isn't the point, the concept is |
| 3. Static diagrams | **Animated step-by-step** ones would be nice |
| 4. Memory quiz | Yes: it must test **understanding**, it **isn't blocking**, and a wrong answer gets an explanation plus links |
| 5. It doesn't help the merge decision / risks | **No**: this isn't a PR review, there are other tools for that |
| 6. It doesn't know who you are | Yes, but **later on**. For now assume a mid-level developer |
| 7. Sources chosen "by search" | Yes: **quality** videos and articles, maybe judged by authority |
| 8. Spaced repetition missing | The quiz is only "test yourself", not something central |
| Product (skill → app) | **App**, with a GitHub integration and a desktop app connected to Claude/Codex sessions; learning history linked to your own PRs |

---

## Part 2 — Verbatim transcription of Dan's messages

### Message 1 (2026-10-09): the experiment

> Allora, prima di mergiare quella serie di PR, voglio fare un esperimento. Questo è un esperimento che poi vorrei anche trasformare o in una skill o in un programma; potrebbe anche essere un programma che si installa sul Mac o su Windows, e non c'entra nulla con questo progetto specifico, queste PR specifiche a cui stiamo lavorando. Il progetto è questo, è che si adatta molto bene a questa feature.
>
> Praticamente questa è una feature grossa: implementiamo delle cose di cui io non ho conoscenza e la stessa cosa la fanno tante persone. Danno il prompt, fanno il plan, tu proponi delle cose, le implementi e poi bisogna emergiarle se c'è un messaggio, ma poi uno è portato a fare multitasking, quindi andare da un'altra parte oppure dare un altro prompt oppure cazzeggiare sul telefono.
>
> Comunque sia, in entrambi i casi arriva il momento che c'è la PR e bisogna fare review. Comunque noi, che abbiamo creato la PR, dobbiamo emergiarle questa roba e non sappiamo veramente come funziona.
>
> Allora l'obiettivo tuo con questa cosa che voglio che andiamo a creare è che crei, per il momento puoi crearlo su una cartella temporanea, una roba del genere che non dobbiamo commentare su questa repo, una specie di presentazione/articolo dove mi spieghi esattamente cosa è stato implementato e come, ma non solo scrivendo testo, ma anche mettendo illustrazioni che mi aiutino a capire, linkando video e articoli in modo tale che io possa approfondire di più, mettendo anche parti, snippet di codice, per farmi capire un po' meglio esattamente, e si può fare addirittura anche un quiz alla fine.
>
> Avevo visto una roba simile fatta con una skill che si chiamava "Teach Me", che adesso te la metto, cioè prova a guardare tra le skill, ci dovrebbe essere "Teach Me" che faceva una cosa simile.
>
> Quindi l'obiettivo appunto è spiegarmi cosa è stato implementato, perché è stato implementato, quali altre soluzioni avevamo e perché questa era la migliore; ma non solo che io possa poi studiarla a pappagallo quella roba, ma che io proprio capisca per bene esattamente cos'è questa roba.

### Message 2 (2026-10-09)

> Che cosa potrebbe essere fatto meglio secondo te? Non intendo delle PR, ma di questo X-Player qui.

*(Note: "X-Player" = "explainer", a speech-to-text artefact.)*

### Message 3 (2026-10-09): feedback and product vision

> Riguardo il punto 2 del fatto che l'ha letto dalla memoria della conversazione, non dal diff, va bene perché comunque questo non è, cioè, non sono interessato a vedere la differenza linea dopo linea; sono interessato a capire il concetto che ci sta dietro, cioè di come questa roba funziona, come se appunto studiassi questa cosa. Mentre riguardo il punto 1, a me può anche stare. Cioè mi piace l'idea che è annesso, è tipo solo tre minuti, quindi ci può stare, potrebbe essere una modalità aggiuntiva in più.
>
> Quindi quello ci sta, però in realtà poi... Io non la farei troppo, non metterei troppi limiti di tempo, non per forza deve essere una cosa veloce, cioè il mio obiettivo è capire come funziona questa cosa, quindi se ci vuole mezz'ora per capire, perché poi tra leggere questo, andare sull'inconsigliate, quant'altro ci vogliono mezz'ora, un'ora, non mi interessa, cioè va bene, uguale, l'importante è che io capisco come funziona. Il fatto che i diagrammi siano statici, se fossero animati, step by step, potrebbe essere una cosa carina. E anche la parte dei quiz, certo, deve essere un tipo di quiz che mi attivi il cervello, che quindi non sia soltanto un qualcosa... cioè hai letto o non hai letto, ma hai capito o non hai capito.
>
> E comunque non devono per forza essere bloccanti questi quiz, quindi se io ho sbagliato mi dice: "No, guarda, perché per questo motivo", quindi mi dà tutta una spiegazione. Riguardo il punto 5, continuo a dire che questo non è una review di un PR, per quello ci sono altri tool, altre cose; questo è un capire che cos'è, cosa viene introdotto. Sì, la cosa che non sa chi sono ci può stare, che sarebbe meglio adattarla e comprendere da me. Magari lo metterei più su un punto successivo, però partirei dal presupposto che siamo tutti developer middle, cioè sicuramente non siamo junior, quindi non c'è bisogno di spiegarmi concetti banali, però se la feature in sé, per esempio, adesso dopo dovremmo implementare il voice to voice, e lì ci sono... TTS che non ho idea di che cos'è, non ho idea di come funziona, robe del genere, quindi sono delle cose che, pur essendo senior, io non ho idea di come funzionano e quelle ho bisogno di capirle. La roba di YouTube invece sarebbe proprio bello poter consigliare video di una certa qualità, che potrebbero essere magari anche in base all'autorità che in qualche modo quello YouTuber, non lo so, ci sono dei modi, non so come però, proprio la cosa di poter dire "vatti a guardare questo video che parla esattamente di questa cosa e lo spiega bene", sarebbe molto interessante, no? Oppure "vai a leggere questo articolo per approfondire questa cosa qui specifica che se ne parla molto bene". Sì, sul punto 8 comunque continua a dire che il quiz è solo una cosa così, cioè non serve veramente, diciamo tipo ti vuoi mettere alla prova per vedere se hai capito; e anche se l'utente sbaglia lì, la cosa non è dire "ah, è sbagliato, adesso devi ripetere il quiz, non l'hai passato, sei da merda", ma al contrario è: "guarda qua, hai sbagliato per questo motivo, quindi forse non ti era stata chiara questa cosa qui"; e se ne vuoi capire meglio come funziona questo, puoi andare a leggere questo articolo e vedere questo video.
>
> Allora, per quanto riguarda il fatto di diventare una vera app, sono d'accordo con te, nel senso che io avrei due tipi di target. Uno è lo sviluppatore, che sviluppa un locale su cloud e dice: "Ok, dai, fammi studiare un attimo che cacchio ha fatto Cloud qui, perché non ho idea", e quindi ha bisogno di capirlo. Il secondo target, invece, sono quelli che vanno a fare review.
>
> Stavo pensando: su GitHub puoi prendere e collegare questa cosa, dare i permessi a questa app, poi ci metti un flag perché non tutte le PR hanno bisogno di questa cosa, ma magari ci sono delle PR, soprattutto le stack al momento su Pitap, fare le stack che mette un flag, una label che prende e ti... oppure si mette un link dentro la descrizione che genera questo contenuto, tu lo clicchi, vai su una pagina esterna dove tutta questa roba qui è spiegata e tu prendi il test.
>
> Per assurdo si potrebbe anche fare, alcuni potrebbero dire: "Questa roba non si immergia finché due persone su tre non leggono questa roba e fanno questo test", e quindi si possono mettere magari proprio dei check su GitHub che vanno a controllare se due persone hanno fatto questo test; e magari si può essere ancora più stringente, dove si dice due persone su tre o su cinque, almeno due persone non solo hanno fatto questo, hanno letto, solo hanno fatto il test, ma l'hanno anche passato.
>
> Quindi il prodotto è ok una skill, se vogliamo, che ci può stare, ma anche un'app. Io proprio farei un'app che in qualche modo prende, si connette... cioè sarebbe bello che si fa tutto dentro l'app, quindi che si chiude tu da dentro l'app, scegli la sessione di Cloud, vedi che attiva se tramite API si può fare questa roba di Cloud o di Codex e dici:
>
> "Ok, voglio che mi spieghi la roba di questa sessione", quindi qualcosa del genere; mentre sulla parte GitHub, ovviamente, che crea un link a una pagina fatta per bene, web, dove tu vai lì, quindi vai fuori da GitHub.
>
> Tutta questa cosa comunque che adesso io sto dicendo qui voglio che venga trascritta tutta, quindi su un file segnati, scriviti giù tutte le cose che io ti ho detto perché non vorrei che andassero perse in nessun modo. La parte della learning history potrebbe essere interessante, dove comunque uno va a rivedere, è collegata anche alle PR che ha fatto; dice magari "guarda questa, me la studio per bene domani", qualcosa del genere, ci può stare.

*(Speech-to-text notes: "emergiarle/immergia" = merge; "Cloud" = Claude; "sull'inconsigliate" = sui (link) consigliati; "Pitap" = probably a stacked-PR tool such as Graphite.)*

### Message 4 (2026-10-09): feedback on v2

> allora delle cose:
> - i link e i video non mi interessano tutti in fondo, puoi metterli in line mentre spieghi un concetto o alla fine del capitolo
> - anche i video puoi fare degli embedding cosi non devo lasciare la pagina
> - mi interessano spiegazioni mirate a capire i concetti, a livello di architettura come si unisce al resto, perche' una certa soluzione serve, come ci si puo' arrivare
> - nei test non mi interessa per forza cose sul mio codice (tipo se chiamo questo endpoint non autenticato che ritorna 401) ma altro
>
> COse che mi sono piaciute: ho letto velocemente e il contenuto mi e' piaciuto molto, e' proprio quello che volevo imparare. Forse manca la roba della text to voice delle tre pr che avevo gia' aperto

*(Interpretation: "the three PRs I had already opened" = the July voice-to-text dictation series #933 backend, #936 web, #937 mobile, i.e. the STT half of the cascade.)*

### Message 5 (2026-10-09): layout

> e una cosa, non mi piace il wall of text, sarebbe bello avere dei moduli, o altro, non so bene. O almeno un paio di cose (tipo quiz) li metterei da altra parte, su altre pagina, o almeno raggiungibile da una sidebar, non so

### Message 6 (2026-10-09): onboarding by level (for the app)

> Nell'app, quando poi la faremo, ricordiamoci di fare una cosa, un onboarding per l'utente, perché stavo pensando... Il nostro utente potrebbe essere anche un ragazzino vibecoder che ha appena cominciato a scrivere codice e non sa niente, quindi i concetti lì andrebbero spiegati molto più nel dettaglio, non come noi che siamo dei senior, mentre appunto un senior è diverso, quindi questa è una roba da ricordarsi proprio quando faremo l'app.

### Message 7 (2026-10-09): ask-an-LLM inside the app

> Un'altra cosa da mettere in lista per quando faremo l'app è che tante volte magari uno ha una domanda su un concetto, su un qualcosa, quindi comunque metterci un LLM che risponde a domande e quant'altro su quell'argomento ci potrebbe stare.

### Message 8 (2026-10-09): the PRs shown as bare numbers

> Riguardo invece le PR che mi ha messo lì, no, io intendevo proprio, cioè, non mi convince così con solo i numeri. Sarebbe proprio, non lo so, non saprei bene come fare perché, per esempio, in questo caso ci sono tre PR che parlano, cioè, che è proprio quello, magari che io adesso ho aperto e dico: "Guarda, sono proprio queste tre PR qui".
>
> Ho aperto, poi giustamente tu ne hai trovate altre tre più vecchie, ed è fatto giusto bene perché lì ho aggiunto audio to text, e quindi è comunque da vedere un po' nell'insieme questa cosa, questi concetti. Tuttavia, così mi sembra un po' buttati lì; non si capisce adesso quali tre sono quelli di adesso, quali vecchi, se sono da mergiare o emergiate, non lo so. So solo che non mi straconvince.

### Message 9 (2026-10-09): onboarding onto a whole repo

> Un'altra cosa, stavo pensando: questo potrebbe essere usato, che tu dici "io sono nuovo in questo progetto, sono appena arrivato, sono appena stato assunto". Quindi si prende la repo e si dice: "Tu, adesso, voglio capire una cosa di una PR specifica della sessione mia che ho appena fatto, ma voglio capire tutta questa repo".
>
> E allora il nostro programma dovrebbe analizzare per bene e anche lì creare tante spiegazioni, ognuna con i suoi moduli di parte del progetto, che non vanno solo a spiegare la repo in sé ma anche i concetti in quella repo e così via, no? Per migliorare, cioè per bootstrappare la velocità di apprendimento. Comunque sono cose che una persona già fa adesso: prende, fa partire Claude e si mette a fargli domande. Però qui aggiungerebbe più cose, no?
