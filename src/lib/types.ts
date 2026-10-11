// Domain types. Shaped so real adapters (AI, sandbox, deploy) can slot in later.

export type ProjectStatus = "draft" | "healthy" | "errors" | "deploying-blocked";
export type TemplateId = "react-app" | "portfolio" | "landing" | "dashboard" | "ecommerce" | "blank";

export interface Project {
  id: string;
  name: string;
  prompt: string;
  template: TemplateId;
  framework: string;
  status: ProjectStatus;
  errorCount: number;
  updatedAt: string; // ISO
  isSample: boolean;
}

export interface ProjectFile {
  path: string;
  language: "tsx" | "ts" | "css" | "json" | "md";
  content: string;
}

export interface DetectedError {
  id: string;
  file: string;
  line: number;
  message: string;
  rootCause: string;
}

export interface PatchHunk {
  file: string;
  before: string[];
  after: string[];
}

export type FixStage = "scan" | "group" | "propose" | "checks" | "verify";

/** Integration lifecycle. Only a real server adapter may ever set "connected". */
export type IntegrationState = "not_connected" | "adapter_missing" | "connected";

export interface DeployProvider {
  id: string;
  name: string;
  category: "Static / Jamstack" | "Full-stack PaaS" | "Cloud" | "Self-hosted";
  supports: string[];
  authMethod: "OAuth" | "API token" | "Service account" | "SSH key";
  state: IntegrationState;
}
