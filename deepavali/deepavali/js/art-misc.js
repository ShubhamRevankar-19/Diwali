/* =========================================================
   Deepavali — five days, gallery, decorations (original SVG art)
   ========================================================= */
(function () {
  'use strict';
  const DW = window.DW, A = DW.art, n1 = A.n1;
  const svg = (vb, body, extra) => `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${vb}" preserveAspectRatio="xMidYMid slice" role="img" ${extra || ''}>${body}</svg>`;
  const grad = (id, stops, vert) =>
    `<linearGradient id="${id}" x1="0" y1="0" x2="${vert === false ? 1 : 0}" y2="${vert === false ? 0 : 1}">${stops.map((s) => `<stop offset="${s[0]}" stop-color="${s[1]}"/>`).join('')}</linearGradient>`;
  const rad = (id, c0, c1, o0, o1) => `<radialGradient id="${id}"><stop offset="0" stop-color="${c0}" stop-opacity="${o0 == null ? 1 : o0}"/><stop offset="1" stop-color="${c1 || c0}" stop-opacity="${o1 == null ? 0 : o1}"/></radialGradient>`;

  /* top-down diya for thali compositions */
  A.diyaTop = function (x, y, s, p) {
    return `<g transform="translate(${x} ${y}) scale(${s})"><circle r="70" fill="url(#${p}glow)"/><circle r="30" fill="url(#${p}clay)"/><circle r="24" fill="#c9672a"/><circle r="19" fill="#f2b74f"/><path d="M-30 -2 Q-44 -8 -42 -18 Q-34 -10 -26 -10Z" fill="#c9672a"/><g class="fl"><path d="M0 4 C-8 -4 -5 -16 0 -30 C5 -16 8 -4 0 4Z" fill="url(#${p}flame)"/></g></g>`;
  };

  const marigold = (x, y, s, c1, c2) => {
    let g = `<g transform="translate(${x} ${y}) scale(${s})">`;
    for (let i = 0; i < 10; i++) {
      const a = (i / 10) * 6.283;
      g += `<circle cx="${n1(Math.cos(a) * 7)}" cy="${n1(Math.sin(a) * 7)}" r="5.2" fill="${i % 2 ? c1 : c2}"/>`;
    }
    return g + `<circle r="5" fill="#b3520a"/></g>`;
  };

  /* ============ THE FIVE DAYS ============ */
  A.make.day1 = function () {
    const p = 'd1';
    let coins = '';
    [[-84, 74], [-62, 84], [-38, 78], [40, 82], [66, 76], [88, 84], [14, 90], [-14, 92]].forEach((c, i) => (coins += `<g transform="translate(${c[0]} ${c[1]})"><ellipse rx="13" ry="5.5" fill="#a9611a"/><ellipse cy="-2" rx="13" ry="5.5" fill="url(#${p}gold)"/><ellipse cy="-2" rx="8" ry="3" fill="none" stroke="#a9611a" stroke-width="1"/></g>`));
    let leaves = '';
    [-62, -36, -12, 12, 36, 62].forEach((a) => (leaves += `<path transform="rotate(${a} 0 -90)" d="M0 -90 C14 -112 12 -138 0 -158 C-12 -138 -14 -112 0 -90Z" fill="#2f9e5a"/>`));
    return svg('0 0 300 300', `<defs>${A.defs(p)}${rad(p + 'bg', '#5a2a8a', '#150a30', 1, 1)}</defs>
<rect width="300" height="300" fill="url(#${p}bg)"/><g opacity=".22" transform="translate(150 150) scale(.8)">${A.mandala(p + 'm', {})}</g>
<g transform="translate(150 196)"><circle cy="-60" r="130" fill="url(#${p}glow)" opacity=".55"/>
${leaves}<circle cy="-132" r="14" fill="#7a4a1a"/><circle cy="-132" r="14" fill="none" stroke="#c9a05a" stroke-width="2"/>
<path d="M-30 -62 L-24 -88 L24 -88 L30 -62Z" fill="url(#${p}gold)"/><ellipse cy="-88" rx="26" ry="7" fill="#fff1b8"/>
<path d="M-52 -62 C-92 -38 -86 42 -42 66 L42 66 C86 42 92 -38 52 -62Z" fill="url(#${p}gold)"/>
<path d="M-62 -14 Q0 6 62 -14" fill="none" stroke="#a9611a" stroke-width="3"/><path d="M-66 14 Q0 36 66 14" fill="none" stroke="#a9611a" stroke-width="2" stroke-dasharray="3 6"/>
<circle cx="0" cy="-30" r="12" fill="#e0457b"/><circle cx="0" cy="-30" r="6" fill="#fff1b8"/>
${coins}</g>
${A.diya(52, 262, 0.55, p, { glow: 60 })}${A.diya(250, 264, 0.5, p, { glow: 54, d: 0.7 })}
${A.sparkle(70, 70, 10, '#fff4c2', 'tw')}${A.sparkle(236, 96, 12, '#fff4c2', 'tw')}${A.sparkle(210, 40, 7, '#fff4c2', 'tw')}`);
  };

  A.make.day2 = function () {
    const p = 'd2';
    let teeth = '';
    for (let i = 0; i < 16; i++) teeth += `<path transform="rotate(${i * 22.5})" d="M-6 -40 L0 -64 L6 -40Z" fill="#ffe08a"/>`;
    let rays = '';
    for (let i = 0; i < 14; i++) rays += `<path transform="rotate(${i * (180 / 13) - 180})" d="M0 0 L-8 -190 L8 -190Z"/>`;
    return svg('0 0 300 300', `<defs>${A.defs(p)}${grad(p + 'sky', [[0, '#1a1050'], [0.55, '#8a3a7a'], [1, '#ff9a5a']])}</defs>
<rect width="300" height="300" fill="url(#${p}sky)"/>${A.stars(9, 30, 300, 0, 130, 6)}
<g transform="translate(150 214)"><circle r="130" fill="url(#${p}glow)" opacity=".8"/><g fill="#fff3c2" opacity=".2" class="spin-slow">${rays}</g><path d="M-62 0 A62 62 0 0 1 62 0Z" fill="url(#${p}gold)"/></g>
<g transform="translate(0 0)" fill="#0a0618"><path d="M0 300 V226 H30 V196 L38 184 L46 196 V210 H76 V176 L86 160 L96 176 V204 H120 V222 H178 V200 H196 V170 L208 150 L220 170 V200 H250 V180 L262 164 L274 180 V230 H300 V300Z"/>
 <path d="M104 222 V212 a12 12 0 0 1 24 0 V222Z" fill="#ffcf6a" opacity=".7"/></g>
<g transform="translate(150 98)"><circle r="76" fill="url(#${p}glow)" opacity=".6"/><g class="spin-slow">${teeth}<circle r="42" fill="none" stroke="#ffe08a" stroke-width="5"/><circle r="30" fill="none" stroke="#f5c04a" stroke-width="2.5"/></g><circle r="9" fill="#fff3c2"/></g>
${A.diya(150, 280, 0.55, p, { glow: 60 })}`);
  };

  /* Lakshmi on lotus with elephants — reusable for card + gallery */
  A.lakshmiGroup = function (p) {
    const ele = (flip) => `<g transform="scale(${flip} 1)" fill="#8a96b8" stroke="#dfe6ff" stroke-opacity=".5" stroke-width="1.2"><ellipse cx="0" cy="-20" rx="34" ry="24"/><circle cx="30" cy="-44" r="17"/><path d="M40 -52 Q64 -40 58 -6 Q56 6 48 4 Q54 -6 52 -30 Q44 -40 38 -40Z"/><path d="M-4 -10 V16 M12 -6 V16 M-22 -8 V16 M26 -8 V16" stroke="#8a96b8" stroke-width="9" stroke-linecap="round"/><path d="M26 -52 Q10 -66 8 -46 Q18 -40 26 -42Z" fill="#6a7698"/><path d="M42 -34 Q52 -26 56 -34" stroke="#fff" fill="none"/><path d="M-8 -42 Q8 -50 18 -40" fill="#e0457b" stroke="none"/></g>`;
    return `<circle cy="-150" r="230" fill="url(#${p}glow)" opacity=".7"/>
<g transform="translate(0 -186)"><circle r="104" fill="none" stroke="#ffe08a" stroke-width="2.5" opacity=".8"/><g class="spin-slow" opacity=".9">${Array.from({ length: 24 }, (_, i) => `<path transform="rotate(${i * 15})" d="M0 -104 L5 -122 L-5 -122Z" fill="#ffe08a"/>`).join('')}</g></g>
<g transform="translate(-124 14)">${ele(1)}</g><g transform="translate(124 14)">${ele(-1)}</g>
${A.lotus(0, 8, 1.55, p, { glow: 0 })}
<g transform="translate(0 -26)"><path d="M-46 0 Q-62 -50 -28 -108 L28 -108 Q62 -50 46 0Z" fill="#c4284a"/><path d="M-46 0 Q0 -22 46 0 L40 14 Q0 -6 -40 14Z" fill="#f5c04a"/>
<path d="M-28 -108 Q0 -92 28 -108 L22 -60 Q0 -48 -22 -60Z" fill="#e8527a"/><path d="M-20 -100 Q0 -82 20 -100" stroke="#ffe08a" stroke-width="3" fill="none"/>
<path d="M-26 -104 Q-80 -92 -78 -52" stroke="#e8a37a" stroke-width="12" fill="none" stroke-linecap="round"/><path d="M26 -104 Q80 -92 78 -52" stroke="#e8a37a" stroke-width="12" fill="none" stroke-linecap="round"/>
<g transform="translate(-80 -44) scale(.55)">${A.lotus(0, 0, 0.7, p, {})}</g><g transform="translate(80 -44) scale(.55)">${A.lotus(0, 0, 0.7, p, {})}</g>
<path d="M-60 -90 Q-100 -70 -96 -20" stroke="#e8a37a" stroke-width="10" fill="none" stroke-linecap="round"/><path d="M60 -90 Q100 -70 96 -20" stroke="#e8a37a" stroke-width="10" fill="none" stroke-linecap="round"/>
<path d="M-96 -20 q-6 14 4 24 M96 -20 q6 14 -4 24" stroke="#ffd36b" stroke-width="3" fill="none"/>
<circle cy="-128" r="22" fill="#eab08a"/><path d="M-22 -134 Q0 -170 22 -134 Q0 -150 -22 -134Z" fill="#1a0a14"/>
<path d="M-22 -140 L-18 -170 L-8 -154 L0 -180 L8 -154 L18 -170 L22 -140Z" fill="url(#${p}gold)" stroke="#fff1b8" stroke-width="1"/><circle cx="-7" cy="-128" r="1.8" fill="#3a1a14"/><circle cx="7" cy="-128" r="1.8" fill="#3a1a14"/><path d="M-5 -118 Q0 -114 5 -118" stroke="#a02a3a" fill="none" stroke-width="1.6"/><circle cy="-136" r="2" fill="#e0301a"/></g>`;
  };
  A.coinRain = function (seed, n, w, h) {
    const r = A.rng(seed);
    let s = '';
    for (let i = 0; i < n; i++) s += `<g class="coin" style="animation-delay:${n1(r() * 6)}s;animation-duration:${n1(4 + r() * 4)}s" transform="translate(${n1(r() * w)} ${n1(-20)})"><ellipse rx="7" ry="7" fill="#f5c04a" stroke="#fff1b8" stroke-width="1.2"/><ellipse rx="3.6" ry="3.6" fill="none" stroke="#a9611a"/></g>`;
    return s;
  };
  A.make.day3 = function () {
    const p = 'd3';
    return svg('0 0 300 300', `<defs>${A.defs(p)}${grad(p + 'bg', [[0, '#2a0a50'], [1, '#6a1a5a']])}</defs>
<rect width="300" height="300" fill="url(#${p}bg)"/><g opacity=".18" transform="translate(150 140) scale(.8)">${A.mandala(p + 'm')}</g>
<g transform="translate(150 282) scale(.74)">${A.lakshmiGroup(p)}</g>${A.coinRain(3, 12, 300, 300)}
${A.diya(48, 284, 0.5, p, { glow: 50 })}${A.diya(252, 284, 0.5, p, { glow: 50, d: 0.5 })}`);
  };

  A.make.day4 = function () {
    const p = 'd4';
    let rain = '';
    const r = A.rng(4);
    for (let i = 0; i < 38; i++) rain += `<path class="rain" style="animation-delay:${n1(r() * 1.5)}s" d="M${n1(r() * 300)} ${n1(40 + r() * 120)} l-6 18" stroke="#9fb6ff" stroke-opacity=".6" stroke-width="1.6" stroke-linecap="round"/>`;
    const cow = (x, y, s) => `<g transform="translate(${x} ${y}) scale(${s})" fill="#f4e6cc"><ellipse cy="-14" rx="20" ry="10"/><circle cx="21" cy="-20" r="7"/><path d="M26 -28 l4 -6 M20 -28 l-2 -6" stroke="#f4e6cc" stroke-width="2"/><path d="M-12 -6 V6 M-2 -5 V6 M8 -5 V6 M16 -6 V6" stroke="#f4e6cc" stroke-width="3"/><circle cx="-4" cy="-16" r="4" fill="#a8744a"/></g>`;
    return svg('0 0 300 300', `<defs>${A.defs(p)}${grad(p + 'sky', [[0, '#101a4a'], [1, '#3a3a7a']])}${grad(p + 'mt', [[0, '#6a5a9a'], [1, '#2a1f5a']])}</defs>
<rect width="300" height="300" fill="url(#${p}sky)"/>
<path d="M0 60 Q70 20 140 50 T300 40 V80 H0Z" fill="#0d1236"/>${A.cloud(60, 56, 0.8, '#1a2050', 0.95)}${A.cloud(230, 50, 0.9, '#1a2050', 0.95)}${rain}
<g class="lift"><path d="M20 190 Q60 60 150 56 Q240 60 280 190Z" fill="url(#${p}mt)" stroke="#c9b8ff" stroke-opacity=".5" stroke-width="1.5"/>
<path d="M70 120 Q110 100 150 112 M110 150 Q160 130 210 150" stroke="#9a8ad0" stroke-opacity=".5" fill="none" stroke-width="2"/>
<g transform="translate(212 108)"><path d="M0 0 C-8 -22 14 -34 20 -10 C14 0 6 4 0 0Z" fill="#1fa88a"/><circle cx="12" cy="-12" r="6" fill="#2a4aaa"/><circle cx="12" cy="-12" r="2.6" fill="#7ad0ff"/><path d="M-2 4 Q-20 24 -34 32" stroke="#1fa88a" stroke-width="2" fill="none"/></g></g>
<g transform="translate(150 206)"><circle cy="-14" r="60" fill="url(#${p}glow)" opacity=".5"/><path d="M-26 40 Q-34 6 -22 -6 L-16 -30 Q-14 -40 -8 -30 L-6 -10 L-2 -34 Q2 -42 6 -34 L6 -10 L10 -28 Q14 -34 17 -28 L16 -6 L20 -18 Q26 -22 26 -14 L22 14 Q22 30 14 40Z" fill="#e8b48a" stroke="#fff1d0" stroke-opacity=".5" stroke-width="1"/><path d="M26 -14 Q36 -34 32 -50" stroke="#e8b48a" stroke-width="10" stroke-linecap="round" fill="none" transform="translate(-52 6) rotate(-4)" opacity="0"/></g>
${cow(52, 276, 1.2)}${cow(104, 284, 0.9)}${cow(240, 278, 1.1)}${A.diya(196, 280, 0.45, p, { glow: 44 })}`);
  };

  A.make.day5 = function () {
    const p = 'd5';
    return svg('0 0 300 300', `<defs>${A.defs(p)}${grad(p + 'bg', [[0, '#2a0a46'], [1, '#7a2a4a']])}</defs>
<rect width="300" height="300" fill="url(#${p}bg)"/><g opacity=".2" transform="translate(150 130) scale(.75)">${A.mandala(p + 'm')}</g>
<circle cx="150" cy="170" r="130" fill="url(#${p}glow)" opacity=".4"/>
${A.figure({ x: 76, y: 262, s: 1.7, kind: 'sita', p, c: '#3a0f2a', rimOp: 0.9 })}
${A.figure({ x: 224, y: 262, s: 1.75, kind: 'lakshmana', p, bow: false, c: '#14102e', rimOp: 0.9 })}
<path d="M98 196 Q150 170 204 168" stroke="#e8a37a" stroke-width="7" fill="none" stroke-linecap="round" opacity="0"/>
<circle cx="224" cy="102" r="2.8" fill="#ff3a2a"/>
<g transform="translate(150 218)"><ellipse rx="48" ry="12" fill="url(#${p}gold)" stroke="#fff1b8"/><ellipse cy="-2" rx="38" ry="8" fill="#a9611a" opacity=".5"/>${A.diya(0, -4, 0.6, p, { glow: 70 })}${marigold(-30, -6, 0.6, '#ffb02e', '#ff7a1a')}${marigold(32, -6, 0.6, '#ffb02e', '#ff7a1a')}<circle cx="-14" cy="-2" r="4" fill="#e0301a"/><circle cx="16" cy="-2" r="4" fill="#fff1b8"/></g>
${A.sparkle(150, 60, 11, '#fff4c2', 'tw')}${A.sparkle(70, 80, 7, '#fff4c2', 'tw')}${A.sparkle(240, 66, 8, '#fff4c2', 'tw')}`);
  };

  /* ============ GALLERY ============ */
  A.make.g1 = function () {
    const p = 'g1', r = A.rng(12);
    let diyas = '', toran = '', stepsD = '';
    for (let i = 0; i < 12; i++) diyas += A.diya(n1(86 + i * 39), 262, 0.3, p, { glow: 38, d: n1(r() * 2) });
    for (let i = 0; i < 6; i++) stepsD += A.diya(n1(140 + i * 64), 744, 0.45, p, { glow: 50, d: n1(r() * 2) });
    for (let i = 0; i <= 9; i++) {
      const t = i / 9, x = 190 + t * 220, y = 470 + Math.sin(t * Math.PI) * 28;
      toran += marigold(n1(x), n1(y), 0.9, i % 2 ? '#ffb02e' : '#ff8a1a', i % 2 ? '#ff8a1a' : '#ffd36b');
    }
    let wins = '';
    [[150, 330], [420, 330], [150, 430], [420, 430]].forEach((w, i) => (wins += `<path d="M${w[0]} ${w[1] + 70} V${w[1] + 20} a30 30 0 0 1 60 0 V${w[1] + 70}Z" fill="#ffcf6a" opacity=".9"/><path d="M${w[0] + 30} ${w[1] - 10} V${w[1] + 70} M${w[0]} ${w[1] + 36} H${w[0] + 60}" stroke="#5a2a1a" stroke-width="3"/>${A.diya(w[0] + 30, w[1] + 84, 0.28, p, { glow: 34, d: i * 0.4 })}`));
    return svg('0 0 600 800', `<defs>${A.defs(p)}${grad(p + 'sky', [[0, '#080a2e'], [1, '#2a1a5a']])}${grad(p + 'wall', [[0, '#7a3a4a'], [1, '#3a1a34']])}</defs>
<rect width="600" height="800" fill="url(#${p}sky)"/>${A.stars(31, 60, 600, 0, 200, 10)}<circle cx="480" cy="90" r="40" fill="#fff3d0"/><circle cx="480" cy="90" r="120" fill="url(#${p}glowW)" opacity=".5"/>
<path d="M0 300 H600 V800 H0Z" fill="#14082a"/>
<rect x="70" y="290" width="460" height="460" fill="url(#${p}wall)"/>
<path d="M60 290 H540 V272 H60Z" fill="#4a2038"/>${Array.from({ length: 16 }, (_, i) => `<path d="M${64 + i * 30} 272 q14 -26 28 0Z" fill="#4a2038"/>`).join('')}
<path d="M270 290 V230 Q300 170 330 230 V290Z" fill="#4a2038"/><path d="M296 170 V150 m0 0 q-8 -10 0 -22 q8 12 0 22" stroke="#ffb02e" stroke-width="3" fill="#ff8a1a"/>
${diyas}${wins}
<path d="M230 750 V570 a70 70 0 0 1 140 0 V750Z" fill="#2a0e22"/><path d="M246 750 V572 a54 54 0 0 1 108 0 V750Z" fill="#ffcf6a" opacity=".92"/><path d="M300 520 V750 M246 620 H354" stroke="#8a4a1a" stroke-width="4"/>
<circle cx="300" cy="640" r="260" fill="url(#${p}glow)" opacity=".28"/>
<path d="M190 470 Q300 520 410 470" stroke="#2f9e5a" stroke-width="3" fill="none"/>${toran}
<g opacity=".9" transform="translate(300 790) scale(.46 .18)">${A.mandala(p + 'm')}</g>
${stepsD}${A.diya(60, 780, 0.5, p, { glow: 50 })}${A.diya(540, 780, 0.5, p, { glow: 50, d: 1 })}`);
  };

  A.make.g2 = function () {
    const p = 'g2';
    let ring = '';
    for (let i = 0; i < 20; i++) {
      const a = (i / 20) * 6.283;
      ring += A.diya(n1(Math.cos(a) * 276), n1(Math.sin(a) * 276 + 14), 0.4, p, { glow: 44, d: n1((i * 0.31) % 2) });
    }
    return svg('-300 -300 600 600', `<defs>${A.defs(p)}${rad(p + 'fl', '#3a2a4a', '#0e0818', 1, 1)}</defs>
<rect x="-300" y="-300" width="600" height="600" fill="url(#${p}fl)"/>
<g fill="none" stroke="#fff" stroke-opacity=".04">${Array.from({ length: 10 }, (_, i) => `<circle r="${40 + i * 30}"/>`).join('')}</g>
<g transform="scale(1.22)">${A.mandala(p + 'm')}</g>${ring}`);
  };

  A.make.g3 = function () {
    const p = 'g3';
    const city = A.city({ w: 900, h: 280, seed: 5, fill: '#120a2a', trim: 'rgba(255,200,120,.4)', win: '#ffcf6a' });
    let road = '';
    for (let i = 0; i < 18; i++) {
      const t = i / 17;
      road += A.diya(n1(40 + t * 420 + t * t * 120), n1(500 - t * 170 - t * t * 40), n1(0.62 - t * 0.38), p, { glow: 52, d: n1((i * 0.23) % 2) });
    }
    return svg('0 0 800 520', `<defs>${A.defs(p)}${grad(p + 'sky', [[0, '#0a0c36'], [0.6, '#4a2a7a'], [1, '#e0709a']])}</defs>
<rect width="800" height="520" fill="url(#${p}sky)"/>${A.stars(44, 60, 800, 0, 250, 10)}
<path d="M0 360 Q200 300 420 350 T800 330 V520 H0Z" fill="#1a1040"/>
<g transform="${A.cityT(900, 280, 560, 404, 0.4)}"><circle cx="450" cy="200" r="520" fill="url(#${p}glow)" opacity=".5"/>${city.svg}${A.lightsDots(city.lights, 900, 280, '#ffe08a', 7)}</g>
<path d="M0 520 L0 470 Q300 380 520 400 Q700 410 800 380 L800 520Z" fill="#0b0620"/>
<g opacity=".5"><path d="M40 505 Q300 430 560 410" stroke="#ffd98a" stroke-width="28" fill="none" stroke-opacity=".18" stroke-linecap="round"/></g>${road}
<g class="float">${A.pushpaka(250, 160, 0.52, p, { riders: true })}</g>
${A.crowd(5, 60, 360, 516, p, 5, [0.7, 0.95])}`);
  };

  A.make.g4 = function () {
    const p = 'g4';
    const city = A.city({ w: 1200, h: 500, seed: 66, fill: '#150a28', trim: 'rgba(255,215,140,.5)', win: '#ffd36b', accent: '#ffb02e' });
    const lights = A.lightsDots(city.lights, 1200, 500, '#ffe08a', 6);
    const T = A.cityT(1200, 500, 300, 560, 0.55);
    return svg('0 0 600 720', `<defs>${A.defs(p)}${grad(p + 'sky', [[0, '#08093a'], [0.7, '#3a1a6a'], [1, '#c8506a']])}${grad(p + 'wat', [[0, '#3a1a50'], [1, '#08041a']])}
<clipPath id="${p}c"><rect x="0" y="0" width="600" height="720"/></clipPath></defs>
<rect width="600" height="720" fill="url(#${p}sky)"/>${A.stars(56, 60, 600, 0, 260, 8)}
<g clip-path="url(#${p}c)"><g transform="${T}"><circle cx="600" cy="300" r="700" fill="url(#${p}glow)" opacity=".4"/>${city.svg}${lights}</g>
<rect y="560" width="600" height="160" fill="url(#${p}wat)"/>
<g transform="translate(0 1120) scale(1 -1)" opacity=".32"><g transform="${T}">${city.svg}${lights}</g></g>
<rect y="560" width="600" height="160" fill="url(#${p}wat)" opacity=".55"/>
${Array.from({ length: 14 }, (_, i) => `<path class="shm" style="animation-delay:${i * 0.3}s" d="M${40 + ((i * 97) % 520)} ${580 + ((i * 53) % 130)} h${30 + (i % 4) * 14}" stroke="#ffe3a0" stroke-opacity=".4" stroke-width="2" stroke-linecap="round"/>`).join('')}</g>
${Array.from({ length: 7 }, (_, i) => A.diya(n1(70 + i * 76), 576 + (i % 2) * 6, 0.34, p, { glow: 46, d: i * 0.3 })).join('')}`);
  };

  A.make.g5 = function () {
    const p = 'g5';
    return svg('0 0 600 800', `<defs>${A.defs(p)}${grad(p + 'bg', [[0, '#1a0840'], [1, '#6a1a5a']])}${rad(p + 'pond', '#4a2a8a', '#150a30', 1, 1)}</defs>
<rect width="600" height="800" fill="url(#${p}bg)"/><g opacity=".14" transform="translate(300 300) scale(1.45)">${A.mandala(p + 'm')}</g>${A.stars(21, 40, 600, 0, 300, 8)}
<ellipse cx="300" cy="730" rx="320" ry="60" fill="url(#${p}pond)"/>
<g transform="translate(300 720) scale(1.28)">${A.lakshmiGroup(p)}</g>${A.coinRain(8, 24, 600, 800)}
${A.diya(70, 770, 0.7, p, { glow: 70 })}${A.diya(530, 770, 0.7, p, { glow: 70, d: 0.8 })}`);
  };

  A.make.g6 = function () {
    const p = 'g6', cols = ['#ffd36b', '#ff7aa8', '#7ad0ff', '#ff9a4a', '#b08aff', '#7affc0'];
    const r = A.rng(6);
    let fw = '';
    [[160, 150, 130], [400, 90, 110], [610, 190, 150], [270, 260, 80], [700, 90, 90], [480, 280, 70]].forEach((b, i) => (fw += A.burst(b[0], b[1], b[2], cols[i], 20 + (i % 3) * 4, 10 + i)));
    return svg('0 0 800 500', `<defs>${A.defs(p)}${A.burstDefs(cols)}${grad(p + 'sky', [[0, '#04041c'], [1, '#2a1250']])}</defs>
<rect width="800" height="500" fill="url(#${p}sky)"/>${A.stars(1, 70, 800, 0, 300, 10)}${fw}
<g transform="translate(0 340)">${A.farCity({ w: 800, h: 160, seed: 3, fill: '#080414' })}</g>
<rect y="440" width="800" height="60" fill="#0a0620"/>${Array.from({ length: 20 }, (_, i) => `<path class="shm" style="animation-delay:${n1(r() * 4)}s" d="M${n1(r() * 760)} ${n1(450 + r() * 40)} h${n1(20 + r() * 40)}" stroke="${cols[i % 6]}" stroke-opacity=".5" stroke-width="2" stroke-linecap="round"/>`).join('')}`);
  };

  A.make.g7 = function () {
    const p = 'g7', r = A.rng(70);
    let diyas = '', sweets = '', petals = '', bulbs = '';
    for (let i = 0; i < 8; i++) {
      const a = (i / 8) * 6.283;
      diyas += A.diyaTop(n1(300 + Math.cos(a) * 160), n1(290 + Math.sin(a) * 160), 0.78, p);
    }
    for (let i = 0; i < 7; i++) {
      const a = r() * 6.283, rr = r() * 54;
      sweets += `<circle cx="${n1(300 + Math.cos(a) * rr)}" cy="${n1(290 + Math.sin(a) * rr)}" r="14" fill="#ff9a2e" stroke="#c9671a" stroke-width="2"/><circle cx="${n1(296 + Math.cos(a) * rr)}" cy="${n1(285 + Math.sin(a) * rr)}" r="4" fill="#ffd9a0" opacity=".7"/>`;
    }
    for (let i = 0; i < 26; i++) petals += marigold(n1(300 + (r() - 0.5) * 150), n1(290 + (r() - 0.5) * 150), n1(0.7 + r() * 0.4), '#ffb02e', '#ff7a1a');
    for (let i = 0; i <= 12; i++) {
      const t = i / 12, x = n1(20 + t * 560), y = n1(34 + Math.sin(t * Math.PI) * 40);
      bulbs += `<circle cx="${x}" cy="${y}" r="26" fill="url(#${p}glow)" opacity=".7"/><circle cx="${x}" cy="${y}" r="5" fill="${['#ffd36b', '#ff7aa8', '#7ad0ff', '#7affc0'][i % 4]}" class="tw" style="animation-delay:${n1(r() * 2)}s"/>`;
    }
    return svg('0 0 600 520', `<defs>${A.defs(p)}${rad(p + 'cl', '#5a1a5a', '#1a0630', 1, 1)}${rad(p + 'th', '#ffe08a', '#a9611a', 1, 1)}</defs>
<rect width="600" height="520" fill="url(#${p}cl)"/><g opacity=".12" stroke="#ffd36b" fill="none">${Array.from({ length: 9 }, (_, i) => `<path d="M0 ${i * 70} q75 -40 150 0 t150 0 t150 0 t150 0"/>`).join('')}</g>
<path d="M20 34 Q300 130 580 34" stroke="#c9a05a" stroke-width="2" fill="none"/>${bulbs}
<circle cx="300" cy="290" r="214" fill="#6a3a14"/><circle cx="300" cy="290" r="208" fill="url(#${p}th)"/><circle cx="300" cy="290" r="196" fill="none" stroke="#a9611a" stroke-width="3"/><circle cx="300" cy="290" r="110" fill="none" stroke="#a9611a" stroke-width="2" stroke-dasharray="4 8"/>
${diyas}${petals}${sweets}`);
  };

  A.make.g8 = function () {
    const p = 'g8', r = A.rng(80);
    const cols = [['#ffb02e', '#ff6a00'], ['#ff7aa8', '#c0307a'], ['#7ad0ff', '#2a6ad0'], ['#ffd36b', '#e08a1a'], ['#b08aff', '#6a3ad0'], ['#7affc0', '#1aa86a']];
    const lantern = (x, y, s, ci, d) => {
      const [c0, c1] = cols[ci];
      let pts = '';
      for (let i = 0; i < 16; i++) {
        const a = (i / 16) * 6.283 - 1.5708, rr = i % 2 ? 30 : 62;
        pts += `${n1(Math.cos(a) * rr)},${n1(Math.sin(a) * rr)} `;
      }
      return `<g transform="translate(${x} ${y}) scale(${s})"><g class="sway" style="animation-delay:${d}s;transform-origin:0px ${n1(-y / s)}px"><path d="M0 -${n1(y / s)} V-62" stroke="#c9a05a" stroke-width="1.6"/><circle r="130" fill="url(#${p}glow)" opacity=".6"/>
<polygon points="${pts}" fill="url(#${p}l${ci})" stroke="#fff1b8" stroke-opacity=".7" stroke-width="1.5"/><circle r="20" fill="#fff4c2" opacity=".85"/><circle r="40" fill="none" stroke="#fff1b8" stroke-opacity=".5" stroke-width="1.2" stroke-dasharray="3 5"/>
<path d="M0 62 V92 M-10 62 L-14 88 M10 62 L14 88" stroke="${c0}" stroke-width="2.4"/><circle cy="96" r="4.4" fill="${c0}"/><circle cx="-14" cy="92" r="3.4" fill="${c0}"/><circle cx="14" cy="92" r="3.4" fill="${c0}"/></g></g>`;
    };
    let bokeh = '';
    for (let i = 0; i < 26; i++) bokeh += `<circle cx="${n1(r() * 600)}" cy="${n1(r() * 760)}" r="${n1(6 + r() * 26)}" fill="${cols[i % 6][0]}" opacity="${n1(0.05 + r() * 0.1)}"/>`;
    return svg('0 0 600 760', `<defs>${A.defs(p)}${grad(p + 'bg', [[0, '#05062a'], [1, '#2a1250']])}${cols.map((c, i) => grad(p + 'l' + i, [[0, c[0]], [1, c[1]]])).join('')}</defs>
<rect width="600" height="760" fill="url(#${p}bg)"/>${bokeh}<path d="M0 0 H600" stroke="#c9a05a" stroke-width="3"/>
${lantern(110, 210, 1.0, 0, 0)}${lantern(300, 330, 1.45, 1, 0.6)}${lantern(500, 190, 0.9, 2, 1.2)}${lantern(210, 560, 0.85, 3, 0.3)}${lantern(430, 600, 1.1, 4, 0.9)}${lantern(70, 500, 0.6, 5, 1.5)}${lantern(540, 420, 0.62, 0, 0.2)}`);
  };

  /* ============ DECOR (interactive) ============ */
  A.make.decorLantern = function () {
    const p = 'dl';
    let pts = '';
    for (let i = 0; i < 16; i++) { const a = (i / 16) * 6.283 - 1.5708, rr = i % 2 ? 26 : 54; pts += `${n1(Math.cos(a) * rr)},${n1(Math.sin(a) * rr)} `; }
    return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 160 220" aria-hidden="true"><defs>${A.defs(p)}${grad(p + 'g', [[0, '#ffd36b'], [1, '#ff6a00']])}</defs>
<g class="swing" style="transform-origin:80px 6px"><path d="M80 0 V50" stroke="#c9a05a" stroke-width="2"/><g transform="translate(80 104)"><circle class="dec-glow" r="100" fill="url(#${p}glow)" opacity=".35"/><polygon points="${pts}" fill="url(#${p}g)" stroke="#fff1b8" stroke-opacity=".8" stroke-width="1.5"/><circle r="17" fill="#fff4c2" opacity=".9"/><circle r="34" fill="none" stroke="#fff1b8" stroke-opacity=".5" stroke-dasharray="3 5"/><path d="M0 54 V84 M-9 54 L-12 80 M9 54 L12 80" stroke="#ffd36b" stroke-width="2.4"/><circle cy="88" r="4" fill="#ffd36b"/><circle cx="-12" cy="84" r="3" fill="#ffd36b"/><circle cx="12" cy="84" r="3" fill="#ffd36b"/></g></g></svg>`;
  };
  A.make.decorBell = function () {
    const p = 'db';
    return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 160 220" aria-hidden="true"><defs>${A.defs(p)}</defs>
<g class="swing" style="transform-origin:80px 6px"><path d="M80 0 V44" stroke="#c9a05a" stroke-width="2.4"/><circle cx="80" cy="46" r="7" fill="none" stroke="#f5c04a" stroke-width="3"/>
<path d="M80 54 C46 54 38 96 30 140 L130 140 C122 96 114 54 80 54Z" fill="url(#${p}goldH)" stroke="#fff1b8" stroke-width="1.5"/>
<path d="M44 108 Q80 120 116 108 M38 128 Q80 142 122 128" stroke="#a9611a" stroke-width="2.4" fill="none"/><ellipse cx="80" cy="141" rx="52" ry="8" fill="#f5c04a" stroke="#fff1b8"/>
<g class="clap"><circle cx="80" cy="154" r="8" fill="#b9731c"/></g></g>
<circle class="ring r1" cx="80" cy="130" r="30" fill="none" stroke="#ffe08a" stroke-width="2" opacity="0"/><circle class="ring r2" cx="80" cy="130" r="30" fill="none" stroke="#ffe08a" stroke-width="2" opacity="0"/></svg>`;
  };
  A.make.decorMarigold = function () {
    let g = '';
    for (let i = 0; i < 7; i++) {
      const t = i / 6, x = 20 + t * 120, y = 70 + Math.sin(t * Math.PI) * 52;
      g += marigold(n1(x), n1(y), 1.35, i % 2 ? '#ffb02e' : '#ff8a1a', i % 2 ? '#ff8a1a' : '#ffd36b');
    }
    return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 160 220" aria-hidden="true"><path d="M8 40 Q80 170 152 40" stroke="#2f9e5a" stroke-width="3" fill="none" opacity="0"/>
<g class="garland"><path d="M14 66 Q80 188 146 66" stroke="#2f9e5a" stroke-width="3" fill="none"/>${g}</g><path d="M14 50 V68 M146 50 V68" stroke="#c9a05a" stroke-width="3"/></svg>`;
  };
  A.make.decorSparkler = function () {
    const p = 'ds';
    return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 160 220" aria-hidden="true"><defs>${A.defs(p)}</defs>
<g transform="rotate(14 80 210)"><rect x="77.5" y="64" width="5" height="150" rx="2" fill="#6a6a78"/><rect x="76" y="66" width="8" height="92" rx="3" fill="#3a3a48"/><path d="M80 200 v10" stroke="#c9a05a" stroke-width="5"/>
<circle class="dec-glow" cx="80" cy="58" r="46" fill="url(#${p}glowW)" opacity="0"/><circle class="tip" cx="80" cy="62" r="4" fill="#fff" opacity="0"/></g></svg>`;
  };
  A.make.decorAnar = function () {
    const p = 'da';
    return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 160 220" aria-hidden="true"><defs>${A.defs(p)}${grad(p + 'pot', [[0, '#d8452e'], [1, '#7a1a1a']])}</defs>
<path d="M44 90 L116 90 L130 206 L30 206Z" fill="url(#${p}pot)" stroke="#ffd36b" stroke-width="1.6"/><path d="M40 120 H120 M36 156 H124" stroke="#ffd36b" stroke-width="3"/>
${Array.from({ length: 5 }, (_, i) => `<path d="M${54 + i * 13} 168 l6 -12 l6 12Z" fill="#ffd36b"/>`).join('')}
<ellipse cx="80" cy="90" rx="36" ry="9" fill="#2a0a0a"/><path d="M80 86 q-6 -14 4 -22" stroke="#c9a05a" stroke-width="2.4" fill="none"/><circle class="dec-glow" cx="80" cy="84" r="50" fill="url(#${p}glow)" opacity="0"/></svg>`;
  };

  /* ============ small ornaments ============ */
  A.make.ornament = function () {
    return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 28" aria-hidden="true"><defs><linearGradient id="orL" x1="0" x2="1"><stop offset="0" stop-color="#f5c04a" stop-opacity="0"/><stop offset="1" stop-color="#f5c04a"/></linearGradient><linearGradient id="orR" x1="1" x2="0"><stop offset="0" stop-color="#f5c04a" stop-opacity="0"/><stop offset="1" stop-color="#f5c04a"/></linearGradient></defs>
<path d="M0 14 H128" stroke="url(#orL)" stroke-width="1.4"/><path d="M320 14 H192" stroke="url(#orR)" stroke-width="1.4"/>
<g fill="#f5c04a" transform="translate(160 14)"><path d="M0 -11 L5 0 L0 11 L-5 0Z"/><path d="M-16 0 Q-10 -9 -4 0 Q-10 9 -16 0Z M16 0 Q10 -9 4 0 Q10 9 16 0Z" opacity=".8"/><circle cx="-28" r="2.2"/><circle cx="28" r="2.2"/></g></svg>`;
  };
  A.make.loaderDiya = function () {
    const p = 'ld';
    return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="-80 -110 160 160" aria-hidden="true"><defs>${A.defs(p)}</defs>${A.diya(0, 10, 1.3, p, { glow: 110 })}</svg>`;
  };
  A.make.lantern = A.make.decorLantern;
})();
