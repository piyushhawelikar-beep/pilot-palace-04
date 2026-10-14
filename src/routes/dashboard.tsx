import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { FolderGit2, Loader2, Plus, Sparkles, Trash2 } from "lucide-react";
import { AppShell } from "@/components/AppShell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { DemoBadge } from "@/components/DemoBadge";
import { DEMO_USAGE, TEMPLATES } from "@/lib/demo-data";
import { useProjects, validateProjectInput } from "@/lib/projects";
import type { ProjectStatus, TemplateId } from "@/lib/types";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/dashboard")({
  head: () => ({
    meta: [
      { title: "Dashboard — DevPilot AI" },
      { name: "description", content: "Your projects, templates and usage in DevPilot AI." },
      { property: "og:title", content: "Dashboard — DevPilot AI" },
      {
        property: "og:description",
        content: "Create projects from a prompt or template and track their status.",
      },
    ],
  }),
  component: Dashboard,
});

const STATUS: Record<ProjectStatus, { label: string; cls: string }> = {
  draft: { label: "Draft", cls: "bg-muted text-muted-foreground" },
  healthy: { label: "No known errors", cls: "bg-success/15 text-success" },
  errors: { label: "Errors found", cls: "bg-destructive/15 text-destructive" },
  "deploying-blocked": { label: "Deploy blocked", cls: "bg-warning/15 text-warning" },
};

function Dashboard() {
  const { projects, ready, create, remove } = useProjects();
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [prompt, setPrompt] = useState("");
  const [template, setTemplate] = useState<TemplateId>("react-app");
  const [errors, setErrors] = useState<{ name?: string; prompt?: string }>({});
  const [busy, setBusy] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    const v = validateProjectInput(name, prompt);
    setErrors(v);
    if (Object.keys(v).length) return;
    setBusy(true);
    await new Promise((r) => setTimeout(r, 700));
    const p = create(name, prompt, template);
    setBusy(false);
    setName("");
    setPrompt("");
    toast.success(`Created ${p.name}`, {
      description: "Scaffolded from the template locally. AI generation is not connected yet.",
    });
  };

  return (
    <AppShell
      title="Dashboard"
      actions={
        <Button asChild size="sm" variant="hero">
          <Link to="/workspace">
            <Sparkles /> Open workspace
          </Link>
        </Button>
      }
    >
      <div className="grid gap-6 xl:grid-cols-[1fr_320px]">
        <div className="space-y-6">
          <form onSubmit={submit} className="panel space-y-4 p-5" noValidate>
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold">New project</h2>
              <span className="text-xs text-muted-foreground">AI generation: not connected</span>
            </div>
            <div className="grid gap-4 md:grid-cols-[220px_1fr]">
              <div className="space-y-1.5">
                <Label htmlFor="pname">Project name</Label>
                <Input
                  id="pname"
                  placeholder="my-app"
                  value={name}
                  onChange={(e) => setName(e.target.value.toLowerCase())}
                  aria-invalid={!!errors.name}
                  aria-describedby="pname-err"
                />
                {errors.name && (
                  <p id="pname-err" className="text-xs text-destructive">
                    {errors.name}
                  </p>
                )}
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="pprompt">Describe what to build</Label>
                <Textarea
                  id="pprompt"
                  rows={2}
                  placeholder="A booking site for a yoga studio with class schedule and contact form"
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  aria-invalid={!!errors.prompt}
                  aria-describedby="pprompt-err"
                />
                {errors.prompt && (
                  <p id="pprompt-err" className="text-xs text-destructive">
                    {errors.prompt}
                  </p>
                )}
              </div>
            </div>
            <fieldset>
              <legend className="mb-2 text-sm font-medium">Template</legend>
              <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-5" role="radiogroup">
                {TEMPLATES.map((t) => (
                  <button
                    type="button"
                    key={t.id}
                    role="radio"
                    aria-checked={template === t.id}
                    onClick={() => setTemplate(t.id)}
                    className={cn(
                      "rounded-lg border p-3 text-left transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                      template === t.id
                        ? "border-primary bg-primary/10"
                        : "bg-surface-2 hover:border-muted-foreground/40",
                    )}
                  >
                    <p className="text-sm font-medium">{t.name}</p>
                    <p className="mt-1 text-xs text-muted-foreground">{t.desc}</p>
                  </button>
                ))}
              </div>
            </fieldset>
            <Button type="submit" disabled={busy}>
              {busy ? <Loader2 className="animate-spin" /> : <Plus />} Create project
            </Button>
          </form>

          <section className="panel p-5">
            <h2 className="text-lg font-semibold">Recent projects</h2>
            {!ready ? (
              <div className="mt-4 space-y-2">
                {[0, 1, 2].map((i) => (
                  <div key={i} className="h-14 animate-pulse rounded-lg bg-muted" />
                ))}
              </div>
            ) : projects.length === 0 ? (
              <div className="mt-6 rounded-lg border border-dashed p-8 text-center text-sm text-muted-foreground">
                <FolderGit2 className="mx-auto mb-2 size-6" />
                No projects yet. Create one above.
              </div>
            ) : (
              <ul className="mt-4 divide-y">
                {projects.map((p) => (
                  <li key={p.id} className="flex flex-wrap items-center gap-3 py-3">
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <p className="truncate font-mono text-sm">{p.name}</p>
                        {p.isSample && <DemoBadge label="Sample" />}
                      </div>
                      <p className="truncate text-xs text-muted-foreground">
                        {p.framework} · {p.prompt}
                      </p>
                    </div>
                    <span className={cn("rounded-full px-2 py-0.5 text-xs", STATUS[p.status].cls)}>
                      {STATUS[p.status].label}
                      {p.errorCount ? ` · ${p.errorCount}` : ""}
                    </span>
                    <Button
                      size="sm"
                      variant="subtle"
                      onClick={() => navigate({ to: "/workspace" })}
                    >
                      Open
                    </Button>
                    {!p.isSample && (
                      <Button
                        size="icon"
                        variant="ghost"
                        aria-label={`Delete ${p.name}`}
                        onClick={() => {
                          remove(p.id);
                          toast("Project removed from this browser");
                        }}
                      >
                        <Trash2 />
                      </Button>
                    )}
                  </li>
                ))}
              </ul>
            )}
          </section>
        </div>

        <aside className="space-y-6">
          <section className="panel p-5">
            <div className="flex items-center justify-between">
              <h2 className="font-semibold">Usage this month</h2>
              <DemoBadge label="Demo" />
            </div>
            {[
              ["AI fix runs", DEMO_USAGE.fixRuns, DEMO_USAGE.fixRunsLimit],
              ["Sandbox minutes", DEMO_USAGE.sandboxMinutes, DEMO_USAGE.sandboxLimit],
              ["Projects", DEMO_USAGE.projects, DEMO_USAGE.projectsLimit],
            ].map(([l, v, m]) => (
              <div key={l as string} className="mt-4">
                <div className="mb-1.5 flex justify-between text-sm">
                  <span>{l}</span>
                  <span className="font-mono text-muted-foreground">
                    {v}/{m}
                  </span>
                </div>
                <Progress value={((v as number) / (m as number)) * 100} />
              </div>
            ))}
            <p className="mt-4 text-xs text-muted-foreground">
              Metering isn't live. Numbers are illustrative.
            </p>
          </section>
          <section className="panel p-5 text-sm">
            <h2 className="font-semibold">Get started</h2>
            <ol className="mt-3 space-y-2 text-muted-foreground">
              <li>
                1.{" "}
                <Link to="/workspace" className="text-cyan hover:underline">
                  Explore the sample workspace
                </Link>
              </li>
              <li>
                2.{" "}
                <Link to="/workspace" search={{ fix: true }} className="text-cyan hover:underline">
                  Run the Fix All Errors demo
                </Link>
              </li>
              <li>
                3.{" "}
                <Link to="/deploy" className="text-cyan hover:underline">
                  Review deploy providers
                </Link>
              </li>
              <li>
                4.{" "}
                <Link to="/setup" className="text-cyan hover:underline">
                  See what's needed to go live
                </Link>
              </li>
            </ol>
          </section>
        </aside>
      </div>
    </AppShell>
  );
}
