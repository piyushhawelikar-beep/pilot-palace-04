import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Loader2, MailCheck } from "lucide-react";
import { Logo } from "@/components/Logo";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/hooks/use-auth";
import { supabase, supabaseConfigError } from "@/lib/supabase";
import { validateAuthForm, type AuthMode } from "@/lib/auth-validation";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/auth")({
  head: () => ({
    meta: [
      { title: "Sign in — DevPilot AI" },
      { name: "description", content: "Sign in or create a DevPilot AI account." },
      { property: "og:title", content: "Sign in — DevPilot AI" },
      { property: "og:description", content: "Sign in to your DevPilot AI workspace." },
    ],
  }),
  component: Auth,
});

function Auth() {
  const { user, loading, recovery } = useAuth();
  const navigate = useNavigate();
  const [mode, setMode] = useState<AuthMode>("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});
  const [formError, setFormError] = useState("");
  const [busy, setBusy] = useState(false);
  const [sent, setSent] = useState<null | "confirm" | "reset">(null);

  useEffect(() => {
    if (loading || !user) return;
    navigate({ to: recovery ? "/reset-password" : "/dashboard", replace: true });
  }, [loading, user, recovery, navigate]);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError("");
    const v = validateAuthForm(mode, email, password);
    setErrors(v);
    if (Object.keys(v).length || supabaseConfigError) return;
    setBusy(true);
    const origin = window.location.origin;
    try {
      if (mode === "signin") {
        const { error } = await supabase.auth.signInWithPassword({ email: email.trim(), password });
        if (error) throw error;
        // Redirect happens via the auth listener above.
      } else if (mode === "signup") {
        const { data, error } = await supabase.auth.signUp({ email: email.trim(), password, options: { emailRedirectTo: `${origin}/dashboard` } });
        if (error) throw error;
        if (!data.session) setSent("confirm"); // confirmation required — stay here
      } else {
        const { error } = await supabase.auth.resetPasswordForEmail(email.trim(), { redirectTo: `${origin}/reset-password` });
        if (error) throw error;
        setSent("reset");
      }
    } catch (err) {
      setFormError(err instanceof Error ? err.message : "Something went wrong. Please try again.");
    } finally {
      setBusy(false);
    }
  };

  const switchMode = (m: AuthMode) => { setMode(m); setErrors({}); setFormError(""); setSent(null); };
  const title = { signin: "Welcome back", signup: "Create your account", forgot: "Reset your password" }[mode];

  return (
    <div className="grid min-h-screen place-items-center bg-glow px-4 py-10">
      <div className="panel w-full max-w-md space-y-6 p-8">
        <Logo />
        {supabaseConfigError && (
          <div className="rounded-lg border border-destructive/40 bg-destructive/10 p-3 text-sm text-destructive" role="alert">
            {supabaseConfigError} See <Link to="/setup" className="underline">setup</Link>.
          </div>
        )}
        {sent ? (
          <div className="space-y-4 text-center" role="status">
            <MailCheck className="mx-auto size-10 text-cyan" />
            <h1 className="text-xl font-semibold">Check your email</h1>
            <p className="text-sm text-muted-foreground">
              {sent === "confirm"
                ? <>We sent a confirmation link to <b className="text-foreground">{email}</b>. Confirm it, then sign in.</>
                : <>If an account exists for <b className="text-foreground">{email}</b>, a password reset link is on its way.</>}
            </p>
            <Button variant="subtle" className="w-full" onClick={() => switchMode("signin")}>Back to sign in</Button>
          </div>
        ) : (
          <>
            <div>
              <h1 className="text-2xl font-semibold">{title}</h1>
              {mode !== "forgot" && (
                <div className="mt-4 grid grid-cols-2 rounded-lg border p-1" role="tablist">
                  {(["signin", "signup"] as const).map((m) => (
                    <button key={m} role="tab" aria-selected={mode === m} onClick={() => switchMode(m)} className={cn("rounded-md py-1.5 text-sm", mode === m ? "bg-accent" : "text-muted-foreground")}>
                      {m === "signin" ? "Sign in" : "Sign up"}
                    </button>
                  ))}
                </div>
              )}
            </div>
            <form onSubmit={submit} className="space-y-4" noValidate>
              <div className="space-y-1.5">
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)} aria-invalid={!!errors.email} aria-describedby="email-err" />
                {errors.email && <p id="email-err" className="text-xs text-destructive">{errors.email}</p>}
              </div>
              {mode !== "forgot" && (
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="password">Password</Label>
                    {mode === "signin" && <button type="button" onClick={() => switchMode("forgot")} className="text-xs text-cyan hover:underline">Forgot password?</button>}
                  </div>
                  <Input id="password" type="password" autoComplete={mode === "signup" ? "new-password" : "current-password"} value={password} onChange={(e) => setPassword(e.target.value)} aria-invalid={!!errors.password} aria-describedby="pw-err" />
                  {errors.password && <p id="pw-err" className="text-xs text-destructive">{errors.password}</p>}
                </div>
              )}
              {formError && <p className="rounded-md bg-destructive/10 p-2 text-sm text-destructive" role="alert">{formError}</p>}
              <Button type="submit" variant="hero" className="w-full" disabled={busy || !!supabaseConfigError}>
                {busy && <Loader2 className="animate-spin" />}
                {mode === "signin" ? "Sign in" : mode === "signup" ? "Create account" : "Send reset link"}
              </Button>
              {mode === "forgot" && <Button type="button" variant="ghost" className="w-full" onClick={() => switchMode("signin")}>Back to sign in</Button>}
            </form>
          </>
        )}
        <p className="text-center text-xs text-muted-foreground">Projects in this preview are still stored in your browser only, even after signing in.</p>
      </div>
    </div>
  );
}
