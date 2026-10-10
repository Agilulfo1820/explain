// Course shell: one module visible at a time, a sidebar built from the
// modules, prev/next links, tabs. Markup:
//   <aside class="sidebar"><div class="brand">…</div><nav class="modules"></nav></aside>
//   <main>
//     <section class="module" id="stt" data-title="Dalla voce al testo" data-group="Concetti" data-time="8 min">…</section>
//     <section class="module" id="quiz" data-title="Quiz" data-group="Strumenti" data-tool>…</section>
//   </main>
// Routing is by hash: #stt shows that module, #csp shows the module that
// contains #csp and scrolls to it, #quiz/stt passes "stt" as a parameter.
// Every change fires `modulechange` on document with { module, param }.
// Tabs: <div class="tabs"><div class="tab-panel" data-label="Web">…</div>…</div>
(function () {
  const VISITED = 'pr-explainer-visited:' + location.pathname;
  const main = document.querySelector('main');
  const modules = Array.from(main.querySelectorAll(':scope > .module'));
  const lessons = modules.filter((m) => !m.hasAttribute('data-tool'));
  const nav = document.querySelector('.sidebar .modules');
  const sidebar = document.querySelector('.sidebar');

  let visited = new Set();
  try {
    visited = new Set(JSON.parse(localStorage.getItem(VISITED) || '[]'));
  } catch {
    visited = new Set();
  }
  function remember(id) {
    visited.add(id);
    try {
      localStorage.setItem(VISITED, JSON.stringify([...visited]));
    } catch {
      // Progress is a convenience only.
    }
  }

  // Sidebar, grouped in order of appearance.
  const links = new Map();
  let group = null;
  let list = null;
  let n = 0;
  modules.forEach((m) => {
    if (m.dataset.group !== group) {
      group = m.dataset.group;
      const h = document.createElement('div');
      h.className = 'group';
      h.textContent = group;
      nav.appendChild(h);
      list = document.createElement('ol');
      nav.appendChild(list);
    }
    const li = document.createElement('li');
    const a = document.createElement('a');
    a.href = '#' + m.id;
    const num = m.hasAttribute('data-tool') ? '' : `<span class="num">${n++}</span>`;
    a.innerHTML = `${num}<span class="t">${m.dataset.title}</span>${m.dataset.time ? `<span class="time">${m.dataset.time}</span>` : ''}`;
    li.appendChild(a);
    list.appendChild(li);
    links.set(m.id, a);
  });

  // Prev / next (lessons only) and a pointer to this module's quiz questions.
  lessons.forEach((m, i) => {
    const foot = document.createElement('div');
    foot.className = 'module-foot';
    const questions = document.querySelectorAll(`.q[data-module="${m.id}"]`).length;
    const prev = lessons[i - 1];
    const next = lessons[i + 1];
    foot.innerHTML =
      (questions
        ? `<a class="check" href="#quiz/${m.id}">✎ Mettiti alla prova su questo modulo (${questions} ${questions === 1 ? 'domanda' : 'domande'})</a>`
        : '') +
      '<div class="pn">' +
      (prev ? `<a class="prev" href="#${prev.id}">← ${prev.dataset.title}</a>` : '<span></span>') +
      (next ? `<a class="next" href="#${next.id}">${next.dataset.title} →</a>` : '<a class="next" href="#quiz">Quiz finale →</a>') +
      '</div>';
    m.appendChild(foot);
  });

  // Tabs.
  document.querySelectorAll('.tabs').forEach((tabs) => {
    const panels = Array.from(tabs.querySelectorAll(':scope > .tab-panel'));
    const bar = document.createElement('div');
    bar.className = 'tab-bar';
    bar.setAttribute('role', 'tablist');
    panels.forEach((p, i) => {
      const b = document.createElement('button');
      b.type = 'button';
      b.setAttribute('role', 'tab');
      b.textContent = p.dataset.label;
      b.addEventListener('click', () => select(i));
      bar.appendChild(b);
    });
    tabs.prepend(bar);
    function select(i) {
      panels.forEach((p, k) => (p.hidden = k !== i));
      Array.from(bar.children).forEach((b, k) => b.setAttribute('aria-selected', String(k === i)));
    }
    select(0);
  });

  function route() {
    const raw = decodeURIComponent(location.hash.slice(1));
    const [id, param] = raw.split('/');
    const target = (id && document.getElementById(id)) || null;
    const mod = target?.closest('.module') || modules[0];
    modules.forEach((m) => (m.hidden = m !== mod));
    links.forEach((a, key) => {
      a.classList.toggle('current', key === mod.id);
      a.classList.toggle('seen', visited.has(key));
    });
    remember(mod.id);
    links.get(mod.id)?.classList.add('seen');
    sidebar.classList.remove('open');
    document.title = `${mod.dataset.title} · ${document.body.dataset.course || ''}`;
    if (target && target !== mod) target.scrollIntoView();
    else window.scrollTo(0, 0);
    document.dispatchEvent(new CustomEvent('modulechange', { detail: { module: mod, param } }));
  }

  document.querySelector('.menu-toggle')?.addEventListener('click', () => sidebar.classList.toggle('open'));
  window.addEventListener('hashchange', route);
  route();
})();
