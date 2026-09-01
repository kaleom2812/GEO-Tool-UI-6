import { useState } from "react";
import { motion } from "framer-motion";
import { useFlow } from "../flow.jsx";
import { meta } from "../data/auditData.js";
import { Check, Lock, ArrowRight, Warning } from "../icons.jsx";
import { Reveal, Magnetic } from "../motion/primitives.jsx";
import { Footer } from "./Chrome.jsx";

const PLANS = [
  { id: "single", name: "Single audit", price: 149, cadence: "one-time", blurb: "This readout for one domain, exportable to PDF." },
  { id: "quarterly", name: "Quarterly tracking", price: 399, cadence: "per quarter", blurb: "Re-audit every 30 days, trend lines, alerting.", popular: true },
  { id: "agency", name: "Agency", price: 1200, cadence: "per month", blurb: "Up to 25 domains, white-label export, API." },
];

export default function Payment() {
  const { go } = useFlow();
  const [plan, setPlan] = useState("single");
  const [status, setStatus] = useState("idle");
  const [card, setCard] = useState({ name: "Sample Buyer", number: "4242 4242 4242 4242", exp: "12 / 29", cvc: "123" });
  const selected = PLANS.find((p) => p.id === plan);

  const submit = (e) => {
    e.preventDefault();
    setStatus("processing");
    setTimeout(() => {
      setStatus("done");
      setTimeout(() => go("access"), 700);
    }, 1400);
  };

  return (
    <main id="main" className="frame py-10">
      <p className="font-mono text-2xs uppercase tracking-[0.16em] text-signal">Step 04 / Access</p>
      <h1 className="mt-3 text-3xl font-semibold tracking-tight text-fg sm:text-4xl">Unlock the {meta.brand} readout</h1>

      <div className="mt-4 flex items-center gap-2 border-l-2 border-warn bg-warn/5 p-3 text-sm text-warn">
        <Warning size={15} /> Demonstration checkout. No payment is processed and nothing is transmitted. The form is
        pre-filled, submit to continue.
      </div>

      <div className="mt-10 grid gap-8 lg:grid-cols-2 lg:gap-16">
        <Reveal>
          <fieldset>
            <legend className="mb-3 font-mono text-2xs uppercase tracking-[0.14em] text-fg-low">Choose a plan</legend>
            <div className="space-y-2.5">
              {PLANS.map((p) => (
                <label
                  key={p.id}
                  className={`flex cursor-pointer items-start gap-3 border p-4 transition-colors ${
                    plan === p.id ? "border-signal bg-signal/5" : "border-line-2 hover:border-fg-low"
                  }`}
                >
                  <input type="radio" name="plan" value={p.id} checked={plan === p.id} onChange={() => setPlan(p.id)} className="mt-1 h-4 w-4 accent-[#4ADE9E]" />
                  <span className="flex-1">
                    <span className="flex flex-wrap items-baseline justify-between gap-2">
                      <span className="text-sm font-semibold text-fg">
                        {p.name}
                        {p.popular && (
                          <span className="ml-2 bg-signal px-1.5 py-0.5 font-mono text-2xs font-medium uppercase tracking-wide text-base">
                            Popular
                          </span>
                        )}
                      </span>
                      <span className="data-fig text-sm text-fg">
                        ${p.price}
                        <span className="text-fg-low"> / {p.cadence}</span>
                      </span>
                    </span>
                    <span className="mt-1 block text-sm text-fg-mid">{p.blurb}</span>
                  </span>
                </label>
              ))}
            </div>

            <div className="mt-5 border border-line bg-base-1 p-4 font-mono text-sm">
              <div className="flex items-center justify-between">
                <span className="text-fg-mid">{selected.name}</span>
                <span className="data-fig text-fg">${selected.price}.00</span>
              </div>
              <div className="mt-1 flex items-center justify-between text-fg-low">
                <span>Tax (demo)</span>
                <span className="data-fig">$0.00</span>
              </div>
              <div className="mt-3 flex items-center justify-between border-t border-line pt-3 font-semibold text-fg">
                <span>Total</span>
                <span className="data-fig text-signal-bright">${selected.price}.00</span>
              </div>
            </div>
          </fieldset>
        </Reveal>

        <Reveal delay={0.08}>
          <form onSubmit={submit} className="panel p-5 sm:p-7">
            <p className="flex items-center gap-2 text-sm font-semibold text-fg">
              <Lock size={14} className="text-signal" /> Payment details
            </p>
            <div className="mt-5 space-y-4">
              {[
                ["name", "Name on card", "cc-name", false],
                ["number", "Card number", "cc-number", true],
              ].map(([k, label, auto, mono]) => (
                <div key={k}>
                  <label htmlFor={k} className="mb-1.5 block text-sm font-medium text-fg">{label}</label>
                  <input
                    id={k}
                    autoComplete={auto}
                    value={card[k]}
                    onChange={(e) => setCard((c) => ({ ...c, [k]: e.target.value }))}
                    className={`w-full rounded border border-line-2 bg-base px-3.5 py-2.5 text-sm text-fg outline-none focus:border-signal ${mono ? "data-fig" : "font-mono"}`}
                  />
                </div>
              ))}
              <div className="grid grid-cols-2 gap-4">
                {[["exp", "Expiry", "cc-exp"], ["cvc", "CVC", "cc-csc"]].map(([k, label, auto]) => (
                  <div key={k}>
                    <label htmlFor={k} className="mb-1.5 block text-sm font-medium text-fg">{label}</label>
                    <input
                      id={k}
                      autoComplete={auto}
                      value={card[k]}
                      onChange={(e) => setCard((c) => ({ ...c, [k]: e.target.value }))}
                      className="data-fig w-full rounded border border-line-2 bg-base px-3.5 py-2.5 text-sm text-fg outline-none focus:border-signal"
                    />
                  </div>
                ))}
              </div>
            </div>
            <p className="mt-3 font-mono text-2xs text-fg-low">These fields are inert. Nothing is sent, stored, or charged.</p>
            <Magnetic className="mt-6 w-full">
              <button type="submit" disabled={status !== "idle"} className="btn-primary w-full disabled:opacity-60">
                {status === "idle" && (
                  <>
                    Pay ${selected.price} and unlock <ArrowRight size={15} weight="bold" />
                  </>
                )}
                {status === "processing" && (
                  <>
                    <motion.span
                      className="h-3.5 w-3.5 rounded-full border-2 border-base/40 border-t-base"
                      animate={{ rotate: 360 }}
                      transition={{ repeat: Infinity, duration: 0.8, ease: "linear" }}
                    />
                    Processing
                  </>
                )}
                {status === "done" && (
                  <>
                    <Check size={15} weight="bold" /> Payment confirmed
                  </>
                )}
              </button>
            </Magnetic>
            <p role="status" aria-live="polite" className="sr-only">
              {status === "processing" ? "Processing payment" : status === "done" ? "Payment confirmed" : ""}
            </p>
          </form>
        </Reveal>
      </div>

      <Footer />
    </main>
  );
}
