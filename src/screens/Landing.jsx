import { useFlow } from "../flow.jsx";
import { pillars } from "../data/auditData.js";
import { ArrowRight, CaretRight } from "../icons.jsx";
import { ScoreCore, Meter, Trace } from "../charts.jsx";
import { Reveal, Stagger, StaggerItem, WordReveal, Magnetic, Counter, SpotlightPanel } from "../motion/primitives.jsx";
import { SectionHeader } from "../ui.jsx";
import { Footer } from "./Chrome.jsx";

const CHAIN = [
  ["Problem", "State the visibility gap in the buyer's own words."],
  ["Evidence", "Show the AI answers, citations, and files that prove it."],
  ["Impact", "Convert the gap into sessions and pipeline at risk."],
  ["Recommendation", "Sequence the fix by leverage, not by effort."],
  ["Action", "Hand over a dated 90-day plan with owners."],
];

export default function Landing() {
  const { go } = useFlow();

  return (
    <main id="main">
      {/* HERO - asymmetric split */}
      <section className="frame grid items-center gap-12 pt-16 sm:pt-20 lg:grid-cols-[1.05fr_0.95fr] lg:gap-8 lg:pt-24">
        <div>
          <h1 className="text-4xl font-semibold leading-[1.06] tracking-tight text-fg sm:text-5xl lg:text-6xl">
            <WordReveal text="See how" />{" "}
            <span className="italic text-signal-bright" style={{ lineHeight: 1.1 }}>
              <WordReveal text="AI answers" delay={0.12} />
            </span>{" "}
            <WordReveal text="describe your brand." delay={0.24} />
          </h1>
          <Reveal delay={0.5}>
            <p className="mt-6 max-w-[52ch] text-base leading-relaxed text-fg-mid">
              SIGNAL probes five assistants, crawls your site, and returns a live readout of how AI
              search sees you.
            </p>
          </Reveal>
          <Reveal delay={0.6}>
            <div className="mt-8 flex flex-wrap items-center gap-3">
              <Magnetic>
                <button type="button" onClick={() => go("input")} className="btn-primary">
                  Run an audit <ArrowRight size={15} weight="bold" />
                </button>
              </Magnetic>
              <a href="#method" className="btn-ghost">
                How it works
              </a>
            </div>
          </Reveal>
        </div>

        {/* live instrument - a real component, not a mockup */}
        <Reveal delay={0.3} y={28}>
          <SpotlightPanel className="p-6 sm:p-8">
            <div className="flex items-center justify-between font-mono text-2xs uppercase tracking-[0.14em] text-fg-low">
              <span>Sample target</span>
              <span className="text-signal">live</span>
            </div>
            <div className="mt-4">
              <ScoreCore value={61} grade="C+" sub="Emerging visibility" size={260} />
            </div>
            <div className="mt-6 grid grid-cols-3 divide-x divide-line border-t border-line pt-4 text-center">
              {[
                ["AI presence", "31", "%"],
                ["Share of voice", "9", "%"],
                ["Rank", "4", "/6"],
              ].map(([label, n, suffix]) => (
                <div key={label} className="px-2">
                  <p className="data-fig text-lg text-fg">
                    <Counter to={Number(n)} />
                    <span className="text-fg-low">{suffix}</span>
                  </p>
                  <p className="mt-0.5 font-mono text-2xs uppercase tracking-[0.08em] text-fg-low">{label}</p>
                </div>
              ))}
            </div>
          </SpotlightPanel>
        </Reveal>
      </section>

      {/* MEASURES - data list (not cards) */}
      <section className="frame mt-28">
        <SectionHeader
          title="Six weighted signals, one score"
          lede="Each signal is scored 0 to 100 against a 40-brand benchmark, then weighted into the headline GEO score."
        />
        <Stagger className="mt-10 border-t border-line" gap={0.05}>
          {pillars.map((p, i) => (
            <StaggerItem
              as="div"
              key={p.key}
              className="grid grid-cols-1 gap-3 border-b border-line py-5 sm:grid-cols-[2.5rem_1fr_9rem_4rem] sm:items-center sm:gap-6"
            >
              <span className="data-fig text-sm text-fg-low">{String(i + 1).padStart(2, "0")}</span>
              <div>
                <h3 className="text-base font-medium text-fg">{p.label}</h3>
                <p className="mt-1 max-w-[54ch] text-sm text-fg-mid">{p.headline}</p>
              </div>
              <div className="hidden sm:block">
                <Meter value={p.score} tone={p.score >= 70 ? "good" : p.score >= 50 ? "warn" : "bad"} />
              </div>
              <span className="font-mono text-2xs uppercase tracking-[0.1em] text-fg-low sm:text-right">
                {Math.round(p.weight * 100)}% wt
              </span>
            </StaggerItem>
          ))}
        </Stagger>
      </section>

      {/* METHOD - connected sequence */}
      <section id="method" className="frame mt-28 scroll-mt-20">
        <SectionHeader
          kicker="Method"
          title="Every finding runs the same chain"
          lede="The readout never dumps raw metrics. Each section moves from the buyer's problem to a shipped action."
        />
        <ol className="mt-10 grid gap-px overflow-hidden border border-line bg-line sm:grid-cols-5">
          {CHAIN.map(([stage, line], i) => (
            <Reveal as="li" key={stage} delay={i * 0.06} className="bg-base-1 p-5">
              <div className="flex items-center gap-2 font-mono text-2xs uppercase tracking-[0.12em] text-signal">
                <span className="data-fig text-fg-low">{String(i + 1).padStart(2, "0")}</span>
                {stage}
              </div>
              <p className="mt-2 text-sm leading-relaxed text-fg-mid">{line}</p>
              {i < CHAIN.length - 1 && (
                <CaretRight size={12} className="mt-3 hidden text-fg-low sm:block" aria-hidden="true" />
              )}
            </Reveal>
          ))}
        </ol>
      </section>

      {/* STAT MOMENT - full width */}
      <section className="frame mt-28">
        <div className="grid items-center gap-10 lg:grid-cols-[0.9fr_1.1fr]">
          <Reveal>
            <p className="text-sm leading-relaxed text-fg-mid">
              When buyers ask an assistant which product to choose, the sample brand shows up in
              roughly a third of the answers, while the category leader shows up in more than three
              quarters. That gap compounds every quarter as models cache the brands they already
              trust.
            </p>
            <div className="mt-6 flex items-end gap-6">
              <div>
                <p className="data-fig text-5xl font-semibold text-signal-bright">
                  <Counter to={31} />%
                </p>
                <p className="mt-1 font-mono text-2xs uppercase tracking-[0.1em] text-fg-low">sample brand presence</p>
              </div>
              <div>
                <p className="data-fig text-3xl font-semibold text-fg-mid">78%</p>
                <p className="mt-1 font-mono text-2xs uppercase tracking-[0.1em] text-fg-low">category leader</p>
              </div>
            </div>
          </Reveal>
          <Reveal delay={0.1} y={28}>
            <div className="panel p-5">
              <p className="mb-3 font-mono text-2xs uppercase tracking-[0.12em] text-fg-low">
                AI answer presence, trailing 6 months
              </p>
              <Trace
                series={[
                  { name: "Sample", points: [19, 21, 24, 26, 29, 31].map((y, i) => ({ x: ["Mar", "Apr", "May", "Jun", "Jul", "Aug"][i], y })) },
                  { name: "Comp avg", dashed: true, points: [55, 56, 58, 60, 62, 63].map((y, i) => ({ x: ["Mar", "Apr", "May", "Jun", "Jul", "Aug"][i], y })) },
                ]}
                yMax={100}
                unit="%"
              />
            </div>
          </Reveal>
        </div>
      </section>

      {/* CTA */}
      <section className="frame mt-28">
        <div className="panel overflow-hidden p-8 text-center sm:p-16">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 opacity-40"
            style={{
              backgroundImage:
                "linear-gradient(rgba(74,222,158,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(74,222,158,0.05) 1px, transparent 1px)",
              backgroundSize: "40px 40px",
              maskImage: "radial-gradient(60% 100% at 50% 50%, black, transparent)",
              WebkitMaskImage: "radial-gradient(60% 100% at 50% 50%, black, transparent)",
            }}
          />
          <div className="relative">
            <h2 className="text-2xl font-semibold tracking-tight text-fg sm:text-3xl">Power on the instrument</h2>
            <p className="mx-auto mt-3 max-w-[46ch] text-sm text-fg-mid">
              Enter a URL and a short brief. The scan runs while you watch, then the full readout opens.
            </p>
            <Magnetic className="mt-8">
              <button type="button" onClick={() => go("input")} className="btn-primary">
                Run an audit <ArrowRight size={15} weight="bold" />
              </button>
            </Magnetic>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
