import { Link } from "@tanstack/react-router";

export function Logo() {
  return (
    <Link to="/" className="flex items-center gap-2 font-display text-[15px] font-semibold tracking-tight">
      <span className="grid size-7 place-items-center rounded-lg bg-gradient-brand text-primary-foreground shadow-glow">
        <svg viewBox="0 0 24 24" className="size-4" fill="none" stroke="currentColor" strokeWidth="2.4" aria-hidden><path d="M4 17l6-6-6-6M12 19h8" strokeLinecap="round" strokeLinejoin="round" /></svg>
      </span>
      DevPilot<span className="text-gradient">AI</span>
    </Link>
  );
}
