import { createFileRoute } from "@tanstack/react-router";
export const Route = createFileRoute("/_authenticated/transactions")({ component: () => <Stub title="Transactions" /> });
function Stub({ title }: { title: string }) {
  return <div className="p-8"><h1 className="heading-section">{title}</h1><p className="mt-2 text-sm text-muted">Coming soon in the next build pass.</p></div>;
}
