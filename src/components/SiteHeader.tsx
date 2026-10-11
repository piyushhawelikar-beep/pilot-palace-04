import { Link } from "@tanstack/react-router";
import { Logo } from "./Logo";
import { Button } from "@/components/ui/button";

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-border/60 bg-background/75 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-6xl items-center gap-6 px-5">
        <Logo />
        <nav className="hidden items-center gap-5 text-sm text-muted-foreground md:flex" aria-label="Main">
          <Link to="/workspace" className="hover:text-foreground">Workspace</Link>
          <Link to="/deploy" className="hover:text-foreground">Deploy</Link>
          <Link to="/pricing" className="hover:text-foreground">Pricing</Link>
          <Link to="/setup" className="hover:text-foreground">Docs</Link>
        </nav>
        <div className="ml-auto flex items-center gap-2">
          <Button asChild variant="ghost" size="sm"><Link to="/auth">Sign in</Link></Button>
          <Button asChild variant="hero" size="sm"><Link to="/dashboard">Open app</Link></Button>
        </div>
      </div>
    </header>
  );
}

export function SiteFooter() {
  return (
    <footer className="border-t">
      <div className="mx-auto flex max-w-6xl flex-col gap-4 px-5 py-10 text-sm text-muted-foreground md:flex-row md:items-center">
        <Logo />
        <p className="md:ml-6">Phase 1 preview. AI, sandbox and deploy adapters are not connected yet.</p>
        <div className="flex gap-4 md:ml-auto">
          <Link to="/setup" className="hover:text-foreground">Setup status</Link>
          <Link to="/pricing" className="hover:text-foreground">Pricing</Link>
        </div>
      </div>
    </footer>
  );
}
