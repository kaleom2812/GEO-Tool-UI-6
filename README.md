# SIGNAL - GEO Audit Instrument (futuristic build)

A frontend-only demo of a **GEO (Generative Engine Optimization) auditing platform**, built as
an animation-forward, committed-dark "signal instrument". Same workflow and same mock data as the
three earlier UI options, reworked around orchestrated motion and a distinctive futuristic
aesthetic.

No backend, no authentication, no real payments. All audit data is mock data for the fictional
brand **Rivet CRM** and lives in `src/data/auditData.js`.

## Run it

```bash
npm install
npm run dev
```

Open http://localhost:5173.

```bash
npm run build     # production build to /dist
npm run preview   # serve the production build on :4173
```

Requires Node 18+. First `npm run dev` takes a few extra seconds while Vite pre-bundles the
Phosphor icon set.

## Workflow

`Landing -> Target brief -> Signal acquisition (animated) -> Readout preview (90% locked) ->
Payment (demo) -> Access code -> Full readout`

- Demo access code: **`GEO-DEMO-2026`** (revealed on the access screen).
- Unlock state persists in `localStorage` (`geo-demo-unlocked-v1`). Clear site data to reset.
- `?step=<name>` deep-links a workflow step, e.g. `?step=report`.

## The readout, 14 channels

GEO Score and breakdown, Executive summary, AI Visibility, Entity Understanding, Answerability,
Prompt evidence, Competitor intelligence and share of voice, Citation visibility, Page and
content findings, Technical GEO, Schema / robots.txt / llms.txt, Action center, 90-day roadmap,
Methodology. Every section runs Problem, Evidence, Impact, Recommendation, Action.

## Design read and dials

Reading this as: a frontend-only product experience for a GEO audit tool, audience = growth and
SEO leads evaluating how AI assistants represent their brand, with a committed-dark "signal
instrument" language (kinetic mono type, orchestrated load and scroll choreography, an ambient
oscilloscope field), leaning toward Tailwind + Geist / Geist Mono + Framer Motion, hand-built SVG
data-viz, Phosphor icons.

`DESIGN_VARIANCE 8 / MOTION_INTENSITY 9 / VISUAL_DENSITY 4 landing, 6 readout` - motivated by the
explicit request for exceptional, futuristic animation.

- **One accent, locked:** signal green `#4ADE9E` across the whole page. Blue and amber appear
  only inside data-viz and status, never as page accent.
- **One radius:** 4px everywhere (`rounded-full` reserved for status dots).
- **One theme:** committed dark. Light mode is out of scope for an immersive instrument and would
  break the ambient signal field.
- **Type:** Geist and Geist Mono only. Emphasis is Geist italic in the same family, never a serif
  swap.
- **Zero em-dashes** anywhere visible.

## Motion

Ambient oscilloscope canvas (isolated leaf, rAF only, pauses when hidden, static under reduced
motion), one-time boot sequence, per-word headline reveal, magnetic primary CTA, cursor-reactive
spotlight panel, scroll-progress rail, score gauge that assembles segment by segment with a
motion-value counter, radar processing core with orbiting model nodes, decrypt flash on unlock,
scroll-reveal choreography on every readout section.

Every animation is gated on `prefers-reduced-motion` and collapses to a clean static state.
Continuous values (magnetic hover, scroll progress) use Framer motion values, never React state.

## Stack

React 18, Vite 5, Tailwind CSS 3, Framer Motion, Phosphor icons. Charts are hand-built SVG
(`src/charts.jsx`), no charting library. Fonts load from Google Fonts (a `<link>` in
`index.html`) for demo convenience; self-host for production.

## Accessibility

Keyboard-navigable, visible focus rings, `prefers-reduced-motion` honored everywhere, semantic
landmarks and headings, form labels above inputs with error text below and an error summary,
`aria-live` status regions, chart text alternatives, skip link, AA contrast target. Status is
carried by text plus color, never color alone.
