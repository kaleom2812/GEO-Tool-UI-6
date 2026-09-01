import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useReducedMotion } from "../lib/hooks.js";

/** Brief "access granted / decrypting" flash shown once when the full report opens. */
export default function Decrypt({ onDone }) {
  const reduced = useReducedMotion();
  const [phase, setPhase] = useState(0);

  useEffect(() => {
    if (reduced) {
      onDone();
      return;
    }
    const t1 = setTimeout(() => setPhase(1), 420);
    const t2 = setTimeout(onDone, 1250);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, [reduced, onDone]);

  if (reduced) return null;

  return (
    <motion.div
      className="fixed inset-0 z-overlay flex items-center justify-center bg-base"
      initial={{ opacity: 1 }}
      animate={{ opacity: phase === 1 ? 0 : 1 }}
      transition={{ duration: 0.5, delay: phase === 1 ? 0.35 : 0 }}
    >
      <motion.div
        aria-hidden="true"
        className="absolute inset-x-0 h-40"
        initial={{ y: "-30vh" }}
        animate={{ y: "130vh" }}
        transition={{ duration: 1.1, ease: "easeInOut" }}
        style={{ background: "linear-gradient(180deg, transparent, rgba(74,222,158,0.12), transparent)" }}
      />
      <div className="text-center">
        <motion.p
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          className="font-mono text-sm font-semibold uppercase tracking-[0.4em] text-signal"
        >
          Access granted
        </motion.p>
        <p className="mt-3 font-mono text-2xs uppercase tracking-[0.2em] text-fg-low">Decrypting readout</p>
      </div>
    </motion.div>
  );
}
