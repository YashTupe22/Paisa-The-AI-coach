import { createFileRoute } from "@tanstack/react-router";
export const Route = createFileRoute("/_authenticated/goals")({ component: () => <div className="p-8"><h1 className="heading-section">Goals</h1><p className="mt-2 text-sm text-muted">Coming soon.</p></div> });
