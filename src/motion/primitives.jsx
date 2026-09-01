import { useEffect, useRef } from "react";
import {
  motion,
  useMotionValue,
  useSpring,
  useTransform,
  useScroll,
  animate,
} from "framer-motion";
import { useInView, useReducedMotion } from "../lib/hooks.js";

const EASE = [0.16, 1, 0.3, 1];

/* ---------- Reveal (enter on scroll) ----------
   Uses the project useInView (immediate-if-visible + safety fallback) rather than
   framer whileInView, so content can never get stuck hidden. */
export function Reveal({ children, as = "div", delay = 0, y = 20, className = "" }) {
  const reduced = useReducedMotion();
  const [ref, inView] = useInView();
  const M = motion[as] || motion.div;
  return (
    <M
      ref={ref}
      initial={reduced ? false : { opacity: 0, y }}
      animate={inView || reduced ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay, ease: EASE }}
      className={`min-w-0 ${className}`}
    >
      {children}
    </M>
  );
}

export function Stagger({ children, className = "", gap = 0.06 }) {
  const [ref, inView] = useInView();
  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={inView ? "show" : "hidden"}
      variants={{ show: { transition: { staggerChildren: gap } } }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

export function StaggerItem({ children, as = "div", y = 18, className = "" }) {
  const reduced = useReducedMotion();
  const M = motion[as] || motion.div;
  return (
    <M
      variants={{
        hidden: reduced ? {} : { opacity: 0, y },
        show: { opacity: 1, y: 0, transition: { duration: 0.55, ease: EASE } },
      }}
      className={`min-w-0 ${className}`}
    >
      {children}
    </M>
  );
}

/* ---------- Counter (motion-value; no per-frame React state) ---------- */
export function Counter({ to, from = 0, duration = 1.4, decimals = 0, format, className = "" }) {
  const reduced = useReducedMotion();
  const [ref, inView] = useInView();
  const mv = useMotionValue(reduced ? to : from);
  const fmt = format || ((v) => v.toLocaleString("en-US", { minimumFractionDigits: decimals, maximumFractionDigits: decimals }));
  const text = useTransform(mv, (v) => fmt(decimals ? v : Math.round(v)));

  useEffect(() => {
    if (reduced) {
      mv.set(to);
      return;
    }
    if (!inView) return;
    const controls = animate(mv, to, { duration, ease: EASE });
    return controls.stop;
  }, [inView, to, duration, reduced]);

  return (
    <span ref={ref} className={className}>
      <motion.span>{text}</motion.span>
    </span>
  );
}

/* ---------- WordReveal (headline mask reveal) ---------- */
export function WordReveal({ text, className = "", wordClassName = "", delay = 0, stagger = 0.055 }) {
  const reduced = useReducedMotion();
  const [ref, inView] = useInView();
  const words = text.split(" ");
  return (
    <span ref={ref} className={className} aria-label={text}>
      {words.map((word, i) => (
        <span key={i} aria-hidden="true" className="inline-block overflow-hidden align-top" style={{ paddingBottom: "0.08em" }}>
          <motion.span
            className={`inline-block ${wordClassName}`}
            initial={reduced ? false : { y: "110%" }}
            animate={inView || reduced ? { y: 0 } : {}}
            transition={{ duration: 0.7, ease: EASE, delay: delay + i * stagger }}
          >
            {word}
            {i < words.length - 1 ? " " : ""}
          </motion.span>
        </span>
      ))}
    </span>
  );
}

/* ---------- Scramble (decode text; writes to DOM, not React state) ---------- */
const GLYPHS = "ABCDEFGHJKLMNPQRSTUVWXYZ0123456789/\\<>=+*";
export function Scramble({ text, className = "", play = true, speed = 34 }) {
  const ref = useRef(null);
  const reduced = useReducedMotion();

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (reduced || !play) {
      el.textContent = text;
      return;
    }
    let frame = 0;
    let raf = 0;
    const total = Math.max(text.length * 2.4, 18);
    const tick = () => {
      frame += 1;
      const progress = frame / total;
      let out = "";
      for (let i = 0; i < text.length; i++) {
        if (text[i] === " ") {
          out += " ";
        } else if (i / text.length < progress) {
          out += text[i];
        } else {
          out += GLYPHS[Math.floor(Math.random() * GLYPHS.length)];
        }
      }
      el.textContent = out;
      if (frame < total) {
        raf = setTimeout(tick, speed);
      } else {
        el.textContent = text;
      }
    };
    tick();
    return () => clearTimeout(raf);
  }, [text, play, reduced, speed]);

  return <span ref={ref} className={className}>{text}</span>;
}

/* ---------- MagneticButton ---------- */
export function Magnetic({ children, strength = 0.35, className = "" }) {
  const reduced = useReducedMotion();
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const sx = useSpring(x, { stiffness: 250, damping: 18, mass: 0.4 });
  const sy = useSpring(y, { stiffness: 250, damping: 18, mass: 0.4 });
  const ref = useRef(null);

  const onMove = (e) => {
    if (reduced) return;
    const r = ref.current?.getBoundingClientRect();
    if (!r) return;
    x.set((e.clientX - (r.left + r.width / 2)) * strength);
    y.set((e.clientY - (r.top + r.height / 2)) * strength);
  };
  const reset = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.div
      ref={ref}
      onPointerMove={onMove}
      onPointerLeave={reset}
      style={{ x: reduced ? 0 : sx, y: reduced ? 0 : sy }}
      className={`inline-block ${className}`}
    >
      {children}
    </motion.div>
  );
}

/* ---------- SpotlightPanel (cursor-reactive border) ---------- */
export function SpotlightPanel({ children, className = "", as = "div" }) {
  const reduced = useReducedMotion();
  const mx = useMotionValue(-200);
  const my = useMotionValue(-200);
  const bg = useTransform(
    [mx, my],
    ([x, y]) => `radial-gradient(220px circle at ${x}px ${y}px, rgba(74,222,158,0.16), transparent 70%)`
  );
  const M = motion[as] || motion.div;

  const onMove = (e) => {
    if (reduced) return;
    const r = e.currentTarget.getBoundingClientRect();
    mx.set(e.clientX - r.left);
    my.set(e.clientY - r.top);
  };
  const leave = () => {
    mx.set(-200);
    my.set(-200);
  };

  return (
    <M onPointerMove={onMove} onPointerLeave={leave} className={`panel group min-w-0 ${className}`}>
      {!reduced && (
        <motion.span
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
          style={{ background: bg }}
        />
      )}
      <span className="relative block">{children}</span>
    </M>
  );
}

/* ---------- ScanRail (scroll progress on the left edge) ---------- */
export function ScanRail() {
  const { scrollYProgress } = useScroll();
  const scaleY = useSpring(scrollYProgress, { stiffness: 120, damping: 30, mass: 0.6 });
  return (
    <div aria-hidden="true" className="fixed left-0 top-0 z-nav hidden h-full w-px bg-line lg:block">
      <motion.div
        className="absolute left-0 top-0 w-px origin-top bg-signal"
        style={{ scaleY, height: "100%", boxShadow: "0 0 12px rgba(74,222,158,0.7)" }}
      />
    </div>
  );
}
