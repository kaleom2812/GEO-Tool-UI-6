import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useReducedMotion } from "../lib/hooks.js";

const LINES = [
  "mounting instrument",
  "calibrating probes",
  "opening signal channel",
];

/**
 * One-time boot sequence. Plays on first app load, then unmounts itself.
 * Communicates: "this is an instrument powering on." Skipped under reduced motion.
 */
export default function Boot({ onDone }) {
  const reduced = useReducedMotion();
  const [line, setLine] = useState(0);

  useEffect(() => {
    if (reduced) {
      onDone();
      return;
    }
    const t1 = LINES.map((_, i) => setTimeout(() => setLine(i + 1), 260 + i * 300));
    const done = setTimeout(onDone, 1750);
    return () => {
      t1.forEach(clearTimeout);
      clearTimeout(done);
    };
  }, [reduced, onDone]);

  if (reduced) return null;

  return (
    <motion.div
      className="fixed inset-0 z-overlay flex flex-col items-center justify-center bg-base"
      initial={{ opacity: 1 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      {/* grid draws in */}
      <motion.div
        aria-hidden="true"
        className="absolute inset-0"
        initial={{ opacity: 0, scale: 1.05 }}
        animate={{ opacity: 0.6, scale: 1 }}
        transition={{ duration: 1.1, ease: [0.16, 1, 0.3, 1] }}
        style={{
          backgroundImage:
            "linear-gradient(rgba(74,222,158,0.06) 1px, transparent 1px), linear-gradient(90deg, rgba(74,222,158,0.06) 1px, transparent 1px)",
          backgroundSize: "54px 54px",
          maskImage: "radial-gradient(60% 60% at 50% 50%, black, transparent)",
          WebkitMaskImage: "radial-gradient(60% 60% at 50% 50%, black, transparent)",
        }}
      />
      {/* sweep */}
      <motion.div
        aria-hidden="true"
        className="absolute inset-y-0 w-24"
        initial={{ x: "-20vw" }}
        animate={{ x: "120vw" }}
        transition={{ duration: 1.4, ease: "easeInOut" }}
        style={{ background: "linear-gradient(90deg, transparent, rgba(74,222,158,0.14), transparent)" }}
      />

      <div className="relative text-center">
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="font-mono text-sm font-semibold uppercase tracking-[0.5em] text-fg"
        >
          Signal
        </motion.div>
        <div className="mt-5 h-4 font-mono text-2xs uppercase tracking-[0.2em] text-signal">
          {line > 0 && (
            <motion.span key={line} initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              {LINES[Math.min(line - 1, LINES.length - 1)]}
            </motion.span>
          )}
        </div>
        <div className="mx-auto mt-4 h-px w-40 overflow-hidden bg-line">
          <motion.div
            className="h-full bg-signal"
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 1.55, ease: "easeInOut" }}
            style={{ originX: 0 }}
          />
        </div>
      </div>
    </motion.div>
  );
}
