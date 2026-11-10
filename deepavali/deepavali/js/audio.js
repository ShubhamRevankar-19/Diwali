/* =========================================================
   Deepavali — generative soundscape (Web Audio, no files)
   A tanpura-style drone, a slow Bhoopali-scale melody and
   temple bells, made live in the browser. Off until the
   visitor turns it on.
   ========================================================= */
(function () {
  'use strict';
  const DW = (window.DW = window.DW || {});
  const SA = 130.81; // C3
  // Raag Bhoopali (major pentatonic) in just intonation, two octaves
  const SCALE = [1, 9 / 8, 5 / 4, 3 / 2, 5 / 3];
  let ctx = null, master, wet, dry, comp, timer = null, on = false, step = 0, nextBeat = 0, drnT = 0, bellT = 0, deg = 4, lastBoom = 0;
  const BEAT = 60 / 54;

  function build() {
    ctx = new (window.AudioContext || window.webkitAudioContext)();
    master = ctx.createGain(); master.gain.value = 0;
    comp = ctx.createDynamicsCompressor(); comp.threshold.value = -18; comp.ratio.value = 3;
    dry = ctx.createGain(); dry.gain.value = 0.8;
    wet = ctx.createGain(); wet.gain.value = 0.55;
    const conv = ctx.createConvolver();
    const len = ctx.sampleRate * 3.2, buf = ctx.createBuffer(2, len, ctx.sampleRate);
    for (let c = 0; c < 2; c++) {
      const d = buf.getChannelData(c);
      for (let i = 0; i < len; i++) d[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / len, 2.6);
    }
    conv.buffer = buf;
    dry.connect(master); wet.connect(conv); conv.connect(master);
    master.connect(comp); comp.connect(ctx.destination);
  }
  const out = (g) => { g.connect(dry); g.connect(wet); };

  function pluck(freq, t, vol, dur, bright) {
    const o1 = ctx.createOscillator(), o2 = ctx.createOscillator(), g = ctx.createGain(), f = ctx.createBiquadFilter();
    o1.type = 'sawtooth'; o2.type = 'triangle';
    o1.frequency.value = freq; o2.frequency.value = freq * 1.003;
    f.type = 'lowpass'; f.frequency.setValueAtTime(bright || 1400, t); f.frequency.exponentialRampToValueAtTime(260, t + dur);
    g.gain.setValueAtTime(0.0001, t); g.gain.exponentialRampToValueAtTime(vol, t + 0.012); g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
    o1.connect(f); o2.connect(f); f.connect(g); out(g);
    o1.start(t); o2.start(t); o1.stop(t + dur + 0.1); o2.stop(t + dur + 0.1);
  }
  function bell(freq, t, vol, dur) {
    [[1, 1], [2.76, 0.5], [5.4, 0.25], [8.93, 0.12]].forEach(([m, a]) => {
      const o = ctx.createOscillator(), g = ctx.createGain();
      o.type = 'sine'; o.frequency.value = freq * m;
      g.gain.setValueAtTime(0.0001, t); g.gain.exponentialRampToValueAtTime(vol * a, t + 0.006); g.gain.exponentialRampToValueAtTime(0.0001, t + dur / m ** 0.35);
      o.connect(g); out(g); o.start(t); o.stop(t + dur + 0.1);
    });
  }
  function noise(t, dur, vol, f0, f1, type) {
    const n = ctx.sampleRate * dur, b = ctx.createBuffer(1, n, ctx.sampleRate), d = b.getChannelData(0);
    for (let i = 0; i < n; i++) d[i] = Math.random() * 2 - 1;
    const s = ctx.createBufferSource(); s.buffer = b;
    const f = ctx.createBiquadFilter(); f.type = type || 'lowpass'; f.frequency.setValueAtTime(f0, t); f.frequency.exponentialRampToValueAtTime(f1, t + dur);
    const g = ctx.createGain(); g.gain.setValueAtTime(vol, t); g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
    s.connect(f); f.connect(g); out(g); s.start(t); s.stop(t + dur);
  }

  function schedule() {
    const horizon = ctx.currentTime + 1.4;
    // tanpura cycle: Pa, Sa, Sa, low Sa
    while (drnT < horizon) {
      const t = Math.max(drnT, ctx.currentTime + 0.05);
      const i = Math.round((drnT - startT) / 1.05) % 4;
      const f = [SA * 0.75, SA, SA, SA * 0.5][i];
      pluck(f, t, 0.075, 4.2, 1000);
      drnT += 1.05 * (i === 3 ? 1.5 : 1);
    }
    // melody
    while (nextBeat < horizon) {
      const t = Math.max(nextBeat, ctx.currentTime + 0.05);
      if (Math.random() > 0.28) {
        const r = Math.random();
        deg += r < 0.34 ? 1 : r < 0.68 ? -1 : r < 0.82 ? 2 : -2;
        deg = Math.max(0, Math.min(9, deg));
        const oct = deg >= 5 ? 2 : 1;
        const f = SA * 2 * SCALE[deg % 5] * oct;
        pluck(f, t, 0.1, 2.8, 2600);
        if (Math.random() < 0.3) pluck(f * 2, t + 0.01, 0.025, 1.8, 3200);
      }
      nextBeat += BEAT * (Math.random() < 0.3 ? 0.5 : 1) * (Math.random() < 0.15 ? 2 : 1);
    }
    // soft temple bell now and then
    if (bellT < horizon) {
      bell(SA * 4 * SCALE[(Math.random() * 5) | 0], Math.max(bellT, ctx.currentTime + 0.05), 0.05, 5);
      bellT += 7 + Math.random() * 7;
    }
  }
  let startT = 0;

  const API = (DW.audio = {
    get on() { return on; },
    enable() {
      if (!ctx) build();
      if (ctx.state === 'suspended') ctx.resume();
      if (on) return;
      on = true;
      const now = ctx.currentTime;
      startT = drnT = now + 0.1; nextBeat = now + 2; bellT = now + 3;
      master.gain.cancelScheduledValues(now); master.gain.setValueAtTime(master.gain.value, now); master.gain.linearRampToValueAtTime(0.7, now + 2.5);
      schedule(); timer = setInterval(schedule, 400);
    },
    disable() {
      if (!ctx || !on) return;
      on = false;
      const now = ctx.currentTime;
      master.gain.cancelScheduledValues(now); master.gain.setValueAtTime(master.gain.value, now); master.gain.linearRampToValueAtTime(0, now + 0.8);
      clearInterval(timer);
      setTimeout(() => { if (!on && ctx) ctx.suspend(); }, 1000);
    },
    toggle() { on ? API.disable() : API.enable(); return on; },
    /* sound effects only play while the visitor has sound on */
    chime(k) { if (!on) return; const t = ctx.currentTime + 0.01; bell(SA * 4 * SCALE[((k || 0) % 5 + 5) % 5], t, 0.09, 3.2); },
    light(k) { if (!on) return; const t = ctx.currentTime + 0.01; pluck(SA * 4 * SCALE[((k || 0) % 5 + 5) % 5], t, 0.12, 1.6, 3600); noise(t, 0.25, 0.05, 6000, 1200, 'bandpass'); },
    bell() { if (!on) return; const t = ctx.currentTime + 0.01; bell(SA * 2.5, t, 0.16, 5.5); bell(SA * 3.75, t + 0.02, 0.08, 4.5); },
    pop() { if (!on) return; noise(ctx.currentTime + 0.01, 0.18, 0.07, 5000, 600, 'bandpass'); },
    boom() {
      if (!on) return;
      const now = performance.now();
      if (now - lastBoom < 220) return;
      lastBoom = now;
      const t = ctx.currentTime + 0.02;
      noise(t, 1.2, 0.2, 380, 50, 'lowpass');
      noise(t + 0.04, 0.7, 0.05, 7000, 1500, 'highpass');
    },
    sparkle() { if (!on) return; noise(ctx.currentTime + 0.01, 0.09, 0.03, 9000, 3000, 'highpass'); },
  });
})();
