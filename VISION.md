# PR Explainers: product vision and Dan's notes

> Living document. Collects **everything** Dan said about the "PR explainer" idea, so nothing gets lost.
> Part 1 is an organised summary. Part 2 is a **faithful English translation** of his messages, which he dictates in Italian (source of truth).
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

### Language
- Everything in the repository (code, comments, docs, skill, this file) is in **English**; the audience is international. Dan writes to the agent in Italian, and his messages are logged here in translation.
- Explainers default to English; another language only on request.

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
- Pulling in related older PRs is welcome ("that's exactly right"): the concepts should be seen as a whole.
- For each PR: status, what it contains, where the explainer talks about it.
- **Open question.** A first attempt (two groups in the sidebar, a "PRs" page with the stack and a card per PR, PR chips at the top of each module) did not convince Dan and was reverted the same day. He wants to think about it.

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

## Part 2 — Dan's messages (faithful English translation)

Dan dictates in Italian. Each message is translated as closely as possible, keeping his wording and tone; the Italian originals are in the git history (commit `af06212`). Speech-to-text slips are corrected in brackets.

### Message 1 (2026-10-09): the experiment

> So, before merging that series of PRs, I want to try an experiment. It's an experiment I'd like to turn into either a skill or a program; it could even be a program you install on Mac or Windows, and it has nothing to do with this specific project, these specific PRs we're working on. It's just that this feature fits it very well.
>
> Basically this is a big feature: we're implementing things I have no knowledge of, and a lot of people do the same. They give the prompt, they make the plan, you propose things, you implement them, and then they have to be merged when there's a message, but meanwhile you end up multitasking: going somewhere else, giving another prompt, or messing around on your phone.
>
> Either way, the moment comes when there's the PR and it needs a review. And we, who created the PR, have to merge this stuff without really knowing how it works.
>
> So your goal with this thing I want us to build is to create, for now in a temporary folder, something we don't commit to this repo: a sort of presentation/article where you explain to me exactly what was implemented and how. Not just text, but also illustrations that help me understand, links to videos and articles so I can go deeper, code snippets so I understand exactly, and maybe even a quiz at the end.
>
> I'd seen something similar done with a skill called "Teach Me"; look among the skills, there should be a "Teach Me" that did something like this.
>
> So the goal is to explain to me what was implemented, why it was implemented, which other solutions we had and why this one was the best; and not so that I can parrot it back, but so that I really understand properly what this thing is.

### Message 2 (2026-10-09)

> What do you think could be done better? I don't mean the PRs, I mean this explainer.

### Message 3 (2026-10-09): feedback and product vision

> About point 2, that it was written from the memory of the conversation and not from the diff: that's fine, because I'm not interested in seeing the line-by-line difference; I'm interested in understanding the concept behind it, how this thing works, as if I were studying it. As for point 1, I'm fine with it. I like the idea of a companion version that's only three minutes; that could be an additional mode.
>
> So that's fine, but actually... I wouldn't overdo it, I wouldn't put many time limits; it doesn't have to be quick. My goal is to understand how this thing works, so if it takes half an hour, between reading this and going to the recommended links and so on, half an hour or an hour, I don't care, that's fine; what matters is that I understand how it works. The diagrams being static: if they were animated, step by step, that could be nice. And the quiz too, of course: it has to be the kind of quiz that switches my brain on, not just "did you read it or not", but "did you understand it or not".
>
> And these quizzes don't have to be blocking: if I got it wrong, it tells me "No, look, it's for this reason", and gives me a full explanation. About point 5, I keep saying this isn't a PR review; there are other tools for that. This is about understanding what it is, what's being introduced. Yes, the fact that it doesn't know who I am is fair; it would be better to adapt to me and understand me. Maybe I'd leave that for a later stage, but I'd start from the assumption that we're all mid-level developers. We're certainly not juniors, so there's no need to explain trivial concepts to me. But the feature itself, for example: next we'll have to implement voice-to-voice, and there you have... TTS, which I have no idea what it is or how it works, things like that. Those are things that, even as a senior, I have no idea how they work, and I need to understand them. The YouTube part would be really nice: being able to recommend quality videos, maybe based on the authority of the YouTuber somehow. I don't know, there are ways, I don't know how, but being able to say "go watch this video that talks exactly about this and explains it well" would be very interesting, right? Or "go read this article to dig into this specific thing, it covers it very well". And on point 8, I still say the quiz is just a side thing; it isn't really needed, it's more like "do you want to test yourself to see if you understood". And even if the user gets it wrong, the point isn't to say "ah, wrong, now you have to retake the quiz, you didn't pass, you suck", but the opposite: "look here, you got it wrong for this reason, so maybe this wasn't clear to you"; and if you want to understand better how this works, you can go read this article and watch this video.
>
> As for becoming a real app, I agree with you, in the sense that I'd have two kinds of target. One is the developer, working locally or in the cloud, who says: "OK, let me study what the heck Claude did here, because I have no idea", and so needs to understand it. The second target is the people who do reviews.
>
> I was thinking: on GitHub you could connect this thing, grant permissions to the app, then add a flag, because not every PR needs this. But maybe there are PRs, especially stacked ones, at the moment [with a stacked-PR tool], that get a flag, a label that triggers it... or a link in the description that generates this content; you click it, you go to an external page where all of this is explained, and you take the test.
>
> Taking it further, some might even say: "This doesn't get merged until two people out of three have read this and taken this test", so you could add checks on GitHub that verify two people took the test; and maybe be even stricter: two people out of three, or out of five, have not only read it and taken the test, but also passed it.
>
> So the product: a skill is OK, if we want, that's fine, but also an app. I'd really make an app that somehow connects... it would be nice if everything happened inside the app: from inside the app you pick the Claude session, see whether this can be done through the Claude or Codex API, and say:
>
> "OK, I want you to explain this session's work to me", something like that; while on the GitHub side, obviously, it creates a link to a properly made web page, and you go there, outside GitHub.
>
> Anyway, I want everything I'm saying here transcribed, so write it all down in a file, everything I told you, because I don't want any of it lost. The learning-history part could be interesting: you can go back and review, it's linked to the PRs you made; you might say "look at this one, I'll study it properly tomorrow", something like that.

### Message 4 (2026-10-09): feedback on v2

> So, a few things:
> - I don't want the links and videos all at the bottom; you can put them inline while you explain a concept, or at the end of the chapter
> - you can also embed the videos, so I don't have to leave the page
> - I'm interested in explanations aimed at understanding the concepts, at the architecture level: how it joins the rest, why a certain solution is needed, how one could arrive at it
> - in the tests I'm not necessarily interested in things about my code (like "if I call this endpoint unauthenticated it returns 401"), but other things
>
> Things I liked: I read it quickly and I really liked the content; it's exactly what I wanted to learn. Maybe what's missing is the [voice-to-text] stuff from the three PRs I had already opened.

*(Interpretation: "the three PRs I had already opened" = the July voice-to-text dictation series #933 backend, #936 web, #937 mobile, i.e. the STT half of the cascade.)*

### Message 5 (2026-10-09): layout

> And one thing: I don't like the wall of text; it would be nice to have modules, or something else, I'm not sure. Or at least a couple of things (like the quiz) I'd put somewhere else, on other pages, or at least reachable from a sidebar, I don't know.

### Message 6 (2026-10-09): onboarding by level (for the app)

> In the app, when we build it, let's remember to do one thing, an onboarding for the user, because I was thinking... Our user could also be a young vibecoder who has just started writing code and knows nothing, so the concepts there should be explained in much more detail, not like for us seniors; a senior is different. So this is something to remember precisely when we build the app.

### Message 7 (2026-10-09): ask-an-LLM inside the app

> Another thing to put on the list for when we build the app: very often someone has a question about a concept, about something, so adding an LLM that answers questions and so on about that topic could make sense.

### Message 8 (2026-10-09): the PRs shown as bare numbers

> About the PRs you put there: no, what I meant was... I'm not convinced by just the numbers. It would be, I don't know, I'm not sure how to do it, because, for example, in this case there are three PRs that are exactly the thing, the ones I've just opened, and I say: "Look, it's exactly these three PRs".
>
> I opened them, and then, rightly, you found three older ones, and that's exactly right, because there I added audio-to-text, so this should be seen as a whole, these concepts. However, like this it feels a bit thrown in; you can't tell which three are the current ones and which are the old ones, whether they're to be merged or already merged, I don't know. I just know it doesn't fully convince me.

### Message 9 (2026-10-09): onboarding onto a whole repo

> Another thing I was thinking: this could be used when you say "I'm new to this project, I just arrived, I just got hired". So you take the repo and say: "Now, I want to understand something about a specific PR from my session that I just did, but I want to understand this whole repo".
>
> And then our program should analyse it properly and create many explanations there too, each with its own modules for a part of the project, which don't only explain the repo itself but also the concepts in that repo and so on, right? To improve, I mean to bootstrap the speed of learning. Anyway, these are things people already do now: they start Claude and begin asking it questions. But here it would add more, right?

### Message 10 (2026-10-10): everything in the repo in English

> Listen, something very important: since the README and everything else is written in Italian, but it's meant for an English-speaking audience, everything must be written in English: the skills, the README, the vision.
>
> I talk to you in Italian because it's my native language, but everything that goes into the code, comments, anything, must be in English. This must be a very important rule. So now update the repo, all in English, and I'd like the README to also have a couple of lines on how to install this skill.
