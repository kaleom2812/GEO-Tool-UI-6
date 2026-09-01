import { useEffect, useMemo, useRef, useState } from "react";
import { motion } from "framer-motion";
import { useFlow } from "../flow.jsx";
import { meta, score, executiveSummary } from "../data/auditData.js";
import { ScoreCore } from "../charts.jsx";
import { Chip } from "../ui.jsx";
import { Reveal } from "../motion/primitives.jsx";
import { Printer, ArrowLeft, House } from "../icons.jsx";
import { Footer } from "../screens/Chrome.jsx";
import { REPORT_SECTIONS } from "./sections.jsx";
import Decrypt from "./Decrypt.jsx";

function useScrollSpy(ids) {
  const [active, setActive] = useState(ids[0]);
  useEffect(() => {
    const els = ids.map((id) => document.getElementById(id)).filter(Boolean);
    const io = new IntersectionObserver(
      (entries) => {
        const vis = entries.filter((e) => e.isIntersecting).sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (vis[0]) setActive(vis[0].target.id);
      },
      { rootMargin: "-22% 0px -70% 0px" }
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, [ids]);
  return active;
}

export default function Report({ onExitToPreview }) {
  const { restart } = useFlow();
  const ids = useMemo(() => REPORT_SECTIONS.map((s) => s.id), []);
  const active = useScrollSpy(ids);
  const decryptShown = useRef(false);
  const [decrypting, setDecrypting] = useState(() => {
    if (decryptShown.current) return false;
    decryptShown.current = true;
    return true;
  });

  return (
    <main id="main" className="frame py-8">
      {decrypting && <Decrypt onDone={() => setDecrypting(false)} />}

      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="font-mono text-2xs uppercase tracking-[0.16em] text-signal">Full readout / {meta.auditId}</p>
        <div className="flex gap-2">
          <button type="button" onClick={restart} className="btn-ghost h-9 px-3 text-2xs">
            <House size={13} /> Home
          </button>
          <button type="button" onClick={() => window.print()} className="btn-ghost h-9 px-3 text-2xs">
            <Printer size={13} /> Export
          </button>
          {onExitToPreview && (
            <button type="button" onClick={onExitToPreview} className="btn-ghost h-9 px-3 text-2xs">
              <ArrowLeft size={13} /> Preview
            </button>
          )}
        </div>
      </div>

      {/* cover */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className="panel mt-5 grid gap-8 p-6 sm:p-10 lg:grid-cols-[1fr_minmax(0,300px)]"
      >
        <div>
          <p className="font-mono text-2xs uppercase tracking-[0.14em] text-fg-low">Prepared for</p>
          <h1 className="mt-1.5 text-4xl font-semibold tracking-tight text-fg sm:text-5xl">{meta.brand}</h1>
          <p className="mt-1 font-mono text-2xs text-fg-low">
            {meta.domain} / {meta.industry}
          </p>
          <p className="mt-5 max-w-[58ch] text-sm leading-relaxed text-fg-mid">{executiveSummary.verdict}</p>
          <div className="mt-6 flex flex-wrap gap-x-8 gap-y-3 border-t border-line pt-5">
            {executiveSummary.headlineMetrics.map((m) => (
              <div key={m.label}>
                <p className="data-fig text-xl text-fg">{m.value}</p>
                <p className="font-mono text-2xs uppercase tracking-[0.1em] text-fg-low">{m.label}</p>
              </div>
            ))}
          </div>
        </div>
        <div className="flex flex-col items-center justify-center border border-line bg-base/60 p-5">
          <ScoreCore value={score.overall} grade={score.grade} sub={score.tier} size={220} />
          <Chip tone="good">+{score.delta} QoQ</Chip>
        </div>
      </motion.div>

      {/* body */}
      <div className="mt-6 lg:grid lg:grid-cols-[200px_1fr] lg:gap-10">
        <nav aria-label="Contents" className="hidden lg:block">
          <div className="sticky top-24">
            <p className="mb-3 font-mono text-2xs uppercase tracking-[0.14em] text-fg-low">Channels</p>
            <ol className="space-y-0.5 border-l border-line">
              {REPORT_SECTIONS.map((s, i) => (
                <li key={s.id}>
                  <a
                    href={`#${s.id}`}
                    className={`-ml-px flex gap-2 border-l-2 py-1.5 pl-3 font-mono text-2xs transition-colors ${
                      active === s.id ? "border-signal text-signal" : "border-transparent text-fg-low hover:text-fg-mid"
                    }`}
                  >
                    <span className="data-fig">{String(i + 1).padStart(2, "0")}</span>
                    {s.label}
                  </a>
                </li>
              ))}
            </ol>
          </div>
        </nav>

        <div className="min-w-0">
          {REPORT_SECTIONS.map(({ id, Component }) => (
            <Component key={id} />
          ))}

          <div className="mt-14 border border-line bg-base-1 p-6 text-center sm:p-10">
            <p className="text-lg font-semibold text-fg">End of readout</p>
            <p className="mt-1.5 font-mono text-2xs uppercase tracking-[0.12em] text-fg-low">
              {meta.auditId} / SIGNAL GEO instrument / demonstration data
            </p>
            <button type="button" onClick={restart} className="btn-ghost mx-auto mt-5">
              Run another audit
            </button>
          </div>
        </div>
      </div>

      <Footer />
    </main>
  );
}
