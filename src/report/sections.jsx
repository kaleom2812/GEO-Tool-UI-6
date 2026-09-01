import {
  aiVisibility,
  answerability,
  citations,
  competitors,
  entityUnderstanding,
  executiveSummary,
  meta,
  methodology,
  pageFindings,
  pillars,
  promptEvidence,
  roadmap,
  score,
  scoreProjection,
  structuredData,
  technicalGeo,
  actionCenter,
} from "../data/auditData.js";
import { pct, num, outcomeMeta, statusMeta } from "../lib/format.js";
import {
  ScoreCore,
  BarRack,
  Trace,
  Radar,
  Ring,
  Plot,
  Segments,
  Delta,
  Meter,
} from "../charts.jsx";
import {
  Callout,
  CodeBlock,
  DataTable,
  Disclose,
  KeyValue,
  SectionHeader,
  StoryArc,
  Chip,
  readableTone,
} from "../ui.jsx";
import { Reveal } from "../motion/primitives.jsx";
import { Warning, Code, FileText, Quotes, ShieldCheck, Crosshair } from "../icons.jsx";

const arc = (p, action) => [
  { stage: "Problem", text: p.problem },
  { stage: "Evidence", text: p.evidence },
  { stage: "Impact", text: p.impact },
  { stage: "Recommendation", text: p.recommendation },
  ...(action ? [{ stage: "Action", text: action }] : []),
];

const toneChip = (tone, label) => <Chip tone={tone}>{label}</Chip>;

function Section({ id, index, kicker, title, lede, children }) {
  return (
    <section id={id} className="scroll-mt-24 border-t border-line py-14">
      <Reveal>
        <SectionHeader index={index} kicker={kicker} title={title} lede={lede} />
      </Reveal>
      <div className="mt-8">{children}</div>
    </section>
  );
}

function Split({ story, aside }) {
  return (
    <div className="grid gap-8 lg:grid-cols-2 lg:gap-12">
      <Reveal>{story}</Reveal>
      <Reveal delay={0.08}>{aside}</Reveal>
    </div>
  );
}

/* 01 Score */
export function ScoreSection() {
  return (
    <Section id="score" index={1} kicker="Headline" title="GEO Visibility Score" lede={score.summary}>
      <div className="grid gap-10 lg:grid-cols-[minmax(0,320px)_1fr] lg:gap-14">
        <Reveal>
          <div className="panel p-6 text-center">
            <ScoreCore value={score.overall} grade={score.grade} sub={score.tier} />
            <div className="mt-4 flex items-center justify-center gap-3 border-t border-line pt-4 font-mono text-2xs">
              <span className="text-fg-low">prev {score.previousOverall}</span>
              <Chip tone="good">+{score.delta} pts</Chip>
            </div>
            <p className="mt-2 font-mono text-2xs uppercase tracking-[0.1em] text-fg-low">
              rank {score.categoryRank} of {score.categoryOf} tracked competitors
            </p>
          </div>
        </Reveal>
        <Reveal delay={0.08}>
          <div>
            <p className="mb-3 font-mono text-2xs uppercase tracking-[0.14em] text-fg-low">Signal breakdown</p>
            <ul className="space-y-3">
              {pillars.map((p) => (
                <li key={p.key} className="grid grid-cols-[8rem_1fr_2.5rem] items-center gap-3 sm:grid-cols-[10rem_1fr_3rem]">
                  <span className="text-sm text-fg-mid">{p.label}</span>
                  <Meter value={p.score} tone={p.score >= 70 ? "good" : p.score >= 50 ? "warn" : "bad"} />
                  <span className="data-fig text-right text-sm text-fg">{p.score}</span>
                </li>
              ))}
            </ul>
            <div className="mt-6">
              <Radar
                axes={pillars.map((p) => p.label.split(" ")[0])}
                series={[{ name: "Rivet CRM", values: pillars.map((p) => p.score / 100) }]}
              />
            </div>
          </div>
        </Reveal>
      </div>

      <div className="mt-10">
        <DataTable
          caption="Signal weights and quarter-over-quarter movement"
          columns={[
            { key: "label", label: "Signal" },
            { key: "weight", label: "Weight", align: "right", mono: true, render: (r) => `${Math.round(r.weight * 100)}%` },
            { key: "previous", label: "Prev", align: "right", mono: true },
            { key: "score", label: "Now", align: "right", mono: true },
            { key: "grade", label: "Grade", align: "right", mono: true },
            { key: "delta", label: "Chg", align: "right", mono: true, render: (r) => (r.score - r.previous > 0 ? `+${r.score - r.previous}` : r.score - r.previous) },
          ]}
          rows={pillars}
        />
      </div>
    </Section>
  );
}

/* 02 Executive summary */
export function ExecutiveSummarySection() {
  return (
    <Section id="executive-summary" index={2} kicker="For the board" title="Executive summary" lede={executiveSummary.verdict}>
      <div className="grid grid-cols-2 gap-px overflow-hidden border border-line bg-line sm:grid-cols-3 lg:grid-cols-5">
        {executiveSummary.headlineMetrics.map((m, i) => (
          <Reveal key={m.label} delay={i * 0.05} className="bg-base-1 p-4">
            <p className="data-fig text-2xl text-fg">{m.value}</p>
            <p className="mt-1 font-mono text-2xs uppercase tracking-[0.1em] text-fg-low">{m.label}</p>
            <p className="mt-0.5 text-2xs text-fg-low">{m.sub}</p>
          </Reveal>
        ))}
      </div>
      <div className="mt-10 grid gap-8 lg:grid-cols-[1fr_0.9fr] lg:gap-14">
        <Reveal>
          <StoryArc stages={executiveSummary.story} />
        </Reveal>
        <Reveal delay={0.08}>
          <div className="space-y-4">
            <div className="panel p-5">
              <p className="mb-3 font-mono text-2xs uppercase tracking-[0.12em] text-fg-low">90-day projected trajectory</p>
              <Trace series={[{ name: "GEO", points: scoreProjection.map((d) => ({ x: d.label, y: d.score })) }]} yMax={100} />
            </div>
            <Callout icon={Crosshair} tone="warn" title="The one-line takeaway">
              Rivet is losing the AI answer layer of its own category to competitors that fixed machine
              access first. The plan closes most of the gap in 90 days.
            </Callout>
          </div>
        </Reveal>
      </div>
    </Section>
  );
}

/* 03 AI Visibility */
export function AiVisibilitySection() {
  const p = pillars.find((x) => x.key === "ai-visibility");
  return (
    <Section id="ai-visibility" index={3} kicker={`Signal, score ${p.score}`} title="AI Visibility" lede={p.headline}>
      <Split
        story={<StoryArc stages={arc(p, "Ship the 6 comparison and best-CRM-for-X pages from the Action Center, each with FAQ schema and quotable statistics.")} />}
        aside={
          <div className="panel p-5">
            <p className="mb-3 font-mono text-2xs uppercase tracking-[0.12em] text-fg-low">Answer presence, Rivet vs competitor average</p>
            <Trace
              series={[
                { name: "Rivet", points: aiVisibility.presenceTrend.map((d) => ({ x: d.month, y: d.brand })) },
                { name: "Comp avg", dashed: true, points: aiVisibility.presenceTrend.map((d) => ({ x: d.month, y: d.competitorAvg })) },
              ]}
              yMax={100}
              unit="%"
            />
          </div>
        }
      />
      <div className="mt-10 grid gap-8 lg:grid-cols-2 lg:gap-14">
        <Reveal>
          <p className="mb-3 font-mono text-2xs uppercase tracking-[0.14em] text-fg-low">Presence by model</p>
          <DataTable
            columns={[
              { key: "model", label: "Model" },
              { key: "presence", label: "Presence", align: "right", mono: true, render: (r) => pct(r.presence) },
              { key: "appeared", label: "Hits", align: "right", mono: true, render: (r) => `${r.appeared}/${r.of}` },
              { key: "position", label: "Pos", align: "right", mono: true },
              { key: "blocked", label: "Access", align: "right", render: (r) => (r.blocked ? <Chip tone="bad">Blocked</Chip> : <Chip tone="good">Open</Chip>) },
            ]}
            rows={aiVisibility.models}
          />
        </Reveal>
        <Reveal delay={0.08}>
          <p className="mb-3 font-mono text-2xs uppercase tracking-[0.14em] text-fg-low">Category benchmark, answer presence</p>
          <BarRack items={aiVisibility.benchmark.map((b) => ({ name: b.name, value: Math.round(b.presence * 100), self: b.self }))} max={100} />
          <p className="mb-3 mt-6 font-mono text-2xs uppercase tracking-[0.14em] text-fg-low">Presence by query intent</p>
          <BarRack items={aiVisibility.intentBreakdown.map((d) => ({ name: d.intent, value: Math.round(d.presence * 100) }))} max={100} />
        </Reveal>
      </div>
      <div className="mt-8">
        <Callout icon={Warning} tone="bad" title="Highest-intent query, zero presence">
          Rivet is absent from &ldquo;best CRM for a small B2B sales team&rdquo; on every model. That query
          pattern is roughly 18% of category AI search volume.
        </Callout>
      </div>
    </Section>
  );
}

/* 04 Entity */
export function EntitySection() {
  const p = pillars.find((x) => x.key === "entity-understanding");
  return (
    <Section id="entity" index={4} kicker={`Signal, score ${p.score}`} title="Entity Understanding" lede={p.headline}>
      <Split
        story={<StoryArc stages={arc(p, "Ship the SoftwareApplication and Organization schema in section 11, open a Wikidata item, and align every third-party profile within 30 days.")} />}
        aside={
          <div className="panel p-5">
            <div className="flex items-baseline justify-between">
              <p className="font-mono text-2xs uppercase tracking-[0.12em] text-fg-low">Entity confidence</p>
              <span className="data-fig text-2xl text-fg">
                {entityUnderstanding.confidence}
                <span className="text-fg-low">/100</span>
              </span>
            </div>
            <div className="mt-2">
              <Meter value={entityUnderstanding.confidence} tone="warn" />
            </div>
            <p className="mt-2 text-sm text-fg-mid">{entityUnderstanding.knowledgePanel}</p>
            <div className="mt-4 border-t border-line pt-3">
              <KeyValue
                rows={entityUnderstanding.sources.map((s) => ({
                  label: s.source,
                  value: (
                    <span className="flex flex-wrap items-center gap-2">
                      {toneChip(statusMeta[s.status]?.tone || "neutral", statusMeta[s.status]?.label || s.status)}
                      <span>{s.detail}</span>
                    </span>
                  ),
                }))}
              />
            </div>
          </div>
        }
      />
      <div className="mt-10">
        <p className="mb-3 font-mono text-2xs uppercase tracking-[0.14em] text-fg-low">Attribute accuracy</p>
        <DataTable
          columns={[
            { key: "attr", label: "Attribute" },
            { key: "state", label: "Status", render: (r) => toneChip(statusMeta[r.state]?.tone, statusMeta[r.state]?.label) },
            { key: "value", label: "What models say" },
          ]}
          rows={entityUnderstanding.attributes}
        />
      </div>
      <div className="mt-8">
        <Callout icon={Warning} tone="warn" title={`Disambiguation risk, ${entityUnderstanding.disambiguation.risk}`}>
          <p>{entityUnderstanding.disambiguation.detail}</p>
          <ul className="mt-2 list-inside list-disc text-fg-low">
            {entityUnderstanding.disambiguation.collisions.map((c) => (
              <li key={c}>{c}</li>
            ))}
          </ul>
        </Callout>
      </div>
    </Section>
  );
}

/* 05 Answerability */
export function AnswerabilitySection() {
  const p = pillars.find((x) => x.key === "answerability");
  return (
    <Section id="answerability" index={5} kicker={`Signal, score ${p.score}`} title="Answerability" lede={p.headline}>
      <Split
        story={<StoryArc stages={arc(p, "Publish FAQPage-structured answers to all 19 gap questions, and add visible last-updated dates to the 41% of pages that are stale.")} />}
        aside={
          <div className="panel p-5">
            <p className="mb-3 font-mono text-2xs uppercase tracking-[0.12em] text-fg-low">{answerability.tested} buyer questions tested</p>
            <Segments
              groups={[
                { label: "Answerable", count: answerability.fully, tone: "good" },
                { label: "Partial", count: answerability.partial, tone: "warn" },
                { label: "No answer", count: answerability.none, tone: "bad" },
              ]}
            />
            <div className="mt-5 border-t border-line pt-4">
              <p className="mb-3 font-mono text-2xs uppercase tracking-[0.12em] text-fg-low">Answerability by topic</p>
              <BarRack items={answerability.categories.map((c) => ({ name: c.category, value: Math.round(c.answerable * 100) }))} max={100} />
            </div>
          </div>
        }
      />
      <div className="mt-10">
        <p className="mb-3 font-mono text-2xs uppercase tracking-[0.14em] text-fg-low">The gap list</p>
        <DataTable
          columns={[
            { key: "q", label: "Buyer question" },
            { key: "state", label: "Status", render: (r) => toneChip(statusMeta[r.state]?.tone, statusMeta[r.state]?.label) },
            { key: "note", label: "Why models cannot answer it" },
          ]}
          rows={answerability.gaps}
        />
      </div>
    </Section>
  );
}

/* 06 Prompt evidence */
export function PromptEvidenceSection() {
  return (
    <Section
      id="prompt-evidence"
      index={6}
      kicker="Evidence"
      title="Prompt evidence"
      lede="Verbatim-style excerpts from the probing run. This is what a buyer sees when they ask an assistant about the category."
    >
      <div className="grid gap-3 md:grid-cols-2">
        {promptEvidence.map((e, i) => {
          const om = outcomeMeta[e.outcome] || { label: e.outcome, tone: "neutral" };
          return (
            <Reveal key={e.id} delay={(i % 2) * 0.06}>
              <article className="panel flex h-full flex-col p-4">
                <div className="flex items-start justify-between gap-3">
                  <p className="font-mono text-2xs uppercase tracking-[0.1em] text-fg-low">
                    {e.model} / {e.intent}
                  </p>
                  <Chip tone={om.tone}>{om.label}</Chip>
                </div>
                <p className="mt-2.5 text-sm font-semibold leading-snug text-fg">&ldquo;{e.prompt}&rdquo;</p>
                <blockquote className="mt-2.5 border-l-2 border-line-2 pl-3 text-xs italic leading-relaxed text-fg-mid">
                  {e.response}
                </blockquote>
                {e.citations.length > 0 && (
                  <p className="mt-2.5 flex flex-wrap items-center gap-1.5 font-mono text-2xs text-fg-low">
                    <span className="uppercase">cites</span>
                    {e.citations.map((c) => (
                      <span key={c} className="bg-base-2 px-1.5 py-0.5">{c}</span>
                    ))}
                  </p>
                )}
                <p className="mt-auto flex items-start gap-2 border-t border-line pt-3 text-xs text-fg-mid">
                  <span className="mt-0.5 shrink-0 text-signal">
                    <Quotes size={13} />
                  </span>
                  {e.analysis}
                </p>
              </article>
            </Reveal>
          );
        })}
      </div>
    </Section>
  );
}

/* 07 Competitors */
export function CompetitorSection() {
  return (
    <Section
      id="competitors"
      index={7}
      kicker="Benchmark"
      title="Competitor intelligence and share of voice"
      lede="Across every AI answer in the category, how much of the conversation each brand owns."
    >
      <div className="grid gap-8 lg:grid-cols-2 lg:gap-14">
        <Reveal>
          <div className="panel p-5">
            <p className="mb-4 font-mono text-2xs uppercase tracking-[0.12em] text-fg-low">Share of voice, category AI answers</p>
            <Ring
              items={competitors.shareOfVoice.map((d) => ({ name: d.name, value: d.sov, self: d.self }))}
              centerLabel={{ value: "9%", label: "Rivet CRM" }}
            />
          </div>
        </Reveal>
        <Reveal delay={0.08}>
          <div className="space-y-4">
            <div className="panel p-5">
              <p className="mb-3 font-mono text-2xs uppercase tracking-[0.12em] text-fg-low">Rivet share of voice, trailing 6 months</p>
              <Trace
                series={[{ name: "SoV", points: competitors.sovTrend.map((d) => ({ x: d.month, y: d.sov })) }]}
                yMax={40}
                yTicks={[0, 10, 20, 30, 40]}
                unit="%"
              />
            </div>
            <StoryArc
              compact
              stages={[
                { stage: "Problem", text: "Rivet holds 9% share of voice in a category it competes in directly, 4th of 6." },
                { stage: "Evidence", text: "Every competitor except Rivet has a server-rendered pricing table with Offer schema. HubSpot and Pipedrive both publish a 'Rivet alternative' page." },
                { stage: "Impact", text: "Share of voice compounds. Models cache the brands they already trust and cite." },
                { stage: "Recommendation", text: "Match table stakes (schema, comparison pages, reviews) before chasing net-new content." },
              ]}
            />
          </div>
        </Reveal>
      </div>
      <div className="mt-10">
        <DataTable
          caption="Competitive GEO scorecard"
          columns={[
            { key: "name", label: "Brand" },
            { key: "presence", label: "Presence", align: "right", mono: true, render: (r) => pct(r.presence) },
            { key: "sov", label: "SoV", align: "right", mono: true, render: (r) => pct(r.sov) },
            { key: "sentiment", label: "Sentiment", align: "right", mono: true, render: (r) => `+${r.sentiment.toFixed(2)}` },
            { key: "knowledgePanel", label: "Panel", align: "right" },
            { key: "wikipedia", label: "Wiki", align: "right" },
            { key: "citations", label: "Cites", align: "right", mono: true },
          ]}
          rows={competitors.table}
        />
      </div>
      <div className="mt-6">
        <p className="mb-3 font-mono text-2xs uppercase tracking-[0.14em] text-fg-low">Gap analysis</p>
        <ul className="space-y-2">
          {competitors.gapAnalysis.map((g) => (
            <li key={g} className="flex items-start gap-3 text-sm text-fg-mid">
              <span className="mt-1.5 h-1 w-1 shrink-0 bg-signal" style={{ boxShadow: "0 0 6px #4ADE9E" }} />
              {g}
            </li>
          ))}
        </ul>
      </div>
    </Section>
  );
}

/* 08 Citations */
export function CitationSection() {
  const p = pillars.find((x) => x.key === "citation-visibility");
  return (
    <Section id="citations" index={8} kicker={`Signal, score ${p.score}`} title="Citation visibility" lede={p.headline}>
      <Split
        story={<StoryArc stages={arc(p, "Run the G2 review-velocity campaign (plus 40 per quarter), pursue the 6 named listicles, and add data plus schema to /pricing and /security so they become citable.")} />}
        aside={
          <div className="panel p-5">
            <p className="mb-3 font-mono text-2xs uppercase tracking-[0.12em] text-fg-low">Most-cited domains in the category</p>
            <BarRack items={citations.topDomains.map((d) => ({ name: d.domain, value: Math.round(d.share * 100), self: d.self }))} max={35} />
            <p className="mt-3 font-mono text-2xs text-fg-low">
              rivetcrm.com earns {pct(citations.brandShare)} of {num(citations.categoryTotal)} category citations.
            </p>
          </div>
        }
      />
      <div className="mt-10 grid gap-8 lg:grid-cols-2 lg:gap-14">
        <Reveal>
          <p className="mb-3 font-mono text-2xs uppercase tracking-[0.14em] text-fg-low">Rivet pages that get cited</p>
          <DataTable
            dense
            columns={[
              { key: "page", label: "Page", mono: true },
              { key: "citations", label: "Cites", align: "right", mono: true },
              { key: "note", label: "Note" },
            ]}
            rows={citations.citedPages}
          />
          <p className="mt-4 text-sm text-fg-mid">
            <span className="font-semibold text-crit">Zero citations:</span> {citations.zeroCitationPages.join(", ")}
          </p>
        </Reveal>
        <Reveal delay={0.08}>
          <p className="mb-3 font-mono text-2xs uppercase tracking-[0.14em] text-fg-low">Citation opportunities</p>
          <div className="space-y-2.5">
            {citations.opportunities.map((o) => (
              <div key={o.detail} className="panel p-3.5">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-semibold text-fg">{o.type}</p>
                  <Chip tone={o.impact === "High" ? "bad" : "warn"}>{o.impact}</Chip>
                </div>
                <p className="mt-1 text-xs text-fg-mid">{o.detail}</p>
              </div>
            ))}
          </div>
        </Reveal>
      </div>
    </Section>
  );
}

/* 09 Page findings */
export function PageFindingsSection() {
  return (
    <Section
      id="page-findings"
      index={9}
      kicker="Content"
      title="Page and content findings"
      lede="Per-URL GEO health for the pages that matter most to a buying decision."
    >
      <div className="space-y-2.5">
        {pageFindings.map((f, i) => (
          <Reveal key={f.url} delay={Math.min(i * 0.03, 0.2)}>
            <Disclose
              summary={
                <span className="flex w-full flex-wrap items-center gap-3">
                  <span className="data-fig w-8 shrink-0 text-signal">{f.geo}</span>
                  <span className="font-mono text-sm text-fg">{f.url}</span>
                  <span className="font-mono text-2xs text-fg-low">{f.type}</span>
                  <span className="ml-auto">
                    {toneChip(readableTone[f.readable], f.readable === "yes" ? "AI-readable" : f.readable === "no" ? "Not readable" : "Partial")}
                  </span>
                </span>
              }
            >
              <p className="mb-2">{f.issue}</p>
              <p className="text-fg-low">{f.story}</p>
            </Disclose>
          </Reveal>
        ))}
      </div>
    </Section>
  );
}

/* 10 Technical */
export function TechnicalSection() {
  const p = pillars.find((x) => x.key === "technical-geo");
  return (
    <Section id="technical" index={10} kicker={`Signal, score ${p.score}`} title="Technical GEO" lede={p.headline}>
      <Split
        story={<StoryArc stages={arc(p, "Remove the GPTBot Disallow line today. Publish llms.txt and server-render commercial pages within the first sprint.")} />}
        aside={
          <div className="panel p-5">
            <p className="mb-4 font-mono text-2xs uppercase tracking-[0.12em] text-fg-low">Technical checks</p>
            <ul className="space-y-2.5">
              {technicalGeo.checks.map((c) => (
                <li key={c.check} className="grid grid-cols-[1fr_2.5rem_5.5rem] items-center gap-2">
                  <span className="text-xs text-fg-mid">{c.check}</span>
                  <span className="data-fig text-right text-xs text-fg">{c.score}</span>
                  <span className="text-right">{toneChip(statusMeta[c.status]?.tone, statusMeta[c.status]?.label)}</span>
                </li>
              ))}
            </ul>
          </div>
        }
      />
      <div className="mt-10">
        <p className="mb-3 font-mono text-2xs uppercase tracking-[0.14em] text-fg-low">AI crawler access</p>
        <DataTable
          columns={[
            { key: "bot", label: "Agent", mono: true },
            { key: "purpose", label: "Feeds" },
            { key: "status", label: "Current", render: (r) => toneChip(r.status === "Blocked" ? "bad" : r.status.startsWith("Allowed") ? "good" : "warn", r.status) },
            { key: "fix", label: "Fix" },
          ]}
          rows={technicalGeo.crawlerTable}
        />
      </div>
    </Section>
  );
}

/* 11 Schema */
export function SchemaSection() {
  return (
    <Section
      id="schema"
      index={11}
      kicker="Machine files"
      title="Schema, robots.txt and llms.txt"
      lede="The three files that decide whether a model can read, trust, and quote the site."
    >
      <div className="grid gap-5 lg:grid-cols-2">
        <Reveal>
          <div>
            <p className="mb-2 flex items-center gap-2 font-mono text-2xs uppercase tracking-[0.12em] text-fg-low">
              <Code size={13} /> robots.txt, current
            </p>
            <CodeBlock label="rivetcrm.com/robots.txt" code={structuredData.robotsTxt.current} />
            <div className="mt-3">
              <Callout tone="bad" icon={Warning} title="Line 5 removes Rivet from ChatGPT retrieval">
                <span className="font-mono text-2xs">User-agent: GPTBot / Disallow: /</span> blocks the largest AI retrieval surface.
              </Callout>
            </div>
          </div>
        </Reveal>
        <Reveal delay={0.08}>
          <div>
            <p className="mb-2 flex items-center gap-2 font-mono text-2xs uppercase tracking-[0.12em] text-fg-low">
              <Code size={13} /> robots.txt, recommended
            </p>
            <CodeBlock label="rivetcrm.com/robots.txt" code={structuredData.robotsTxt.recommended} />
          </div>
        </Reveal>
      </div>
      <div className="mt-8 grid gap-5 lg:grid-cols-2">
        <Reveal>
          <div>
            <p className="mb-2 flex items-center gap-2 font-mono text-2xs uppercase tracking-[0.12em] text-fg-low">
              <FileText size={13} /> llms.txt, <span className="text-crit">missing (404)</span>
            </p>
            <CodeBlock label="recommended rivetcrm.com/llms.txt" code={structuredData.llmsTxt.recommended} />
          </div>
        </Reveal>
        <Reveal delay={0.08}>
          <div>
            <p className="mb-2 flex items-center gap-2 font-mono text-2xs uppercase tracking-[0.12em] text-fg-low">
              <ShieldCheck size={13} /> Structured data
            </p>
            <div className="panel p-5">
              <p className="text-sm font-semibold text-fg">Present</p>
              <ul className="mt-2 space-y-1.5 text-sm">
                {structuredData.schemaPresent.map((s) => (
                  <li key={s.type} className="flex items-start gap-2">
                    {toneChip(s.state === "ok" ? "good" : "warn", s.state)}
                    <span className="text-fg-mid">
                      <span className="font-mono text-fg">{s.type}</span>, {s.detail}
                    </span>
                  </li>
                ))}
              </ul>
              <p className="mt-4 text-sm font-semibold text-crit">Missing</p>
              <ul className="mt-2 flex flex-wrap gap-1.5">
                {structuredData.schemaMissing.map((s) => (
                  <li key={s} className="border border-crit/30 bg-crit/5 px-2 py-0.5 font-mono text-2xs text-crit">{s}</li>
                ))}
              </ul>
            </div>
          </div>
        </Reveal>
      </div>
      <div className="mt-8">
        <p className="mb-2 font-mono text-2xs uppercase tracking-[0.14em] text-fg-low">Recommended SoftwareApplication JSON-LD</p>
        <CodeBlock label="add to every page head" code={structuredData.recommendedSchema} />
      </div>
    </Section>
  );
}

/* 12 Action center */
export function ActionCenterSection() {
  return (
    <Section
      id="action-center"
      index={12}
      kicker="Prioritised"
      title="Action center"
      lede="Every recommendation from the audit, ranked by impact against effort. Green markers are 1 to 2 day quick wins."
    >
      <div className="grid gap-8 lg:grid-cols-[minmax(0,420px)_1fr] lg:gap-14">
        <Reveal>
          <div className="panel p-5">
            <Plot items={actionCenter} />
          </div>
        </Reveal>
        <Reveal delay={0.08}>
          <ol className="divide-y divide-line border border-line">
            {[...actionCenter]
              .sort((a, b) => b.impact - a.impact || a.effort - b.effort)
              .map((a) => (
                <li key={a.id} className="grid grid-cols-[2rem_1fr] gap-3 p-3.5">
                  <span className="data-fig text-xs text-signal">{String(a.id).padStart(2, "0")}</span>
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="text-sm font-semibold text-fg">{a.title}</p>
                      <Chip tone={a.type === "Quick win" ? "good" : "neutral"}>{a.type}</Chip>
                    </div>
                    <p className="mt-1 text-xs text-fg-mid">{a.detail}</p>
                    <p className="mt-1.5 font-mono text-2xs uppercase tracking-[0.08em] text-fg-low">
                      {a.pillar} / impact {a.impact} / effort {a.effort} / {a.owner} / {a.horizon}
                    </p>
                  </div>
                </li>
              ))}
          </ol>
        </Reveal>
      </div>
    </Section>
  );
}

/* 13 Roadmap */
export function RoadmapSection() {
  return (
    <Section
      id="roadmap"
      index={13}
      kicker="Sequenced"
      title="90-day roadmap"
      lede="Machine access first, then answerability and entity, then third-party authority. Each phase has a projected score."
    >
      <div className="panel mb-8 p-5">
        <p className="mb-3 font-mono text-2xs uppercase tracking-[0.12em] text-fg-low">Projected GEO score</p>
        <Trace series={[{ name: "GEO", points: scoreProjection.map((d) => ({ x: d.label, y: d.score })) }]} yMax={100} />
      </div>
      <div className="grid gap-4 lg:grid-cols-3">
        {roadmap.map((ph, i) => (
          <Reveal key={ph.phase} delay={i * 0.06}>
            <div className="panel flex h-full flex-col p-5">
              <div className="flex items-baseline justify-between">
                <p className="font-mono text-2xs uppercase tracking-[0.12em] text-fg-low">{ph.window}</p>
                <span className="data-fig text-lg text-signal-bright">{">"} {ph.projectedScore}</span>
              </div>
              <h3 className="mt-2 text-base font-semibold text-fg">{ph.title}</h3>
              <p className="mt-1 text-sm text-fg-mid">{ph.focus}</p>
              <div className="mt-4 space-y-3 border-t border-line pt-4">
                {ph.kpis.map((k) => (
                  <Delta key={k.label} label={k.label} from={k.from} to={k.to} max={k.label.toLowerCase().includes("question") ? 20 : 100} />
                ))}
              </div>
              <p className="mt-4 font-mono text-2xs uppercase tracking-[0.08em] text-fg-low">Actions {ph.actions.join(", ")}</p>
            </div>
          </Reveal>
        ))}
      </div>
    </Section>
  );
}

/* 14 Methodology */
export function MethodologySection() {
  return (
    <Section id="methodology" index={14} kicker="Appendix" title="Methodology" lede={methodology.intro}>
      <div className="grid gap-8 lg:grid-cols-[1.3fr_1fr] lg:gap-14">
        <Reveal>
          <KeyValue rows={methodology.items} />
        </Reveal>
        <Reveal delay={0.08}>
          <Callout tone="warn" icon={Warning} title="Limitations">
            <ul className="list-inside list-disc space-y-1.5">
              {methodology.limitations.map((l) => (
                <li key={l}>{l}</li>
              ))}
            </ul>
            <p className="mt-3 border-t border-warn/20 pt-3 font-medium text-fg">Confidence: {methodology.confidence}</p>
          </Callout>
        </Reveal>
      </div>
      <p className="mt-8 font-mono text-2xs uppercase tracking-[0.12em] text-fg-low">
        {meta.auditId} / generated {meta.auditDate} / {meta.analyst}
      </p>
    </Section>
  );
}

export const REPORT_SECTIONS = [
  { id: "score", label: "GEO Score", Component: ScoreSection },
  { id: "executive-summary", label: "Executive summary", Component: ExecutiveSummarySection },
  { id: "ai-visibility", label: "AI Visibility", Component: AiVisibilitySection },
  { id: "entity", label: "Entity Understanding", Component: EntitySection },
  { id: "answerability", label: "Answerability", Component: AnswerabilitySection },
  { id: "prompt-evidence", label: "Prompt evidence", Component: PromptEvidenceSection },
  { id: "competitors", label: "Competitors and SoV", Component: CompetitorSection },
  { id: "citations", label: "Citation visibility", Component: CitationSection },
  { id: "page-findings", label: "Page findings", Component: PageFindingsSection },
  { id: "technical", label: "Technical GEO", Component: TechnicalSection },
  { id: "schema", label: "Schema, robots, llms", Component: SchemaSection },
  { id: "action-center", label: "Action center", Component: ActionCenterSection },
  { id: "roadmap", label: "90-day roadmap", Component: RoadmapSection },
  { id: "methodology", label: "Methodology", Component: MethodologySection },
];
