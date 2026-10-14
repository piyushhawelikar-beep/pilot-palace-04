import { useEffect, type ReactNode } from "react";
import { useNavigate } from "@tanstack/react-router";
import { Loader2 } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";

/**
 * Client-side gate. The session lives in browser storage, so the server cannot
 * check it during SSR: the server renders a loading state, then the browser
 * decides. This protects UI only — any future server data must verify the
 * user's token server-side and rely on RLS.
 */
export function RequireAuth({ children }: { children: ReactNode }) {
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && !user) navigate({ to: "/auth", replace: true });
  }, [loading, user, navigate]);

  if (loading || !user) {
    return (
      <div
        className="grid min-h-screen place-items-center text-sm text-muted-foreground"
        role="status"
      >
        <span className="flex items-center gap-2">
          <Loader2 className="size-4 animate-spin" /> Checking your session…
        </span>
      </div>
    );
  }
  return <>{children}</>;
}
