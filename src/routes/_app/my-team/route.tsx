import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_app/my-team")({
  loader: () => ({
    crumb: "My Team",
  }),
});
