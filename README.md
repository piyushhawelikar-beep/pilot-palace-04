# Pilot Palace

Build Phase 1 of a professional SaaS product called DevPilot AI: a premium, production-minded AI-assisted developer workspace that will eventually support project-wide one-shot debugging and deployment across many hosting providers. This is the foundation of a real product intended for public users and future monetization, not a static school demo.

Create a polished, distinctive responsive dark-mode SaaS web app with a professional landing page, product dashboard/workspace, pricing page, and clear onboarding. Use React/TypeScript, Tailwind and accessible reusable components. Visual style: refined charcoal/navy, restrained electric violet/cyan accents, high-quality typography, strong spacing, polished responsive mobile behavior. Avoid generic template appearance.

MVP product UI:
- Landing page with clear value proposition: build, debug, verify, deploy; CTA buttons that navigate to actual app sections.
- Dashboard with recent projects, project creation from a prompt, templates (React app, portfolio, landing page, dashboard, ecommerce), project status, and usage summary.
- Developer workspace with file explorer, tabbed syntax-styled editor/sample files, preview pane, terminal/log panel, and AI assistant panel.
- A prominent Fix All Errors workflow that displays stages: scan project, group root causes, propose patch, run checks, verify results. Clearly mark simulation/sample data wherever real model execution or sandbox is not connected. Include error report, changed-files summary, reviewable diff, apply/revert interaction, and unresolved blocker state. Do not claim real code was executed or a fix verified when it was not.
- Deployment center with provider cards for Vercel, Netlify, Cloudflare Pages, GitHub Pages, Firebase Hosting, Render, Railway, AWS, Google Cloud, Azure, DigitalOcean and self-hosted Docker/SSH. Distinguish provider-ready UI from connected providers; show integration state as Not connected until credentials and actual adapters are configured. Provide project framework detection mock data explicitly labelled sample/demo, compatibility hints, build settings, logs, deployment history, rollback UI, and live URL states without inventing a real successful deployment.
- Pricing page with Free, Pro, and Team plan concepts; show proposed pricing as a draft / not yet active and do not add fake payment processing. Include usage metering UI as demo data.
- Add sign-in/sign-up entry points and a clean auth-aware structure if backend auth is available, otherwise clearly mark auth as not configured and provide a useful local demo workspace. Do not falsely claim user data persists across devices if it does not.
- Project settings, integrations, billing, documentation/help, and feedback entry points.

Professional requirements: every visible main CTA should do something meaningful, including project creation, template selection, tabs, preview device switch, Fix All Errors demo flow, logs, deployment provider selection, navigation, and pricing toggles if present. Add loading/empty/error/success states, responsive layout, keyboard accessibility, form validation, and thoughtful microcopy. Use believable sample projects and sample errors but label sample/simulated results honestly.

Security and architecture: never place secrets in frontend code; never execute arbitrary code in the main app; plan for isolated sandbox execution, server-side AI provider adapters, OAuth/secure token storage, and provider-specific deployment adapters. Structure UI and types so real integrations can be added incrementally. Do not create fake API integrations. Avoid exposing credentials or destructive actions.

Scope: implement Phase 1 as a cohesive usable product foundation first, with a coherent navigation and a strong interactive workspace. Add a README or in-app setup page explaining which features are demo-only and what integrations are required to make AI, code execution, authentication, billing, and deployment real. Do not claim universal hosting or guaranteed one-shot fixes until actual integrations and verification exist.

This project was built with [Lovable](https://lovable.dev).

**Live app**: https://pilot-palace-04.lovable.app

## Authentication setup (email/password)

DevPilot AI uses a single browser auth client in `src/lib/supabase.ts`.

### Environment variables
| Name | Purpose |
| --- | --- |
| `VITE_SUPABASE_URL` | Your project URL |
| `VITE_SUPABASE_PUBLISHABLE_KEY` | Publishable (anon) key — safe for the browser |

Never put a service-role/secret key in any `VITE_` variable or in frontend code. If either variable is missing, the sign-in page shows a configuration error instead of crashing.

### Auth dashboard configuration
1. **Authentication → Providers → Email**: enable Email provider. Keep "Confirm email" ON for production.
2. **Authentication → URL Configuration**:
   - Site URL: your published URL (e.g. `https://pilot-palace-04.lovable.app`).
   - Redirect URLs (add every origin you use, preview + published + custom domain):
     - `https://<your-origin>/dashboard` (after email confirmation)
     - `https://<your-origin>/reset-password` (password recovery)
3. **Email templates**: the default confirm-signup and reset-password templates work; they use the redirect URLs above.

### Routes
- `/auth` — sign in, sign up, forgot password (public)
- `/reset-password` — set a new password from the email link (public)
- `/dashboard`, `/workspace`, `/deploy`, `/settings` — protected

Protection is **client-side**: the session lives in browser storage, so the server renders a "checking session" state and the browser redirects signed-out users to `/auth`. This guards UI only. Any future server data must verify the user's token server-side.

### Data honesty
Signing in does **not** make project data server-backed. Projects, sample data and feedback are still in browser `localStorage` and do not sync across devices. When user-owned tables are introduced, each must have Row Level Security policies scoped with `auth.uid()` (e.g. `user_id = auth.uid()`). No tables or policies were created by this change.

### Manual test checklist
- [ ] Visit `/dashboard` signed out → redirected to `/auth`
- [ ] Sign up → "Check your email" shown, no dashboard redirect
- [ ] Click confirmation link → lands on `/dashboard`, email shown in header
- [ ] Sign out → back on `/auth`; Back button doesn't show the dashboard
- [ ] Wrong password → error message shown
- [ ] Forgot password → email received → `/reset-password` → new password works
- [ ] Expired/opened-twice reset link → "invalid or expired" message

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/aac00f46-747d-431c-8526-9e3dfc35cc44).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
