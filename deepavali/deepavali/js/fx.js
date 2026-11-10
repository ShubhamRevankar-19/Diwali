/* =========================================================
   Deepavali — canvas effects: embers, sparks, fireworks, lights
   Sprites + additive blending keep thousands of lights cheap.
   ========================================================= */
(function () {
  'use strict';
  const DW = (window.DW = window.DW || {});
  const FX = (DW.fx = {});
  const isCoarse = matchMedia('(pointer:coarse)').matches || innerWidth < 760;
  FX.lowPower = isCoarse;
  FX.reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---- cached glow sprites ---- */
  const sprites = {};
  function sprite(col) {
    col = col || '255,196,90';
    if (sprites[col]) return sprites[col];
    const c = document.createElement('canvas');
    c.width = c.height = 64;
    const g = c.getContext('2d');
    const gr = g.createRadialGradient(32, 32, 0, 32, 32, 32);
    gr.addColorStop(0, 'rgba(255,246,214,1)');
    gr.addColorStop(0.12, `rgba(${col},0.95)`);
    gr.addColorStop(0.45, `rgba(${col},0.32)`);
    gr.addColorStop(1, `rgba(${col},0)`);
    g.fillStyle = gr;
    g.fillRect(0, 0, 64, 64);
    return (sprites[col] = c);
  }
  FX.sprite = sprite;
  const hex2rgb = (h) => {
    h = h.replace('#', '');
    if (h.length === 3) h = h.replace(/./g, '$&$&');
    return `${parseInt(h.slice(0, 2), 16)},${parseInt(h.slice(2, 4), 16)},${parseInt(h.slice(4, 6), 16)}`;
  };
  const rnd = (a, b) => a + Math.random() * (b - a);
  const PALETTES = [['#ffd36b', '#ffb347', '#fff1b8'], ['#ff7aa8', '#ffb3c8', '#ffe1ea'], ['#7ad0ff', '#b8e6ff', '#e9f7ff'], ['#ff9a4a', '#ffc58a', '#fff0d9'], ['#b08aff', '#d6c2ff', '#f1eaff'], ['#7affc0', '#b9ffe0', '#eafff5']];

  /* =========================================================
     Layer — a particle canvas (ambient embers + bursts + fireworks)
     ========================================================= */
  class Layer {
    constructor(canvas, o) {
      this.c = canvas;
      this.ctx = canvas.getContext('2d');
      this.o = Object.assign({ ambient: 0, trails: false, cursor: false, tint: '255,196,90', rise: true }, o || {});
      this.dpr = Math.min(window.devicePixelRatio || 1, 2);
      this.amb = [];
      this.sparks = [];
      this.rockets = [];
      this.emitters = [];
      this.t = 0;
      this.visible = true;
      this.auto = false;
      this.autoGap = [0.5, 1.3];
      this.autoT = 0;
      this.resize();
      if (this.o.watch) {
        new IntersectionObserver((e) => (this.visible = e[0].isIntersecting), { rootMargin: '100px' }).observe(canvas);
      }
      if ('ResizeObserver' in window) new ResizeObserver(() => this.resize()).observe(canvas);
      else addEventListener('resize', () => this.resize());
      if (this.o.cursor && !isCoarse && !FX.reduced) this.bindCursor();
      Layer.all.push(this);
    }
    resize() {
      const w = this.c.clientWidth, h = this.c.clientHeight;
      if (!w || !h) return;
      this.w = w; this.h = h;
      this.c.width = Math.round(w * this.dpr);
      this.c.height = Math.round(h * this.dpr);
      this.ctx.setTransform(this.dpr, 0, 0, this.dpr, 0, 0);
      const want = this.o.ambient ? Math.round(this.o.ambient * Math.min(1, (w * h) / (1280 * 720))) : 0;
      while (this.amb.length < want) this.amb.push(this.mkAmb(true));
      this.amb.length = Math.min(this.amb.length, Math.max(want, 0));
    }
    mkAmb(init) {
      const firefly = this.o.fireflies && Math.random() < 0.3;
      return {
        x: rnd(0, this.w || 800), y: init ? rnd(0, this.h || 600) : (this.h || 600) + 10,
        vx: rnd(-6, 6), vy: this.o.rise ? -rnd(6, 26) : rnd(-6, 6),
        r: firefly ? rnd(5, 9) : rnd(2.5, 6), ph: rnd(0, 6.28), sp: rnd(0.8, 2.4), ff: firefly,
      };
    }
    bindCursor() {
      let last = 0;
      addEventListener('pointermove', (e) => {
        const now = performance.now();
        if (now - last < 45 || !this.visible) return;
        last = now;
        this.burst(e.clientX, e.clientY, { n: 1, speed: 24, grav: 40, life: 0.8, size: 4, col: '255,214,120' });
      }, { passive: true });
    }
    /* generic spark burst */
    burst(x, y, o) {
      o = Object.assign({ n: 24, speed: 160, grav: 120, life: 1.1, size: 6, col: '255,200,100', drag: 0.985, spread: 6.283, angle: 0, jitter: 0.6 }, o || {});
      if (FX.lowPower) o.n = Math.ceil(o.n * 0.6);
      for (let i = 0; i < o.n; i++) {
        const a = o.angle + (Math.random() - 0.5) * o.spread, v = o.speed * (1 - o.jitter + Math.random() * o.jitter * 1.4);
        this.sparks.push({ x, y, vx: Math.cos(a) * v, vy: Math.sin(a) * v, life: 0, max: o.life * rnd(0.6, 1.2), s: o.size * rnd(0.6, 1.2), col: o.col, g: o.grav, d: o.drag });
      }
      if (this.sparks.length > 900) this.sparks.splice(0, this.sparks.length - 900);
    }
    /* sustained emitter (sparkler, fountain) — cb returns {x,y} each frame */
    emit(o) {
      this.emitters.push(Object.assign({ t: 0, dur: 2, rate: 90, acc: 0, col: '255,214,120', speed: 180, grav: 260, spread: 0.7, angle: -1.5708, size: 5, life: 1 }, o));
    }
    firework(x, y, ty, pal) {
      pal = pal || PALETTES[(Math.random() * PALETTES.length) | 0];
      this.rockets.push({ x, y, ty, vy: -rnd(520, 640), pal, trail: 0 });
    }
    explode(x, y, pal) {
      const type = ['sphere', 'ring', 'willow', 'sphere'][(Math.random() * 4) | 0];
      const n = FX.lowPower ? 46 : 84;
      for (let i = 0; i < n; i++) {
        const a = (i / n) * 6.283 + Math.random() * 0.2;
        let v = type === 'ring' ? 190 : rnd(60, 250), life = rnd(1.2, 2.2), g = 90, col = pal[(Math.random() * pal.length) | 0];
        if (type === 'willow') { v = rnd(60, 190); life = rnd(2, 3.2); g = 150; col = '#ffd36b'; }
        this.sparks.push({ x, y, vx: Math.cos(a) * v, vy: Math.sin(a) * v, life: 0, max: life, s: rnd(3.2, 5.4), col: hex2rgb(col), g, d: 0.982 });
      }
      this.sparks.push({ x, y, vx: 0, vy: 0, life: 0, max: 0.35, s: 46, col: hex2rgb(pal[0]), g: 0, d: 1 });
      if (DW.audio) DW.audio.boom();
    }
    frame(dt) {
      if (!this.visible || !this.w) return;
      dt = Math.min(dt, 0.05);
      this.t += dt;
      const ctx = this.ctx;
      if (!this.amb.length && !this.sparks.length && !this.rockets.length && !this.emitters.length && !this.auto) {
        if (this._dirty) { ctx.clearRect(0, 0, this.w, this.h); this._dirty = false; }
        return;
      }
      this._dirty = true;
      if (this.o.trails) {
        ctx.globalCompositeOperation = 'destination-out';
        ctx.fillStyle = 'rgba(0,0,0,.2)';
        ctx.fillRect(0, 0, this.w, this.h);
      } else ctx.clearRect(0, 0, this.w, this.h);
      ctx.globalCompositeOperation = 'lighter';

      /* ambient embers & fireflies */
      if (this.amb.length) {
        const sp = sprite(this.o.tint);
        for (let i = 0; i < this.amb.length; i++) {
          const p = this.amb[i];
          p.x += (p.vx + Math.sin(this.t * p.sp + p.ph) * 14) * dt;
          p.y += p.vy * dt;
          if (p.y < -12 || p.x < -20 || p.x > this.w + 20 || p.y > this.h + 20) this.amb[i] = this.mkAmb(false);
          const a = (0.28 + 0.4 * (0.5 + 0.5 * Math.sin(this.t * p.sp * 1.7 + p.ph))) * (p.ff ? 1 : 0.8);
          ctx.globalAlpha = a;
          const s = p.r * (p.ff ? 3.2 : 2.6);
          ctx.drawImage(sprite(p.ff ? '200,255,140' : this.o.tint), p.x - s, p.y - s, s * 2, s * 2);
        }
      }
      /* auto fireworks (finale) */
      if (this.auto) {
        this.autoT -= dt;
        if (this.autoT <= 0) {
          this.autoT = rnd(this.autoGap[0], this.autoGap[1]);
          this.firework(rnd(this.w * 0.1, this.w * 0.9), this.h * 0.95, rnd(this.h * 0.12, this.h * 0.5));
        }
      }
      /* rockets */
      for (let i = this.rockets.length - 1; i >= 0; i--) {
        const r = this.rockets[i];
        r.y += r.vy * dt;
        r.vy *= 0.985;
        this.sparks.push({ x: r.x + rnd(-1.5, 1.5), y: r.y, vx: rnd(-14, 14), vy: rnd(10, 50), life: 0, max: 0.5, s: 3.2, col: '255,220,150', g: 0, d: 1 });
        if (r.y <= r.ty || r.vy > -60) { this.explode(r.x, r.y, r.pal); this.rockets.splice(i, 1); }
      }
      /* emitters */
      for (let i = this.emitters.length - 1; i >= 0; i--) {
        const e = this.emitters[i];
        e.t += dt;
        if (e.t > e.dur) { this.emitters.splice(i, 1); continue; }
        const pos = e.at ? e.at() : { x: e.x, y: e.y };
        e.acc += e.rate * dt;
        while (e.acc >= 1) {
          e.acc--;
          const a = e.angle + (Math.random() - 0.5) * e.spread * 2, v = e.speed * rnd(0.4, 1.1);
          this.sparks.push({ x: pos.x, y: pos.y, vx: Math.cos(a) * v, vy: Math.sin(a) * v, life: 0, max: e.life * rnd(0.5, 1.1), s: e.size * rnd(0.6, 1.1), col: e.col, g: e.grav, d: 0.99 });
        }
      }
      /* sparks */
      for (let i = this.sparks.length - 1; i >= 0; i--) {
        const s = this.sparks[i];
        s.life += dt;
        if (s.life >= s.max) { this.sparks.splice(i, 1); continue; }
        s.vx *= s.d; s.vy = s.vy * s.d + s.g * dt;
        s.x += s.vx * dt; s.y += s.vy * dt;
        const k = 1 - s.life / s.max, sz = s.s * (0.55 + 0.9 * k) * 2.2;
        ctx.globalAlpha = Math.min(1, k * 1.4);
        ctx.drawImage(sprite(s.col), s.x - sz, s.y - sz, sz * 2, sz * 2);
      }
      ctx.globalAlpha = 1;
    }
  }
  Layer.all = [];
  FX.Layer = Layer;

  /* =========================================================
     LightLayer — thousands of flickering diya lights on a canvas
     ========================================================= */
  class LightLayer {
    constructor(canvas, data, o) {
      const lights = data.lights || data;
      this.view = data.view || null;
      this.cw = data.cw || 1;
      this.ch = data.ch || 1;
      this.c = canvas;
      this.ctx = canvas.getContext('2d');
      this.o = Object.assign({ size: 11, fps: 28, col: '255,190,90', intensity: 1 }, o || {});
      this.dpr = Math.min(window.devicePixelRatio || 1, 2);
      let L = lights;
      if (FX.lowPower && L.length > 700) L = L.filter((_, i) => i % 2 === 0);
      this.L = L;
      this.intensity = this.o.intensity;
      this.visible = false;
      this.acc = 0;
      this.t = Math.random() * 10;
      // random reveal order so lights "catch" one after another
      let s = 7;
      const rr = () => ((s = (Math.imul(s, 1664525) + 1013904223) >>> 0) / 4294967296);
      this.order = L.map(() => rr());
      this.resize();
      if ('ResizeObserver' in window) new ResizeObserver(() => this.resize()).observe(canvas);
      new IntersectionObserver((e) => (this.visible = e[0].isIntersecting), { rootMargin: '150px' }).observe(canvas);
      LightLayer.all.push(this);
    }
    resize() {
      const w = this.c.clientWidth, h = this.c.clientHeight;
      if (!w || !h) return;
      this.w = w; this.h = h;
      this.c.width = Math.round(w * this.dpr);
      this.c.height = Math.round(h * this.dpr);
      this.ctx.setTransform(this.dpr, 0, 0, this.dpr, 0, 0);
      const n = this.L.length;
      this.px = new Float32Array(n); this.py = new Float32Array(n);
      if (this.view) { // same maths as preserveAspectRatio="xMidYMax slice"
        const [vx, vy, vw, vh] = this.view, meet = w / h >= 1.25;
        const svg = this.c.parentNode.querySelector('svg');
        if (svg) svg.setAttribute('preserveAspectRatio', 'xMidYMax ' + (meet ? 'meet' : 'slice'));
        const k = meet ? Math.min(w / vw, h / vh) : Math.max(w / vw, h / vh);
        const ox = (w - vw * k) / 2, oy = h - vh * k;
        this.k = k;
        for (let i = 0; i < n; i++) { this.px[i] = ox + (this.L[i][0] * this.cw - vx) * k; this.py[i] = oy + (this.L[i][1] * this.ch - vy) * k; }
      } else {
        this.k = w / 1600;
        for (let i = 0; i < n; i++) { this.px[i] = this.L[i][0] * w; this.py[i] = this.L[i][1] * h; }
      }
    }
    frame(dt) {
      if (!this.visible || !this.w) return;
      this.t += dt;
      this.acc += dt;
      if (this.acc < 1 / this.o.fps) return;
      this.acc = 0;
      const ctx = this.ctx, sp = sprite(this.o.col), base = this.o.size * this.k * 1.15 + 2;
      ctx.clearRect(0, 0, this.w, this.h);
      ctx.globalCompositeOperation = 'lighter';
      const inten = this.intensity, t = this.t;
      for (let i = 0; i < this.L.length; i++) {
        const l = this.L[i];
        const k = (inten - this.order[i] * 0.85) / 0.15; // soft threshold: each light fades in
        if (k <= 0) continue;
        const ph = l[3], fl = 0.72 + 0.2 * Math.sin(t * 5.1 + ph * 3) + 0.08 * Math.sin(t * 13 + ph * 7);
        const s = base * l[2] * (0.85 + 0.15 * fl) * (0.5 + 0.5 * Math.min(1, k));
        ctx.globalAlpha = Math.min(1, k) * fl * 0.72;
        ctx.drawImage(sp, this.px[i] - s, this.py[i] - s, s * 2, s * 2);
      }
      ctx.globalAlpha = 1;
    }
  }
  LightLayer.all = [];
  FX.LightLayer = LightLayer;

  /* one ticker drives everything */
  FX.start = function () {
    if (FX._on) return;
    FX._on = true;
    let last = performance.now();
    function tick(now) {
      const dt = (now - last) / 1000;
      last = now;
      if (!document.hidden) {
        for (const l of Layer.all) l.frame(dt);
        for (const l of LightLayer.all) l.frame(dt);
      }
      requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
  };

  /* convenience: global overlay layer created by main.js */
  FX.global = null;
  FX.burstAtEl = function (el, o) {
    if (!FX.global) return;
    const r = el.getBoundingClientRect();
    FX.global.burst(r.left + r.width / 2, r.top + r.height / 2, o);
  };
})();
