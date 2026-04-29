// Opsette Header — per-app configuration for Job Math.
// See ../../../_shared/opsette-header/INTEGRATION.md.

import type { OpsetteHeaderConfig } from "./config.template";

export type { OpsetteHeaderConfig };

export const opsetteHeaderConfig: OpsetteHeaderConfig = {
  toolName: "Job Math",
  brandIconPaths: `
    <rect x="80" y="64" width="96" height="48" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="16"/>
    <rect x="32" y="48" width="192" height="160" rx="8" transform="translate(256) rotate(90)" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="16"/>
    <circle cx="88" cy="148" r="12" fill="currentColor"/>
    <circle cx="128" cy="148" r="12" fill="currentColor"/>
    <circle cx="168" cy="148" r="12" fill="currentColor"/>
    <circle cx="88" cy="188" r="12" fill="currentColor"/>
    <circle cx="128" cy="188" r="12" fill="currentColor"/>
    <circle cx="168" cy="188" r="12" fill="currentColor"/>
  `,
};
