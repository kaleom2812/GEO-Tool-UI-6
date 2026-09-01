import { useFlow } from "../flow.jsx";
import { meta, score, executiveSummary } from "../data/auditData.js";
import { ScoreCore } from "../charts.jsx";
import { REPORT_SECTIONS } from "../report/sections.jsx";
import { Lock, ArrowRight, Check } from "../icons.jsx";
import { Reveal, Magnetic } from "../motion/primitives.jsx";
import { Chip, StoryArc } from "../ui.jsx";
import { Footer } from "./Chrome.jsx";

const INCLUDED = [
  "All 6 signal scores with quarter-over-quarter movement",
  "8 verbatim-style AI answers with citation analysis",
  "Competitor share-of-voice scorecard for 6 brands",
  "Per-URL findings for 11 buyer-critical pages",
  "Copy-paste robots.txt, llms.txt and JSON-LD",
  "Impact and effort action center, dated 90-day roadmap",
];

export default function ReportPreview() {
  const { go } = useFlow();
  const teaser = executiveSummary.story.slice(0, 2);

  return (
    <main id="main" className="frame py-10">
      <p className="font-mono text-2xs uppercase tracking-[0.16em] text-signal">Step 03 / Readout preview / {meta.auditId}</p>
      <h1 className="mt-3 text-3xl font-semibold tracking-tight text-fg sm:text-4xl">{meta.brand}, GEO Visibility Score</h1>

      {/* visible portion */}
      <div className="mt-6 grid gap-8 border border-line bg-base-1 p-6 sm:p-10 lg:grid-cols-[minmax(0,300px)_1fr]">
        <div className="flex flex-col items-center justify-center border border-line bg-base/60 p-5">
          <ScoreCore value={score.overall} grade={score.grade} sub={score.tier} size={230} />
          <Chip tone="good">+{score.delta} QoQ</Chip>
        </div>
        <div>
          <p className="mb-3 font-mono text-2xs uppercase tracking-[0.14em] text-fg-low">Executive summary, opening</p>
          <StoryArc stages={teaser} compact />
          <div className="mt-5 grid grid-cols-2 gap-4 border-t border-line pt-4 sm:grid-cols-3">
            {executiveSummary.headlineMetrics.slice(0, 3).map((m) => (
              <div key={m.label}>
                <p className="data-fig text-xl text-fg">{m.value}</p>
                <p className="font-mono text-2xs uppercase tracking-[0.1em] text-fg-low">{m.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* locked portion */}
      <div className="relative mt-6">
        <div
          aria-hidden="true"
          className="pointer-events-none select-none space-y-2.5 pt-4 [mask-image:linear-gradient(to_bottom,black,transparent_80%)]"
        >
          {REPORT_SECTIONS.slice(1).map((s, i) => (
            <div key={s.id} className="flex items-center gap-4 border border-line bg-base-1 p-4 blur-[2px]">
              <span className="data-fig text-xs text-signal">{String(i + 2).padStart(2, "0")}</span>
              <span className="text-base font-semibold text-fg">{s.label}</span>
              <span className="ml-auto h-1.5 w-24 bg-base-2" />
            </div>
          ))}
        </div>

        <div className="absolute inset-x-0 top-16 flex justify-center px-3">
          <Reveal>
            <div className="panel w-full max-w-lg p-6 text-center sm:p-8" style={{ boxShadow: "0 0 60px -20px rgba(74,222,158,0.35)" }}>
              <span className="mx-auto flex h-11 w-11 items-center justify-center border border-signal/40 bg-signal/10 text-signal">
                <Lock size={18} />
              </span>
              <h2 className="mt-4 text-xl font-semibold text-fg">90% of this readout is locked</h2>
              <p className="mt-2 text-sm text-fg-mid">
                You are seeing the score and the first two story beats. Unlock the full 14-channel
                readout for {meta.brand}.
              </p>
              <ul className="mx-auto mt-5 space-y-2 text-left text-sm">
                {INCLUDED.map((x) => (
                  <li key={x} className="flex items-start gap-2 text-fg-mid">
                    <Check size={14} className="mt-0.5 shrink-0 text-signal" /> {x}
                  </li>
                ))}
              </ul>
              <div className="mt-6 flex flex-col gap-2">
                <Magnetic>
                  <button type="button" onClick={() => go("payment")} className="btn-primary w-full">
                    Unlock full readout, $149 <ArrowRight size={15} weight="bold" />
                  </button>
                </Magnetic>
                <button
                  type="button"
                  onClick={() => go("access")}
                  className="font-mono text-2xs uppercase tracking-[0.12em] text-fg-low hover:text-signal-bright"
                >
                  I already have an access code
                </button>
              </div>
              <p className="mt-4 font-mono text-2xs text-fg-low">Demo, no real payment is processed. One-time, single audit.</p>
            </div>
          </Reveal>
        </div>
      </div>

      <Footer />
    </main>
  );
}
