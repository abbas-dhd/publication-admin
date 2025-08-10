import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_app/published-manuscripts/")({
  component: RouteComponent,
});

function RouteComponent() {
  return <div>Hello "/published-manuscripts/"!</div>;
}
