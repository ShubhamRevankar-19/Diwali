/* =========================================================
   Deepavali — story scenes + hero layers (original SVG art)
   ========================================================= */
(function () {
  'use strict';
  const DW = window.DW, A = DW.art, n1 = A.n1;
  DW.cityLights = {};

  /* place a city() result so its ground line sits on groundY, centred on cx, scaled by sc */
  A.cityT = (W, H, cx, groundY, sc) => `translate(${n1(cx - (W / 2) * sc)} ${n1(groundY - H * sc)}) scale(${sc})`;

  const svgOpen = (vb, extra) =>
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${vb}" preserveAspectRatio="xMidYMid slice" role="img" ${extra || ''}>`;

  /* dots-as-paths: thousands of lights for the price of two <path> elements */
  A.lightsDots = function (lights, W, H, color, size, glowCol) {
    let d = '';
    for (const l of lights) d += `M${n1(l[0] * W)} ${n1(l[1] * H)}h0`;
    return `<path d="${d}" stroke="${glowCol || 'rgba(255,170,60,.28)'}" stroke-width="${size * 3.2}" stroke-linecap="round" fill="none"/><path d="${d}" stroke="${color || '#ffd98a'}" stroke-width="${size}" stroke-linecap="round" fill="none"/>`;
  };

  const gradStops = (id, stops, vertical) =>
    `<linearGradient id="${id}" x1="0" y1="0" x2="${vertical === false ? 1 : 0}" y2="${vertical === false ? 0 : 1}">${stops.map((s) => `<stop offset="${s[0]}" stop-color="${s[1]}"${s[2] != null ? ` stop-opacity="${s[2]}"` : ''}/>`).join('')}</linearGradient>`;

  /* ============ CHAPTER 1 — the birth of Rama (Ayodhya at dawn) ============ */
  A.make.scene1 = function () {
    const p = 's1';
    const city = A.city({ w: 1500, h: 420, seed: 21, fill: '#2b1238', trim: 'rgba(255,214,150,.55)', win: '#ffd98a' });
    let rays = '';
    for (let i = 0; i < 28; i++) rays += `<path d="M0 0 L-18 -760 L18 -760Z" transform="rotate(${(i * 360) / 28})"/>`;
    let shimmer = '';
    const r = A.rng(5);
    for (let i = 0; i < 16; i++) shimmer += `<path class="shm" style="animation-delay:${n1(r() * 4)}s" d="M${n1(r() * 1500)} ${n1(785 + r() * 100)} h${n1(40 + r() * 80)}" stroke="#ffe3a0" stroke-opacity=".55" stroke-width="2.4" stroke-linecap="round"/>`;
    return `${svgOpen('0 0 1600 900')}<defs>${A.defs(p)}
${gradStops(p + 'sky', [[0, '#2a1a5e'], [0.45, '#b2487a'], [0.75, '#ff9a5a'], [1, '#ffd98a']])}
${gradStops(p + 'river', [[0, '#ffbf6a'], [0.5, '#9a4a6a'], [1, '#2a1238']])}
</defs>
<rect class="sky" width="1600" height="900" fill="url(#${p}sky)"/>
<g class="lyr" data-d=".1">${A.stars(5, 46, 1600, 0, 330, 10)}
 <g transform="translate(1040 560)"><circle r="560" fill="url(#${p}glow)" opacity=".7"/><g class="spin-slow" fill="#fff3c2" opacity=".14">${rays}</g><circle r="140" fill="url(#${p}gold)"/><circle r="140" fill="none" stroke="#fff" stroke-opacity=".6" stroke-width="2"/></g>
 ${A.cloud(420, 250, 1.3, '#ffb0a0', 0.35)}${A.cloud(1320, 190, 1.1, '#ffc9a0', 0.4)}</g>
<g class="lyr" data-d=".25">${A.hills(8, 700, 90, 1600, '#7a3a6a', { op: 0.55 })}</g>
<g class="lyr" data-d=".4"><g transform="${A.cityT(1500, 420, 560, 792, 0.62)}">${city.svg}</g>${A.hills(9, 790, 40, 1600, '#1d0d2a', { step: 260 })}</g>
<g class="lyr" data-d=".6"><rect y="770" width="1600" height="140" fill="url(#${p}river)"/>${shimmer}
 ${A.diya(760, 842, 0.8, p, { glow: 90 })}${A.diya(900, 868, 0.7, p, { glow: 80, d: 0.6 })}${A.diya(1500, 826, 0.6, p, { glow: 70, d: 1.1 })}</g>
<g class="lyr" data-d="1.1"><path d="M-40 900 L-40 862 Q200 840 420 880 L440 900Z" fill="#12061c"/><path d="M1180 900 Q1300 850 1460 866 Q1560 874 1660 850 L1660 900Z" fill="#12061c"/>
 <ellipse cx="1060" cy="888" rx="120" ry="14" fill="#2a4a3a" opacity=".8"/><ellipse cx="1330" cy="896" rx="90" ry="11" fill="#2a4a3a" opacity=".8"/>
 ${A.lotus(1060, 884, 1.5, p, { glow: 190 })}${A.lotus(1330, 892, 0.9, p, { glow: 110 })}
 <g class="rise" style="animation-delay:.4s">${A.sparkle(1060, 640, 16, '#fff4c2', 'tw')}${A.sparkle(1000, 700, 9, '#fff4c2', 'tw')}${A.sparkle(1130, 690, 10, '#fff4c2', 'tw')}</g></g>
</svg>`;
  };

  /* ============ CHAPTER 2 — exile into the forest ============ */
  A.make.scene2 = function () {
    const p = 's2';
    const r = A.rng(33);
    let far = '', mid = '', near = '', ff = '';
    for (let x = -60, i = 0; x < 1700; x += 80 + r() * 60, i++) far += A.tree(n1(x), 790, n1(300 + r() * 130), '#0b3030', 100 + i, { cf: 0.65, tw: 0.04 });
    for (let x = -30, i = 0; x < 1700; x += 150 + r() * 80, i++) mid += A.tree(n1(x), 820, n1(430 + r() * 150), '#06201e', 200 + i, { cf: 0.6, tw: 0.045 });
    [90, 1480, 1000].forEach((x, i) => (near += A.tree(x, 930, i === 2 ? 1500 : 1600, '#010706', 300 + i, { cf: 0.4, tw: 0.03 })));
    for (let i = 0; i < 26; i++) {
      const x = n1(150 + r() * 1300), y = n1(520 + r() * 300);
      ff += `<g class="ffly" style="animation-delay:${n1(r() * 5)}s;animation-duration:${n1(3 + r() * 4)}s"><circle cx="${x}" cy="${y}" r="16" fill="url(#${p}glow)" opacity=".55"/><circle cx="${x}" cy="${y}" r="2.4" fill="#fff6c0"/></g>`;
    }
    return `${svgOpen('0 0 1600 900')}<defs>${A.defs(p)}
${gradStops(p + 'sky', [[0, '#03090c'], [0.6, '#0a2a2a'], [1, '#14473c']])}
<radialGradient id="${p}mist"><stop offset="0" stop-color="#9fe6d0" stop-opacity=".18"/><stop offset="1" stop-color="#9fe6d0" stop-opacity="0"/></radialGradient>
</defs>
<rect class="sky" width="1600" height="900" fill="url(#${p}sky)"/>
<g class="lyr" data-d=".1">${A.stars(15, 50, 1600, 0, 420, 10)}<circle cx="1180" cy="210" r="260" fill="url(#${p}glowW)" opacity=".5"/><path d="M1200 148 A62 62 0 1 0 1200 272 A48 48 0 1 1 1200 148Z" fill="#e8f4ff"/></g>
<g class="lyr" data-d=".25">${far}<ellipse cx="500" cy="760" rx="520" ry="70" fill="url(#${p}mist)"/><ellipse cx="1250" cy="780" rx="560" ry="80" fill="url(#${p}mist)"/></g>
<g class="lyr" data-d=".5">${mid}<rect y="800" width="1600" height="100" fill="#031210"/></g>
<g class="lyr" data-d=".75"><path d="M-100 900 C220 850 360 820 620 806 L1020 806 C760 826 650 862 560 900Z" fill="#164a3f" opacity=".55"/>
 <circle cx="500" cy="730" r="260" fill="url(#${p}glow)" opacity=".38"/>
 ${A.figure({ x: 250, y: 828, s: 1.8, kind: 'lakshmana', p })}${A.figure({ x: 430, y: 832, s: 1.7, kind: 'sita', p, aura: 0 })}${A.figure({ x: 620, y: 836, s: 1.85, kind: 'rama', p, aura: 120 })}
 ${ff}</g>
<g class="lyr" data-d="1.15">${near}<ellipse cx="800" cy="900" rx="900" ry="60" fill="#010504"/></g>
</svg>`;
  };

  /* ============ CHAPTER 3 — Sita is taken to Lanka ============ */
  A.make.scene3 = function () {
    const p = 's3';
    const lanka = A.city({ w: 1000, h: 520, seed: 31, fill: '#12051c', trim: 'rgba(255,190,110,.45)', win: '#ffb347', accent: '#e0457b' });
    const r = A.rng(7);
    let waves = '';
    for (let i = 0; i < 24; i++) waves += `<path class="shm" style="animation-delay:${n1(r() * 5)}s" d="M${n1(r() * 1500)} ${n1(790 + r() * 100)} q14 -8 28 0 t28 0" stroke="#c78bff" stroke-opacity=".35" stroke-width="2" fill="none"/>`;
    const deer = `<g transform="translate(760 772) scale(1.15)"><circle cy="-34" r="64" fill="url(#${p}glow)" opacity=".8"/><g fill="#f5c04a" stroke="#fff1b8" stroke-width="1"><ellipse cy="-32" rx="30" ry="13"/><path d="M22 -38 Q38 -58 40 -70 L50 -70 Q48 -56 36 -34Z"/><circle cx="46" cy="-72" r="7"/><path d="M42 -80 l-6 -16 m6 16 l6 -18 m-4 12 l12 -10 m-26 4 l-10 -4" stroke="#fff1b8" fill="none"/><path d="M-20 -24 L-24 0 M-8 -22 L-6 0 M10 -22 L16 0 M22 -26 L30 -2" stroke="#f5c04a" stroke-width="3" fill="none"/></g></g>`;
    const hut = `<g transform="translate(540 790)"><path d="M-60 0 L-60 -44 L0 -92 L60 -44 L60 0Z" fill="#0a0612" stroke="#ffc766" stroke-opacity=".5" stroke-width="1.4"/><path d="M-14 0 V-30 a14 14 0 0 1 28 0 V0Z" fill="#ffcf6a" opacity=".85"/><circle cy="-20" r="46" fill="url(#${p}glow)" opacity=".5"/>${A.diya(-86, 0, 0.5, p, { glow: 50 })}</g>`;
    const sita = A.figure({ x: -18, y: -24, s: 0.46, kind: 'sita', p, c: '#1a0b2a', rimOp: 0.9 });
    const dark = `<g transform="translate(32 -24) scale(.56)" fill="#0b0410" stroke="#ff7a3a" stroke-opacity=".8" stroke-width="2"><path d="M-14 -80 Q-24 -40 -28 0 L28 0 Q24 -40 14 -80Z"/><circle cy="-92" r="11"/><path d="M-11 -100 L-9 -116 L-3 -108 L0 -120 L3 -108 L9 -116 L11 -100Z" fill="#c8892e" stroke="none"/></g>`;
    return `${svgOpen('0 0 1600 900')}<defs>${A.defs(p)}
${gradStops(p + 'sky', [[0, '#12051f'], [0.5, '#3d1450'], [1, '#7a2a4a']])}
${gradStops(p + 'sea', [[0, '#2a1048'], [1, '#07030f']])}
</defs>
<rect class="sky" width="1600" height="900" fill="url(#${p}sky)"/>
<g class="lyr" data-d=".1">${A.stars(23, 36, 1600, 0, 300, 6)}${A.cloud(300, 220, 1.7, '#1d0a2c', 0.8)}${A.cloud(900, 140, 1.4, '#240c36', 0.8)}${A.cloud(1400, 260, 1.8, '#1d0a2c', 0.85)}
 <path class="bolt" d="M1180 60 L1130 250 L1190 238 L1110 450 L1210 226 L1150 236 Z" fill="#efe0ff"/></g>
<g class="lyr" data-d=".3">${A.hills(12, 760, 70, 1600, '#1a0a26', { step: 240 })}</g>
<g class="lyr" data-d=".45"><circle cx="1220" cy="500" r="480" fill="url(#${p}glow)" opacity=".35"/><g transform="${A.cityT(1000, 520, 1180, 800, 0.55)}">${lanka.svg}</g>
 <path d="M700 790 Q1100 740 1700 790 L1700 900 L700 900Z" fill="#0c0414"/></g>
<g class="lyr" data-d=".7"><rect y="790" width="1600" height="120" fill="url(#${p}sea)"/>${waves}${hut}${deer}</g>
<g class="lyr" data-d=".9"><g class="float">${A.pushpaka(960, 360, 1, p, { extra: sita + dark })}</g></g>
<g class="lyr" data-d="1.2">${A.tree(40, 920, 1500, '#05020a', 410, { cf: 0.4, tw: 0.03 })}${A.tree(1560, 940, 1400, '#05020a', 411, { cf: 0.4, tw: 0.03 })}</g>
</svg>`;
  };

  /* ============ CHAPTER 4 — Rama and Ravana ============ */
  A.make.scene4 = function () {
    const p = 's4';
    const lanka = A.city({ w: 1100, h: 480, seed: 41, fill: '#1c0606', trim: 'rgba(255,120,40,.6)', win: '#ff7a1a', accent: '#ff4a1a' });
    const r = A.rng(9);
    let embers = '', flames = '', flags = '';
    for (let i = 0; i < 34; i++) embers += `<circle class="ember" style="animation-delay:${n1(r() * 6)}s;animation-duration:${n1(4 + r() * 5)}s" cx="${n1(r() * 1600)}" cy="${n1(500 + r() * 400)}" r="${n1(1.5 + r() * 2.6)}" fill="#ffb347"/>`;
    for (let i = 0; i < 9; i++) flames += `<g transform="translate(${n1(780 + r() * 760)} ${n1(540 + r() * 150)}) scale(${n1(1.4 + r() * 2)})"><g class="fl" style="animation-delay:${n1(r() * 2)}s"><path d="M0 0 C-10 -12 -6 -28 0 -46 C6 -28 10 -12 0 0Z" fill="url(#${p}flame)"/></g></g>`;
    for (let i = 0; i < 6; i++) flags += `<g transform="translate(${60 + i * 52} ${810 - (i % 2) * 14})"><rect x="-1.5" y="-130" width="3" height="130" fill="#0a0404"/><path class="flag" d="M1.5 -130 l44 12 l-44 14Z" fill="#ff7a1a"/></g>`;
    return `${svgOpen('0 0 1600 900')}<defs>${A.defs(p)}${A.burstDefs(['#ffd36b'])}
${gradStops(p + 'sky', [[0, '#1a0505'], [0.5, '#7a1a0a'], [1, '#ff7a1a']])}
${gradStops(p + 'streak', [[0, '#ffe08a', 0], [1, '#fff6d0', 1]], false)}
</defs>
<rect class="sky" width="1600" height="900" fill="url(#${p}sky)"/>
<g class="lyr" data-d=".1">${A.cloud(320, 200, 2, '#2a0505', 0.8)}${A.cloud(1000, 120, 2.2, '#3a0a08', 0.75)}${A.cloud(1420, 280, 1.8, '#2a0505', 0.8)}<circle cx="1100" cy="620" r="520" fill="url(#${p}glow)" opacity=".55"/></g>
<g class="lyr" data-d=".3"><g transform="${A.cityT(1100, 480, 1120, 800, 0.55)}">${lanka.svg}</g>${flames}<path d="M300 800 Q900 760 1700 800 L1700 900 L300 900Z" fill="#150404"/></g>
<g class="lyr" data-d=".6">${flags}<path d="M180 840 Q250 790 330 806 T560 840Z" fill="#0d0303" stroke="#ff7a3a" stroke-opacity=".5"/>
 <path d="M610 842 Q830 790 1080 842Z" fill="#0d0303"/>
 <g transform="translate(0 0)"><rect x="372" y="652" width="470" height="8" fill="url(#${p}streak)" opacity=".95" transform="rotate(-2.6 372 652)"/><path d="M836 640 l38 -12 l-8 14 l8 14Z" fill="#fff6d0"/>
 <g class="pulse"><circle cx="860" cy="640" r="110" fill="url(#${p}glowW)"/>${A.burst(860, 640, 120, '#ffd36b', 16, 4)}</g></g>
 ${A.ravana(880, 846, 1.3, p)}
 ${A.figure({ x: 330, y: 810, s: 2.05, kind: 'rama', p, aura: 110 })}</g>
<g class="lyr" data-d="1">${embers}<path d="M-50 900 Q300 860 600 890 L600 900Z" fill="#050101"/><path d="M1000 900 Q1300 850 1700 880 L1700 900Z" fill="#050101"/></g>
</svg>`;
  };

  /* ============ CHAPTER 5 — the return, by air, toward Ayodhya ============ */
  A.make.scene5 = function () {
    const p = 's5';
    const city = A.city({ w: 900, h: 300, seed: 51, fill: '#120a2a', trim: 'rgba(255,200,120,.4)', win: '#ffcf6a' });
    let road = '';
    for (let i = 0; i < 16; i++) {
      const t = i / 15, x = n1(80 + t * t * 880 + t * 560), y = n1(900 - Math.sqrt(t) * 125), sc = n1(1 - t * 0.7);
      road += A.diya(x, y, n1(0.75 * sc), p, { glow: 70, d: n1(i * 0.17) });
    }
    return `${svgOpen('0 0 1600 900')}<defs>${A.defs(p)}
${gradStops(p + 'sky', [[0, '#080c33'], [0.5, '#3a2a7a'], [0.85, '#c85a8a'], [1, '#ffb36a']])}
</defs>
<rect class="sky" width="1600" height="900" fill="url(#${p}sky)"/>
<g class="lyr" data-d=".1">${A.stars(52, 90, 1600, 0, 520, 18)}${A.cloud(260, 360, 1.6, '#d9709a', 0.45)}${A.cloud(1120, 300, 1.5, '#e58aa8', 0.4)}${A.cloud(1500, 470, 1.2, '#ffb0a0', 0.4)}</g>
<g class="lyr" data-d=".25">${A.hills(14, 720, 120, 1600, '#2a1a5a', { op: 0.9 })}</g>
<g class="lyr" data-d=".45"><circle cx="1230" cy="640" r="380" fill="url(#${p}glow)" opacity=".45"/><g transform="${A.cityT(900, 300, 1000, 792, 0.5)}">${city.svg}${A.lightsDots(city.lights, 900, 300, '#ffe08a', 6, 'rgba(255,170,60,.3)')}</g>
 <path d="M-40 800 Q500 740 1000 790 Q1300 810 1700 770 L1700 900 L-40 900Z" fill="#0a0620"/></g>
<g class="lyr" data-d=".75">${road}</g>
<g class="lyr" data-d=".9"><g class="float">${A.pushpaka(780, 330, 1.12, p, { riders: true })}</g></g>
<g class="lyr" data-d="1.2"><path d="M-40 900 Q300 850 640 900Z" fill="#05030f"/><path d="M1000 900 Q1300 860 1700 890 L1700 900Z" fill="#05030f"/></g>
</svg>`;
  };

  /* ============ CHAPTER 6 — Ayodhya lights a thousand lamps ============ */
  A.make.scene6 = function () {
    const p = 's6';
    const city = A.city({ w: 2400, h: 520, seed: 61, fill: '#170a22', trim: 'rgba(255,215,140,.55)', win: '#ffd36b' });
    const cols = ['#ffd36b', '#ff9a4a', '#ff6fa0', '#8fd8ff'];
    let fw = '';
    [[330, 190, 150, 0], [820, 120, 170, 1], [1260, 230, 140, 2], [1500, 110, 110, 3], [620, 290, 90, 1]].forEach((b, i) => (fw += A.burst(b[0], b[1], b[2], cols[b[3]], 22, 70 + i)));
    let rows = '';
    for (let row = 0; row < 3; row++) for (let i = 0; i < 12 - row * 2; i++) rows += A.diya(n1(70 + i * (1500 / (11 - row * 2)) + row * 40), 818 + row * 40, n1(0.46 + row * 0.15), p, { glow: 54, d: n1(((i * 7 + row * 3) % 10) / 6) });
    // extra rooftop diya lines (thousands of tiny lights)
    const r = A.rng(77);
    const extra = [];
    for (let i = 0; i < 700; i++) extra.push([r(), 0.84 + r() * 0.15, 1, 0]);
    return `${svgOpen('0 0 1600 900')}<defs>${A.defs(p)}${A.burstDefs(cols)}
${gradStops(p + 'sky', [[0, '#0a0630'], [0.45, '#2a0f4a'], [0.8, '#a33a2a'], [1, '#f5a03a']])}
</defs>
<rect class="sky" width="1600" height="900" fill="url(#${p}sky)"/>
<g class="lyr" data-d=".1">${A.stars(62, 70, 1600, 0, 380, 14)}${fw}</g>
<g class="lyr" data-d=".35"><circle cx="800" cy="640" r="760" fill="url(#${p}glow)" opacity=".5"/><g transform="${A.cityT(2400, 520, 800, 862, 0.66)}">${city.svg}${A.lightsDots(city.lights, 2400, 520, '#ffe08a', 5.4)}${A.lightsDots(extra, 2400, 520, '#ffcf6a', 4, 'rgba(255,150,40,.2)')}</g>
 <rect y="860" width="1600" height="60" fill="#0b0414"/></g>
<g class="lyr" data-d=".7">${rows}</g>
<g class="lyr" data-d="1">${A.crowd(8, 120, 900, 898, p, 9, [1.05, 1.4])}${A.crowd(9, 1000, 1540, 898, p, 6, [1.1, 1.35])}
 ${A.figure({ x: 760, y: 900, s: 1.7, kind: 'rama', p, crown: true, aura: 120, bow: false, rimOp: 0.95 })}${A.figure({ x: 850, y: 900, s: 1.6, kind: 'sita', p, aura: 80, rimOp: 0.95 })}${A.figure({ x: 680, y: 900, s: 1.65, kind: 'lakshmana', p, bow: false, rimOp: 0.95 })}</g>
</svg>`;
  };

  /* ============ HERO LAYERS ============ */
  A.make.heroStars = function () {
    return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1600 900" preserveAspectRatio="xMidYMid slice" aria-hidden="true">${A.stars(2, 150, 1600, 0, 700, 40)}</svg>`;
  };
  A.make.heroMoon = function () {
    return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="-300 -300 600 600" aria-hidden="true"><defs>${A.defs('hm')}
<radialGradient id="hmmoon" cx=".38" cy=".35"><stop offset="0" stop-color="#fffdf2"/><stop offset=".7" stop-color="#ffe9b0"/><stop offset="1" stop-color="#e8c078"/></radialGradient></defs>
<circle r="300" fill="url(#hmglowW)" opacity=".7"/><circle r="92" fill="url(#hmmoon)"/>
<g fill="#d9b070" opacity=".35"><circle cx="-24" cy="-18" r="14"/><circle cx="30" cy="12" r="20"/><circle cx="-10" cy="36" r="9"/><circle cx="34" cy="-40" r="8"/></g></svg>`;
  };
  A.make.heroFar = function () {
    return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1600 600" preserveAspectRatio="none" aria-hidden="true"><defs>${gradStops('hfg', [[0, '#3b2a78'], [1, '#150f3a']])}</defs>${A.farCity({ w: 1600, h: 600, seed: 13, fill: 'url(#hfg)' })}</svg>`;
  };
  A.make.heroNear = function () {
    const city = A.city({ w: 2600, h: 600, seed: 17, hs: 0.36, fill: '#07061a', trim: 'rgba(255,190,100,.38)', win: '#e0a040' });
    const r = A.rng(5), lights = city.lights.slice();
    for (let i = 0; i < 260; i++) lights.push([r(), 0.78 + r() * 0.21, 0.6 + r() * 0.5, n1(r() * 6.28)]);
    DW.cityLights.heroNear = { lights, cw: 2600, ch: 600, view: [0, 190, 2600, 410] };
    return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 190 2600 410" preserveAspectRatio="xMidYMax meet" aria-hidden="true">${city.svg}</svg>`;
  };
  A.make.heroDiyas = function () {
    const p = 'hd';
    let s = '';
    const back = 13, front = 8;
    for (let i = 0; i < back; i++) s += A.diya(n1(60 + i * (1480 / (back - 1))), 120, 0.5, p, { glow: 60, d: n1((i * 0.37) % 2) });
    for (let i = 0; i < front; i++) {
      const x = n1(i < 4 ? 40 + i * 110 : 1160 + (i - 4) * 120 + 20);
      s += A.diya(x, 205 - (i % 2) * 8, n1(0.95 - (i % 2) * 0.1), p, { glow: 100, d: n1((i * 0.53) % 2) });
    }
    return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1600 240" preserveAspectRatio="xMidYMax slice" aria-hidden="true"><defs>${A.defs(p)}</defs>${s}</svg>`;
  };
  A.make.heroRangoli = function () {
    return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="-200 -200 400 400" aria-hidden="true">${A.mandala('hr')}</svg>`;
  };
  A.make.heroMandalaBack = function () {
    return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="-200 -200 400 400" aria-hidden="true">${A.mandala('hb', { pal: ['#ffd36b', '#ffb347', '#ffe9a8', '#ff9a2e', '#ffd36b'] })}</svg>`;
  };

  /* ============ FINALE CITY (lights drawn on canvas in JS) ============ */
  A.make.finaleCity = function () {
    const city = A.city({ w: 2600, h: 640, seed: 91, hs: 0.62, fill: '#0b0620', trim: 'rgba(255,205,130,.45)', win: '#ffd36b', accent: '#ffb02e' });
    const r = A.rng(99), lights = city.lights.slice();
    // thousands of extra diyas: roof lines, steps, courtyards, riverbank
    for (let i = 0; i < 1500; i++) lights.push([r(), 0.7 + r() * 0.29, 0.55 + r() * 0.5, n1(r() * 6.28)]);
    DW.cityLights.finale = { lights, cw: 2600, ch: 640, view: [0, 20, 2600, 620] };
    return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 20 2600 620" preserveAspectRatio="xMidYMax meet" aria-hidden="true">${city.svg}</svg>`;
  };
})();
