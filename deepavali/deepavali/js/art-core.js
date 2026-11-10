/* =========================================================
   Deepavali — original SVG artwork engine (core helpers)
   Everything on the site is drawn in code: no stock photos.
   ========================================================= */
(function () {
  'use strict';
  const DW = (window.DW = window.DW || {});
  const A = (DW.art = { make: {} });

  /* seeded PRNG so every illustration is identical on every load */
  function rng(seed) {
    let s = (seed || 1) >>> 0;
    return function () {
      s = (Math.imul(s, 1664525) + 1013904223) >>> 0;
      return s / 4294967296;
    };
  }
  A.rng = rng;
  const n1 = (v) => Math.round(v * 10) / 10;
  A.n1 = n1;

  /* shared gradients (ids are prefixed per SVG so they never collide) */
  A.defs = function (p) {
    return `
<radialGradient id="${p}glow"><stop offset="0" stop-color="#fff0b8" stop-opacity=".95"/><stop offset=".3" stop-color="#ffbf4d" stop-opacity=".5"/><stop offset="1" stop-color="#ff7a1a" stop-opacity="0"/></radialGradient>
<radialGradient id="${p}glowW"><stop offset="0" stop-color="#fff" stop-opacity=".9"/><stop offset=".4" stop-color="#ffe9a8" stop-opacity=".35"/><stop offset="1" stop-color="#ffe9a8" stop-opacity="0"/></radialGradient>
<linearGradient id="${p}clay" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#f0985a"/><stop offset="1" stop-color="#8a3a1a"/></linearGradient>
<linearGradient id="${p}flame" x1="0" y1="1" x2="0" y2="0"><stop offset="0" stop-color="#ff5a00"/><stop offset=".5" stop-color="#ffae2e"/><stop offset="1" stop-color="#fff4b8"/></linearGradient>
<linearGradient id="${p}gold" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#fff3c2"/><stop offset=".45" stop-color="#f5c04a"/><stop offset="1" stop-color="#a9611a"/></linearGradient>
<linearGradient id="${p}goldH" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#b9731c"/><stop offset=".5" stop-color="#ffe08a"/><stop offset="1" stop-color="#b9731c"/></linearGradient>`;
  };

  /* ---------- four-point sparkle ---------- */
  A.sparkle = (x, y, s, c, cls) =>
    `<path ${cls ? `class="${cls}"` : ''} d="M${x} ${y - s} Q${x} ${y} ${x + s} ${y} Q${x} ${y} ${x} ${y + s} Q${x} ${y} ${x - s} ${y} Q${x} ${y} ${x} ${y - s}Z" fill="${c || '#fff4c2'}"/>`;

  /* ---------- stars ---------- */
  A.stars = function (seed, n, w, ymin, ymax, twinkle) {
    const r = rng(seed);
    let s = '';
    for (let i = 0; i < n; i++) {
      const x = n1(r() * w), y = n1(ymin + r() * (ymax - ymin)), sz = n1(0.8 + r() * 1.8);
      const tw = i < (twinkle == null ? 14 : twinkle) ? ` class="tw" style="animation-delay:${n1(r() * 4)}s"` : '';
      s += `<circle cx="${x}" cy="${y}" r="${sz}" fill="#fff6dd" opacity="${n1(0.4 + r() * 0.6)}"${tw}/>`;
    }
    return s;
  };

  /* ---------- diya (clay lamp) ---------- */
  A.diya = function (x, y, s, p, o) {
    o = o || {};
    const lit = o.lit !== false;
    const flame = lit
      ? `<g transform="translate(0 -12)"><g class="fl" style="animation-delay:${o.d || 0}s"><path d="M0 0 C-10 -12 -6 -28 0 -46 C6 -28 10 -12 0 0Z" fill="url(#${p}flame)"/><path d="M0 -2 C-4.5 -9 -3 -20 0 -30 C3 -20 4.5 -9 0 -2Z" fill="#fffbe8" opacity=".92"/></g></g>`
      : '';
    const glow = lit ? `<circle class="gl" cx="0" cy="-30" r="${o.glow || 78}" fill="url(#${p}glow)"/>` : '';
    return `<g transform="translate(${x} ${y}) scale(${s})">${glow}
<path d="M-38 -6 C-36 18 -16 29 0 29 C16 29 36 18 38 -6 C20 2 -20 2 -38 -6Z" fill="url(#${p}clay)"/>
<path d="M-38 -6 Q-47 -12 -45 -20 Q-39 -12 -30 -10Z" fill="#c9672a"/>
<ellipse cx="0" cy="-6" rx="38" ry="8.5" fill="#d27431"/>
<ellipse cx="0" cy="-6.5" rx="31" ry="6" fill="#f2b74f"/>
<path d="M-24 8 Q0 16 24 8" stroke="#ffd9a0" stroke-opacity=".5" stroke-width="2" fill="none"/>
<rect x="-2.2" y="-15" width="4.4" height="10" rx="2" fill="#3a1d10"/>${flame}</g>`;
  };

  /* ---------- lotus ---------- */
  A.lotus = function (x, y, s, p, o) {
    o = o || {};
    const pet = (a, l, w, c, op) =>
      `<path transform="rotate(${a})" d="M0 0 C${w} ${-l * 0.3} ${w * 0.85} ${-l * 0.8} 0 ${-l} C${-w * 0.85} ${-l * 0.8} ${-w} ${-l * 0.3} 0 0Z" fill="${c}" opacity="${op}"/>`;
    let g = `<g transform="translate(${x} ${y}) scale(${s})">`;
    if (o.glow) g += `<circle cy="-34" r="${o.glow}" fill="url(#${p}glow)"/>`;
    [-80, -52, 52, 80].forEach((a) => (g += pet(a, 62, 24, '#a93a74', 0.9)));
    [-64, -32, 0, 32, 64].forEach((a) => (g += pet(a, 76, 27, '#e0568f', 0.95)));
    [-40, -14, 14, 40].forEach((a) => (g += pet(a, 62, 22, '#ff9ec2', 0.95)));
    g += pet(0, 52, 18, '#ffd6e4', 0.95);
    g += `<ellipse cy="-10" rx="14" ry="6" fill="#ffc94a"/></g>`;
    return g;
  };

  /* ---------- mandala / rangoli ---------- */
  A.mandala = function (p, o) {
    o = o || {};
    const pal = o.pal || ['#ffd36b', '#ff8a2a', '#e0457b', '#8a4fe0', '#2fc2b0'];
    const petal = (len, wid) =>
      `M0 0 C${wid} ${-len * 0.28} ${wid} ${-len * 0.72} 0 ${-len} C${-wid} ${-len * 0.72} ${-wid} ${-len * 0.28} 0 0Z`;
    const defs = `<defs>
<g id="${p}pA"><path d="${petal(54, 15)}" fill="${pal[1]}"/><path d="${petal(36, 8)}" fill="${pal[0]}" opacity=".9"/><circle cy="-46" r="3" fill="#fff6d0"/></g>
<g id="${p}pB"><path d="${petal(66, 17)}" fill="${pal[2]}"/><path d="${petal(44, 9)}" fill="${pal[0]}"/><path d="M0 -8 L0 -52" stroke="${pal[3]}" stroke-width="2"/></g>
<g id="${p}pC"><path d="${petal(52, 15)}" fill="${pal[3]}"/><path d="${petal(34, 8)}" fill="${pal[4]}"/></g>
<g id="${p}pD"><path d="${petal(44, 12)}" fill="${pal[0]}"/><path d="${petal(28, 6)}" fill="${pal[2]}"/></g>
<g id="${p}pE"><path d="M0 0 L9 -14 L0 -28 L-9 -14Z" fill="${pal[4]}"/><circle cy="-14" r="3" fill="#fff"/></g>
</defs>`;
    const ring = (id, n, r, off) => {
      let s = '';
      for (let i = 0; i < n; i++) s += `<use href="#${p}${id}" transform="rotate(${n1((360 / n) * i + (off || 0))}) translate(0 ${-r})"/>`;
      return s;
    };
    let dots = '';
    for (let i = 0; i < 60; i++) {
      const a = (i / 60) * Math.PI * 2;
      dots += `<circle cx="${n1(Math.cos(a) * 192)}" cy="${n1(Math.sin(a) * 192)}" r="${i % 2 ? 2.2 : 3.4}" fill="${i % 2 ? pal[4] : pal[0]}"/>`;
    }
    let tri = '';
    for (let i = 0; i < 30; i++) tri += `<use href="#${p}pE" transform="rotate(${i * 12}) translate(0 -168) scale(.8)"/>`;
    return `${defs}
<g class="mr mr-a">${dots}<circle r="178" fill="none" stroke="${pal[0]}" stroke-width="1.2" stroke-dasharray="2 7"/></g>
<g class="mr mr-b">${tri}</g>
<g class="mr mr-c">${ring('pA', 24, 112, 0)}</g>
<g class="mr mr-d">${ring('pB', 16, 76, 11)}</g>
<g class="mr mr-e">${ring('pC', 12, 50, 0)}</g>
<g class="mr mr-f">${ring('pD', 8, 28, 22)}</g>
<circle r="20" fill="${pal[0]}"/><circle r="13" fill="${pal[2]}"/><circle r="6" fill="#fff4c2"/>`;
  };

  /* ---------- hills / terrain ridge ---------- */
  A.hills = function (seed, base, amp, w, fill, o) {
    o = o || {};
    const r = rng(seed), step = o.step || 180, bottom = o.bottom || 900;
    let y = base - r() * amp;
    let d = `M-40 ${bottom} L-40 ${n1(y)}`;
    for (let x = -40; x < w + step; x += step) {
      const ny = base - r() * amp;
      d += ` Q${x + step / 2} ${n1((y + ny) / 2 - r() * amp * 0.5)} ${x + step} ${n1(ny)}`;
      y = ny;
    }
    d += ` L${w + step + 40} ${bottom}Z`;
    return `<path d="${d}" fill="${fill}"${o.op ? ` opacity="${o.op}"` : ''}/>`;
  };

  /* ---------- trees (sal-like silhouettes) ---------- */
  A.tree = function (x, y, h, fill, seed, o) {
    o = o || {};
    const r = rng(seed), cf = o.cf || 1;
    const w = h * (o.tw || 0.07);
    let s = `<g fill="${fill}"><path d="M${n1(x - w)} ${y} Q${n1(x - w * 0.4)} ${n1(y - h * 0.4)} ${n1(x - w * 0.3)} ${n1(y - h * 0.78)} L${n1(x + w * 0.3)} ${n1(y - h * 0.78)} Q${n1(x + w * 0.4)} ${n1(y - h * 0.4)} ${n1(x + w)} ${y}Z"/>`;
    for (let i = 0; i < 7; i++) {
      const cx = x + (r() - 0.5) * h * 0.7, cy = y - h * 0.72 - r() * h * 0.32, rr = h * (0.13 + r() * 0.12) * cf;
      s += `<circle cx="${n1(cx)}" cy="${n1(cy)}" r="${n1(rr)}"/>`;
    }
    s += `<ellipse cx="${x}" cy="${n1(y - h * 0.85)}" rx="${n1(h * 0.34 * cf)}" ry="${n1(h * 0.2 * cf)}"/>`;
    return s + '</g>';
  };

  /* ---------- clouds ---------- */
  A.cloud = function (x, y, s, fill, op) {
    return `<g transform="translate(${x} ${y}) scale(${s})" fill="${fill}" opacity="${op == null ? 0.5 : op}"><ellipse rx="90" ry="22"/><ellipse cx="-40" cy="-14" rx="44" ry="26"/><ellipse cx="14" cy="-24" rx="52" ry="30"/><ellipse cx="60" cy="-8" rx="36" ry="20"/></g>`;
  };

  /* ---------- firework burst (static art) ---------- */
  A.burst = function (x, y, r, c, n, seed, cls) {
    const rg = rng(seed || 3);
    let s = `<g class="${cls || 'fwb'}" style="animation-delay:${n1(rg() * 3)}s"><circle cx="${x}" cy="${y}" r="${n1(r * 0.9)}" fill="url(#gl_${c.replace('#', '')})" opacity=".35"/>`;
    for (let i = 0; i < n; i++) {
      const a = (i / n) * Math.PI * 2, r0 = r * 0.22, r1 = r * (0.75 + rg() * 0.25);
      const x0 = x + Math.cos(a) * r0, y0 = y + Math.sin(a) * r0, x1 = x + Math.cos(a) * r1, y1 = y + Math.sin(a) * r1;
      s += `<path d="M${n1(x0)} ${n1(y0)} L${n1(x1)} ${n1(y1)}" stroke="${c}" stroke-width="2.2" stroke-linecap="round" opacity=".85"/><circle cx="${n1(x1)}" cy="${n1(y1)}" r="3.2" fill="#fff6d0"/>`;
      const x2 = x + Math.cos(a + 0.12) * r * 0.5, y2 = y + Math.sin(a + 0.12) * r * 0.5;
      s += `<circle cx="${n1(x2)}" cy="${n1(y2)}" r="1.8" fill="${c}"/>`;
    }
    return s + '</g>';
  };
  /* radial glow defs for bursts (called once per svg that uses A.burst) */
  A.burstDefs = function (colors) {
    return colors.map((c) => `<radialGradient id="gl_${c.replace('#', '')}"><stop offset="0" stop-color="${c}" stop-opacity=".8"/><stop offset="1" stop-color="${c}" stop-opacity="0"/></radialGradient>`).join('');
  };

  /* =========================================================
     CITY — Ayodhya-inspired palace skyline
     returns { svg, lights:[[nx,ny,size,phase],…] }
     ========================================================= */
  A.city = function (o) {
    const W = o.w || 1600, H = o.h || 600, r = rng(o.seed || 7);
    const fill = o.fill || '#0a0a1c', trim = o.trim || 'rgba(255,200,110,.35)', accent = o.accent || '#ff9a2e';
    const winFill = o.win || '#ffcf6a';
    const lights = [];
    let out = '';
    const n4 = (v) => Math.round(v * 10000) / 10000;
    const L = (x, y, s) => lights.push([n4(x / W), n4(y / H), s || 1, n1(r() * 6.28)]);
    const edge = (x1, x2, y, step, s) => { for (let x = x1; x <= x2; x += step) L(x, y, s); };

    const spire = (cx, by, w, h, flag) => {
      const hw = w / 2;
      let s = `<path d="M${cx - hw} ${by} C${cx - hw * 1.08} ${by - h * 0.33} ${cx - hw * 0.5} ${by - h * 0.8} ${cx} ${by - h} C${cx + hw * 0.5} ${by - h * 0.8} ${cx + hw * 1.08} ${by - h * 0.33} ${cx + hw} ${by}Z" fill="${fill}"/>`;
      for (let i = 1; i < 6; i++) {
        const yy = by - (h * i) / 6.4, ww = hw * (1 - i / 6.6) * 0.92;
        s += `<path d="M${n1(cx - ww)} ${n1(yy)} L${n1(cx + ww)} ${n1(yy)}" stroke="${trim}" stroke-width="1.4"/>`;
      }
      s += `<rect x="${cx - 1.6}" y="${by - h - 22}" width="3.2" height="24" fill="${fill}"/><circle cx="${cx}" cy="${by - h - 24}" r="4.2" fill="${fill}"/>`;
      if (flag !== false) s += `<path d="M${cx + 1.6} ${by - h - 40} l26 7 l-26 7Z" fill="${accent}"/><rect x="${cx - 0.6}" y="${by - h - 42}" width="1.8" height="20" fill="${fill}"/>`;
      return s;
    };
    const dome = (cx, by, w, h) => {
      const hw = w / 2;
      return `<path d="M${cx - hw} ${by} C${cx - hw * 1.18} ${by - h * 0.55} ${cx - hw * 0.35} ${by - h * 0.92} ${cx} ${by - h} C${cx + hw * 0.35} ${by - h * 0.92} ${cx + hw * 1.18} ${by - h * 0.55} ${cx + hw} ${by}Z" fill="${fill}"/><rect x="${cx - 1.4}" y="${by - h - 16}" width="2.8" height="18" fill="${fill}"/><circle cx="${cx}" cy="${by - h - 17}" r="3.4" fill="${fill}"/><rect x="${cx - hw * 1.08}" y="${by - 5}" width="${hw * 2.16}" height="7" fill="${fill}"/>`;
    };
    const chhatri = (cx, by, w) => {
      const hw = w / 2, ph = w * 0.7;
      let s = `<rect x="${cx - hw}" y="${by - ph}" width="3.6" height="${ph}" fill="${fill}"/><rect x="${cx + hw - 3.6}" y="${by - ph}" width="3.6" height="${ph}" fill="${fill}"/><rect x="${cx - 1.8}" y="${by - ph}" width="3.6" height="${ph}" fill="${fill}"/><rect x="${cx - hw - 3}" y="${by - ph - 4}" width="${w + 6}" height="6" fill="${fill}"/>`;
      s += dome(cx, by - ph - 4, w * 0.92, w * 0.55);
      return s;
    };
    const archWin = (x, y, w, h, on) =>
      `<path d="M${x} ${y + h} V${y + w / 2} a${w / 2} ${w / 2} 0 0 1 ${w} 0 V${y + h}Z" fill="${on ? winFill : 'rgba(255,255,255,.05)'}"${on ? ` opacity="${n1(0.55 + r() * 0.45)}"` : ''}/>`;
    const block = (x, y, w, h, o2) => {
      o2 = o2 || {};
      let s = `<rect x="${x}" y="${y}" width="${w}" height="${h}" fill="${fill}"/>`;
      // crenellated parapet
      for (let cx = x; cx < x + w - 6; cx += 14) s += `<rect x="${cx + 2}" y="${y - 7}" width="9" height="8" fill="${fill}"/>`;
      s += `<rect x="${x - 4}" y="${y - 2}" width="${w + 8}" height="5" fill="${fill}"/><path d="M${x - 4} ${y + 3} H${x + w + 4}" stroke="${trim}" stroke-width="1.2"/>`;
      if (o.win !== false) {
        const cols = Math.max(2, Math.floor(w / (o2.gap || 30))), gap = w / cols, ww = Math.min(12, gap * 0.45);
        const rows = Math.max(1, Math.floor((h - 18) / 34));
        for (let rr = 0; rr < rows; rr++)
          for (let cc = 0; cc < cols; cc++) {
            const wx = x + gap * cc + (gap - ww) / 2, wy = y + 16 + rr * 34;
            s += archWin(n1(wx), n1(wy), n1(ww), 20, r() > 0.28);
          }
      }
      edge(x, x + w, y - 8, o2.step || 15, 0.8);
      return s;
    };

    const HS = o.hs || 1; // height scale of the central palace
    const cx = W / 2, gy = H;
    /* stepped plinth */
    out += `<rect x="${cx - 420}" y="${gy - 34}" width="840" height="40" fill="${fill}"/><rect x="${cx - 360}" y="${gy - 62}" width="720" height="30" fill="${fill}"/><rect x="${cx - 300}" y="${gy - 90}" width="600" height="30" fill="${fill}"/>`;
    edge(cx - 420, cx + 420, gy - 36, 14, 0.9); edge(cx - 360, cx + 360, gy - 64, 14, 0.9); edge(cx - 300, cx + 300, gy - 92, 14, 0.9);
    /* wings */
    for (const sd of [-1, 1]) {
      let x = cx + sd * 310;
      const cnt = Math.floor((W / 2 - 310) / 150) + 1;
      for (let i = 0; i < cnt; i++) {
        const bw = 90 + r() * 60, bh = 70 + r() * 110, bx = sd < 0 ? x - bw : x, by = gy - 8 - bh;
        out += block(n1(bx), n1(by), n1(bw), n1(bh + 8), { gap: 28 });
        const t = r();
        if (t < 0.45) out += dome(n1(bx + bw / 2), n1(by - 6), n1(bw * 0.5), n1(30 + r() * 26));
        else if (t < 0.8) out += spire(n1(bx + bw / 2), n1(by - 6), n1(bw * 0.42), n1(60 + r() * 70), r() > 0.4);
        else out += chhatri(n1(bx + bw / 2), n1(by - 6), 34);
        x += sd * (bw + 14 + r() * 12);
      }
    }
    /* inner wings */
    for (const sd of [-1, 1]) {
      const bx = sd < 0 ? cx - 520 : cx + 330, bw = 190, bh = 170 * (0.55 + 0.45 * HS), by = gy - 8 - bh;
      out += block(bx, by, bw, bh + 8, { gap: 32 });
      out += spire(bx + bw / 2, by - 6, 100, 150 * HS, true);
      out += chhatri(bx + 22, by - 6, 30) + chhatri(bx + bw - 22, by - 6, 30);
    }
    /* main hall */
    const mh = 220 * HS, my = gy - 90 - mh;
    out += block(cx - 250, my + 14, 500, mh - 14, { gap: 36, step: 13 });
    /* tiered */
    out += block(cx - 190, my - 110 * HS, 380, 126 * HS, { gap: 34, step: 12 });
    out += block(cx - 120, my - 190 * HS, 240, 86 * HS, { gap: 34, step: 12 });
    /* central great spire */
    out += spire(cx, my - 192 * HS, 190, 270 * HS, true);
    /* flanking spires & chhatris */
    out += spire(cx - 150, my - 108 * HS, 96, 150 * HS, true) + spire(cx + 150, my - 108 * HS, 96, 150 * HS, true);
    out += spire(cx - 215, my + 12, 84, 110 * HS, true) + spire(cx + 215, my + 12, 84, 110 * HS, true);
    out += chhatri(cx - 100, my - 188 * HS, 30) + chhatri(cx + 100, my - 188 * HS, 30);
    /* grand arched entrance (glowing) */
    out += `<path d="M${cx - 44} ${gy - 90} V${gy - 168} a44 44 0 0 1 88 0 V${gy - 90}Z" fill="${winFill}" opacity=".95"/><path d="M${cx - 28} ${gy - 90} V${gy - 160} a28 28 0 0 1 56 0 V${gy - 90}Z" fill="#fff3c8"/>`;
    for (let i = -2; i <= 2; i++) if (i) out += `<path d="M${cx + i * 120 - 18} ${gy - 90} V${gy - 150} a18 18 0 0 1 36 0 V${gy - 90}Z" fill="${winFill}" opacity=".8"/>`;
    return { svg: out, lights };
  };

  /* far skyline (soft, hazy, no windows) */
  A.farCity = function (o) {
    const W = o.w || 1600, H = o.h || 600, r = rng(o.seed || 11), fill = o.fill || '#1a1840';
    let s = '';
    for (let x = 0; x < W; x += 40 + r() * 70) {
      const h = 60 + r() * 220, w = 50 + r() * 70, t = r();
      s += `<rect x="${n1(x)}" y="${n1(H - h)}" width="${n1(w)}" height="${n1(h)}" fill="${fill}"/>`;
      if (t < 0.4) s += `<path d="M${n1(x + w / 2 - w * 0.4)} ${n1(H - h)} C${n1(x + w * 0.1)} ${n1(H - h - 40)} ${n1(x + w * 0.4)} ${n1(H - h - 70)} ${n1(x + w / 2)} ${n1(H - h - 80)} C${n1(x + w * 0.6)} ${n1(H - h - 70)} ${n1(x + w * 0.9)} ${n1(H - h - 40)} ${n1(x + w / 2 + w * 0.4)} ${n1(H - h)}Z" fill="${fill}"/>`;
      else if (t < 0.7) s += `<path d="M${n1(x + 4)} ${n1(H - h)} Q${n1(x + w / 2)} ${n1(H - h - w * 0.9)} ${n1(x + w - 4)} ${n1(H - h)}Z" fill="${fill}"/>`;
    }
    return s;
  };

  /* =========================================================
     FIGURES — rim-lit silhouettes (respectful, abstract)
     ========================================================= */
  A.figure = function (o) {
    const { x, y, s, kind } = o, c = o.c || '#080612', rim = o.rim || '#ffc766';
    const rimA = o.rimOp == null ? 0.7 : o.rimOp;
    const st = `stroke="${rim}" stroke-opacity="${rimA}" stroke-width="1.4"`;
    let g = `<g transform="translate(${x} ${y}) scale(${s})" fill="${c}" ${st}>`;
    if (o.aura) g += `<circle cy="-62" r="${o.aura}" fill="url(#${o.p}glow)" stroke="none"/>`;
    if (kind === 'sita') {
      g += `<path d="M-13 -80 Q-22 -38 -27 0 L27 0 Q22 -38 13 -80 Q0 -74 -13 -80Z"/>`;
      g += `<path d="M-13 -78 Q-34 -50 -22 -22 Q-26 -50 -10 -72Z" stroke="none"/>`; // pallu fold
      g += `<circle cy="-91" r="10"/><path d="M6 -98 Q22 -86 14 -50 Q16 -80 4 -92Z" stroke="none"/>`; // braid
      g += `<path d="M-9 -100 Q0 -108 9 -100" fill="none" stroke="#ffd36b" stroke-width="1.6"/>`;
    } else {
      g += `<path d="M-12 -80 Q-18 -40 -21 0 L21 0 Q18 -40 12 -80 Q0 -75 -12 -80Z"/>`;
      g += `<path d="M-15 -78 L15 -60" stroke="${rim}" stroke-opacity=".5" fill="none"/>`; // sash
      g += `<circle cy="-91" r="10"/>`;
      if (o.crown) g += `<path d="M-9 -98 L-8 -112 L-3 -105 L0 -116 L3 -105 L8 -112 L9 -98Z" fill="#f5c04a" stroke="#fff1b8" stroke-width="1"/>`;
      else g += `<ellipse cy="-102" rx="7" ry="7"/>`; // jata
    }
    if (o.bow !== false && kind !== 'sita') {
      const bx = kind === 'lakshmana' ? 16 : 20;
      g += `<path d="M${bx} -118 Q${bx + 36} -66 ${bx} -14" fill="none" stroke="#e9b552" stroke-width="3" stroke-opacity="1"/><path d="M${bx} -118 L${bx} -14" stroke="#ffe9b0" stroke-width=".8" fill="none" stroke-opacity=".8"/>`;
      g += `<rect x="-20" y="-96" width="7" height="34" rx="2" transform="rotate(18 -20 -96)" stroke="none"/>`; // quiver
    }
    if (o.lamp) g += `<g transform="translate(${o.lamp[0]} ${o.lamp[1]}) scale(.5)" stroke="none">${A.diya(0, 0, 1, o.p, { d: 0.3, glow: 60 })}</g>`;
    return g + '</g>';
  };

  /* people silhouettes holding diyas (celebration crowds) */
  A.crowd = function (seed, x0, x1, y, p, n, scaleRange) {
    const r = rng(seed);
    let s = '';
    for (let i = 0; i < n; i++) {
      const x = x0 + (x1 - x0) * (i / n) + (r() - 0.5) * 30, sc = scaleRange[0] + r() * (scaleRange[1] - scaleRange[0]);
      s += `<g transform="translate(${n1(x)} ${y}) scale(${n1(sc)})" fill="#06050f" stroke="#ffc766" stroke-opacity=".55" stroke-width="1.2"><path d="M-11 -66 Q-16 -30 -19 0 L19 0 Q16 -30 11 -66Z"/><circle cy="-76" r="9"/>`;
      if (i % 3 !== 1) s += `<path d="M10 -56 Q22 -48 24 -40" fill="none" stroke-width="3"/><g transform="translate(26 -38) scale(.34)" stroke="none">${A.diya(0, 0, 1, p, { d: n1(r() * 2), glow: 90 })}</g>`;
      s += '</g>';
    }
    return s;
  };

  /* Ravana — ten crowned heads (stylised silhouette) */
  A.ravana = function (x, y, s, p) {
    let g = `<g transform="translate(${x} ${y}) scale(${s})" fill="#0b0410" stroke="#ff7a3a" stroke-opacity=".8" stroke-width="2">`;
    g += `<path d="M-70 0 Q-80 -110 -52 -190 L52 -190 Q80 -110 70 0Z"/>`;
    g += `<path d="M-52 -180 Q-130 -190 -150 -270 Q-120 -230 -60 -214Z M52 -180 Q130 -190 150 -270 Q120 -230 60 -214Z"/>`; // raised arms
    g += `<path d="M-150 -270 L-160 -340" stroke="#e9b552" stroke-width="5"/><path d="M-170 -336 L-150 -346 L-150 -326Z" fill="#e9b552" stroke="none"/>`;
    g += `<path d="M150 -270 L170 -330" stroke="#e9b552" stroke-width="5"/><circle cx="174" cy="-338" r="12" fill="#e9b552" stroke="none"/>`;
    g += `<path d="M-60 -170 L-150 -150 M60 -170 L150 -150" stroke="#0b0410" stroke-width="16" stroke-linecap="round" fill="none"/>`;
    for (let i = 0; i < 10; i++) {
      const row = i < 5 ? 0 : 1, k = i < 5 ? i : i - 5, n = 5;
      const a = ((k / (n - 1)) - 0.5) * (row ? 1.6 : 2.2);
      const R = row ? 54 : 88, hx = Math.sin(a) * R * (row ? 1.1 : 1.35), hy = -210 - Math.cos(a) * R * (row ? 1.15 : 0.95) + (row ? -14 : 0);
      const hr = row ? 15 : 17;
      g += `<circle cx="${n1(hx)}" cy="${n1(hy)}" r="${hr}"/><path d="M${n1(hx - hr)} ${n1(hy - hr * 0.5)} L${n1(hx - hr * 0.7)} ${n1(hy - hr * 1.7)} L${n1(hx - hr * 0.2)} ${n1(hy - hr * 1.0)} L${n1(hx)} ${n1(hy - hr * 2)} L${n1(hx + hr * 0.2)} ${n1(hy - hr * 1.0)} L${n1(hx + hr * 0.7)} ${n1(hy - hr * 1.7)} L${n1(hx + hr)} ${n1(hy - hr * 0.5)}Z" fill="#c8892e" stroke="none" opacity=".95"/>`;
      g += `<circle cx="${n1(hx - 5)}" cy="${n1(hy)}" r="1.8" fill="#ff5a2e" stroke="none"/><circle cx="${n1(hx + 5)}" cy="${n1(hy)}" r="1.8" fill="#ff5a2e" stroke="none"/>`;
    }
    return g + '</g>';
  };

  /* Pushpaka Vimana — the celestial flying chariot */
  A.pushpaka = function (x, y, s, p, o) {
    o = o || {};
    let g = `<g class="${o.cls || ''}" transform="translate(${x} ${y}) scale(${s})">`;
    g += `<circle cy="-60" r="260" fill="url(#${p}glow)" opacity=".55"/>`;
    // wings of light
    for (let i = 0; i < 9; i++) g += `<path d="M-60 ${-10 - i * 4} Q-190 ${-30 - i * 22} -300 ${-40 - i * 34}" stroke="#ffe08a" stroke-opacity="${n1(0.5 - i * 0.045)}" stroke-width="${n1(3 - i * 0.25)}" fill="none"/><path d="M60 ${-10 - i * 4} Q190 ${-30 - i * 22} 300 ${-40 - i * 34}" stroke="#ffe08a" stroke-opacity="${n1(0.5 - i * 0.045)}" stroke-width="${n1(3 - i * 0.25)}" fill="none"/>`;
    // hull
    g += `<path d="M-130 -30 Q-120 36 0 44 Q120 36 130 -30 Q0 -10 -130 -30Z" fill="url(#${p}gold)" stroke="#fff1b8" stroke-width="1.5"/>`;
    g += `<path d="M-100 -22 Q0 -4 100 -22" stroke="#a9611a" stroke-width="3" fill="none"/>`;
    for (let i = -4; i <= 4; i++) g += `<circle cx="${i * 24}" cy="${n1(8 + Math.abs(i) * 1.2)}" r="3.2" fill="#e0457b"/>`;
    // cabin & arches
    g += `<rect x="-80" y="-96" width="160" height="70" fill="#d8a23c" opacity=".9"/>`;
    for (let i = -2; i <= 2; i++) g += `<path d="M${i * 30 - 12} -30 V-62 a12 12 0 0 1 24 0 V-30Z" fill="#2b0f3a" opacity=".85"/>`;
    if (o.extra) g += o.extra;
    // roof & spire
    g += `<path d="M-96 -96 Q0 -150 96 -96Z" fill="url(#${p}gold)" stroke="#fff1b8" stroke-width="1.2"/>`;
    g += `<path d="M-40 -122 Q0 -190 40 -122Z" fill="url(#${p}gold)"/><rect x="-1.5" y="-206" width="3" height="40" fill="#f5c04a"/><path d="M1.5 -204 l32 9 l-32 9Z" fill="#ff7a1a"/>`;
    if (o.riders) {
      g += `<g transform="translate(-36 -26) scale(.5)">${A.figure({ x: 0, y: 0, s: 1, kind: 'rama', p, crown: true, bow: false, c: '#1a0b2a', rimOp: 0.9 })}</g>`;
      g += `<g transform="translate(0 -26) scale(.48)">${A.figure({ x: 0, y: 0, s: 1, kind: 'sita', p, c: '#1a0b2a', rimOp: 0.9 })}</g>`;
      g += `<g transform="translate(38 -26) scale(.5)">${A.figure({ x: 0, y: 0, s: 1, kind: 'lakshmana', p, bow: false, c: '#1a0b2a', rimOp: 0.9 })}</g>`;
    }
    // trailing sparkles
    for (let i = 0; i < 10; i++) g += A.sparkle(-150 - i * 34 + (i % 2) * 12, 10 + ((i * 37) % 60) - 20, 4 + (i % 3) * 2, '#fff1b8', 'tw');
    return g + '</g>';
  };
})();
