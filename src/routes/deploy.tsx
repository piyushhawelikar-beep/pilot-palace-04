import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { AppShell } from "@/components/AppShell";
import { Button } from "@/components/ui/button";
import { DemoBadge, StateBadge } from "@/components/DemoBadge";
import { PROVIDERS } from "@/lib/demo-data";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/deploy")({
  head: () => ({
    meta: [
      { title: "Deployment center — DevPilot AI" },
      { name: "description", content: "Pick a hosting provider, review build settings, history and rollback." },
      { property: "og:title", content: "Deployment center — DevPilot AI" },
      { property: "og:description", content: "Provider-ready deploy UI for 12 hosting targets." },
    ],
  }),
  component: Deploy,
});

function Deploy() {
  const [sel, setSel] = useState("vercel");
  const p = PROVIDERS.find((x) => x.id === sel)!;
  const compatible = p.supports.some((s) => s.includes("Next.js"));
  return (
    <AppShell title="Deployment center">
      <div className="grid gap-6 xl:grid-cols-[1fr_360px]">
        <div className="space-y-6">
          <section className="panel p-5">
            <div className="flex items-center gap-2"><h2 className="font-semibold">Detected framework</h2><DemoBadge /></div>
            <p className="mt-2 font-mono text-sm">acme-storefront · Next.js 15 · build: <span className="text-cyan">next build</span> · output: <span className="text-cyan">.next</span></p>
          </section>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3" role="radiogroup" aria-label="Providers">
            {PROVIDERS.map((x) => (
              <button key={x.id} role="radio" aria-checked={sel === x.id} onClick={() => setSel(x.id)}
                className={cn("panel p-4 text-left transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring", sel === x.id && "border-primary")}>
                <div className="flex items-start justify-between gap-2"><p className="font-medium">{x.name}</p><StateBadge state={x.state} /></div>
                <p className="mt-1 text-xs text-muted-foreground">{x.category} · {x.authMethod}</p>
              </button>
            ))}
          </div>
        </div>
        <aside className="space-y-4">
          <section className="panel space-y-3 p-5">
            <h2 className="font-semibold">{p.name}</h2>
            <p className="text-sm text-muted-foreground">Supports: {p.supports.join(", ")}</p>
            <p className={cn("text-sm", compatible ? "text-success" : "text-warning")}>{compatible ? "Compatible with Next.js (sample hint)." : "May need static export or a container for Next.js."}</p>
            <Button className="w-full" onClick={() => toast.info(`${p.name} isn't connected`, { description: "Connecting requires a server-side adapter and secure credentials. Nothing was deployed." })}>Connect {p.name}</Button>
            <Button className="w-full" variant="subtle" disabled>Deploy (connect first)</Button>
          </section>
          <section className="panel p-5 text-sm">
            <h2 className="font-semibold">Deployment history</h2>
            <p className="mt-3 rounded-lg border border-dashed p-4 text-center text-muted-foreground">No deployments yet. Live URL appears here after a real deploy.</p>
            <Button className="mt-3 w-full" variant="ghost" disabled>Rollback (no previous deploy)</Button>
          </section>
        </aside>
      </div>
    </AppShell>
  );
}
