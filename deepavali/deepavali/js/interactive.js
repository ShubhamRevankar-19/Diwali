/* =========================================================
   Deepavali — interactive experience
   1) light the diyas   2) draw a rangoli   3) festival decor
   ========================================================= */
(function () {
  'use strict';
  const DW = (window.DW = window.DW || {});
  const $ = (s, r) => (r || document).querySelector(s);
  const $$ = (s, r) => Array.from((r || document).querySelectorAll(s));
  const fx = () => DW.fx && DW.fx.global;
  const snd = (name, a) => DW.audio && DW.audio[name] && DW.audio[name](a);
  const rm = () => DW.fx && DW.fx.reduced;

  /* ---------------------------------------------------------
     1. DIYAS
     --------------------------------------------------------- */
  function initDiyas() {
    const stage = $('#diyaStage'), grid = $('#diyaGrid');
    if (!stage || !grid) return;
    const A = DW.art, TOTAL = 9;
    let lit = 0, last = null;
    const status = $('#litCount'), msg = $('#lightMsg');
    for (let i = 0; i < TOTAL; i++) {
      const b = document.createElement('button');
      b.className = 'dy';
      b.type = 'button';
      b.setAttribute('aria-pressed', 'false');
      b.setAttribute('aria-label', `Light diya ${i + 1} of ${TOTAL}`);
      b.style.setProperty('--i', i);
      b.innerHTML = `<svg viewBox="-62 -66 124 100" aria-hidden="true"><defs>${A.defs('dy' + i)}</defs>${A.diya(0, 0, 1, 'dy' + i, { glow: 86, d: (i % 5) * 0.4 })}</svg><span class="dy-hint">tap to light</span>`;
      grid.appendChild(b);
    }
    const btns = $$('.dy', grid);

    function update() {
      stage.style.setProperty('--lit', (lit / TOTAL).toFixed(3));
      status.textContent = `${lit} of ${TOTAL} diyas lit`;
      stage.classList.toggle('some-lit', lit > 0);
      const all = lit === TOTAL;
      if (all && !stage.classList.contains('all-lit')) celebrate();
      stage.classList.toggle('all-lit', all);
    }
    function celebrate() {
      const f = fx();
      if (!f || rm()) return;
      const r = stage.getBoundingClientRect();
      for (let i = 0; i < 4; i++)
        setTimeout(() => f.firework(Math.max(60, Math.min(innerWidth - 60, r.left + r.width * (0.2 + i * 0.2))), Math.min(innerHeight, r.bottom), Math.max(80, r.top + 40 + (i % 2) * 70)), i * 260);
    }
    function ignite(b, idx) {
      if (b.classList.contains('lit')) return;
      b.classList.add('lit');
      b.setAttribute('aria-pressed', 'true');
      b.querySelector('.dy-hint').textContent = 'lit';
      lit++;
      last = b;
      update();
      const r = b.getBoundingClientRect(), f = fx();
      if (f && !rm()) {
        f.burst(r.left + r.width / 2, r.top + r.height * 0.28, { n: 30, speed: 170, grav: 80, life: 1.2, size: 6 });
        f.burst(r.left + r.width / 2, r.top + r.height * 0.28, { n: 10, speed: 60, grav: -30, life: 1.8, size: 4.5, col: '255,230,160' });
      }
      snd('light', idx);
    }
    function lightFrom(b, idx) {
      if (b.classList.contains('lit') || b.dataset.busy) return;
      if (last && !rm() && window.gsap) {
        // one flame lights the next — a tiny spark travels across
        b.dataset.busy = 1;
        const a = last.getBoundingClientRect(), c = b.getBoundingClientRect();
        const sp = document.createElement('i');
        sp.className = 'spark-travel';
        document.body.appendChild(sp);
        gsap.fromTo(sp, { x: a.left + a.width / 2, y: a.top + a.height * 0.3, scale: 1, opacity: 1 }, {
          x: c.left + c.width / 2, y: c.top + c.height * 0.3, duration: 0.38, ease: 'power2.in',
          onComplete() { sp.remove(); delete b.dataset.busy; ignite(b, idx); },
        });
      } else ignite(b, idx);
    }
    btns.forEach((b, i) => b.addEventListener('click', () => lightFrom(b, i)));
    $('#lightAll').addEventListener('click', () => btns.forEach((b, i) => setTimeout(() => ignite(b, i), i * 130)));
    $('#blowOut').addEventListener('click', () => {
      btns.forEach((b) => { b.classList.remove('lit'); b.setAttribute('aria-pressed', 'false'); b.querySelector('.dy-hint').textContent = 'tap to light'; delete b.dataset.busy; });
      lit = 0; last = null; update();
    });
    update();
  }

  /* ---------------------------------------------------------
     2. RANGOLI STUDIO
     --------------------------------------------------------- */
  function initRangoli() {
    const cv = $('#rangoliCanvas');
    if (!cv) return;
    const ctx = cv.getContext('2d');
    const COLORS = ['#ffd36b', '#ff8a2a', '#e0457b', '#8a4fe0', '#2fc2b0', '#fff4e0', '#7ad0ff'];
    const S = { sym: 8, motif: 'petal', color: 0, size: 1 };
    let strokes = [], cur = null, down = false, last = null, size = 600, dpr = 1, raf = 0, hint = $('#rangoliHint');

    function resize() {
      const w = cv.clientWidth;
      if (!w) return;
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      size = w;
      cv.width = cv.height = Math.round(w * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      render();
    }
    const ease = (t) => { const c1 = 1.9, c3 = c1 + 1; return 1 + c3 * Math.pow(t - 1, 3) + c1 * Math.pow(t - 1, 2); };

    function motifPath(type, u) {
      const p = new Path2D();
      if (type === 'petal') { p.moveTo(0, 0); p.bezierCurveTo(u * 0.9, -u * 0.5, u * 0.9, -u * 1.5, 0, -u * 2.1); p.bezierCurveTo(-u * 0.9, -u * 1.5, -u * 0.9, -u * 0.5, 0, 0); }
      else if (type === 'dot') p.arc(0, -u * 0.5, u * 0.5, 0, 6.283);
      else if (type === 'leaf') { p.moveTo(0, 0); p.quadraticCurveTo(u * 1.1, -u * 0.9, 0, -u * 2.4); p.quadraticCurveTo(-u * 1.1, -u * 0.9, 0, 0); }
      else if (type === 'diamond') { p.moveTo(0, 0); p.lineTo(u * 0.75, -u * 0.9); p.lineTo(0, -u * 1.8); p.lineTo(-u * 0.75, -u * 0.9); p.closePath(); }
      return p;
    }
    function drawMotif(type, u, col, k, mirror) {
      ctx.save();
      if (mirror) ctx.scale(-1, 1);
      ctx.scale(k, k);
      ctx.fillStyle = col;
      ctx.strokeStyle = 'rgba(255,255,255,.55)';
      ctx.lineWidth = Math.max(0.8, u * 0.07);
      if (type === 'lotus') {
        [[0, 1], [-0.55, 0.8], [0.55, 0.8]].forEach(([a, s]) => {
          ctx.save(); ctx.rotate(a); ctx.scale(s, s);
          const p = motifPath('petal', u); ctx.fill(p); ctx.stroke(p); ctx.restore();
        });
      } else {
        const p = motifPath(type, u);
        ctx.fill(p); ctx.stroke(p);
        if (type !== 'dot') {
          ctx.fillStyle = 'rgba(255,255,255,.4)';
          ctx.save(); ctx.scale(0.42, 0.5); ctx.translate(0, -u * 0.25); ctx.fill(motifPath(type, u)); ctx.restore();
        } else { ctx.fillStyle = 'rgba(255,255,255,.6)'; ctx.beginPath(); ctx.arc(-u * 0.14, -u * 0.64, u * 0.14, 0, 6.283); ctx.fill(); }
      }
      ctx.restore();
    }
    function render() {
      const c = size / 2, R = c - 6, now = performance.now();
      ctx.clearRect(0, 0, size, size);
      const bg = ctx.createRadialGradient(c, c, 0, c, c, R);
      bg.addColorStop(0, '#2a1840'); bg.addColorStop(1, '#120a22');
      ctx.fillStyle = bg; ctx.beginPath(); ctx.arc(c, c, R, 0, 6.283); ctx.fill();
      ctx.strokeStyle = 'rgba(245,192,74,.55)'; ctx.lineWidth = 2; ctx.beginPath(); ctx.arc(c, c, R - 1, 0, 6.283); ctx.stroke();
      ctx.setLineDash([2, 7]); ctx.strokeStyle = 'rgba(245,192,74,.3)'; ctx.beginPath(); ctx.arc(c, c, R - 10, 0, 6.283); ctx.stroke(); ctx.setLineDash([]);
      // kolam guide dots
      ctx.fillStyle = 'rgba(255,230,180,.16)';
      for (let ring = 1; ring <= 7; ring++) {
        const r = (R / 7.6) * ring, n = Math.max(6, Math.round(ring * 6));
        for (let i = 0; i < n; i++) { const a = (i / n) * 6.283; ctx.beginPath(); ctx.arc(c + Math.cos(a) * r, c + Math.sin(a) * r, 1.6, 0, 6.283); ctx.fill(); }
      }
      let animating = false;
      for (const st of strokes) for (const pt of st) {
        const t = Math.min(1, (now - pt.born) / 480);
        if (t < 1) animating = true;
        const k = Math.max(0.001, ease(Math.max(0, t))), u = size * 0.04 * pt.sz;
        for (let m = 0; m < pt.sym; m++) {
          for (let mir = 0; mir < 2; mir++) {
            const ang = (mir ? -pt.th : pt.th) + (m * 6.283) / pt.sym;
            ctx.save();
            ctx.translate(c + Math.cos(ang) * pt.r, c + Math.sin(ang) * pt.r);
            ctx.rotate(ang + Math.PI / 2);
            drawMotif(pt.type, u, pt.col, k, mir);
            ctx.restore();
          }
        }
      }
      // glowing centre
      const g = ctx.createRadialGradient(c, c, 0, c, c, size * 0.05);
      g.addColorStop(0, 'rgba(255,240,190,.9)'); g.addColorStop(1, 'rgba(255,200,100,0)');
      ctx.fillStyle = g; ctx.beginPath(); ctx.arc(c, c, size * 0.05, 0, 6.283); ctx.fill();
      raf = 0;
      if (animating) raf = requestAnimationFrame(render);
    }
    const kick = () => { if (!raf) raf = requestAnimationFrame(render); };

    function place(x, y) {
      const c = size / 2, dx = x - c, dy = y - c, r = Math.hypot(dx, dy);
      if (r > c - 14) return;
      if (last && Math.hypot(x - last.x, y - last.y) < size * 0.04 * S.size * 1.1) return;
      last = { x, y };
      cur.push({ r, th: Math.atan2(dy, dx), type: S.motif, col: COLORS[S.color], sz: S.size, sym: S.sym, born: performance.now() });
      if (hint) hint.classList.add('gone');
      snd('sparkle');
      kick();
    }
    const pos = (e) => { const b = cv.getBoundingClientRect(); return [((e.clientX - b.left) * size) / b.width, ((e.clientY - b.top) * size) / b.height]; };
    cv.addEventListener('pointerdown', (e) => {
      down = true; cur = []; strokes.push(cur); last = null;
      cv.setPointerCapture(e.pointerId);
      place(...pos(e));
    });
    cv.addEventListener('pointermove', (e) => { if (down) place(...pos(e)); });
    const up = () => { down = false; if (cur && !cur.length) strokes.pop(); cur = null; };
    cv.addEventListener('pointerup', up); cv.addEventListener('pointercancel', up);

    /* controls */
    function group(sel, attr, fn) {
      const els = $$(sel);
      els.forEach((b) => b.addEventListener('click', () => {
        els.forEach((x) => { x.classList.remove('on'); x.setAttribute('aria-pressed', 'false'); });
        b.classList.add('on'); b.setAttribute('aria-pressed', 'true'); fn(b.dataset[attr]);
      }));
    }
    group('[data-sym]', 'sym', (v) => (S.sym = +v));
    group('[data-motif]', 'motif', (v) => (S.motif = v));
    group('[data-swatch]', 'swatch', (v) => (S.color = +v));
    $('#rgSize').addEventListener('input', (e) => (S.size = +e.target.value));
    $('#rgUndo').addEventListener('click', () => { strokes.pop(); render(); });
    $('#rgClear').addEventListener('click', () => { strokes = []; if (hint) hint.classList.remove('gone'); render(); });
    $('#rgSave').addEventListener('click', () => {
      const a = document.createElement('a');
      a.download = 'my-diwali-rangoli.png';
      a.href = cv.toDataURL('image/png');
      a.click();
    });
    $('#rgBloom').addEventListener('click', () => {
      const types = ['dot', 'petal', 'leaf', 'diamond', 'lotus', 'petal', 'dot', 'leaf'];
      const radii = [0.1, 0.2, 0.31, 0.43, 0.55, 0.67, 0.79, 0.9];
      const savedSym = S.sym;
      S.sym = [8, 12, 6, 16][(Math.random() * 4) | 0];
      const c = size / 2, R = c - 14, pal = (Math.random() * 7) | 0;
      radii.forEach((rr, i) => setTimeout(() => {
        const st = [];
        strokes.push(st);
        const n = i % 2 ? 2 : 1;
        for (let k = 0; k < n; k++) st.push({ r: R * rr, th: (k * Math.PI) / S.sym + (i % 2 ? 0.0 : 0.12), type: types[i], col: COLORS[(pal + i) % 7], sz: Math.max(0.8, 1.7 - i * 0.12), sym: S.sym, born: performance.now() });
        if (hint) hint.classList.add('gone');
        snd('sparkle');
        kick();
        if (i === radii.length - 1) S.sym = savedSym;
      }, i * 190));
    });
    if ('ResizeObserver' in window) new ResizeObserver(resize).observe(cv);
    resize();
  }

  /* ---------------------------------------------------------
     3. DECOR
     --------------------------------------------------------- */
  function initDecor() {
    const wrap = $('#decorGrid');
    if (!wrap || !window.gsap) return;
    const A = DW.art;
    const items = [
      ['lantern', 'Akash Kandil', 'A sky lantern hung outside the home to guide Lakshmi in.', A.make.decorLantern()],
      ['bell', 'Temple Bell', 'Its sound is said to clear the air and open the heart.', A.make.decorBell()],
      ['marigold', 'Genda Garland', 'Marigold torans over the doorway welcome every guest.', A.make.decorMarigold()],
      ['sparkler', 'Phuljhadi', 'The sparkler: small, bright and loved by every child.', A.make.decorSparkler()],
      ['anar', 'Anar', 'A fountain of golden fire rising into the night.', A.make.decorAnar()],
    ];
    wrap.innerHTML = items.map((it) => `<button class="decor" type="button" data-dec="${it[0]}" aria-label="${it[1]} — tap to play"><span class="decor-art">${it[3]}</span><span class="decor-name">${it[1]}</span><span class="decor-desc">${it[2]}</span></button>`).join('');

    const act = {
      lantern(el) {
        const sw = $('.swing', el), gl = $('.dec-glow', el);
        gsap.fromTo(sw, { svgOrigin: '80 6', rotation: -18 }, { svgOrigin: '80 6', rotation: 0, duration: 3, ease: 'elastic.out(1,.2)' });
        gsap.fromTo(gl, { opacity: 0.35, scale: 1, svgOrigin: '0 0' }, { opacity: 1, scale: 1.25, duration: 0.45, yoyo: true, repeat: 1, ease: 'sine.inOut', svgOrigin: '0 0' });
        spark(el, { n: 22, col: '255,200,100' }); snd('chime', 2);
      },
      bell(el) {
        const sw = $('.swing', el);
        gsap.fromTo(sw, { svgOrigin: '80 6', rotation: 16 }, { svgOrigin: '80 6', rotation: 0, duration: 2.6, ease: 'elastic.out(1,.18)' });
        $$('.ring', el).forEach((r, i) => gsap.fromTo(r, { opacity: 0.8, scale: 0.6, svgOrigin: '80 130' }, { opacity: 0, scale: 2.6 + i, svgOrigin: '80 130', duration: 1.4, delay: i * 0.22, ease: 'power2.out' }));
        snd('bell');
      },
      marigold(el) {
        const g = $('.garland', el);
        gsap.fromTo(g, { svgOrigin: '80 50', rotation: 5 }, { svgOrigin: '80 50', rotation: 0, duration: 2.2, ease: 'elastic.out(1,.25)' });
        if (rm()) return;
        const box = el.querySelector('.decor-art');
        for (let i = 0; i < 16; i++) {
          const p = document.createElement('i');
          p.className = 'petal';
          p.style.background = ['#ffb02e', '#ff8a1a', '#ffd36b', '#ff6a00'][i % 4];
          p.style.left = 20 + Math.random() * 60 + '%'; p.style.top = '35%';
          box.appendChild(p);
          gsap.to(p, { x: (Math.random() - 0.5) * 140, y: 90 + Math.random() * 90, rotation: Math.random() * 420 - 210, opacity: 0, duration: 1.6 + Math.random() * 1.2, ease: 'power1.out', onComplete: () => p.remove() });
        }
        snd('chime', 0);
      },
      sparkler(el) {
        const gl = $('.dec-glow', el), tip = $('.tip', el);
        gsap.killTweensOf([gl, tip]);
        gsap.set([gl, tip], { opacity: 1 });
        gsap.to(gl, { opacity: 0.4, duration: 0.09, yoyo: true, repeat: 30, ease: 'none' });
        gsap.to([gl, tip], { opacity: 0, duration: 0.5, delay: 2.9 });
        const f = fx();
        if (f && !rm()) f.emit({ at: () => { const r = tip.getBoundingClientRect(); return { x: r.left + r.width / 2, y: r.top + r.height / 2 }; }, dur: 3, rate: 120, col: '255,236,170', speed: 150, grav: 240, spread: 3.14, size: 3.2, life: 0.7, angle: -1.57 });
        snd('pop');
      },
      anar(el) {
        const gl = $('.dec-glow', el);
        gsap.fromTo(gl, { opacity: 0 }, { opacity: 1, duration: 0.2, yoyo: true, repeat: 13, ease: 'none' });
        gsap.to(gl, { opacity: 0, duration: 0.4, delay: 2.9 });
        const f = fx();
        if (f && !rm()) {
          const cols = ['255,220,120', '255,150,80', '255,120,170', '140,210,255'];
          let n = 0;
          f.emit({ at: () => { const r = gl.getBoundingClientRect(); return { x: r.left + r.width / 2, y: r.top + r.height * 0.5 }; }, dur: 2.8, rate: 150, col: cols[0], speed: 520, grav: 520, spread: 0.32, size: 4, life: 1.5, angle: -1.5708 });
          f.emit({ at: () => { const r = gl.getBoundingClientRect(); return { x: r.left + r.width / 2, y: r.top + r.height * 0.5 }; }, dur: 2.8, rate: 70, col: cols[1 + (n++ % 3)], speed: 420, grav: 480, spread: 0.5, size: 3.4, life: 1.3, angle: -1.5708 });
        }
        snd('boom');
      },
    };
    function spark(el, o) {
      const f = fx(); if (!f || rm()) return;
      const r = $('.decor-art', el).getBoundingClientRect();
      f.burst(r.left + r.width / 2, r.top + r.height * 0.5, Object.assign({ n: 24, speed: 170, grav: 80, life: 1.1, size: 5.5 }, o));
    }
    $$('.decor', wrap).forEach((b) => b.addEventListener('click', () => { act[b.dataset.dec](b); b.classList.add('played'); }));
  }

  DW.interactive = { init() { initDiyas(); initRangoli(); initDecor(); } };
})();
