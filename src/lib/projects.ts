import { useCallback, useEffect, useState } from "react";
import { SAMPLE_PROJECTS, TEMPLATES } from "./demo-data";
import type { Project, TemplateId } from "./types";

const KEY = "devpilot.demo.projects.v1";

export function validateProjectInput(name: string, prompt: string): { name?: string; prompt?: string } {
  const errors: { name?: string; prompt?: string } = {};
  const n = name.trim();
  if (!n) errors.name = "Give your project a name.";
  else if (!/^[a-z0-9][a-z0-9-]{1,38}$/.test(n)) errors.name = "Use 2–39 lowercase letters, numbers or dashes.";
  if (prompt.trim().length < 12) errors.prompt = "Describe what you want in at least 12 characters.";
  else if (prompt.length > 600) errors.prompt = "Keep the prompt under 600 characters.";
  return errors;
}

/** Projects live in this browser only (localStorage). No cross-device sync in demo mode. */
export function useProjects() {
  const [projects, setProjects] = useState<Project[]>(SAMPLE_PROJECTS);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(KEY);
      if (raw) setProjects([...JSON.parse(raw), ...SAMPLE_PROJECTS]);
    } catch { /* ignore corrupt storage */ }
    setReady(true);
  }, []);

  const persist = (list: Project[]) =>
    localStorage.setItem(KEY, JSON.stringify(list.filter((p) => !p.isSample)));

  const create = useCallback((name: string, prompt: string, template: TemplateId) => {
    const t = TEMPLATES.find((x) => x.id === template);
    const p: Project = {
      id: `local-${Date.now()}`, name: name.trim(), prompt: prompt.trim(), template,
      framework: t?.framework ?? "Vite / React", status: "draft", errorCount: 0,
      updatedAt: new Date().toISOString(), isSample: false,
    };
    setProjects((prev) => { const next = [p, ...prev]; persist(next); return next; });
    return p;
  }, []);

  const remove = useCallback((id: string) => {
    setProjects((prev) => { const next = prev.filter((p) => p.id !== id); persist(next); return next; });
  }, []);

  return { projects, ready, create, remove };
}
