import type {
  DeployProvider,
  DetectedError,
  PatchHunk,
  Project,
  ProjectFile,
  TemplateId,
} from "./types";

export const TEMPLATES: { id: TemplateId; name: string; desc: string; framework: string }[] = [
  {
    id: "react-app",
    name: "React app",
    desc: "Vite + React + TypeScript starter with routing.",
    framework: "Vite / React",
  },
  {
    id: "portfolio",
    name: "Portfolio",
    desc: "Personal site with projects grid and contact.",
    framework: "Vite / React",
  },
  {
    id: "landing",
    name: "Landing page",
    desc: "Marketing page with hero, features, pricing.",
    framework: "Vite / React",
  },
  {
    id: "dashboard",
    name: "Dashboard",
    desc: "Admin shell with charts, tables and filters.",
    framework: "Vite / React",
  },
  {
    id: "ecommerce",
    name: "Ecommerce",
    desc: "Catalog, product detail and cart flow.",
    framework: "Next.js",
  },
];

export const SAMPLE_PROJECTS: Project[] = [
  {
    id: "sample-acme",
    name: "acme-storefront",
    prompt: "Ecommerce store for handmade ceramics",
    template: "ecommerce",
    framework: "Next.js",
    status: "errors",
    errorCount: 4,
    updatedAt: "2026-10-10T18:20:00Z",
    isSample: true,
  },
  {
    id: "sample-pulse",
    name: "pulse-analytics",
    prompt: "SaaS analytics dashboard with charts",
    template: "dashboard",
    framework: "Vite / React",
    status: "healthy",
    errorCount: 0,
    updatedAt: "2026-10-09T09:05:00Z",
    isSample: true,
  },
  {
    id: "sample-folio",
    name: "mira-portfolio",
    prompt: "Minimal photographer portfolio",
    template: "portfolio",
    framework: "Vite / React",
    status: "draft",
    errorCount: 0,
    updatedAt: "2026-10-07T14:40:00Z",
    isSample: true,
  },
];

export const SAMPLE_FILES: ProjectFile[] = [
  {
    path: "src/App.tsx",
    language: "tsx",
    content: `import { useState } from "react";
import { ProductCard } from "./components/ProductCard";
import { formatPrice } from "./lib/format";

export default function App() {
  const [cart, setCart] = useState<string[]>([]);
  const products = useProducts();

  return (
    <main className="grid gap-6 p-8">
      <h1>Acme Ceramics</h1>
      {products.map((p) => (
        <ProductCard key={p.id} product={p} onAdd={() => setCart([...cart, p.id])} />
      ))}
      <p>Total: {formatPrice(cart.length * 24)}</p>
    </main>
  );
}`,
  },
  {
    path: "src/components/ProductCard.tsx",
    language: "tsx",
    content: `interface Props {
  product: { id: string; name: string; price: number };
  onAdd: () => void;
}

export function ProductCard({ product, onAdd }: Props) {
  return (
    <article className="rounded-lg border p-4">
      <h2>{product.title}</h2>
      <button onClick={onAdd}>Add to cart</button>
    </article>
  );
}`,
  },
  {
    path: "src/lib/format.ts",
    language: "ts",
    content: `export const formatPrice = (cents: number) =>
  new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" })
    .format(cents / 100);`,
  },
  {
    path: "package.json",
    language: "json",
    content: `{
  "name": "acme-storefront",
  "private": true,
  "scripts": { "dev": "next dev", "build": "next build" },
  "dependencies": { "next": "15.0.0", "react": "19.0.0" }
}`,
  },
  {
    path: "README.md",
    language: "md",
    content: `# acme-storefront
Sample project used by DevPilot AI demo mode.`,
  },
];

export const SAMPLE_ERRORS: DetectedError[] = [
  {
    id: "e1",
    file: "src/App.tsx",
    line: 7,
    message: "TS2304: Cannot find name 'useProducts'.",
    rootCause: "Missing hook import",
  },
  {
    id: "e2",
    file: "src/components/ProductCard.tsx",
    line: 9,
    message: "TS2339: Property 'title' does not exist on type '{ id; name; price }'.",
    rootCause: "Prop shape mismatch",
  },
  {
    id: "e3",
    file: "src/App.tsx",
    line: 15,
    message: "Price shown as $0.24 — dollars passed where cents expected.",
    rootCause: "Unit mismatch (cents vs dollars)",
  },
  {
    id: "e4",
    file: "next.config.js",
    line: 0,
    message: "Build env NEXT_PUBLIC_STRIPE_KEY is undefined.",
    rootCause: "Missing environment variable",
  },
];

export const SAMPLE_PATCH: PatchHunk[] = [
  {
    file: "src/App.tsx",
    before: [
      'import { formatPrice } from "./lib/format";',
      "",
      "      <p>Total: {formatPrice(cart.length * 24)}</p>",
    ],
    after: [
      'import { formatPrice } from "./lib/format";',
      'import { useProducts } from "./hooks/useProducts";',
      "      <p>Total: {formatPrice(cart.length * 2400)}</p>",
    ],
  },
  {
    file: "src/components/ProductCard.tsx",
    before: ["      <h2>{product.title}</h2>"],
    after: ["      <h2>{product.name}</h2>"],
  },
  {
    file: "src/hooks/useProducts.ts (new)",
    before: [],
    after: [
      "export function useProducts() {",
      '  return [{ id: "mug", name: "Stoneware mug", price: 2400 }];',
      "}",
    ],
  },
];

/** Blockers the simulated fixer cannot resolve on its own. */
export const SAMPLE_BLOCKERS = [
  {
    id: "e4",
    title: "Missing environment variable NEXT_PUBLIC_STRIPE_KEY",
    detail:
      "A secret value must be provided by you in project settings. DevPilot will never invent credentials.",
  },
];

export const PROVIDERS: DeployProvider[] = [
  {
    id: "vercel",
    name: "Vercel",
    category: "Static / Jamstack",
    supports: ["Next.js", "Vite", "Static"],
    authMethod: "OAuth",
    state: "not_connected",
  },
  {
    id: "netlify",
    name: "Netlify",
    category: "Static / Jamstack",
    supports: ["Vite", "Next.js", "Static"],
    authMethod: "OAuth",
    state: "not_connected",
  },
  {
    id: "cloudflare",
    name: "Cloudflare Pages",
    category: "Static / Jamstack",
    supports: ["Vite", "Static", "Next.js (edge)"],
    authMethod: "API token",
    state: "not_connected",
  },
  {
    id: "ghpages",
    name: "GitHub Pages",
    category: "Static / Jamstack",
    supports: ["Static", "Vite (SPA)"],
    authMethod: "OAuth",
    state: "not_connected",
  },
  {
    id: "firebase",
    name: "Firebase Hosting",
    category: "Static / Jamstack",
    supports: ["Static", "Vite"],
    authMethod: "Service account",
    state: "not_connected",
  },
  {
    id: "render",
    name: "Render",
    category: "Full-stack PaaS",
    supports: ["Node", "Docker", "Static"],
    authMethod: "API token",
    state: "not_connected",
  },
  {
    id: "railway",
    name: "Railway",
    category: "Full-stack PaaS",
    supports: ["Node", "Docker"],
    authMethod: "API token",
    state: "not_connected",
  },
  {
    id: "aws",
    name: "AWS",
    category: "Cloud",
    supports: ["Amplify", "S3 + CloudFront", "ECS"],
    authMethod: "Service account",
    state: "not_connected",
  },
  {
    id: "gcp",
    name: "Google Cloud",
    category: "Cloud",
    supports: ["Cloud Run", "Firebase"],
    authMethod: "Service account",
    state: "not_connected",
  },
  {
    id: "azure",
    name: "Azure",
    category: "Cloud",
    supports: ["Static Web Apps", "App Service"],
    authMethod: "Service account",
    state: "not_connected",
  },
  {
    id: "do",
    name: "DigitalOcean",
    category: "Cloud",
    supports: ["App Platform", "Droplets"],
    authMethod: "API token",
    state: "not_connected",
  },
  {
    id: "docker",
    name: "Self-hosted (Docker/SSH)",
    category: "Self-hosted",
    supports: ["Docker", "Node", "Static"],
    authMethod: "SSH key",
    state: "not_connected",
  },
];

export const PLANS = [
  {
    id: "free",
    name: "Free",
    monthly: 0,
    yearly: 0,
    blurb: "Explore the workspace.",
    features: ["3 projects", "20 AI fix runs / month", "Community support"],
  },
  {
    id: "pro",
    name: "Pro",
    monthly: 24,
    yearly: 19,
    blurb: "For individual builders.",
    features: [
      "Unlimited projects",
      "500 AI fix runs / month",
      "Isolated sandbox checks",
      "All deploy providers",
    ],
    highlight: true,
  },
  {
    id: "team",
    name: "Team",
    monthly: 49,
    yearly: 39,
    blurb: "Per seat, for small teams.",
    features: ["Everything in Pro", "Shared workspaces", "Role-based access", "Audit log"],
  },
] as const;

export const DEMO_USAGE = {
  fixRuns: 7,
  fixRunsLimit: 20,
  sandboxMinutes: 0,
  sandboxLimit: 60,
  projects: 3,
  projectsLimit: 3,
};
