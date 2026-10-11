import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, Bug, CheckCircle2, Hammer, Rocket, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SiteFooter, SiteHeader } from "@/components/SiteHeader";
import { DemoBadge } from "@/components/DemoBadge";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "DevPilot AI — Build, debug, verify, deploy" },
      { name: "description", content: "An AI-assisted developer workspace: generate projects, group root causes, review patches and ship to the host you choose." },
      { property: "og:title", content: "DevPilot AI — Build, debug, verify, deploy" },
      { property: "og:description", content: "Generate, debug with reviewable patches, verify and deploy — from one workspace." },
    ],
  }),
  component: Landing,
});

const STEPS = [
  { icon: Hammer, title: "Build", body: "Start from a prompt or template. Get a structured project, not a code dump." },
  { icon: Bug, title: "Debug", body: "Fix All Errors groups symptoms into root causes and proposes one reviewable patch." },
  { icon: CheckCircle2, title: "Verify", body: "Checks run in an isolated sandbox. Results are reported — never assumed." },
  { icon: Rocket, title: "Deploy", body: "Detect the framework, pick a compatible host, keep history and one-click rollback." },
];

function Landing() {
  return (
    <div className="min-h-screen">
      <SiteHeader />
      <section className="relative overflow-hidden">
        <div className="pointer-events-none absolute inset-0 bg-glow" />
        <div className="pointer-events-none absolute inset-0 bg-grid" />
        <div className="relative mx-auto max-w-6xl px-5 pb-20 pt-20 md:pt-28">
          <span className="inline-flex items-center gap-2 rounded-full border bg-surface px-3 py-1 text-xs text-muted-foreground">
            <span className="size-1.5 rounded-full bg-cyan" /> Phase 1 preview · demo workspace
          </span>
          <h1 className="mt-6 max-w-3xl text-4xl font-semibold leading-[1.05] md:text-6xl">
            From broken build to <span className="text-gradient">shipped</span>, with every change reviewable.
          </h1>
          <p className="mt-6 max-w-xl text-lg text-muted-foreground">
            DevPilot AI is a developer workspace that builds, debugs, verifies and deploys your web projects — and tells you honestly what it did and didn't check.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Button asChild variant="hero" size="lg"><Link to="/dashboard">Start a project <ArrowRight /></Link></Button>
            <Button asChild variant="subtle" size="lg"><Link to="/workspace" search={{ fix: true }}>Try Fix All Errors</Link></Button>
          </div>
          <HeroMock />
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-5 py-20">
        <h2 className="text-2xl font-semibold md:text-3xl">One loop, four honest steps</h2>
        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {STEPS.map(({ icon: Icon, title, body }, i) => (
            <div key={title} className="panel p-5">
              <div className="flex items-center justify-between">
                <Icon className="size-5 text-cyan" aria-hidden />
                <span className="font-mono text-xs text-muted-foreground">0{i + 1}</span>
              </div>
              <h3 className="mt-6 text-lg font-semibold">{title}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{body}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-5 pb-24">
        <div className="panel grid gap-8 p-8 md:grid-cols-2 md:p-12">
          <div>
            <ShieldCheck className="size-6 text-success" aria-hidden />
            <h2 className="mt-4 text-2xl font-semibold">Built to not overclaim</h2>
            <p className="mt-3 text-muted-foreground">
              Code runs only in isolated sandboxes, never in your browser session. Credentials stay server-side. Every simulated result is labelled. Unresolved blockers are surfaced, not hidden.
            </p>
            <Button asChild variant="link" className="mt-4 px-0"><Link to="/setup">See what's live vs. demo →</Link></Button>
          </div>
          <ul className="space-y-3 text-sm">
            {["12 hosting providers designed in, connected one adapter at a time", "Diffs you approve before anything changes", "Revert any applied patch", "Framework detection with compatibility hints"].map((t) => (
              <li key={t} className="flex gap-3 rounded-lg border bg-surface-2 p-3"><CheckCircle2 className="size-4 shrink-0 text-cyan" aria-hidden />{t}</li>
            ))}
          </ul>
        </div>
      </section>
      <SiteFooter />
    </div>
  );
}

function HeroMock() {
  return (
    <div className="mt-16 overflow-hidden rounded-2xl border bg-code shadow-glow">
      <div className="flex items-center gap-2 border-b px-4 py-2.5">
        <span className="size-2.5 rounded-full bg-destructive/70" /><span className="size-2.5 rounded-full bg-warning/70" /><span className="size-2.5 rounded-full bg-success/70" />
        <span className="ml-3 font-mono text-xs text-muted-foreground">acme-storefront · fix-all-errors</span>
        <DemoBadge className="ml-auto" label="Simulated" />
      </div>
      <div className="grid gap-0 font-mono text-xs md:grid-cols-[1fr_1.2fr]">
        <div className="space-y-2 border-b p-5 md:border-b-0 md:border-r">
          {[["scan project", "done"], ["group root causes", "done"], ["propose patch", "done"], ["run checks", "simulated"], ["verify results", "1 blocker"]].map(([s, r]) => (
            <div key={s} className="flex justify-between"><span className="text-muted-foreground">▸ {s}</span><span className={r === "1 blocker" ? "text-warning" : "text-cyan"}>{r}</span></div>
          ))}
        </div>
        <pre className="overflow-x-auto p-5 leading-6">
<span className="text-muted-foreground">  src/components/ProductCard.tsx</span>{"\n"}
<span className="text-destructive">-      {"<h2>{product.title}</h2>"}</span>{"\n"}
<span className="text-success">+      {"<h2>{product.name}</h2>"}</span>{"\n"}
<span className="text-destructive">-  formatPrice(cart.length * 24)</span>{"\n"}
<span className="text-success">+  formatPrice(cart.length * 2400)</span>
        </pre>
      </div>
    </div>
  );
}
