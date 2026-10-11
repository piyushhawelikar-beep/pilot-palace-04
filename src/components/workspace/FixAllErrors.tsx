import { useEffect, useState } from "react";
import { AlertTriangle, Check, CircleDashed, Loader2, RotateCcw, Wand2 } from "lucide-react";
import { toast } from "sonner";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { DemoBadge } from "@/components/DemoBadge";
import { SAMPLE_BLOCKERS, SAMPLE_ERRORS, SAMPLE_PATCH } from "@/lib/demo-data";
import type { FixStage } from "@/lib/types";
import { cn } from "@/lib/utils";

const STAGES: { id: FixStage; label: string; note: string }[] = [
  { id: "scan", label: "Scan project", note: "Read 5 files, collected 4 diagnostics (sample)." },
  { id: "group", label: "Group root causes", note: "4 symptoms → 4 root causes." },
  { id: "propose", label: "Propose patch", note: "3 files changed. 1 issue needs your input." },
  { id: "checks", label: "Run checks", note: "Simulated — no sandbox connected. Nothing was executed." },
  { id: "verify", label: "Verify results", note: "Not verified. Verification needs a real sandbox run." },
];

type Phase = "idle" | "running" | "review" | "applied";

export function FixAllErrors({ open, onOpenChange, applied, onApply, onRevert, log }: {
  open: boolean; onOpenChange: (o: boolean) => void; applied: boolean;
  onApply: () => void; onRevert: () => void; log: (line: string) => void;
}) {
  const [phase, setPhase] = useState<Phase>(applied ? "applied" : "idle");
  const [stage, setStage] = useState(-1);

  useEffect(() => {
    if (phase !== "running") return;
    if (stage >= STAGES.length) { setPhase("review"); log("[fix] simulation finished · 1 unresolved blocker"); return; }
    const t = setTimeout(() => {
      if (stage >= 0) log(`[fix] ${STAGES[stage].label.toLowerCase()} → ${STAGES[stage].note}`);
      setStage((s) => s + 1);
    }, 650);
    return () => clearTimeout(t);
  }, [phase, stage, log]);

  const start = () => { setStage(0); setPhase("running"); log("[fix] starting simulated Fix All Errors run (sample data)"); };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-full overflow-y-auto sm:max-w-2xl">
        <SheetHeader>
          <div className="flex items-center gap-2"><SheetTitle>Fix All Errors</SheetTitle><DemoBadge label="Simulated" /></div>
          <SheetDescription>This is a walkthrough on sample data. No AI model or sandbox is connected, so no code was executed and no fix is verified.</SheetDescription>
        </SheetHeader>

        <div className="space-y-6 px-4 pb-8">
          <ol className="space-y-2" aria-label="Stages">
            {STAGES.map((s, i) => {
              const done = phase === "review" || phase === "applied" || i < stage;
              const active = phase === "running" && i === stage;
              return (
                <li key={s.id} className={cn("flex gap-3 rounded-lg border p-3", active && "border-primary bg-primary/5")}>
                  <span className="mt-0.5">{done ? <Check className="size-4 text-cyan" /> : active ? <Loader2 className="size-4 animate-spin text-primary" /> : <CircleDashed className="size-4 text-muted-foreground" />}</span>
                  <div className="text-sm"><p className="font-medium">{s.label}</p>{(done || active) && <p className="text-xs text-muted-foreground">{s.note}</p>}</div>
                </li>
              );
            })}
          </ol>

          {phase === "idle" && <Button variant="hero" className="w-full" onClick={start}><Wand2 /> Start simulated run</Button>}

          {(phase === "review" || phase === "applied") && (
            <>
              <section>
                <h3 className="mb-2 text-sm font-semibold">Error report</h3>
                <ul className="divide-y rounded-lg border text-sm">
                  {SAMPLE_ERRORS.map((e) => (
                    <li key={e.id} className="p-3">
                      <p className="font-mono text-xs text-muted-foreground">{e.file}{e.line ? `:${e.line}` : ""}</p>
                      <p>{e.message}</p>
                      <p className="text-xs text-cyan">Root cause: {e.rootCause}</p>
                    </li>
                  ))}
                </ul>
              </section>

              <section>
                <h3 className="mb-2 text-sm font-semibold">Changed files ({SAMPLE_PATCH.length})</h3>
                <div className="space-y-3">
                  {SAMPLE_PATCH.map((h) => (
                    <div key={h.file} className="overflow-hidden rounded-lg border">
                      <p className="border-b bg-surface-2 px-3 py-1.5 font-mono text-xs">{h.file} <span className="text-success">+{h.after.length}</span> <span className="text-destructive">−{h.before.length}</span></p>
                      <pre className="overflow-x-auto bg-code p-3 font-mono text-xs leading-5">
                        {h.before.map((l, i) => <div key={`b${i}`} className="text-destructive">- {l}</div>)}
                        {h.after.map((l, i) => <div key={`a${i}`} className="text-success">+ {l}</div>)}
                      </pre>
                    </div>
                  ))}
                </div>
              </section>

              <section className="rounded-lg border border-warning/40 bg-warning/5 p-4">
                <p className="flex items-center gap-2 text-sm font-semibold text-warning"><AlertTriangle className="size-4" /> Unresolved blocker</p>
                {SAMPLE_BLOCKERS.map((b) => <div key={b.id} className="mt-2 text-sm"><p>{b.title}</p><p className="text-xs text-muted-foreground">{b.detail}</p></div>)}
              </section>

              <div className="flex flex-wrap gap-2">
                {phase === "review" ? (
                  <Button onClick={() => { onApply(); setPhase("applied"); toast.success("Patch applied to sample files", { description: "Local demo only. Checks were not run." }); }}><Check /> Apply patch</Button>
                ) : (
                  <Button variant="subtle" onClick={() => { onRevert(); setPhase("review"); toast("Patch reverted"); }}><RotateCcw /> Revert patch</Button>
                )}
                <Button variant="ghost" onClick={() => { setPhase("idle"); setStage(-1); }}>Run again</Button>
              </div>
            </>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}
