// Shared "test yourself" quiz. Never blocking: a wrong answer explains why and
// points to what to revisit. Markup:
//   <div class="quiz" data-quiz>
//     <div class="q"> <h4>…</h4>
//       <div class="opts">
//         <div class="opt" data-correct><button>…</button><div class="why">…</div></div>
//         <div class="opt"><button>…</button><div class="why">…</div></div>
//       </div>
//       <div class="learn">what to revisit: section + resource links</div>
//     </div>
//     <div class="score"></div> <div class="summary"></div>
//   </div>
// A question may carry data-module="<module id>": the quiz then shows filter
// chips, and the course route #quiz/<module id> pre-selects one.
// Options are shuffled per load so position never gives the answer away.
// Hidden questions (e.g. full-only ones in 3-minute mode) are not counted.
(function () {
  function shuffle(list) {
    for (let i = list.length - 1; i > 0; i -= 1) {
      const j = Math.floor(Math.random() * (i + 1));
      [list[i], list[j]] = [list[j], list[i]];
    }
    return list;
  }

  function visible(el) {
    return el.offsetParent !== null;
  }

  document.querySelectorAll('[data-quiz]').forEach((quiz) => {
    const questions = Array.from(quiz.querySelectorAll('.q'));
    const score = quiz.querySelector('.score');
    const summary = quiz.querySelector('.summary');

    function update() {
      const shown = questions.filter(visible);
      const answered = shown.filter((q) => q.classList.contains('answered'));
      const right = answered.filter((q) => !q.classList.contains('wrong'));
      if (score) {
        score.textContent = window.explainerText('score', {
          answered: answered.length,
          total: shown.length,
          right: right.length,
          rightWord: window.explainerText(right.length === 1 ? 'rightOne' : 'rightMany'),
        });
      }
      if (!summary) return;
      if (answered.length < shown.length || shown.length === 0) {
        summary.classList.remove('show');
        return;
      }
      const missed = answered.filter((q) => q.classList.contains('wrong'));
      summary.innerHTML = missed.length
        ? `${window.explainerText('summaryMissed', { right: right.length, total: shown.length })}<ul>${missed
            .map((q) => `<li>${q.querySelector('h4').textContent.replace(/^\d+\.\s*/, '')}<br>${q.querySelector('.learn')?.innerHTML ?? ''}</li>`)
            .join('')}</ul>`
        : window.explainerText('summaryAll', { right: right.length, total: shown.length });
      summary.classList.add('show');
    }

    questions.forEach((q) => {
      const opts = q.querySelector('.opts');
      const options = Array.from(opts.querySelectorAll('.opt'));
      options.forEach((o) => {
        if (o.hasAttribute('data-correct')) o.classList.add('correct');
      });
      shuffle(options).forEach((o) => opts.appendChild(o));

      options.forEach((o) =>
        o.querySelector('button').addEventListener('click', () => {
          if (q.classList.contains('answered')) return;
          q.classList.add('answered');
          o.classList.add('picked');
          if (!o.classList.contains('correct')) q.classList.add('wrong');
          options.forEach((x) => (x.querySelector('button').disabled = true));
          update();
        }),
      );
    });

    quiz.querySelector('.reset')?.addEventListener('click', () => {
      questions.forEach((q) => {
        q.classList.remove('answered', 'wrong');
        const opts = q.querySelector('.opts');
        const options = Array.from(opts.querySelectorAll('.opt'));
        options.forEach((o) => {
          o.classList.remove('picked');
          o.querySelector('button').disabled = false;
        });
        shuffle(options).forEach((o) => opts.appendChild(o));
      });
      update();
    });

    // Filter by module.
    const ids = [...new Set(questions.map((q) => q.dataset.module).filter(Boolean))];
    if (ids.length) {
      const bar = document.createElement('div');
      bar.className = 'quiz-filter';
      const chips = [['', window.explainerText('all')]].concat(ids.map((id) => [id, document.getElementById(id)?.dataset.title || id]));
      chips.forEach(([id, label]) => {
        const b = document.createElement('button');
        b.type = 'button';
        b.dataset.filter = id;
        b.textContent = label;
        b.addEventListener('click', () => filter(id));
        bar.appendChild(b);
      });
      quiz.prepend(bar);
    }
    function filter(id) {
      questions.forEach((q) => q.classList.toggle('filtered-out', Boolean(id) && q.dataset.module !== id));
      quiz.querySelectorAll('.quiz-filter button').forEach((b) => b.setAttribute('aria-pressed', String(b.dataset.filter === (id || ''))));
      update();
    }
    document.addEventListener('modulechange', (e) => {
      if (e.detail.module.contains(quiz)) filter(e.detail.param || '');
    });
    filter('');
  });
})();
