import { useRef, useState } from "react";
import { useFlow } from "../flow.jsx";
import { ArrowRight, Warning, Check } from "../icons.jsx";
import { Reveal, Magnetic } from "../motion/primitives.jsx";
import { Footer } from "./Chrome.jsx";

const FIELDS = [
  { name: "url", label: "Website URL", type: "url", required: true, hint: "The domain to audit. Up to 250 pages are crawled.", placeholder: "https://example.com", autoComplete: "url" },
  { name: "brand", label: "Brand name", type: "text", required: true, hint: "Used to match brand mentions inside AI answers." },
  { name: "industry", label: "Category", type: "text", required: false, hint: "Selects the benchmark cohort." },
  { name: "competitors", label: "Competitors", type: "text", required: false, hint: "Comma separated. Share of voice is measured against these." },
  { name: "market", label: "Primary market", type: "text", required: false, hint: "Region used for localized model probing." },
];

function validate(v) {
  const e = {};
  if (!v.url.trim()) e.url = "Enter the website URL to audit.";
  else if (!/^https?:\/\/[^\s.]+\.[^\s]{2,}/i.test(v.url.trim())) e.url = "Enter a full URL including https://";
  if (!v.brand.trim()) e.brand = "Enter the brand name so mentions can be matched.";
  return e;
}

export default function AuditInput() {
  const { input, setInput, go } = useFlow();
  const [values, setValues] = useState(input);
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const summaryRef = useRef(null);
  const refs = useRef({});
  const set = (n, val) => setValues((s) => ({ ...s, [n]: val }));

  const onSubmit = (e) => {
    e.preventDefault();
    const errs = validate(values);
    setErrors(errs);
    setTouched({ url: true, brand: true });
    if (Object.keys(errs).length) {
      requestAnimationFrame(() => summaryRef.current?.focus());
      return;
    }
    setInput(values);
    go("processing");
  };

  const errList = Object.entries(errors);

  return (
    <main id="main" className="frame py-12">
      <div className="grid gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:gap-16">
        <Reveal>
          <div className="lg:sticky lg:top-24 lg:self-start">
            <p className="font-mono text-2xs uppercase tracking-[0.16em] text-signal">Step 01</p>
            <h1 className="mt-3 text-3xl font-semibold tracking-tight text-fg sm:text-4xl">Target brief</h1>
            <p className="mt-4 text-sm leading-relaxed text-fg-mid">
              Everything is pre-filled with a live sample. Adjust or run as is.
            </p>
            <ol className="mt-8 space-y-2.5 font-mono text-xs text-fg-mid">
              {[
                "Probe 5 AI models, 900 runs",
                "Crawl the site, rendered and raw",
                "Extract citations and entity signals",
                "Score six weighted signals",
                "Assemble the readout",
              ].map((s, i) => (
                <li key={s} className="flex items-start gap-3">
                  <span className="data-fig text-fg-low">{String(i + 1).padStart(2, "0")}</span>
                  <span>{s}</span>
                </li>
              ))}
            </ol>
          </div>
        </Reveal>

        <Reveal delay={0.08}>
          <form onSubmit={onSubmit} noValidate className="panel p-5 sm:p-7">
            {errList.length > 0 && (
              <div ref={summaryRef} tabIndex={-1} role="alert" className="mb-6 border-l-2 border-crit bg-crit/5 p-4">
                <p className="flex items-center gap-2 font-mono text-2xs font-semibold uppercase tracking-[0.12em] text-crit">
                  <Warning size={14} /> Fix {errList.length} field{errList.length > 1 ? "s" : ""} to continue
                </p>
                <ul className="mt-2 list-inside list-disc text-sm text-crit/90">
                  {errList.map(([k, v]) => (
                    <li key={k}>
                      <button type="button" className="underline underline-offset-2" onClick={() => refs.current[k]?.focus()}>
                        {v}
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <div className="space-y-5">
              {FIELDS.map((f) => {
                const err = touched[f.name] && errors[f.name];
                return (
                  <div key={f.name}>
                    <label htmlFor={f.name} className="mb-2 flex items-center gap-1.5 text-sm font-medium text-fg">
                      {f.label}
                      {f.required && <span className="text-crit" aria-hidden="true">*</span>}
                      {f.required && <span className="sr-only">(required)</span>}
                    </label>
                    <input
                      ref={(el) => (refs.current[f.name] = el)}
                      id={f.name}
                      type={f.type}
                      inputMode={f.type === "url" ? "url" : undefined}
                      autoComplete={f.autoComplete}
                      placeholder={f.placeholder}
                      value={values[f.name]}
                      onChange={(e) => set(f.name, e.target.value)}
                      onBlur={() => {
                        setTouched((t) => ({ ...t, [f.name]: true }));
                        setErrors(validate(values));
                      }}
                      aria-invalid={!!err}
                      aria-describedby={`${f.name}-hint ${err ? `${f.name}-err` : ""}`}
                      className={`w-full rounded border bg-base px-3.5 py-2.5 font-mono text-sm text-fg outline-none transition-colors placeholder:text-fg-low focus:border-signal ${
                        err ? "border-crit" : "border-line-2"
                      }`}
                    />
                    <p id={`${f.name}-hint`} className="mt-1.5 text-2xs text-fg-low">{f.hint}</p>
                    {err && (
                      <p id={`${f.name}-err`} className="mt-1 flex items-center gap-1.5 font-mono text-2xs text-crit">
                        <Warning size={12} /> {err}
                      </p>
                    )}
                  </div>
                );
              })}

              <div>
                <label htmlFor="prompts" className="mb-2 block text-sm font-medium text-fg">Target prompts</label>
                <textarea
                  id="prompts"
                  rows={5}
                  value={values.prompts}
                  onChange={(e) => set("prompts", e.target.value)}
                  aria-describedby="prompts-hint"
                  className="w-full rounded border border-line-2 bg-base px-3.5 py-2.5 font-mono text-sm leading-relaxed text-fg outline-none focus:border-signal"
                />
                <p id="prompts-hint" className="mt-1.5 text-2xs text-fg-low">
                  One prompt per line. Expanded to a 60-prompt set spanning discovery, alternative-to,
                  head-to-head, feature, and trust intents.
                </p>
              </div>
            </div>

            <div className="mt-7 flex flex-col gap-3 border-t border-line pt-6 sm:flex-row sm:items-center sm:justify-between">
              <p className="flex items-center gap-2 font-mono text-2xs text-fg-low">
                <Check size={13} className="text-signal" /> No account, runs in your browser
              </p>
              <Magnetic>
                <button type="submit" className="btn-primary">
                  Run the audit <ArrowRight size={15} weight="bold" />
                </button>
              </Magnetic>
            </div>
          </form>
        </Reveal>
      </div>
      <Footer />
    </main>
  );
}
