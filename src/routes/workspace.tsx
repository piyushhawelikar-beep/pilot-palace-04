import { createFileRoute } from "@tanstack/react-router";
import { useCallback, useState } from "react";
import {
  Bot,
  FileCode2,
  Monitor,
  Send,
  Smartphone,
  Tablet,
  Terminal,
  Wand2,
  X,
} from "lucide-react";
import { AppShell } from "@/components/AppShell";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { DemoBadge } from "@/components/DemoBadge";
import { CodeView } from "@/components/workspace/CodeView";
import { FixAllErrors } from "@/components/workspace/FixAllErrors";
import { SAMPLE_ERRORS, SAMPLE_FILES } from "@/lib/demo-data";
import type { ProjectFile } from "@/lib/types";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/workspace")({
  validateSearch: (s: Record<string, unknown>): { fix?: boolean } =>
    s["fix"] === true || s["fix"] === "true" ? { fix: true } : {},
  head: () => ({
    meta: [
      { title: "Workspace — DevPilot AI" },
      {
        name: "description",
        content: "File explorer, editor, preview, terminal and AI assistant in one workspace.",
      },
      { property: "og:title", content: "Workspace — DevPilot AI" },
      {
        property: "og:description",
        content: "Edit, preview and run Fix All Errors on your project.",
      },
    ],
  }),
  component: Workspace,
});

const PATCHED_FILES: Record<string, (c: string) => string> = {
  "src/App.tsx": (c) =>
    c
      .replace(
        'import { formatPrice } from "./lib/format";',
        'import { formatPrice } from "./lib/format";\nimport { useProducts } from "./hooks/useProducts";',
      )
      .replace("cart.length * 24)", "cart.length * 2400)"),
  "src/components/ProductCard.tsx": (c) => c.replace("product.title", "product.name"),
};
const NEW_FILE: ProjectFile = {
  path: "src/hooks/useProducts.ts",
  language: "ts",
  content:
    'export function useProducts() {\n  return [{ id: "mug", name: "Stoneware mug", price: 2400 }];\n}',
};

type Device = "desktop" | "tablet" | "mobile";
type Msg = { role: "user" | "assistant"; text: string };

function Workspace() {
  const { fix } = Route.useSearch();
  const navigate = Route.useNavigate();
  const [files, setFiles] = useState<ProjectFile[]>(SAMPLE_FILES);
  const [applied, setApplied] = useState(false);
  const [tabs, setTabs] = useState<string[]>(["src/App.tsx", "src/components/ProductCard.tsx"]);
  const [active, setActive] = useState("src/App.tsx");
  const [device, setDevice] = useState<Device>("desktop");
  const [bottom, setBottom] = useState<"terminal" | "problems">("terminal");
  const [logs, setLogs] = useState<string[]>([
    "$ devpilot status",
    "sandbox: not connected · commands are not executed in demo mode",
    "loaded sample project acme-storefront (4 sample diagnostics)",
  ]);
  const [msgs, setMsgs] = useState<Msg[]>([
    {
      role: "assistant",
      text: "Hi! I'm the assistant panel. No AI model is connected yet, so I can only point you to demo features. Try Fix All Errors.",
    },
  ]);
  const [draft, setDraft] = useState("");

  const log = useCallback((l: string) => setLogs((p) => [...p, l]), []);
  const openFile = (path: string) => {
    setTabs((t) => (t.includes(path) ? t : [...t, path]));
    setActive(path);
  };
  const closeTab = (path: string) => {
    setTabs((t) => {
      const n = t.filter((x) => x !== path);
      if (active === path) setActive(n.at(-1) ?? "");
      return n;
    });
  };
  const current = files.find((f) => f.path === active);
  const errorLines = applied
    ? []
    : SAMPLE_ERRORS.filter((e) => e.file === active).map((e) => e.line);
  const problems = applied ? SAMPLE_ERRORS.filter((e) => e.id === "e4") : SAMPLE_ERRORS;

  const apply = () => {
    setFiles((fs) => [
      ...fs.map((f) => {
        const p = PATCHED_FILES[f.path];
        return p ? { ...f, content: p(f.content) } : f;
      }),
      NEW_FILE,
    ]);
    setApplied(true);
    log("[fix] patch applied to 3 sample files (not verified)");
  };
  const revert = () => {
    setFiles(SAMPLE_FILES);
    setApplied(false);
    setTabs((t) => t.filter((x) => x !== NEW_FILE.path));
    if (active === NEW_FILE.path) setActive("src/App.tsx");
    log("[fix] patch reverted");
  };
  const send = (e: React.FormEvent) => {
    e.preventDefault();
    const q = draft.trim();
    if (!q) return;
    setMsgs((m) => [
      ...m,
      { role: "user", text: q },
      {
        role: "assistant",
        text: "AI provider not connected — I can't generate a real answer yet. When a server-side model adapter is configured, I'll answer with context from your open files.",
      },
    ]);
    setDraft("");
  };

  return (
    <AppShell
      title="acme-storefront"
      actions={
        <>
          <DemoBadge className="hidden sm:inline-flex" />
          <Button size="sm" variant="hero" onClick={() => navigate({ search: { fix: true } })}>
            <Wand2 /> Fix All Errors
          </Button>
        </>
      }
    >
      <div className="grid gap-3 lg:h-[calc(100vh-7.5rem)] lg:grid-cols-[200px_minmax(0,1fr)_300px] lg:grid-rows-[minmax(0,1fr)_200px]">
        {/* Explorer */}
        <section className="panel overflow-auto p-2 lg:row-span-2" aria-label="File explorer">
          <p className="px-2 py-1 text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
            Explorer
          </p>
          <ul>
            {files.map((f) => {
              const hasErr = !applied && SAMPLE_ERRORS.some((e) => e.file === f.path);
              return (
                <li key={f.path}>
                  <button
                    onClick={() => openFile(f.path)}
                    className={cn(
                      "flex w-full items-center gap-2 rounded px-2 py-1.5 text-left font-mono text-xs hover:bg-accent focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring",
                      active === f.path && "bg-accent",
                    )}
                  >
                    <FileCode2 className="size-3.5 shrink-0 text-muted-foreground" />
                    <span className="truncate">{f.path.replace("src/", "")}</span>
                    {hasErr && (
                      <span
                        className="ml-auto size-1.5 rounded-full bg-destructive"
                        aria-label="has errors"
                      />
                    )}
                  </button>
                </li>
              );
            })}
          </ul>
        </section>

        {/* Editor + preview */}
        <section className="grid min-h-[420px] gap-3 md:grid-cols-2">
          <div className="panel flex min-h-0 flex-col overflow-hidden">
            <div className="flex overflow-x-auto border-b" role="tablist" aria-label="Open files">
              {tabs.map((t) => (
                <div
                  key={t}
                  className={cn(
                    "flex items-center border-r",
                    active === t ? "bg-code" : "bg-surface",
                  )}
                >
                  <button
                    role="tab"
                    aria-selected={active === t}
                    onClick={() => setActive(t)}
                    className="px-3 py-2 font-mono text-xs whitespace-nowrap"
                  >
                    {t.split("/").pop()}
                  </button>
                  <button
                    aria-label={`Close ${t}`}
                    onClick={() => closeTab(t)}
                    className="pr-2 text-muted-foreground hover:text-foreground"
                  >
                    <X className="size-3" />
                  </button>
                </div>
              ))}
            </div>
            <div className="min-h-0 flex-1">
              {current ? (
                <CodeView code={current.content} errorLines={errorLines} />
              ) : (
                <div className="grid h-full place-items-center text-sm text-muted-foreground">
                  Open a file from the explorer.
                </div>
              )}
            </div>
          </div>
          <div className="panel flex min-h-0 flex-col overflow-hidden">
            <div className="flex items-center gap-1 border-b px-2 py-1.5">
              <span className="px-1 text-xs text-muted-foreground">Preview</span>
              <div className="ml-auto flex gap-1" role="group" aria-label="Preview device">
                {(
                  [
                    ["desktop", Monitor],
                    ["tablet", Tablet],
                    ["mobile", Smartphone],
                  ] as const
                ).map(([d, Icon]) => (
                  <Button
                    key={d}
                    size="icon"
                    variant={device === d ? "subtle" : "ghost"}
                    className="size-7"
                    aria-label={`${d} preview`}
                    aria-pressed={device === d}
                    onClick={() => setDevice(d)}
                  >
                    <Icon />
                  </Button>
                ))}
              </div>
            </div>
            <div className="flex flex-1 items-start justify-center overflow-auto bg-code p-3">
              <div
                className={cn(
                  "rounded-md border bg-surface-2 p-4 transition-all",
                  device === "desktop" ? "w-full" : device === "tablet" ? "w-[300px]" : "w-[200px]",
                )}
              >
                <p className="text-[10px] text-muted-foreground">Static mock — no sandbox render</p>
                <p className="mt-2 font-display font-semibold">Acme Ceramics</p>
                <div
                  className={cn(
                    "mt-3 grid gap-2",
                    device === "desktop" ? "grid-cols-2" : "grid-cols-1",
                  )}
                >
                  <div className="rounded border p-2 text-xs">
                    {applied ? (
                      "Stoneware mug"
                    ) : (
                      <span className="text-destructive">undefined</span>
                    )}
                    <div className="mt-1 h-5 rounded bg-primary/30" />
                  </div>
                </div>
                <p className="mt-3 text-xs">
                  Total: {applied ? "$24.00" : <span className="text-destructive">$0.24</span>}
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Assistant */}
        <section
          className="panel flex min-h-[320px] flex-col lg:row-span-2"
          aria-label="AI assistant"
        >
          <div className="flex items-center gap-2 border-b px-3 py-2">
            <Bot className="size-4 text-cyan" />
            <span className="text-sm font-medium">Assistant</span>
            <span className="ml-auto text-[11px] text-muted-foreground">model: not connected</span>
          </div>
          <div className="flex-1 space-y-3 overflow-auto p-3" aria-live="polite">
            {msgs.map((m, i) => (
              <div
                key={i}
                className={cn(
                  "rounded-lg px-3 py-2 text-sm",
                  m.role === "user" ? "ml-6 bg-primary/15" : "mr-6 bg-surface-2",
                )}
              >
                {m.text}
              </div>
            ))}
          </div>
          <form onSubmit={send} className="flex gap-2 border-t p-2">
            <Textarea
              rows={1}
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              placeholder="Ask about this project…"
              aria-label="Message"
              className="min-h-9 resize-none"
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  send(e);
                }
              }}
            />
            <Button type="submit" size="icon" aria-label="Send" disabled={!draft.trim()}>
              <Send />
            </Button>
          </form>
        </section>

        {/* Terminal */}
        <section
          className="panel flex min-h-[200px] flex-col overflow-hidden"
          aria-label="Terminal and problems"
        >
          <div className="flex border-b" role="tablist">
            {(["terminal", "problems"] as const).map((t) => (
              <button
                key={t}
                role="tab"
                aria-selected={bottom === t}
                onClick={() => setBottom(t)}
                className={cn(
                  "flex items-center gap-1.5 px-3 py-1.5 text-xs capitalize",
                  bottom === t
                    ? "border-b-2 border-primary text-foreground"
                    : "text-muted-foreground",
                )}
              >
                {t === "terminal" && <Terminal className="size-3" />}
                {t}
                {t === "problems" && (
                  <span className="rounded bg-destructive/20 px-1 text-destructive">
                    {problems.length}
                  </span>
                )}
              </button>
            ))}
            <Button
              size="sm"
              variant="ghost"
              className="ml-auto h-7 text-xs"
              onClick={() => setLogs([])}
            >
              Clear
            </Button>
          </div>
          <div className="flex-1 overflow-auto bg-code p-3 font-mono text-xs leading-5">
            {bottom === "terminal" ? (
              logs.length ? (
                logs.map((l, i) => (
                  <div
                    key={i}
                    className={l.startsWith("[fix]") ? "text-cyan" : "text-muted-foreground"}
                  >
                    {l}
                  </div>
                ))
              ) : (
                <p className="text-muted-foreground">Log cleared.</p>
              )
            ) : (
              problems.map((p) => (
                <button
                  key={p.id}
                  onClick={() => p.line && openFile(p.file)}
                  className="block text-left hover:underline"
                >
                  <span className="text-destructive">✕</span> {p.file}
                  {p.line ? `:${p.line}` : ""} — {p.message}
                </button>
              ))
            )}
          </div>
        </section>
      </div>

      <FixAllErrors
        open={!!fix}
        onOpenChange={(o) => navigate({ search: o ? { fix: true } : {} })}
        applied={applied}
        onApply={apply}
        onRevert={revert}
        log={log}
      />
    </AppShell>
  );
}
