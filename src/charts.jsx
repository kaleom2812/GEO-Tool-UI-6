import { useId, useState } from "react";
import { motion } from "framer-motion";
import { useInView, useReducedMotion } from "./lib/hooks.js";
import { Counter } from "./motion/primitives.jsx";

/* Instrument chart kit - sharp edges, tick marks, mono figures, one accent (signal green).
   Line draws use strokeDashoffset (reliable). Every chart has a text alternative. */

const SIGNAL = "#4ADE9E";
const SIGNAL_B = "#7BF0BD";
const WIRE = "#63B3FF";
const WARN = "#F2B33D";
const CRIT = "#FF6B7A";
const LINE = "#1E252B";
const LINE2 = "#2C353D";
const LOW = "#565F66";
const EASE = [0.16, 1, 0.3, 1];

function A11y({ children }) {
  return <span className="sr-only">{children}</span>;
}

/* ---------------- ScoreCore (signature) ---------------- */
export function ScoreCore({ value, max = 100, grade, sub, size = 300 }) {
  const reduced = useReducedMotion();
  const [ref, inView] = useInView();
  const cx = size / 2;
  const cy = size / 2;
  const R = size / 2 - 22;
  const frac = Math.max(0, Math.min(1, value / max));
  const start = 138;
  const sweep = 264;
  const SEGMENTS = 44;
  const gid = useId();

  const polar = (deg, rr) => [
    cx + rr * Math.cos((deg * Math.PI) / 180),
    cy + rr * Math.sin((deg * Math.PI) / 180),
  ];
  const litCount = Math.round(SEGMENTS * frac);

  return (
    <figure
      ref={ref}
      className="relative mx-auto"
      style={{ maxWidth: size }}
      role="img"
      aria-label={`GEO Visibility Score ${value} of ${max}, grade ${grade}. ${sub || ""}`}
    >
      <svg viewBox={`0 0 ${size} ${size}`} className="w-full" aria-hidden="true">
        <defs>
          <linearGradient id={`${gid}-g`} x1="0" y1="1" x2="1" y2="0">
            <stop offset="0" stopColor={SIGNAL} />
            <stop offset="1" stopColor={SIGNAL_B} />
          </linearGradient>
        </defs>

        {/* outer rotating tick ring */}
        <motion.g
          style={{ originX: "50%", originY: "50%" }}
          animate={reduced ? {} : { rotate: 360 }}
          transition={{ duration: 90, ease: "linear", repeat: Infinity }}
        >
          {Array.from({ length: 60 }).map((_, i) => {
            const [x1, y1] = polar((i * 360) / 60, R + 12);
            const [x2, y2] = polar((i * 360) / 60, R + (i % 5 === 0 ? 18 : 15));
            return <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke={LINE2} strokeWidth={1} />;
          })}
        </motion.g>

        {/* segmented arc */}
        {Array.from({ length: SEGMENTS }).map((_, i) => {
          const a0 = start + (sweep * i) / SEGMENTS + 1.2;
          const a1 = start + (sweep * (i + 1)) / SEGMENTS - 1.2;
          const [x0, y0] = polar(a0, R);
          const [x1, y1] = polar(a1, R);
          const lit = i < litCount;
          return (
            <motion.path
              key={i}
              d={`M ${x0} ${y0} A ${R} ${R} 0 0 1 ${x1} ${y1}`}
              fill="none"
              stroke={lit ? `url(#${gid}-g)` : LINE}
              strokeWidth={lit ? 5 : 3}
              strokeLinecap="butt"
              initial={reduced ? false : { opacity: 0, pathLength: 0 }}
              animate={inView || reduced ? { opacity: 1, pathLength: 1 } : {}}
              transition={{ duration: 0.28, delay: reduced ? 0 : 0.3 + i * 0.014, ease: "easeOut" }}
              style={{ filter: lit ? "drop-shadow(0 0 4px rgba(74,222,158,0.55))" : "none" }}
            />
          );
        })}

        {/* settle pulse */}
        {!reduced && (
          <motion.circle
            cx={cx}
            cy={cy}
            r={R}
            fill="none"
            stroke={SIGNAL_B}
            strokeWidth={1}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={inView ? { opacity: [0, 0.6, 0], scale: [0.9, 1.08, 1.14] } : {}}
            transition={{ duration: 0.9, delay: 0.3 + SEGMENTS * 0.014, ease: "easeOut" }}
            style={{ originX: "50%", originY: "50%" }}
          />
        )}
      </svg>

      <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center text-center">
        <Counter to={value} className="data-fig text-[3.4rem] font-semibold leading-none text-fg sm:text-6xl" />
        <div className="mt-2 flex items-center gap-2 font-mono text-2xs uppercase tracking-[0.18em] text-signal">
          <span>{grade}</span>
          <span className="text-fg-low">/</span>
          <span className="text-fg-mid">{max}</span>
        </div>
        {sub && <div className="mt-1 font-mono text-2xs uppercase tracking-[0.1em] text-fg-low">{sub}</div>}
      </div>
    </figure>
  );
}

/* ---------------- BarRack ---------------- */
export function BarRack({ items, max, unit = "%", valueFmt }) {
  const [ref, inView] = useInView();
  const reduced = useReducedMotion();
  const top = max ?? Math.max(...items.map((d) => d.value));
  return (
    <figure ref={ref} role="img" aria-label={items.map((d) => `${d.name}: ${valueFmt ? valueFmt(d.value) : d.value + unit}`).join(", ")}>
      <ul className="flex flex-col divide-y divide-line">
        {items.map((d, i) => (
          <li key={d.name} className="grid grid-cols-[7.5rem_1fr_3rem] items-center gap-3 py-2 sm:grid-cols-[10rem_1fr_3.5rem]">
            <span className={`truncate font-mono text-xs ${d.self ? "text-signal-bright" : "text-fg-mid"}`}>
              {d.self ? "▸ " : ""}
              {d.name}
            </span>
            <span className="relative block h-[6px] bg-base-2">
              <motion.span
                className="absolute inset-y-0 left-0 origin-left"
                style={{
                  width: `${(d.value / top) * 100}%`,
                  background: d.self ? SIGNAL : LINE2,
                  boxShadow: d.self ? "0 0 10px rgba(74,222,158,0.6)" : "none",
                }}
                initial={reduced ? false : { scaleX: 0 }}
                animate={{ scaleX: inView || reduced ? 1 : 0 }}
                transition={{ duration: 0.8, delay: i * 0.05, ease: EASE }}
              />
            </span>
            <span className={`data-fig text-right text-xs ${d.self ? "text-signal-bright" : "text-fg"}`}>
              {valueFmt ? valueFmt(d.value) : `${d.value}${unit}`}
            </span>
          </li>
        ))}
      </ul>
    </figure>
  );
}

/* ---------------- Trace (line chart) ---------------- */
export function Trace({ series, height = 200, yMax = 100, unit = "", yTicks = [0, 25, 50, 75, 100] }) {
  const reduced = useReducedMotion();
  const [ref, inView] = useInView();
  const [hover, setHover] = useState(null);
  const w = 620;
  const padL = 30;
  const padR = 12;
  const padT = 12;
  const padB = 26;
  const gid = useId();
  const xs = series[0].points.map((p) => p.x);
  const X = (i) => padL + (i / (xs.length - 1)) * (w - padL - padR);
  const Y = (v) => padT + (1 - v / yMax) * (height - padT - padB);
  const line = (pts) => pts.map((p, i) => `${i ? "L" : "M"} ${X(i)} ${Y(p.y)}`).join(" ");

  return (
    <figure ref={ref} role="img" aria-label={series.map((s) => `${s.name}: ${s.points.map((p) => p.x + " " + p.y + unit).join(", ")}`).join(". ")}>
      <svg viewBox={`0 0 ${w} ${height}`} className="w-full" onMouseLeave={() => setHover(null)}>
        <defs>
          <linearGradient id={`${gid}-fill`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor={SIGNAL} stopOpacity="0.22" />
            <stop offset="1" stopColor={SIGNAL} stopOpacity="0" />
          </linearGradient>
        </defs>
        {yTicks.map((t) => (
          <g key={t}>
            <line x1={padL} x2={w - padR} y1={Y(t)} y2={Y(t)} stroke={LINE} strokeWidth={1} />
            <text x={padL - 7} y={Y(t) + 3} textAnchor="end" fill={LOW} style={{ font: "500 9px 'Geist Mono', monospace" }}>{t}</text>
          </g>
        ))}
        {xs.map((x, i) => (
          <text key={x} x={X(i)} y={height - 7} textAnchor="middle" fill={LOW} style={{ font: "500 9px 'Geist Mono', monospace" }}>{x}</text>
        ))}
        {series.map((s, si) => {
          const path = line(s.points);
          const color = s.accent || (si === 0 ? SIGNAL : WIRE);
          return (
            <g key={s.name}>
              {si === 0 && (
                <motion.path
                  d={`${path} L ${X(s.points.length - 1)} ${Y(0)} L ${X(0)} ${Y(0)} Z`}
                  fill={`url(#${gid}-fill)`}
                  initial={reduced ? false : { opacity: 0 }}
                  animate={{ opacity: inView || reduced ? 1 : 0 }}
                  transition={{ duration: 0.6, delay: 0.5 }}
                />
              )}
              <motion.path
                d={path}
                fill="none"
                stroke={color}
                strokeWidth={si === 0 ? 2 : 1.5}
                strokeDasharray={s.dashed ? "4 4" : "1 1"}
                pathLength={1}
                strokeLinecap="round"
                initial={reduced ? { strokeDashoffset: 0 } : { strokeDashoffset: 1 }}
                animate={{ strokeDashoffset: inView || reduced ? 0 : 1 }}
                transition={{ duration: 1.1, delay: si * 0.15, ease: "easeInOut" }}
                style={{ filter: si === 0 ? "drop-shadow(0 0 5px rgba(74,222,158,0.45))" : "none" }}
              />
              {s.points.map((p, i) => (
                <motion.rect
                  key={i}
                  x={X(i) - 2}
                  y={Y(p.y) - 2}
                  width={4}
                  height={4}
                  fill={color}
                  initial={reduced ? false : { opacity: 0, scale: 0 }}
                  animate={{ opacity: inView || reduced ? 1 : 0, scale: inView || reduced ? 1 : 0 }}
                  transition={{ duration: 0.3, delay: 0.6 + i * 0.05 }}
                />
              ))}
            </g>
          );
        })}
        {xs.map((x, i) => (
          <rect
            key={`h${x}`}
            x={X(i) - 14}
            y={0}
            width={28}
            height={height}
            fill="transparent"
            tabIndex={0}
            role="button"
            aria-label={`${x}: ${series.map((s) => `${s.name} ${s.points[i].y}${unit}`).join(", ")}`}
            onMouseEnter={() => setHover(i)}
            onFocus={() => setHover(i)}
            onBlur={() => setHover(null)}
          />
        ))}
        {hover != null && (
          <g pointerEvents="none">
            <line x1={X(hover)} x2={X(hover)} y1={padT} y2={height - padB} stroke={SIGNAL} strokeOpacity={0.5} strokeDasharray="2 2" />
            {series.map((s) => (
              <circle key={s.name} cx={X(hover)} cy={Y(s.points[hover].y)} r={3} fill={SIGNAL_B} />
            ))}
          </g>
        )}
      </svg>
      {hover != null && (
        <p className="mt-1 text-center font-mono text-2xs text-fg-mid">
          [{xs[hover]}] {series.map((s) => `${s.name} ${s.points[hover].y}${unit}`).join("  /  ")}
        </p>
      )}
    </figure>
  );
}

/* ---------------- Radar ---------------- */
export function Radar({ axes, series, size = 300 }) {
  const [ref, inView] = useInView();
  const reduced = useReducedMotion();
  const cx = size / 2;
  const cy = size / 2;
  const r = size / 2 - 54;
  const n = axes.length;
  const pt = (i, f) => {
    const a = (Math.PI * 2 * i) / n - Math.PI / 2;
    return [cx + r * f * Math.cos(a), cy + r * f * Math.sin(a)];
  };
  const poly = (vals) => vals.map((v, i) => pt(i, v).join(",")).join(" ");
  return (
    <figure ref={ref} role="img" aria-label={series.map((s) => `${s.name}: ${axes.map((a, i) => a + " " + Math.round(s.values[i] * 100)).join(", ")}`).join(". ")}>
      <svg viewBox={`0 0 ${size} ${size}`} className="mx-auto w-full max-w-[320px]">
        {[0.25, 0.5, 0.75, 1].map((g) => (
          <polygon key={g} points={poly(axes.map(() => g))} fill="none" stroke={LINE} strokeWidth={1} />
        ))}
        {axes.map((a, i) => {
          const [x, y] = pt(i, 1);
          const [lx, ly] = pt(i, 1.22);
          return (
            <g key={a}>
              <line x1={cx} y1={cy} x2={x} y2={y} stroke={LINE} strokeWidth={1} />
              <text
                x={lx}
                y={ly}
                textAnchor={Math.abs(lx - cx) < 8 ? "middle" : lx > cx ? "start" : "end"}
                dominantBaseline="middle"
                fill={LOW}
                style={{ font: "500 9px 'Geist Mono', monospace", textTransform: "uppercase" }}
              >
                {a}
              </text>
            </g>
          );
        })}
        {series.map((s, si) => (
          <motion.polygon
            key={s.name}
            points={poly(s.values)}
            fill={s.accent || SIGNAL}
            fillOpacity={si === 0 ? 0.14 : 0.05}
            stroke={s.accent || (si === 0 ? SIGNAL : WIRE)}
            strokeWidth={1.6}
            strokeDasharray={si === 0 ? undefined : "3 3"}
            initial={reduced ? false : { opacity: 0, scale: 0.75 }}
            animate={{ opacity: inView || reduced ? 1 : 0, scale: inView || reduced ? 1 : 0.75 }}
            transition={{ duration: 0.7, delay: si * 0.12, ease: EASE }}
            style={{ originX: "50%", originY: "50%", filter: si === 0 ? "drop-shadow(0 0 6px rgba(74,222,158,0.35))" : "none" }}
          />
        ))}
      </svg>
    </figure>
  );
}

/* ---------------- Ring (donut / share) ---------------- */
export function Ring({ items, unit = "%", centerLabel }) {
  const [ref, inView] = useInView();
  const reduced = useReducedMotion();
  const [active, setActive] = useState(null);
  const size = 200;
  const stroke = 16;
  const r = (size - stroke) / 2 - 3;
  const c = 2 * Math.PI * r;
  const total = items.reduce((s, d) => s + (Number(d.value) || 0), 0) || 1;
  let offset = 0;
  const palette = [SIGNAL, WIRE, "#9B8CFF", WARN, CRIT, "#8A949C", "#3D464D"];
  return (
    <figure
      ref={ref}
      className="flex flex-col items-center gap-5 sm:flex-row sm:gap-7"
      role="img"
      aria-label={items.map((d) => `${d.name}: ${((d.value / total) * 100).toFixed(0)}${unit}`).join(", ")}
    >
      <div className="relative shrink-0" style={{ width: size }}>
        <svg viewBox={`0 0 ${size} ${size}`} className="w-full -rotate-90">
          {items.map((d, i) => {
            const seg = ((Number(d.value) || 0) / total) * c;
            const node = (
              <motion.circle
                key={d.name}
                cx={size / 2}
                cy={size / 2}
                r={r}
                fill="none"
                stroke={d.self ? SIGNAL : palette[i % palette.length]}
                strokeWidth={active === i ? stroke + 4 : stroke}
                strokeDasharray={`${seg} ${c}`}
                strokeDashoffset={-offset}
                initial={reduced ? false : { opacity: 0 }}
                animate={{ opacity: inView || reduced ? 1 : 0 }}
                transition={{ duration: 0.4, delay: i * 0.06 }}
                style={{ filter: d.self ? "drop-shadow(0 0 8px rgba(74,222,158,0.7))" : "none", transition: "stroke-width .2s" }}
              />
            );
            offset += seg;
            return node;
          })}
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
          <span className="data-fig text-xl font-semibold text-fg">
            {active != null ? `${((items[active].value / total) * 100).toFixed(0)}%` : centerLabel?.value}
          </span>
          <span className="max-w-[6rem] font-mono text-[0.6rem] uppercase leading-tight tracking-wide text-fg-low">
            {active != null ? items[active].name : centerLabel?.label}
          </span>
        </div>
      </div>
      <ul className="grid w-full gap-0.5 font-mono text-xs">
        {items.map((d, i) => (
          <li key={d.name}>
            <button
              type="button"
              onMouseEnter={() => setActive(i)}
              onMouseLeave={() => setActive(null)}
              onFocus={() => setActive(i)}
              onBlur={() => setActive(null)}
              className="flex w-full items-center gap-2.5 px-1.5 py-1 text-left hover:bg-base-2 focus-visible:bg-base-2"
            >
              <span
                aria-hidden="true"
                className="h-2 w-2 shrink-0"
                style={{ background: d.self ? SIGNAL : palette[i % palette.length], boxShadow: d.self ? "0 0 8px rgba(74,222,158,0.9)" : "none" }}
              />
              <span className={`flex-1 ${d.self ? "text-signal-bright" : "text-fg-mid"}`}>{d.name}</span>
              <span className="data-fig text-fg">{((d.value / total) * 100).toFixed(0)}{unit}</span>
            </button>
          </li>
        ))}
      </ul>
    </figure>
  );
}

/* ---------------- Plot (impact / effort) ---------------- */
export function Plot({ items }) {
  const [ref, inView] = useInView();
  const [active, setActive] = useState(null);
  const size = 400;
  const pad = 40;
  const X = (v) => pad + ((v - 0.5) / 5) * (size - pad * 1.2);
  const Y = (v) => size - pad - ((v - 0.5) / 5) * (size - pad * 1.4);
  return (
    <figure ref={ref} role="img" aria-label={items.map((d) => `${d.title}: impact ${d.impact} of 5, effort ${d.effort} of 5`).join(". ")}>
      <svg viewBox={`0 0 ${size} ${size}`} className="w-full">
        {[1, 2, 3, 4, 5].map((g) => (
          <g key={g}>
            <line x1={X(g)} y1={pad * 0.4} x2={X(g)} y2={size - pad} stroke={LINE} strokeWidth={0.75} />
            <line x1={pad} y1={Y(g)} x2={size - pad * 0.4} y2={Y(g)} stroke={LINE} strokeWidth={0.75} />
          </g>
        ))}
        <line x1={X(3)} y1={pad * 0.4} x2={X(3)} y2={size - pad} stroke={SIGNAL} strokeOpacity={0.3} strokeDasharray="3 3" />
        <line x1={pad} y1={Y(3)} x2={size - pad * 0.4} y2={Y(3)} stroke={SIGNAL} strokeOpacity={0.3} strokeDasharray="3 3" />
        <text x={X(0.7)} y={Y(4.7)} fill={SIGNAL_B} style={{ font: "600 10px 'Geist Mono', monospace", textTransform: "uppercase" }}>quick wins</text>
        <text x={X(3.2)} y={Y(4.7)} fill={LOW} style={{ font: "600 10px 'Geist Mono', monospace", textTransform: "uppercase" }}>projects</text>
        <text x={X(0.5)} y={size - pad + 15} fill={LOW} style={{ font: "500 9px 'Geist Mono', monospace" }}>EFFORT</text>
        <text x={pad - 8} y={Y(4.9)} textAnchor="end" fill={LOW} style={{ font: "500 9px 'Geist Mono', monospace" }}>IMPACT</text>
        {items.map((d, i) => {
          const j = ((i % 3) - 1) * 5;
          return (
            <motion.g
              key={d.id}
              initial={inView ? { opacity: 0, scale: 0 } : false}
              animate={{ opacity: inView ? 1 : 0, scale: inView ? 1 : 0 }}
              transition={{ delay: i * 0.04, type: "spring", stiffness: 220, damping: 18 }}
            >
              <rect
                x={X(d.effort) + j - 9}
                y={Y(d.impact) + j - 9}
                width={18}
                height={18}
                fill={d.type === "Quick win" ? SIGNAL : "#1B2228"}
                stroke={d.type === "Quick win" ? SIGNAL_B : LINE2}
                strokeWidth={1}
                tabIndex={0}
                role="button"
                aria-label={`${d.title}. Impact ${d.impact} of 5, effort ${d.effort} of 5.`}
                onMouseEnter={() => setActive(d.id)}
                onMouseLeave={() => setActive(null)}
                onFocus={() => setActive(d.id)}
                onBlur={() => setActive(null)}
                style={{ cursor: "pointer", filter: d.type === "Quick win" ? "drop-shadow(0 0 8px rgba(74,222,158,0.6))" : "none" }}
              />
              <text
                x={X(d.effort) + j}
                y={Y(d.impact) + j + 3}
                textAnchor="middle"
                fill={d.type === "Quick win" ? "#07090B" : "#E8ECEF"}
                style={{ font: "700 9px 'Geist Mono', monospace", pointerEvents: "none" }}
              >
                {d.id}
              </text>
            </motion.g>
          );
        })}
      </svg>
      {active != null && (
        <div className="panel mt-2 p-3 font-mono text-xs text-fg">
          <span className="mr-2 text-signal">[{String(active).padStart(2, "0")}]</span>
          {items.find((d) => d.id === active)?.title}
        </div>
      )}
    </figure>
  );
}

/* ---------------- Segments (answerability) ---------------- */
export function Segments({ groups }) {
  const [ref, inView] = useInView();
  const reduced = useReducedMotion();
  const total = groups.reduce((s, g) => s + g.count, 0);
  const tone = { good: SIGNAL, warn: WARN, bad: CRIT };
  return (
    <figure ref={ref} role="img" aria-label={groups.map((g) => `${g.label}: ${g.count}`).join(", ")}>
      <div className="flex h-8 w-full overflow-hidden border border-line">
        {groups.map((g, i) => (
          <motion.div
            key={g.label}
            className="flex items-center justify-center"
            style={{ background: tone[g.tone], flexGrow: g.count }}
            initial={reduced ? false : { scaleX: 0 }}
            animate={{ scaleX: inView || reduced ? 1 : 0 }}
            transition={{ duration: 0.7, delay: i * 0.08, ease: EASE }}
          >
            <span className="data-fig text-xs font-bold text-base">{g.count}</span>
          </motion.div>
        ))}
      </div>
      <ul className="mt-3 flex flex-wrap gap-x-5 gap-y-1 font-mono text-xs">
        {groups.map((g) => (
          <li key={g.label} className="flex items-center gap-2">
            <span aria-hidden="true" className="h-2 w-2" style={{ background: tone[g.tone] }} />
            <span className="text-fg-mid">
              {g.label} <span className="data-fig text-fg">{g.count}</span> <span className="text-fg-low">/ {total}</span>
            </span>
          </li>
        ))}
      </ul>
    </figure>
  );
}

/* ---------------- Delta (from -> to) ---------------- */
export function Delta({ label, from, to, max = 100 }) {
  const [ref, inView] = useInView();
  const reduced = useReducedMotion();
  const p = (v) => (typeof v === "string" ? parseFloat(v) : v);
  const f = p(from);
  const t = p(to);
  return (
    <div ref={ref} className="font-mono text-xs">
      <div className="mb-1 flex items-baseline justify-between">
        <span className="text-fg-mid">{label}</span>
        <span className="data-fig text-fg">
          {from} <span className="text-fg-low">{">"}</span> <span className="text-signal-bright">{to}</span>
        </span>
      </div>
      <div className="relative h-[6px] bg-base-2">
        <div className="absolute inset-y-0 left-0 bg-line-2" style={{ width: `${(f / max) * 100}%` }} />
        <motion.div
          className="absolute inset-y-0 left-0 bg-signal"
          style={{ boxShadow: "0 0 10px rgba(74,222,158,0.6)" }}
          initial={reduced ? false : { width: `${(f / max) * 100}%` }}
          animate={{ width: inView || reduced ? `${(t / max) * 100}%` : `${(f / max) * 100}%` }}
          transition={{ duration: 1, ease: EASE }}
        />
      </div>
    </div>
  );
}

/* ---------------- Meter (inline) ---------------- */
export function Meter({ value, max = 100, tone = "signal" }) {
  const [ref, inView] = useInView();
  const reduced = useReducedMotion();
  const c = { signal: SIGNAL, good: SIGNAL, warn: WARN, bad: CRIT }[tone] || SIGNAL;
  return (
    <span ref={ref} className="relative block h-[4px] w-full bg-base-2">
      <motion.span
        className="absolute inset-y-0 left-0"
        style={{ background: c, boxShadow: `0 0 7px ${c}88` }}
        initial={reduced ? false : { width: 0 }}
        animate={{ width: inView || reduced ? `${(value / max) * 100}%` : 0 }}
        transition={{ duration: 0.7, ease: EASE }}
      />
    </span>
  );
}

export { A11y };
