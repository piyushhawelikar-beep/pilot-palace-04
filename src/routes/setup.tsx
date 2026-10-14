import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";

export const Route = createFileRoute("/setup")({
  head: () => ({
    meta: [
      { title: "Docs & setup status — DevPilot AI" },
      {
        name: "description",
        content: "What's live, what's demo-only, and what's needed to make DevPilot AI real.",
      },
      { property: "og:title", content: "Docs & setup status — DevPilot AI" },
      { property: "og:description", content: "Honest status of every DevPilot AI capability." },
    ],
  }),
  component: Setup,
});

const ROWS = [
  [
    "AI assistant & Fix All Errors",
    "Simulated on sample data",
    "Server-side model adapter (via server functions); prompts never include secrets.",
  ],
  [
    "Code execution / checks",
    "Not executed",
    "Isolated sandbox service (e.g. Firecracker/container) — never run user code in the main app.",
  ],
  [
    "Authentication",
    "Email/password sign-in live",
    "Accounts work, but projects are still stored in this browser only until user-owned tables (with access rules) are added.",
  ],
  ["Project storage", "This browser only", "Database with per-user access rules."],
  [
    "Deployment",
    "UI only, all providers Not connected",
    "Per-provider adapters with OAuth / tokens stored server-side.",
  ],
  [
    "Billing",
    "Draft prices, no payments",
    "Payment provider + webhook-verified subscription state.",
  ],
];

function Setup() {
  return (
    <AppShell title="Docs & setup status" protect={false}>
      <div className="max-w-4xl space-y-4">
        <p className="text-muted-foreground">
          DevPilot AI Phase 1 is a working product shell. Here's exactly what is real today and what
          each feature needs to go live.
        </p>
        <div className="panel divide-y">
          {ROWS.map(([f, s, n]) => (
            <div key={f} className="grid gap-1 p-4 text-sm md:grid-cols-[200px_180px_1fr]">
              <p className="font-medium">{f}</p>
              <p className="text-warning">{s}</p>
              <p className="text-muted-foreground">{n}</p>
            </div>
          ))}
        </div>
      </div>
    </AppShell>
  );
}
