/* =========================================================
   Deepavali — main: loader, smooth scroll, scroll choreography
   GSAP + ScrollTrigger + Lenis
   ========================================================= */
(function () {
  'use strict';
  const DW = window.DW, A = DW.art, FX = DW.fx;
  const $ = (s, r) => (r || document).querySelector(s);
  const $$ = (s, r) => Array.from((r || document).querySelectorAll(s));
  const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
  const wait = (ms) => new Promise((r) => setTimeout(r, ms));
  const reduced = FX.reduced;
  const coarse = matchMedia('(pointer:coarse)').matches;
  let lenis = null;

  /* ---------------------------------------------------------
     art injection
     --------------------------------------------------------- */
  const GALLERY = [
    { k: 'g1', t: 'A Home of a Thousand Lamps', s: 'Decorated house', ar: 600 / 800 },
    { k: 'g2', t: 'Rangoli at the Doorstep', s: 'Rangoli', ar: 1 },
    { k: 'g3', t: 'Rama, Sita and Lakshmana Return', s: 'The return to Ayodhya', ar: 800 / 520 },
    { k: 'g4', t: 'The Palace in Light', s: 'Illuminated palace', ar: 600 / 720 },
    { k: 'g5', t: 'Goddess Lakshmi', s: 'Lakshmi illustration', ar: 600 / 800 },
    { k: 'g6', t: 'Fireworks over the City', s: 'Night sky', ar: 800 / 500 },
    { k: 'g7', t: 'The Puja Thali', s: 'Traditional celebration', ar: 600 / 520 },
    { k: 'g8', t: 'Lanterns of the Festival', s: 'Celebration', ar: 600 / 760 },
  ];
  function buildGallery() {
    const m = $('#masonry');
    m.innerHTML = GALLERY.map((g, i) => `<button class="g-item" type="button" data-i="${i}" style="aspect-ratio:${g.ar.toFixed(4)}" aria-label="Open: ${g.t}"><span class="g-art" data-art="${g.k}"></span><span class="g-cap"><small>${g.s}</small>${g.t}</span></button>`).join('');
  }
  function injectArt() {
    $$('[data-art]').forEach((el) => {
      const f = A.make[el.dataset.art];
      if (f) el.innerHTML = f();
    });
    const io = new IntersectionObserver((es) => es.forEach((e) => e.target.classList.toggle('is-live', e.isIntersecting)), { rootMargin: '160px' });
    $$('[data-art]').forEach((el) => io.observe(el));
  }

  /* ---------------------------------------------------------
     text splitting (solid-colour text only)
     --------------------------------------------------------- */
  function splitChars(el) {
    const text = el.textContent.trim();
    if (!el.getAttribute('aria-label') && !el.closest('[aria-label]')) el.setAttribute('aria-label', text);
    el.textContent = '';
    text.split(/(\s+)/).forEach((tok) => {
      if (/^\s+$/.test(tok)) return el.appendChild(document.createTextNode(' '));
      const w = document.createElement('span');
      w.className = 'sp-w';
      w.setAttribute('aria-hidden', 'true');
      for (const ch of tok) { const c = document.createElement('span'); c.className = 'sp-c'; c.textContent = ch; w.appendChild(c); }
      el.appendChild(w);
    });
    return $$('.sp-c', el);
  }
  function splitMasked(el) {
    el.setAttribute('aria-label', el.textContent.replace(/\s+/g, ' ').trim());
    (function walk(node) {
      Array.from(node.childNodes).forEach((n) => {
        if (n.nodeType === 3) {
          const frag = document.createDocumentFragment();
          n.textContent.split(/(\s+)/).forEach((tok) => {
            if (!tok) return;
            if (/^\s+$/.test(tok)) return frag.appendChild(document.createTextNode(' '));
            const m = document.createElement('span'); m.className = 'sp-mask'; m.setAttribute('aria-hidden', 'true');
            const i = document.createElement('span'); i.className = 'sp-in'; i.textContent = tok; m.appendChild(i); frag.appendChild(m);
          });
          node.replaceChild(frag, n);
        } else if (n.nodeType === 1) walk(n);
      });
    })(el);
    return $$('.sp-in', el);
  }

  /* ---------------------------------------------------------
     smooth scroll (Lenis) wired into ScrollTrigger
     --------------------------------------------------------- */
  function initScroll() {
    gsap.registerPlugin(ScrollTrigger);
    ScrollTrigger.config({ ignoreMobileResize: true });
    if (!reduced && window.Lenis) {
      lenis = new Lenis({ lerp: 0.085, wheelMultiplier: 0.95, smoothWheel: true, syncTouch: false });
      lenis.on('scroll', ScrollTrigger.update);
      gsap.ticker.add((t) => lenis.raf(t * 1000));
      gsap.ticker.lagSmoothing(0);
    }
    DW.lenis = lenis;
  }
  function scrollToTarget(target, opts) {
    opts = opts || {};
    const el = typeof target === 'string' ? $(target) : target;
    if (!el && typeof target !== 'number') return;
    if (lenis) lenis.scrollTo(typeof target === 'number' ? target : el, { duration: opts.duration || 1.8, easing: (t) => 1 - Math.pow(1 - t, 4), offset: opts.offset || 0 });
    else if (typeof target === 'number') window.scrollTo(0, target);
    else el.scrollIntoView({ behavior: reduced ? 'auto' : 'smooth', block: 'start' });
  }

  /* ---------------------------------------------------------
     navigation, music, progress, to-top
     --------------------------------------------------------- */
  function initNav() {
    const nav = $('#nav'), burger = $('#burger');
    const setOpen = (o) => {
      nav.classList.toggle('is-open', o);
      burger.setAttribute('aria-expanded', o);
      burger.setAttribute('aria-label', o ? 'Close menu' : 'Open menu');
      if (lenis) o ? lenis.stop() : lenis.start();
      document.body.style.overflow = o ? 'hidden' : '';
    };
    burger.addEventListener('click', () => setOpen(!nav.classList.contains('is-open')));
    addEventListener('keydown', (e) => { if (e.key === 'Escape' && nav.classList.contains('is-open')) setOpen(false); });
    $$('[data-scroll]').forEach((a) => a.addEventListener('click', (e) => {
      e.preventDefault();
      const open = nav.classList.contains('is-open');
      if (open) setOpen(false);
      const t = a.getAttribute('data-scroll');
      // let the menu close (and Lenis restart) before travelling
      setTimeout(() => scrollToTarget(t, { duration: t === '#top' ? 2.2 : 1.9 }), open ? 60 : 0);
      history.replaceState(null, '', t);
    }));
    ScrollTrigger.create({ start: 40, end: 'max', onToggle: (s) => nav.classList.toggle('is-solid', s.isActive || s.progress > 0) });
    const links = $$('.nav-links a');
    ['story', 'days', 'experience', 'gallery', 'finale'].forEach((id) => {
      const sec = document.getElementById(id);
      ScrollTrigger.create({ trigger: sec, start: 'top 55%', end: 'bottom 55%', onToggle: (s) => { if (s.isActive) links.forEach((l) => l.classList.toggle('active', l.getAttribute('href') === '#' + id)); else links.forEach((l) => { if (l.getAttribute('href') === '#' + id && !$$('.nav-links a.active').some((x) => x !== l)) l.classList.remove('active'); }); } });
    });
    ScrollTrigger.create({ trigger: '#top', start: 'top top', end: 'bottom 55%', onToggle: (s) => s.isActive && links.forEach((l) => l.classList.remove('active')) });

    // progress + to-top
    const bar = $('#progressBar'), top = $('#toTop');
    ScrollTrigger.create({ start: 0, end: 'max', onUpdate: (s) => { bar.style.transform = `scaleX(${s.progress.toFixed(4)})`; top.classList.toggle('show', s.scroll() > innerHeight * 0.9); } });
    top.addEventListener('click', () => scrollToTarget(0, { duration: 2.4 }));

    // music
    const mb = $('#musicBtn');
    mb.addEventListener('click', () => {
      const on = DW.audio.toggle();
      mb.setAttribute('aria-pressed', on);
      mb.setAttribute('aria-label', on ? 'Turn music off' : 'Turn music on');
    });
  }

  /* ---------------------------------------------------------
     background colour transitions between sections
     --------------------------------------------------------- */
  function initBgColors() {
    $$('[data-bg]').forEach((sec) => {
      const c = sec.dataset.bg, to = () => gsap.to(document.body, { backgroundColor: c, duration: 1.2, ease: 'power2.out', overwrite: 'auto' });
      ScrollTrigger.create({ trigger: sec, start: 'top 60%', end: 'bottom 60%', onEnter: to, onEnterBack: to });
    });
  }

  /* ---------------------------------------------------------
     generic reveals
     --------------------------------------------------------- */
  function initReveals() {
    if (reduced) { $$('[data-rv]').forEach((e) => (e.style.opacity = 1)); return; }
    $$('[data-split]').forEach((e) => { if (e.closest('#finale')) e.dataset.fin = '1'; });
    ScrollTrigger.batch('.reveal', { start: 'top 90%', once: true, onEnter: (b) => gsap.to(b, { opacity: 1, y: 0, duration: 1, stagger: 0.12, ease: 'power3.out' }) });
    $$('[data-rv]').forEach((el) => {
      if (el.closest('.hero') || el.closest('#finale')) return;
      gsap.from(el, { opacity: 0, y: 46, filter: 'blur(14px)', letterSpacing: '.14em', duration: 1.6, ease: 'power3.out', scrollTrigger: { trigger: el, start: 'top 88%', once: true } });
    });
    $$('.ornament').forEach((o) => { if (o.closest('.hero')) return; gsap.from(o, { opacity: 0, scaleX: 0.2, duration: 1.3, ease: 'power3.out', scrollTrigger: { trigger: o, start: 'top 92%', once: true } }); });
    $$('[data-split]').forEach((el) => {
      if (el.closest('.hero')) return;
      const cs = splitChars(el);
      gsap.from(cs, { opacity: 0, yPercent: 90, stagger: 0.035, duration: 0.9, ease: 'power3.out', scrollTrigger: { trigger: el, start: 'top 88%', once: true } });
    });
    // statement: words light up with scroll
    const st = $('#statement');
    if (st) {
      st.innerHTML = st.textContent.trim().split(/\s+/).map((w) => `<span class="w">${w}</span>`).join(' ');
      gsap.to($$('.w', st), { opacity: 1, stagger: 0.12, ease: 'none', scrollTrigger: { trigger: st, start: 'top 82%', end: 'bottom 48%', scrub: true } });
    }
  }

  /* ---------------------------------------------------------
     HERO
     --------------------------------------------------------- */
  let heroLights = null;
  function initHero() {
    const hero = $('#top');
    FX.global = new FX.Layer($('#fxGlobal'), { cursor: true });
    new FX.Layer($('#fxHero'), { ambient: 64, watch: true });
    heroLights = new FX.LightLayer($('#heroLights'), DW.cityLights.heroNear, { size: 4.6, intensity: reduced ? 1 : 0 });
    if (reduced) return;

    // split solid-colour lines
    $$('[data-split]', hero).forEach((el) => splitChars(el));
    $$('[data-rv]', hero).forEach((el) => (el.style.opacity = 0));

    // pointer parallax
    const layers = $$('.hl[data-depth]', hero);
    if (!coarse) {
      const qs = layers.map((el) => ({ x: gsap.quickTo(el, 'x', { duration: 1.3, ease: 'power3.out' }), y: gsap.quickTo(el, 'y', { duration: 1.3, ease: 'power3.out' }), d: +el.dataset.depth }));
      let live = true;
      ScrollTrigger.create({ trigger: hero, start: 'top bottom', end: 'bottom top', onToggle: (s) => (live = s.isActive) });
      addEventListener('pointermove', (e) => {
        if (!live) return;
        const nx = e.clientX / innerWidth - 0.5, ny = e.clientY / innerHeight - 0.5;
        qs.forEach((q) => { q.x(-nx * q.d); q.y(-ny * q.d * 0.45); });
      }, { passive: true });
    }
    // scroll parallax
    layers.forEach((el) => gsap.to(el, { yPercent: (70 - +el.dataset.depth) * 0.38, ease: 'none', scrollTrigger: { trigger: hero, start: 'top top', end: 'bottom top', scrub: true } }));
    gsap.to('.hl-mandalaback', { rotation: 40, ease: 'none', scrollTrigger: { trigger: hero, start: 'top top', end: 'bottom top', scrub: true } });
    gsap.to('.hero-copy', { yPercent: -16, opacity: 0, ease: 'none', scrollTrigger: { trigger: hero, start: 'top top', end: '70% top', scrub: true } });
    gsap.to('.scroll-cue', { opacity: 0, ease: 'none', scrollTrigger: { trigger: hero, start: 'top top', end: '12% top', scrub: true } });
    gsap.to('.hero-stage', { opacity: 0.25, ease: 'none', scrollTrigger: { trigger: hero, start: '55% top', end: 'bottom top', scrub: true } });
  }
  function playHero() {
    if (reduced) return;
    const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });
    tl.from('.hl-sky', { opacity: 0, duration: 1.8 }, 0)
      .from(['.hl-stars', '.hl-moon', '.hl-mandalaback'], { opacity: 0, duration: 2.2, stagger: 0.25 }, 0.1)
      .from('.hl-far', { opacity: 0, duration: 1.8 }, 0.3)
      .from('.hl-near', { opacity: 0, scale: 1.06, transformOrigin: '50% 100%', duration: 2.2 }, 0.4)
      .from('.hl-floor', { opacity: 0, duration: 2.2 }, 0.6)
      .from('.hl-diyas', { opacity: 0, scale: 1.12, transformOrigin: '50% 100%', duration: 2 }, 0.7)
      .to(heroLights, { intensity: 1, duration: 3.6, ease: 'power1.inOut' }, 0.5)
      .from('.hero-kicker', { opacity: 0, y: 18, letterSpacing: '.9em', duration: 1.6 }, 0.9)
      .from('.ht-small .sp-c', { opacity: 0, yPercent: 90, stagger: 0.05, duration: 1.1 }, 1.1)
      .fromTo('.ht-big', { opacity: 0, y: 36, scale: 0.94, letterSpacing: '.32em', filter: 'blur(24px)' }, { opacity: 1, y: 0, scale: 1, letterSpacing: '.06em', filter: 'blur(0px)', duration: 2, ease: 'power4.out', clearProps: 'filter' }, 1.2)
      .from('.hero .ornament', { opacity: 0, scaleX: 0.1, duration: 1.2 }, 2)
      .from('.hero-sub', { opacity: 0, y: 24, duration: 1.4 }, 2.15)
      .from('#exploreBtn', { opacity: 0, y: 26, scale: 0.9, duration: 1.2 }, 2.5)
      .from('.scroll-cue', { opacity: 0, duration: 1.2 }, 3.1);
  }

  /* ---------------------------------------------------------
     STORY — pinned cinematic film
     --------------------------------------------------------- */
  function initFilm() {
    const film = $('#film');
    if (!film) return;
    const fxFilm = new FX.Layer($('#fxFilm'), { ambient: 46, watch: true, fireflies: true });
    if (reduced || innerHeight < 380) return; // stacked, readable fallback
    film.classList.add('is-pinned');
    const portrait = innerWidth / innerHeight < 0.95;
    if (portrait) {
      film.classList.add('is-portrait');
      matchMedia('(orientation: landscape)').addEventListener('change', () => location.reload());
    }

    const chapters = $$('.chapter', film), N = chapters.length;
    const flare = $('.film-flare', film), numeral = $('#filmNumeral'), rail = $$('#filmRail button'), hint = $('#filmHint');
    const ROM = ['I', 'II', 'III', 'IV', 'V', 'VI'];
    const tl = gsap.timeline({
      defaults: { ease: 'none' },
      scrollTrigger: {
        trigger: film, start: 'top top', end: () => '+=' + Math.round(innerHeight * (innerWidth < 760 ? 5 : 5.6)),
        pin: true, scrub: 0.7, anticipatePin: 1, invalidateOnRefresh: true,
        onUpdate: (self) => {
          const t = self.progress * N, idx = clamp(Math.floor(t + 0.14), 0, N - 1);
          if (idx !== film._idx) {
            film._idx = idx;
            rail.forEach((b, i) => { b.classList.toggle('on', i === idx); if (i === idx) b.setAttribute('aria-current', 'step'); else b.removeAttribute('aria-current'); });
            numeral.textContent = ROM[idx];
            numeral.classList.toggle('left', idx === 1 || idx === 3);
          }
          hint.style.opacity = self.progress > 0.02 ? 0 : 1;
          fxFilm.auto = t > 5.3 && t < 5.999 && !FX.lowPower;
          if (t > 5.35 && !film._fw) { film._fw = true; [0.22, 0.5, 0.78].forEach((x, i) => setTimeout(() => fxFilm.firework(innerWidth * x, innerHeight * 0.9, innerHeight * (0.2 + 0.1 * i)), i * 280)); }
          if (t < 5.1) film._fw = false;
        },
      },
    });
    film._idx = -1;

    chapters.forEach((ch, i) => {
      const scene = $('.scene', ch), lyrs = $$('.lyr', scene);
      const title = $('.chap-title', ch), words = splitMasked(title);
      const panel = $('.chap-text', ch);
      const parts = [$('.chap-eyebrow', ch), ...$$('.chap-p', ch), $('.chap-pull', ch)];
      const start = i === 0 ? 0 : i - 0.14, dur = i === 0 ? 1.03 : 1.17;

      // portrait: pan the camera across the wide scene
      if (portrait) {
        const pan = () => Math.max(0, ($('.scene', ch).offsetWidth - innerWidth) / 2) * 0.85, dir = i % 2 === 0 ? 1 : -1;
        gsap.set(scene, { xPercent: -50 });
        tl.fromTo(scene, { x: () => dir * pan() }, { x: () => -dir * pan(), duration: dur }, start);
      }
      // cinematic push-in / pull-out
      const zoomIn = i % 2 === 0;
      tl.fromTo(scene, { scale: zoomIn ? 1 : 1.13, transformOrigin: '50% 58%' }, { scale: zoomIn ? 1.13 : 1, transformOrigin: '50% 58%', duration: dur }, start);
      // depth parallax
      lyrs.forEach((l) => {
        const d = parseFloat(l.dataset.d) || 0.3;
        tl.fromTo(l, { x: -d * 26, y: d * 9 }, { x: d * 26, y: -d * 9, duration: dur }, start);
      });
      // crossfade in
      if (i > 0) {
        tl.fromTo(scene, { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.16 }, i - 0.14);
        tl.set(chapters[i - 1].querySelector('.scene'), { autoAlpha: 0 }, i + 0.03);
        tl.fromTo(flare, { opacity: 0 }, { opacity: i === 5 ? 0.95 : 0.4, duration: 0.07, yoyo: true, repeat: 1 }, i === 5 ? 5.1 : i - 0.12);
        tl.fromTo(panel, { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.06 }, i + 0.02);
        tl.fromTo(words, { yPercent: 118 }, { yPercent: 0, duration: 0.14, stagger: 0.02, ease: 'power2.out' }, i + 0.03);
        tl.fromTo(parts, { autoAlpha: 0, y: 30 }, { autoAlpha: 1, y: 0, duration: 0.15, stagger: 0.035, ease: 'power2.out' }, i + 0.08);
      }
      if (i < N - 1) {
        tl.to(parts, { autoAlpha: 0, y: -26, duration: 0.1, stagger: 0.012 }, i + 0.78);
        tl.to(words, { yPercent: -118, duration: 0.1, stagger: 0.01 }, i + 0.8);
        tl.to(panel, { autoAlpha: 0, duration: 0.06 }, i + 0.92);
      }
    });

    // Chapter VI: the dark city is lit
    const dim = $('.dim', chapters[5]);
    tl.fromTo(dim, { autoAlpha: 0 }, { autoAlpha: 0.94, duration: 0.16 }, 4.86);
    tl.to(dim, { autoAlpha: 0, duration: 0.7, ease: 'power1.in' }, 5.12);
    tl.to(flare, { opacity: 0, duration: 0.3 }, 5.24);
    tl.set({}, {}, N); // fix timeline length

    // chapter rail
    rail.forEach((b, i) => b.addEventListener('click', () => {
      const st = tl.scrollTrigger;
      scrollToTarget(st.start + ((i + 0.45) / N) * (st.end - st.start), { duration: 2 });
    }));
    // pause heavy fx layer when film isn't on screen: handled by IntersectionObserver in Layer
    DW.filmTL = tl;
  }

  /* ---------------------------------------------------------
     FIVE DAYS — pinned horizontal scroll (vertical stack on small screens)
     --------------------------------------------------------- */
  function initDays() {
    const sec = $('#days'), track = $('#daysTrack'), bar = $('#daysBar');
    if (!sec) return;
    const cards = $$('.day-card', sec);
    // card tilt + moving highlight (mouse only)
    if (!coarse && !reduced) cards.forEach((c) => {
      const rx = gsap.quickTo(c, 'rotationX', { duration: 0.5, ease: 'power3.out' }), ry = gsap.quickTo(c, 'rotationY', { duration: 0.5, ease: 'power3.out' });
      gsap.set(c, { transformPerspective: 900 });
      c.addEventListener('pointermove', (e) => {
        const r = c.getBoundingClientRect(), x = (e.clientX - r.left) / r.width, y = (e.clientY - r.top) / r.height;
        c.style.setProperty('--mx', x * 100 + '%'); c.style.setProperty('--my', y * 100 + '%');
        ry((x - 0.5) * 10); rx(-(y - 0.5) * 8);
      });
      c.addEventListener('pointerleave', () => { rx(0); ry(0); });
    });
    if (reduced) return;
    const mm = gsap.matchMedia();
    mm.add('(min-width: 900px) and (min-height: 560px)', () => {
      sec.classList.add('is-h');
      const dist = () => Math.max(0, track.scrollWidth - innerWidth);
      const tween = gsap.to(track, {
        x: () => -dist(), ease: 'none',
        scrollTrigger: { trigger: $('.days-pin', sec), start: 'top top', end: () => '+=' + Math.round(dist() * 1.05), pin: true, scrub: 0.6, anticipatePin: 1, invalidateOnRefresh: true, onUpdate: (s) => (bar.style.transform = `scaleX(${s.progress.toFixed(4)})`) },
      });
      cards.forEach((c) => gsap.from(c, { opacity: 0, y: 70, scale: 0.9, duration: 1, ease: 'none', scrollTrigger: { trigger: c, containerAnimation: tween, start: 'left 96%', end: 'left 62%', scrub: true } }));
      gsap.from('.days-intro > *', { opacity: 0, y: 30, stagger: 0.12, duration: 1, ease: 'power3.out', scrollTrigger: { trigger: sec, start: 'top 70%', once: true } });
      return () => { sec.classList.remove('is-h'); gsap.set(track, { clearProps: 'all' }); };
    });
    mm.add('(max-width: 899px), (max-height: 559px)', () => {
      gsap.from('.days-intro > *', { opacity: 0, y: 30, stagger: 0.12, duration: 1, ease: 'power3.out', scrollTrigger: { trigger: '.days-intro', start: 'top 85%', once: true } });
      cards.forEach((c) => gsap.from(c, { opacity: 0, y: 60, duration: 1, ease: 'power3.out', scrollTrigger: { trigger: c, start: 'top 88%', once: true } }));
    });
  }

  /* ---------------------------------------------------------
     GALLERY + lightbox
     --------------------------------------------------------- */
  function initGallery() {
    const items = $$('.g-item');
    if (!reduced) items.forEach((it) => {
      gsap.set(it, { clipPath: 'inset(100% 0% 0% 0%)' });
      gsap.set($('svg', it), { scale: 1.35, transformOrigin: '50% 50%' });
      ScrollTrigger.create({ trigger: it, start: 'top 92%', once: true, onEnter: () => {
        gsap.to(it, { clipPath: 'inset(0% 0% 0% 0%)', duration: 1.3, ease: 'power4.out', clearProps: 'clipPath' });
        gsap.to($('svg', it), { scale: 1, duration: 1.9, ease: 'power3.out' });
      } });
    });
    const lb = $('#lightbox'), art = $('#lbArt'), cap = $('#lbCap');
    lb.hidden = false;
    let cur = 0, opener = null;
    function show(i, dir) {
      cur = (i + GALLERY.length) % GALLERY.length;
      const g = GALLERY[cur];
      art.innerHTML = A.make[g.k]();
      lb.style.setProperty('--ar', g.ar.toFixed(4));
      cap.textContent = g.t + ' · ' + g.s;
      if (!reduced) gsap.fromTo(art, { opacity: 0, x: (dir || 0) * 50, scale: 0.96 }, { opacity: 1, x: 0, scale: 1, duration: 0.6, ease: 'power3.out' });
    }
    function open(i, el) {
      opener = el;
      show(i, 0);
      lb.classList.add('open');
      if (lenis) lenis.stop(); else document.body.style.overflow = 'hidden';
      $('#lbClose').focus({ preventScroll: true });
    }
    function close() {
      lb.classList.remove('open');
      if (lenis) lenis.start(); else document.body.style.overflow = '';
      if (opener) opener.focus({ preventScroll: true });
    }
    items.forEach((it) => it.addEventListener('click', () => open(+it.dataset.i, it)));
    $('#lbClose').addEventListener('click', close);
    $('#lbPrev').addEventListener('click', () => show(cur - 1, -1));
    $('#lbNext').addEventListener('click', () => show(cur + 1, 1));
    lb.addEventListener('click', (e) => { if (e.target === lb) close(); });
    addEventListener('keydown', (e) => {
      if (!lb.classList.contains('open')) return;
      if (e.key === 'Escape') close();
      else if (e.key === 'ArrowLeft') show(cur - 1, -1);
      else if (e.key === 'ArrowRight') show(cur + 1, 1);
      else if (e.key === 'Tab') { // simple focus trap
        const f = $$('button', lb), first = f[0], last = f[f.length - 1];
        if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
        else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
      }
    });
    let sx = null;
    lb.addEventListener('pointerdown', (e) => (sx = e.clientX));
    lb.addEventListener('pointerup', (e) => { if (sx == null) return; const dx = e.clientX - sx; sx = null; if (Math.abs(dx) > 60) show(cur + (dx < 0 ? 1 : -1), dx < 0 ? 1 : -1); });
  }

  /* ---------------------------------------------------------
     FINALE
     --------------------------------------------------------- */
  function initFinale() {
    const sec = $('#finale');
    const fw = new FX.Layer($('#fxFinale'), { trails: true, watch: true });
    fw.auto = !reduced;
    const lights = new FX.LightLayer($('#finLights'), DW.cityLights.finale, { size: 4, intensity: reduced ? 1 : 0, fps: 30 });
    const glow = $('#finGlow');
    if (!reduced) {
      gsap.to(lights, { intensity: 1, ease: 'none', scrollTrigger: { trigger: sec, start: 'top 75%', end: 'top 15%', scrub: 0.6 } });
      gsap.to(glow, { opacity: 0.6, ease: 'none', scrollTrigger: { trigger: sec, start: 'top 75%', end: 'top 10%', scrub: 0.6 } });
      $$('[data-rv]', sec).forEach((el, i) => gsap.from(el, { opacity: 0, y: 50, filter: 'blur(16px)', letterSpacing: '.16em', duration: 1.8, delay: i * 0.18, ease: 'power3.out', scrollTrigger: { trigger: sec, start: 'top 35%', once: true } }));
      gsap.from('#finale .fin-msg, #finale .eyebrow', { opacity: 0, y: 30, duration: 1.4, stagger: 0.15, ease: 'power3.out', scrollTrigger: { trigger: sec, start: 'top 35%', once: true } });
      const hs = splitChars($('.fh-text'));
      gsap.from(hs, { opacity: 0, yPercent: 80, stagger: 0.06, duration: 1.1, ease: 'power3.out', scrollTrigger: { trigger: '.fin-happy', start: 'top 92%', once: true } });
      gsap.from('.fh-diya', { opacity: 0, scale: 0.4, duration: 1.4, ease: 'back.out(2)', scrollTrigger: { trigger: '.fin-happy', start: 'top 92%', once: true } });
      gsap.from('#celebrateBtn', { opacity: 0, y: 30, scale: 0.9, duration: 1.2, ease: 'power3.out', scrollTrigger: { trigger: '#celebrateBtn', start: 'top 95%', once: true } });
    }
    const wishes = ['May every shadow in your life find its light.', 'May your home glow with joy and your heart with peace.', 'May this year open doors you have not yet imagined.', 'Shubh Deepavali. Light one more lamp for someone you love.'];
    let w = 0, busy = false;
    $('#celebrateBtn').addEventListener('click', () => {
      sec.classList.add('celebrating');
      const wish = $('#finWish');
      wish.textContent = wishes[w++ % wishes.length];
      if (!reduced) gsap.fromTo(wish, { opacity: 0, y: 14 }, { opacity: 1, y: 0, duration: 1 });
      if (!reduced) {
        fw.autoGap = [0.12, 0.35];
        for (let i = 0; i < 9; i++) setTimeout(() => fw.firework(innerWidth * (0.08 + i * 0.105), fw.h, fw.h * (0.12 + Math.random() * 0.35)), i * 170);
        const r = $('#celebrateBtn').getBoundingClientRect();
        FX.global.burst(r.left + r.width / 2, r.top + r.height / 2, { n: 70, speed: 300, grav: 160, life: 1.6, size: 7, col: '255,214,110' });
        clearTimeout(busy);
        busy = setTimeout(() => { fw.autoGap = [0.5, 1.3]; sec.classList.remove('celebrating'); }, 9000);
        if (lights.intensity < 1) lights.intensity = 1;
      }
      DW.audio.bell();
      DW.audio.boom();
    });
  }

  /* ---------------------------------------------------------
     boot
     --------------------------------------------------------- */
  async function boot() {
    const bar = $('#ldBar'), set = (p) => (bar.style.transform = `scaleX(${p})`);
    set(0.15);
    buildGallery();
    injectArt();
    set(0.5);
    await Promise.race([document.fonts && document.fonts.ready, wait(2500)]);
    set(0.8);

    initScroll();
    initHero();
    initNav();
    initBgColors();
    initReveals();
    initFilm();
    initDays();
    DW.interactive.init();
    initGallery();
    initFinale();
    ScrollTrigger.sort();
    FX.start();

    await wait(reduced ? 100 : 700);
    set(1);
    await wait(250);
    $('#loader').classList.add('done');
    document.body.classList.remove('is-loading');
    ScrollTrigger.refresh();
    playHero();
    // layout can shift while fonts/svg settle
    addEventListener('load', () => ScrollTrigger.refresh());
    setTimeout(() => ScrollTrigger.refresh(), 1200);
    if (location.hash && $(location.hash)) setTimeout(() => scrollToTarget(location.hash, { duration: 0.1 }), 300);
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot); else boot();
  window.addEventListener('error', () => { const l = $('#loader'); if (l) l.classList.add('done'); document.body.classList.remove('is-loading'); });
})();
