import { useState } from "react";
import { motion } from "framer-motion";
import { CaretDown } from "./icons.jsx";
import { Reveal } from "./motion/primitives.jsx";

const TONE = {
  good: { text: "text-signal", bar: "bg-signal", chip: "border-signal/40 text-signal" },
  warn: { text: "text-warn", bar: "bg-warn", chip: "border-warn/40 text-warn" },
  bad: { text: "text-crit", bar: "bg-crit", chip: "border-crit/40 text-crit" },
  info: { text: "text-wire", bar: "bg-wire", chip: "border-wire/40 text-wire" },
  neutral: { text: "text-fg-mid", bar: "bg-line-2", chip: "border-line-2 text-fg-mid" },
};

export function Chip({ tone = "neutral", children }) {
  const t = TONE[tone] || TONE.neutral;
  return (
    <span className={`inline-flex items-center border ${t.chip} px-2 py-[3px] font-mono text-2xs uppercase tracking-[0.1em]`}>
      {children}
    </span>
  );
}

export function SectionHeader({ index, kicker, title, lede }) {
  return (
    <header className="scroll-mt-24">
      <div className="flex items-center gap-3 font-mono text-2xs uppercase tracking-[0.16em] text-fg-low">
        {index != null && <span className="text-signal">{String(index).padStart(2, "0")}</span>}
        {kicker && (
          <>
            <span aria-hidden="true" className="h-px w-6 bg-line-2" />
            <span>{kicker}</span>
          </>
        )}
      </div>
      <h2 className="mt-3 text-2xl font-semibold tracking-tight text-fg sm:text-[1.75rem]">{title}</h2>
      {lede && <p className="mt-3 max-w-[62ch] text-sm leading-relaxed text-fg-mid">{lede}</p>}
    </header>
  );
}

const STAGE_COLOR = {
  Problem: "text-crit",
  Evidence: "text-fg",
  Impact: "text-warn",
  Recommendation: "text-wire",
  Action: "text-signal",
};

export function StoryArc({ stages, compact = false }) {
  return (
    <ol className="relative space-y-4 pl-4">
      <span aria-hidden="true" className="absolute left-0 top-1.5 h-[calc(100%-1rem)] w-px bg-line-2" />
      {stages.map((s, i) => (
        <Reveal as="li" key={s.stage} delay={i * 0.05} className="relative">
          <span
            aria-hidden="true"
            className="absolute -left-4 top-1.5 h-1.5 w-1.5"
            style={{ background: "currentColor" }}
          />
          <p className={`font-mono text-2xs uppercase tracking-[0.16em] ${STAGE_COLOR[s.stage] || "text-fg-low"}`}>
            {s.stage}
          </p>
          <p className={`mt-1 text-fg-mid ${compact ? "text-xs leading-relaxed" : "text-sm leading-relaxed"}`}>{s.text}</p>
        </Reveal>
      ))}
    </ol>
  );
}

export function Callout({ icon: Icon, title, tone = "info", children }) {
  const t = TONE[tone] || TONE.info;
  return (
    <aside className={`border-l-2 ${t.bar} bg-base-1 p-4`}>
      <div className="flex items-start gap-3">
        {Icon && <span className={`mt-0.5 shrink-0 ${t.text}`}><Icon size={16} /></span>}
        <div>
          {title && <p className={`mb-1 font-mono text-2xs font-semibold uppercase tracking-[0.12em] ${t.text}`}>{title}</p>}
          <div className="text-sm leading-relaxed text-fg-mid">{children}</div>
        </div>
      </div>
    </aside>
  );
}

export function KeyValue({ rows }) {
  return (
    <dl className="divide-y divide-line">
      {rows.map((r) => (
        <div key={r.label} className="grid grid-cols-1 gap-1 py-2.5 sm:grid-cols-[12rem_1fr] sm:gap-4">
          <dt className="font-mono text-2xs uppercase tracking-[0.1em] text-fg-low">{r.label}</dt>
          <dd className="text-sm text-fg-mid">{r.value}</dd>
        </div>
      ))}
    </dl>
  );
}

export function DataTable({ columns, rows, caption, dense = false }) {
  return (
    <div className="max-w-full overflow-x-auto border border-line">
      <table className="w-full min-w-[34rem] border-collapse text-left text-sm">
        {caption && (
          <caption className="border-b border-line bg-base-2 px-3 py-2 text-left font-mono text-2xs uppercase tracking-[0.12em] text-fg-low">
            {caption}
          </caption>
        )}
        <thead>
          <tr className="border-b border-line-2 bg-base-2/60">
            {columns.map((c) => (
              <th
                key={c.key}
                scope="col"
                className={`whitespace-nowrap px-3 py-2 font-mono text-2xs font-medium uppercase tracking-[0.1em] text-fg-low ${
                  c.align === "right" ? "text-right" : ""
                }`}
              >
                {c.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-line">
          {rows.map((row, i) => (
            <tr key={i} className="align-top transition-colors hover:bg-base-2/50">
              {columns.map((c) => (
                <td
                  key={c.key}
                  className={`px-3 ${dense ? "py-1.5" : "py-2.5"} ${c.align === "right" ? "text-right" : ""} ${
                    c.mono ? "data-fig text-fg" : "text-fg-mid"
                  } ${row.self && c.key === columns[0].key ? "text-signal-bright" : ""}`}
                >
                  {c.render ? c.render(row) : row[c.key]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export function Disclose({ summary, children, defaultOpen = false }) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="border border-line bg-base-1">
      <button
        type="button"
        aria-expanded={open}
        onClick={() => setOpen((o) => !o)}
        className="flex w-full items-center justify-between gap-3 px-4 py-3 text-left text-sm text-fg transition-colors hover:bg-base-2"
      >
        {summary}
        <span className={`shrink-0 text-fg-low transition-transform ${open ? "rotate-180" : ""}`}>
          <CaretDown size={14} />
        </span>
      </button>
      <motion.div
        initial={false}
        animate={{ height: open ? "auto" : 0, opacity: open ? 1 : 0 }}
        transition={{ duration: 0.26, ease: [0.16, 1, 0.3, 1] }}
        className="overflow-hidden"
      >
        <div className="border-t border-line px-4 py-3 text-sm leading-relaxed text-fg-mid">{children}</div>
      </motion.div>
    </div>
  );
}

export function CodeBlock({ code, label }) {
  return (
    <div className="overflow-hidden border border-line bg-[#05070A]">
      {label && (
        <div className="flex items-center gap-2 border-b border-line px-3 py-2 font-mono text-2xs uppercase tracking-[0.12em] text-fg-low">
          <span className="text-signal">{">"}</span>
          {label}
        </div>
      )}
      <pre className="overflow-x-auto p-3 text-[0.78rem] leading-relaxed text-[#C3CBD1]">
        <code>{code}</code>
      </pre>
    </div>
  );
}

export const readableTone = { yes: "good", partial: "warn", no: "bad" };
