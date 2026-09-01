import { useFlow, STEPS } from "../flow.jsx";
import { ArrowLeft } from "../icons.jsx";

const STEP_LABEL = {
  landing: "Standby",
  input: "Target",
  processing: "Acquire",
  preview: "Readout",
  payment: "Access",
  access: "Key",
  report: "Full feed",
};

export function Nav({ right }) {
  const { step, back, canGoBack } = useFlow();
  const idx = STEPS.indexOf(step);
  return (
    <header className="sticky top-0 z-nav border-b border-line bg-base/80 backdrop-blur-md">
      <div className="frame flex h-14 items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          {canGoBack && step !== "report" && (
            <button
              type="button"
              onClick={back}
              className="inline-flex items-center gap-1.5 font-mono text-2xs uppercase tracking-[0.12em] text-fg-mid transition-colors hover:text-signal-bright"
            >
              <ArrowLeft size={13} />
              <span className="hidden sm:inline">Back</span>
            </button>
          )}
          <a href="#top" className="font-mono text-sm font-semibold uppercase tracking-[0.4em] text-fg no-underline">
            Signal
          </a>
        </div>

        <div className="flex items-center gap-4">
          {right}
          {step !== "landing" && (
            <p className="hidden items-center gap-2 font-mono text-2xs uppercase tracking-[0.12em] text-fg-low sm:flex">
              <span className="text-signal">{String(idx).padStart(2, "0")}</span>
              <span aria-hidden="true">/</span>
              <span>{String(STEPS.length - 1).padStart(2, "0")}</span>
              <span className="text-fg-mid">{STEP_LABEL[step]}</span>
            </p>
          )}
        </div>
      </div>

      {step !== "landing" && (
        <div className="h-px w-full bg-line">
          <div
            className="h-px bg-signal transition-[width] duration-500 ease-out"
            style={{ width: `${(idx / (STEPS.length - 1)) * 100}%`, boxShadow: "0 0 8px rgba(74,222,158,0.7)" }}
          />
        </div>
      )}
    </header>
  );
}

export function Footer() {
  return (
    <footer className="mt-24 border-t border-line">
      <div className="frame flex flex-col gap-2 py-7 font-mono text-2xs uppercase tracking-[0.12em] text-fg-low sm:flex-row sm:items-center sm:justify-between">
        <p>Signal / GEO audit instrument / demo build with mock data</p>
        <p>Not affiliated with any company named here</p>
      </div>
    </footer>
  );
}
