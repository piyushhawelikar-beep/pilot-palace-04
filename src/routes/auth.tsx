import { createFileRoute, Link } from "@tanstack/react-router";
import { Logo } from "@/components/Logo";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/auth")({
  head: () => ({
    meta: [
      { title: "Sign in — DevPilot AI" },
      { name: "description", content: "Sign in or create a DevPilot AI account." },
      { property: "og:title", content: "Sign in — DevPilot AI" },
      { property: "og:description", content: "Accounts are coming soon; use the local demo workspace today." },
    ],
  }),
  component: Auth,
});

function Auth() {
  return (
    <div className="grid min-h-screen place-items-center bg-glow px-4">
      <div className="panel w-full max-w-md space-y-5 p-8">
        <Logo />
        <h1 className="text-2xl font-semibold">Sign in / Sign up</h1>
        <div className="rounded-lg border border-warning/40 bg-warning/5 p-4 text-sm">
          <p className="font-medium text-warning">Accounts aren't configured yet</p>
          <p className="mt-1 text-muted-foreground">You can use the full demo workspace now. Projects are saved in this browser only and won't appear on other devices.</p>
        </div>
        <Button asChild variant="hero" className="w-full"><Link to="/dashboard">Continue to demo workspace</Link></Button>
        <Button asChild variant="ghost" className="w-full"><Link to="/setup">What's needed to enable accounts</Link></Button>
      </div>
    </div>
  );
}
