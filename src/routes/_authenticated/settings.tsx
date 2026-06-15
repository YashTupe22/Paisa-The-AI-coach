import { createFileRoute } from "@tanstack/react-router";
export const Route = createFileRoute("/_authenticated/settings")({ component: () => <div className="p-8"><h1 className="heading-section">Settings</h1><p className="mt-2 text-sm text-muted">Coming soon.</p></div> });
