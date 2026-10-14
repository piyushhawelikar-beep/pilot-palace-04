import { FlaskConical } from "lucide-react";
import { cn } from "@/lib/utils";

export function DemoBadge({
  label = "Sample data",
  className,
}: {
  label?: string;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full border border-warning/40 bg-warning/10 px-2 py-0.5 font-mono text-[10px] uppercase tracking-wider text-warning",
        className,
      )}
    >
      <FlaskConical className="size-3" aria-hidden /> {label}
    </span>
  );
}

export function StateBadge({
  state,
}: {
  state: "not_connected" | "adapter_missing" | "connected";
}) {
  const map = {
    not_connected: "border-border bg-muted text-muted-foreground",
    adapter_missing: "border-warning/40 bg-warning/10 text-warning",
    connected: "border-success/40 bg-success/10 text-success",
  } as const;
  const text = {
    not_connected: "Not connected",
    adapter_missing: "Adapter missing",
    connected: "Connected",
  }[state];
  return (
    <span className={cn("rounded-full border px-2 py-0.5 text-[11px] font-medium", map[state])}>
      {text}
    </span>
  );
}
