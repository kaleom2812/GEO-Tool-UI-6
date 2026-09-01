import { useRef, useState } from "react";
import { useFlow } from "../flow.jsx";
import { meta } from "../data/auditData.js";
import { Check, ArrowRight, Warning, LockOpen } from "../icons.jsx";
import { Reveal, Magnetic, Scramble } from "../motion/primitives.jsx";
import { Footer } from "./Chrome.jsx";

export default function AccessCode() {
  const { accessCode, unlock, go } = useFlow();
  const [value, setValue] = useState("");
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);
  const inputRef = useRef(null);

  const submit = (e) => {
    e.preventDefault();
    if (value.trim().toUpperCase() === accessCode.toUpperCase()) {
      setError("");
      unlock();
      go("report");
    } else {
      setError("That code does not match. Copy the demo code above and try again.");
      inputRef.current?.focus();
    }
  };

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(accessCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      setCopied(false);
    }
  };

  return (
    <main id="main" className="frame flex min-h-[70vh] flex-col justify-center py-14">
      <div className="mx-auto w-full max-w-lg">
        <Reveal>
          <span className="flex h-11 w-11 items-center justify-center border border-signal/40 bg-signal/10 text-signal">
            <LockOpen size={18} />
          </span>
          <h1 className="mt-4 text-3xl font-semibold tracking-tight text-fg">Access granted</h1>
          <p className="mt-2 text-sm text-fg-mid">
            Payment confirmed for the {meta.brand} readout. Your demo access code is below. Enter it to
            open the full readout. It also unlocks on this device next time.
          </p>
        </Reveal>

        <Reveal delay={0.08}>
          <div className="panel mt-7 p-5" style={{ boxShadow: "0 0 40px -18px rgba(74,222,158,0.4)" }}>
            <p className="mb-2 font-mono text-2xs uppercase tracking-[0.14em] text-fg-low">Demo access code</p>
            <div className="flex items-center justify-between gap-3">
              <code className="data-fig text-xl font-semibold tracking-[0.14em] text-signal-bright">
                <Scramble text={accessCode} />
              </code>
              <button type="button" onClick={copy} className="btn-ghost h-9 px-3 text-2xs">
                {copied ? (
                  <>
                    <Check size={13} /> Copied
                  </>
                ) : (
                  "Copy"
                )}
              </button>
            </div>
          </div>
        </Reveal>

        <Reveal delay={0.12}>
          <form onSubmit={submit} className="mt-5">
            <label htmlFor="code" className="mb-1.5 block text-sm font-medium text-fg">Enter access code</label>
            <div className="flex flex-col gap-2 sm:flex-row">
              <input
                ref={inputRef}
                id="code"
                value={value}
                onChange={(e) => setValue(e.target.value)}
                placeholder={accessCode}
                aria-invalid={!!error}
                aria-describedby={error ? "code-err" : undefined}
                className={`data-fig w-full rounded border bg-base px-3.5 py-2.5 text-sm uppercase tracking-[0.12em] text-fg outline-none focus:border-signal ${
                  error ? "border-crit" : "border-line-2"
                }`}
              />
              <Magnetic className="shrink-0">
                <button type="submit" className="btn-primary">
                  Open readout <ArrowRight size={15} weight="bold" />
                </button>
              </Magnetic>
            </div>
            {error && (
              <p id="code-err" role="alert" className="mt-2 flex items-center gap-1.5 font-mono text-2xs text-crit">
                <Warning size={12} /> {error}
              </p>
            )}
            <button
              type="button"
              onClick={() => setValue(accessCode)}
              className="mt-3 font-mono text-2xs text-fg-low underline underline-offset-2 hover:text-signal-bright"
            >
              Fill code for me
            </button>
          </form>
        </Reveal>
      </div>
      <Footer />
    </main>
  );
}
