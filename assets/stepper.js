// Step-by-step animated diagram. Markup:
//   <div class="stepper" data-stepper>
//     <svg> … <g class="node" data-node="api">…</g> … <path class="edge" id="e-req" d="…"/> </svg>
//     <div class="scenario" data-label="First play">
//       <div class="st" data-nodes="api db" data-edges="e-db e-db:r" data-state="bad">
//         <h4>…</h4><p>…</p><pre>…</pre>
//       </div> …
//     </div> …
//   </div>
// data-nodes: nodes lit on this step. data-edges: edges a packet travels, in
// order; ":r" travels it backwards. data-state="bad|ok" colours the last node.
// Reveal mode (<div class="stepper" data-stepper data-reveal>) builds the
// diagram up: data-nodes lists every node visible so far, data-new the ones
// highlighted as just added, data-links the (static) edges visible so far.
// Without JS every step stays listed under the diagram.
(function () {
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const NS = 'http://www.w3.org/2000/svg';

  document.querySelectorAll('[data-stepper]').forEach((root) => {
    const svg = root.querySelector('svg');
    const scenarios = Array.from(root.querySelectorAll('.scenario'));
    const nodes = Array.from(svg.querySelectorAll('.node'));
    const edges = Array.from(svg.querySelectorAll('.edge'));
    const packet = document.createElementNS(NS, 'circle');
    packet.setAttribute('r', '7');
    packet.setAttribute('class', 'packet');
    svg.appendChild(packet);
    root.classList.add('js');

    // Scenario tabs (only when there is more than one).
    const tabs = document.createElement('div');
    tabs.className = 'scenarios';
    if (scenarios.length > 1) {
      scenarios.forEach((s, i) => {
        const b = document.createElement('button');
        b.type = 'button';
        b.textContent = s.dataset.label;
        b.addEventListener('click', () => show(i, 0));
        tabs.appendChild(b);
      });
      svg.before(tabs);
    }

    const controls = document.createElement('div');
    controls.className = 'controls';
    controls.innerHTML =
      '<button type="button" class="prev">← Indietro</button><button type="button" class="next">Avanti →</button><div class="dots"></div><span class="count"></span>';
    svg.after(controls);
    const prev = controls.querySelector('.prev');
    const next = controls.querySelector('.next');
    const dots = controls.querySelector('.dots');
    const count = controls.querySelector('.count');

    let sc = 0;
    let idx = 0;
    let run = 0;

    function steps() {
      return Array.from(scenarios[sc].querySelectorAll('.st'));
    }

    function travel(edge, backwards, token) {
      return new Promise((resolve) => {
        let len;
        try {
          len = edge.getTotalLength();
        } catch {
          return resolve();
        }
        if (!len) return resolve();
        edge.classList.add('on');
        if (reduced) {
          const p = edge.getPointAtLength(backwards ? 0 : len);
          packet.setAttribute('cx', p.x);
          packet.setAttribute('cy', p.y);
          packet.style.opacity = 1;
          resolve();
          return;
        }
        const t0 = performance.now();
        const dur = Math.min(900, 350 + len * 2.2);
        function frame(now) {
          if (token !== run) return resolve();
          const t = Math.min(1, (now - t0) / dur);
          const e = t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;
          const p = edge.getPointAtLength((backwards ? 1 - e : e) * len);
          packet.setAttribute('cx', p.x);
          packet.setAttribute('cy', p.y);
          packet.style.opacity = 1;
          if (t < 1) requestAnimationFrame(frame);
          else resolve();
        }
        requestAnimationFrame(frame);
      });
    }

    async function animate(step, token) {
      const list = (step.dataset.edges || '').split(/\s+/).filter(Boolean);
      packet.style.opacity = 0;
      for (const item of list) {
        const [id, dir] = item.split(':');
        const edge = svg.querySelector('#' + id);
        if (!edge) continue;
        await travel(edge, dir === 'r', token);
        if (token !== run) return;
      }
    }

    function show(s, i) {
      sc = s;
      const all = steps();
      idx = Math.max(0, Math.min(i, all.length - 1));
      run += 1;
      root.querySelectorAll('.st.current').forEach((el) => el.classList.remove('current'));
      const step = all[idx];
      step.classList.add('current');

      const words = (attr) => (step.dataset[attr] || '').split(/\s+/).filter(Boolean);
      const shown = words('nodes');
      const lit = step.dataset.new !== undefined ? words('new') : shown;
      const linked = words('links');
      nodes.forEach((n) => {
        n.classList.toggle('shown', shown.includes(n.dataset.node));
        n.classList.toggle('on', lit.includes(n.dataset.node));
        n.classList.remove('bad', 'ok');
      });
      edges.forEach((e) => e.classList.toggle('shown', linked.includes(e.id)));
      if (step.dataset.state && lit.length) {
        svg.querySelector(`[data-node="${lit[lit.length - 1]}"]`)?.classList.add(step.dataset.state);
      }
      edges.forEach((e) => e.classList.remove('on'));
      animate(step, run);

      Array.from(tabs.children).forEach((b, k) => b.setAttribute('aria-pressed', String(k === sc)));
      prev.disabled = idx === 0;
      next.disabled = idx === all.length - 1;
      count.textContent = `passo ${idx + 1} di ${all.length}`;
      dots.innerHTML = '';
      all.forEach((_, k) => {
        const d = document.createElement('button');
        d.type = 'button';
        d.setAttribute('aria-label', `Passo ${k + 1}`);
        if (k === idx) d.className = 'current';
        d.addEventListener('click', () => show(sc, k));
        dots.appendChild(d);
      });
    }

    prev.addEventListener('click', () => show(sc, idx - 1));
    next.addEventListener('click', () => show(sc, idx + 1));
    root.tabIndex = 0;
    root.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowRight') show(sc, idx + 1);
      if (e.key === 'ArrowLeft') show(sc, idx - 1);
    });

    show(0, 0);
    // Replay the current step when its module comes into view.
    document.addEventListener('modulechange', (e) => {
      if (e.detail.module.contains(root)) show(sc, idx);
    });
  });
})();
