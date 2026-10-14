import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { Check } from "lucide-react";
import { SiteFooter, SiteHeader } from "@/components/SiteHeader";
import { Button } from "@/components/ui/button";
import { DemoBadge } from "@/components/DemoBadge";
import { PLANS } from "@/lib/demo-data";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/pricing")({
  head: () => ({
    meta: [
      { title: "Pricing (draft) — DevPilot AI" },
      {
        name: "description",
        content: "Proposed Free, Pro and Team plans for DevPilot AI. Not yet active.",
      },
      { property: "og:title", content: "Pricing (draft) — DevPilot AI" },
      { property: "og:description", content: "Proposed plans. Billing is not active yet." },
    ],
  }),
  component: Pricing,
});

function Pricing() {
  const [yearly, setYearly] = useState(false);
  return (
    <div className="min-h-screen">
      <SiteHeader />
      <main className="mx-auto max-w-6xl px-5 py-16">
        <DemoBadge label="Draft pricing · not active" />
        <h1 className="mt-4 text-4xl font-semibold">Simple plans, when we launch</h1>
        <p className="mt-3 text-muted-foreground">
          No payments are processed. These prices are proposals and may change.
        </p>
        <div
          className="mt-8 inline-flex rounded-lg border p-1"
          role="group"
          aria-label="Billing period"
        >
          {[false, true].map((y) => (
            <button
              key={String(y)}
              aria-pressed={yearly === y}
              onClick={() => setYearly(y)}
              className={cn(
                "rounded-md px-4 py-1.5 text-sm",
                yearly === y ? "bg-accent" : "text-muted-foreground",
              )}
            >
              {y ? "Yearly (−20%)" : "Monthly"}
            </button>
          ))}
        </div>
        <div className="mt-8 grid gap-4 md:grid-cols-3">
          {PLANS.map((p) => (
            <div
              key={p.id}
              className={cn(
                "panel flex flex-col p-6",
                "highlight" in p && "border-primary shadow-glow",
              )}
            >
              <h2 className="text-lg font-semibold">{p.name}</h2>
              <p className="text-sm text-muted-foreground">{p.blurb}</p>
              <p className="mt-4 font-display text-4xl font-semibold">
                ${yearly ? p.yearly : p.monthly}
                <span className="text-sm text-muted-foreground">/mo</span>
              </p>
              <ul className="mt-4 flex-1 space-y-2 text-sm">
                {p.features.map((f) => (
                  <li key={f} className="flex gap-2">
                    <Check className="size-4 text-cyan" />
                    {f}
                  </li>
                ))}
              </ul>
              <Button asChild className="mt-6" variant={"highlight" in p ? "hero" : "subtle"}>
                <Link to="/dashboard">
                  {p.id === "free" ? "Use demo workspace" : "Try the demo"}
                </Link>
              </Button>
            </div>
          ))}
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
