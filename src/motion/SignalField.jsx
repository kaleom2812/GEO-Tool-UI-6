import { useEffect, useRef } from "react";
import { useReducedMotion } from "../lib/hooks.js";

/**
 * Ambient "signal field" background - an oscilloscope-style drifting trace.
 * Isolated leaf: canvas + rAF only, never touches React state, cleans up,
 * pauses when the tab is hidden, and renders a single static frame under
 * reduced motion. Fixed + pointer-events-none so it never repaints on scroll.
 */
export default function SignalField() {
  const canvasRef = useRef(null);
  const reduced = useReducedMotion();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    let raf = 0;
    let w = 0;
    let h = 0;
    let dpr = Math.min(window.devicePixelRatio || 1, 2);

    const resize = () => {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = canvas.clientWidth;
      h = canvas.clientHeight;
      canvas.width = Math.floor(w * dpr);
      canvas.height = Math.floor(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();
    window.addEventListener("resize", resize);

    const GREEN = "74, 222, 158";
    const traces = [
      { amp: 0.06, freq: 0.9, speed: 0.00022, phase: 0, yOff: 0.34, alpha: 0.5 },
      { amp: 0.09, freq: 1.7, speed: -0.00034, phase: 2.1, yOff: 0.66, alpha: 0.32 },
      { amp: 0.04, freq: 3.1, speed: 0.0006, phase: 4.4, yOff: 0.5, alpha: 0.22 },
    ];

    const drawTrace = (t, time) => {
      const midY = h * t.yOff;
      const amp = h * t.amp;
      ctx.beginPath();
      for (let x = 0; x <= w; x += 6) {
        const nx = x / w;
        const y =
          midY +
          Math.sin(nx * Math.PI * 2 * t.freq + time * t.speed * 1000 + t.phase) * amp +
          Math.sin(nx * Math.PI * 2 * t.freq * 2.7 + time * t.speed * 600) * amp * 0.25;
        if (x === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.strokeStyle = `rgba(${GREEN}, ${t.alpha})`;
      ctx.lineWidth = 1;
      ctx.stroke();
    };

    const frame = (time) => {
      ctx.clearRect(0, 0, w, h);
      ctx.globalCompositeOperation = "lighter";
      for (const t of traces) drawTrace(t, time);
      ctx.globalCompositeOperation = "source-over";
      raf = requestAnimationFrame(frame);
    };

    if (reduced) {
      ctx.clearRect(0, 0, w, h);
      ctx.globalCompositeOperation = "lighter";
      for (const t of traces) drawTrace(t, 0);
      ctx.globalCompositeOperation = "source-over";
    } else {
      raf = requestAnimationFrame(frame);
    }

    const onVis = () => {
      if (document.hidden) {
        cancelAnimationFrame(raf);
      } else if (!reduced) {
        raf = requestAnimationFrame(frame);
      }
    };
    document.addEventListener("visibilitychange", onVis);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
      document.removeEventListener("visibilitychange", onVis);
    };
  }, [reduced]);

  return (
    <div aria-hidden="true" className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
      {/* static dot lattice - CSS only, no repaint cost */}
      <div
        className="absolute inset-0 opacity-[0.5]"
        style={{
          backgroundImage:
            "radial-gradient(rgba(255,255,255,0.05) 1px, transparent 1.4px)",
          backgroundSize: "46px 46px",
          maskImage:
            "radial-gradient(120% 90% at 50% 0%, black 30%, transparent 75%)",
          WebkitMaskImage:
            "radial-gradient(120% 90% at 50% 0%, black 30%, transparent 75%)",
        }}
      />
      <canvas ref={canvasRef} className="absolute inset-0 h-full w-full opacity-70" />
      {/* vignette to seat content */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(130% 80% at 50% 8%, transparent 40%, rgba(7,9,11,0.55) 78%, #07090B 100%)",
        }}
      />
    </div>
  );
}
