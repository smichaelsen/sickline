import { useEffect, useRef, useState } from "react";
import { useStatus } from "./api/useStatus";
import { DailyHealthCheck } from "./components/DailyHealthCheck";
import { TimelineView } from "./components/TimelineView";
import { todayInTz } from "./config";

type Screen = "daily" | "timeline";

const TABS: Array<{ id: Screen; label: string }> = [
  { id: "daily", label: "Daily check" },
  { id: "timeline", label: "Timeline" }
];

function App() {
  const [screen, setScreen] = useState<Screen>("daily");
  const initialScreenSet = useRef(false);
  const todayStatus = useStatus(todayInTz());

  useEffect(() => {
    if (initialScreenSet.current || todayStatus.loading) return;
    initialScreenSet.current = true;
    if ((todayStatus.data?.entries.length ?? 0) > 0) {
      setScreen("timeline");
    }
  }, [todayStatus.loading, todayStatus.data]);

  return (
    <>
      <nav className="sticky top-0 z-20 bg-white border-b border-slate-200 shadow-sm">
        <div className="mx-auto max-w-screen-xl px-4 flex gap-1">
          {TABS.map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setScreen(tab.id)}
              className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors focus:outline-none ${
                screen === tab.id
                  ? "border-blue-600 text-blue-600"
                  : "border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </nav>

      {screen === "daily" && <DailyHealthCheck />}
      {screen === "timeline" && <TimelineView />}
    </>
  );
}

export default App;
