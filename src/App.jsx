import { useState, useCallback } from "react";
import { motion } from "framer-motion";
import { FlowProvider, useFlow } from "./flow.jsx";
import { useReducedMotion } from "./lib/hooks.js";
import SignalField from "./motion/SignalField.jsx";
import Boot from "./motion/Boot.jsx";
import { ScanRail } from "./motion/primitives.jsx";
import { Nav } from "./screens/Chrome.jsx";
import Landing from "./screens/Landing.jsx";
import AuditInput from "./screens/AuditInput.jsx";
import Processing from "./screens/Processing.jsx";
import ReportPreview from "./screens/ReportPreview.jsx";
import Payment from "./screens/Payment.jsx";
import AccessCode from "./screens/AccessCode.jsx";
import Report from "./report/Report.jsx";

function Screen() {
  const { step, unlocked, go } = useFlow();
  const reduced = useReducedMotion();

  let node;
  let key = step;
  if (step === "landing") node = <Landing />;
  else if (step === "input") node = <AuditInput />;
  else if (step === "processing") node = <Processing />;
  else if (step === "preview") node = <ReportPreview />;
  else if (step === "payment") node = <Payment />;
  else if (step === "access") node = <AccessCode />;
  else if (step === "report") {
    node = unlocked ? <Report onExitToPreview={() => go("preview")} /> : <ReportPreview />;
    key = unlocked ? "report" : "preview";
  }

  return (
    <motion.div
      key={key}
      initial={reduced ? false : { opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
    >
      {node}
    </motion.div>
  );
}

export default function App() {
  const [booting, setBooting] = useState(true);
  const finishBoot = useCallback(() => setBooting(false), []);

  return (
    <FlowProvider>
      <a
        href="#main"
        className="sr-only z-overlay focus:not-sr-only focus:absolute focus:left-4 focus:top-3 focus:rounded focus:bg-signal focus:px-4 focus:py-2 focus:font-mono focus:text-xs focus:uppercase focus:text-base"
      >
        Skip to content
      </a>

      <SignalField />
      <ScanRail />
      {booting && <Boot onDone={finishBoot} />}

      <div className="relative z-10">
        <Nav />
        <Screen />
      </div>
    </FlowProvider>
  );
}
