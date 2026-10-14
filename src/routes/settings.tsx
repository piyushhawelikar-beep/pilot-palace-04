import { createFileRoute, Link } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { StateBadge } from "@/components/DemoBadge";

export const Route = createFileRoute("/settings")({
  head: () => ({
    meta: [
      { title: "Settings — DevPilot AI" },
      { name: "description", content: "Project settings, integrations and billing status." },
      { property: "og:title", content: "Settings — DevPilot AI" },
      { property: "og:description", content: "Manage project settings and integrations." },
    ],
  }),
  component: Settings,
});

const INTEGRATIONS = [
  "AI model provider",
  "Sandbox execution",
  "GitHub",
  "Authentication",
  "Billing (Stripe)",
];

function Settings() {
  return (
    <AppShell title="Settings">
      <div className="grid max-w-4xl gap-6">
        <section className="panel p-5">
          <h2 className="font-semibold">Integrations</h2>
          <ul className="mt-3 divide-y">
            {INTEGRATIONS.map((i) => (
              <li key={i} className="flex items-center justify-between py-3 text-sm">
                {i}
                <StateBadge state="not_connected" />
              </li>
            ))}
          </ul>
        </section>
        <section className="panel p-5 text-sm">
          <h2 className="font-semibold">Environment variables</h2>
          <p className="mt-2 text-muted-foreground">
            Secrets will be stored server-side once a backend is connected. They are never kept in
            the browser.
          </p>
        </section>
        <section className="panel p-5 text-sm">
          <h2 className="font-semibold">Billing</h2>
          <p className="mt-2 text-muted-foreground">
            Billing is not active.{" "}
            <Link to="/pricing" className="text-cyan hover:underline">
              See draft plans
            </Link>
            .
          </p>
        </section>
      </div>
    </AppShell>
  );
}
