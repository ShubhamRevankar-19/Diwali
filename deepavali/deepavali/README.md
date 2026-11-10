# Deepavali — The Festival of Lights

An interactive, cinematic storytelling site. No build step: open `index.html` in a browser
(or serve the folder, e.g. `python3 -m http.server`).

## Structure
- `index.html`          markup for all sections
- `css/style.css`       design system, layout, responsive + reduced-motion rules
- `js/art-core.js`      SVG illustration engine (diyas, lotus, mandalas, palace skyline, figures)
- `js/art-story.js`     hero layers + the six story scenes
- `js/art-misc.js`      five-day cards, gallery, festival decorations
- `js/fx.js`            canvas particles, fireworks, thousands of flickering lights
- `js/audio.js`         generative raga-style music and sound effects (Web Audio, off by default)
- `js/interactive.js`   light-a-diya, rangoli studio, decorations
- `js/main.js`          loader, Lenis smooth scroll, GSAP ScrollTrigger choreography, nav, lightbox, finale
- `vendor/`             GSAP, ScrollTrigger, Lenis (local copies)
- `fonts/`              Cinzel, Cormorant Garamond, Jost, Tiro Devanagari (local woff2)

All artwork is original and drawn in code, so there are no image files to load.
