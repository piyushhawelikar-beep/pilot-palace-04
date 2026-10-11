import { Link } from "@tanstack/react-router";
import { useState, type ReactNode } from "react";
import { BookOpen, CreditCard, Code2, LayoutGrid, Menu, MessageSquare, Rocket, Settings, X } from "lucide-react";
import { Logo } from "./Logo";
import { FeedbackDialog } from "./FeedbackDialog";
import { Button } from "@/components/ui/button";

const NAV = [
  { to: "/dashboard", label: "Dashboard", icon: LayoutGrid },
  { to: "/workspace", label: "Workspace", icon: Code2 },
  { to: "/deploy", label: "Deploy", icon: Rocket },
  { to: "/settings", label: "Settings", icon: Settings },
  { to: "/pricing", label: "Plans & billing", icon: CreditCard },
  { to: "/setup", label: "Docs & setup", icon: BookOpen },
] as const;

export function AppShell({ title, actions, children }: { title: string; actions?: ReactNode; children: ReactNode }) {
  const [open, setOpen] = useState(false);
  const nav = (
    <nav className="flex flex-col gap-1" aria-label="App">
      {NAV.map(({ to, label, icon: Icon }) => (
        <Link key={to} to={to} onClick={() => setOpen(false)}
          className="flex items-center gap-3 rounded-md px-3 py-2 text-sm text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
          activeProps={{ className: "bg-accent text-foreground" }}>
          <Icon className="size-4" aria-hidden /> {label}
        </Link>
      ))}
    </nav>
  );
  const footer = (
    <div className="mt-auto space-y-3">
      <FeedbackDialog trigger={<Button variant="ghost" size="sm" className="w-full justify-start"><MessageSquare /> Send feedback</Button>} />
      <div className="rounded-lg border border-warning/30 bg-warning/5 p-3 text-xs text-muted-foreground">
        <p className="font-medium text-warning">Local demo workspace</p>
        Accounts aren't configured yet. Projects you create are saved in this browser only.
        <Link to="/auth" className="mt-2 block text-cyan hover:underline">Sign-in status →</Link>
      </div>
    </div>
  );
  return (
    <div className="flex min-h-screen">
      <aside className="sticky top-0 hidden h-screen w-60 shrink-0 flex-col gap-6 border-r bg-surface p-4 lg:flex">
        <Logo />{nav}{footer}
      </aside>
      {open && (
        <div className="fixed inset-0 z-50 lg:hidden" role="dialog" aria-modal="true" aria-label="Navigation">
          <div className="absolute inset-0 bg-background/80 backdrop-blur" onClick={() => setOpen(false)} />
          <aside className="relative flex h-full w-72 flex-col gap-6 border-r bg-surface p-4">
            <div className="flex items-center justify-between"><Logo /><Button variant="ghost" size="icon" aria-label="Close menu" onClick={() => setOpen(false)}><X /></Button></div>
            {nav}{footer}
          </aside>
        </div>
      )}
      <div className="flex min-w-0 flex-1 flex-col">
        <header className="sticky top-0 z-30 flex h-14 items-center gap-3 border-b bg-background/85 px-4 backdrop-blur md:px-6">
          <Button variant="ghost" size="icon" className="lg:hidden" aria-label="Open menu" onClick={() => setOpen(true)}><Menu /></Button>
          <h1 className="truncate text-base font-semibold">{title}</h1>
          <div className="ml-auto flex items-center gap-2">{actions}</div>
        </header>
        <main className="min-w-0 flex-1 p-4 md:p-6">{children}</main>
      </div>
    </div>
  );
}
