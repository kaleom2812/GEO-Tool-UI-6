import { useEffect, useMemo, useRef, useState } from "react";
import { motion } from "framer-motion";
import { useFlow } from "../flow.jsx";
import { useReducedMotion } from "../lib/hooks.js";
import { Check } from "../icons.jsx";
import { Footer } from "./Chrome.jsx";

const MODELS = ["GPT-4o", "Claude", "Perplexity", "Gemini", "Copilot"];

const STAGES = [
  { line: "signal.acquire --target rivetcrm.com --models 5", ms: 550, kind: "cmd" },
  { line: "prompt set expanded to 60 buyer intents", ms: 750, kind: "ok" },
  { line: "probing GPT-4o", ms: 620, kind: "run", model: 0 },
  { line: "probing Claude", ms: 600, kind: "run", model: 1 },
  { line: "probing Perplexity", ms: 600, kind: "run", model: 2 },
  { line: "probing Gemini", ms: 600, kind: "run", model: 3 },
  { line: "probing Copilot", ms: 600, kind: "run", model: 4 },
  { line: "robots.txt disallows GPTBot, flag raised", ms: 650, kind: "warn" },
  { line: "crawling 214 pages, rendered and raw", ms: 950, kind: "run" },
  { line: "diffing JS render against source HTML", ms: 650, kind: "run" },
  { line: "extracting citations from 300 answers", ms: 750, kind: "run" },
  { line: "resolving entity graph and knowledge panel", ms: 700, kind: "run" },
  { line: "computing share of voice against 5 competitors", ms: 700, kind: "run" },
  { line: "scoring six signals, GEO 61 of 100", ms: 800, kind: "ok" },
  { line: "readout assembled", ms: 500, kind: "ok" },
];

const KIND_COLOR = { cmd: "text-fg-low", ok: "text-signal", run: "text-fg-mid", warn: "text-warn" };

export default function Processing() {
  const { go } = useFlow();
  const reduced = useReducedMotion();
  const [n, setN] = useState(0);
  const logRef = useRef(null);

  const total = useMemo(() => STAGES.reduce((s, x) => s + x.ms, 0), []);
  const modelsLit = useMemo(() => {
    const lit = new Set();
    STAGES.slice(0, n).forEach((s) => {
      if (s.model != null) lit.add(s.model);
    });
    return lit;
  }, [n]);

  useEffect(() => {
    let acc = 0;
    const factor = reduced ? 0.28 : 1;
    const timers = [];
    STAGES.forEach((_, i) => {
      acc += STAGES[i].ms * factor;
      timers.push(setTimeout(() => setN(i + 1), acc));
    });
    timers.push(setTimeout(() => go("preview"), acc + (reduced ? 200 : 750)));
    return () => timers.forEach(clearTimeout);
  }, [go, reduced]);

  useEffect(() => {
    logRef.current?.scrollTo({ top: logRef.current.scrollHeight });
  }, [n]);

  const pct = Math.round((n / STAGES.length) * 100);
  const done = n >= STAGES.length;

  return (
    <main id="main" className="frame flex min-h-[74vh] flex-col justify-center py-12">
      <p className="font-mono text-2xs uppercase tracking-[0.16em] text-signal">Step 02 / Signal acquisition</p>
      <h1 className="mt-3 text-3xl font-semibold tracking-tight text-fg sm:text-4xl">Acquiring signal</h1>

      <div className="mt-12 grid gap-8 lg:grid-cols-[minmax(0,360px)_1fr]">
        {/* CORE */}
        <div className="panel flex items-center justify-center p-6">
          <div className="relative aspect-square w-full max-w-[300px]">
            <svg viewBox="0 0 300 300" className="w-full" aria-hidden="true">
              {/* rings */}
              {[130, 100, 70].map((r, i) => (
                <motion.circle
                  key={r}
                  cx="150"
                  cy="150"
                  r={r}
                  fill="none"
                  stroke="#1E252B"
                  strokeWidth="1"
                  style={{ originX: "50%", originY: "50%" }}
                  animate={reduced ? {} : { rotate: i % 2 ? -360 : 360 }}
                  transition={{ duration: 40 + i * 20, ease: "linear", repeat: Infinity }}
                  strokeDasharray={i === 0 ? "2 6" : i === 1 ? "40 12" : undefined}
                />
              ))}

              {/* progress ring */}
              <circle cx="150" cy="150" r="142" fill="none" stroke="#1E252B" strokeWidth="2" />
              <motion.circle
                cx="150"
                cy="150"
                r="142"
                fill="none"
                stroke="#4ADE9E"
                strokeWidth="2"
                strokeLinecap="round"
                pathLength={1}
                strokeDasharray="1 1"
                animate={{ strokeDashoffset: 1 - (done ? 1 : pct / 100) }}
                transition={{ duration: 0.5, ease: "easeOut" }}
                style={{ rotate: -90, originX: "50%", originY: "50%", filter: "drop-shadow(0 0 6px rgba(74,222,158,0.6))" }}
              />

              {/* sweep */}
              {!reduced && (
                <motion.g
                  style={{ originX: "50%", originY: "50%" }}
                  animate={{ rotate: 360 }}
                  transition={{ duration: 3.4, ease: "linear", repeat: Infinity }}
                >
                  <line x1="150" y1="150" x2="150" y2="20" stroke="#7BF0BD" strokeWidth="1.5" opacity="0.7" />
                  <path d="M150 150 L150 20 A130 130 0 0 1 230 55 Z" fill="#4ADE9E" opacity="0.06" />
                </motion.g>
              )}

              {/* model nodes on the middle ring */}
              {MODELS.map((m, i) => {
                const a = (i / MODELS.length) * Math.PI * 2 - Math.PI / 2;
                const x = 150 + 100 * Math.cos(a);
                const y = 150 + 100 * Math.sin(a);
                const lit = modelsLit.has(i);
                return (
                  <g key={m}>
                    {lit && <line x1="150" y1="150" x2={x} y2={y} stroke="#4ADE9E" strokeWidth="1" opacity="0.4" />}
                    <motion.rect
                      x={x - 4}
                      y={y - 4}
                      width="8"
                      height="8"
                      fill={lit ? "#4ADE9E" : "#12161A"}
                      stroke={lit ? "#7BF0BD" : "#2C353D"}
                      strokeWidth="1"
                      animate={lit && !reduced ? { scale: [1, 1.5, 1] } : {}}
                      transition={{ duration: 0.5 }}
                      style={{ originX: `${x}px`, originY: `${y}px`, filter: lit ? "drop-shadow(0 0 5px rgba(74,222,158,0.8))" : "none" }}
                    />
                  </g>
                );
              })}
              <rect x="146" y="146" width="8" height="8" fill="#7BF0BD" />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="data-fig text-3xl font-semibold text-fg">{done ? 100 : pct}%</span>
              <span className="mt-1 font-mono text-2xs uppercase tracking-[0.14em] text-fg-low">{done ? "complete" : "scanning"}</span>
            </div>
          </div>
        </div>

        {/* LOG */}
        <div className="panel overflow-hidden">
          <div className="flex items-center gap-2 border-b border-line px-3 py-2 font-mono text-2xs uppercase tracking-[0.12em] text-fg-low">
            <span className="text-signal">{">"}</span> signal.acquire
          </div>
          <div ref={logRef} className="h-[280px] overflow-y-auto p-3 font-mono text-xs leading-relaxed sm:h-[340px]">
            {STAGES.slice(0, n).map((s, i) => (
              <motion.p
                key={i}
                initial={reduced ? false : { opacity: 0, x: -6 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.2 }}
                className="flex gap-2"
              >
                <span className="shrink-0 text-fg-low/60">{String(i + 1).padStart(2, "0")}</span>
                <span className={KIND_COLOR[s.kind]}>
                  {s.kind === "ok" ? "[ok] " : s.kind === "warn" ? "[!] " : s.kind === "cmd" ? "$ " : "> "}
                  {s.line}
                </span>
              </motion.p>
            ))}
            {!done && <span className="ml-6 inline-block h-3.5 w-[7px] animate-pulse bg-signal align-middle" aria-hidden="true" />}
          </div>
        </div>
      </div>

      <div className="mt-6 flex items-center justify-between gap-4">
        <div className="h-px w-full max-w-md bg-line">
          <motion.div
            className="h-px bg-signal"
            animate={{ width: `${done ? 100 : pct}%` }}
            transition={{ duration: 0.4 }}
            style={{ boxShadow: "0 0 8px rgba(74,222,158,0.7)" }}
          />
        </div>
        <button
          type="button"
          onClick={() => go("preview")}
          className="shrink-0 font-mono text-2xs uppercase tracking-[0.12em] text-fg-low transition-colors hover:text-signal-bright"
        >
          Skip
        </button>
      </div>

      <p role="status" aria-live="polite" className="sr-only">
        {done ? "Scan complete. Opening readout." : `${pct} percent. ${STAGES[Math.min(n, STAGES.length - 1)].line}`}
      </p>
      <p className="mt-3 font-mono text-2xs uppercase tracking-[0.12em] text-fg-low">
        est {Math.ceil((total / 1000) * (reduced ? 0.28 : 1))}s {done && <span className="text-signal">/ done</span>}
      </p>

      <Footer />
    </main>
  );
}
