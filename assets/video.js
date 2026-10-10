// Embedded YouTube videos that load only on click (a thumbnail until then),
// so the reader never leaves the page and the page stays light. Markup:
//   <div class="yt" data-id="1RIA9U5oXro" data-start="39"
//        data-title="How Digital Audio Works" data-meta="Computerphile · 12 min">
//     <p>Why it is worth watching.</p>
//   </div>
(function () {
  document.querySelectorAll('.yt[data-id]').forEach((box) => {
    const { id, start, title, meta } = box.dataset;
    const why = box.innerHTML;
    box.innerHTML = '';

    const frame = document.createElement('button');
    frame.type = 'button';
    frame.className = 'yt-frame';
    frame.setAttribute('aria-label', `Guarda: ${title}`);
    frame.innerHTML = `<img src="https://i.ytimg.com/vi/${id}/hqdefault.jpg" alt="" loading="lazy"><span class="play">▶</span>${
      start ? `<span class="from">dal minuto ${Math.floor(start / 60)}:${String(start % 60).padStart(2, '0')}</span>` : ''
    }`;
    frame.addEventListener('click', () => {
      const iframe = document.createElement('iframe');
      const params = new URLSearchParams({ autoplay: '1', rel: '0' });
      if (start) params.set('start', start);
      iframe.src = `https://www.youtube-nocookie.com/embed/${id}?${params}`;
      iframe.title = title;
      iframe.allow = 'autoplay; encrypted-media; picture-in-picture; fullscreen';
      iframe.referrerPolicy = 'strict-origin-when-cross-origin';
      iframe.allowFullscreen = true;
      const holder = document.createElement('div');
      holder.className = 'yt-frame';
      holder.appendChild(iframe);
      frame.replaceWith(holder);
    });

    const caption = document.createElement('div');
    caption.className = 'yt-caption';
    caption.innerHTML = `<strong>${title}</strong><span class="duration">${meta || ''}</span>${why}`;
    box.append(frame, caption);
  });
})();
