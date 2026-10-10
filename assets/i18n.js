// UI strings for the shared components, picked from <html lang="…">.
// English is the default; add a language by adding a dictionary below.
// Load this before the other component scripts. Usage: explainerText('next')
// or explainerText('steps', { i: 2, n: 10 }).
(function () {
  const STRINGS = {
    en: {
      prev: '← Back',
      next: 'Next →',
      step: 'step {i} of {n}',
      stepLabel: 'Step {i}',
      watch: 'Watch: {title}',
      from: 'from {time}',
      checkModule: '✎ Test yourself on this module ({n} {questions})',
      question: 'question',
      questions: 'questions',
      finalQuiz: 'Final quiz →',
      score: '{answered}/{total} answered · {right} {rightWord}',
      rightOne: 'right',
      rightMany: 'right',
      summaryMissed: '<strong>{right} of {total}.</strong> No big deal: that is what the quiz is for. Here is what is worth reviewing:',
      summaryAll: '<strong>{right} of {total}.</strong> You have the right mental model. To go deeper, ask the agent a few “what would happen if…” questions about the parts that caught your interest.',
      all: 'All',
    },
    it: {
      prev: '← Indietro',
      next: 'Avanti →',
      step: 'passo {i} di {n}',
      stepLabel: 'Passo {i}',
      watch: 'Guarda: {title}',
      from: 'dal minuto {time}',
      checkModule: '✎ Mettiti alla prova su questo modulo ({n} {questions})',
      question: 'domanda',
      questions: 'domande',
      finalQuiz: 'Quiz finale →',
      score: '{answered}/{total} risposte · {right} {rightWord}',
      rightOne: 'giusta',
      rightMany: 'giuste',
      summaryMissed: '<strong>{right} su {total}.</strong> Niente di grave: è proprio il punto del quiz. Ecco cosa ti conviene rivedere:',
      summaryAll: '<strong>{right} su {total}.</strong> Hai il modello mentale giusto. Se vuoi andare più a fondo, chiedi all\'agente qualche “cosa succederebbe se…” sui punti che ti hanno incuriosito.',
      all: 'Tutte',
    },
  };
  const lang = (document.documentElement.lang || 'en').slice(0, 2);
  const table = STRINGS[lang] || STRINGS.en;

  window.explainerText = function (key, vars) {
    const template = table[key] ?? STRINGS.en[key] ?? key;
    return template.replace(/\{(\w+)\}/g, (_, name) => (vars && name in vars ? vars[name] : `{${name}}`));
  };
})();
