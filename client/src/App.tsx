import React from "react";
import { Button } from "./components/Button";

function App() {
  return (
    <main className="min-h-screen bg-white text-slate-900">
      <div className="mx-auto max-w-3xl px-6 py-12 space-y-8">
        <header className="space-y-2">
          <p className="text-sm font-semibold uppercase tracking-wide text-blue-600">
            Sickline
          </p>
          <h1 className="text-3xl font-bold">Family health tracker</h1>
          <p className="text-slate-600">
            Track daily statuses and timelines. This is the starting scaffold; extend components
            and flows as we build the MVP.
          </p>
        </header>
        <section className="space-y-4">
          <h2 className="text-xl font-semibold">UI components</h2>
          <div className="flex items-center gap-3">
            <Button label="Primary action" />
            <Button variant="secondary" label="Secondary" />
          </div>
        </section>
      </div>
    </main>
  );
}

export default App;
